import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '@util/utils';
import {Router} from '@angular/router';
import {urls} from '@model/url';
import { Title } from '@angular/platform-browser';
import {HttpUtilService} from '@service/http-util.service';

@Component({
  selector: 'app-home-page-goods',
  templateUrl: './home-page-goods.component.html',
  styleUrls: ['./home-page-goods.component.css']
})
export class HomePageGoodsComponent implements OnInit {
  totalNumber: any = String(new Date(new Date().toLocaleDateString()).getTime() / 1000 / 1200).substring(1);
  addNumber: any = new Date().getHours() * 3;

  constructor(public router: Router,
              private http: HttpUtilService,
              private titleEmit: Title
  ) {
  }

  dataSet: any = [
    {
      startPoint: '山东省青岛市',
      endPoint: '山西省太原市',
      type: '白卷',
      zong: '100/20',
      price: '32（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省青岛市',
      endPoint: '黑龙江省哈尔滨市道里区',
      type: '型钢',
      zong: '321/31',
      price: '15（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省青岛市',
      endPoint: '天津天津市和平区',
      type: '卷板',
      zong: '510/300',
      price: '312（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山西省太原市',
      type: '白卷',
      zong: '110/25',
      price: '32（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '辽宁省沈阳市和平区',
      type: '型钢',
      zong: '231/110',
      price: '59（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省淄博市博山区',
      type: '白卷',
      zong: '511/200',
      price: '52（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区',
      type: '型钢',
      zong: '231/20',
      price: '59（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市市北区',
      type: '白卷',
      zong: '105/20',
      price: '32（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省枣庄市市中区',
      endPoint: '山东省济南市历下区',
      type: '型钢',
      zong: '1111/565',
      price: '50（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区',
      type: '黑卷	',
      zong: '2121/220',
      price: '52（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区	',
      type: '窄带',
      zong: '1111/560',
      price: '53（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区',
      type: '型钢	',
      zong: '3021/670',
      price: '59（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区',
      type: '卷板',
      zong: '3651/1212',
      price: '76（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省济南市历下区',
      type: '卷板',
      zong: '1000/567',
      price: '65（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省青岛市黄岛区',
      type: '冷板',
      zong: '1321/743',
      price: '75（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },
    {
      startPoint: '山东省日照市岚山区',
      endPoint: '山东省淄博市淄川区',
      type: '冷板',
      zong: '1123/563',
      price: '69（元/吨）',
      vehiclenullDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}-${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000), 'yyyy.MM.dd')}`,
      publishDate: `${Utils.dateFormat(new Date(new Date(new Date().toLocaleDateString()).getTime()), 'yyyy.MM.dd')}`
    },];
  type: any;
  tableLoading1 = false;
  zhuang: any;
  xie: any;
  provinces: any;
  dateRange: any;
  cities: any = {
    zhejiang: [
      {
        value: 'hangzhou',
        label: '杭州'
      },
      {
        value: 'ningbo',
        label: '宁波',
        isLeaf: true
      }
    ],
    jiangsu: [
      {
        value: 'nanjing',
        label: 'Nanjing'
      }
    ]
  };
  scenicspots: any = {
    hangzhou: [
      {
        value: 'xihu',
        label: '西湖区',
        isLeaf: true
      }
    ],
    nanjing: [
      {
        value: 'zhonghuamen',
        label: '中华门',
        isLeaf: true
      }
    ]
  };

  ngOnInit() {
    this.titleEmit.setTitle('汇好运-货源信息');
  }

  onChanges(values): void {
  }

  dateChange(date){

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
