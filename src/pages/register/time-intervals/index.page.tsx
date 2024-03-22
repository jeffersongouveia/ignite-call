import {
  Heading,
  Text,
  MultiStep,
  Checkbox,
  TextInput,
  Button,
} from '@ignite-ui/react'

import { Container, Header } from '@/pages/register/styles'
import {
  IntervalBox,
  IntervalsContainer,
  IntervalItem,
  IntervalDay,
  IntervalInputs,
} from '@/pages/register/time-intervals/styles'
import { ArrowRight } from 'phosphor-react'

export default function TimeIntervals() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Almost there</Heading>
        <Text>
          Define the range of times you are available each day of the week.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox>
        <IntervalsContainer>
          <IntervalItem>
            <IntervalDay>
              <Checkbox />
              <Text>Monday</Text>
            </IntervalDay>

            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>

          <IntervalItem>
            <IntervalDay>
              <Checkbox />
              <Text>Tuesday</Text>
            </IntervalDay>

            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>
        </IntervalsContainer>

        <Button type="submit">
          Next step
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
