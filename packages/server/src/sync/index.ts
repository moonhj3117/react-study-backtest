import Syncbot from './Syncbot'
import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path';
import * as fs from 'fs'; 
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

const emptyImagedir = path.join(__dirname, "CALF.png");
async function hash(){
    const result = await readFile(emptyImagedir, 'hex');
    console.log(result);
    
}

hash();

createConnection().then((connection) => {
    const syncbot = new Syncbot()
    syncbot.syncStocks()
})
