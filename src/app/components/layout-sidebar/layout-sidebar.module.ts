import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NzMenuModule, NzIconModule } from 'ng-zorro-antd';
import { LayoutSidebarComponent } from './layout-sidebar.component';
import { SidebarExpandDirective } from './sidebar-expand.directive';
@NgModule({
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    DragDropModule,
    PerfectScrollbarModule
  ],
  declarations: [LayoutSidebarComponent, SidebarExpandDirective],
  exports: [ LayoutSidebarComponent ]
})
export class LayoutSidebarModule { }
