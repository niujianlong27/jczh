import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Component({
  selector: 'app-appload',
  templateUrl: './appload.component.html',
  styleUrls: ['./appload.component.css']
})
export class ApploadComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  public appOs: string;
  public appName: string;
  public imgUrl: string;
  public resultData: any = {}; // 取数据第一个
  public loadUrl: string;
  private appType: string[] = ['Android_jczh', 'Android_jczhwl', 'IOS_jczh', 'IOS_jczhwl', 'Android_trans', 'Android_product', 'IOS_trans', 'IOS_product'];
  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('appOs');
    if (this.appType.includes(param)) {
      const data = {
        appOs: param.indexOf('Android') !== -1 ? 'CZXT20' : 'CZXT10',
        appName: param.indexOf('jczhwl') !== -1 ? '汇好运' : param.indexOf('jczh') !== -1 ? '京创智汇' : param.indexOf('trans') !== -1 ? '汇好运运输' : '汇好运副产品'
      };
      this.appName = data.appName;
      this.appOs = data.appOs;
      if (param.indexOf('jczhwl') !== -1) {
        this.imgUrl = './assets/img/jczhwl.png';
        this.loadUrl = '//itunes.apple.com/app/id1482466930';
      } else if (param.indexOf('jczh') !== -1) {
        this.imgUrl = './assets/img/jczh.png';
        this.loadUrl = '//itunes.apple.com/app/id1456087705';
      } else if (param.indexOf('trans') !== -1) {
        this.imgUrl = './assets/img/hhyys.png';
        this.loadUrl = '//itunes.apple.com/app/id1510900936';
      } else if (param.indexOf('product') !== -1) {
        this.imgUrl = './assets/img/hhyfcp.png';
        this.loadUrl = '//itunes.apple.com/app/id1513299741';
      }
      this.getInfo(data);
    } else {
      this.router.navigate(['notfound']);
    }
  }

  private getInfo(param: any) {
    this.http.post(
      // `${environment.baseUrl}appversion/getAppVersionLatest`,
      'https://www.jczh56.com/api/system/appversion/getAppVersionLatest',
      {
        ...param
      }
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.resultData = res.data || {};
        if (this.appOs === 'CZXT20') { // 安卓的
          this.loadUrl = this.resultData.appAddress;
        }
      }
    });
  }
}
