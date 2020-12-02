import { format as dateformat } from 'date-fns';
import { addDays } from 'date-fns';
/**
 * 工具
 */
export class Utils {

    constructor() { }

    /**
     * 是否为空
     * @param value 值
     */
    static isEmpty(value: any): boolean {
        return value == null || typeof value === 'string' && value.length === 0;
    }

    /**
     * 是否不为空
     * @param value 值
     */
    static isNotEmpty(value: any): boolean {
        return !Utils.isEmpty(value);
    }

    /**
     * 是否数组
     * @param vaue 值
     */
    static isArray(value: any): boolean {
        return Array.isArray(value);
    }

    /**
     * 是否对象
     * @param vaue 值
     */
    static isObject(value: any): boolean {
        return typeof value === 'object' && !Utils.isArray(value);
    }

    /**
    * url中如果有双斜杠替换为单斜杠
    * @param url
    * @returns {string}
    */
    static replaceUrl(url) {
        if(-1!=url.indexOf('http://')){
            return 'http://' + url.substring(7).replace(/\/\//g, '/');
        }else if(-1!=url.indexOf('https://')){
            return 'https://' + url.substring(8).replace(/\/\//g, '/');
        }else{
            return url;
        }
    }

    /**
  * 日期对象转为日期字符串
  * @param date 需要格式化的日期对象
  * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
  * @example  dateFormat(new Date())                                "2017-02-28"
  * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
  * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 09:24:00"
  * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
  * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
  * @returns {string}
  */
    static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
        let time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.Year = date.getFullYear();
        time.TYear = String(time.Year).substr(2);
        time.Month = date.getMonth() + 1;
        time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
        time.Day = date.getDate();
        time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
        time.Hour = date.getHours();
        time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
        time.Minute = date.getMinutes();
        time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
        time.Second = date.getSeconds();
        time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
        time.Millisecond = date.getMilliseconds();

        return sFormat.replace(/yyyy/ig, String(time.Year))
            .replace(/yyy/ig, String(time.Year))
            .replace(/yy/ig, time.TYear)
            .replace(/y/ig, time.TYear)
            .replace(/MM/g, time.TMonth)
            .replace(/M/g, String(time.Month))
            .replace(/dd/ig, time.TDay)
            .replace(/d/ig, String(time.Day))
            .replace(/HH/g, time.THour)
            .replace(/H/g, String(time.Hour))
            .replace(/hh/g, time.Thour)
            .replace(/h/g, String(time.hour))
            .replace(/mm/g, time.TMinute)
            .replace(/m/g, String(time.Minute))
            .replace(/ss/ig, time.TSecond)
            .replace(/s/ig, String(time.Second))
            .replace(/fff/ig, String(time.Millisecond))
    }

    /**
     *  UUID生成
     *  @returns {string}
     */
    static UUID(): string {
        return 'xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,  (c)=> {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     *  短UUID生成
     *  @returns {string}
     */
    static shortUUID(): string {
        return 'xx-6xy'.replace(/[xy]/g, (c)=> {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(6);
        });
    }

    /**
     * 获得绝对位置
     * @param element
     * @param target
     */
    static absolutePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let targetOuterHeight = target.offsetHeight;
        let targetOuterWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let viewport = this.getViewport();
        let top, left;

        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
            if(top < 0) {
                top = 0 + windowScrollTop;
            }
        }
        else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
        }

        if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width)
            left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
        else
            left = targetOffset.left + windowScrollLeft;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    /**
     * 获得尺寸
     * @param element
     */
    static getHiddenElementDimensions(element: any): any {
        let dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return dimensions;
    }

    /**
     * 获得视图大小
     */
    static getViewport(): any {
        let win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;

        return { width: w, height: h };
    }

    /**
     * 获得窗口滚动高度
     */
    static getWindowScrollTop(): number {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    /**
     * 获得窗口滚动宽度
     */
    static getWindowScrollLeft(): number {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

     /**
     * 获得实际位置
     * @param element
     * @param target
     */
    static relativePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        let targetHeight = target.offsetHeight;
        let targetWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let viewport = this.getViewport();
        let top, left;

        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if(targetOffset.top + top < 0) {
                top = 0;
            }
        }
        else {
            top = targetHeight;
        }


        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }


    /**
     * 加
     *
     */
    static add(a: number|string,b: number|string){
        let c, d, e;
        try {
          c = a.toString().split(".")[1].length;
        } catch (f) {
          c = 0;
        }
        try {
          d = b.toString().split(".")[1].length;
        } catch (f) {
          d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
     }
  /**
     * 乘
     *
     */
     static mul(a:number | string, b:number|string) {
        let c = 0,
          d = a.toString(),
          e = b.toString();
        try {
          c += d.split(".")[1].length;
        } catch (f) {}
        try {
          c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
      }
  /**
     * 减
     *
     */
     static sub(a: number|string,b:number|string){
       let c, d, e;
       try {
         c = a.toString().split(".")[1].length;
       } catch (f) {
         c = 0;
       }
       try {
         d = b.toString().split(".")[1].length;
       } catch (f) {
         d = 0;
       }
       return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
     }
  /**
     * 除
     *
     */
     static div(a:number|string, b:number|string) {
       let c, d, e = 0,
         f = 0;
       try {
         e = a.toString().split(".")[1].length;
       } catch (g) {}
       try {
         f = b.toString().split(".")[1].length;
       } catch (g) {}
       return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
     }
/**
 *
 * @param data 类型判断
 */
static typeOf(obj: any) {
  const toString = Object.prototype.toString;
  const map = {
      '[object Boolean]'  : 'boolean',
      '[object Number]'   : 'number',
      '[object String]'   : 'string',
      '[object Function]' : 'function',
      '[object Array]'    : 'array',
      '[object Date]'     : 'date',
      '[object RegExp]'   : 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]'     : 'null',
      '[object Object]'   : 'object'
  };
  return map[toString.call(obj)];
}
/** 深复制*/
    static deepCopy(data: any) {
      const t = Utils.typeOf(data);
      let o: any;
        if (t === 'array') {
            o = [];
        } else if ( t === 'object') {
            o = {};
        } else {
            return data;
        }
        if (t === 'array') {
            for (let i = 0; i < data.length; i++) {
                o.push(Utils.deepCopy(data[i]));
            }
        } else if ( t === 'object') {
            for (const i in data) {
                o[i] = Utils.deepCopy(data[i]);
            }
        }
      return o;
    }

  /**
   * 格式化日期
   * @param date
   * @param time
   */
  static format(date: number, time?: number): string {
    const dateTemp = Math.floor(date);
    time = date - dateTemp;
    date = dateTemp;
    const dateStr = dateformat(addDays(new Date(1900, 0, date), -1), 'YYYY-MM-DD');
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
   * 判断是否为.xlsx  .xls格式
   */
  static isExcel(fileName):boolean {
    let index = fileName.lastIndexOf(".");
    let flag:boolean = false;
    if (index != -1) {
      let type = fileName.substring(index + 1, fileName.length).toLowerCase();
      if (type === 'xls' || type === 'xlsx') {
       flag = true;
      }
    }
    return flag;
  }

}
