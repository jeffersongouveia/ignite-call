import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { Heading, Text, MultiStep, TextInput, Button } from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import { Container, Header, Form, FormError } from '@/pages/register/styles'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Minimum 3 characters' })
    .max(20, { message: 'Maximum 20 character' })
    .regex(/^([a-z0-9-_]+)$/i, {
      message: 'Letters, numbers, hífen and dash only',
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'Minimum 3 characters' }).max(50),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', data)
      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
      }
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Welcome to Ignite Call</Heading>
        <Text>Let&apos;s create your profile, it&apos;s quick!</Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Your username</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="your-username"
            {...register('username')}
          />

          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Your display name</Text>
          <TextInput placeholder="Display name" {...register('name')} />

          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
