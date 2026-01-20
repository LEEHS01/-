export const groupBy = (data, key) => {
  return data.reduce(function (carry, el) {
    const group = el[key]

    if (carry[group] === undefined) {
      carry[group] = []
    }

    carry[group].push(el)
    return carry
  }, {})
}

export const unique = (array) => {
  const result = []
  array.forEach(element => {
    if (!result.includes(element)) {
      result.push(element)
    }
  })
  return result
}

/** null+공백+NaN 체크 **/
export function nc (value) {
  let flag = false
  if (value !== undefined && value !== 'undefined' && value !== 'null' && value !== null && value !== '' && !isNaN(value)) {
    flag = true
  }
  return flag
}

export const setTwoWord = (d) => {
  if (nc(d)) {
    d = String(d)
    if (d.length === 1) {
      d = '0' + d
    }
  }
  return d
}

// 천단위 콤마
export const comma = (str) => {
  str = str + ''
  const strBuf = str.split('.')

  str = String(strBuf[0])
  str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
  if (strBuf.length > 1 && strBuf[1] !== '') {
    str += '.' + strBuf[1]
  }
  return str
}

export const commaFont = (str) => {
  str = str + ''
  const strBuf = str.split('.')

  str = String(strBuf[0])

  str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1<span style=" font-family: Noto Sans CJK KR;">,</span>')
  if (strBuf.length > 1 && strBuf[1] !== '') {
    str += '.' + strBuf[1]
  }
  return str
}

// 콤마풀기
export const uncomma = (str) => {
  str = String(str)
  return str.replace(/(,)/g, '')
}

export const plusZeroDay = (day) => {
  if (typeof day === 'number') {
    day = day + ''
  }
  if (day.length === 1) {
    day = '0' + day
  }
  return day
}

export const today = () => {
  const nowDate = new Date()
  const yesterYear = nowDate.getFullYear()
  const yesterMonth = nowDate.getMonth() + 1
  const yesterDay = nowDate.getDate()

  return yesterYear + '-' + plusZeroDay(yesterMonth) + '-' + plusZeroDay(yesterDay)
}

// 날짜 셋
export const dateSet = () => {
  const today = new Date()
  const yyyy = today.getFullYear().toString()
  const mm = (today.getMonth() + 1).toString()
  const dd = today.getDate().toString()
  let H = today.getHours()
  let m = today.getMinutes()
  let s = today.getSeconds()

  const setToday = () => {
    const now = new Date()
    H = now.getHours()
    m = now.getMinutes()
    s = now.getSeconds()
  }

  const getyyyy = () => {
    return yyyy
  }

  const getyyyyMM = () => {
    return `${yyyy}-${mm.padStart(2, '0')}`
  }

  const getyyyyMMdd = () => {
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }

  const getTime = () => {
    setToday()
    return `${H}-${m}-${s}`
  }

  return {
    today,
    yyyy,
    mm,
    dd,
    H,
    m,
    s,
    getyyyy,
    getyyyyMM,
    getyyyyMMdd,
    getTime
  }
}
