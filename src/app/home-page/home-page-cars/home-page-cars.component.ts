import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Utils} from '@util/utils';
import {Router} from '@angular/router';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page-cars',
  templateUrl: './home-page-cars.component.html',
  styleUrls: ['./home-page-cars.component.css']
})
export class HomePageCarsComponent implements OnInit {
  driverCount:any;
  vehicleCount:any;
  validateForm: FormGroup;
  type: any;
  startPoint: any;
  endPoint: any;
  vehiclennull: any;
  driverList: any = [{
    startPoint: '天津天津市和平区',
    endPoint: '北京北京市东城区',
    vehicleKind: '半挂',
    transWeight: '42',
    vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
    publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
  },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市黄岛区',
      vehicleKind: '半挂',
      transWeight: '35',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济宁市梁山县',
      vehicleKind: '罐车',
      transWeight: '32',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山西省太原市',
      vehicleKind: '翻斗',
      transWeight: '30',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省泰安市肥城市',
      vehicleKind: '半挂',
      transWeight: '31',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市黄岛区',
      vehicleKind: '半挂',
      transWeight: '35',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省泰安市肥城市',
      vehicleKind: '半挂',
      transWeight: '35',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '辽宁省丹东市元宝区',
      endPoint: '辽宁省锦州市凌海市',
      vehicleKind: '挂车',
      transWeight: '45',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '辽宁省丹东市元宝区',
      endPoint: '辽宁省锦州市凌海市',
      vehicleKind: '半挂',
      transWeight: '35',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '北京北京市东城区',
      endPoint: '山西省太原市小店区',
      vehicleKind: '罐车',
      transWeight: '32',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省泰安市肥城市',
      vehicleKind: '罐车',
      transWeight: '32',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市黄岛区',
      vehicleKind: '半挂',
      transWeight: '35',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '河北省唐山市路南区',
      endPoint: '河北省秦皇岛市海港区',
      vehicleKind: '罐车',
      transWeight: '32',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济宁市梁山县',
      vehicleKind: '挂车',
      transWeight: '45',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省济南市市中区',
      endPoint: '山东省青岛市',
      vehicleKind: '挂车',
      transWeight: '45',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市黄岛区',
      vehicleKind: '罐车',
      transWeight: '32',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },];

  constructor(public router: Router,
              private http: HttpUtilService,
              private titleEmit: Title
  ) {
  }

  ngOnInit() {
    this.selectVehicleCount();
    this.selectDriverCount();
    this.titleEmit.setTitle('汇好运-车源信息');
  }

  selectDriverCount() {
    this.http.post(urls.selectDriverCount, {}).then(
      (res: any) => {
        this.driverCount = res.data.data;

      });
  }

  selectVehicleCount() {
    this.http.post(urls.selectVehicleCount, {}).then(
      (res: any) => {
        this.vehicleCount = res.data.data;

      });
  }

  onChanges(values): void {
  }


  loadData = (node: any, index: number) => {
    return new Promise(resolve => {
      let level = '';
      let parentCode = '';
      if (index < 0) {
        level = 'DZDJ10';
      } else if (index === 0) {
        level = 'DZDJ20';
        parentCode = node.value;
        node.children = null;

      } else {
        node.children = null;
        level = 'DZDJ30';
        parentCode = node.value;
      }
      this.setRequester({level: level, parentCode: parentCode}).then(res => {
        node.children = res;
        resolve();
      });

    });
  };

  setRequester(data) {
    return new Promise((resolve, reject) => {
      this.getAddressData(data, resolve);
    });
  }

  getAddressData = (data, resolve) => { // 获取省市区
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          let addressData = [];
          if (data.level == 'DZDJ30') {
            addressData = res.data.data.map(item => {
              return {
                value: item.code,
                label: item.name,
                isLeaf: true
              };
            });
          } else {
            addressData = res.data.data.map(item => {
              return {
                value: item.code,
                label: item.name,

              };
            });
          }
          resolve(addressData);
        }

      }
    );
  };

  route() {
    this.router.navigate(['/system/dashboard']);
  }
}
