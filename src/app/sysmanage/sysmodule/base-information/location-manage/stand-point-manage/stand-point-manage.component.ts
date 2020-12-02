/**
 * 非标准地址管理界面
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
@Component({
  selector: 'app-stand-point-manage',
  templateUrl: './stand-point-manage.component.html',
  styleUrls: ['./stand-point-manage.component.css']
})
export class StandPointManageComponent implements OnInit {

  constructor(private info: UserinfoService, private http: HttpClient, private mess: NzMessageService, private nm: NzModalService) { }
  private searchData: any = {};
  rowid: string;
  loading: boolean = false;
  listData: any[] = [];
  total: string;
  selectedCompany: any;
  selectedDataList: any[] = [];
  modalFormVisible: boolean;
  status: string;
  params: any = {};
  private tplModal: NzModalRef; // 弹窗相关
  btnDisabled: any = {
    updateStand: true
  }
  btnLoading: any = {
    updateStand: false
  }
  private permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  ngOnInit() {
  }
  btnclick(data:any) {
    switch(data.type.buttonId){
      case 'Update':
          this.btnUpdate();
        break;
    }
  }
    //更新
   private btnUpdate(): void {
      if (!this.selectedData || this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后修改！'
        });
        this.destroyTplModal();
        return;
      }
      if (!this.selectedData || this.selectedData.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行修改！'
        });
        this.destroyTplModal();
        return;
      }
      this.rowid = this.selectedData[0].rowid;
      this.modalFormVisible = true;
      this.status = 'update';
      this.params = {...this.selectedData[0]};
  
    }
    updateList(data:string){
      this.searchData.page = 1;
      this.getList(this.searchData);
    }
    destroyTplModal(): void {
      window.setTimeout(() => {
        this.tplModal.destroy();
      }, 1500);
    };
  /**
   * 
   * @param data 
   * 查询触发
   */
  search(data:any){
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.searchData = data;
    this.getList(this.searchData);
  }
  /**
   * 获取列表
   */
  private getList(param = {}){
    this.loading = true;
    this.http.post(`${environment.baseUrl}point/getStandPoint`,param).subscribe((res:any) => {
      this.loading = false;
      if(res.code === 100){
         this.listData = res.data.data;
         this.total = res.data.total;
         this.btnDisabled.updateStand = true;
         this.selectedDataList = [];
      }
    })
  }
  companyChange(): void {
    this.searchData.page = 1;
    this.getList(this.searchData);
  }
  /**
   * 
   * @param data 
   
  /**
   * 点击选择获取数据
   */
  selectedData(data:any){
    this.selectedData = data;
    if(data.lenth){
       this.btnDisabled.updateStand = false;
    }
  }
}
