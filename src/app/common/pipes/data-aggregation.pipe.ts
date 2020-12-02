import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '@util/utils';

@Pipe({
  name: 'dataAggregation'
})
export class DataAggregationPipe implements PipeTransform {

  // Array数据汇总，args必传
  transform(value: Array<any>, args?: string | symbol): any {
    let data = 0;
    if (Utils.isArray(value) && args) {
      for (const param of value) {
        if (param.hasOwnProperty(args)) {
          data = Utils.add(data, param[args]);
        }
      }
    }
    return data;
  }

}
