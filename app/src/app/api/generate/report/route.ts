import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithClaude } from '@/lib/claude/client'
import { getReportSystemPrompt, getReportSurveyPrompt, getReportInterviewPrompt, getReportTrainingPrompt, getReportPrioritiesPrompt } from '@/lib/claude/prompts/report'
import { calculateDiagnosis } from '@/lib/scoring'

export async function POST(req: NextRequest) {
  try {
    const { companyId, companyName, section } = await req.json()
    const supabase = await createClient()

    // Load all data
    const { data: scores } = await supabase.from('innobiz_diagnosis_scores').select('*').eq('company_id', companyId)
    const { data: interviews } = await supabase.from('innobiz_interviews').select('*').eq('company_id', companyId).order('area,sort_order')
    const { data: workflows } = await supabase.from('innobiz_workflow_redesigns').select('*').eq('company_id', companyId)

    const result = scores ? calculateDiagnosis(scores) : null

    let content = ''
    const systemPrompt = getReportSystemPrompt()

    if (section === 'survey_analysis' || section === 'appendix1') {
      if (!result) return NextResponse.json({ error: '서식1 진단 점수를 먼저 입력해주세요.' }, { status: 400 })
      const diagnosisData = result.areaScores.map(a => `${a.name}: ${a.average.toFixed(2)}점`).join('\n')
      content = await generateWithClaude(systemPrompt, getReportSurveyPrompt(companyName, diagnosisData, result.level, result.levelName, result.score100))
    } else if (section === 'key_issues' || section === 'appendix2') {
      const interviewData = interviews ? interviews.map((iv: any) => `[${iv.area}] Q: ${iv.question}\nA: ${iv.answer || '(미응답)'}`).join('\n\n') : '(인터뷰 데이터 없음)'
      content = await generateWithClaude(systemPrompt, getReportInterviewPrompt(companyName, interviewData))
    } else if (section === 'recommended_courses' || section === 'appendix3') {
      const workflowData = workflows ? workflows.map((wf: any) =>
        `부서: ${wf.department}, 직무: ${wf.job_title}\n` +
        (wf.duties || []).map((d: any) => `책무: ${d.duty} | As-is: ${d.as_is} | To-be: ${d.to_be} | 필요교육: ${d.required_training}`).join('\n') +
        `\n기대효과: ${(wf.expected_effects || []).join(', ')}`
      ).join('\n\n') : '(워크플로우 데이터 없음)'
      const interviewSummary = interviews ? interviews.filter((iv: any) => iv.answer).map((iv: any) => `[${iv.area}] ${iv.question}: ${iv.answer}`).join('\n') : ''
      content = await generateWithClaude(systemPrompt, getReportTrainingPrompt(companyName, workflowData, interviewSummary))
    } else if (section === 'priorities') {
      if (!result) return NextResponse.json({ error: '서식1 진단 점수를 먼저 입력해주세요.' }, { status: 400 })
      const areaScoresData = result.areaScores.map(a => `${a.name}: ${a.average.toFixed(2)}점`).join('\n')
      content = await generateWithClaude(systemPrompt, getReportPrioritiesPrompt(companyName, result.score100, result.level, result.levelName, areaScoresData))
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Generate report error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
