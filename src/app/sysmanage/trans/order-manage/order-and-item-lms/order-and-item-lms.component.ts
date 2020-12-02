import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';
import { TRANS_URLS } from '@model/trans-urls';
import { HttpUtilService } from '@service/http-util.service';
import { contractUrl } from '@model/contractUrl';

@Component({
  selector: 'app-order-and-item-lms',
  templateUrl: './order-and-item-lms.component.html',
  styleUrls: ['./order-and-item-lms.component.css']
})
export class OrderAndItemLMSComponent implements OnInit {
  selectedData: any = [];
  list: any[] = [];
  searchData: any = {};
  total: number;
  pageSize: number = 100;
  loading: boolean = false;

  constructor(private http: HttpUtilService,
              private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
  }

  search(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  btnClick(data: any) {
    switch (data.buttonId) {
      case 'export':
        this.export();
        break;
      default:
        break;
    }
  }

  getList(data: any) {
    this.loading = true;
    this.searchData = data;
    this.http.post(contractUrl.getLMSByOrderNo, data).then(
      (res: any) => {
        this.loading = false;
        if (res.success) {
          this.list = res.data ? res.data.data.data : [];
          this.total = res.data.data.total;
        }
      }
    );
  };

  export() {
    this.httpClient.post(contractUrl.exportLMS, this.searchData, { responseType: 'blob' }).subscribe((res: any) => {
      if (res instanceof Blob) {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = 'LMS合同明细.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  selectData(data) {
    this.selectedData = data;
  }
}
