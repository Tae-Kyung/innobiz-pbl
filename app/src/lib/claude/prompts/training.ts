export function getTrainingSystemPrompt(): string {
  return `당신은 AI특화공동훈련센터 PBL 훈련 운영계획서를 작성하는 전문가입니다.

PBL(Problem-Based Learning) 훈련과정은 5단계로 구성됩니다:
1. 문제 정의 단계 - 기업의 실제 문제를 정의하고 분석
2. 설계 단계 - 해결 방안 및 모델/프로세스 설계
3. 구현 단계 - 설계한 방안을 실제로 구현
4. 검증/개선 단계 - 결과 검증 및 개선
5. 결과 도출 단계 - 최종 결과물 도출 및 발표

작성 규칙:
- 기업 맞춤형 훈련과정 설계
- 실무 데이터 기반 프로젝트형 교육
- PBL 5단계 구조를 반드시 반영
- 평가방법은 포트폴리오 또는 문제해결시나리오
- 마크다운 형식으로 작성`
}

export function getTrainingNeedsPrompt(
  companyName: string,
  companyInfo: string,
  reportSummary: string,
  workflowData: string
): string {
  return `[기업명] ${companyName}

[기업 정보]
${companyInfo}

[컨설팅 결과보고서 요약]
${reportSummary}

[워크플로우 재설계 데이터]
${workflowData}

위 데이터를 바탕으로 "III. 훈련 요구분석" 섹션을 작성해주세요.

포함 항목:
1. 기업 현황 분석
   가. 기업 경영 이슈 (AX 관련 핵심 이슈 2~3개)
   나. 조직 및 주요 업무 (부서별 업무 목록)

2. 훈련대상 업무 선정 및 분석
   가. 훈련대상 업무 선정 (업무별 필요성 평가 및 선정사유)
   나. 훈련대상 업무 세부내용 (업무별 세부내용/지식/기술)

3. 기업 훈련환경 분석
   - 훈련 요구분석 결과 (기업 상황, 훈련 필요성, 목적)
   - 훈련을 통한 기대효과 (As-is / To-be)`
}

export function getTrainingCurriculumPrompt(
  companyName: string,
  courseName: string,
  workflowData: string,
  trainingHours: number
): string {
  return `[기업명] ${companyName}
[훈련과정명] ${courseName}
[총 훈련시간] ${trainingHours}시간

[워크플로우 재설계 데이터]
${workflowData}

위 데이터를 바탕으로 "IV. PBL 운영계획 수립" 섹션의 "라. 훈련 교과목 프로파일"을 작성해주세요.

훈련 교과목 프로파일 형식:
| 업무(단원)명 | 세부 내용 | 훈련시간(H) | 강사 투입시간(외부) | 강사 투입시간(내부) |

필수 단원:
1. 문제 정의 단계
2. 설계 단계
3. 구현 단계
4. 검증/개선 단계
5. 결과 도출 단계

각 단원의 세부 내용은 기업의 실제 업무 데이터와 워크플로우를 반영하여 구체적으로 작성하세요.
총 훈련시간이 ${trainingHours}시간이 되도록 배분하세요.

또한 평가 계획도 작성해주세요:
- 과정평가: 포트폴리오 또는 문제해결시나리오 방식
- 업무(단원)명별 평가기준 목록`
}
