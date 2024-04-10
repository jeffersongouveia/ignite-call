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

  const date = `${year}-${month.padStart(2, '0')}`

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    select
      extract(day from s.date) as date,
      count(s.date) as amount,
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60) size
    from schedulings s
      left join user_time_intervals uti on uti.week_day = extract(dow from s.date + interval '1 day')
    where s.user_id = ${user.id}
      and extract(year from s.date) = ${year}::int
      and extract(month from s.date) = ${month}::int
    group by
      extract(day from s.date),
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)
    having
      count(s.date) >= ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)
  `

  const blockedDates = blockedDatesRaw.map((i) => i.date)

  return res.json({ blockedWeekDays, blockedDates })
}
