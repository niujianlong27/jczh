import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {environment} from '@env/environment';
import {NzNotificationService} from 'ng-zorro-antd';
import {GlobalService} from '@service/global-service.service';

@Component({
  selector: 'app-muti-search',
  templateUrl: './muti-search.component.html',
  styleUrls: ['./muti-search.component.css']
})
export class MutiSearchComponent implements OnInit {
  @Input() gridId: string;
  @Input() formId: string; // 优先级高
  @Input() requiredArr: any[] = []; // 必填的字段,内容为查询区域字段格式
  @Input() size: 'small' | 'default' | 'large' = 'default';
  // 方案
  // 方案表头
  planHeaderData: Array<any> = [
    {name: '查询方案名称', eName: 'ggggggg'},
    {name: '默认选择', eName: 'aaaaaaaa'}
  ];

  // 方案数据
  planData: Array<any> = [];

  // 方案所有数据
  allData;
  // 方案是哪个
  isDefault: string;
  // 要修改数据
  planUpdate: Array<any> = [];
  // 设置方案新增修改
  status: string;

  // 设置查询方案
  // 数据
  setPlanData: Array<any> = [];

  // 方案对话框
  // 状态
  planVisible = false;
  // 按钮加载状态
  isOkLoading = false;

  // 设置方案对话框
  // 状态
  setPlanVisible = false;
  // 通过表名所查到列名值
  colNameArray: Array<any> = [];
  // 方案名
  planName: string;

  // 全选
  allChecked = false;
  // 选择状态
  indeterminate = false;

  rowid: string;
  selectedHidden: { [key: string]: any } = {}; // 选择框列表隐藏
  nzDisabled = false; // 下拉选择禁用状态
  outHeightValue: string;
  innerHeightValue: string;
  public loading = true;
  constructor(
    private http: HttpUtilService,
    private info: UserinfoService,
    private notification: NzNotificationService,
    private glo: GlobalService) {
  }

  ngOnInit() {
  }

  outHeight(data: number) {
    this.outHeightValue = `${data}px`;
  }

  innerHeight(data: number) {
    this.innerHeightValue = `${data}px`;
  }

  // 按钮
  // 高级搜索按钮触发
  showModal(): void {
    this.planVisible = true;
    this.getPlanData();
  }

  // 方案对话框
  // 确认
  planOk(): void {
    if (this.planUpdate.length === 0) {
      this.notification.remove();
      this.notification.error('提示消息', '选中后操作！');
      return;
    }
    this.findSetData(this.planUpdate[0]);
  }

  // 对话框取消
  planCancel(): void {
    this.planVisible = false;

  }

  // 编辑
  planEditor(): void {
    this.status = 'update';

    if (!this.planUpdate || this.planUpdate.length < 1) {
      this.notification.remove();
      this.notification.error('提示消息', '请选中后操作！');
      return;
    }

    for (const data of this.planUpdate) {
      this.nzDisabled = data.sys === 'sys';
    }

    this.getColumnByformId();
  }

  // 添加
  planAdd(): void {
    this.status = 'add';
    this.getColumnByformId();
  }

  // 删除
  planDelete(): void {

    if (!this.planUpdate || this.planUpdate.length < 1) {
      this.notification.remove();
      this.notification.error('提示消息', '选中后操作！');
      return;
    }

    for (const data of this.planUpdate) {
      if (data.sys !== 'sys') {
      } else {
        this.notification.remove();
        this.notification.error('提示消息', '不能删除系统默认方案！');
        return;
      }
    }
    this.setPlanDelete();
  }

  // 设置默认按钮
  planSetDef(): void {
    if (!this.planUpdate || this.planUpdate.length < 1) {
      this.notification.remove();
      this.notification.error('提示消息', '选中后操作！');
      return;
    }

    if (this.allData.isDefault === this.planUpdate[0].findName) {
      this.notification.remove();
      this.notification.error('提示消息', '已为默认，无需操作！');
      return;
    } else {
      if (this.planUpdate[0].sys) {
        this.allData.isDefault = 'sys';
      } else {
        this.allData.isDefault = this.planUpdate[0].findName;
      }
    }
    this.setDef();
  }

  // 选中逻辑
  refreshStatus(data: any): void {
    const currentChecked = data.checked;
    this.planUpdate = [];
    this.planData.map(
      (res) => {
        res.checked = false;
      }
    );
    data.checked = currentChecked;
    if (data.checked) {
      this.planUpdate.push(data);
    }
  }

  // 关闭后逻辑
  nzAfterClose() {
    this.planUpdate = [];
    this.allData = [];
    this.status = '';
    this.planData = [];
  }

  // 设置方案对话框
  // 确认
  setPlanOk(): void {
    if (this.nzDisabled) {
      this.setPlanVisible = false;
      return;
    }
    if (!this.planName) {
      this.notification.remove();
      this.notification.error('提示消息', '请填写方案名称！');
      return;
    }

    if (this.setPlanData.length === 0) {
      this.notification.remove();
      this.notification.error('提示消息', '请添加数据后再保存！');
      return;
    }

    const blank = this.setPlanData.every(res => res.eName && res.relation && res.logic);

    if (!blank || !this.planName) {
      this.notification.remove();
      this.notification.error('提示消息', '请将*标识部分填写完整！');
      return;
    }
    const validates: any[] = [];
    this.requiredArr.map(x => {
      const isexist = this.setPlanData.some(y => y.eName === x.parameter);
      if (!isexist) {
        validates.push(x.name);
      }
    });
    if (validates.length) {
      this.notification.error('提示信息', `${validates.join('、')}为必选条件项！`);
      return;
    }
    const arr: Array<any> = [];
    for (const data of this.setPlanData) {
      const dataTemplate = {
        parameter: '',
        query: '',
        formId: '',
        value1: data.value1,
        value2: '',
        postQuery: '',
      };
      dataTemplate.parameter = data.eName;
      dataTemplate.query = data.relation;
      dataTemplate.postQuery = data.logic;
      arr.push(dataTemplate);
    }
    if (this.status === 'update') {
      this.setPlanUpdate(arr);
      return;
    }
    if (this.status === 'add') {
      this.setPlanAdd(arr);
    }

  }

  // 取消
  setPlanCancel(): void {
    this.setPlanVisible = false;
  }

  // 设置查询方案关闭后操作
  setPlanAfterClose() {
    this.setPlanData = [];
    this.planName = '';
    this.nzDisabled = false;
  }

  // 添加
  add() {
    // this.setPlanData.push({
    //   eName: '',
    //   relation: '',
    //   logic: '',
    // });
    this.setPlanData = [...this.setPlanData, {}];
    this.setPlanRefreshStatus();
  }

  // 移除
  remove() {
    this.setPlanData = this.setPlanData.filter(data => !data.checked);
    this.isNotSelected();
    this.setPlanRefreshStatus();
  }

  // 全选
  checkAll(value: boolean): void {
    this.setPlanData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.setPlanRefreshStatus();
  }

  // 选择逻辑
  setPlanRefreshStatus(): void {
    const validData = this.setPlanData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 编辑时初始化
  throughAdding(data: any): void {
    const convertingObjects: any = {eName: '', relation: '', logic: '', value1: null};
    const isexist = this.requiredArr.some(x => x.parameter === data.parameter);
    if (isexist) {
      convertingObjects.disabled = true;
      convertingObjects.eName_disabled = true;
    }
    convertingObjects.eName = data.parameter;
    convertingObjects.relation = data.query;
    convertingObjects.logic = data.postQuery;
    convertingObjects.value1 = data.value1;
    this.setPlanData.push(convertingObjects);
  }

  // 添加数据
  setPlanAdd(data: any): void {
    const params = {
      url: '',
      data: {
        userId: this.info.APPINFO.USER.userId,
        formId: this.formId || this.info.APPINFO.formId,
        gridId: this.gridId || 'grid1',
        findName: this.planName,
        findSet: JSON.stringify(data)
      },
      method: 'POST'
    };
    params.url = `${environment.baseUrl}userFind/insertUserId`;
    this.http.request(params).then(
      (res: any) => {
        console.log(res, 'add');
        if (res.success) {
          this.getPlanData();
          this.planUpdate = [];
          this.setPlanVisible = false;
        }
      }
    );
  }

  // 更新数据
  setPlanUpdate(data: any): void {
    const params = {url: '', data: {rowid: '', formId: this.formId || this.info.APPINFO.formId, findName: '', findSet: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}userFind/updateUserFind`;
    params.data.findSet = JSON.stringify(data);
    params.data.findName = this.planName;
    params.data.rowid = this.rowid;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.getPlanData();
          this.setPlanVisible = false;
          this.planUpdate = [];
        }
      }
    );
  }

  // 删除数据
  setPlanDelete(): void {
    const params = {url: '', data: [], method: 'POST'};
    params.url = `${environment.baseUrl}userFind/deleteUserFind`;
    for (const data of this.planUpdate) {
      params.data.push({rowid: data.rowid});
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.getPlanData();
          this.notification.remove();
          this.planUpdate = [];
          this.notification.success('提示消息', '删除成功！');
        }
      }
    );
  }

  // 设置默认请求
  setDef(): void {
    const params = {url: '', data: this.allData, method: 'POST'};
    params.url = `${environment.baseUrl}userFind/updateIsDefault`;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.planUpdate = [];
          this.getPlanData();
          this.notification.remove();
          this.notification.success('提示消息', '设置默认成功！');
        }
      }
    );
  }

  // 数据获取
  // 方案数据获取
  getPlanData(): void {
    this.loading = true;
    const params = {
      url: '',
      data: {formId: this.formId || this.info.APPINFO.formId, gridId: this.gridId || 'grid1', userId: this.info.APPINFO.USER.userId},
      method: 'POST'
    };
    params.url = `${environment.baseUrl}userFind/getUserFind`;
    this.http.request(params).then(
      (res: any) => {
        this.isDefault = res.data.data.isDefault;
        this.planData = res.data.data.tUserFindModels.reverse();
        const data = this.planData.filter((x: any) => x.findName === this.isDefault);
        if (data[0]) {
          data[0].checked = true;
          this.planUpdate = [];
          this.planUpdate.push(data[0]);
        }
        this.allData = res.data.data;
        this.loading = false;
      }
    );

  }

  // 通过表名查列名
  getColumnByformId() {
    const params = {url: '', data: {'formId': '', gridId: this.gridId || 'grid1'}, method: 'POST'};
    params.url = `${environment.baseUrl}column/getColumnByformId`;
    params.data.formId = this.formId || this.info.APPINFO.formId;
    this.http.request(params).then(
      (res: any) => {
        if (!res.success) {
          return;
        }
        this.setPlanData = [];
        this.colNameArray = res.data.data;
        if (this.status === 'update') {
          const temp = JSON.parse(this.planUpdate[0].findSet);
          for (const data of temp) {
            this.throughAdding(data);
          }
          this.planName = this.planUpdate[0].findName;
          this.rowid = this.planUpdate[0].rowid;

        } else { // 添加
          // this.setPlanData.push({});
          const arr = this.requiredArr.map(x => ({
            eName: x.parameter,
            relation: '包含',
            logic: '或',
            value1: null,
            disabled: true,
            eName_disabled: true
          }));
          this.setPlanData = arr;
        }
        this.isNotSelected();
        this.setPlanVisible = true;
      }
    );
  }

  // 临时findSet获取
  findSetData(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}userFind/temporaryModification`;
    params.data = data;
    params.data['gridId'] = this.gridId || 'grid1';
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.glo.findChangeEmitter.emit({findSet: res.data.data[0].findSet, formId: this.formId || this.info.APPINFO.formId});
          this.planVisible = false;
        }
      }
    );
  }

  //isNotSelected
  isNotSelected(data?: any) {
    this.selectedHidden = {};
    this.setPlanData.forEach(
      x => this.selectedHidden[x.eName] = true
    );
  }
}
