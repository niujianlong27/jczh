import { Component, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { GlobalService } from '@service/global-service.service';
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'modal-tpl',
  template: `
  <nz-modal [(nzVisible)]="visabled" *ngIf="modalNo" [nzTitle]="modalTitle" [nzContent]="modalContent" [nzFooter]="modalFooter"
  (nzOnCancel)="cancel()" (nzOnOk)="success()" (closeResult)="closeResult()" [nzWidth]="nzWidth">
    <ng-template #modalTitle>
      <p *ngIf="!tplTitle"><span>{{firstName}} &gt;</span> <span>{{title}}</span></p>
      <p *ngIf="tplTitle"><span>{{tplTitle}}</span></p>
    </ng-template>

    <ng-template #modalContent>
      <ng-content #modalTplContent></ng-content>
    </ng-template>

    <ng-template #modalFooter>
        <button nz-button nzType="primary" (click)="success()">{{footerButton.okName}}</button>
        <button nz-button nzType="default" (click)="cancel()">{{footerButton.cancelName}}</button>
    </ng-template>
  </nz-modal>

  `,
  styles: []
})
export class ModalTplComponent {
  firstName: string;
  visabled = false;
  modalNo = false;
  subscription: Subscription;
  @Input() title: string; // 第二标题
  @Input() tplTitle: string; // 弹窗自定义标题
  @Input() set modalShow (modalShow: boolean) {
    if (modalShow) {
        this.modalNo = true;
        of(this.modalNo).pipe(delay(30)).subscribe(x => this.visabled = x);
    } else {
      this.visabled = false;
      of(this.visabled).pipe(delay(300)).subscribe(x => this.modalNo = x);
    }
  } // 显示
  @Input() nzWidth: any; // 宽度
  @Input() footerButton: any = {okName: '确定', cancelName: '取消'}; // 配置按钮名称
  @Input() modalTplContent: TemplateRef<any>; // 内容
  @Output() modalOkResult = new EventEmitter<any>(); // 确定
  @Output() modalCancelResult = new EventEmitter<any>(); // 取消

  @Output() modalClose = new EventEmitter<any>(); // 关闭弹窗
  constructor (private glo: GlobalService) {
  }
  ngOnInit () {
  // this.subscription = this.glo.titleEventEmitter.subscribe((x:any)=>{ this.firstName = '123';});
  }
  cancel(): void {
      this.modalCancelResult.emit();
  }
  success(): void {
      this.modalOkResult.emit();
  }
  closeResult(): void {
    this.modalClose.emit();
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
