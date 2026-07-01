export interface InterviewQuestion {
  id: string
  text: string
  type: 'common' | 'low_ax' | 'high_ax'
}

export interface AreaInterviewQuestions {
  area: string
  name: string
  diagnosticPoint: string
  questions: InterviewQuestion[]
}

export const INTERVIEW_QUESTIONS: AreaInterviewQuestions[] = [
  {
    area: 'strategy',
    name: '전략',
    diagnosticPoint: 'AX를 위한 1)문제 정의(왜 바꾸려 하는가?), 2)변화 방향(무엇을 바꾸려 하는가?) 3)실행 제약(무엇이 막고 있는가?)에 대해 파악',
    questions: [
      { id: 'str_c1', text: '귀사 업종에서 대표적으로 활용되는 AI 활용 사례에 대해 어느 정도 인지하고 있나요?', type: 'common' },
      { id: 'str_c2', text: 'AI 도입·활용에 대한 경영진의 의지는 어떠한가요?', type: 'common' },
      { id: 'str_c3', text: '앞으로의 AI 활용 계획은 어떻게 되나요? (예. 자사 특화 AI모델 개발, 내부 업무 자동화, 제품/서비스 강화, 데이터 기반 의사결정 등)', type: 'common' },
      { id: 'str_c4', text: "'이 방식은 지속하기 어렵다'고 공감대가 형성된 업무 영역이 존재하나요? 있다면, 문제는 효율/품질/의사결정 등 어디에서 가장 크게 나타나나요?", type: 'common' },
      { id: 'str_c5', text: '해당 문제를 해결하기 위해 지금까지 실제로 시도했거나 논의된 방법은 무엇인가요?', type: 'common' },
      { id: 'str_c6', text: '변화가 필요하다는 인식은 있지만, 아직 실행으로 이어지지 못한 가장 큰 이유는 무엇인가요?', type: 'common' },
      { id: 'str_c7', text: 'AI 기술을 고려할 때, 가장 먼저 기대하게 되는 변화나 효과는 무엇인가요? 반대로, AI 활용을 논의할 때 가장 우려되는 지점은 무엇인가요?', type: 'common' },
      { id: 'str_c8', text: "AI를 도입한다면 '이 업무만큼은 꼭 바뀌었으면 좋겠다'라고 생각하는 대표적인 업무가 있나요?", type: 'common' },
      { id: 'str_l1', text: '향후 2~3년 후를 가정했을 때, 우리 회사의 이 부분만큼은 확실히 달라졌다고 말하고 싶은 변화는 무엇인가요?', type: 'low_ax' },
      { id: 'str_l2', text: 'AI나 디지털 전환이 필요하다는 이야기는 나오지만, 구체적인 실행으로 연결되지 않는 결정적 이유는 무엇인가요?', type: 'low_ax' },
      { id: 'str_l3', text: '새로운 도구나 방식을 도입할 때, 의사결정을 가장 어렵게 만드는 요소는 무엇인가요? (비용, 리스크, 전문인력, 데이터 부족, 내부 공감대 미형성 등)', type: 'low_ax' },
      { id: 'str_l4', text: 'AI가 일부라도 역할을 나눠 맡을 수 있을 것 같은 업무가 있다면 어디라고 보시나요?', type: 'low_ax' },
      { id: 'str_l5', text: '개선이 필요하다고 인식된 업무들 중에서, 우선순위를 정하기 어렵다고 느끼는 이유는 무엇인가요?', type: 'low_ax' },
      { id: 'str_h1', text: 'AX가 성공한다고 가정했을 때, 가장 중요하게 보고 싶은 기준은 무엇인가요?', type: 'high_ax' },
      { id: 'str_h2', text: '현재 AX와 관련해 전략적으로 가장 중요하게 관리되는 과제는 무엇인가요? 성과 측정은 어떤 지표를 활용하고 있나요?', type: 'high_ax' },
      { id: 'str_h3', text: '해당 과제에서 사람이 반드시 판단해야 하는 부분과 시스템/AI가 맡아도 되는 부분은 어떻게 구분하고 계신가요?', type: 'high_ax' },
      { id: 'str_h4', text: '전략 실행 과정에서 방향을 점검하거나 조정하는 공식적인 방식이 있나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'organization',
    name: '조직',
    diagnosticPoint: 'AX를 위한 조직의 의사결정 구조, 권한 배분, KPI·보상 체계, 운영 모델과 정합적으로 연결되어 실제 실행 및 확산이 가능한 상태인지 파악',
    questions: [
      { id: 'org_c1', text: '귀사의 조직 구성에 대해 구체적으로 설명해 주세요 (예. 조직도, 직급체계, 본부/부서 구조, 인원 규모 등)', type: 'common' },
      { id: 'org_c2', text: '귀사의 가치 창출을 위한 핵심 업무에 대해 시작부터 완료(또는 고객 전달)까지 어떤 흐름과 단계로 이어지는지 구체적으로 말씀해 주세요.', type: 'common' },
      { id: 'org_c3', text: '그 과정에서 가장 큰 마찰이나 병목은 어디에서 발생했나요?', type: 'common' },
      { id: 'org_c4', text: '프로젝트를 승인·중단·조정하는 실질적인 조직 단위 또는 권한자는 누구인가요?', type: 'common' },
      { id: 'org_c5', text: '프로젝트를 수행할 때, 무엇이 가장 먼저 개선되어야 한다고 보시나요?', type: 'common' },
      { id: 'org_c6', text: 'AX 추진 시 가장 조심스럽게 접근하는 부서는 어디인가요? 왜 그렇다고 보시나요?', type: 'common' },
      { id: 'org_c7', text: 'AX 프로젝트의 성과를 기존 평가/보상 체계에 반영할 수 있나요?', type: 'common' },
      { id: 'org_c8', text: 'AX 프로젝트의 성과가 기존 KPI, 평가기준과 충돌하거나 불리하게 작용한 사례가 있나요?', type: 'common' },
      { id: 'org_l1', text: 'AX 관련 과제가 비공식적으로 추진된 사례가 있나요?', type: 'low_ax' },
      { id: 'org_l2', text: '공식 승인 체계로 인해 프로젝트가 지연되거나 중단된 사례가 있나요?', type: 'low_ax' },
      { id: 'org_l3', text: '부서 간 이해관계로 인해 추진 속도가 느려진 경험이 있나요?', type: 'low_ax' },
      { id: 'org_l4', text: '전담 조직이 있더라도, 예산, 인력, 우선순위를 실제로 조정할 권한이 충분하다고 보시나요?', type: 'low_ax' },
      { id: 'org_h1', text: 'AX 프로젝트의 핵심 인력 교체 시에도 현재 구조가 유지될 수 있다고 보시나요?', type: 'high_ax' },
      { id: 'org_h2', text: 'R&R이 정의되어 있으나 실제 현업 과정에서 충돌한 사례가 있나요?', type: 'high_ax' },
      { id: 'org_h3', text: 'AX를 통해 기존 업무 프로세스와 인력 구조에 어떤 변화가 있었나요?', type: 'high_ax' },
      { id: 'org_h4', text: 'AX 운영 모델(Target Operating Model)이 실제 의사결정과 연결되어 작동하고 있나요?', type: 'high_ax' },
      { id: 'org_h5', text: 'AX 관련 성과가 타 부서로 확산되는 구조가 마련되어 있나요?', type: 'high_ax' },
      { id: 'org_h6', text: 'AX 프로젝트가 실패했을 때, 조직 차원의 구조 수정이 이루어진 사례가 있나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'people',
    name: '인재',
    diagnosticPoint: 'AX를 위한 1)구성원의 AI 활용 수준, 2)AI 활용이 직무 기대로 전환되었는지, 3)학습-업무 연결 구조, 4)조직 차원의 확산 가능성에 대해 파악',
    questions: [
      { id: 'ppl_c1', text: '스마트 팩토리, 생성형 AI 등 다양한 AI 기술의 본격적인 등장 이후 최근 구성원들의 문제해결 방식이 달라진 사례가 있나요?', type: 'common' },
      { id: 'ppl_c2', text: 'AI 활용은 개인의 재량인가요, 직무 기대사항에 포함되어 있나요?', type: 'common' },
      { id: 'ppl_c3', text: '교육이나 학습을 통해 실제 업무 변화로 연결된 사례가 있나요?', type: 'common' },
      { id: 'ppl_c4', text: '구성원들의 AI 역량 향상 속도에 대한 조직이 기대하는 속도가 있나요?', type: 'common' },
      { id: 'ppl_c5', text: 'AI 역량이 일부 인력이나 직무군에게 편중되어 있나요?', type: 'common' },
      { id: 'ppl_c6', text: '구성원 간 AI 역량 격차로 인해 업무 배분이나 성과 차이가 나타난 사례가 있나요?', type: 'common' },
      { id: 'ppl_l1', text: 'AI 활용에 대한 조직 차원의 명확한 요구나 기대치가 있나요?', type: 'low_ax' },
      { id: 'ppl_l2', text: 'AI를 잘 활용하는 구성원은 주로 어떤 유형의 문제를 해결하고 있나요?', type: 'low_ax' },
      { id: 'ppl_l3', text: 'AI 활용을 주도하는 핵심 인재가 있다면, 그들의 영향력은 어디까지 미치나요?', type: 'low_ax' },
      { id: 'ppl_h1', text: 'AI 활용이 직무명세서나 역할 기대치에 반영된 사례가 있나요?', type: 'high_ax' },
      { id: 'ppl_h2', text: 'AI 관련 교육 프로그램 운영의 효과성은 어떠한가요?', type: 'high_ax' },
      { id: 'ppl_h3', text: '일부 직무에서는 AI 활용이 기본이 되었으나, 조직 전체로 확산되지 않는 이유는 무엇인가요?', type: 'high_ax' },
      { id: 'ppl_h4', text: '기존 직무를, 사람과 AI가 협업하는 방식으로 수행하기 위해 직무 정의, 업무 프로세스 등을 재설계한 사례가 있나요?', type: 'high_ax' },
      { id: 'ppl_h5', text: 'AI 역량 모델이나 직무별 기대 수준을 정의하고 체계적으로 관리하고 있나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'culture',
    name: '문화',
    diagnosticPoint: 'AI에 대해 조직 구성원이 어떻게 인식하고, 어떻게 행동하며, 변화와 실험을 어떤 태도로 받아들이는지 파악',
    questions: [
      { id: 'cul_c1', text: '귀사는 현재 AI를 어떤 주제로 인식하고 있나요? (예. 핵심 과제/관심 이슈/먼 이야기/위협 요소 등)', type: 'common' },
      { id: 'cul_c2', text: '최근 2~3년 내 조직에 영향을 준 큰 변화(기술·시장·제도 등)가 있었던 사례를 하나 말씀해 주세요. 당시 조직은 어떻게 반응했나요?', type: 'common' },
      { id: 'cul_c3', text: '조직에서 변화가 필요하다고 판단될 때, 실제 실행까지 이어지는 편인가요?', type: 'common' },
      { id: 'cul_c4', text: '새로운 시도가 실패했을 때, 그 이후 조직 분위기는 어떤가요?', type: 'common' },
      { id: 'cul_c5', text: '변화가 자신의 직무에 영향을 줄 경우, 구성원들은 주로 어떤 반응을 보이나요?', type: 'common' },
      { id: 'cul_c6', text: '경영진 및 리더가 강조하는 가치들은 실제 의사결정과 운영 방식에 반영되나요?', type: 'common' },
      { id: 'cul_c7', text: '구성원이 AI를 학습·실험할 수 있도록 조직 차원에서 시간과 자원을 공식적으로 보장할 수 있나요?', type: 'common' },
      { id: 'cul_c8', text: '실패 사례를 공유하는 것이 자연스러운 문화인가요?', type: 'common' },
      { id: 'cul_l1', text: '변화 시도가 개인의 리스크로 받아들여지나요?', type: 'low_ax' },
      { id: 'cul_l2', text: 'AI와 관련된 변화가 실제로 제안된다면, 구성원들의 반응은 어떻게 예상하시나요?', type: 'low_ax' },
      { id: 'cul_h1', text: '변화관리 활동은 어떻게 구성되나요? 변화가 마무리 짓지 못하고 종료된 사례가 있나요?', type: 'high_ax' },
      { id: 'cul_h2', text: '리더가 바뀌어도 현재 문화가 유지될 수 있다고 생각하시나요?', type: 'high_ax' },
      { id: 'cul_h3', text: '새로운 시도와 실험 결과가 조직 차원의 학습으로 축적되고 재사용 되나요?', type: 'high_ax' },
      { id: 'cul_h4', text: '구성원들은 변화로 인한 역할 재정의를 자연스럽게 받아들이나요?', type: 'high_ax' },
      { id: 'cul_h5', text: '성공/실패 사례 등은 단순 공유를 넘어 제도/프로세스 개선으로 이어진 사례가 있나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'data',
    name: '데이터',
    diagnosticPoint: 'AX를 위해 1)기반이 될 데이터가 체계적으로 갖춰져 있는지, 2)병목 구간이 존재하는지, 3)보완이 필요한 구조적 개선과제에 대해 파악',
    questions: [
      { id: 'dat_c1', text: '부서별 핵심 데이터로는 어떤 것들이 있습니까? 어디에서 생성되고 누가, 어떻게 관리·활용하고 있나요?', type: 'common' },
      { id: 'dat_c2', text: '부서별 핵심 데이터들의 유형은 주로 무엇인가요? (예. 텍스트, 이미지, 음성, 영상 등)', type: 'common' },
      { id: 'dat_c3', text: '핵심 데이터는 생성 이후 어떤 과정을 거쳐 활용 단계로 이동하나요?', type: 'common' },
      { id: 'dat_c4', text: '데이터 관리에 있어 가장 많은 시간과 노력이 소요되는 단계는 어디인가요?', type: 'common' },
      { id: 'dat_c5', text: '내부 데이터를 활용해 분석을 시도할 때, 자주 부딪히는 현실적 제약은 무엇입니까?', type: 'common' },
      { id: 'dat_c6', text: 'AI 모델 학습에 사용되는 데이터에 대해 어느 정도 인지하고 계신가요?', type: 'common' },
      { id: 'dat_c7', text: '생성된 데이터 중 수작업 전환(엑셀 가공 등)이 필요한 구간이 있나요?', type: 'common' },
      { id: 'dat_c8', text: '데이터 형식이나 정의가 부서마다 달라 혼선이 발생한 사례가 있나요?', type: 'common' },
      { id: 'dat_c9', text: '핵심 데이터에 대해 최종적으로 품질을 책임지는 사람(또는 조직)이 명확한가요?', type: 'common' },
      { id: 'dat_l1', text: 'AI를 적용하려 했지만 데이터 문제로 시도 자체를 보류한 경험이 있나요?', type: 'low_ax' },
      { id: 'dat_l2', text: '실무자가 데이터를 직접 조회·추출할 수 있나요? 요청한 데이터를 받기까지 평균 소요시간은?', type: 'low_ax' },
      { id: 'dat_h1', text: 'AI 모델 활용 시 데이터 한계로 성능이 제한된 경험이 있나요?', type: 'high_ax' },
      { id: 'dat_h2', text: '최근 AI 프로젝트에서 데이터 준비에 가장 많은 자원이 투입된 구간은 어디였나요?', type: 'high_ax' },
      { id: 'dat_h3', text: 'AI 활용을 위해 외부 데이터를 활용한 경험이 있나요?', type: 'high_ax' },
      { id: 'dat_h4', text: '데이터 재사용이 프로젝트 간 표준화되어 있나요?', type: 'high_ax' },
      { id: 'dat_h5', text: '새로운 AI use case를 추가할 때, 기존 데이터 구조가 확장에 제약이 되는 부분이 있나요?', type: 'high_ax' },
      { id: 'dat_h6', text: '신규 프로젝트를 기획할 때, 향후 AI 활용을 고려해 데이터 구조를 설계합니까?', type: 'high_ax' },
      { id: 'dat_h7', text: 'AI 모델이나 분석 결과에 문제가 발생했을 때, 데이터 오류에 대해 어떻게 대응하나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'infrastructure',
    name: '인프라',
    diagnosticPoint: 'AX를 위해 AI 모델이 조직 내에서 개발·배포·운영·확장될 수 있도록 지원하는 기술적 실행 기반에 대해 파악',
    questions: [
      { id: 'inf_c1', text: '현재 주요 AI 활용 방식은 어떤 구조에 가까운가요? (예. ChatGPT 등 SaaS/API 활용, 클라우드 기반, 외주 의존, 자체 서버 구축·운영, 혼합 등)', type: 'common' },
      { id: 'inf_c2', text: 'AI 관련 비용은 어떻게 집행되고 있나요?', type: 'common' },
      { id: 'inf_c3', text: 'AI 관련 기술 운영·보안·장애 대응 등 기술 관리 책임은 어디에 있나요?', type: 'common' },
      { id: 'inf_c4', text: 'AI 도입·확산 시, 자체 개발(Build)과 외부 솔루션(Buy) 중 어떤 방식을 고려하고 계신가요?', type: 'common' },
      { id: 'inf_c5', text: 'AI 기술 도입 시 정보의 보안은 어느 단계에서 개입하나요?', type: 'common' },
      { id: 'inf_c6', text: '기술 자산(서버, 클라우드 비용, 라이선스 등) 관리는 누가 하나요?', type: 'common' },
      { id: 'inf_l1', text: 'AI 도입을 위한 실험이나 테스트는 어떤 환경에서 이루어지나요?', type: 'low_ax' },
      { id: 'inf_l2', text: 'AI 인프라 운영에 있어 외부 벤더에 대한 의존도는 어느 정도인가요?', type: 'low_ax' },
      { id: 'inf_h1', text: 'AI 관련 비용이 예상보다 증가한 경험이 있나요? 비용 통제 기준이 설정되어 있나요?', type: 'high_ax' },
      { id: 'inf_h2', text: 'AI 모델의 품질 저하나 시스템 장애 등은 어떻게 감지하고 대응하나요?', type: 'high_ax' },
      { id: 'inf_h3', text: 'AI 인프라 운영 중 반복적으로 발생하는 기술 이슈는 무엇인가요?', type: 'high_ax' },
      { id: 'inf_h4', text: 'AI 모델의 성능(정확도, 응답속도 등) 모니터링은 어떻게 관리하시나요? (ModelOps)', type: 'high_ax' },
      { id: 'inf_h5', text: 'AI 사용량, 비용을 추적하여 통제하는 기준은 무엇인가요? (FinOps)', type: 'high_ax' },
      { id: 'inf_h6', text: 'AI 결과가 현업 UI/업무 시스템에 연결되면서 문제가 있었던 사례가 있나요?', type: 'high_ax' },
    ]
  },
  {
    area: 'governance',
    name: '거버넌스',
    diagnosticPoint: 'AI 활용에 대한 정책·통제·책임 구조가 문서 수준을 넘어 실제 운영 과정에서 작동하고 있는지 파악',
    questions: [
      { id: 'gov_c1', text: '개인이나 부서가 공식 절차 없이 외부 AI 서비스를 먼저 사용한 사례가 있나요?', type: 'common' },
      { id: 'gov_c2', text: 'AI 활용 결과 검증은 누가, 어떤 기준으로 수행하나요?', type: 'common' },
      { id: 'gov_c3', text: "AI 활용에서 '리스크를 줄이는 것'과 '속도를 내는 것' 중 어느 쪽에 더 무게를 두고 있나요?", type: 'common' },
      { id: 'gov_c4', text: '내부 기준이나 정책이 실제 판단 기준에 작동한다고 느끼시나요?', type: 'common' },
      { id: 'gov_l1', text: 'AI 사용을 금지하거나 제한한 사례가 있습니까? 그 이유는 무엇이었나요?', type: 'low_ax' },
      { id: 'gov_l2', text: '조직이 현재 가장 우려하는 AI 리스크는 무엇이며, 그 리스크를 줄이기 위해 실제로 하는 행동은 무엇인가요?', type: 'low_ax' },
      { id: 'gov_h1', text: 'AI 모델이나 데이터가 변경될 때, 그 변경 이력은 누가, 어떻게 추적 관리합니까?', type: 'high_ax' },
      { id: 'gov_h2', text: 'AI 활용 결과를 외부 감사나 경영진 보고 시 근거를 추적해 설명할 수 있는 구조인가요?', type: 'high_ax' },
      { id: 'gov_h3', text: 'AI 프로젝트 시작 전에 리스크·법무·보안 검토는 어느 시점에 개입하나요?', type: 'high_ax' },
      { id: 'gov_h4', text: 'AI 모델 성능 저하나 오류 발생 시, 누가 어떤 기준으로 재학습·수정·중단 여부를 결정했나요?', type: 'high_ax' },
      { id: 'gov_h5', text: 'AI 결과가 내부 규정이나 법을 위반하지 않도록 사전 검증 장치가 어떻게 설계되어 있나요?', type: 'high_ax' },
      { id: 'gov_h6', text: '외부 감사나 내부 점검 시, AI 활용 로그, 접근 권한, 답변 생성 이력 등을 어떻게 확인하나요?', type: 'high_ax' },
    ]
  }
]

export const SESSION_AREA_MAP: Record<number, string> = {
  2: 'strategy',
  3: 'organization',
  4: 'people',
  5: 'culture',
  6: 'data',
  7: 'infrastructure',
  8: 'governance'
}
