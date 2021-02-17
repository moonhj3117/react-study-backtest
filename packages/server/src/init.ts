import 'dotenv/config'
import 'reflect-metadata'
import { createConnection, getRepository } from 'typeorm'
import { SymbolType } from './entity/SymbolType';



createConnection().then(async (connection) => {
    const repo = getRepository(SymbolType);
    const symbolTypes = await repo.find();
    if(symbolTypes.length > 0){
        console.error('SymbolType is already initialized');
        connection.close();
        return;
    }
    const usStock = new SymbolType();
    usStock.type = 'U.S. Stock';
    await repo.save(usStock);
    console.log('SymbolType is now initialized');    
    connection.close();
})