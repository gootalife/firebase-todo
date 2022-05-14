import { Task } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'utils/prisma'
import { getDateNow } from 'utils/date'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Partial<Task>
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { method, body } = req
  const date = getDateNow()
  try {
    switch (method) {
      case 'GET':
        const tasks = await prisma.task.findMany()
        res.status(200).json(tasks)
        break
      case 'POST':
        await prisma.task.create({
          data: {
            createdAt: date,
            updatedAt: date,
            title: body.title ?? '',
            content: body.content ?? ''
          }
        })
        res.status(200).json({})
        break
      case 'PUT':
        await prisma.task.update({
          where: {
            uuid: body.uuid
          },
          data: {
            updatedAt: date,
            title: body.title,
            content: body.content
          }
        })
        res.status(200).json({})
        break
      case 'DELETE':
        await prisma.task.delete({
          where: {
            uuid: body.uuid
          }
        })
        res.status(200).json({})
        break
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export default handler
