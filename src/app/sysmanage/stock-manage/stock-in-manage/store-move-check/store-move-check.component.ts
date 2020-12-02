/**
 * 移库登记
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { retry } from 'rxjs/operators';
import { Utils } from '@util/utils';
import { GlobalService } from '@service/global-service.service';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-store-move-check',
  templateUrl: './store-move-check.component.html',
  styleUrls: ['./store-move-check.component.css']
})
export class StoreMoveCheckComponent implements OnInit {
  public visible = false;
  public modalData: any[] = [];
  public userData: any[] = [];
  public data: any[] = [];
  private constUserData: any[] = [];
  private selectNum = 1;
  public loading = false;
  public storeForm: FormGroup;
  private staticData: any[] = [];
  public saveLoading = false;
  @ViewChild('newLocation') newLocation: ElementRef;
  // @ViewChild('newWsArea') newWsArea: ElementRef;
  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private fb: FormBuilder,
    private router: Router,
    private mess: NzMessageService,
    private glo: GlobalService,
    private info: UserinfoService
  ) { }

  ngOnInit() {
    this.getUser('', true);
    this.staticDataFun();
    this.storeForm = this.fb.group({
      moveWsNo: [null],
      moveWsTime: [new Date(), [Validators.required]],
      moveUserId: [this.info.APPINFO.USER.userId, [Validators.required]],
      remark: ['手工录入']
    });
  }

  // 表头
  public columns(data: any[]) {
    const newWsLocation = data.filter((x: any) => x.colEname === 'newWsLocation');
    newWsLocation[0].tdTemplate = this.newLocation;
    /* const newWsArea = data.filter((x: any) => x.colEname === 'newWsArea');
    newWsArea[0].tdTemplate = this.newWsArea; */
  }

  // 按钮事件
  public btnClick(data: any) {
    switch (data.buttonId) {
      case 'Add':
        this.getStocInPulk();
        this.visible = true;
        break;
      case 'save':
        // tslint:disable-next-line: forin
        for (const i in this.storeForm.controls) {
          this.storeForm.controls[i].markAsDirty();
          this.storeForm.controls[i].updateValueAndValidity();
        }
        if (this.storeForm.status === 'INVALID') {
          return;
        }
        if (!this.data.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请添加明细'
          });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const nullAreaLocation = this.data.some((x: any) => !x.newWsLocation);
        if (nullAreaLocation) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '明细表中有未选择的新库位'
          });
          return;
        }
        this.saveLoading = true;
        // eslint-disable-next-line no-case-declarations
        const stockMoveDetailModels = Utils.deepCopy(this.data);
        stockMoveDetailModels.forEach((d: any, index: number) => {
          // stockMoveDetailModels[index].newWsAreaArr = undefined;
          stockMoveDetailModels[index].newWsLocationArr = undefined;
          stockMoveDetailModels[index].newWs = d.wsName;
        });
        // eslint-disable-next-line no-case-declarations
        const values = Utils.deepCopy(this.storeForm.value);
        values.moveWsTime = format(values.moveWsTime, 'YYYY-MM-DD HH:mm:ss');
        this.http.post(
          `${environment.baseUrlStorage}stockmove/moveStock`,
          {
            ...values,
            stockMoveDetailModels: stockMoveDetailModels
          }
        ).subscribe((res: any) => {
          this.saveLoading = false;
          if (res.code === 100) {
            this.mess.success(res.msg);
            this.data = [];
            this.storeForm.reset();
            this.storeForm.get('moveWsTime').setValue(new Date());
            this.storeForm.get('moveUserId').setValue(this.info.APPINFO.USER.userId);
            this.storeForm.get('remark').setValue('手工录入');
            this.router.navigate(['/system/stock-manage/stock-in-manage/storeMoveManage']).then(() => {
              this.glo.searchReload.emit({ target: 'storeMoveCheck' });
            });
          }
        });
        break;
      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const d = this.data.filter((x: any) => x.checked);
        if (!d.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择数据进行删除'
          });
          return;
        }
        this.data = this.data.filter((x: any) => !x.checked);
        break;
      default:
        break;
    }
  }

  // 获取库位数据
  private staticDataFun() {
    this.http.post(
         `${environment.baseUrlStorage}storelocation/selectAllStoreLocation`,
         {}
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.staticData = res.data || [];
      }
    });
  }

  // 获取在库库存数据
  public getStocInPulk(param?: any) {
    this.loading = true;
    this.http.post(
     `${environment.baseUrlStorage}stockinfo/getStocInPulk`,
     {
       status: 10,
       ...param
     }
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        const modalData = res.data || [];
        this.modalData = modalData.filter((x: any) => this.data.every((y: any) => y.rowid !== x.rowid));
      }
    });
  }

  // 获取移库人
  private getUser(name?: string, flag?: boolean) {
    this.http.post(
     `${environment.baseUrlStorage}storeProdSet/getUser`,
     {
       name: name
     }
    ).subscribe((res: any) => {
      if (res.code === 100) {
        let constUserData = res.data || [];
        let user: any[] = [];
        if (flag) {
          user = constUserData.filter((x: any) => x.userId === this.info.APPINFO.USER.userId);
          constUserData = constUserData.filter((x: any) => x.userId !== this.info.APPINFO.USER.userId);
        }
        this.constUserData = constUserData;
        this.userData = this.constUserData.slice(0, 50);
        if (user[0]) {
          this.userData.push(user[0]);
        }
      }
    });
  }

  public selectSearch(txt: string) {
    this.getUser(txt);
  }

  public selectOpen(bool: boolean) {
    this.selectNum = 1;
    if (bool) {
      this.userData = this.constUserData.slice(0, 50);
    }
  }

  public loadMore() {
    let num = 50 * (++this.selectNum);
    if (num > this.constUserData.length) {
      num = this.constUserData.length;
    }
    const userData = this.constUserData.slice(this.userData.length, num);
    this.userData = [...this.userData, ...userData];
  }

  // 新库区选择值变化
  /* public newWsAreaChange(name: string, data: any, index: number) {
    if (name) {
      const d = data.filter((x: any) => x.areaName === name);
      this.data[index].newWsLocationArr = d[0].storeLocationList || [];
      this.data[index].newWsLocation = null;
    } else {
      this.data[index].newWsLocationArr = [];
      this.data[index].newWsLocation = null;
    }
  } */

  // 新库位选择值变化
  public newLocationChange(data: string, arr: any, index: number) {
    const res = arr.filter((x: any) => x.locationCdoe === data)[0] || {};
    this.data[index].newWsLocationId = data;
    this.data[index].newWsLocation = res.locationName;
    this.data[index].newWsArea = res.areaName;
  }

  // 弹窗确认
  public ok() {
    const data = this.modalData.filter((x: any) => x.checked).map((y: any) => {
      y.checked = false;
      // tslint:disable-next-line: max-line-length
      const staticData = this.staticData.filter((z: any) => (z.storeName === y.wsName)); // 目前按3级结构做
      /* y.newWsAreaArr = [];
      if (staticData[0]) {
        y.newWsAreaArr = staticData[0].areaList;
      } */
      y.newWsLocationArr = [];
      staticData.forEach((item: any) => {
        // 库区
        const areaList = item.areaList || [];
        areaList.forEach((location: any) => {
          // 库位
          const storeLocationList = location.storeLocationList || [];
          storeLocationList.forEach((obj: any) => {
            const o = { ...obj };
            o.areaName = location.areaName;
            o.areaCode = location.areaCode;
            y.newWsLocationArr = [...y.newWsLocationArr, o];
          });
        });
        const locationList = item.storeLocationList || [];
        locationList.forEach((obj: any) => {
          // 库位
          y.newWsLocationArr = [...y.newWsLocationArr, { ...obj }];
        });
      });
      return y;
    });
    this.data = [...this.data, ...data];
    this.data.forEach((x: any) => {
      if (x.isPack === 'KBGL10') {
        x.inputDisabled = {
          branchNum: true,
          weight: true,
          packageNum: true
        };
      } else {
        x.inputDisabled = {};
      }
    });
    this.visible = false;
  }
}
