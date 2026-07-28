/** AQI 限值表（与官方 nep.aqi 一致；前端实时预览用，提交以后端为准） */
export const AQI_THRESHOLDS = [
  { level: 1, grade: '优', color: '#02E300', so2Min: 0, so2Max: 50, coMin: 0, coMax: 5, spmMin: 0, spmMax: 35 },
  { level: 2, grade: '良', color: '#FFFF00', so2Min: 51, so2Max: 150, coMin: 6, coMax: 10, spmMin: 36, spmMax: 75 },
  { level: 3, grade: '轻度污染', color: '#FF7E00', so2Min: 151, so2Max: 475, coMin: 11, coMax: 35, spmMin: 76, spmMax: 115 },
  { level: 4, grade: '中度污染', color: '#FE0000', so2Min: 476, so2Max: 800, coMin: 36, coMax: 60, spmMin: 116, spmMax: 150 },
  { level: 5, grade: '重度污染', color: '#98004B', so2Min: 801, so2Max: 1600, coMin: 61, coMax: 90, spmMin: 151, spmMax: 250 },
  { level: 6, grade: '严重污染', color: '#7E0123', so2Min: 1601, so2Max: 2620, coMin: 91, coMax: 150, spmMin: 251, spmMax: 500 },
]

/**
 * 按浓度计算单项等级。
 * type: 'so2' | 'co' | 'spm'
 */
export function calcItemLevel(value, type) {
  if (value == null || Number.isNaN(Number(value))) return 1
  const v = Math.max(0, Number(value))
  const minKey = `${type}Min`
  const maxKey = `${type}Max`
  for (const row of AQI_THRESHOLDS) {
    if (v >= row[minKey] && v <= row[maxKey]) return row.level
  }
  return 6
}

export function getAqiInfo(level) {
  return (
    AQI_THRESHOLDS.find((item) => item.level === Number(level)) || {
      level,
      grade: '未知',
      color: '#999999',
    }
  )
}

/** 综合等级 = 三项最差（最大） */
export function calcTotalLevel(so2Value, coValue, spmValue) {
  return Math.max(
    calcItemLevel(so2Value, 'so2'),
    calcItemLevel(coValue, 'co'),
    calcItemLevel(spmValue, 'spm')
  )
}
