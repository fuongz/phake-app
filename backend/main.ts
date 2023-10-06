import Fastify from 'fastify'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma'

const fastify = Fastify({
  logger: true,
})

fastify.register(prismaPlugin)

fastify.get('/info', (req: any, rep: any) => {
  return rep.status(200).send({
    status: 1,
    data: {
      database: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        name: process.env.DATABASE_NAME,
      },
    },
  })
})

fastify.get('/config/:name', async (req: any, rep) => {
  const { name } = req.params
  if (!name)
    rep.status(404).send({
      status: 0,
      message: 'Config not found',
    })
  const config = await fastify.prisma.config.findFirstOrThrow({
    where: {
      name: req.params?.name,
      status: '1',
    },
  })

  return rep.status(200).send({
    status: 1,
    data: config,
  })
})

fastify.patch('/config/:id', async (req: any, rep) => {
  const { description } = req.body
  const { id } = req.params
  if (!id)
    return rep.status(404).send({
      status: 0,
      message: 'Config not found',
    })
  if (!description)
    return rep.status(404).send({
      status: 0,
      message: 'Invalid "description" data',
    })

  const config = await fastify.prisma.config.update({
    where: {
      id: parseInt(id),
    },
    data: {
      description,
    },
  })

  return rep.status(200).send({
    status: 1,
    message: 'Updated',
    data: config,
  })
})

const main = async () => {
  try {
    await fastify.register(cors, {
      origin: ['http://localhost:3662'],
    })
    await fastify.listen({ port: 3001 })
  } catch (err: any) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log('localhost:3001')
  })
  .catch(() => {
    console.log('catch')
  })
