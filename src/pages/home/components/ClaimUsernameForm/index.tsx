import { TextInput, Button, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Form,
  FormAnnotation,
} from '@/pages/home/components/ClaimUsernameForm/styles'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Minimum 3 characters' })
    .max(20, { message: 'Maximum 20 character' })
    .regex(/^([a-z0-9-_]+)$/i, {
      message: 'Letters, numbers, hífen and dash only',
    })
    .transform((value) => value.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export default function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />

        <Button size="sm" type="submit">
          Reserve
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">{errors.username ? errors.username.message : ''}</Text>
      </FormAnnotation>
    </>
  )
}
