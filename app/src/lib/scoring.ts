import { DIAGNOSIS_AREAS } from './constants/diagnosis-items'
import type { DiagnosisScore } from './supabase/types'

export interface AreaScore {
  area: string
  name: string
  average: number
  itemCount: number
  scoredCount: number
}

export interface DiagnosisResult {
  areaScores: AreaScore[]
  totalAverage: number
  score100: number
  level: number
  levelName: string
}

export function calculateDiagnosis(scores: DiagnosisScore[]): DiagnosisResult {
  const areaScores: AreaScore[] = DIAGNOSIS_AREAS.map(area => {
    const areaItems = scores.filter(s => s.area === area.key)
    const total = areaItems.reduce((sum, s) => sum + s.score, 0)
    return {
      area: area.key,
      name: area.name,
      average: areaItems.length > 0 ? total / areaItems.length : 0,
      itemCount: area.items.length,
      scoredCount: areaItems.length
    }
  })

  const allScores = scores.map(s => s.score)
  const totalAverage = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / 32 : 0
  const score100 = (totalAverage - 1) / 4 * 100
  const { level, levelName } = getAXLevel(score100)

  return { areaScores, totalAverage, score100, level, levelName }
}

export function getAXLevel(score100: number): { level: number; levelName: string } {
  if (score100 <= 30) return { level: 1, levelName: 'AX인식단계' }
  if (score100 <= 50) return { level: 2, levelName: 'AX도입단계' }
  if (score100 <= 70) return { level: 3, levelName: 'AX확산단계' }
  if (score100 <= 85) return { level: 4, levelName: 'AX정착단계' }
  return { level: 5, levelName: 'AX혁신단계' }
}

export const AX_LEVELS = [
  { level: 1, name: 'AX인식단계', min: 0, max: 30, description: '조직 차원의 AX 추진 계획이 부재하거나, 필요성에 대한 초기 인식 수준' },
  { level: 2, name: 'AX도입단계', min: 31, max: 50, description: '조직 차원의 AX 추진 방향/계획 일부 수립, 특정 업무 또는 부서를 중심으로 AI 활용 파일럿(PoC) 또는 실험적 활용을 시도' },
  { level: 3, name: 'AX확산단계', min: 51, max: 70, description: '기업 내 일부 핵심 업무에서 AI 활용이 실제 운영 수준으로 적용, 프로젝트 단위를 넘어 조직 내 여러 업무로 점진적 확산' },
  { level: 4, name: 'AX정착단계', min: 71, max: 85, description: 'AX 전략과 추진 체계가 조직적으로 정립되고, 주요 업무에 AI 활용이 정착된 단계' },
  { level: 5, name: 'AX혁신단계', min: 86, max: 100, description: 'AX가 기업 전략과 운영 전반에 내재화된 단계, AI 기반 의사결정과 혁신이 조직 경쟁력의 핵심 요소로 작동' }
]
