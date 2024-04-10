import { Heading, Text, MultiStep, Button } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { Container, Header } from '@/pages/register/styles'
import {
  ConnectBox,
  ConnectItem,
  AuthError,
} from '@/pages/register/connect-calendar/styles'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Connect Google Calendar" noindex />

      <Container>
        <Header>
          <Heading as="strong">Connect your calendar!</Heading>
          <Text>
            Connect your calendar to automatically check busy hours and new
            events as they are scheduled.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>

            {isSignedIn ? (
              <Button size="sm" disabled>
                Connected
                <Check />
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleConnectCalendar}>
                Connect
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError>
              There was an error connecting to your calendar. Please try again.
            </AuthError>
          )}

          <Button type="submit" disabled={!isSignedIn} onClick={handleNextStep}>
            Next step
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
