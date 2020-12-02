import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {ImgViewerService} from '@component/img-viewer/img-viewer.service';
import {urls} from '../../../../common/model/url';
@Component({
  selector: 'app-check-user-info',
  templateUrl: './check-user-info.component.html',
  styleUrls: ['./check-user-info.component.css']
})
export class CheckUserInfoComponent implements OnInit {
  dataSet:any=[];
  pageSize = 30;
  totalPage:any;
  tempSearchParam:any;
  listLoading = false;
  userData:any={}
  btnLoading = false;
  modalTitle:any;
  validateForm:FormGroup;
  tplModal: NzModalRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,private imgService: ImgViewerService,
              private info: UserinfoService,
              private cm:CommonService,) { }


  ngOnInit() {
    this.searchList({page:1,length:30})
  }

  searchList(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }
  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = urls.selectUserData
    this.listLoading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.forEach(item=>{
          item.auditStatus=item.auditStatusName;
        })
      }
    })
  }

  btnClick(data:any){

  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }

  /*
  * 关闭弹窗
  */
  handerCancel(){
  this.tplModal.destroy()
    this.userData = {}
  }

  /*
  * 审核通过
  */
  auditPass(){
    this.http.post(urls.auditPass,this.userData).then(res=>{
      if(res.success){
        this.nz.success('提示信息','审核成功')
        this.tplModal.destroy()
        this.userData={};
        this.getList(this.tempSearchParam);
      }
    })
  }

  /*
  * 审核失败
  */
  auditreject(){
    this.http.post(urls.auditreject,this.userData).then(res=>{
      if(res.success){
        this.nz.success('提示信息','驳回成功')
        this.tplModal.destroy()
        this.userData={};
        this.getList(this.tempSearchParam);
      }
    })
  }

  /*
  * 查看按钮
  */
  seeData(data:any){
    this.http.post(urls.viewUserData,data).then(res=>{
      if(res.success){
        this.userData = res.data&&res.data.data||{};
      }
    })
    this.modalTitle = "查看";
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '60%',
      nzMaskClosable: false,
      nzClosable: true,
    })
  }

  /*
  *  审核按钮
  */
  auditData(data:any){
    this.http.post(urls.viewUserData,data).then(res=>{
      if(res.success){
        this.userData = res.data&&res.data.data||{};
      }
    })
    this.modalTitle = "审核";
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '60%',
      nzMaskClosable: false,
      nzClosable: true,
    })
  }

  imgClick(type:any){
    if(type==='cardPhoto'){
      this.imgService.viewer({url:this.userData.cardPhoto})
    }else if(type==='cardPhotoBadge'){
      this.imgService.viewer({url:this.userData.cardPhotoBadge})
    }else if(type==='busiLicense'){
      this.imgService.viewer({url:this.userData.busiLicense})
    }else if(type==='transRoadPermit'){
      this.imgService.viewer({url:this.userData.transRoadPermit})
    }
  }
}
