import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithClaude } from '@/lib/claude/client'
import { getLogSystemPrompt, getSession1Prompt, getSessionNPrompt } from '@/lib/claude/prompts/log'
import { DIAGNOSIS_AREAS } from '@/lib/constants/diagnosis-items'
import { calculateDiagnosis } from '@/lib/scoring'

const SESSION_AREAS: Record<number, string> = {
  2: 'strategy', 3: 'organization', 4: 'people', 5: 'culture',
  6: 'data', 7: 'infrastructure', 8: 'governance'
}

const AREA_NAMES: Record<string, string> = {
  strategy: '전략', organization: '조직', people: '인재', culture: '문화',
  data: '데이터', infrastructure: '인프라', governance: '거버넌스'
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, companyName, sessionNumber } = await req.json()
    const supabase = await createClient()

    if (sessionNumber === 1) {
      // Session 1: Based on Form 1 diagnosis scores
      const { data: scores } = await supabase
        .from('innobiz_diagnosis_scores')
        .select('*')
        .eq('company_id', companyId)

      if (!scores || scores.length === 0) {
        return NextResponse.json({ error: '서식1 진단 점수를 먼저 입력해주세요.' }, { status: 400 })
      }

      const result = calculateDiagnosis(scores)
      const diagnosisData = result.areaScores.map(a =>
        `- ${a.name}: 평균 ${a.average.toFixed(2)}점 (${a.scoredCount}/${a.itemCount} 문항)`
      ).join('\n') + `\n\n전체 평균: ${result.totalAverage.toFixed(2)} / 5.0\n100점 환산: ${result.score100.toFixed(1)}점 → Lv${result.level} ${result.levelName}`

      const content = await generateWithClaude(
        getLogSystemPrompt(),
        getSession1Prompt(companyName, diagnosisData)
      )

      return NextResponse.json({ content })
    } else {
      // Sessions 2-8: Based on interview data for specific area
      const area = SESSION_AREAS[sessionNumber]
      if (!area) {
        return NextResponse.json({ error: '유효하지 않은 회차입니다.' }, { status: 400 })
      }

      const { data: interviews } = await supabase
        .from('innobiz_interviews')
        .select('*')
        .eq('company_id', companyId)
        .eq('area', area)

      const { data: workflows } = await supabase
        .from('innobiz_workflow_redesigns')
        .select('*')
        .eq('company_id', companyId)

      const interviewData = interviews && interviews.length > 0
        ? interviews.map((iv: any) => `Q: ${iv.question}\nA: ${iv.answer || '(미응답)'}`).join('\n\n')
        : '(해당 영역 인터뷰 데이터 없음)'

      const workflowData = workflows && workflows.length > 0
        ? workflows.map((wf: any) =>
            `부서: ${wf.department}, 직무: ${wf.job_title}\n` +
            (wf.duties || []).map((d: any) => `  - 책무: ${d.duty}\n    As-is: ${d.as_is}\n    To-be: ${d.to_be}\n    필요 교육훈련: ${d.required_training}`).join('\n')
          ).join('\n\n')
        : '(워크플로우 재설계 데이터 없음)'

      const content = await generateWithClaude(
        getLogSystemPrompt(),
        getSessionNPrompt(companyName, sessionNumber, AREA_NAMES[area], interviewData, workflowData)
      )

      return NextResponse.json({ content })
    }
  } catch (error: any) {
    console.error('Generate log error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
