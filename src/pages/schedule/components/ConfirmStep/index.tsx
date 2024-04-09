import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { z } from 'zod'

import { api } from '../../../../lib/axios'
import { Actions, Error, Form, Header } from './styles'

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
  email: z.string().email({ message: 'Invalid e-mail' }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export default function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  const headerDate = dayjs(schedulingDate).format('MMMM D, YYYY')
  const headerTime = dayjs(schedulingDate).format('HH:mm')

  async function handleConfirmScheduling(data: ConfirmFormData) {
    await api.post(`/users/${username}/schedule`, {
      ...data,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  return (
    <Form as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <Header>
        <Text>
          <CalendarBlank />
          {headerDate}
        </Text>

        <Text>
          <Clock />
          {headerTime}
        </Text>
      </Header>

      <label>
        <Text size="sm">Your name</Text>
        <TextInput placeholder="Your name" {...register('name')} />
        {errors.name && <Error size="sm">{errors.name.message}</Error>}
      </label>

      <label>
        <Text size="sm">E-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && <Error size="sm">{errors.email.message}</Error>}
      </label>

      <label>
        <Text size="sm">Observations</Text>
        <TextArea {...register('observations')} />
      </label>

      <Actions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirm
        </Button>
      </Actions>
    </Form>
  )
}
