import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  registered: { label: '등록', variant: 'outline' },
  diagnosing: { label: '진단중', variant: 'secondary' },
  interviewing: { label: '인터뷰중', variant: 'secondary' },
  reporting: { label: '보고서작성', variant: 'default' },
  planning: { label: '계획수립', variant: 'default' },
  completed: { label: '완료', variant: 'destructive' },
}

export default async function DashboardPage() {
  let companies: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('innobiz_companies')
      .select('*')
      .order('created_at', { ascending: false })
    companies = data || []
  } catch {
    // Supabase not configured yet
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">등록된 기업 및 컨설팅 진행 현황</p>
        </div>
        <Link href="/companies/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            기업 등록
          </Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="mb-4">등록된 기업이 없습니다.</p>
            <Link href="/companies/new">
              <Button variant="outline">첫 기업 등록하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const status = STATUS_LABELS[company.status] || STATUS_LABELS.registered
            return (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {company.industry && <p>업종: {company.industry}</p>}
                      {company.contact_name && <p>담당자: {company.contact_name}</p>}
                      <p className="text-xs">
                        등록일: {new Date(company.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
