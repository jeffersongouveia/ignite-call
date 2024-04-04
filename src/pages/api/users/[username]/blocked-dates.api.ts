import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../lib/prisma'

type QueryProps = {
  username: string
  month: string
  year: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username, month, year } = req.query as QueryProps

  if (!month || !year) {
    return res.status(400).json({ error: 'Must provide month and year' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekDay) =>
      !availableWeekDays.some((available) => available.week_day === weekDay),
  )

  return res.json({ blockedWeekDays })
}
