import spider from './spider.js'

import ant from './ant.js'

import http from 'http'
import Server from 'socket.io'

import { vd, vdSocket, hawk, vdb, biliAPI, stateGetPending, stateSocket, cState } from './interface/index.js'

import { site, num, info, active, live, guard, macro, fullGuard, guardType, status } from './database.js'

import snake from './snake.js'
import { worm, wormResult } from './worm.js'

import { connect, infoFilter, linkDanmaku } from './socket.js'
import httpAPI from './http.js'

const PARALLEL = 16
const INTERVAL = 1000 * 60 * 5

const io = new Server({ serveClient: false })
linkDanmaku({ cState, io })
stateSocket.on('log', log => io.to('state').emit('stateLog', log))
vdb.bind(io)
const server = http.createServer(httpAPI({ vdb, info, fullGuard, active, live, num, macro, guard }))
io.attach(server)
vd.attach(server)
spider({ PARALLEL, INTERVAL, vdb, db: { site, info, active, guard, guardType, status }, io, worm, biliAPI, infoFilter, stateGetPending })
snake({ vdSocket, io, info })
hawk({ io })
ant({ vdb, macro, num, info, fullGuard, guardType, INTERVAL, io, biliAPI })
io.on('connection', connect({ io, vdb, macro, site, num, info, active, guard, fullGuard, guardType, PARALLEL, INTERVAL, wormResult, status }))
server.listen(8001)
