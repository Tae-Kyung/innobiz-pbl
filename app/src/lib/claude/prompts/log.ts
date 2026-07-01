export function getLogSystemPrompt(): string {
  return `당신은 AI특화공동훈련센터 PBL 사업의 AX(AI Transformation) 진단 컨설팅 전문가입니다.
컨설팅 수행일지를 작성합니다. 각 회차별로 기업 방문 시 수행한 활동과 주요 결과를 기록합니다.

작성 규칙:
- 전문적이고 객관적인 톤으로 작성
- 구체적인 사실과 데이터를 기반으로 작성
- 각 진단영역의 현황과 개선 필요사항을 명확히 기술
- 마크다운 형식으로 작성`
}

export function getSession1Prompt(companyName: string, diagnosisData: string): string {
  return `[기업명] ${companyName}
[회차] 1차시
[목적] 기업이 작성한 [서식1] AX 수준진단도구의 결과를 검증하고 7개 진단영역별 주요 결과를 정리

[서식1 진단 점수 데이터]
${diagnosisData}

위 진단 점수 데이터를 바탕으로 1차 컨설팅 수행일지의 회의내용을 작성해주세요.

출력 형식:
각 진단영역별로 주요결과를 작성하세요. 예시:
- 전략: 영역 평균 X.X점으로 [분석 내용]
- 조직: ...
- 인재: ...
- 문화: ...
- 데이터: ...
- 인프라: ...
- 거버넌스: ...

마지막에 "* 기업이 작성한 [서식 1] 기업 AX 수준진단도구를 통하여 진단표 내용에 맞는지 내용 검증" 을 추가하세요.`
}

export function getSessionNPrompt(
  companyName: string,
  sessionNumber: number,
  areaName: string,
  interviewData: string,
  workflowData: string
): string {
  return `[기업명] ${companyName}
[회차] ${sessionNumber}차시
[진단영역] ${areaName}

[인터뷰 질문/답변]
${interviewData}

[워크플로우 재설계 정보]
${workflowData}

위 인터뷰 내용을 바탕으로 ${sessionNumber}차 컨설팅 수행일지의 회의내용을 작성해주세요.

출력 형식:
[진단영역 : ${areaName}]

다음 3가지를 포함하여 작성:
1. [서식 2] 기업 AX 세부진단도구를 활용하여 인터뷰 진행 결과 요약
   - 인터뷰에서 파악된 주요 현황, 이슈, 강점, 개선필요사항을 구체적으로 기술
2. 훈련이 필요한 직무의 AS-IS / TO-BE 및 필요 교육훈련 도출
3. AS-IS / TO-BE에 따른 후속 활동 도출`
}
