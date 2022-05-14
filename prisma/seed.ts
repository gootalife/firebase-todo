import prisma from '../utils/prisma'
import { getDateNow } from '../utils/date'

const main = async () => {
  await prisma.task.create({
    data: {
      createdAt: getDateNow(),
      updatedAt: getDateNow(),
      title: 'test1',
      content: 'content1'
    }
  })
  await prisma.task.create({
    data: {
      createdAt: getDateNow(),
      updatedAt: getDateNow(),
      title: 'test2',
      content: 'content2'
    }
  })
  console.log('Seeding:Done')
}

main()
  .catch((err) => {
    console.log(err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
