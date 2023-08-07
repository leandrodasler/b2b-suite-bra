export const getPastYear = () => {
  const pastYear = new Date()

  pastYear.setDate(pastYear.getDate() - 365)

  return pastYear.toISOString()
}

export const getNow = () => new Date().toISOString()

export const getFirstDayInMonth = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)

  return firstDay.toISOString()
}

export const getLastDayInMonth = () => {
  const now = new Date()
  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  )

  return lastDay.toISOString()
}
