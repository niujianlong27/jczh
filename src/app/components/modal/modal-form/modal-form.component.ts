import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  template: `
<nz-modal [(nzVisible)]="modalFormVisible" nzTitle="{{modalTitle}}" (nzAfterClose)="closeResult()" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
  <form nz-form [formGroup]="modalValidateForm">
  <nz-form-item *ngFor="let m of modalFormData">
    <nz-form-label [nzSpan]="6" nzRequired="{{m.require}}" nzFor="{{m.name}}">{{m.name}}</nz-form-label>
    <nz-form-control [nzSpan]="14">
      <input type="{{m.type}}" *ngIf="m.type == 'text'" nz-input formControlName="{{m.name}}"  [attr.id]="m.name">
      <nz-radio-group  [attr.id]="m.name" *ngIf="m.type == 'radio'" formControlName="{{m.name}}">
        <label nz-radio nzValue="{{r.name}}" *ngFor="let r of m.radioArr">{{r.name}}</label>
      </nz-radio-group>
      <nz-form-explain *ngIf="modalValidateForm.get(m.name).dirty && modalValidateForm.get(m.name).errors">{{m.validateCon}}</nz-form-explain>
    </nz-form-control>
  </nz-form-item>
  </form>
</nz-modal>
  `,
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent implements OnInit {
  modalValidateForm: FormGroup;

  @Input() modalFormVisible: boolean; // 弹窗显示

  @Input() modalTitle: string; // 弹窗标题
  @Input() modalFormData: Array<any>; // 弹窗数据

  @Output() modalResult = new EventEmitter<any>(); //
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    this.modalFormData =  this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      this.modalValidateForm.addControl(this.modalFormData[i].name, new FormControl(
      '', this.modalFormData[i].require ? Validators.required : null
      ));
    }
  }

  handleOk(): void {
    // tslint:disable-next-line: forin
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].markAsDirty();
      this.modalValidateForm.controls[ i ].updateValueAndValidity();
    }
   this.modalResult.emit({data: this.modalValidateForm, type: 'ok'});
  }

  handleCancel(): void {
    this.modalResult.emit({type: 'cancel'});
  }
  closeResult(): void {
    this.modalValidateForm.reset();
  }
}
