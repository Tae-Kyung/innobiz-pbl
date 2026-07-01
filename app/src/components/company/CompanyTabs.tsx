'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { Company } from '@/lib/supabase/types'
import { CompanyInfo } from './CompanyInfo'
import { DiagnosisTab } from './DiagnosisTab'
import { InterviewTab } from './InterviewTab'
import { ConsultingLogTab } from './ConsultingLogTab'
import { ReportTab } from './ReportTab'
import { TrainingPlanTab } from './TrainingPlanTab'

const STATUS_LABELS: Record<string, string> = {
  registered: '등록',
  diagnosing: '진단중',
  interviewing: '인터뷰중',
  reporting: '보고서작성',
  planning: '계획수립',
  completed: '완료',
}

export function CompanyTabs({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState('info')

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <Badge variant="outline">{STATUS_LABELS[company.status] || company.status}</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="info">기본정보</TabsTrigger>
          <TabsTrigger value="diagnosis">서식1 진단</TabsTrigger>
          <TabsTrigger value="interview">서식2 인터뷰</TabsTrigger>
          <TabsTrigger value="logs">서식3 수행일지</TabsTrigger>
          <TabsTrigger value="report">서식4 결과보고서</TabsTrigger>
          <TabsTrigger value="training">서식5 훈련계획</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <CompanyInfo company={company} />
        </TabsContent>
        <TabsContent value="diagnosis">
          <DiagnosisTab companyId={company.id} />
        </TabsContent>
        <TabsContent value="interview">
          <InterviewTab companyId={company.id} />
        </TabsContent>
        <TabsContent value="logs">
          <ConsultingLogTab companyId={company.id} companyName={company.name} />
        </TabsContent>
        <TabsContent value="report">
          <ReportTab companyId={company.id} companyName={company.name} />
        </TabsContent>
        <TabsContent value="training">
          <TrainingPlanTab companyId={company.id} companyName={company.name} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
