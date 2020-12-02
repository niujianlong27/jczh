import {Component, Input, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {UserinfoService} from '@service/userinfo-service.service';
import {Utils} from '@util/utils';
import {GlobalService} from '@service/global-service.service';

@Component({
  selector: 'app-muti-col',
  templateUrl: './muti-col.component.html',
  styleUrls: ['./muti-col.component.css']
})
export class MutiColComponent implements OnInit {

  @Input() formId: string; // formId 优先级高
  @Input() gridId: string; // 一个页面多个列表必填，传gridId以进行区分，
  @Input() changedHeaders: any[] = []; // 有改变的头部字段

  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('footer') footer: TemplateRef<any>;

  private nzModalRef: NzModalRef; // 弹窗创建
  loading: boolean; // 载入状态

  header: Array<any> = [
    { name: '列名', cName: 'colCname', type: 'string', edit: 0, checked: 0, width: '90px'},
    { name: ' 列显示 ', cName: 'checked', type: 'string', edit: 0, checked: 1, width: '70px'},
    { name: '宽度 ', cName: 'width', type: 'string', edit: 1, checked: 0, width: '75px'},
    { name: '顺序 ', cName: 'sortId', type: 'string', edit: 1, checked: 0, width: '75px'},
    { name: '备注 ', cName: 'remark', type: 'string', edit: 0, checked: 0, width: '50px'},
     ];

  dataSet: Array<any> = []; // 接受数据
  dataSetBackup: Array<any> = []; // 备份数据
  indeterminate: boolean;
  allChecked: boolean;
  tplModal: NzModalRef;
  tableHeight: string;
  public btnloading: boolean;
  constructor(private modalService: NzModalService,
    private http: HttpUtilService,
    private info: UserinfoService,
    private nn: NzNotificationService,
    private globalSer: GlobalService) { }

  ngOnInit() {
  }
  heightValue(data: number) {
     this.tableHeight = `${data}px`;
  }
  // 弹窗创建
  createmodal(): void {
    this.loading = true;
    this.nzModalRef  = this.modalService.create(
      {
        nzTitle: '界面列设置',
        nzContent: this.content,
        nzFooter: this.footer,
      }
    );
    this.nzModalRef.afterClose.subscribe(() => {
        this.dataSet = [];
        this.nzModalRef.destroy();
      }
    ); // 弹窗关闭后操作
    this.getUserColumns({	formId: this.formId || this.info.APPINFO.formId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId});
  }

  // 确定时触发
  modalConfirm(): void {
    const status = this.dataSet.filter(value => value.checked).every(value => value.width&&value.sortId);
    if (!status) {
      this.tplModal = this.modalService.warning({
        nzTitle: '提示信息',
        nzContent: '请填写完全！'
      });
      this.destroyTplModal();
      return;
    }
    this.saveData();
  }

  // 取消触发
  modalCancel(): void {
    this.dataSet = [];
    this.dataSetBackup = [];
    this.nzModalRef.destroy();
  }

  // 保存数据
  saveData(): void {
    this.btnloading = true;
    this.http.post(`${environment.baseUrl}userColumn/setUserColumnSet`, { havaList: this.dataSetBackup, noList: this.dataSet
    }).then(
      (res: any) => {
        this.btnloading = false;
        if (res.success) {
          this.nn.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.nzModalRef.destroy();
          this.globalSer.colChangeEmitter.emit();
        }

      }
    );

  }

  // 数据获取
  getUserColumns(param: any): void {
    this.http.post(`${environment.baseUrl}userColumn/getUserColumnSet`, param).then( (res: any) => {
        if (res.success) {
          this.dataSet = Utils.deepCopy(res.data.data);
          this.dataSetBackup = Utils.deepCopy(res.data.data);
          this.dataSet.map((x: any) => {
            const obj = this.changedHeaders.filter((y: any) => y.colEname === x.colEname);
                  x.width = parseFloat(obj[0] && obj[0].width || x.width);
                  if (obj[0] && x.colEname === obj[0].colEname) {
                      x.checked = true;
                  }
          });
          this.allChecked = this.dataSet.every(x => x.checked);
          this.indeterminate = !this.allChecked && this.dataSet.some(x => x.checked);
          this.loading = false;
        }

      }
    );

  }

  checkAll(value: boolean) {
    this.dataSet = this.dataSet ? this.dataSet : [];
    this.dataSet.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  refreshStatus() {
    let allChecked: boolean, allUnChecked: boolean;
    allChecked = this.dataSet.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.dataSet.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

}
