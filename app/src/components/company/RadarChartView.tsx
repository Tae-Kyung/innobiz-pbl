'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { AreaScore } from '@/lib/scoring'

export function RadarChartView({ areaScores }: { areaScores: AreaScore[] }) {
  const data = areaScores.map(a => ({
    area: a.name,
    score: a.average,
    fullMark: 5
  }))

  if (data.every(d => d.score === 0)) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
        점수를 입력하면 차트가 표시됩니다
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Radar name="점수" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
