import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { getStockProfile } from '../finance-api/getStockProfile';
import { getSectorWeightings } from '../finance-api/getSectorWeightings';
import { getHistoricalPrice } from '../finance-api/getHistoricalPrice';
import { groupByMonth } from './lib/groupByMonth';
import { HistoricalPrice } from '../entity/HistoricalPrice';
import { Symbol} from '../entity/Symbol';

const tickersDir = path.resolve(__dirname, 'tickers');

const readFile = util.promisify(fs.readFile);
class Syncbot {
  async parseTickers(name: string) {
    const data = await readFile(path.join(tickersDir, `${name}.txt`), 'utf8');
    const lines = data.split('\n');
    const tickers = lines
      .map((line) => line.split('\t')[0])
      .filter((ticker) => !ticker.includes('.'));
    return tickers;
  }
  async loadTickers() {
    const tickers = await this.parseTickers('initial');
    return tickers;
  }

  async syncStock(ticker: string) {
    const profile = await getStockProfile(ticker)
    const historicalPrices = await getHistoricalPrice(ticker)
    
    const sectorWeightings = profile.sector
      ? await getSectorWeightings(ticker)
      : null;
    const monthlyHistorycalPrices = groupByMonth(historicalPrices);
    const symbol = new Symbol()
  }

  async syncStocks() {
    // const tickers = await this.loadTickers()
    // const profile = await getStockProfile('VV')
    // const sectorWeightings = await getSectorWeightings('VV')
    const hp = await getHistoricalPrice('VV');
    console.log(groupByMonth(hp));
    // console.log(sectorWeightings);
  }
}
export default Syncbot;
