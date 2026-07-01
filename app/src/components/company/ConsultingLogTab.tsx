'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { createClient } from '@/lib/supabase/client'
import type { ConsultingLog } from '@/lib/supabase/types'
import { Loader2, Sparkles, Eye, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SESSION_LABELS: Record<number, string> = {
  1: '서식1 검증',
  2: '전략',
  3: '조직',
  4: '인재',
  5: '문화',
  6: '데이터',
  7: '인프라',
  8: '거버넌스',
}

export function ConsultingLogTab({ companyId, companyName }: { companyId: string; companyName: string }) {
  const [logs, setLogs] = useState<ConsultingLog[]>([])
  const [generating, setGenerating] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [editingSession, setEditingSession] = useState<number | null>(null)

  useEffect(() => {
    loadLogs()
  }, [companyId])

  async function loadLogs() {
    const supabase = createClient()
    const { data } = await supabase
      .from('innobiz_consulting_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('session_number')

    // Initialize all 8 sessions
    const existing = data || []
    const allLogs: ConsultingLog[] = Array.from({ length: 8 }, (_, i) => {
      const found = existing.find((l: ConsultingLog) => l.session_number === i + 1)
      return found || {
        id: '',
        company_id: companyId,
        session_number: i + 1,
        meeting_date: null,
        meeting_method: 'face_to_face',
        meeting_location: null,
        attendees: { pm: '', hrd: '', internal: '', center: '' },
        diagnosis_area: SESSION_LABELS[i + 1] || '',
        content: null,
        is_generated: false,
        created_at: '',
        updated_at: '',
      }
    })
    setLogs(allLogs)
  }

  function updateLog(sessionNum: number, field: string, value: any) {
    setLogs(prev => prev.map(l => l.session_number === sessionNum ? { ...l, [field]: value } : l))
  }

  function updateAttendee(sessionNum: number, role: string, name: string) {
    setLogs(prev => prev.map(l => l.session_number === sessionNum ? {
      ...l,
      attendees: { ...(l.attendees as any), [role]: name }
    } : l))
  }

  async function generateLog(sessionNumber: number) {
    setGenerating(sessionNumber)
    try {
      const res = await fetch('/api/generate/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, companyName, sessionNumber })
      })
      const data = await res.json()
      if (data.content) {
        updateLog(sessionNumber, 'content', data.content)
        updateLog(sessionNumber, 'is_generated', true)
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
    for (let i = 1; i <= 8; i++) {
      await generateLog(i)
    }
    setGeneratingAll(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    for (const log of logs) {
      if (log.content || log.meeting_date) {
        await supabase.from('innobiz_consulting_logs').upsert({
          company_id: companyId,
          session_number: log.session_number,
          meeting_date: log.meeting_date,
          meeting_method: log.meeting_method,
          meeting_location: log.meeting_location,
          attendees: log.attendees,
          diagnosis_area: log.diagnosis_area,
          content: log.content,
          is_generated: log.is_generated,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'company_id,session_number' })
      }
    }

    await supabase.from('innobiz_companies').update({ status: 'reporting', updated_at: new Date().toISOString() }).eq('id', companyId)
    alert('저장되었습니다.')
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서식3 - 컨설팅 수행일지 (8회차)</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={generateAll} disabled={generatingAll || generating !== null}>
            {generatingAll ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> 전체 생성중 ({generating}차시)...</> : <><Sparkles className="h-4 w-4 mr-1" /> 전체 AI 생성</>}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '전체 저장'}
          </Button>
        </div>
      </div>

      <Accordion>
        {logs.map(log => (
          <AccordionItem key={log.session_number} value={`session-${log.session_number}`}>
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{log.session_number}차시</span>
                <span className="text-muted-foreground">[{SESSION_LABELS[log.session_number]}]</span>
                {log.content && <Badge variant="secondary" className="text-xs">작성완료</Badge>}
                {log.is_generated && <Badge variant="outline" className="text-xs">AI생성</Badge>}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>회의일시</Label>
                    <Input type="date" value={log.meeting_date || ''} onChange={e => updateLog(log.session_number, 'meeting_date', e.target.value)} />
                  </div>
                  <div>
                    <Label>회의방법</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={log.meeting_method}
                      onChange={e => updateLog(log.session_number, 'meeting_method', e.target.value)}
                    >
                      <option value="face_to_face">대면</option>
                      <option value="online">비대면</option>
                    </select>
                  </div>
                  <div>
                    <Label>회의장소</Label>
                    <Input value={log.meeting_location || ''} onChange={e => updateLog(log.session_number, 'meeting_location', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>컨설팅책임자(PM)</Label>
                    <Input value={(log.attendees as any)?.pm || ''} onChange={e => updateAttendee(log.session_number, 'pm', e.target.value)} />
                  </div>
                  <div>
                    <Label>기업 내부전문가</Label>
                    <Input value={(log.attendees as any)?.internal || ''} onChange={e => updateAttendee(log.session_number, 'internal', e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Label>회의내용</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateLog(log.session_number)}
                    disabled={generating === log.session_number}
                  >
                    {generating === log.session_number ? (
                      <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> 생성중...</>
                    ) : (
                      <><Sparkles className="h-3 w-3 mr-1" /> AI 생성</>
                    )}
                  </Button>
                  {log.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSession(editingSession === log.session_number ? null : log.session_number)}
                    >
                      {editingSession === log.session_number ? (
                        <><Eye className="h-3 w-3 mr-1" /> 미리보기</>
                      ) : (
                        <><Pencil className="h-3 w-3 mr-1" /> 편집</>
                      )}
                    </Button>
                  )}
                </div>
                {log.content && editingSession !== log.session_number ? (
                  <div className="prose prose-sm max-w-none border rounded-md p-4 min-h-[200px] bg-muted/20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{log.content}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={log.content || ''}
                    onChange={e => updateLog(log.session_number, 'content', e.target.value)}
                    rows={12}
                    placeholder="회의내용을 입력하거나 AI 생성 버튼을 클릭하세요..."
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
