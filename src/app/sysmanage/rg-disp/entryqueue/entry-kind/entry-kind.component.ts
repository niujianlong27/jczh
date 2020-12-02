import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {RGDISPURL} from '../../../../common/model/rgDispUrl';

@Component({
  selector: 'app-entry-kind',
  templateUrl: './entry-kind.component.html',
  styleUrls: ['./entry-kind.component.css']
})
export class EntryKindComponent implements OnInit {

  tabs: Array<any> = [];
  dataSet:any = [];
  listLoading:any;
  pageSize1:any = 30;
  totalPage:any;
  tempSearchParam:any={};
  tabArr:Array<any>=[];
  arr:any =[];
  kindCode:any="";
  interval: any;//定时器
  constructor( private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {

  }

  ngOnInit() {
    this.getallCodest();
    //查询接口放在获取表头接口后面，防止获取数据接口调用的比表头接口快
    //this.listSearch({page: 1, length: this.pageSize1});
    this.interval = setInterval(() => {
			this.setQueueingTime();
		}, 1000 * 60);
  }

  ngOnDestroy() {
		// 清除定时器
		clearInterval(this.interval);
  }
  
  /**
   * 计算排队时长
   */
	setQueueingTime() {
		const curDateTime = new Date().getTime();
		this.dataSet.map((item) => {
			if (item.entryTime) {
				const entryWaitTime = curDateTime - new Date(item.entryTime.replace(/-/g, '/')).getTime();
				const hours = Math.trunc(entryWaitTime / (1000 * 60 * 60));
				const minutes = Math.trunc((entryWaitTime % (1000 * 60 * 60)) / (1000 * 60));
				if (hours > 0) {
					item.entryWaitTime = hours + '小时' + minutes + '分';
				} else if (minutes >= 0) {
					item.entryWaitTime = minutes + '分';
				}
				// if(hours > 47){
				//   item._bgColor='#f86c6b';
				// }else if(hours > 23){
				//   item._bgColor='#ffbf00';
				// }else {
				//   item._bgColor = "";
				// }
			}
			// if(item.status == 'disp_queueDetailStatus_27'){
			//   item._bgColor = '#63c2de';
			// }
		});
	}

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    data.kindCode = this.tempSearchParam.kindCode ? this.tempSearchParam.kindCode : this.kindCode;
    // data.kindCode = '';
    //setTimeout(this.getList1(data),1);
    this.getList1(data);
  }


  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = RGDISPURL.getRecordsByKind;
    let url1 = RGDISPURL .getStataByKindCount;
    this.listLoading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.setQueueingTime();
      }
    })
    //let sum:number=0;
    this.tabs.forEach(item=>{
      item.itemCount = 0;
    })
    this.http.post(url1,{ 'kindCode' : this.kindCode}).then(res => {
      if (res.success) {
        console.log('获取数量的接口');
        for (let i = 0 ; i < res.data.data.length ; i++) {
          for ( let j = 1 ; j < this.tabs.length ; j++ ) {
              if ( res.data.data[i].kindCode === this.tabs[j].itemCode ) {
                this.tabs[j].itemCount = res.data.data[i].ct;
              }
          }
          this.tabs[0].itemCount += res.data.data[i].ct;
        }
      }
    });
  }

    // 获取表头
    getallCodest(): void {
    //let test:Array<any>=[]
      const tab: any = {};
      tab.itemCname = '全部';
      tab.itemCode = '';
      tab.itemCount = 0;
      tab.formId = 'form_rgDisp_entryKind0';
      tab.status = true;
      this.tabs.push(tab);
      // test.push(tab);
      // test.push({itemCname:'合金',itemCode:'disp_matKind_HJ',itemCount:0,formId:'form_rgDisp_entryKind0',status:true});
      // test.push({itemCname:'废钢',itemCode:'disp_matKind_FG',itemCount:0,formId:'form_rgDisp_entryKind1',status:true});
      // test.push({itemCname:'焦炭',itemCode:'disp_matKind_JT',itemCount:0,formId:'form_rgDisp_entryKind0',status:true});
      // test.push({itemCname:'原料',itemCode:'disp_matKind_YL',itemCount:0,formId:'form_rgDisp_entryKind0',status:true});
      // test.push({itemCname:'煤',itemCode:'disp_matKind_MT',itemCount:0,formId:'form_rgDisp_entryKind0',status:true});
      // this.http.post(RGDISPURL.GETAllCODESET, {}).then(
      //   (res: any) => {
      //     if (res.success) {
      //       res.data.data.forEach(element => {
      //         if (element.codesetCode == 'PZKRCDM') {
      //           const item: any = {};
      //           item.itemCname = element.itemCname;
      //           item.itemCode = element.itemCode;
      //           item.itemCount = 0;
      //           this.tabs.push(item)
      //         }
      //       });
      //     }
      //   }
      // )
      
    this.http.post(RGDISPURL.GETCODESET, {'codesetCode' : 'disp.matKind'}).then(
      (res: any) => {
        if (res.success) {
          console.log('获取表头的接口');
          console.log(res.data.data);
          res.data.data.forEach(element => {
            //排队大类名称
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              item.itemCount = 0;
              item.formId = '';
              item.status = true;
              this.tabs.push(item);
          });
          this.listSearch({page: 1, length: this.pageSize1});
        }
      }
    );
    
     // this.tabs = test;





    }

  select(data:any){
    this.tempSearchParam.kindCode = data;
    this.getList1(this.tempSearchParam);
  }


  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  // btnDataReturn(data:any){
  //     console.log(data)
  //     this.tabArr.push(data);
  //     if(this.tabArr.length<=1){
  //       this.controlTabs(this.tabArr[0])
  //     }
  // }


  // controlTabs(data:any){
  //   let arr:any=[]
  //   for(let j = 0;j<this.tabs.length;j++){
  //     for(let i =0;i<data.length;i++){
  //       if(data[i].buttonName===this.tabs[j].itemCname){
  //         arr.push(this.tabs[j])
  //       }
  //     }
  //   }
  //   this.tabs = arr
  //   for(let i= 1;i<arr.length;i++){
  //     if(i!=arr.length-1){
  //       this.kindCode += `${arr[i].itemCode}|`
  //     }else{
  //       this.kindCode += arr[i].itemCode
  //     }
  //   }
  //   this.kindCode = `^(${this.kindCode})`

  //   this.listSearch({page: 1, length: this.pageSize1,kindCode:this.kindCode})
  // }

}
