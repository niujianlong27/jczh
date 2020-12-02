/**
 * 日钢新司机车辆
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.component.html',
  styleUrls: ['./new-vehicle.component.css']
})
export class NewVehicleComponent implements OnInit {
  public data: any[] = [];
  public loading: boolean;
  public total = 0;
  private searchParam: any = {};
  public downLoading: boolean;
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  // 获取数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlTrans}rgDriver/getPage`,
      this.searchParam
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.data = (res.data && res.data.data) || [];
        this.total = (res.data && res.data.total) || 0;
      }
    });
  }

  // 查询
  public search(data: any) {
    this.searchParam = data;
    this.getData();
  }

  // 功能
  public click(data: any) {
    switch (data.buttonId) {
      case 'Export':
        this.downLoading = true;
        this.http.post(
          `${environment.baseUrlTrans}rgDriver/export`,
          this.searchParam,
          { responseType: 'blob' }
        ).subscribe((res: any) => {
          this.downLoading = false;
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = '日钢新司机车辆数据.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        break;
      default:
        break;
    }
  }
}
