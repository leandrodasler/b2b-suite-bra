export const getPastYear = () => {
  const pastYear = new Date()

  pastYear.setDate(pastYear.getDate() - 365)

  return pastYear.toISOString()
}

export const getNow = () => new Date().toISOString()

export const getCurrentMonth = () => {
  const now = new Date()

  return now.getMonth()
}

export const getMonthByNegativeShift = (shift = 0) => {
  const now = new Date()

  const monthDate = new Date(
    now.getFullYear(),
    now.getMonth() - shift,
    1,
    0,
    0,
    0,
    0
  )

  return monthDate.getMonth()
}

export const getFirstDayInMonth = (monthMinus = 0) => {
  const now = new Date()
  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth() - monthMinus,
    1,
    0,
    0,
    0,
    0
  )

  return firstDay.toISOString()
}

export const getLastDayInMonth = (monthMinus = 0) => {
  const now = new Date()
  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() - monthMinus + 1,
    0,
    23,
    59,
    59,
    999
  )

  return lastDay.toISOString()
}
