'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createClient } from '@/lib/supabase/client'
import { DIAGNOSIS_AREAS } from '@/lib/constants/diagnosis-items'
import { calculateDiagnosis, AX_LEVELS } from '@/lib/scoring'
import type { DiagnosisScore } from '@/lib/supabase/types'
import { RadarChartView } from './RadarChartView'

export function DiagnosisTab({ companyId }: { companyId: string }) {
  const [scores, setScores] = useState<Record<string, Record<number, number>>>({})
  const [saving, setSaving] = useState(false)
  const [diagnosedAt, setDiagnosedAt] = useState('')

  useEffect(() => {
    loadScores()
  }, [companyId])

  async function loadScores() {
    const supabase = createClient()
    const { data } = await supabase
      .from('innobiz_diagnosis_scores')
      .select('*')
      .eq('company_id', companyId)

    if (data) {
      const grouped: Record<string, Record<number, number>> = {}
      data.forEach((s: DiagnosisScore) => {
        if (!grouped[s.area]) grouped[s.area] = {}
        grouped[s.area][s.item_index] = s.score
        if (s.diagnosed_at && !diagnosedAt) setDiagnosedAt(s.diagnosed_at)
      })
      setScores(grouped)
    }
  }

  function setScore(area: string, itemIndex: number, score: number) {
    setScores(prev => ({
      ...prev,
      [area]: { ...prev[area], [itemIndex]: score }
    }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const records: Array<{
      company_id: string; area: string; item_index: number; score: number; diagnosed_at: string | null
    }> = []

    Object.entries(scores).forEach(([area, items]) => {
      Object.entries(items).forEach(([idx, score]) => {
        records.push({
          company_id: companyId,
          area,
          item_index: parseInt(idx),
          score,
          diagnosed_at: diagnosedAt || null,
        })
      })
    })

    const { error } = await supabase
      .from('innobiz_diagnosis_scores')
      .upsert(records, { onConflict: 'company_id,area,item_index' })

    if (error) alert('저장 실패: ' + error.message)
    else {
      await supabase.from('innobiz_companies').update({ status: 'diagnosing', updated_at: new Date().toISOString() }).eq('id', companyId)
      alert('저장되었습니다.')
    }
    setSaving(false)
  }

  // Build DiagnosisScore array for calculation
  const scoreArray: DiagnosisScore[] = []
  Object.entries(scores).forEach(([area, items]) => {
    Object.entries(items).forEach(([idx, score]) => {
      scoreArray.push({
        id: '', company_id: companyId, area: area as any,
        item_index: parseInt(idx), score, diagnosed_at: null, created_at: ''
      })
    })
  })
  const result = calculateDiagnosis(scoreArray)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서식1 - AX 수준진단 점수 입력</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">진단일자:</label>
            <input
              type="date"
              value={diagnosedAt}
              onChange={e => setDiagnosedAt(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>

      {/* Result summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">진단 결과 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>전체 평균 (5점 만점)</span>
                <span className="font-bold">{result.totalAverage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>100점 환산</span>
                <span className="font-bold">{result.score100.toFixed(1)}점</span>
              </div>
              <div className="flex justify-between items-center">
                <span>AX 진행단계</span>
                <Badge>Lv{result.level} {result.levelName}</Badge>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {result.areaScores.map(a => (
                <div key={a.area} className="flex justify-between text-xs">
                  <span>{a.name}</span>
                  <span className={a.scoredCount === 0 ? 'text-muted-foreground' : ''}>
                    {a.scoredCount > 0 ? a.average.toFixed(2) : '미입력'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">영역별 시각화</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChartView areaScores={result.areaScores} />
          </CardContent>
        </Card>
      </div>

      {/* Score input */}
      <Card>
        <CardContent className="pt-6">
          <Accordion className="space-y-2">
            {DIAGNOSIS_AREAS.map(area => (
              <AccordionItem key={area.key} value={area.key}>
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{area.name} ({area.nameEn})</span>
                    <span className="text-muted-foreground text-xs">
                      {area.items.length}문항
                    </span>
                    {scores[area.key] && Object.keys(scores[area.key]).length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {Object.keys(scores[area.key]).length}/{area.items.length} 입력
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {area.items.map((item, idx) => (
                      <div key={item.key} className="border rounded-lg p-4">
                        <p className="text-sm font-medium mb-1">
                          ({item.label})
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">{item.question}</p>
                        <TooltipProvider>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(score => (
                              <Tooltip key={score}>
                                <TooltipTrigger
                                    onClick={() => setScore(area.key, idx, score)}
                                    className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${
                                      scores[area.key]?.[idx] === score
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'hover:bg-muted'
                                    }`}
                                  >
                                    {score}
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs">
                                  <p className="text-xs">{item.scales[score - 1]}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
