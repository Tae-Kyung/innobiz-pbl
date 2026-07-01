import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithClaude } from '@/lib/claude/client'
import { getTrainingSystemPrompt, getTrainingNeedsPrompt, getTrainingCurriculumPrompt } from '@/lib/claude/prompts/training'

export async function POST(req: NextRequest) {
  try {
    const { companyId, companyName, section, courseName, trainingHours } = await req.json()
    const supabase = await createClient()

    const { data: company } = await supabase.from('innobiz_companies').select('*').eq('id', companyId).single()
    const { data: report } = await supabase.from('innobiz_consulting_reports').select('*').eq('company_id', companyId).single()
    const { data: workflows } = await supabase.from('innobiz_workflow_redesigns').select('*').eq('company_id', companyId)
    const { data: logs } = await supabase.from('innobiz_consulting_logs').select('*').eq('company_id', companyId).order('session_number')

    const systemPrompt = getTrainingSystemPrompt()
    let content = ''

    const companyInfo = company ? `기업명: ${company.name}\n업종: ${company.industry}\n제품/서비스: ${company.main_products}` : ''
    const workflowData = workflows ? workflows.map((wf: any) =>
      `부서: ${wf.department}, 직무: ${wf.job_title}\n` +
      (wf.duties || []).map((d: any) => `  책무: ${d.duty} | As-is: ${d.as_is} | To-be: ${d.to_be} | 필요교육: ${d.required_training}`).join('\n')
    ).join('\n\n') : ''

    if (section === 'consulting_overview') {
      const logsData = logs ? logs.map((l: any) => `${l.session_number}차: ${l.meeting_date || ''} - ${l.diagnosis_area || ''}`).join('\n') : ''
      content = await generateWithClaude(systemPrompt,
        `[기업명] ${companyName}\n\n[컨설팅 수행 이력]\n${logsData}\n\n서식5의 "II. 컨설팅 개요" 섹션을 작성해주세요.\n1. 과정개발 필요성\n2. 과정개발 주요 활동 (수행일지 기반)\n3. 과정개발 주요 결과`)
    } else if (section === 'needs_analysis') {
      const reportSummary = report?.content ? Object.values(report.content).join('\n\n---\n\n').substring(0, 3000) : ''
      content = await generateWithClaude(systemPrompt, getTrainingNeedsPrompt(companyName, companyInfo, reportSummary, workflowData))
    } else if (section === 'curriculum_profile') {
      content = await generateWithClaude(systemPrompt, getTrainingCurriculumPrompt(companyName, courseName || '(미정)', workflowData, trainingHours || 40))
    } else if (section === 'evaluation_plan') {
      content = await generateWithClaude(systemPrompt,
        `[기업명] ${companyName}\n[훈련과정명] ${courseName || '(미정)'}\n\n서식5의 평가 계획을 작성해주세요.\n\n포함항목:\n1. 과정평가 계획 (포트폴리오/문제해결시나리오)\n   - 업무(단원)명별 평가기준\n   - 수행수준 1~5 척도\n2. 결과평가 계획\n   - 만족도 및 성취도 조사 항목\n   - 현업적용도 조사 항목`)
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Generate training error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
