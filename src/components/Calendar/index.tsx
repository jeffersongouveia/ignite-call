import { useState } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'

import getWeekDays from '../../utils/get-week-days'
import { Actions, Body, Container, Day, Header, Title } from './styles'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const weekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Day disabled>1</Day>
            </td>
            <td>
              <Day>2</Day>
            </td>
            <td>
              <Day>3</Day>
            </td>
          </tr>
        </tbody>
      </Body>
    </Container>
  )
}
