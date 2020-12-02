import { Component, OnInit } from '@angular/core';
import { DISPURL } from '../../../../common/model/dispUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-trans-task',
  templateUrl: './trans-task.component.html',
  styleUrls: ['./trans-task.component.css']
})
export class TransTaskComponent implements OnInit {
  pageSize: number = 30;
  searchData: any;  //存储查询的数据
  dataSet: Array<any> = [];//表格里数据
  totalPage: number = 1;
  //transportType:string;
  // GateArr:Array<any>=[];
  // TypeArr:Array<any>=[];
  listLoading: boolean = true;
  constructor(private http: HttpUtilService, private info: UserinfoService) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize })
  }
   // 列表查询
   listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    this.searchData = data;
    this.getListSearch(data);
  }
  // getallCodest(): void {
  //   //下拉框
  //   this.http.post(DISPURL.GETAllCODESET, {}).then(
  //     (res: any) => {
  //       if (res.success) {
  //         res.data.data.forEach(element => {
  //           //排队大队名称
  //           if (element.codesetCode == 'disp.gate') {
  //             const item: any = {};
  //             item.itemCname = element.itemCname;
  //             item.itemCode = element.itemCode;
  //             this.GateArr.push(item)
  //           }
  //           if (element.codesetCode == 'disp.trans') {
  //             const item: any = {};
  //             item.itemCname = element.itemCname;
  //             item.itemCode = element.itemCode;
  //             this.TypeArr.push(item)
  //           }
  //           console.log(this.GateArr.length+"this is length")
  //         });
  //       }
  //     }   
  //   )
  // }

   //获取列表查询数据
   getListSearch(data: any): void {
    this.listLoading = true;
    const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.GETTRANSTASKLIST;//查询集合或者对象
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
         this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }
}
