# Architecture: PBL 컨설팅 보고서 자동생성 시스템

## 1. 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────┐
│                    Vercel (Frontend + API)            │
│  ┌──────────────────────────────────────────────┐    │
│  │          Next.js 15 (App Router)              │    │
│  │  ┌────────────┐  ┌───────────────────────┐   │    │
│  │  │  Pages/UI   │  │  API Routes           │   │    │
│  │  │  (React +   │  │  /api/generate/*      │   │    │
│  │  │  Tailwind)  │  │  /api/companies/*     │   │    │
│  │  └────────────┘  │  /api/export/*         │   │    │
│  │                   └───────────┬───────────┘   │    │
│  └───────────────────────────────┼───────────────┘    │
│                                  │                     │
└──────────────────────────────────┼─────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌────▼─────┐ ┌──────▼──────┐
              │ Supabase  │ │ Claude   │ │ Supabase    │
              │ PostgreSQL│ │ API      │ │ Storage     │
              │ (데이터)   │ │ (AI생성)  │ │ (파일/이미지)│
              └───────────┘ └──────────┘ └─────────────┘
```

## 2. 기술 스택

| 영역 | 기술 | 선정 이유 |
|---|---|---|
| Frontend | Next.js 15, React, TypeScript | App Router, SSR, API Routes 통합 |
| 스타일링 | Tailwind CSS + shadcn/ui | 빠른 UI 구성, 한국어 친화 |
| DB | Supabase (PostgreSQL) | 무료 티어, RLS, 실시간 |
| 파일 저장 | Supabase Storage | 조직도 이미지, 생성 문서 |
| AI | Claude API (Sonnet) | 한국어 보고서 품질, 긴 컨텍스트 |
| 차트 | Recharts | 레이더 차트 (서식1 시각화) |
| 문서 내보내기 | docx (npm), html-to-pdf | Word/PDF 내보내기 |
| 배포 | Vercel | Next.js 최적 배포 |

## 3. 프로젝트 구조

```
innobiz/
├── CLAUDE.md
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   └── Tasks.md
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 대시보드 (기업 목록)
│   │   ├── companies/
│   │   │   ├── new/page.tsx        # 기업 등록
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # 기업 상세 (탭 컨테이너)
│   │   │       ├── info/           # 기본정보 탭
│   │   │       ├── diagnosis/      # 서식1 탭
│   │   │       ├── interview/      # 서식2 탭
│   │   │       ├── logs/           # 서식3 탭
│   │   │       ├── report/         # 서식4 탭
│   │   │       └── training/       # 서식5 탭
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   ├── log/route.ts        # 서식3 생성
│   │   │   │   ├── report/route.ts     # 서식4 생성
│   │   │   │   └── training/route.ts   # 서식5 생성
│   │   │   ├── companies/route.ts
│   │   │   └── export/route.ts         # Word/PDF 내보내기
│   │   └── settings/page.tsx
│   ├── components/
│   │   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── company/                # 기업 관련 컴포넌트
│   │   ├── diagnosis/              # 서식1 컴포넌트
│   │   │   ├── ScoreInput.tsx      # 문항별 점수 입력
│   │   │   └── RadarChart.tsx      # 레이더 차트
│   │   ├── interview/              # 서식2 컴포넌트
│   │   │   ├── QuestionPool.tsx    # 영역별 질문 풀
│   │   │   ├── AnswerForm.tsx      # 답변 입력
│   │   │   └── WorkflowForm.tsx    # 워크플로우 재설계
│   │   ├── report/                 # 서식3~5 공통
│   │   │   ├── MarkdownEditor.tsx  # 마크다운 편집기
│   │   │   └── ReportPreview.tsx   # 미리보기
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # 브라우저 클라이언트
│   │   │   ├── server.ts           # 서버 클라이언트
│   │   │   └── types.ts            # DB 타입 정의
│   │   ├── claude/
│   │   │   ├── client.ts           # Claude API 클라이언트
│   │   │   └── prompts/
│   │   │       ├── log.ts          # 서식3 프롬프트
│   │   │       ├── report.ts       # 서식4 프롬프트
│   │   │       └── training.ts     # 서식5 프롬프트
│   │   ├── scoring.ts              # 점수 계산 로직
│   │   └── constants/
│   │       ├── diagnosis-items.ts  # 서식1 32개 문항 정의
│   │       └── interview-questions.ts # 서식2 영역별 질문 풀
│   └── types/
│       └── index.ts                # 공통 타입
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 4. 데이터베이스 스키마

### companies (기업 정보)
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- 기업명
  business_number TEXT,                        -- 사업자등록번호
  industry TEXT,                               -- 주요 업종
  main_products TEXT,                          -- 주요 제품/서비스
  org_chart_url TEXT,                          -- 조직도 이미지 URL
  contact_name TEXT,                           -- 담당자 성명/직위
  contact_dept TEXT,                           -- 소속부서
  contact_phone TEXT,                          -- 연락처
  contact_email TEXT,                          -- 이메일
  training_center_name TEXT,                   -- 공동훈련센터명
  status TEXT DEFAULT 'registered',            -- registered/diagnosing/interviewing/reporting/planning/completed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### diagnosis_scores (서식1 - 진단 점수)
```sql
CREATE TABLE diagnosis_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  area TEXT NOT NULL,           -- strategy/organization/people/culture/data/infrastructure/governance
  item_index INT NOT NULL,     -- 영역 내 문항 번호 (0부터)
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  diagnosed_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, area, item_index)
);
```

### interviews (서식2 - 인터뷰 질문/답변)
```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  area TEXT NOT NULL,           -- 7개 영역
  question_type TEXT NOT NULL,  -- common/low_ax/high_ax
  question TEXT NOT NULL,
  answer TEXT,
  sort_order INT DEFAULT 0,
  interview_date DATE,
  interview_location TEXT,
  attendees JSONB,             -- [{name, position, org}]
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### workflow_redesigns (서식2 - 워크플로우 재설계)
```sql
CREATE TABLE workflow_redesigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  department TEXT NOT NULL,     -- 관련 부서
  job_title TEXT NOT NULL,      -- 직무명
  duty TEXT NOT NULL,           -- 책무
  as_is TEXT,
  to_be TEXT,
  required_training TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### consulting_logs (서식3 - 수행일지)
```sql
CREATE TABLE consulting_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  session_number INT NOT NULL CHECK (session_number >= 1 AND session_number <= 8),
  meeting_date DATE,
  meeting_method TEXT,          -- face_to_face/online
  meeting_location TEXT,
  attendees JSONB,             -- [{role, name}] PM, HRD전문가, 기업내부전문가, 센터담당자
  diagnosis_area TEXT,          -- 해당 회차의 진단영역 (2차~8차)
  content TEXT,                 -- AI 생성된 회의내용 (마크다운)
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, session_number)
);
```

### consulting_reports (서식4 - 결과보고서)
```sql
CREATE TABLE consulting_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  report_date DATE,
  content JSONB,               -- 섹션별 마크다운 콘텐츠
  -- content 구조:
  -- {
  --   overview: string,          -- 진단 컨설팅 개요
  --   survey_analysis: string,   -- 설문 결과 분석
  --   key_issues: string,        -- 핵심 과제 도출
  --   recommended_courses: string, -- 추천 AI 훈련과정
  --   priorities: string,        -- 우선순위 과제
  --   appendix1: string,         -- 붙임1: 영역별 설문 결과
  --   appendix2: string,         -- 붙임2: 인터뷰 결과
  --   appendix3: string          -- 붙임3: 워크플로우 재설계
  -- }
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id)
);
```

### training_plans (서식5 - 훈련 운영계획서)
```sql
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  course_name TEXT,             -- 훈련과정명
  ncs_code TEXT,                -- NCS 분류
  training_hours INT,           -- 훈련시간
  trainee_count INT,            -- 훈련생 수
  training_job TEXT,            -- 훈련 직무
  training_goal TEXT,           -- 훈련 목표
  training_period_start DATE,
  training_period_end DATE,
  content JSONB,               -- 섹션별 마크다운
  -- {
  --   consulting_overview: string,   -- II. 컨설팅 개요
  --   needs_analysis: string,        -- III. 훈련 요구분석
  --   operation_plan: string,        -- IV. PBL 운영계획
  --   curriculum_profile: string,    -- 훈련 교과목 프로파일
  --   evaluation_plan: string        -- 평가 계획
  -- }
  learning_group JSONB,        -- 학습그룹 구성
  facilities JSONB,            -- 시설/장비
  instructors JSONB,           -- 훈련강사
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id)
);
```

## 5. AI 프롬프트 아키텍처

### 프롬프트 구성 원칙
각 서식 생성 시 3개 레이어로 프롬프트 구성:

```
[System Prompt]
- 역할: PBL AX 진단 컨설팅 전문가
- 서식의 구조와 규격 (PDF에서 추출)
- 작성 가이드라인 및 톤/매너

[Context]
- 기업 기본정보
- 서식1 진단 점수 (영역별 평균, 전체 평균, Lv)
- 서식2 인터뷰 내용 (영역별 질문/답변)
- 워크플로우 재설계 내용
- 이전 서식 생성 결과 (서식4 생성 시 서식3 참조 등)

[Output Instruction]
- 출력 형식 (마크다운 구조)
- 섹션별 상세 지시
- 분량 가이드
```

### 서식3 프롬프트 전략
- 1차: 서식1 점수 기반 → 7개 영역 주요결과 요약
- 2~8차: 해당 영역의 인터뷰 Q&A 기반 → 주요 발견사항 정리

### 서식4 프롬프트 전략
- 전체 데이터를 한번에 제공 (서식1 점수 + 서식2 인터뷰 + 워크플로우)
- 섹션별로 분리 생성 (토큰 관리)
- 서식4 예시(제공된 PDF 샘플)를 few-shot으로 활용

### 서식5 프롬프트 전략
- 서식4의 추천 훈련과정을 기반으로
- PBL(Problem-Based Learning) 5단계 구조 반영: 문제정의 → 설계 → 구현 → 검증/개선 → 결과도출

## 6. API 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| GET/POST | `/api/companies` | 기업 목록/등록 |
| GET/PUT/DELETE | `/api/companies/[id]` | 기업 CRUD |
| POST | `/api/companies/[id]/diagnosis` | 서식1 점수 저장 |
| POST | `/api/companies/[id]/interviews` | 서식2 인터뷰 저장 |
| POST | `/api/generate/log` | 서식3 수행일지 AI 생성 |
| POST | `/api/generate/report` | 서식4 결과보고서 AI 생성 |
| POST | `/api/generate/training` | 서식5 훈련계획서 AI 생성 |
| POST | `/api/export/docx` | Word 내보내기 |

## 7. 핵심 상수 데이터

### 서식1 진단 항목 (32문항)
```typescript
const DIAGNOSIS_AREAS = {
  strategy: {
    name: '전략',
    items: [
      'AX 비전·목표',
      '경영전략 연계',
      '우선순위',
      '성과지표'
    ]
  },
  organization: {
    name: '조직',
    items: ['전담/책임 조직', 'R&R', '부서 간 협업 구조', '의사결정 구조']
  },
  people: {
    name: '인재',
    items: ['AX 기본 이해도', '실무 활용 역량', '핵심 인재 확보', '인재 육성체계', '인재 활용 및 확산']
  },
  culture: {
    name: '문화',
    items: ['AI 인식과 수용성', '실험·시도에 대한 허용', '리더십', '변화관리']
  },
  data: {
    name: '데이터',
    items: ['데이터 수집', '데이터 가공 수준', '데이터 접근성', '데이터 저장·관리 일관성', '데이터 품질관리', '데이터 통합·연계 수준']
  },
  infrastructure: {
    name: '인프라',
    items: ['기본 인프라', '인프라 확장성', '시스템-데이터-도구 연계', '운영 안정성 및 관리 체계', '보안·접근·신뢰성 기반']
  },
  governance: {
    name: '거버넌스',
    items: ['정책 및 기준 체계', '위험 식별', '모니터링 및 검증 체계', '이슈 대응 및 지속 개선 체계']
  }
};
// 총 32문항: 4+4+5+4+6+5+4
```

### AX 레벨 판정
```typescript
function getAXLevel(score100: number): { level: number; name: string } {
  if (score100 <= 30) return { level: 1, name: 'AX인식단계' };
  if (score100 <= 50) return { level: 2, name: 'AX도입단계' };
  if (score100 <= 70) return { level: 3, name: 'AX확산단계' };
  if (score100 <= 85) return { level: 4, name: 'AX정착단계' };
  return { level: 5, name: 'AX혁신단계' };
}
```

## 8. 보안 고려사항

- Supabase RLS 적용 (인증된 사용자만 접근)
- Claude API 키는 서버 사이드에서만 사용 (API Routes)
- 기업 정보는 민감 데이터 → HTTPS 필수 (Vercel 기본 제공)
- 환경 변수로 키 관리 (.env.local, Vercel Environment Variables)
