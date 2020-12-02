import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { portUrl } from '../../../../common/model/portUrl';

@Component({
  selector: 'app-ship-collect2',
  templateUrl: './ship-collect2.component.html',
  styleUrls: ['./ship-collect2.component.css']
})
export class ShipCollect2Component implements OnInit {

  loading: boolean = false;
  total: number = 0;
  result: Array<any> = [];

  loadingPda: boolean = false;
  totalPda: number = 0;
  resultPda: Array<any> = [];

  tabIndex: number = 0;

  selectedData: Array<any> = [];

  // printCSS: string[];
  // printStyle: string;
  // printBtnBoolean = true;

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
  ) {
    // this.printCSS = ['http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css'];
    // this.printStyle =
    //   `
    //   th, td {
    //     color: black !important;
    //  }
    //  `;
  }

  // printComplete() {
  //   this.printBtnBoolean = true;
  //   console.log("--------printComplete---------");
  // }
 
  // beforePrint() {
  //   this.printBtnBoolean = false;
  //   console.log("--------beforePrint---------");
  // }

  ngOnInit() {

  }

  initalSearch: any;
  /**
   * 自定义查询区域准备就绪时回调
   * @param search 自定义查询控件ref
   */
  _initalSearch(search) {
    this.initalSearch = function () {
      search.listSearch();
    }
    // 执行初始画面查询
    // this.initalSearch();
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'ColletAudit': this.confirmLoad(); break;
      case 'ColletCancel': this.confirmNotLoad(); break;
      case 'Matching': this.matchPdaCollect(); break;
      case 'Import': this.msg.warning("该功能待开发"); break;
      default: this.msg.error("该按钮未绑定事件，请联系相关技术人员"); break;
    }
  };


  /**
   * 查询
   * @param param 
   */
  listSearch(param: any) {
    if (this.tabIndex === 0) {
      this.query(param);
    } else if (this.tabIndex === 1) {
      this.queryPda(param);
    } else {
      console.error("未知的tab下标！");
    }

  }

  /**
   * tab页切换响应方法
   */
  tabIndexChanged(): void {
    if (this.tabIndex === 1)
      this.initalSearch();
  }


  /**
   * 分页查询
   * @param param 
   */
  query(param: any): void {
    if (!param.queryParameterList || param.queryParameterList.length == 0) {
      this.msg.warning("请输入查询条件后查询");
      return;
    }
    this.loading = true;
    this.http.post(portUrl.workSchedulePack, { ...param }).then(
      (res: any) => {
        if (res.success) {
          this.result = res.data.data.data || [];
          this.total = res.data.data.total || 0;

          this.selectedData = [];
        }
        this.loading = false;
      }
    );
  }

  /**
   * pda采集信息分页查询
   * @param param 
   */
  queryPda(param: any): void {
    if (!param.queryParameterList || param.queryParameterList.length == 0) {
      this.msg.warning("请输入查询条件后查询");
      return;
    }
    this.loadingPda = true;
    this.http.post(portUrl.pdaCollectPack, { ...param }).then(
      (res: any) => {
        if (res.success) {
          this.resultPda = res.data.data.data || [];
          this.totalPda = res.data.data.total || 0;
        }
        this.loadingPda = false;
      }
    );
  }

  /**
   * 匹配pda采集信息
   */
  matchPdaCollect() {
    if (!this.result || this.result.length === 0) {
      this.msg.error("作业计划捆包数据为空，请输入正确的查询条件，查询后进行匹配操作");
      return;
    }
    this.http.post(portUrl.matchPdaCollect, { workScheduleItems: this.result }).then(
      (res: any) => {
        if (res.success) {
          const collects = res.data.data || [];
          this.result.forEach(item => {
            if (item.rowid) {
              const temp = collects.find(collect => item.rowid === collect.rowid);
              temp && (item.loadStatus = temp.loadStatus);
            } else {
              item.loadStatus = 3;
            }
            if (item.loadStatus === '1') {
              item.isLoad = 'CBDD50';
            }
            item.checked = true;
          })

        }
      }
    );
  }

  /**
   * 装船采集
   */
  confirmLoad() {
    if (!this.selectedData || this.selectedData.length === 0) {
      this.msg.error("请至少选择一条作业计划捆包进行采集操作");
      return;
    }
    this.selectedData.forEach(item => item.status = item.isLoad);
    this.http.post(portUrl.confirmLoad, { workScheduleItems: this.selectedData }).then(
      (res: any) => {
        if (res.success) {
          this.msg.success("采集操作成功");
          this.initalSearch();
        }
      }
    );
  }

  /**
   * 取消采集
   */
  confirmNotLoad() {
    if (!this.selectedData || this.selectedData.length === 0) {
      this.msg.error("请至少选择一条作业计划捆包进行取消采集操作");
      return;
    }
    this.http.post(portUrl.confirmNotLoad, { workScheduleItems: this.selectedData }).then(
      (res: any) => {
        if (res.success) {
          this.msg.success("取消采集操作成功");
          this.initalSearch();
        }
      }
    );
  }

  // 禁用按钮
  btnDisable: any = {
    ColletAudit: false, // 采集确认
    ColletCancel: false,  // 取消采集
    Matching: false,  // 匹配
    Import: false  // 导入
  };

  /**
   * checkbox点击触发事件
   * @param data 
   */
  checkboxClick(data: Array<any>) {
    this.selectedData = data || [];

    // this.btnDisable.ColletAudit = this.selectedData.length === 0 || this.selectedData.some(item => item.status !== 'CBDD30' && item.status !== 'CBDD40');

    // this.btnDisable.ColletCancel = this.selectedData.length === 0 || this.selectedData.some(item => item.status !== 'CBDD30' && item.status !== 'CBDD50');

    // this.btnDisable.Matching = this.selectedData.length === 0;
  }

}
