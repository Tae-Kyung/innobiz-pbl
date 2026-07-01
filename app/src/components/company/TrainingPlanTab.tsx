'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Sparkles, Eye, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const PLAN_SECTIONS = [
  { key: 'consulting_overview', label: 'II. 컨설팅 개요' },
  { key: 'needs_analysis', label: 'III. 훈련 요구분석' },
  { key: 'curriculum_profile', label: '훈련 교과목 프로파일' },
  { key: 'evaluation_plan', label: '평가 계획' },
]

export function TrainingPlanTab({ companyId, companyName }: { companyId: string; companyName: string }) {
  const [plan, setPlan] = useState<any>({
    course_name: '', ncs_code: '', training_hours: '', trainee_count: '',
    training_job: '', training_goal: '', training_period_start: '', training_period_end: '',
    content: {}
  })
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    loadPlan()
  }, [companyId])

  async function loadPlan() {
    const supabase = createClient()
    const { data } = await supabase.from('innobiz_training_plans').select('*').eq('company_id', companyId).single()
    if (data) setPlan(data)
  }

  function updateField(field: string, value: any) {
    setPlan((prev: any) => ({ ...prev, [field]: value }))
  }

  function updateContent(key: string, value: string) {
    setPlan((prev: any) => ({ ...prev, content: { ...prev.content, [key]: value } }))
  }

  async function generateSection(section: string) {
    setGenerating(section)
    try {
      const res = await fetch('/api/generate/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, companyName, section, courseName: plan.course_name, trainingHours: plan.training_hours })
      })
      const data = await res.json()
      if (data.content) updateContent(section, data.content)
      else if (data.error) alert('생성 실패: ' + data.error)
    } catch (err: any) {
      alert('생성 실패: ' + err.message)
    }
    setGenerating(null)
  }

  async function generateAll() {
    setGeneratingAll(true)
    for (const section of PLAN_SECTIONS) {
      await generateSection(section.key)
    }
    setGeneratingAll(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('innobiz_training_plans').upsert({
      company_id: companyId,
      course_name: plan.course_name || null,
      ncs_code: plan.ncs_code || null,
      training_hours: plan.training_hours ? parseInt(plan.training_hours) : null,
      trainee_count: plan.trainee_count ? parseInt(plan.trainee_count) : null,
      training_job: plan.training_job || null,
      training_goal: plan.training_goal || null,
      training_period_start: plan.training_period_start || null,
      training_period_end: plan.training_period_end || null,
      content: plan.content || {},
      is_generated: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'company_id' })

    await supabase.from('innobiz_companies').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', companyId)
    alert('저장되었습니다.')
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서식5 - PBL 훈련 운영계획서</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={generateAll} disabled={generatingAll || generating !== null}>
            {generatingAll ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> 전체 생성중...</> : <><Sparkles className="h-4 w-4 mr-1" /> 전체 AI 생성</>}
          </Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">I. 훈련과정 개요</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>훈련과정명</Label><Input value={plan.course_name || ''} onChange={e => updateField('course_name', e.target.value)} /></div>
            <div><Label>NCS 분류</Label><Input value={plan.ncs_code || ''} onChange={e => updateField('ncs_code', e.target.value)} placeholder="예: 200107 인공지능" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>훈련시간</Label><Input type="number" value={plan.training_hours || ''} onChange={e => updateField('training_hours', e.target.value)} /></div>
            <div><Label>훈련생 수</Label><Input type="number" value={plan.trainee_count || ''} onChange={e => updateField('trainee_count', e.target.value)} /></div>
            <div><Label>훈련 직무</Label><Input value={plan.training_job || ''} onChange={e => updateField('training_job', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>훈련기간 시작</Label><Input type="date" value={plan.training_period_start || ''} onChange={e => updateField('training_period_start', e.target.value)} /></div>
            <div><Label>훈련기간 종료</Label><Input type="date" value={plan.training_period_end || ''} onChange={e => updateField('training_period_end', e.target.value)} /></div>
          </div>
          <div><Label>훈련 목표</Label><Textarea value={plan.training_goal || ''} onChange={e => updateField('training_goal', e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>

      <Tabs defaultValue="consulting_overview">
        <TabsList>
          {PLAN_SECTIONS.map(s => <TabsTrigger key={s.key} value={s.key} className="text-xs">{s.label}</TabsTrigger>)}
        </TabsList>
        {PLAN_SECTIONS.map(section => (
          <TabsContent key={section.key} value={section.key}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => generateSection(section.key)} disabled={generating === section.key}>
                      {generating === section.key ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> 생성중...</> : <><Sparkles className="h-3 w-3 mr-1" /> AI 생성</>}
                    </Button>
                    {plan.content?.[section.key] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSection(editingSection === section.key ? null : section.key)}
                      >
                        {editingSection === section.key ? (
                          <><Eye className="h-3 w-3 mr-1" /> 미리보기</>
                        ) : (
                          <><Pencil className="h-3 w-3 mr-1" /> 편집</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plan.content?.[section.key] && editingSection !== section.key ? (
                  <div className="prose prose-sm max-w-none border rounded-md p-4 min-h-[200px] bg-muted/20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan.content[section.key]}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={plan.content?.[section.key] || ''}
                    onChange={e => updateContent(section.key, e.target.value)}
                    rows={20}
                    placeholder="AI 생성 버튼을 클릭하거나 직접 작성하세요..."
                    className="font-mono text-sm"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
