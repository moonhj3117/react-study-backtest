import Syncbot from './Syncbot'
import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path';

const emptyImagedir = path.join(__dirname, "CALF.png");
createConnection().then((connection) => {
    const syncbot = new Syncbot()
    syncbot.syncStocks()
})
