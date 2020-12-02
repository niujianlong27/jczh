import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {UserinfoService} from 'src/app/common/services/userinfo-service.service';
// import { HttpUtilService } from 'src/app/common/services/http-util.service';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {timer} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {urls} from '@model/url';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('table2') table2: ElementRef;
  @ViewChild('bidTable') bidTable: ElementRef;

  userInfo: any = {}; // 登录成功传值
  form: FormGroup; // 登录-form表单定义dashboardInfo:any;//登录成功传值
  capaCity: any = {};

  dataSet: Array<any> = []; // 表格数据
  dataSet2: Array<any> = []; // 表格数据

  // 轮播
  nzAutoPlay: true;
  array = [];


  // 表格属性初始化
  sTab;
  sTab2;
  tbody;
  tbody2;
  speed: number;
  speed2: number;
  tbdh: number;
  tbdh2: number;

  intervalID;
  timeoutID;
  intervalID2;
  timeoutID2;
  tableLoading1 = false;
  tableLoading2 = false;

  //招投标
  bidSpeed: number;
  bidTbdh: number;
  bidsTab;
  bidTbody;
  bidDataSet:any;
  bidtableLoading = false;
  bidIntervalID;
  bidTimeoutID;

  constructor(
    private info: UserinfoService,
    private http: HttpClient,
    private cookie: CookieService,
    // 登录模块
    private fb: FormBuilder,
    private titleEmit: Title,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.tableLoading1 = true;
    this.tableLoading2 = true;
    this.bidtableLoading = true;
    this.userInfo = this.info.get('USER') || {};
    this.array = [
      // 'assets/static/bigTitle1.jpg', 'assets/static/bigTitle2.jpg', 'assets/static/bigTitle3.jpg'
      'assets/static/huoyun.jpg', 'assets/static/biaoti.png', 'assets/static/haiyunbg.png'
    ];
    this.loadData();
    this.titleEmit.setTitle('汇好运-京创智汇旗下专业大宗商品物流服务平台');

  }

  getCars() {
    const url = urls.getRealWaybillList;
    this.sTab = this.table.nativeElement; // 要滚动的表
    this.tbody = this.sTab.getElementsByTagName('tbody')[0]; // 要滚动表格的内容
    this.http.post(url, {}).subscribe((res) => {
      if (res['code'] == 100) {
        this.tableLoading1 = false;
        this.dataSet = res['data'];
        this.dataSet.forEach(item => {
          item.travelNo = item.travelNo.substr(0, 4) + '***';
        });
        clearInterval(this.intervalID);
        clearTimeout(this.timeoutID);

        if (this.dataSet.length > 6) {
          this.timeoutID = setTimeout(() => {
            this.speed = this.sTab.getElementsByTagName('td')[0] && this.sTab.getElementsByTagName('td')[0].offsetHeight; // 每次滚动的距离
            this.tbdh = this.tbody.offsetHeight; // 整个表的高度,是因为上边的边不算滚动
            this.intervalID = setInterval(() => this.scrollTop(), 1200);
          }, 5000);
        }
      }
    });
  }

  getSea() {
    const url = urls.getSeaWaybillList;
    this.sTab2 = this.table2.nativeElement;
    this.tbody2 = this.sTab2.getElementsByTagName('tbody')[0]; // 要滚动表格的内容
    this.http.post(url, {}).subscribe((res) => {
      console.log(res)
      if (res['code'] == 100) {
        this.tableLoading2 = false;
        this.dataSet2 = res['data'];
        this.dataSet2.forEach(item => {
          item.travelNo = item.travelNo.substr(0, 4) + '***';
        });
        clearInterval(this.intervalID2);
        clearTimeout(this.timeoutID2);
        if (this.dataSet2.length > 6) {
          this.timeoutID2 = setTimeout(() => {
            this.speed2 = this.sTab2.getElementsByTagName('td')[0] && this.sTab2.getElementsByTagName('td')[0].offsetHeight; // 每次滚动的距离
            this.tbdh2 = this.tbody2.offsetHeight; // 整个表的高度,是因为上边的边不算滚动
            this.intervalID2 = setInterval(() => this.scrollTop2(), 1200);
          }, 5000);
        }
      }
    });
  }

  getBid() {
    const url = urls.getRealBid;
    this.bidsTab = this.bidTable.nativeElement; // 要滚动的表
    this.bidTbody = this.bidsTab.getElementsByTagName('tbody')[0]; // 要滚动表格的内容
    this.http.post(url, {}).subscribe((res) => {
      if (res['code'] == 100) {
        this.bidtableLoading = false;
        this.bidDataSet = res['data'];

        clearInterval(this.bidIntervalID);
        clearTimeout(this.bidTimeoutID);

        if (this.bidDataSet.length > 6) {
          this.bidTimeoutID = setTimeout(() => {
            this.bidSpeed = this.bidsTab.getElementsByTagName('td')[0] && this.bidsTab.getElementsByTagName('td')[0].offsetHeight; // 每次滚动的距离
            this.bidTbdh = this.bidTbody.offsetHeight; // 整个表的高度,是因为上边的边不算滚动
            this.bidIntervalID = setInterval(() => this.bidscrollTop(), 1200);
          }, 5000);
        }
      }
    });
  }

  loginSuccess(userInfo: any) {
    this.userInfo = userInfo;
  }


  loginOut(e: MouseEvent) {
    this.cookie.deleteAll();
    this.info.set('USER', {});
    this.userInfo = {};
  }

  // 点击“下载”，跳转下载页面
  downLoad() {
    this.router.navigate(['home-page-app']);
  }

  // 点击“关于我们”，跳转该页面
  about() {
    this.router.navigate(['home-page-about']);
  }

  // 点击“登录”，跳转该页面
  login() {
    this.router.navigate(['login']);
  }

  ngAfterViewInit() {
    this.tableInit();
  }

  tableInit(): void {
    this.getCars();
    this.getBid();
    this.getSea();
  }


  /**轮播时间 */
  scrollTop() {  // 汽运
    const t = this.sTab.offsetTop; // 获取要滚动表的位置
    // console.log( 't:');
    if ((this.tbdh / 2 + t) < (this.speed / 2)) {// 比较  滚动的距离等于整个表的高度   即第一个表完全看不见
      this.sTab.style.transition = '0s'; // 过渡动画设为0秒
      this.sTab.style.top = 0; // 位置设为初始位置
      this.scrollTop(); // 因为偷梁换柱消耗了一次过程,所以把这一次过程补回来
    } else {
      this.sTab.style.transition = '1s';
      this.sTab.style.top = t - this.speed + 'px';
    }
  }

  bidscrollTop() { // 招投标
    const t = this.bidsTab.offsetTop; // 获取要滚动表的位置
    if ((this.bidTbdh / 2 + t) < (this.bidSpeed / 2)) {// 比较  滚动的距离等于整个表的高度   即第一个表完全看不见
      this.bidsTab.style.transition = '0s'; // 过渡动画设为0秒
      this.bidsTab.style.top = 0; // 位置设为初始位置
      this.bidscrollTop(); // 因为偷梁换柱消耗了一次过程,所以把这一次过程补回来
    } else {
      this.bidsTab.style.transition = '1s';
      this.bidsTab.style.top = t - this.bidSpeed + 'px';
    }
  }

  scrollTop2() {
    const t2 = this.sTab2.offsetTop; // 获取要滚动表的位置
    if ((this.tbdh2 / 2 + t2) < (this.speed2 / 2)) {// 比较  滚动的距离等于整个表的高度   即第一个表完全看不见
      this.sTab2.style.transition = '0s'; // 过渡动画设为0秒
      this.sTab2.style.top = 0; // 位置设为初始位置
      this.scrollTop2(); // 因为偷梁换柱消耗了一次过程,所以把这一次过程补回来
    } else {
      this.sTab2.style.transition = '1s';
      this.sTab2.style.top = t2 - this.speed2 + 'px';
    }
  }

  loadData() {
    this.getCapacity().subscribe(
      (value) => this.capaCity = value
    );
  }

  getCapacity() {
    const url = `${environment.baseUrlHomePage}jcBigScreen_4`;
    return timer(1000, 1000 * 60 * 30).pipe(
      switchMap(() => {
        console.log('jcBigScreen_4', new Date());
        return this.http.get(url, {});
      }),
      filter<any>(value => value.code === 100 && value.msg === '成功'),
      map(value => value.data)
    );
  }

  route() {
    this.router.navigate(['/system/dashboard']);
  }


}
