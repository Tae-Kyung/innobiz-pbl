export function getReportSystemPrompt(): string {
  return `당신은 AI특화공동훈련센터 PBL 사업의 AX 진단 컨설팅 결과보고서를 작성하는 전문가입니다.

보고서 구조:
1. AX 진단 컨설팅 개요 (기업정보, 진단활동)
2. AX 진단 컨설팅 결과
   가. 설문 결과 (영역별 분석)
   나. 인터뷰를 통한 핵심 과제 도출
   다. 직무별 추천 AI훈련과정
3. 차상위 Lv 진입을 위한 우선순위
[붙임1] AX 진단 영역별 설문 결과
[붙임2] AX 진단 영역별 인터뷰 결과
[붙임3] 워크플로우 재설계 및 훈련과정 설계

작성 규칙:
- 서식4 예시를 참고하여 동일한 형식과 수준으로 작성
- 데이터에 기반한 구체적 분석 제시
- 현재 점수에서 차상위 레벨 진입을 위한 실행 가능한 우선순위 제시
- 직무별 As-is/To-be 분석을 통해 구체적인 훈련과정 추천
- 마크다운 형식으로 작성`
}

export function getReportSurveyPrompt(companyName: string, diagnosisData: string, level: number, levelName: string, score100: number): string {
  return `[기업명] ${companyName}
[진단결과] ${score100.toFixed(1)}점 → Lv${level} ${levelName}

[영역별 진단 점수]
${diagnosisData}

위 설문 결과를 분석하여 "2. AX 진단 컨설팅 결과 - 가. 설문 결과" 섹션과 "[붙임1] AX 진단 영역별 설문 결과"를 작성해주세요.

설문 결과 섹션에는:
- 전체 평균과 AX 레벨 판정 결과
- 영역별 점수 분석 (강점/약점 영역 식별)
- 전반적 시사점 (3~4개 bullet point)

붙임1에는:
- 7개 영역별로 "주요 결과"와 "후속 활동"을 표로 정리`
}

export function getReportInterviewPrompt(companyName: string, interviewData: string): string {
  return `[기업명] ${companyName}

[전체 인터뷰 데이터]
${interviewData}

위 인터뷰 결과를 분석하여 "2. AX 진단 컨설팅 결과 - 나. 인터뷰를 통한 핵심 과제 도출" 섹션과 "[붙임2] AX 진단 영역별 인터뷰 결과"를 작성해주세요.

핵심 과제 도출 섹션에는:
- 인프라 관점, 데이터 관점, 인재 관점 등 3~4개 관점으로 구조화
- 각 관점별 핵심 이슈와 근거를 구체적으로 기술

붙임2에는:
- 영역별 질문/답변을 표 형식으로 정리`
}

export function getReportTrainingPrompt(companyName: string, workflowData: string, interviewData: string): string {
  return `[기업명] ${companyName}

[워크플로우 재설계 데이터]
${workflowData}

[인터뷰에서 파악된 교육 니즈]
${interviewData}

위 데이터를 바탕으로 "2. AX 진단 컨설팅 결과 - 다. 직무별 추천 AI훈련과정" 섹션과 "[붙임3] 워크플로우 재설계 및 훈련과정 설계"를 작성해주세요.

추천 AI훈련과정 섹션에는:
| 관련 직무 | As-is | To-be | 추천 훈련과정 |
형식의 표로 정리

붙임3에는:
- 부서별/직무별 워크플로우 재설계 상세 (책무/As-is/To-be/필요 교육훈련)
- 기대효과`
}

export function getReportPrioritiesPrompt(
  companyName: string,
  score100: number,
  level: number,
  levelName: string,
  areaScoresData: string
): string {
  const nextLevel = level + 1
  const nextLevelNames: Record<number, string> = {
    2: 'AX도입단계', 3: 'AX확산단계', 4: 'AX정착단계', 5: 'AX혁신단계'
  }
  const nextLevelName = nextLevelNames[nextLevel] || 'AX혁신단계'
  const targetLevel = Math.min(nextLevel, 5)

  return `[기업명] ${companyName}
[현재 점수] ${score100.toFixed(1)}점, Lv${level} ${levelName}
[목표] Lv${targetLevel} '${nextLevelName}' 진입

[영역별 현재 점수]
${areaScoresData}

위 데이터를 바탕으로 "3. Lv${targetLevel} '${nextLevelName}' 진입을 위한 우선순위" 섹션을 작성해주세요.

포함사항:
- Lv${targetLevel} 진입 기준 점수 안내
- 현재 점수에서 목표까지 필요한 점수 갭
- 우선순위별 과제 (1~4순위)
  - 각 과제: 영역명, 과제명 (현재 X점 → 목표 Y점), 구체적 실행 내용
- 현재 강점 영역에 대한 유지 방안`
}
