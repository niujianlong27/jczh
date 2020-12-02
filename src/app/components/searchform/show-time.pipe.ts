import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showTime'
})
export class ShowTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      const arr = value.split(' ');
      return  arr[1] ? {nzFormat: arr[1]} : false;
    }else{
      return false;
    }
  }

}
