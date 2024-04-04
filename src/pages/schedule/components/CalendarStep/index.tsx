import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { api } from '../../../../lib/axios'
import Calendar from '../../../../components/Calendar'

import { Container, Header, Item, List, TimePicker } from './styles'

interface Availability {
  selectedHours: number[]
  availableHours: number[]
}

export default function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability | null>(null)

  const router = useRouter()

  const username = String(router.query.username)
  const isDateSelected = !!selectedDate
  const weekDay = isDateSelected ? dayjs(selectedDate).format('dddd') : ''
  const monthAndDate = isDateSelected
    ? dayjs(selectedDate).format('MMMM D')
    : ''

  useEffect(() => {
    const fetchAvailability = async () => {
      const config = {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      }

      const response = await api.get(`/users/${username}/availability`, config)
      setAvailability(response.data)
    }

    if (isDateSelected) {
      fetchAvailability()
    }
  }, [isDateSelected, selectedDate, username])

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
