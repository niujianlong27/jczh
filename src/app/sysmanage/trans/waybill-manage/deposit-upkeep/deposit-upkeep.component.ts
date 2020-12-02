import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from "../../../../common/model/url";
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {format} from 'date-fns';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-deposit-upkeep',
  templateUrl: './deposit-upkeep.component.html',
  styleUrls: ['./deposit-upkeep.component.css']
})
export class DepositUpkeepComponent implements OnInit {
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  buttonId: string;
  confimCon: string;
  private rowid: any;
  isSave: boolean = false;
  fromId: string = 'form_deposit_order_manage_add'
  tempData: {};//修改数据缓存
  useArr: Array<any> = [{name: '使用', value: '20'}, {name: '未使用', value: '10'}]; //使用数组
  statusArr: Array<any> = [{name: 'insert', value: 'I'}, {name: 'update', value: 'U'}, {name: 'Delete', value: 'D'}]; //使用数组
  constructor(private http: HttpUtilService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private nzModal: NzModalService, private nzMess: NzNotificationService,) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(x => {
      this.tempData = x;
    })

    this.validateForm = this.fb.group({
      // 数据带入
      carmark: [this.tempData['carmark']],
      mainProductListNo: [{value: this.tempData['mainProductListNo'], disabled: true}, Validators.required],
      // createTime: [null],
      // alterTime: [this.tempData['alterTime'] ? this.tempData['alterTime'] : null],
      status: [this.tempData['status']],
      isUse: [this.tempData['isUse']],
    });
    this.listSearch({page: 1, length: this.pageSize});
  }

  btnClick(button: any) {
    switch (button.buttonId) {
      case 'save':
        this.update();
        break;
      case 'return':
        this.cancel();
        break;
    }
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getBclpStackingInfoDetail;
    params.data = data;
    params.data['mainProductListNo'] = this.tempData['mainProductListNo'];
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {

          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
          this.dataSet.forEach((item) => {
            item.editstate = 0;
          })
        }
      }
    );
  };

  update() {
    const params = {url: '', data: {list: []}, method: 'POST'};
    this.validateForm.value['mainProductListNo'] = this.tempData['mainProductListNo'];
    params.url = urls.updateBclpStackingInfoDetail;
    params.data = this.validateForm.value;

    params.data['bclpStackingInfoDetailModels'] = [...this.selectedData];
    this.isSave = true;
    this.http.request(params).then(
      (res: any) => {
        this.isSave = false;
        if (res.success) {
          this.nzMess.success('提示消息', '修改成功！');
          this.router.navigate(['/system/trans/waybill-manage/depositNotice']);
        }
      }
    );
  }

  cancel() {
    this.router.navigate(['/system/trans/waybill-manage/depositNotice']);
  }

  selectData(data) {
    this.selectedData = data;
    this.selectedData.forEach(item => {
      if (item.editstate == 0) {
        item.editstate = 1;
      }
    })
  }

}
