import Syncbot from './Syncbot'
import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {downloadStockLogo} from './lib/downloadStockLogo';
import path from 'path';
import * as fs from 'fs'; 
import * as util from 'util';
import crypto from 'crypto';

// const readFile = util.promisify(fs.readFile);

// const emptyImagedir = path.join(__dirname, "CALF.png");
// async function hashfile(){
//     const result = await readFile(emptyImagedir, 'hex');
//     const hash = crypto.createHash('md5').update(result).digest('hex');
//     return hash;    
// }

createConnection().then(async (connection) => {
    const syncbot = new Syncbot()
    await syncbot.syncStocks()
    connection.close();
    // syncbot.syncStock('VV');
})
