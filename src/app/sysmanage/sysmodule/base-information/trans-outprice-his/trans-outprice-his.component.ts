import {Component, OnInit} from '@angular/core';
import {urls} from '../../../../common/model/url';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-trans-outprice-his',
  templateUrl: './trans-outprice-his.component.html',
  styleUrls: ['./trans-outprice-his.component.css']
})
export class TransOutpriceHisComponent implements OnInit {

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  data: any;
 
  // selectedCompany: any; // 当前公司

  constructor(private anhttp: HttpClient) {
  }
 
  
  ngOnInit() {

    this.listSearch({page: 1, length: this.pageSize});
  }

  btnClick(data) {
    switch (data.type.buttonId) {
      case 'Export': {
        this.export()
      }
        break;
  }
}

  // 列表查询数据获取
  getListSearch(data: any): void {
    let params:any = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectProd;
    params.data = data;
    this.data = {...data};
    this.anhttp.post(params.url,params.data).subscribe(
      (res: any) => {
        this.listLoading = false;
        if (res.code === 100) {
          this.dataSet = res.data.data || [];
          this.totalPage = res.data.total;
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }

  export(): void {  //导出
    let url: any = urls.outexportExcel;
    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `调价页面管理导出.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });


  }
}
