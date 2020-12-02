import { Component, OnInit } from '@angular/core';
import {NzTabChangeEvent} from 'ng-zorro-antd';

@Component({
  selector: 'app-stpark',
  templateUrl: './stpark.component.html',
  styleUrls: ['./stpark.component.css']
})
export class StparkComponent implements OnInit {

  selectedCompany:any;
  selectedCompanyData: any;
  permissions: any;
  roleHeight: any;
  roleData: any;
  roleHeaderData: any;
  userHeight: any;
  userData: any;
  dataSet: any;
  totalPage: any;
  pageSize: any;
  loading: any;
  nzSelectedIndex: any;
  searchValue: any;
  constructor() { }

  ngOnInit() {
  }

  selectedCompanyClick() {

  }

  btnClick($event: any) {

  }

  heightFun($event: unknown, number: number) {

  }

  updateDataResult($event: any) {

  }

  onNzSelectChange(nzTabChangeEvents: NzTabChangeEvent[]) {

  }

  tabClick(select: string) {

  }

  search(value: string) {

  }

  getUserByUserIdAndroleId() {

  }

  getUserByCompanyID() {

  }
}
