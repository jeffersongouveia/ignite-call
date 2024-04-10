import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'
import { NextSeo } from 'next-seo'

import ClaimUsernameForm from '@/pages/home/components/ClaimUsernameForm'

import appPreview from '../../../public/app-preview.png'
import { Container, Hero, Preview } from '@/pages/home/styles'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Home"
        description="Connect your calendar and let people schedule appointments in their free time."
      />

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
    </>
  )
}
