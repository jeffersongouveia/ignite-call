import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import { Container, Hero, Preview } from '@/pages/home/styles'
import appPreview from '../../../public/app-preview.png'

import ClaimUsernameForm from '@/pages/home/components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>

        <Text size="lg">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={appPreview}
          height={400}
          quality={100}
          priority
          alt="Pre-visualização de calendário no app"
        />
      </Preview>
    </Container>
  )
}
