import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'value2label'})
export class ValueToLabelPipe implements PipeTransform {
  transform(value: string, options: Array<any>): string {
    if(!value){
      return value;
    }
    if(options && options.length > 0){
      const opt = options.find(item => item.itemCode==value) || options.find(item => item.value==value);
      if(opt){
        return opt.itemCname || opt.label;
      }
    }
    return value;
  }
}