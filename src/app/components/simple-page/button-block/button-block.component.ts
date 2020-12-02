import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { urls } from '../../../common/model/url';

@Component({
  selector: 'app-button-block',
  templateUrl: './button-block.component.html',
  styleUrls: ['./button-block.component.css']
})
export class ButtonBlockComponent implements OnInit {

  buttons: Array<any> = [];

  @Input() formId: string;
  @Input() userId: string;

  @Output() buttonClick = new EventEmitter();

  constructor(private http: HttpUtilService, 
    private appInfo: UserinfoService,) { }

  ngOnInit() {
     // 界面ID，默认为当前界面ID
    this.formId = this.formId || this.appInfo.APPINFO.formId;
    // 用户ID， 默认为当前用户ID
    this.userId = this.userId || this.appInfo.APPINFO.USER.userId;
    
    //获取按钮
    this.http.post(urls.button,{formId: this.formId, userId: this.userId}).then((res:any)=>{ 
      if(res.success){
        // 只渲染按钮类型为10并且不是Find的按钮
        this.buttons = res.data.data.filter(item => item.type === 'ANLX10' && item.buttonId !== 'Find');
      }
    });
  }

  buttonClicked(button: any){
    // this.buttonClick.emit(`button_${button.buttonId}_onclick`);
    this.buttonClick.emit(`${button.buttonId}`);
  }

}
