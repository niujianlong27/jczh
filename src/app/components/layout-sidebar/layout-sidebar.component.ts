/*侧边导航组件*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { Title } from '@angular/platform-browser';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.css']
})
export class LayoutSidebarComponent implements OnInit {
    readonly pageTitle: string = '汇好运';
    subModuleMenuList: any[] = [];
    menuOpen: boolean[] = [];
    _formId: number;
    collapsed: boolean;
    rightshow: boolean;
    _leftNavArr: any[] = [];
    scrollBarConfig: any = {
      wheelPropagation: true,
      suppressScrollX: true
    };
  @Input() parentId: string | number;
  @Input() childrenId: string | number;
  @Input() set leftNavArr(val: any[]) {
      const dashBoard = {
        icon: './assets/img/home-icon.svg',
        url: 'system/dashboard',
        resourceName: '系统主页'
      };
      this._leftNavArr = Array.isArray(val) ? val : [];
      this._leftNavArr.unshift(dashBoard);
  }// 左侧菜单数据
  get leftNavArr() {
      return this._leftNavArr;
  }
  @Input() set formId(val: number) {
     this._formId = val;
  }
  @Output() leftNavClick = new EventEmitter<any>(); // 左侧菜单点击事件
  @Output() isCollapsed = new EventEmitter<boolean>(); // 左侧收缩
  constructor(private titleService: Title) { }

  ngOnInit() {

  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this._leftNavArr, event.previousIndex, event.currentIndex);
  }

 selectLeftNavFun(data: any) {
   // this._formId = data.formId;
    this.titleService.setTitle(`${this.pageTitle}-${data.resourceName}`);
    this.leftNavClick.emit({currentUrl: data.formUrl});
    const userset = JSON.parse(localStorage.getItem('USERSET') || '{}');
    const menucol = userset.menuCol === undefined ? true : userset.menuCol;
     menucol && this.collapsedFun();
 }
 moduleNavFun(data: any) {
   if (data.url === '/system/dashboard') {
      this.titleService.setTitle(`${this.pageTitle}-系统主页`);
      this.leftNavClick.emit({currentUrl: data.url});
      this.collapsed = true;
      this.isCollapsed.emit(this.collapsed);
      return;
   }
    this.menuOpen = [];
    this.rightshow = true;
    this.collapsed = false;
    this.isCollapsed.emit(this.collapsed);
    this.subModuleMenuList = data.subModuleMenuList || [];
    for (let i = 0; i < this.subModuleMenuList.length; i++) {
        if (this.childrenId === this.subModuleMenuList[i].resourceId) {
            this.menuOpen[i] = true;
            break;
        }
    }
    if (this.menuOpen.length < 1) { this.menuOpen = [true]; }
 }
 openChange(val: boolean, i: number) {
     this.menuOpen = [];
     this.menuOpen[i] = val;
 }
 collapsedFun() {
     this.collapsed = !this.collapsed;
     this.isCollapsed.emit(this.collapsed);
 }
}
