import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'
import api from './api'
import searchEngin from './searchengin'
import statistics from './statistics'
import { serverConfig } from './config'
import { normalizePort } from './util/stringUtil'

/**
 * 爬虫任务 + 爬虫后日志分析
 *
 */
// function timer () {
//   searchEngin()
//     .then(() => statistics.collect())
//     .then(() => {
//       setTimeout(() => {
//         timer()
//       }, 60 * 1000 * 10)
//     })
// }
// timer()

/**
 * 分析定时任务
 */
// schedule.scheduleJob('0 10 0 * * *', () => {
//   statistics.timeTask()
// })

var app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.use(nuxt.render)

const port = normalizePort(serverConfig[process.env.NODE_ENV].port)
const host = process.env.HOST || '127.0.0.1'

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
