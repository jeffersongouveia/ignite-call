import Calendar from '../../../../components/Calendar'

import { Container, Header, Item, List, TimePicker } from './styles'

export default function CalendarStep() {
  const isDateSelected = true

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar />

      {isDateSelected && (
        <TimePicker>
          <Header>
            Thursday, <span>March 28</span>
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
