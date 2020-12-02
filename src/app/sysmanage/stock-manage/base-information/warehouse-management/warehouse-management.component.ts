import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import {stockManageURL} from '@model/stockManage';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService, NzTableComponent} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {Utils} from '@util/utils';

export interface TreeNodeInterface {
  key?: any; //数据判定唯一标识，手动生成
  level: number;
  expand: boolean; // 是否展开
  areaList?: TreeNodeInterface[]; // 库区
  storeLocationList?: TreeNodeInterface[]; //库位
  storeLocationModelList?: TreeNodeInterface[]; // 仓库下直接指定库位
}

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.css']
})

export class WarehouseManagementComponent implements OnInit {

  @ViewChild('nzTable') nzTableComponent: NzTableComponent;
  dataHeader: Array<any> = []; //表头
  dataSet: Array<any> = []; //表格数据
  mapOfExpandedData: { [rowid: string]: TreeNodeInterface[] } = {};

  buttonID: string = null;
  buttonStatus: string = null;

  modalVisible = false; // 弹窗状态
  modalTitle = ''; //弹窗标题

  isSpinning = false;// 是否加载
  page = 1;
  pageSize = 50;
  searchData: any;
  total = 0; //总数据数
  selectData: any; // 选中数据
  listLoading;
  virtualMinBuffer = 500;
  virtualMaxBuffer = 500;
  tableWidth = '100%';
  tableHeight = '500px';
  curFormId: string = '';


  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '仓库编号',
      eName: 'storeCode',
      type: 'text',
      validateCon: '请输入仓库名称',
      require: false,
      disabled: true,
      display: 'Add update addStoreArea update addStorePositon update'
    },
    {
      name: '仓库名称',
      eName: 'storeName',
      type: 'text',
      validateCon: '请输入仓库名称',
      require: true,
      display: 'Add update addStoreArea update  addStorePositon update'
    },
    {
      name: '库区编号',
      eName: 'areaCode',
      type: 'text',
      validateCon: '请输入仓库名称',
      require: false,
      disabled: true,
      display: 'addStoreArea update addStorePositon update'
    },
    {
      name: '库区名称',
      eName: 'areaName',
      type: 'text',
      validateCon: '请输入库区名称',
      require: true,
      display: 'addStoreArea update addStorePositon update'
    },
    {
      name: '库位编号',
      eName: 'locationCdoe',
      type: 'text',
      validateCon: '请输入仓库名称',
      require: false,
      disabled: true,
      display: 'addStorePositon update'
    },
    {
      name: '库位名称',
      eName: 'locationName',
      type: 'text',
      validateCon: '请输入库位名称',
      require: true,
      display: 'addStorePositon update'
    },
    {
      name: '备注',
      eName: 'storeRemark',
      type: 'text',
      validateCon: '请输入库位名称',
      require: false,
      display: 'Add update addStoreArea update addStorePositon update'
    },
  ];

  constructor(
    private http: HttpUtilService,
    private info: UserinfoService,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private  angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
    this.tableVirtualScrollInitialization();
    // 获取表头
    this.getUserColumns({formId: this.info.APPINFO.formId, userId: this.info.APPINFO.USER.userId,});
    this.formInitialization();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    console.log(param, '搜索条件');
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有

    this.searchData = param;
    this.isSpinning = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    this.page = data.page || 1;
    const url = stockManageURL.selectStoreLocation;
    this.http.post(url, data).then(
      (res: any) => {
        this.isSpinning = false;
        this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(0);
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.total = res.data.data.total || 0;
          this.selectData = [];
          this.dataSet.forEach((item, index) => {
            item.key = index;
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item, index);
          });
          console.log(this.dataSet);
          console.log(this.mapOfExpandedData);
        } else {
          this.dataSet = [];
          this.mapOfExpandedData = {};
        }
        this.listLoading = false;
      }
    );
  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param): void {
    this.buttonID = param.buttonId;
    switch (this.buttonID) {
      // 新增仓库
      case 'Add' : {
        this.btnAdd();
      }
        break;
      // 新增库区
      case 'addStoreArea': {
        this.btnAddStoreArea();
      }
        break;
      // 新增库位
      case 'addStorePositon': {
        this.btnAddStorePositon();
      }
        break;
      // 修改
      case 'update': {
        this.btnUpdate();
      }
        break;
      // 删除
      case 'delete': {
        this.btnDelete();
      }
        break;
      // 导出
      case 'export': {
        this.btnExport();
      }
        break;
    }
  }


  /**
   * 表头获取
   * @param param
   */
  getUserColumns(param: any): void { // 获取表头

    this.http.post(urls.columns, param).then(
      (res: any) => { // 获取表头
        if (res.success) {
          let dataHeader: any;
          let len = 0, width = 0;
          dataHeader = res.data.data;
          dataHeader.map((item: any) => {
            item.apiParameter = item.apiParameter && JSON.parse(item.apiParameter) || {};
            width = parseFloat(item.width) ? parseFloat(item.width) : 120;
            len = Utils.add(len, width);
            item.width = `${width}px`;
          });
          this.tableWidth = `${len}px`;
          this.dataHeader = dataHeader;
          // this.columnsFilter(dataHeader, 'http');
        }
      });
  }

  /**
   * table折叠点击
   * @param array
   * @param data
   * @param $event
   */
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.areaList) {
        data.areaList.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      }
      if (data.storeLocationList) {
        data.storeLocationList.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      }
      if (data.storeLocationModelList) {
        data.storeLocationModelList.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  /**
   * table 数据转换
   * @param root
   * @param index
   */
  convertTreeToList(root: any, index): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({...root, level: 1, expand: false});
    let serialNumber = 0;
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.areaList && node.areaList.toString()) {
        for (let i = node.areaList.length - 1; i >= 0; i--) {
          node.areaList[i].key = '1' + index + serialNumber + i;
          stack.push({...node.areaList[i], level: node.level + 1, expand: false, parent: node});
        }
      }
      if (node.storeLocationList && node.storeLocationList.toString()) {
        for (let i = node.storeLocationList.length - 1; i >= 0; i--) {
          node.storeLocationList[i].key = '2' + index + serialNumber + i;
          stack.push({...node.storeLocationList[i], level: node.level + 1, expand: false, parent: node});
        }
      }
      if (node.storeLocationModelList && node.storeLocationModelList.toString()) {
        for (let i = node.storeLocationModelList.length - 1; i >= 0; i--) {
          node.storeLocationModelList[i].key = '3' + index + serialNumber + i;
          stack.push({...node.storeLocationModelList[i], level: node.level + 1, expand: false, parent: node});
        }
      }
      serialNumber++;
    }

    return array;
  }

  /**
   * table 数据转换
   * @param node
   * @param hashMap
   * @param array
   */
  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  /**
   * 新增仓库
   */
  btnAdd(): void {
    this.buttonStatus = 'Add';
    this.modalValidateForm.get('areaName').disable();
    this.modalValidateForm.get('locationName').disable();
    this.modalTitle = '仓库管理 > 新增仓库';
    this.modalVisible = true;

  }

  /**
   * 添加请求
   */
  addRequest(): void {
    const url = stockManageURL.insertStore;
    const param = this.modalValidateForm.getRawValue();

    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '添加仓库成功！');
          this.modalVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 新增库区
   */
  btnAddStoreArea(): void {
    this.buttonStatus = 'addStoreArea';
    this.modalValidateForm.get('storeName').disable();
    this.modalValidateForm.get('locationName').disable();
    this.modalValidateForm.get('storeRemark').disable();
    this.modalValidateForm.patchValue(this.selectData);
    this.modalTitle = '仓库管理 > 新增库区';
    this.modalVisible = true;

  }

  /**
   * 新增库区请求
   */
  addStoreAreaRequest(): void {
    const url = stockManageURL.insertStoreArea;
    const param = this.modalValidateForm.getRawValue();

    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '添加库区成功！');
          this.modalVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 新增库位
   */
  btnAddStorePositon(): void {

    this.buttonStatus = 'addStorePositon';
    this.modalValidateForm.get('storeName').disable();
    this.modalValidateForm.get('areaName').disable();
    this.modalValidateForm.get('storeRemark').disable();
    this.modalValidateForm.patchValue(this.selectData);
    if (this.selectData.areaName) { //若选择库位，获取仓库数据
      this.modalValidateForm.patchValue(this.selectData.parent);
    }

    this.modalTitle = '仓库管理 > 新增库位';
    this.modalVisible = true;

  }

  /**
   * 新增库位请求
   */
  addStorePositonRequest(): void {
    const url = stockManageURL.insertStoreLocation;
    const param = this.modalValidateForm.getRawValue();

    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '添加库位成功！');
          this.modalVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 修改
   */
  btnUpdate(): void {
    if (this.selectData.storeName) {
      this.buttonStatus = 'Add update';
      this.modalValidateForm.get('areaName').disable();
      this.modalValidateForm.get('locationName').disable();
      this.modalValidateForm.patchValue(this.selectData);
    }
    if (this.selectData.areaName) {
      this.buttonStatus = 'addStoreArea update';
      this.modalValidateForm.get('storeName').disable();
      this.modalValidateForm.get('locationName').disable();
      this.modalValidateForm.get('storeRemark').disable();
      this.modalValidateForm.patchValue(this.selectData);
      this.modalValidateForm.patchValue(this.selectData.parent);
    }
    if (this.selectData.locationName) {
      this.buttonStatus = 'addStorePositon update';
      this.modalValidateForm.get('storeName').disable();
      this.modalValidateForm.get('areaName').disable();
      this.modalValidateForm.get('storeRemark').disable();
      this.modalValidateForm.patchValue(this.selectData);
      this.modalValidateForm.patchValue(this.selectData.parent);
      this.selectData.parent.parent && this.modalValidateForm.patchValue(this.selectData.parent.parent);
    }
    this.modalTitle = '仓库管理 > 修改';
    this.modalVisible = true;
  }

  /**
   * 更新请求
   */
  updateRequest(): void {
    let url = '';
    if (this.selectData.storeName) {
      url = stockManageURL.updateStore;
    }
    if (this.selectData.areaName) {
      url = stockManageURL.updateStoreArea;
    }
    if (this.selectData.locationName) {
      url = stockManageURL.updateStoreLocation;
    }
    const param = this.modalValidateForm.getRawValue();
    param.rowid = this.selectData.rowid;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.modalVisible = false;
          this.nn.success('提示消息', '修改成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 删除
   */
  btnDelete(): void {
    // this.modalTitle = '仓库管理 > 删除';
    // this.modalVisible = true;
    this.nm.confirm({
      nzTitle: '仓库管理 > 删除',
      nzContent: '是否确认删除？',
      nzOnOk: () => this.deleteRequest()
    });
  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<void> {
    let url = '';
    if (this.selectData.storeName) {
      url = stockManageURL.deleteStore;
    }
    if (this.selectData.areaName) {
      url = stockManageURL.deleteStoreArea;
    }
    if (this.selectData.locationName) {
      url = stockManageURL.deleteStoreLocation;
    }
    const param = {
      rowid: this.selectData.rowid
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 导出
   */
  btnExport(): void {
    this.nm.confirm({
      nzTitle: '仓库管理 > 导出',
      nzContent: '是否确认导出？',
      nzOnOk: () => this.exportRequest()
    });
  }

  /**
   * 导出请求
   */
  exportRequest(): Subscription {
    const url = stockManageURL.storeLocationExcel;

    return this.angularHttp.post(
      url,
      this.searchData,
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `仓库管理.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  /**
   * 弹窗点击确定回调
   */
  modalOnOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status === 'VALID') {
      switch (this.buttonID) {
        // 新增仓库
        case 'Add' : {
          this.addRequest();
        }
          break;
        // 新增库区
        case 'addStoreArea': {
          this.addStoreAreaRequest();
        }
          break;
        // 新增库位
        case 'addStorePositon': {
          this.addStorePositonRequest();
        }
          break;
        // 修改
        case 'update': {
          this.updateRequest();
        }
          break;
        // 删除
        case 'delete': {
          this.btnDelete();
        }
          break;
        // 导出
        case 'export': {
          this.btnExport();
        }
          break;
      }
    }
  }

  /**
   * 弹窗关闭
   */
  modalOnCancel(): void {
    this.modalVisible = false;

  }

  /**
   * 弹窗关闭后操作
   */
  modalAfterClose(): void {
    this.modalValidateForm.reset();
    this.modalValidateForm.get('storeName').enable();
    this.modalValidateForm.get('areaName').enable();
    this.modalValidateForm.get('locationName').enable();
    this.modalValidateForm.get('storeRemark').enable();

  }

  checkBoxChange(status, item): void {
    Object.keys(this.mapOfExpandedData).forEach(
      key => {
        this.mapOfExpandedData[key].forEach(
          value => {
            value['checked'] = false;
          }
        );
      }
    );
    item['checked'] = status;
    if (status) {
      this.selectData = item;
    } else {
      this.selectData = null;
    }
  }

  /**
   * 表单初始化
   */
  formInitialization(): void {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: null, disabled: this.modalFormData[i].disabled}, this.modalFormData[i].require ? Validators.required : null
      ));
    }
  }

  /**
   * 页码更改
   * @param $event
   */
  pageIndexChange($event) {

    this.listSearch({page: $event, length: this.pageSize});
  }

  /**
   * 每页条数改变
   * @param $event
   */
  pageSizeChange($event) {
    this.pageSize = $event;
    this.listSearch({page: 1, length: this.pageSize});
  }

  /**
   * 表格高度抛出
   * @param data
   */
  tableHeightFun(data) {
    this.tableHeight = `${data}px`;
    this.virtualMinBuffer = data;
    this.virtualMaxBuffer = this.virtualMinBuffer + 100;
  }

  /**
   * table 虚拟滚动初始化
   */
  tableVirtualScrollInitialization(): void {
    this.curFormId = this.info.APPINFO.formId;
    this.virtualMinBuffer = parseInt(this.tableHeight, 0);
    this.virtualMaxBuffer = this.virtualMinBuffer + 100;
  }

  /**
   * 数字转换
   * @param value
   * @param status
   */
  digitalConversion(value, status?: any) {
    let extra = 0;
    if (status) {
      extra = 17;
    }
    return (value && parseFloat(value) || 150) - 16 - extra + 'px';
  }
}
