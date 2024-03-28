import { CaretLeft, CaretRight } from 'phosphor-react'

import getWeekDays from '../../utils/get-week-days'
import { Actions, Body, Container, Day, Header, Title } from './styles'

export default function Calendar() {
  const weekDays = getWeekDays({ short: true })

  return (
    <Container>
      <Header>
        <Title>March 2024</Title>

        <Actions>
          <button>
            <CaretLeft />
          </button>
          <button>
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
