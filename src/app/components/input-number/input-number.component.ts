import { Component, OnInit, forwardRef, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { isInt, isPosNum } from '@validator/validator';
@Component({
  selector: 'app-input-number',
  template: `<input nz-input #input [nzSize]="size" [(ngModel)]="inputModel" (blur)="inputModelBlur()" [disabled] ="disabled">`,
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent ),
      multi: true
    }
  ]
})
export class InputNumberComponent implements OnInit , ControlValueAccessor{
  @Input() format: string | number; // 格式化
  @Input() intType: boolean; // 是否整数
  @Input() notAbs: boolean; // 是否可以为负数，默认不为负数
  @Input() disabled: boolean|undefined;
  @Input() size: 'large'|'default'| 'small';
  @Output() blur = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  constructor() { }
  private _val = '';
  ngOnInit() {
  }
  propagateChange = (_: any) => { };
  writeValue(value: any) {
      if (value === undefined || value === '' || value === null ) {
        this._val = null; // value;
      } else {
        const val = !this.format && this.format !== 0 ? value : Number(value).toFixed(Number(this.format));
        //  this.inputModel = val;
          this._val = val;
      }
  }

  registerOnChange(fn: any) {
     this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }
  inputModelBlur() {
    this.blur.emit();
    if (!this._val) {
     return;
    }
    if (this._val.toString().charAt(this._val.length - 1) === '.' || this._val === '-') {
      this._val = this._val.slice(0, -1);
    }
    this._val = !this.format && this.format !== 0 ? this._val : Number(this._val).toFixed(Number(this.format));
    this.input.nativeElement.value = this._val;
    this.propagateChange(this._val);
  }
  @Input() set inputModel(val: string) {
       if (!this.intType) {
          if ( (!isNaN(+val) && isPosNum(val, !this.notAbs)) || val === '' || (this.notAbs && val === '-')) {
               this._val = val;
          }
       } else {
          if ( (!isNaN(+val) && isInt(val, !this.notAbs)) || val === '' || (this.notAbs && val === '-')) {
              this._val = val;
          }
       }
       this.input.nativeElement.value = this._val;
       this.propagateChange(this._val);
  }
  get inputModel() {
    return this._val;
  }
}
