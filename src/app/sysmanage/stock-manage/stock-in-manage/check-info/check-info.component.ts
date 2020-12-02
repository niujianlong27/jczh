/**
 * 盘库登记
 */
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { retry, takeWhile } from 'rxjs/operators';
import { Utils } from '@util/utils';
import { GlobalService } from '@service/global-service.service';
import { UserinfoService } from '@service/userinfo-service.service';
import { environment } from '@env/environment';
@Component({
  selector: 'app-check-info',
  templateUrl: './check-info.component.html',
  styleUrls: ['./check-info.component.css']
})
export class CheckInfoComponent implements OnInit, OnDestroy {
  public userData: any[] = [];
  private constUserData: any[] = [];
  public visible = false;
  private selectNum = 1;
  public checkForm: FormGroup;
  public loading = false;
  public modalData: any[] = [];
  public data: any[] = [];
  private staticData: any[] = [];
  public saveLoading = false;
  public btnMatching = false;
  public pageLoading = false;
  public matchVisible = false;
  public matchLoading = false;
  public matchData: any[] = [];
  private alive = true;
  @ViewChild('newWsArea') newWsArea: ElementRef;
  @ViewChild('newWsLocation') newWsLocation: ElementRef;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modal: NzModalService,
    private mess: NzMessageService,
    private router: Router,
    private glo: GlobalService,
    private info: UserinfoService
  ) {
    this.checkForm = this.fb.group({
      checkWsNo: [null],
      checkWsTime: [new Date(), [Validators.required]],
      checkUserId: [this.info.APPINFO.USER.userId, [Validators.required]],
      remark: [null]
    });
    // 修改过来的
    this.glo.searchReload.pipe(
      takeWhile(() => this.alive)
    ).subscribe((data: any) => {
      if (data.target === 'checkManageTOcheckInfo') {
        this.data = [];
        this.btnMatching = true;
        this.checkForm.reset();
        this.pageLoading = true;
        this.http.post(
          `${environment.baseUrlStorage}stockcheck/getStockCheckThree`,
          { checkWsNo: data.checkWsNo }
        ).subscribe((res: any) => {
          setTimeout(() => {
            this.pageLoading = false;
          }, 1000);
          if (res.code === 100) {
            this.checkForm.patchValue(res.data || {});
            this.data = res.data.stockCheckDetailModels || [];
            this.data.forEach((x: any, index: number) => {
              this.data[index].is_update = true; // 是否是新增过来的数据
            });
            this.staticDataFun('update');
            this.getUser('', res.data.checkUserId || '');
          }
        });
      }
    });
  }

  ngOnInit() {
    this.getUser('', this.info.APPINFO.USER.userId);
  }

  // 表头数据抛出
  public columns(header: any[]) {
    header.forEach((data: any, index: number) => {
      if (data.colEname === 'newPackageNum') {
        header[index].type = 'number';
        header[index].intType = true;
      }
      if (data.colEname === 'newsWeight') {
        header[index].type = 'number';
      }
      if (data.colEname === 'newWsArea') {
        header[index].tdTemplate = this.newWsArea;
      }
      if (data.colEname === 'newBranchNum') {
        header[index].type = 'number';
        header[index].intType = true;
      }
      if (data.colEname === 'newWsLocation') {
        header[index].tdTemplate = this.newWsLocation;
      }
    });
  }

  // 获取明细数据
  public getDetail(param?: any) {
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
        this.modalData = modalData.filter((x: any) => !this.data.some((y: any) => y.packNo === x.packNo));
      }
    });
  }

  // 获取仓库数据
  private staticDataFun(flag?: string) {
    this.http.post(
      `${environment.baseUrlStorage}storelocation/selectAllStoreLocation`,
      {}
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.staticData = res.data || [];
        if (flag === 'update') {
          this.data.forEach((data: any, index: number) => {
            const newWsAreaArr = this.staticData.filter((x: any) => x.storeName === data.newWs && x.areaList); // 可能包含三级，也可能直接包含库位
            const newWsLocationArr = ((newWsAreaArr[0] && newWsAreaArr[0].areaList) || []).filter(
              (x: any) => x.areaName === data.newWsArea
            );
            if (newWsAreaArr[0]) {
              this.data[index].newWsAreaArr = newWsAreaArr[0].areaList || [];
              this.data[index].newWsLocationArr = (newWsLocationArr[0] && newWsLocationArr[0].storeLocationList) || [];
            }
          });
        }
      }
    });
  }

  // 获取盘库人
  private getUser(name?: string, id?: string) {
    this.http.post(
      `${environment.baseUrlStorage}storeProdSet/getUser`,
      {
        name: name
      }
    ).subscribe((res: any) => {
      if (res.code === 100) {
        let constUserData = res.data || [];
        let user: any[] = [];
        if (id) {
          user = constUserData.filter((x: any) => x.userId === id);
          constUserData = constUserData.filter((x: any) => x.userId !== id);
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

  public newWsAreaChange(name: string, data: any[], index: number) {
    if (name) {
      const newWsLocationArr = data.filter((x: any) => x.areaName === name);
      this.data[index].newWsLocationArr = newWsLocationArr[0].storeLocationList || [];
      this.data[index].newWsLocation = null;
    } else {
      this.data[index].newWsLocationArr = [];
      this.data[index].newWsLocation = null;
    }
    this.inputBlur({ data: this.data[index], index: index });
  }

  // 弹窗确认
  public ok() {
    const data = this.modalData.filter((x: any) => x.checked).map((y: any) => {
      y.checked = false;
      // tslint:disable-next-line: max-line-length
      const staticData = this.staticData.filter((m: any) => (m.storeName === y.wsName) && m.areaList && m.areaList.some((n: any) => n.storeLocationList));
      y.newWsAreaArr = [];
      if (staticData[0]) {
        y.newWsAreaArr = staticData[0].areaList;
      }
      y.newWsLocationArr = [];
      y.status = 'MXZT01'; // 默认初始
      y.statusName = '初始';
      return y;
    });
    // 弹窗列表数据已经根据明细列表做了数据去重
    this.data = [...this.data, ...data];
    this.visible = false;
  }

  // 匹配弹窗确认
  /**
   * MXZT01初始;MXZT02正常匹配；MXZT03匹配不一致；MXZT04未匹配；MXZT05匹配多余
   */
  public matchingOk() {
    const result: any[] = [];
    const data = this.matchData.filter((x: any) => x.checked);
    this.data.forEach((obj: any) => {
      const item = { ...obj };
      const d = data.filter((y: any) => y.packNo === item.packNo);
      if (d.length) { // 存在
        const bool = this.diff(d[0], item);
        if (bool) {
          item.status = 'MXZT02'; // 正常匹配
          item.statusName = '正常匹配';
        } else {
          item.status = 'MXZT03'; // 匹配不一致 有可能仓库不一致
          item.statusName = '匹配不一致';
        }
        const storeName = this.staticData.filter((m: any) => (m.storeName === d[0].wsName) && m.areaList);
        item.newWsAreaArr = (storeName[0] && storeName[0].areaList) || [];
        const areaList = item.newWsAreaArr.filter((m: any) => m.areaName === d[0].wsArea);
        item.newWsLocationArr = (areaList[0] && areaList[0].storeLocationList) || [];
        item.newsWeight = d[0].weight;
        item.newPackageNum = d[0].packageNum;
        item.newBranchNum = d[0].branchNum;
        item.newWs = d[0].wsName;
        item.newWsArea = d[0].wsArea;
        item.newWsLocation = d[0].wsLocation;
        if (item._duoyu) {
          item.status = 'MXZT05';
          item.statusName = '匹配多余';
        }
        result.push(item);
      } else { // 未匹配
        item.status = 'MXZT04';
        item.statusName = '未匹配';
        if (item._duoyu) {
          item.status = 'MXZT05';
          item.statusName = '匹配多余';
        }
        result.push(item);
      }
    });
    data.forEach((obj: any) => {
      const item = { ...obj };
      const bool = result.some((x: any) => x.packNo === item.packNo);
      if (!bool) {
        item.checked = false;
        item._duoyu = true; // 第一次匹配多余的标记
        item.newsWeight = obj.weight;
        item.newPackageNum = obj.packageNum;
        item.newBranchNum = obj.branchNum;
        item.weight = '0';
        item.packageNum = '0.000';
        item.branchNum = '0';
        item.newWs = obj.wsName;
        item.newWsArea = obj.wsArea;
        item.newWsLocation = obj.wsLocation;
        item.status = 'MXZT05';
        item.statusName = '匹配多余';
        const storeName = this.staticData.filter((m: any) => (m.storeName === obj.wsName) && m.areaList);
        item.newWsAreaArr = (storeName[0] && storeName[0].areaList) || [];
        const areaList = item.newWsAreaArr.filter((m: any) => m.areaName === obj.wsArea);
        item.newWsLocationArr = (areaList[0] && areaList[0].storeLocationList) || [];
        result.push(item);
      }
    });
    this.data = Utils.deepCopy(result);
    this.matchVisible = false;
  }

  private toNum(data: string) {
    if (data) {
      return Number(data);
    }
    return data;
  }

  private diff(x: any, y: any) {
    const weight1 = this.toNum(x.weight);
    const weight2 = this.toNum(y.weight);
    const packageNum1 = this.toNum(x.packageNum);
    const packageNum2 = this.toNum(y.packageNum);
    const branchNum1 = this.toNum(x.branchNum);
    const branchNum2 = this.toNum(y.branchNum);
    return weight1 === weight2 && x.wsName === y.wsName &&
      x.wsArea === y.wsArea && x.wsLocation === y.wsLocation &&
      packageNum1 === packageNum2 && branchNum1 === branchNum2;
  }

  // 获取匹配结果列表数据
  public getMatchData(param: any) {
    this.matchLoading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockcheckPdaOper/getPdaOperOne`,
      {
        ...param,
        checkWsNo: this.checkForm.get('checkWsNo').value
      }
    ).subscribe((res: any) => {
      this.matchLoading = false;
      if (res.code === 100) {
        this.matchData = res.data || [];
      }
    });
  }

  // 按钮功能事件
  public btnClick(data: any) {
    switch (data.buttonId) {
      case 'save':
        // tslint:disable-next-line: forin
        for (const i in this.checkForm.controls) {
          this.checkForm.controls[i].markAsDirty();
          this.checkForm.controls[i].updateValueAndValidity();
        }
        if (this.checkForm.status === 'INVALID') {
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
        const values = Utils.deepCopy(this.checkForm.value);
        values.checkWsTime = format(values.checkWsTime, 'YYYY-MM-DD HH:mm:ss');
        // eslint-disable-next-line no-case-declarations
        const stockCheckDetailModels = Utils.deepCopy(this.data);
        stockCheckDetailModels.forEach((x: any, index: number) => {
          stockCheckDetailModels[index].newWsAreaArr = undefined;
          stockCheckDetailModels[index].newWsLocationArr = undefined;
          stockCheckDetailModels[index].newWs = x.wsName;
          // if (!values.checkWsNo) { // 如果单号存在是修改
          //   stockCheckDetailModels[index].status = 'MXZT01';
          //   stockCheckDetailModels[index].statusName = 'MXZT01';
          // }
        });
        this.saveLoading = true;
        this.http.post(
          `${environment.baseUrlStorage}stockcheck/saveCheck`,
          {
            ...values,
            stockCheckDetailModels: stockCheckDetailModels
          }
        ).subscribe((res: any) => {
          this.saveLoading = false;
          if (res.code === 100) {
            this.mess.success(res.msg);
            this.data = [];
            this.checkForm.reset();
            this.checkForm.get('checkWsTime').setValue(new Date());
            this.checkForm.get('checkUserId').setValue(this.info.APPINFO.USER.userId);
            this.btnMatching = false;
            this.router.navigate(['/system/stock-manage/stock-in-manage/checkManage']).then(() => {
              this.glo.searchReload.emit({ target: 'checkInfo-checkManage' });
            });
          }
        });
        break;
      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const checkData = this.data.filter((x: any) => x.checked);
        if (!checkData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要删除的数据'
          });
          return;
        }
        this.data = this.data.filter((x: any) => !x.checked);
        break;
      case 'Add':
        if (!this.staticData.length) {
          this.staticDataFun();
        }
        this.visible = true;
        this.getDetail();
        break;
      case 'matching':
        this.matchVisible = true;
        this.getMatchData({});
        break;
      default:
        break;
    }
  }

  // 新库位值改动
  public newWsLocationChange(bool: boolean, index: number) {
    this.inputBlur({ data: this.data[index], index: index });
  }

  // 输入框失焦事件
  public inputBlur(data: any) {
    if (!data.data.newsWeight && !data.data.newPackageNum && !data.data.newBranchNum &&
        !data.data.newWsArea && !data.data.newWsLocation && !data.data.is_update) {
      data.data.status = 'MXZT01';
      data.data.statusName = '初始';
      return;
    }
    const newData = {
      weight: data.data.newsWeight,
      packageNum: data.data.newPackageNum,
      wsArea: data.data.newWsArea,
      wsLocation: data.data.newWsLocation,
      wsName: data.data.wsName,
      branchNum: data.data.newBranchNum
    };
    const bool = this.diff(data.data, newData);
    if (bool) {
      data.data.status = 'MXZT02'; // 正常匹配
      data.data.statusName = '正常匹配';
    } else {
      data.data.status = 'MXZT03'; // 匹配不一致
      data.data.statusName = '匹配不一致';
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
