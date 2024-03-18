import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import { Container, Hero, Preview } from '@/pages/home/styles'
import ClaimUsernameForm from '@/pages/home/components/ClaimUsernameForm'

import appPreview from '../../../public/app-preview.png'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Scheduling made easy
        </Heading>

        <Text size="lg">
          Connect your calendar and let people schedule appointments in their
          free time.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={appPreview}
          height={400}
          quality={100}
          priority
          alt="In-app calendar preview"
        />
      </Preview>
    </Container>
  )
}
