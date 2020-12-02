import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  template: `
  <nz-modal [(nzVisible)]="deleteVisible" [nzZIndex]='nzIndex' [nzMask]="nzMask"  nzTitle="{{modalTitle}}" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()" [nzOkLoading]="nzOkLoading">
     <p class="deleteCon">{{modalCon}}</p>
  </nz-modal>
  `,
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {
  @Input() deleteVisible: boolean; // 弹窗显示
  @Input() modalTitle: string; // 弹窗标题
  @Input() modalCon: Array<any>; // 弹窗数据
  @Input() nzIndex: Number; // 弹窗z-index
  @Input() nzMask = true; // nzMask
  @Output() modalConfirmResult = new EventEmitter<any>(); // 弹窗结果
  @Input() nzOkLoading = false;
  constructor() { }

  ngOnInit() {
  }
  handleOk(): void {
    this.modalConfirmResult.emit({type: 'ok'});
  }

  handleCancel(): void {
    this.modalConfirmResult.emit({type: 'cancel'});
  }
}
