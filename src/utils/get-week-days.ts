export default function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('en', { weekday: 'long' })

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(0, 0, i)
    return formatter.format(date)
  })
}
