import { TextInput, Button } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'

import { Form } from '@/pages/home/components/ClaimUsernameForm/styles'

export default function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput size="sm" prefix="ignite.com/" placeholder="seu-usuario" />

      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
