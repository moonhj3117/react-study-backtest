import { hi } from "date-fns/locale";
import { RawHistorycalPrice } from "../../finance-api/getHistoricalPrice";
import {format} from 'date-fns'
import { info } from "console";

type MonthlyHistorycalPrice = {
    closeDate: string,        //end date of month
    baseDate: string,          // yyyy-MM    
    high: number,
    low: number,
    open : number,
    close: number,
    adjstedClose: number,
    volume: number,
}
export function groupByMonth(historicalPrices: RawHistorycalPrice[]){
    return historicalPrices.reduce((acc, current) => {
        const date = new Date(current.date);
        const baseDate = format(date, 'yyyy-MM')
        const priceInfo = acc.find( (info) => info.baseDate === baseDate);

       
        if(!priceInfo){
            acc.push({
                baseDate,
            close: current.close,
            adjstedClose: current.adjClose,
            closeDate: current.date,
            high: current.high,
            low: current.low,
            open: current.open,
            volume: current.volume,
            })
        }else{
            priceInfo.high = Math.max(priceInfo.high, current.high)
            priceInfo.low = Math.max(priceInfo.low, current.low)
            priceInfo.open = current.open;
            priceInfo.volume += current.volume
        }
        return acc
    }, [] as MonthlyHistorycalPrice[])
}