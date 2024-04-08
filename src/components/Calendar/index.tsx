import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'

import { api } from '../../lib/axios'
import getWeekDays from '../../utils/get-week-days'
import { Actions, Body, Container, Day, Header, Title } from './styles'

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type CalendarWeeks = CalendarWeek[]

export default function Calendar({
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const weekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const router = useRouter()
  const username = String(router.query.username)
  const month = currentDate.get('month') + 1 // Is 0-indexed
  const year = currentDate.get('year')

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ['blocked-dates', username, month, year],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          month,
          year,
        },
      })

      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const currentMonthDays = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => currentDate.set('date', i + 1))

    const firstWeekDay = currentDate.get('day')

    const previousMonthDays = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => currentDate.subtract(i + 1, 'day'))
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthDays = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => lastDayInCurrentMonth.add(i + 1, 'day'))

    const calendarDays = [
      ...previousMonthDays.map((date) => ({ date, disabled: true })),
      ...currentMonthDays.map((date) => ({
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDates.includes(date.get('date')),
      })),
      ...nextMonthDays.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          const week = i / 7 + 1
          const days = original.slice(i, i + 7)

          weeks.push({ week, days })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  function handlePreviousMonth() {
    setCurrentDate((state) => state.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate((state) => state.add(1, 'month'))
  }

  return (
    <Container>
      <Header>
        <Title>
          {currentMonth} <span>{currentYear}</span>
        </Title>

        <Actions>
          <button title="Previous month" onClick={handlePreviousMonth}>
            <CaretLeft />
          </button>

          <button title="Next month" onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </Actions>
      </Header>

      <Body>
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <Day
                    disabled={disabled}
                    onClick={() => onSelectDate(date.toDate())}
                  >
                    {date.get('date')}
                  </Day>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Body>
    </Container>
  )
}
