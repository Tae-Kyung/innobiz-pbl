import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">설정</h1>
      <Card>
        <CardHeader>
          <CardTitle>환경 설정</CardTitle>
          <CardDescription>
            API 키 및 연결 설정은 환경 변수(.env.local)로 관리됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Supabase</p>
            <p className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
          <div>
            <p className="font-medium">Claude API</p>
            <p className="text-muted-foreground">ANTHROPIC_API_KEY</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
