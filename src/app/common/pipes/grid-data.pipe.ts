import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { isNum } from '../validators/validator';
interface gridDataArgs{
  type:string;
  format?:string;
}
@Pipe({
  name: 'gridData',
  pure: true
})
export class GridDataPipe implements PipeTransform {
 /** 
  * args 必传 格式gridDataArgs
 */
  transform(value: any, args: gridDataArgs): any {
    let result:String;
  switch(args.type){
     case 'number':
      if((value && isNum(value) )&& (args.format && isNum(args.format))){
        result = Number(value).toFixed( Number(args.format) );
      }else{
        result = value;
      }
     break;
     case 'date':
      const f = args.format ? args.format.replace('yyyy-MM-dd','YYYY-MM-DD') : 'YYYY-MM-DD HH:mm:ss';
      result = value ? format(value,f) : value;
     break;


     case 'string':
     case 'select':
     case 'pop':
     default:
     result = value;
     break;
  }
    return result;
  }

}
