/**
 * 定义物资类别代码
 */
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '@service/userinfo-service.service';
import {stockManageURL} from '@model/stockManage';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';

// 保存状态
enum SaveState {
  addUpData, // 新增大类
  modifyUpData, // 修改大类
  addDownData, // 新增小类
  modifyDownData// 修改小类
}

@Component({
  selector: 'app-prod-categor',
  templateUrl: './prod-categor.component.html',
  styleUrls: ['./prod-categor.component.css']
})

export class ProdCategorComponent implements OnInit {
  public upHeight: string;
  public downHeight: string;
  private searchParam: any = {};
  public upData: any[] = [];
  public downData: any[] = [];
  public total = 0;
  public upLoading = false;
  public downLoading = false;
  public btnDisabled: any = {
    Add: false,
    Update: true,
    Delete: true,
    Save: true,
    AddDetail: true,
    UpdateDetail: true,
    DeleteDetail: true
  };
  private selectedUpDataList: Array<any> = [];
  private selectedDownDataList: Array<any> = [];
  private saveStatus: SaveState;

  constructor(
    private http: HttpClient,
    private info: UserinfoService,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  // 表格高度
  public tableHeight(data: any) {
    this.upHeight = `${data.one}px`;
    this.downHeight = `${data.two}px`;
  }

  // 查询
  public search(param: any) {
    this.searchParam = param;
    this.getData();
  }

  // 表1数据获取
  private getData() {
    this.upLoading = true;
    this.http.post(
      stockManageURL.selectProdCategory,
      this.searchParam
    ).subscribe((res: any) => {
        if (res.code === 100) {
          this.upData = (res.data && res.data.data) || [];
          this.total = (res.data && res.data.total) || 0;
        }
      },
      () => {
        this.downData = [];
        this.upLoading = false;
        this.saveStatus = null;
        this.btnDisabled = {
          Add: false,
          Update: true,
          Delete: true,
          Save: true,
          AddDetail: true,
          UpdateDetail: true,
          DeleteDetail: true
        };
      },
      () => {
        this.downData = [];
        this.upLoading = false;
        this.saveStatus = null;
        this.selectedUpDataList = [];
        this.btnDisabled = {
          Add: false,
          Update: true,
          Delete: true,
          Save: true,
          AddDetail: true,
          UpdateDetail: true,
          DeleteDetail: true
        };
      });
  }

  // 选择表1数据
  public selectedFun(data: Array<any>) {
    this.selectedUpDataList = data;
    if (data[0]) {
      if (data[0].rowid) {
        const param = {
          categoryId: data[0].categoryId
        };
        this.getDetail(param);
        if (data[0].EDIT) {
          this.btnDisabled = {
            Add: true,
            Update: true,
            Delete: true,
            Save: false,
            AddDetail: true,
            UpdateDetail: true,
            DeleteDetail: true
          };
          this.saveStatus = SaveState.modifyUpData;
        } else {
          this.btnDisabled = {
            Add: true,
            Update: false,
            Delete: false,
            Save: true,
            AddDetail: false,
            UpdateDetail: true,
            DeleteDetail: true
          };
        }
      } else {
        this.downData = [];
        this.btnDisabled = {
          Add: true,
          Update: true,
          Delete: false,
          Save: false,
          AddDetail: true,
          UpdateDetail: true,
          DeleteDetail: true
        };
        this.saveStatus = SaveState.addUpData;
      }

    } else {
      this.downData = [];
      this.btnDisabled = {
        Add: false,
        Update: true,
        Delete: true,
        Save: true,
        AddDetail: true,
        UpdateDetail: true,
        DeleteDetail: true
      };
    }
  }

  /**
   * 表2选择数据
   * @param data
   */
  public selectedDownData(data: Array<any>) {
    this.selectedDownDataList = data;
    if (this.selectedUpDataList[0].EDIT && this.saveStatus === SaveState.modifyUpData || this.saveStatus === SaveState.addUpData) {
      return;
    }
    switch (this.selectedDownDataList.length) {
      case 0: {
        this.btnDisabled = {
          Add: true,
          Update: this.saveStatus,
          Delete: this.saveStatus,
          Save: true,
          AddDetail: this.saveStatus === SaveState.modifyDownData,
          UpdateDetail: (this.selectedDownDataList.length === 0) || (this.saveStatus === SaveState.addDownData),
          DeleteDetail: true
        };
      }
        break;
      default: {
        const status = this.selectedDownDataList.every(
          value => !value.rowid // 若存在新增明细
        );
        if (status) {
          this.btnDisabled = {
            Add: true,
            Update: true,
            Delete: true,
            Save: !(this.saveStatus === SaveState.addDownData),
            AddDetail: false,
            UpdateDetail: (this.selectedDownDataList.length === 0) || (this.saveStatus === SaveState.addDownData),
            DeleteDetail: false
          };
        } else {
          this.btnDisabled = {
            Add: true,
            Update: true,
            Delete: true,
            Save: !(this.saveStatus === SaveState.modifyDownData),
            AddDetail: true,
            UpdateDetail: (this.selectedDownDataList.length === 0) || (this.saveStatus === SaveState.addDownData),
            DeleteDetail: false
          };
        }
      }
    }

  }

  // 表2数据获取
  private getDetail(param: any) {
    this.downLoading = true;
    this.http.post(
      stockManageURL.selectAllProdSubclass,
      param
    ).subscribe((res: any) => {
        if (res.code === 100) {
          this.downData = res.data || [];
        }
      },
      () => {
        this.downLoading = false;
      },
      () => {
        this.downLoading = false;

      });
  }

  // 页面功能模块
  public btnClick(data: any) {
    switch (data.buttonId) {
      case 'Add':
        this.addUpData();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'AddDetail':
        this.btnAddDetail();
        break;
      case 'UpdateDetail':
        this.btnUpdateDetail();
        break;
      case 'DeleteDetail':
        this.btnDeleteDetail();
        break;
      default:
        break;
    }
  }

  // 主表1新增
  private addUpData() {
    const data = {
      EDIT: true,
      checked: true,
      createName: this.info.get('USER').name,
      inputDisabled: {
        updateDate: true,
        updateName: true,
        createDate: true,
        createName: true
      }
    };
    this.upData.forEach((x: any) => {
      x.checked = false;
    });
    this.downData = [];
    this.upData = [...this.upData, data];
    this.btnDisabled = {
      Add: true,
      Update: true,
      Delete: false,
      Save: false,
      AddDetail: true,
      UpdateDetail: true,
      DeleteDetail: true
    };
    this.selectedUpDataList.push(data);
    this.saveStatus = SaveState.addUpData;
  }

  /**
   * 修改点击
   */
  private btnUpdate(): void {
    if (this.selectedUpDataList[0]) {
      this.selectedUpDataList[0].EDIT = true;
      this.selectedUpDataList[0].inputDisabled = {
        updateDate: true,
        updateName: true,
        createDate: true,
        createName: true,
        categoryId: true
      };
      this.btnDisabled = {
        Add: true,
        Update: true,
        Delete: true,
        Save: false,
        AddDetail: true,
        UpdateDetail: true,
        DeleteDetail: true
      };
      this.saveStatus = SaveState.modifyUpData;
    }
  }

  /**
   * 删除点击
   */
  private btnDelete(): void {
    this.nzModal.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认删除选中数据',
      nzOnOk: () => {
        if (this.selectedUpDataList[0] && this.selectedUpDataList[0].rowid) {
          this.deleteRequest();
        } else {
          this.upData = this.upData.filter(
            res =>
              (res !== this.selectedUpDataList[0])
          );
          this.btnDisabled = {
            Add: false,
            Update: true,
            Delete: true,
            Save: true,
            AddDetail: true,
            UpdateDetail: true,
            DeleteDetail: true
          };
        }
      }
    });
  }

  /**
   * 表1删除请求
   */
  deleteRequest(): void {
    this.upLoading = true;
    const url = stockManageURL.deleteProdCategory;
    const param = {rowid: ''};
    param.rowid = this.selectedUpDataList[0].rowid;
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('删除大类成功！');
          this.getData();
        }
      },
      () => {
        this.upLoading = false;
      },
      () => {
        this.upLoading = false;
      }
    );
  }

  /**
   * 保存点击
   */
  private btnSave(): void {
    switch (this.saveStatus) {
      case SaveState.addUpData: {
        this.addUpDataRequest();
      }
        break;
      case SaveState.addDownData: {
        this.addDownDataRequest();
      }
        break;
      case SaveState.modifyUpData: {
        this.modifyUpDataRequest();
      }
        break;
      case SaveState.modifyDownData: {
        this.modifyDownDataRequset();
      }
        break;

      default: {
        this.nm.warning('保存状态异常，请刷新页面后重试！');
      }

    }
  }

  /**
   * 表1添加请求
   */
  addUpDataRequest(): void {
    const status = this.selectedUpDataList.some(
      value => !value.categoryId || !value.categoryName
    );
    if (status) {
      this.nm.warning('请填写类别编号或类别名称！');
      return;
    }
    this.upLoading = true;
    const url = stockManageURL.insertProdCategory;
    const param = this.selectedUpDataList[0];
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('新增大类成功！');
          this.getData();
        }
      },
      () => {
        this.upLoading = false;
      },
      () => {
        this.upLoading = false;
      }
    );
  }

  /**
   * 表1修改请求
   */
  modifyUpDataRequest(): void {
    const status = this.selectedUpDataList.some(
      value => !value.categoryId || !value.categoryName
    );
    if (status) {
      this.nm.warning('请填写类别编号或类别名称！');
      return;
    }
    this.upLoading = true;
    const url = stockManageURL.updateProdCategory;
    const param = this.selectedUpDataList[0];
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('修改大类成功！');
        }
      },
      () => {
        this.upLoading = false;
      },
      () => {
        this.upLoading = false;
        this.getData();
      }
    );
  }


  /**
   * 新增明细点击
   */
  private btnAddDetail(): void {
    const data = {
      EDIT: true,
      checked: true,
      categoryId: this.selectedUpDataList[0].categoryId,
    };
    this.downData = [...this.downData, data];
    this.selectedDownDataList = [];
    this.downData.forEach(
      value => {
        value.checked = !value.rowid;
        value.checked && this.selectedDownDataList.push(value);
      }
    );

    this.btnDisabled = {
      Add: true,
      Update: true,
      Delete: true,
      Save: false,
      AddDetail: false,
      UpdateDetail: true,
      DeleteDetail: false
    };
    this.saveStatus = SaveState.addDownData;
  }

  /**
   * 表2新增明细请求
   */
  addDownDataRequest(): void {
    const status = this.selectedDownDataList.some(
      value => !value.subclassId || !value.subclassName
    );
    if (status) {
      this.nm.warning('请填写小类编号或中文名称！');
      return;
    }
    this.downLoading = true;
    const url = stockManageURL.insertProdSubclass;
    const param = {tProdSubclassModelList: []};
    param.tProdSubclassModelList = this.selectedDownDataList.filter(
      value => !value.rowid
    );
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('新增小类成功！');
          this.getData();
        }
      },
      () => {
        this.downLoading = false;
      },
      () => {
        this.downLoading = false;
      }
    );
  }

  /**
   * 修改明细点击
   */
  private btnUpdateDetail(): void {
    this.selectedDownDataList.forEach(
      value => value.EDIT = true
    );
    this.btnDisabled = {
      Add: true,
      Update: true,
      Delete: true,
      Save: false,
      AddDetail: true,
      UpdateDetail: true,
      DeleteDetail: false
    };
    this.saveStatus = SaveState.modifyDownData;
  }

  /**
   * 表2明细修改请求
   */
  modifyDownDataRequset(): void {
    const status = this.selectedDownDataList.some(
      value => !value.subclassId || !value.subclassName
    );
    if (status) {
      this.nm.warning('请填写小类编号或中文名称！');
      return;
    }
    this.downLoading = true;
    const url = stockManageURL.updateProdSubclass;
    const param = {
      categoryId: this.selectedUpDataList[0].categoryId,
      tProdSubclassModelList: []
    };
    param.tProdSubclassModelList = this.selectedDownDataList.filter(
      value => value.rowid
    );
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('修改小类成功！');
          this.getData();
        }
      },
      () => {
        this.downLoading = false;
      },
      () => {
        this.downLoading = false;
      }
    );
  }

  /**
   * 删除明细点击
   */
  private btnDeleteDetail(): void {
    this.downData = this.downData.filter(
      value =>
        !this.selectedDownDataList.some(
          value1 =>
            (value === value1) && (!value1.rowid)
        )
    );
    this.selectedDownDataList = this.downData.filter(
      value => value.checked
    );
    if (this.selectedDownDataList.length !== 0) {
      this.deleteDetaildRequset();
    } else {
      this.saveStatus = null;
      this.btnDisabled = {
        Add: true,
        Update: this.saveStatus,
        Delete: this.saveStatus,
        Save: true,
        AddDetail: this.saveStatus === SaveState.modifyDownData,
        UpdateDetail: (this.selectedDownDataList.length === 0) || (this.saveStatus === SaveState.addDownData),
        DeleteDetail: true
      };
    }
  }

  /**
   * 表2明细删除接口
   */
  deleteDetaildRequset(): void {
    this.downLoading = true;
    const url = stockManageURL.deleteProdSubclass;
    const param = {
      tProdSubclassModelList: []
    };
    param.tProdSubclassModelList = this.selectedDownDataList.filter(
      value => value.rowid
    );
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.nm.success('删除小类成功！');
          this.getData();
        }
      },
      () => {
        this.downLoading = false;
      },
      () => {
        this.downLoading = false;
      }
    );
  }

}
