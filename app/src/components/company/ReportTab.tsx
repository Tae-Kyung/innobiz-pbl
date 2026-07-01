'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import type { ConsultingReport } from '@/lib/supabase/types'
import { Loader2, Sparkles, Eye, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const REPORT_SECTIONS = [
  { key: 'survey_analysis', label: '설문 결과 분석' },
  { key: 'key_issues', label: '핵심 과제 도출' },
  { key: 'recommended_courses', label: '추천 AI훈련과정' },
  { key: 'priorities', label: '우선순위 과제' },
  { key: 'appendix1', label: '[붙임1] 영역별 설문 결과' },
  { key: 'appendix2', label: '[붙임2] 인터뷰 결과' },
  { key: 'appendix3', label: '[붙임3] 워크플로우 재설계' },
]

export function ReportTab({ companyId, companyName }: { companyId: string; companyName: string }) {
  const [report, setReport] = useState<Record<string, string>>({})
  const [reportDate, setReportDate] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    loadReport()
  }, [companyId])

  async function loadReport() {
    const supabase = createClient()
    const { data } = await supabase
      .from('innobiz_consulting_reports')
      .select('*')
      .eq('company_id', companyId)
      .single()

    if (data) {
      setReport(data.content || {})
      setReportDate(data.report_date || '')
    }
  }

  function updateSection(key: string, value: string) {
    setReport(prev => ({ ...prev, [key]: value }))
  }

  async function generateSection(section: string) {
    setGenerating(section)
    try {
      const res = await fetch('/api/generate/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, companyName, section })
      })
      const data = await res.json()
      if (data.content) {
        updateSection(section, data.content)
      } else if (data.error) {
        alert('생성 실패: ' + data.error)
      }
    } catch (err: any) {
      alert('생성 실패: ' + err.message)
    }
    setGenerating(null)
  }

  async function generateAll() {
    setGeneratingAll(true)
    for (const section of REPORT_SECTIONS) {
      await generateSection(section.key)
    }
    setGeneratingAll(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    await supabase.from('innobiz_consulting_reports').upsert({
      company_id: companyId,
      report_date: reportDate || null,
      content: report,
      is_generated: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'company_id' })

    await supabase.from('innobiz_companies').update({ status: 'planning', updated_at: new Date().toISOString() }).eq('id', companyId)
    alert('저장되었습니다.')
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서식4 - AX 진단 컨설팅 결과보고서</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm">보고서 날짜:</Label>
            <Input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-40" />
          </div>
          <Button variant="outline" onClick={generateAll} disabled={generatingAll}>
            {generatingAll ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> 전체 생성중...</> : <><Sparkles className="h-4 w-4 mr-1" /> 전체 AI 생성</>}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="survey_analysis">
        <TabsList className="flex-wrap">
          {REPORT_SECTIONS.map(s => (
            <TabsTrigger key={s.key} value={s.key} className="text-xs">
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {REPORT_SECTIONS.map(section => (
          <TabsContent key={section.key} value={section.key}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateSection(section.key)}
                      disabled={generating === section.key}
                    >
                      {generating === section.key ? (
                        <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> 생성중...</>
                      ) : (
                        <><Sparkles className="h-3 w-3 mr-1" /> AI 생성</>
                      )}
                    </Button>
                    {report[section.key] && (
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
                {report[section.key] && editingSection !== section.key ? (
                  <div className="prose prose-sm max-w-none border rounded-md p-4 min-h-[200px] bg-muted/20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{report[section.key]}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={report[section.key] || ''}
                    onChange={e => updateSection(section.key, e.target.value)}
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
