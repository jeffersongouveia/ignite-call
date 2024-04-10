import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import dayjs from 'dayjs'
import z from 'zod'

import { prisma } from '../../../../lib/prisma'
import { getGoogleOAuthToken } from '../../../../lib/google'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const createScheduleBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string().nullable(),
    date: z.string().datetime(),
  })

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { name, email, observations, date } = createScheduleBody.parse(req.body)

  const schedulingDate = dayjs(date).startOf('hour')
  const isDateInPast = schedulingDate.isBefore(new Date())

  if (isDateInPast) {
    return res.status(400).json({
      error: 'Cannot schedule a date in the past',
    })
  }

  const conflictingSchedule = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingSchedule) {
    return res.status(409).json({
      error: 'There is already a schedule for this date and time',
    })
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [
        {
          displayName: name,
          email,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
