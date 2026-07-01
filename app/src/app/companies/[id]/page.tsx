import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CompanyTabs } from '@/components/company/CompanyTabs'

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: company, error } = await supabase
    .from('innobiz_companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !company) {
    notFound()
  }

  return <CompanyTabs company={company} />
}
