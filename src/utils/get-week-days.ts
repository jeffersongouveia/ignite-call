interface GetWeekDaysParams {
  short?: boolean
}

export default function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('en', {
    weekday: short ? 'short' : 'long',
  })

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(0, 0, i)
    return formatter.format(date)
  })
}
