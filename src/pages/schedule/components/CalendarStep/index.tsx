import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { api } from '../../../../lib/axios'
import Calendar from '../../../../components/Calendar'

import { Container, Header, Item, List, TimePicker } from './styles'

interface CalendarStepProps {
  onSelectDate: (date: Date) => void
}

interface Availability {
  selectedHours: number[]
  availableHours: number[]
}

export default function CalendarStep({ onSelectDate }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const username = String(router.query.username)
  const isDateSelected = !!selectedDate
  const weekDay = isDateSelected ? dayjs(selectedDate).format('dddd') : ''
  const monthAndDate = isDateSelected
    ? dayjs(selectedDate).format('MMMM D')
    : ''

  const selectedDateWithoutTime = isDateSelected
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : ''

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', username, selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    enabled: isDateSelected,
  })

  function handleSelectTime(hour: number) {
    const dateAndTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDate(dateAndTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <Header>
            {weekDay}
            <span>, {monthAndDate}</span>
          </Header>

          <List>
            {availability?.selectedHours.map((hour) => (
              <Item
                key={hour}
                disabled={!availability?.availableHours.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {String(hour).padStart(2, '0')}:00
              </Item>
            ))}
          </List>
        </TimePicker>
      )}
    </Container>
  )
}
