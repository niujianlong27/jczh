import { format as dateformat } from 'date-fns';
import extend from 'extend';
import { parse, differenceInCalendarDays, addMonths, addDays, addHours, addMinutes, addSeconds } from 'date-fns';
/**
 * 工具类(海运模块封装)
 */
export class Utils {

    constructor() { }

    static formatMonth = 'YYYY-MM-DD 00:00:00';
    static formatDay = 'YYYY-MM-DD 00:00:00';
    static formatHour = 'YYYY-MM-DD HH:mm:00';
    static formatMinute = 'YYYY-MM-DD HH:mm:00';
    static formatTime = 'YYYY-MM-DD HH:mm:ss';

    /**
     * 求和
     * @param arr 
     */
    static sum(arr: Array<string | number>): number{
        return arr ? arr.map(item => Number(item)).reduce((acc, cur) => acc + cur, 0) : 0;
    }

    /**
     * 求和
     * @param arr 
     * @param key 
     */
    static sumByKey(arr: Array<any>, key: string): number{
        return arr ? arr.map(item => Number(item[key])).reduce((acc, cur) => acc + cur, 0) : 0;
    }

    /**
     * 数组去重
     * @param arr 
     */
    static distinct(arr: Array<string>): Array<string> {
        var seen = {};
        return arr.filter(item => seen.hasOwnProperty(item) ? false : (seen[item] = true));
    }

  /** 深复制*/
  static deepCopy(obj: any) {
    const result = extend(true, { }, { _: obj });
    return result._;
  }

    /**
     * 格式化日期
     * @param date
     * @param time
     */
    static formatByNumber(date: number, time?: number): string {
        const dateTemp = Math.floor(date);
        time = date - dateTemp;
        date = dateTemp;
        const dateStr = dateformat(addDays(new Date(1900, 0, date), -1), Utils.formatDay);
        if (!time) {
            return `${dateStr} 00:00:00`;
        }
        let temp;
        const hour = Math.floor(temp = time * 24);
        const minute = Math.floor(temp = (temp - hour) * 60);
        const second = Math.ceil(temp = (temp - minute) * 60);

        return `${dateStr} ${hour}:${minute}:${second === 60 ? 59 : second}`;
    }

    /**
     * 日期格式化(处理yyyy-MM-dd不兼容问题)
     * @param date 
     * @param format 
     */
    static dateformat2(date: Date | string, format?: string): string{
        if (format) {
            const formatArr = format.split(" ");
            format = formatArr[0].toUpperCase() + (formatArr[1] ? " " + formatArr[1] : "");
        }
        format = format || Utils.formatDay;
        return Utils.dateformat(date, format); 
    }

    /**
     * 日期格式化
     * @param date 
     * @param format 
     */
    static dateformat(date: Date | string, format?: string): string{
        return date ? dateformat(date, format) : null; 
    }

    /**
     * 日期格式化
     * @param date 
     * @param type M=月 D=日 H=小时 m=分钟 s=秒
     */
    static format(date: Date | string, type?: 'M' | 'D' | 'H' | 'm' | 's' | string): string {
        switch (type) {
            case 'M': return Utils.dateformat(date, Utils.formatMonth);
            case 'D': return Utils.dateformat(date, Utils.formatDay);
            case 'H': return Utils.dateformat(date, Utils.formatHour);
            case 'm': return Utils.dateformat(date, Utils.formatMinute);
            case 's': return Utils.dateformat(date, Utils.formatTime);
            default: return Utils.dateformat(date, Utils.formatDay);
        }
    }



    /**
     * 日期计算
     * @param date 
     * @param computeString 
     * @param format 
     */
    static computeDate(date: Date | string, computeString: string, format?: string): string{
        if(!/^[M,D,H,m,s][\+,\-]\d+$/.test(computeString)){
            return null;
        }
        date = date || new Date();
        const type = computeString.substring(0,1);
        const amount = Number(computeString.substr(1));
        const res = Utils.addDate(date, amount, type);
        return format ? Utils.dateformat2(res, format) : Utils.format(res, type);
    }

    /**
     * 日期计算
     * @param date 
     * @param amount 
     * @param type M=月 D=日 H=小时 m=分钟 s=秒
     */
    static addDate(date: Date | string, amount: number,  type?: 'M' | 'D' | 'H' | 'm' | 's' | string): Date{
        switch (type) {
            case 'M': return addMonths(date, amount);
            case 'D': return addDays(date, amount);
            case 'H': return addHours(date, amount);
            case 'm': return addMinutes(date, amount);
            case 's': return addSeconds(date, amount);
            default: return addDays(date, amount);
        }
    }

    /**
     * 大小比较
     * @param a 
     * @param b 
     * @param type 
     */
    static compareFn(a: any, b: any, type?: 'string' | 'number'): number {
        if (type === 'number') {
            a = Number(a);
            b = Number(b);
        }
        return a === b ? 0 : a > b ? 1 : -1;
    }

    /**
     * 当前日期之前
     * @param current 
     * @param endDate 
     */
    static beforeNowDate(current: Date | string, endDate?: Date | string): boolean {
        const startDate = parse(current);
        const beforeNow = differenceInCalendarDays(new Date(), startDate) > 0;
        return endDate ? beforeNow || differenceInCalendarDays(startDate, parse(endDate)) > 0 : beforeNow;
    }

    /**
     * 指定日期之前
     * @param current 
     * @param startDate 
     */
    static beforeDate(current: Date | string, startDate: Date | string): boolean {
        return differenceInCalendarDays(parse(startDate), parse(current)) > 0
    }

    /**
     * 流向字符串拼接
     * @param pallet 
     */
    static getFlowDesc(pallet: any): string {
        let flowDesc = pallet.startPoint;
        if (pallet.startAddress) {
            flowDesc += `-${pallet.startAddress}`;
        }
        flowDesc += ` → ${pallet.endPoint}`;
        if (pallet.endAddress) {
            flowDesc += `-${pallet.startAddress}`;
        }
        return flowDesc;
    }

    /**
     * 获取集装箱描述字符串
     * @param palletItems 
     */
    static getContainerDesc(palletItems: Array<any>): string {
        const data = palletItems.filter(item => item.containerType && item.containerNo);
        return Utils.distinct(data.map(item => item.containerType))
            .map(type => type + ':' + data.filter(item => type === item.containerType)
                .map(item => Number(item.containerNo)).reduce((acc, cur) => acc + cur, 0)).join(",");
    }

    /**
     * 获取集装箱描述字符串
     * @param pallets 
     */
    static getPalletContainerDesc(pallets: Array<any>): string {
        const data = pallets.filter(item => item.containerDesc).map(item => item.containerDesc.split(","))
            .reduce((acc, cur) => acc.concat(cur ? cur : []), []).map(item => {
                const arr = item.split(":");
                return { containerType: arr[0], containerNo: arr[1] };
            });
        return Utils.getContainerDesc(data);
    }

}
