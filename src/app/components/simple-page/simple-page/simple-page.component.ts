import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { InquBlockComponent } from '../inqu-block/public-api';
import { GridBlockComponent } from '../grid-block/public-api';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { environment } from '../../../../environments/environment.hmr';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-simple-page',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.css']
})
export class SimplePageComponent implements OnInit {

  queryLoading: boolean = false;
  data: Array<any> = [];
  total: number = 0;

  @Input() formId: string;
  @Input() queryUrl: string;

  @Output() queryClick = new EventEmitter(); // 查询方法
  @Output() buttonClick = new EventEmitter(); // 按扭区方法

  @ViewChild(InquBlockComponent) inqu: InquBlockComponent;
  @ViewChild(GridBlockComponent) grid: GridBlockComponent;

  constructor(private http: HttpUtilService,
    private appInfo: UserinfoService,
    private msg: NzMessageService) { }

  ngOnInit() {
    // 界面ID，默认为当前界面ID
    this.formId = this.formId || this.appInfo.APPINFO.formId;
  }

  /**
   * 查询方法
   * @param conditions
   * 发射查询条件以及分页查询数据 queryParam 
   */
  queryClicked(conditions: any) {
    const param = { queryParameterList: conditions, ...this.grid.getQueryPaginationObj() };
    // 如果配置了queryUrl，则直接调用后台查询方法，否则发射查询条件到组件绑定方法
    if(this.queryUrl){
      this.query(this.queryUrl, param);
    }else{
      this.queryClick.emit(param);
    }
    
  }

  /**
   * 改变页码、显示数量调用方法
   * @param queryPaginationObj 
   * 发射查询条件以及分页查询数据 queryParam 
   */
  paginationChange(queryPaginationObj: any) {
    const param = { queryParameterList: this.inqu.getSelectedCondition(), ...queryPaginationObj };
    // 如果配置了queryUrl，则直接调用后台查询方法，否则发射查询条件到组件绑定方法
    if(this.queryUrl){
      this.query(this.queryUrl, param);
    }else{
      this.queryClick.emit(param);
    }
  }

  /**
   * 调用后台查询方法
   */
  query(url: string, param: any) {
    this.queryLoading = true;
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.data = res.data.data.data;
          this.total = res.data.data.total;
        }
        this.queryLoading = false;
      }
    );
  }

  /**
   * 按钮区响应统一处理事件
   * @param buttonId 
   */
  buttonClicked(buttonId: string) {
    this.buttonClick.emit(buttonId);
  }

}
