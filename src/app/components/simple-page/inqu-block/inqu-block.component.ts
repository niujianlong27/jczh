import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { urls } from '../../../common/model/url';
import { GlobalService } from '../../../common/services/global-service.service';

@Component({
  selector: 'app-inqu-block',
  templateUrl: './inqu-block.component.html',
  styleUrls: ['./inqu-block.component.css']
})
export class InquBlockComponent implements OnInit {

  checkBoxVisible: boolean = true;
  // private initUserFind

  @Input() formId: string;
  @Input() userId: string;

  @Output() queryClick = new EventEmitter();

  conditions: Array<any>;

  constructor(private http: HttpUtilService,
    private appInfo: UserinfoService,
    private globalservice: GlobalService) { }

  ngOnInit() {
    // 界面ID，默认为当前界面ID
    this.formId = this.formId || this.appInfo.APPINFO.formId;
    // 用户ID， 默认为当前用户ID
    this.userId = this.userId || this.appInfo.APPINFO.USER.userId;

    this.getUserFind();
    // this.getcheckBoxVisible();

    
    let userset = JSON.parse(localStorage.getItem('USERSET') || '{}');
    this.checkBoxVisible = userset.checkBoxVisible;
    // 监听设置是否显示checkBox变化
    this.globalservice.checkBoxEmitter.subscribe((data:any)=>{
      this.checkBoxVisible = data.checkBox;
    });
  }

  // 获取条件配置列表
  private getUserFind() {
    this.http.post(urls.finds, { formId: this.formId, userId: this.userId }).then((res: any) => {
      if (res.success) {
        this.conditions = res.data.data[0]&&res.data.data[0].findSet?JSON.parse(res.data.data[0].findSet):[];
        this.conditions.forEach(item => item.checked = true);
        this.button_query_onclick();
      }
    });
  }

  // 获取是否显示checkBox
  // private getcheckBoxVisible() {
  //   const url = `${environment.baseUrl}userSet/getUserSet`;
  //   this.http.post(url, {}).then(
  //     (res: any) => {
  //       if (res.success) {
  //         this.checkBoxVisible = JSON.parse(res.data.data[0].userSet).checkBoxVisible;
  //       }
  //     }
  //   );
  // }

  public getSelectedCondition(): Array<any>{
    if(!this.checkBoxVisible)
      return this.conditions.filter(item => (item.value1||item.value2));

    return this.conditions.filter(item => item.checked===true&&(item.value1||item.value2));
  }

  button_query_onclick(){
    this.queryClick.emit(this.getSelectedCondition());
  }

  button_resetInqu_onclick(){
    console.log("resetInqu onclicked!");
  }

  button_findSet_onclick(){
    console.log("findSet onclicked!");
  }


}
