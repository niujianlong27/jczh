import { Pipe, PipeTransform } from '@angular/core';
interface filterDataArgs{
  param?:string;
}
@Pipe({
  name: 'filterData',
  pure: true
})
export class FilterDataPipe implements PipeTransform {
 /** 
  * args 
 */
  transform(value: any, args: filterDataArgs): any {
      if (!value) {
        return [];
      };
      if (!args) {
        return value;
      }
      const result = value.filter(x => x.text.indexOf(args) != -1);
      return result;
  }

}
