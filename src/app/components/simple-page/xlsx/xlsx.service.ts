import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var XLSX: any;

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor(
    private http: HttpClient,
  ) {}

  private read(wb: any, raw: boolean): { [key: string]: any[][] } {
    const ret: any = {};
    wb.SheetNames.forEach(name => {
      const sheet: any = wb.Sheets[name];
      ret[name] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: raw});
    });
    return ret;
  }

  /**
   * 导入Excel并输出JSON，支持 `<input type="file">`、URL 形式
   * @param rABS 加载数据方式 `readAsBinaryString` （默认） 或 `readAsArrayBuffer`，[更多细节](http://t.cn/R3n63A0)
   */
  import(
    fileOrUrl: File | string,
    raw?: boolean,
    rABS: 'readAsBinaryString' | 'readAsArrayBuffer' = 'readAsBinaryString',
  ): Promise<{ [key: string]: any[][] }> {
    return new Promise<{ [key: string]: any[][] }>((resolver, reject) => {
      // from url
      if (typeof fileOrUrl === 'string') {
        this.http
          .request('GET', fileOrUrl, { responseType: 'arraybuffer' })
          .subscribe(
            (res: ArrayBuffer) => {
              const wb = XLSX.read(new Uint8Array(res), { type: 'array' });
              resolver(this.read(wb, !!raw));
            },
            (err: any) => {
              reject(err);
            },
          );
        return;
      }
      // from file
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const wb: any = XLSX.read(e.target.result, { type: 'binary' });
        resolver(this.read(wb, !!raw));
      };
      reader[rABS](fileOrUrl);
    });
  }
}
