import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { getStockProfile } from '../finance-api/getStockProfile';
import { getSectorWeightings } from '../finance-api/getSectorWeightings';
import { getHistoricalPrice } from '../finance-api/getHistoricalPrice';
import { groupByMonth } from './lib/groupByMonth';
import { HistoricalPrice } from '../entity/HistoricalPrice';
import { Asset } from '../entity/Asset';
import { AssetType } from '../entity/AssetType';
import { downloadStockLogo } from './lib/downloadStockLogo';
import { getRepository } from 'typeorm';
import { AssetMeta } from '../entity/AssetMeta';
import { SectorWeighting } from '../entity/SectorWeighting';
import cliProgress from 'cli-progress';

const tickersDir = path.resolve(__dirname, 'tickers');
const LIMIT = 5
const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);
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
    const exists = await getRepository(Asset).findOne({where : {ticker}})
    if(exists){
      return exists
    }
    const assetType = await getRepository(AssetType).findOne({ 
      where: {
      type: 'U.S. Stock' 
      }
    });
    const profile = await getStockProfile(ticker);
    const rawhistoricalPrices = await getHistoricalPrice(ticker);

    const sectorWeightingsData = profile.sector === ''
      ? await getSectorWeightings(ticker)
      : null;
    const monthlyHistorycalPrices = groupByMonth(rawhistoricalPrices);


    const asset = new Asset();
    asset.name = profile.companyName;
    asset.description = profile.description;
    asset.assetype = assetType;
    asset.ipo_date = new Date(profile.ipoDate);
    asset.is_etf = profile.sector === '';
    asset.sector = profile.sector || null;
    asset.ticker = ticker
       
    try {
      const imageDir = path.resolve(
        __dirname,
        'logos/us_stocks',
        `${ticker}.png`,
      );
      await downloadStockLogo(ticker, imageDir);
      asset.image = `/logos/us_stock/${ticker}.png`;
    } catch (e) {}
    const assetMeta = new AssetMeta();
    assetMeta.asset = asset;
    assetMeta.price = profile.price;
    assetMeta.changes = profile.changes;
    assetMeta.is_tracking = false;
    assetMeta.market_cap = profile.mktCap;

    // await getRepository(Asset).save(asset);
    await getRepository(AssetMeta).save(assetMeta);
    
    if (sectorWeightingsData) {
      const sectorWeightings = sectorWeightingsData.map((sw) => {
        const sectorWeighting = new SectorWeighting();
        sectorWeighting.asset = asset;
        sectorWeighting.percentage = parseFloat(sw.weightPercentage);
        sectorWeighting.sector = sw.sector;
        return sectorWeighting;
      })
      await getRepository(SectorWeighting).save(sectorWeightings);
    }

    const historcalPrices = monthlyHistorycalPrices.map(mhp => {
      const historicalPrice = new HistoricalPrice();
      historicalPrice.asset = asset;
      historicalPrice.volume = mhp.volume;
      historicalPrice.close = mhp.close;
      historicalPrice.date = new Date(mhp.closeDate);
      historicalPrice.high = mhp.high;
      historicalPrice.low = mhp.low;
      historicalPrice.type = 'monthly'
      historicalPrice.open = mhp.open;
      historicalPrice.adjusted_close = mhp.adjstedClose;
      return historicalPrice;
    })
    await getRepository(HistoricalPrice).save(historcalPrices);
    return asset;
  }

  async syncStocks() {
    const tickers = await this.loadTickers();
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );
    const errorsDir = path.resolve(__dirname, 'error_tickers.txt');
    bar.start(tickers.length, 0);

    let busyWorkers = 0;
    const failedTickers: string[] = [];
    while (tickers.length > 0 || busyWorkers !== 0) {
      if (busyWorkers >= LIMIT || tickers.length === 0) {
        await sleep(6);
        continue;
      }
      busyWorkers += 1;
      const ticker = tickers.pop();
      this.syncStock(ticker!)
        .catch((e) => {
          console.log(e);
          failedTickers.push(ticker!);
          appendFile(errorsDir, `${ticker}\n`, 'utf8');
        })
        .finally(() => {
          busyWorkers -= 1;
          bar.increment(1);
        });
    }
    bar.stop();
  }
}
export default Syncbot;
