'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

export default function NewCompanyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const supabase = createClient()
    const { data, error } = await supabase.from('innobiz_companies').insert({
      name: formData.get('name') as string,
      business_number: formData.get('business_number') as string || null,
      industry: formData.get('industry') as string || null,
      main_products: formData.get('main_products') as string || null,
      contact_name: formData.get('contact_name') as string || null,
      contact_dept: formData.get('contact_dept') as string || null,
      contact_phone: formData.get('contact_phone') as string || null,
      contact_email: formData.get('contact_email') as string || null,
      training_center_name: formData.get('training_center_name') as string || null,
      address: formData.get('address') as string || null,
    }).select().single()

    if (error) {
      alert('등록 실패: ' + error.message)
      setLoading(false)
      return
    }

    router.push(`/companies/${data.id}`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">기업 등록</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">기업 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">기업명 *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="business_number">사업자등록번호</Label>
                <Input id="business_number" name="business_number" placeholder="000-00-00000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">주요 업종</Label>
                <Input id="industry" name="industry" />
              </div>
              <div>
                <Label htmlFor="main_products">주요 제품/서비스</Label>
                <Input id="main_products" name="main_products" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">주소</Label>
              <Input id="address" name="address" />
            </div>
            <div>
              <Label htmlFor="training_center_name">공동훈련센터명</Label>
              <Input id="training_center_name" name="training_center_name" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">담당자 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_name">성명/직위</Label>
                <Input id="contact_name" name="contact_name" />
              </div>
              <div>
                <Label htmlFor="contact_dept">소속부서</Label>
                <Input id="contact_dept" name="contact_dept" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">연락처</Label>
                <Input id="contact_phone" name="contact_phone" />
              </div>
              <div>
                <Label htmlFor="contact_email">이메일</Label>
                <Input id="contact_email" name="contact_email" type="email" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? '등록 중...' : '기업 등록'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  )
}
