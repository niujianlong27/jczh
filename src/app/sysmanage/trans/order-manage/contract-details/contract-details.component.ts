/**
 * 合同明细查询
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {format} from 'date-fns';
@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {
  selectedData:any = [];
  businessModuleArr: Array<any> = [];
  list:any[] = [];
  searchData:any = {};
  total:number;
  length:number = 100;
  loading:boolean = false;
  allTotalPrice:number= 0;
  allTotalWeight:number = 0;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  search(data:any){
    this.searchData = data;
     if (this.searchData.queryParameterList && this.searchData.queryParameterList.length > 0 ) {
       this.searchData['queryParameterList'].forEach(item => {
         if (item.parameter == 'contractEffectiveDate' ){
           item.value1 = format(item.value1, 'YYYY-MM-DD');
           item.value2 = format(item.value2, 'YYYY-MM-DD');
         }
       })
     }
     this.getList(this.searchData);
  }
  btnClick(data: any){
     switch (data.buttonId){
        case 'export':
          this.export();
          break;
          default:
          break;
     }
  }
  private getList(param = {}){
    this.allTotalPrice = 0;
    this.allTotalWeight = 0;
    this.loading = true;
     this.http.post(TRANS_URLS.orderAndItem,param).subscribe(
      ((res:any)=>{
        this.loading = false;
        console.log(res)
        if(res.code = 100){
           this.list = res.data ? res.data.data : [];
           this.total = res.data && res.data.total;
        }
      })
     )
  };
  private export(){
    this.http.post(TRANS_URLS.exportorderAndItem,this.searchData,{responseType:'blob'}).subscribe((res:any)=>{
      if(res instanceof Blob ){
        const blob = new Blob([res], {type: 'application/pdf'});
        const objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = '合同明细.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    })
  }
  selectData(data){
    this.selectedData = data;
    this.allTotalPrice = this.selectedData.map((x: any) => x.totalPrice).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    this.allTotalWeight = this.selectedData.map((x: any) => x.totalWeight).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
  }
}
