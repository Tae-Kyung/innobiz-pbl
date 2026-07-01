'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Company } from '@/lib/supabase/types'

export function CompanyInfo({ company }: { company: Company }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기업 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <InfoRow label="기업명" value={company.name} />
          <InfoRow label="사업자등록번호" value={company.business_number} />
          <InfoRow label="주요 업종" value={company.industry} />
          <InfoRow label="주요 제품/서비스" value={company.main_products} />
          <InfoRow label="주소" value={company.address} />
          <InfoRow label="공동훈련센터명" value={company.training_center_name} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">담당자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <InfoRow label="성명/직위" value={company.contact_name} />
          <InfoRow label="소속부서" value={company.contact_dept} />
          <InfoRow label="연락처" value={company.contact_phone} />
          <InfoRow label="이메일" value={company.contact_email} />
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex">
      <span className="w-32 text-muted-foreground shrink-0">{label}</span>
      <span>{value || '-'}</span>
    </div>
  )
}
