import { Component, OnInit } from '@angular/core';
import { DISPURL } from '../../../../common/model/dispUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-querykind',
  templateUrl: './querykind.component.html',
  styleUrls: ['./querykind.component.css']
})
export class QuerykindComponent implements OnInit {
  index: number = 0;
  searchData: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;
  dataSet: any;
  tabs: Array<any> = [];
  interval: any;
  searchFormData: any = [];

  constructor(private http: HttpUtilService, private info: UserinfoService) {
    this.interval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }) }, 1000 * 60);
  }

  ngOnInit() {
    this.getallCodest();
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }

  listSearch(data: any) {
    console.log(data);
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    this.searchData = data;
    data.status = '40';
    this.searchData=data;
    if (this.index == 0) {
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index == 1) {
      data.gateCode = 'OF';
      this.getList(data);
      this.getStataByGate(data);
      // if (data.queryParameterList) {
      //   this.getStataByGate(data);
      // }
    } else if (this.index === 2) {
      data.gateCode = 'NF';
      this.getList(data);
      this.getStataByGate(data);
      // if (data.queryParameterList) {
      //   this.getStataByGate(data);
      // }
    }
  }
  // 获取表头
  getallCodest(): void {
    const tab: any = {};
    tab.itemCname = "全部";
    tab.itemCode = "root";
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            if (element.codesetCode == 'PZKRCDM') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              item.itemCount = 0;
              this.tabs.push(item)
            }
          });
          this.listSearch({ page: 1, length: this.pageSize });
        }
      }
    )

  }
  //获取全部老区新区数据
  getStataByGate(data: any): void {
    let sum: number = 0;
    data.status = "40";
    this.http.post(DISPURL.GETSTATABYKIND2, data).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          if (res.data.data.length == 0) {
            this.tabs.forEach(element => {
              element.itemCount = 0;
            });
          } else if (res.data.data.length > 0) {
            for (const reElement in this.tabs) {
              for (const element in res.data.data) {
                if (this.tabs[reElement].itemCode === res.data.data[element].gateCode) {
                  if (res.data.data[element].ct !== null) {
                    this.tabs[reElement].itemCount = res.data.data[element].ct;
                    sum += Number(res.data.data[element].ct);
                  }
                  break;
                } else {
                  this.tabs[reElement].itemCount = 0;
                }
              }
            }
          }
          this.tabs[0].itemCount = sum;
        }
      }
    )
  }

  selectChange(data: any): void {
    this.searchFormData.map((x: any) => {
      x.value1 = '';
      x.value2 = '';
      x.checked = false;
    })
    console.log(data);
    this.relistSearch({ page: 1, length: this.pageSize })
  }

  relistSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.status = '40';
    if (this.index === 0) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = "";
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index === 1) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = 'OF';
      this.getList(data);
      this.getStataByGate(data);
    } else if (this.index === 2) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.gateCode = 'NF';
      this.getList(data);
      this.getStataByGate(data);
    }
  }

  getList(data: any): void { //获取列表
    this.listLoading = true;
    console.log(data);
    this.http.post(DISPURL.GETRECORDSBYKIND, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          for(let i=0;i<this.dataSet.length;i++){
            let hour:any=Number(this.dataSet[i].entryLastTime)/60+"";
            hour=parseInt(hour,10)
            let min:any=Number(this.dataSet[i].entryLastTime)%60;
            if(Number(min)<10){
              min="0"+min
            }
            if(min=='00'){
              this.dataSet[i].entryLastTime=hour+"小时"
            }else{this.dataSet[i].entryLastTime=hour+"小时"+min+"分钟";}
            console.log(this.dataSet.entryLastTime)
          }
        }
      }
    )
  }

  searchDataFun(data: any) {
    console.log(data);
    this.searchFormData = data;
  }


}
