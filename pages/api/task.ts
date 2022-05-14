import { Task } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'utils/prisma'
import { getDateNow } from 'utils/date'
import admin from 'firebase-admin'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Partial<Task>
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { method, body, headers } = req
  if (!headers.authorization) {
    res.status(401).json({})
  } else {
    try {
      const token = await admin.auth().verifyIdToken(headers.authorization.substring('Bearer '.length))
      const date = getDateNow()
      switch (method) {
        case 'GET':
          const tasks = await prisma.task.findMany({
            where: {
              userId: token.uid
            }
          })
          res.status(200).json(tasks)
          break
        case 'POST':
          await prisma.task.create({
            data: {
              userId: token.uid,
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
              id: body.id
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
              id: body.id
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
}

export default handler
