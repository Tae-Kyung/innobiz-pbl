'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { INTERVIEW_QUESTIONS } from '@/lib/constants/interview-questions'
import type { Interview, WorkflowRedesign } from '@/lib/supabase/types'
import { Plus, Trash2 } from 'lucide-react'

export function InterviewTab({ companyId }: { companyId: string }) {
  const [interviews, setInterviews] = useState<Record<string, Array<{ question: string; answer: string; questionId: string }>>>({})
  const [workflows, setWorkflows] = useState<WorkflowRedesign[]>([])
  const [saving, setSaving] = useState(false)
  const [interviewMeta, setInterviewMeta] = useState({ date: '', location: '', attendees: '' })

  useEffect(() => {
    loadData()
  }, [companyId])

  async function loadData() {
    const supabase = createClient()
    const { data: ivData } = await supabase.from('innobiz_interviews').select('*').eq('company_id', companyId).order('sort_order')
    const { data: wfData } = await supabase.from('innobiz_workflow_redesigns').select('*').eq('company_id', companyId).order('sort_order')

    if (ivData && ivData.length > 0) {
      const grouped: Record<string, Array<{ question: string; answer: string; questionId: string }>> = {}
      ivData.forEach((iv: Interview) => {
        if (!grouped[iv.area]) grouped[iv.area] = []
        grouped[iv.area].push({ question: iv.question, answer: iv.answer || '', questionId: iv.id })
      })
      setInterviews(grouped)
      if (ivData[0].interview_date) setInterviewMeta(prev => ({ ...prev, date: ivData[0].interview_date || '' }))
      if (ivData[0].interview_location) setInterviewMeta(prev => ({ ...prev, location: ivData[0].interview_location || '' }))
    }
    if (wfData) setWorkflows(wfData)
  }

  function addQuestion(area: string, question: string) {
    setInterviews(prev => ({
      ...prev,
      [area]: [...(prev[area] || []), { question, answer: '', questionId: '' }]
    }))
  }

  function updateAnswer(area: string, index: number, answer: string) {
    setInterviews(prev => ({
      ...prev,
      [area]: prev[area].map((item, i) => i === index ? { ...item, answer } : item)
    }))
  }

  function removeQuestion(area: string, index: number) {
    setInterviews(prev => ({
      ...prev,
      [area]: prev[area].filter((_, i) => i !== index)
    }))
  }

  function addWorkflow() {
    setWorkflows(prev => [...prev, {
      id: crypto.randomUUID(),
      company_id: companyId,
      department: '',
      job_title: '',
      duties: [{ duty: '', as_is: '', to_be: '', required_training: '' }],
      expected_effects: [''],
      sort_order: prev.length,
      created_at: new Date().toISOString()
    }])
  }

  function updateWorkflow(index: number, field: string, value: any) {
    setWorkflows(prev => prev.map((wf, i) => i === index ? { ...wf, [field]: value } : wf))
  }

  function addDuty(wfIndex: number) {
    setWorkflows(prev => prev.map((wf, i) => i === wfIndex ? {
      ...wf,
      duties: [...wf.duties, { duty: '', as_is: '', to_be: '', required_training: '' }]
    } : wf))
  }

  function updateDuty(wfIndex: number, dutyIndex: number, field: string, value: string) {
    setWorkflows(prev => prev.map((wf, i) => i === wfIndex ? {
      ...wf,
      duties: wf.duties.map((d: any, j: number) => j === dutyIndex ? { ...d, [field]: value } : d)
    } : wf))
  }

  function removeWorkflow(index: number) {
    setWorkflows(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    // Delete existing and re-insert
    await supabase.from('innobiz_interviews').delete().eq('company_id', companyId)

    const ivRecords: any[] = []
    Object.entries(interviews).forEach(([area, items]) => {
      items.forEach((item, idx) => {
        if (item.question) {
          ivRecords.push({
            company_id: companyId,
            area,
            question_type: 'common',
            question: item.question,
            answer: item.answer || null,
            sort_order: idx,
            interview_date: interviewMeta.date || null,
            interview_location: interviewMeta.location || null,
          })
        }
      })
    })
    if (ivRecords.length > 0) {
      await supabase.from('innobiz_interviews').insert(ivRecords)
    }

    // Save workflows
    await supabase.from('innobiz_workflow_redesigns').delete().eq('company_id', companyId)
    const wfRecords = workflows.map((wf, idx) => ({
      company_id: companyId,
      department: wf.department,
      job_title: wf.job_title,
      duties: wf.duties,
      expected_effects: wf.expected_effects,
      sort_order: idx,
    }))
    if (wfRecords.length > 0) {
      await supabase.from('innobiz_workflow_redesigns').insert(wfRecords)
    }

    await supabase.from('innobiz_companies').update({ status: 'interviewing', updated_at: new Date().toISOString() }).eq('id', companyId)
    alert('저장되었습니다.')
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서식2 - AX 세부진단 (인터뷰)</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>

      <Tabs defaultValue="interviews">
        <TabsList>
          <TabsTrigger value="interviews">인터뷰</TabsTrigger>
          <TabsTrigger value="workflow">워크플로우 재설계</TabsTrigger>
        </TabsList>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">인터뷰 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>인터뷰 일시</Label>
                  <Input type="date" value={interviewMeta.date} onChange={e => setInterviewMeta(prev => ({ ...prev, date: e.target.value }))} />
                </div>
                <div>
                  <Label>인터뷰 장소</Label>
                  <Input value={interviewMeta.location} onChange={e => setInterviewMeta(prev => ({ ...prev, location: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion>
            {INTERVIEW_QUESTIONS.map(area => {
              const areaAnswers = interviews[area.area] || []
              const answeredCount = areaAnswers.filter(a => a.answer).length
              return (
                <AccordionItem key={area.area} value={area.area}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{area.name}</span>
                      {areaAnswers.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {answeredCount}/{areaAnswers.length} 답변
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      진단 포인트: {area.diagnosticPoint}
                    </p>

                    {/* Existing Q&A */}
                    {areaAnswers.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3 mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium flex-1">{item.question}</p>
                          <button onClick={() => removeQuestion(area.area, idx)} className="text-muted-foreground hover:text-red-500 ml-2">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <Textarea
                          placeholder="답변을 입력하세요..."
                          value={item.answer}
                          onChange={e => updateAnswer(area.area, idx, e.target.value)}
                          rows={3}
                        />
                      </div>
                    ))}

                    {/* Add question from pool */}
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">질문 추가:</p>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {area.questions
                          .filter(q => !areaAnswers.some(a => a.question === q.text))
                          .map(q => (
                            <button
                              key={q.id}
                              onClick={() => addQuestion(area.area, q.text)}
                              className="flex items-center gap-2 w-full text-left text-xs p-2 rounded hover:bg-muted"
                            >
                              <Plus className="h-3 w-3 shrink-0" />
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                {q.type === 'common' ? '공통' : q.type === 'low_ax' ? 'AX低' : 'AX高'}
                              </Badge>
                              <span className="truncate">{q.text}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          {workflows.map((wf, wfIdx) => (
            <Card key={wf.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">직무 {wfIdx + 1}</CardTitle>
                  <button onClick={() => removeWorkflow(wfIdx)} className="text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>관련 부서</Label>
                    <Input value={wf.department} onChange={e => updateWorkflow(wfIdx, 'department', e.target.value)} />
                  </div>
                  <div>
                    <Label>직무명</Label>
                    <Input value={wf.job_title} onChange={e => updateWorkflow(wfIdx, 'job_title', e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">책무별 As-is / To-be / 필요 교육훈련</Label>
                  {wf.duties.map((duty: any, dIdx: number) => (
                    <div key={dIdx} className="grid grid-cols-4 gap-2 mb-2">
                      <Input placeholder="책무" value={duty.duty} onChange={e => updateDuty(wfIdx, dIdx, 'duty', e.target.value)} />
                      <Input placeholder="As-is" value={duty.as_is} onChange={e => updateDuty(wfIdx, dIdx, 'as_is', e.target.value)} />
                      <Input placeholder="To-be" value={duty.to_be} onChange={e => updateDuty(wfIdx, dIdx, 'to_be', e.target.value)} />
                      <Input placeholder="필요 교육훈련" value={duty.required_training} onChange={e => updateDuty(wfIdx, dIdx, 'required_training', e.target.value)} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addDuty(wfIdx)}>
                    <Plus className="h-3 w-3 mr-1" /> 책무 추가
                  </Button>
                </div>

                <div>
                  <Label>기대효과</Label>
                  <Textarea
                    value={(wf.expected_effects || []).join('\n')}
                    onChange={e => updateWorkflow(wfIdx, 'expected_effects', e.target.value.split('\n').filter(Boolean))}
                    placeholder="기대효과를 한 줄씩 입력"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addWorkflow}>
            <Plus className="h-4 w-4 mr-2" /> 직무 추가
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
