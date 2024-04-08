import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

import { prisma } from '../../../../lib/prisma'

type QueryProps = {
  username: string
  date: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username, date } = req.query as QueryProps

  if (!date) {
    return res.status(400).json({ error: 'Missing date' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const emptyAvailability = {
    selectedHours: [],
    availableHours: [],
  }

  const referenceDate = dayjs(date)
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json(emptyAvailability)
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json(emptyAvailability)
  }

  const startHour = userAvailability.time_start_in_minutes / 60
  const endHour = userAvailability.time_end_in_minutes / 60

  const selectedHours = Array.from({
    length: endHour - startHour,
  }).map((_, i) => startHour + i)

  const dateFormat = 'YYYY-MM-DD[T]HH:mm:ss[.000Z]'
  const referenceStart = referenceDate.set('hour', startHour).format(dateFormat)
  const referenceEnd = referenceDate.set('hour', endHour).format(dateFormat)

  const blockedHours = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceStart,
        lte: referenceEnd,
      },
    },
  })

  const availableHours = selectedHours.filter((hour) => {
    const isTimeBlocked = blockedHours.some(
      (i) => i.date.getUTCHours() === hour,
    )
    const isTimeInPast = referenceDate.set('hour', hour).isBefore(new Date())
    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({
    selectedHours,
    availableHours,
  })
}
