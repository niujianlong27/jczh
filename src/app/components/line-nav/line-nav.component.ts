/**
 * 顶部tab
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '@service/global-service.service';
@Component({
  selector: 'app-line-nav',
  templateUrl: './line-nav.component.html',
  styleUrls: ['./line-nav.component.css']
})


export class LineNavComponent implements OnInit {
  selectIndex: number;
  @Input() selectMenuUrl: string;
  @Input() formId: string;
  @Output() selectTipNav = new EventEmitter<any>();
  @Output() deleteTipNav = new EventEmitter<any>();
  @Input()  tipNavArr: any[];
  @Input() set urlChange(val: boolean) {
    for (let i = 0; i < this.tipNavArr.length; i++) {
      const url = this.tipNavArr[i].formUrl && this.tipNavArr[i].formUrl.startsWith('/') ?
      this.tipNavArr[i].formUrl.slice(1) : this.tipNavArr[i].formUrl;
      const curUrl = this.selectMenuUrl && this.selectMenuUrl.startsWith('/') ? this.selectMenuUrl.slice(1) : this.selectMenuUrl;
        if (url === curUrl) {
            this.selectIndex = i;
            break;
        }
    }
  }
  constructor(
    private glo: GlobalService
  ) { }

  ngOnInit() {
  }
  selectTipNavFun(data: any) {
      this.selectTipNav.emit(data);
  }
  deleteTipNavFun(index: number, act: boolean) {
      this.deleteTipNav.emit({ 'index' : index, 'act': act});
  }
}
