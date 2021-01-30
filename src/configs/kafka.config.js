const ip = require('ip')

const host = process.env.HOST_IP || ip.address()

module.exports = {
  clientId: 'ecommerce-kafka',
  brokers: [`${host}:9092`],
}