import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'

import { Actions, Form, Header } from './styles'

export default function ConfirmStep() {
  function handleConfirmScheduling() {
    console.log('Scheduling confirmed')
  }

  return (
    <Form as="form" onSubmit={handleConfirmScheduling}>
      <Header>
        <Text>
          <CalendarBlank />
          March 28, 2023
        </Text>

        <Text>
          <Clock />
          18:00
        </Text>
      </Header>

      <label>
        <Text size="sm">Your name</Text>
        <TextInput placeholder="Your name" />
      </label>

      <label>
        <Text size="sm">E-mail</Text>
        <TextInput type="email" placeholder="johndoe@example.com" />
      </label>

      <label>
        <Text size="sm">Observations</Text>
        <TextArea />
      </label>

      <Actions>
        <Button type="button" variant="tertiary">
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </Actions>
    </Form>
  )
}
