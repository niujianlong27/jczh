import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-jgwlpark',
  templateUrl: './jgwlpark.component.html',
  styleUrls: ['./jgwlpark.component.css']
})
export class JgwlparkComponent implements OnInit {

  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';
  insertVisible: boolean;



  // 新增模态框内容的定义
  modalFormData: Array<any> = [
    {
      name: '仓库名称:', eName: 'warehouseName', type: 'text', validateCon: '请输入仓库名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '仓库编号:', eName: 'warehouseCode', type: 'text', validateCon: '请输入仓库编号', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'body', type: 'textarea', validateCon: '请输入消息内容', require: true,
      validators: {
        require: false,
        pattern: false,
      }
    }
  ];



  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
  ) {
  }

  ngOnInit() {
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log(data);
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
     this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.MANAGERGETWAREHOUSE;
    this.loading = true;
    this.dataSet = [];
    // this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      console.log(data);
      if (res.success) {
        console.log(res);
        this.loading = false;
        this.updateData = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    });
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    console.log(data.buttonId);
    // console.log(this.buttonId);
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.doAdd();
        break;
      case 'Delete':
        this.doDelete();
        break;
      case 'Update':
        this.doUpdate();
        break;
    }
  }

  doAdd() {

  }

  doDelete() {

  }

  doUpdate() {

  }

  modelChange(val: any) {
    console.log(val)
    for (let i = 0; i < this.modalFormData.length; i++) {
      const validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }
/*      this.modalFormData.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));*/
    }
  }


}
