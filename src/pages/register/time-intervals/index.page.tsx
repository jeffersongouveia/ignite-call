import {
  Heading,
  Text,
  MultiStep,
  Checkbox,
  TextInput,
  Button,
} from '@ignite-ui/react'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import getWeekDays from '@/utils/get-week-days'
import { Container, Header } from '@/pages/register/styles'
import {
  IntervalBox,
  IntervalsContainer,
  IntervalItem,
  IntervalDay,
  IntervalInputs,
  FormError,
} from '@/pages/register/time-intervals/styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
        enabled: z.boolean(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((i) => i.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'At least one week day must be selected',
    }),
})

type TimeIntervalsFormData = z.infer<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, startTime: '08:00', endTime: '18:00', enabled: false },
        { weekDay: 1, startTime: '08:00', endTime: '18:00', enabled: true },
        { weekDay: 2, startTime: '08:00', endTime: '18:00', enabled: true },
        { weekDay: 3, startTime: '08:00', endTime: '18:00', enabled: true },
        { weekDay: 4, startTime: '08:00', endTime: '18:00', enabled: true },
        { weekDay: 5, startTime: '08:00', endTime: '18:00', enabled: true },
        { weekDay: 6, startTime: '08:00', endTime: '18:00', enabled: false },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const weekDays = getWeekDays()

  console.debug(errors)

  async function handleSetTimeIntervals(data: TimeIntervalsFormData) {
    console.debug(data)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Almost there</Heading>
        <Text>
          Define the range of times you are available each day of the week.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked: CheckedState) =>
                        field.onChange(checked === true)
                      }
                      checked={field.value}
                    />
                  )}
                />

                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>

              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                  {...register(`intervals.${index}.startTime`)}
                />

                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                  {...register(`intervals.${index}.endTime`)}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.root?.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
