/**
 * 用于下拉数据量过大，实现前端本地每次下拉加载10条
 */
import { Directive, OnInit, Input, HostListener} from '@angular/core';

@Directive({
  selector: '[appSelectLocalLoad]',
})
export class SelectLocalLoadDirective implements OnInit {
  @Input() storageData: Array<any> = [];  // 下拉数据总集合
  @Input() selectValue: any;  // 下拉显示数据集合
  @Input() toObj: any; // toObj传进来的值必须是对象否则无法实现双向绑定
  constructor(
  ) { }
  ngOnInit() {
  }
  @HostListener('nzOnSearch', ['$event'])
  /**
   * 下拉选择搜索
   */
  nzOnSearch(event) {
    if (event) {
      this.selectValue[this.toObj] = this.storageData;
    } else {
      this.selectValue[this.toObj] = [];
      this.selectValue[this.toObj] = [...this.selectValue[this.toObj], ...this.storageData.slice(0, 10)];
    }
  }
  /**
   * 下拉选择滚动到底部
   */
  @HostListener('nzScrollToBottom', ['$event'])
  nzScrollToBottom(event) {
    let length: any = 0;
    length = this.selectValue[this.toObj].length;
    this.selectValue[this.toObj] = [...this.selectValue[this.toObj], ...this.storageData.slice(length, length + 10)];
  }
}
