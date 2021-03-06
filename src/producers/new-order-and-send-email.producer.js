// PRODUZ MENSAGENS DE NOVOS PEDIDOS

const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const CurrencyUtil = require('../shared/currency.util')
const { ECOMMERCE_NEW_ORDER, ECOMMERCE_SEND_EMAIL } = require('../shared/topics.constant')
const kafkaConfig = require('../configs/kafka.config')

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  ...kafkaConfig,
})
const producer = kafka.producer()

const getRandomNumber = () => Math.round(Math.random(10) * 1000)

const sendNewOrder = (numOrder) => {
  return producer
    .send({
      topic: ECOMMERCE_NEW_ORDER,
      compression: CompressionTypes.GZIP,
      messages: [{ /* key: numOrder, */ value: `Pedido ${numOrder} no valor de ${CurrencyUtil.format(getRandomNumber())}` }]
    })
    .then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const sendEmail = () => {
  return producer
    .send({
      topic: ECOMMERCE_SEND_EMAIL,
      compression: CompressionTypes.GZIP,
      messages: [{ /* key: numOrder, */ value: 'Thank you for your order! We are processing your order!' }]
    })
    .then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const run = async () => {
  await producer.connect()
  let numOrder = 1;
  setInterval(() => {
    sendNewOrder(numOrder)
    sendEmail()
    numOrder++;
  }, 2000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})