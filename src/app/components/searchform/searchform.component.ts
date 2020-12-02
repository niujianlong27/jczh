import {Component, OnInit, Input, Output, EventEmitter, TemplateRef, ElementRef} from '@angular/core';
import {UserinfoService} from '@service/userinfo-service.service';
import {GlobalService} from '@service/global-service.service';
import {Utils} from '@util/utils';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';
import {TplButtonsService} from '../tpl-buttons/tpl-buttons.service';
import {Utils as SeaUtils} from '../../sysmanage/sea/common/utils';
import {parse, format} from 'date-fns';

import {CodesetService} from '../../sysmanage/sea/common/codeset.service';
import {NzMessageService} from 'ng-zorro-antd';
import {first, filter} from 'rxjs/operators';

import {ContainerHeightService} from '@service/container-height.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-searchform',
  templateUrl: `./searchform.component.html`,
  styleUrls: ['./searchform.component.less'],
})
export class SearchformComponent implements OnInit {
  readonly formatDate: string = 'yyyy-MM-dd';
  readonly formatTime: string = 'yyyy-MM-dd HH:mm:ss';
  private tempFormId: string; // 页面信息存储时存储formId
  private segmentNameBool: boolean; // 是否存在业务板块
  private segmentNameObj: {[key: string]: any} = {};
  requiredArr: any[] = [];
  isCollapse = true;
  findObj: any = {}; // 存放接收到的查询按钮数据 默认不展示
  selectArr: any = {};
  queryParameterList: any; // 查询参数
  pageLength: boolean; // 条数
  controlArray: Array<any> = []; // 查询数据
  checkBoxVisible = true; // 选择是否显示
  searchFormHidden = false;
  searchOptionsArr: any[] = [
    {name: '包含', value: '包含'},
    {name: '不包含', value: '不包含'},
    {name: '等于', value: '等于'},
    {name: '不等于', value: '不等于'},
    {name: '小于', value: '小于'},
    {name: '小于或等于', value: '小于或等于'},
    {name: '大于', value: '大于'},
    {name: '大于或等于', value: '大于或等于'},
    {name: '介于', value: '介于'}
  ];
  mutiSearchGridId: string;
  private searchFormEl: HTMLElement;
  @Input() formId: string; // 优先级高
  @Input() gridId: string; //
  @Input() searchFormShow: boolean; // 查询区域展示，如果没有buttonId === find设置
  @Input() searchDataHiden: any = {}; // 是个对象，根据设置对应的parameter属性值来进行隐藏
  @Input() btnHiden: any = {};
  @Input() isClick = false;
  @Input() triggerSearch = false; // 查询数据返回接口默认不触发查询，修改true触发查询
  @Output() search = new EventEmitter<any>(); // 查询
  @Output() modelChange = new EventEmitter<any>(); // 输入框变化
  @Output() reset = new EventEmitter<any>(); // 重置
  @Input() staticData: (data: string) => Observable<any[]> ; // 静态数据自定义 [{name: null,value: null}]
  @Input() nodes: any;
  @Input() postQueryHidden: boolean; // postQuery选择框隐藏
  @Output() searchDataReturn = new EventEmitter<any>(); // 查询区域数据返回
  @Output() searchComponent = new EventEmitter<any>(); // 查询区域数据返回
  @Input() businessModuleNamecheck: boolean = true;
  @Input() suffixTemplate: TemplateRef<void>;

  constructor(private http: HttpUtilService,
              private info: UserinfoService,
              private glo: GlobalService,
              private tplBtnService: TplButtonsService,
              private codeset: CodesetService,
              private msg: NzMessageService,
              private clickHeight: ContainerHeightService,
              private el: ElementRef) {

  }

  ngOnInit() {
    this.tempFormId = this.formId || this.info.APPINFO.formId; // formId
    this.listSearchGet();
    this.tplBtnService.btnFind.pipe( // 接收按钮组件的查询按钮信息
      filter((y: any) => y.formId === this.tempFormId)
    ).subscribe((x: any) => {
      this.findObj = Array.isArray(x.find) && x.find[0] || {};
    });
   this.tplBtnService.collaspedSearch.pipe( // 按钮组件查询隐藏和显示触发的事件
      filter((x: any) => x.formId === this.tempFormId),
    ).subscribe((y: any) => {
      this.searchFormHidden = y.searchFormHidden;
      window.setTimeout(() => {
        this.clickHeight.currentSearchHeight.emit({formId: this.tempFormId, height: this.searchFormEl.offsetHeight});//
      });
    });

    this.glo.pageNumEmitter.pipe( // 表格组件页面条数页码事件触发
      filter((x: any) => (x.formId === this.tempFormId) && (x.gridId === this.mutiSearchGridId))
    ).subscribe((data: any) => { // 条数和页码变动 如果一个页面有多个表格需要自定义
      this.pageLength = data.length; // 记录条数
        if (!data.search) {
        this.search.emit({
          queryParameterList: this.queryParameterList,
          page: data.page,
          length: data.length}); // 如果是查询触发的,初始化传递条数不用在执行了
        }
    });

    const userset = JSON.parse(localStorage.getItem('USERSET') || '{}');
    this.checkBoxVisible = userset.checkBoxVisible;

  this.glo.checkBoxEmitter.subscribe((data: any) => this.checkBoxVisible = data.checkBox);

    // mutiSearch GridId获取
    this.glo.tableGridIdToSearchForm.pipe(
      first()
    ).subscribe((x: any) => {
      this.mutiSearchGridId = this.gridId ? this.gridId : (x.formId === this.tempFormId) && x.gridId;
    });
    // 高级搜索方案临时修改
  this.glo.findChangeEmitter.pipe(
      filter((x: any) => x.formId === this.tempFormId)
    ).subscribe((data: any) => {
      this.findChange(data);
      window.setTimeout(() => {
        this.clickHeight.currentSearchHeight.emit({formId: this.tempFormId, height: this.searchFormEl.offsetHeight}); //
      });
    });
  }
  private validateSegmentValue(): boolean {
    const data =  (this.queryParameterList || []).filter(x => x.parameter === this.segmentNameObj.parameter);
    if (data.length && data[0].value1) {
      return true;
    }
    return false;
  }

  listSearch(): void { // 列表查询
    this.searchFormat();
    const segmentNameValue = this.validateSegmentValue();
    if (this.info.get('USER').companyType === 'GSLX20' &&
      this.segmentNameBool &&
      (segmentNameValue && this.checkBoxVisible && !this.segmentNameObj.checkBox  || !segmentNameValue) &&
      this.info.get('USER').remark !== 'true'&&this.businessModuleNamecheck) {
        this.msg.error('查询区域业务板块必须设置且有值！', {nzDuration: 5000});
        return;
      }
    this.search.emit({queryParameterList: this.queryParameterList, length: this.pageLength, page: 1}); // 查询触发，查询是页码重置为1
    this.glo.pageNumEmitter.emit({
      formId: this.tempFormId,
      gridId: this.mutiSearchGridId,
      length: this.pageLength,
      page: 1,
      search: true
    }); // 查询的时候页码要重置为1，
  }

  resetForm(): void { // 重置
    this.controlArray.map((data, i) => {
      this.controlArray[i].value1 = null;
      this.controlArray[i].value2 = null;
      this.controlArray[i].checkBox = false;
    });
    this.reset.emit(this.controlArray);
  }

  selectedData(data: any, item: any): void {
    item.value1 = data.inpName;
  }

  // 日期禁止
  disabledDate(data: any, flag: number): any {
    return (d: Date) => {
      if ((flag === 2) && data.value1 && (parse(data.value1).getTime() > d.getTime())) {
        return true;
      }
      if ((flag === 1) && data.value2 && (parse(data.value2).getTime() < (d.getTime() - 86400000))) {
        return true;
      }
    };
  }

  dateopen(n: boolean, data: any, flag: number) {
    if (data.query === '介于' && n && (!data.format || data.format === 'yyyy-MM-dd HH:mm:ss' || data.format === 'yyyy-MM-dd HH:mm')) {
      const today = new Date();
      let date = format(today, 'YYYY-MM-DD');
      if (flag === 1) {
        date = !data.value2 ? date : format(data.value2, 'YYYY-MM-DD');
        data.value1 = new Date(`${date} 00:00:00`);
        data.checkBox = true;
      } else {
        date = !data.value1 ? date : format(data.value1, 'YYYY-MM-DD');
        data.value2 = new Date(`${date} 23:59:59`);
      }
    }
  }
  // 查询数据格式处理
  private controlArrayFilter() {
    this.controlArray.map((x: any) => {
      if (!x.postQuery) { x.postQuery = '且'; }
      if (!x.query) { x.query = '包含'; }
      !x.value1 ? x.value1 = null :  x.checkBox = true;
      // if(!x.value1) {
      //   x.value1 = null;
      // }else{
      //   x.checkBox = true;
      // //  valHad = true;
      // };
      if (!x.value2) { x.value2 = null; }
      // tslint:disable-next-line: max-line-length
      const segmentNameBool = 'businessModuleName' === x.parameter || 'businessTypeName' === x.parameter || 'segmentName' === x.parameter; // 业务板块参数名必须为这个
      if (segmentNameBool) { // 有业务板块
        if (this.info.get('USER').segmentName) {
          x.checkBox = true;
          x.value1 = this.info.get('USER').segmentName;
        }
         this.segmentNameBool = true;
         this.segmentNameObj = x;
         x.apiParameter = JSON.parse(x.apiParameter || '{}');
         x.apiParameter.optionList = [];
         if (this.info.get('USER').companyType === 'GSLX20') {
          this.requiredArr = [x];
         }
         this.getUserBusiSegment(x, x.apiParameter.optionList);
       //  valHad = true;
      }
      // 用于绑定value2数据输入框name属性,以解决查询条件初始值无法绑定问题（zhengxin_2019-04-18）
      x.parameter2 = `${x.parameter}_between_end`;
      if ('select' === x.queryBoxType || 'selectByValue' === x.queryBoxType) {
        if ('select' === x.queryBoxType) {
          x.query = x.query !== '等于' && x.query !== '不等于' ? '等于' : x.query;
        }
        if (!segmentNameBool) {
          x.apiParameter = JSON.parse(x.apiParameter || '{}');
          x.apiParameter.optionList = [];
          // 添加属性 noStatic 可 设置true 关闭组件内静态数据的获取
          if (x.apiParameter && x.apiParameter.valueSetCode && !x.apiParameter.valueSet && !x.noStatic) {
            this.getStaticFun(x.apiParameter.valueSetCode, x.apiParameter.optionList);
          }
          if (x.apiParameter && x.apiParameter.valueSet) {
            const arr = JSON.parse(x.apiParameter.valueSet);
            x.apiParameter.optionList.push(...arr);
          }
        }
      }
      if ('date' === x.queryBoxType) {
        x.format = x.queryFormat || x.format || 'yyyy-MM-dd HH:mm:ss';
        x.value1 = SeaUtils.computeDate(x.value1, x.compute1);
        x.value2 = SeaUtils.computeDate(x.value2, x.compute2);
      }
      if ('radio' === x.queryBoxType) {
        if (typeof x.apiParameter === 'string') {
          x.apiParameter = JSON.parse(x.apiParameter);
        }
        x.apiParameter.optionList = [];
        // tslint:disable-next-line: no-unused-expression
        x.apiParameter && x.apiParameter.url && this.getCustomOptions(x);
      }
    });
  }
   // 查询区域数据获取
   listSearchGet(): void {

    this.http.post(urls.finds, {
      formId: this.tempFormId,
      gridId: this.gridId,
      userId: this.info.APPINFO.USER.userId
    }).then(
      (res: any) => {
        if (res.success) {
            const temp = res.data.data[0] && res.data.data[0].findSet || '[]';
            this.controlArray = JSON.parse(temp).filter(item => item.parameter);
           // let valHad = false;
            this.controlArrayFilter();
           // if(valHad){ //value1默认值
           if (this.triggerSearch) { // 有初始值可以设置true触发初始查询
            window.setTimeout(() => {
              this.searchFormat();
              this.search.emit({
                queryParameterList: this.queryParameterList,
                length: this.pageLength || 30,
                page: 1
              }); // 查询触发，查询是页码重置为1
            }, 1000);
           }
       //   }
          this.searchDataReturn.emit(this.controlArray); // 数据返回
          this.searchComponent.emit(this);
       } else {
          this.controlArray = [];
        }
        window.setTimeout(() => {
          this.searchFormEl = this.el.nativeElement.querySelector('form.search-form');
          const h = this.searchFormEl ? this.searchFormEl.offsetHeight : 0;
          this.clickHeight.primarySearchHeight.emit({formId: this.tempFormId, height: h});
        }, 50);
      }
     );
   }
   /**
   *
   * @param data getuserBusiSegment
   */
  private getUserBusiSegment(x: any, parameter: Array<any>) {
     this.http.post(urls.userBusiSegment, {confirmed: 1}).then(
      (res: any) => {
          const data = (res.data.data || []).map( (x: any) => ({name: x.segmentName, value: x.segmentId}));
          if (!data[0]) { x.checkBox = false; }
          Array.prototype.push.apply(parameter, data);
      }
    );
  }
  //
  getStaticFun(valueSetCode: string, parameter: Array<any>): void {
    if (this.staticData) {
      this.staticData(valueSetCode).subscribe(x => {
        Array.prototype.push.apply(parameter, x);
      });
      return;
    }
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          // this.selectArr[parameter] = res.data.data.data;
          Array.prototype.push.apply(parameter, res.data.data.data)

        }
      }
    );
  }

  /**
   * l自定义请求选择列表
   * @param apiParameter
   */
  getCustomOptions(condition: any) {
    const apiParameter = condition.apiParameter;
    if ('local' === apiParameter.requestType) {
      if (apiParameter.url === 'bizScope') {
        this.codeset.reFetchSeaUserInfo().then(() => {
          const bizScope = this.info.APPINFO.USER.requestUserSegmentId || this.info.APPINFO.USER.seaUserBizScope;
          apiParameter.optionList = this.codeset.getItems('bizScope', bizScope);
          if (!apiParameter.optionList || apiParameter.optionList.length === 0) {
            this.msg.warning('该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。');
          } else if (apiParameter.optionList.length > 1) {
            apiParameter.optionList = [{label: '全部', value: ''}, ...apiParameter.optionList];
          } else {
            condition.value1 = apiParameter.optionList[0].value;
          }
        });
      }
    } else {
      this.http.post(urls[apiParameter.url], {...apiParameter.parameter}).then(
        (res: any) => {
          if (res.success) {
            apiParameter.fieldKey = apiParameter.fieldKey ? JSON.parse(apiParameter.fieldKey) : this.defaultFieldKey;
            apiParameter.optionList = this.dataTransform(res.data.data, apiParameter.fieldKey);
          }
        }
      );
    }
  }

  defaultFieldKey: any = {text: 'label', value: 'value'}; // 下拉框的数据格式
  dataTransform(data: Array<any>, fieldKey: any) {
    let _data = [];
    for (let i = 0; i < data.length; i++) {
      _data[i] = {};
      _data[i].label = data[i][fieldKey.text];
      _data[i].value = data[i][fieldKey.value];
    }
    return _data;
  }

  // input框值发生变化
  searchModelChange(val: any, data: any) {
    const h = Array.isArray(val) ? val[0] : val;
    data.checkBox = h ? true : false;
    if ('radio' === data.queryBoxType) {
      data.value1 = val;
      this.listSearch();
    }
    if (this.isClick) { // 输入框内容变化，将查询条件抛出
      data.value1 = val;
      this.searchFormat();
      this.modelChange.emit({queryParameterList: this.queryParameterList, length: this.pageLength || 30, page: 1}); //查询触发，查询是页码重置为1
    }

  }

  // 高级搜索后的设置
  findChange(data: any): void {
    this.controlArray = JSON.parse(data.findSet);

    // for (let i = 0; i < this.controlArray.length; i++) {

    //   if ('select' == this.controlArray[i].queryBoxType) {
    //     this.controlArray[i].apiParameter = JSON.parse(this.controlArray[i].apiParameter || '{}');
    //     this.controlArray[i].apiParameter.optionList = [];
    // tslint:disable-next-line: max-line-length
    //     this.controlArray[i].apiParameter && this.controlArray[i].apiParameter.valueSetCode && this.getStaticFun(this.controlArray[i].apiParameter.valueSetCode, this.controlArray[i].apiParameter.optionList);
    //   }
    // }
    this.controlArrayFilter();
    this.searchDataReturn.emit(this.controlArray); // 数据返回
    this.searchComponent.emit(this);
  }

  private searchFormat() {
    let arr = [];
    this.queryParameterList = [];
    arr = this.checkBoxVisible && this.controlArray.filter((x: any) => (x.value1 || x.value2) && x.checkBox);
    arr = !this.checkBoxVisible && this.controlArray.filter((x: any) => x.value1 || x.value2) || arr;
    this.queryParameterList = Utils.deepCopy(arr);
    this.queryParameterList.forEach((x: any, listIndex: number) => {
      const apiParameter = Utils.deepCopy(x.apiParameter);
      x.apiParameter = x.apiParameter && x.apiParameter.toString();
      if (x.queryBoxType === 'date') { // 对时间的处理
        // x.value1 = x.value1 && Utils.dateFormat(x.value1,x.format || 'yyyy-MM-dd HH:mm:ss');
        // x.value2 = x.value2 && Utils.dateFormat(x.value2,x.format || 'yyyy-MM-dd HH:mm:ss');
        // 无法格式化字符串优化（zhengxin_2019-04-18）
        x.value1 = x.value1 && SeaUtils.dateformat2(x.value1, x.format);
        x.value2 = x.value2 && SeaUtils.dateformat2(x.value2, x.format);
        if (x.query === '介于' && (x.value1 || x.value2)) {
          x.value1 = !x.value1 ? SeaUtils.dateformat2(x.value2.slice(0, 10) + ' 00:00:00', x.format) : x.value1;
          x.value2 = !x.value2 ? SeaUtils.dateformat2(x.value1.slice(0, 10) + ' 23:59:59', x.format) : x.value2;
          arr[listIndex].value1 = x.value1;
          arr[listIndex].value2 = x.value2;
        }
      }
      if (x.queryBoxType === 'selectByValue' || x.queryBoxType === 'select') {
          const _optionList = apiParameter.optionList || [];
          const _value = _optionList.filter(y => y.name === x.value1);
          x.value2 = _value[0] && _value[0].value;
      }
      //  x.value1 = x.value1 && x.value1.trim();
      x.value1 = (Array.isArray(x.value1) ? x.value1.join(',') : x.value1);
      x.value1 = x.value1 && x.value1.trim();
      x.value2 = x.value2 && x.value2.trim();
      if (x.format === 'yyyy-MM-dd') {
        const val = x.value1;
        switch (x.query) {
          case '等于':
            x.query = '介于';
            x.value1 = `${val} 00:00:00`;
            x.value2 = `${val} 23:59:59`;
            break;
          case '不等于':
            x.value1 = `${val} 00:00:00`;
            x.value2 = `${val} 23:59:59`;
            break;
          case '小于':
            x.value1 = `${val} 00:00:00`;
            break;
          case '小于或等于':
            x.value1 = `${val} 23:59:59`;
            break;
          case '大于':
            x.value1 = `${val} 23:59:59`;
            break;
          case '大于或等于':
            x.value1 = `${val} 00:00:00`;
            break;
          case '介于':
            x.value1 = `${val} 00:00:00`;
            x.value2 = `${x.value2} 23:59:59`;
            break;
          default:
            break;

        }
      }
    });
    this.queryParameterList = this.queryParameterList[0] ? this.queryParameterList : undefined;
  }

  ngOnDestroy() {

  }
}
