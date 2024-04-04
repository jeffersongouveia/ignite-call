import { useState } from 'react'
import dayjs from 'dayjs'

import Calendar from '../../../../components/Calendar'
import { Container, Header, Item, List, TimePicker } from './styles'

export default function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const weekDay = isDateSelected ? dayjs(selectedDate).format('dddd') : ''
  const monthAndDate = isDateSelected
    ? dayjs(selectedDate).format('MMMM D')
    : ''

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
            <Item>08:00</Item>
            <Item>09:00</Item>
            <Item>10:00</Item>
            <Item disabled>11:00</Item>
            <Item disabled>12:00</Item>
            <Item>13:00</Item>
            <Item>14:00</Item>
            <Item>15:00</Item>
            <Item>16:00</Item>
            <Item>17:00</Item>
            <Item>18:00</Item>
          </List>
        </TimePicker>
      )}
    </Container>
  )
}
