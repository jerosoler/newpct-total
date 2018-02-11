import express from 'express'
import { Nuxt, Builder } from 'nuxt'

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const bodyParser = require('body-parser');

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

server.use(middlewares)
server.use((req, res, next) => {
  var str = req.headers.origin;
  if(str == undefined) {
    if(req.method == 'PUT') {
      next()
    } else {
      res.sendStatus(401);
    }

  } else {
    var n = str.lastIndexOf(":");
    var n2 = str.length;
    var cadena = str.substr(n+1, n2-n)
    if(cadena == port) {
    next();
   } else {
     res.sendStatus(401);
   }
 }
})


server.use(router)

server.listen(3001, () => {
  console.log('JSON Server is running')
})

import api from './api'



const app = express()
app.use(bodyParser.json()); // for parsing application/json



app.set('port', port)

// Import API Routes
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

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port)
console.log('Server listening on localhost' + port) // eslint-disable-line no-console
