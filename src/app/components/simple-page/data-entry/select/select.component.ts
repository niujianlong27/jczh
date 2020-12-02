import { Component, forwardRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SelectService } from './select.service';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),//注入表单控件
      multi: true
    }]
})

//https://www.jianshu.com/p/81b4aa55a877
export class SelectComponent implements OnInit, ControlValueAccessor {
  compareFn = (o1: any, o2: any) => o1 && o2 ? o1.value === o2.value : o1 === o2;

  _value: any; // 选中的option
  options = [];//接收select的数组
  _dataSource: any;//接收本地的自定义数组或者请求返回的数组

  // @Input() apiParam: any;

  @Input() mode: 'default' | 'multiple';//单选多选
  @Input() size: 'large' | 'small' | 'default';//大小
  @Input() url: any;//请求的url
  @Input() param: any = {};
  @Input() placeHolder: any;//自定义的PlaceHolder

  @Input() disabled = false; // 设置是否禁用

  @Output() valueBack = new EventEmitter<any>();// 返回value
  @Output() labelBack = new EventEmitter<any>();// 返回label
  @Input() fieldKey: any = { text: 'text', value: 'value' };//下拉框的数据格式

  @Input()
  set dataSource(val: any) {
    this._dataSource = val;
    if (Array.isArray(this._dataSource)) {
      this.options = this._dataTransform(this._dataSource);//如果是本地数组或直接请求的数组直接复制
    }
  }
  get dataSource(): any {
    return this._dataSource;
  }

  // 列配置中api_parameter字段值
  @Input()
  set apiParam(apiParam: any){
    // TODO 根据api_parameter字段值设置单选多选，下拉数组，请求参数等
    if(!apiParam.url){
      console.error(`请求地址不能为空：${JSON.stringify(apiParam)}`);
      return;
    }
    this.url = apiParam.url;
    this.param = apiParam.param || this.param;
    this.fieldKey = apiParam.fieldKey || this.fieldKey;
  }
  get apiParam(): any{
    return this.apiParam;
  }

  //监听绑定的值，与外部的ngModel相互绑定
  set selectedOption(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChangeCallback(val ? val.value : null);
      this.valueBack.emit(val ? val.value : null);
      // let value, label;
      // if (Array.isArray(val)) {
      //   value = val.map(item => item.value).join(',');
      //   label = val.map(item => item.label).join(',');
      // } else {
      //   value = val.value;
      //   label = val.label;
      // }
      // this.onChangeCallback(value);
      // this.valueBack.emit(value);
      // this.labelBack.emit(label);
    }
  }
  get selectedOption(): any {
    return this._value;
  }

  constructor(private selectService: SelectService) {

  }

  ngOnInit() {
    // this.options = [{ label: "label1", value: "value1" }, { label: "label2", value: "value2" }, { label: "label3", value: "value3" }];
    this.mode = this.mode || 'default';
    this.size = this.size || 'default';
    //如果url存在则直接请求
    if (this.url) {
      this.selectService.getValue(this.url, this.param).then((res: any) => {
        if (res.success) {
          if (res.data.data.data) {
            this.options = this._dataTransform(res.data.data.data);
          } else {
            this.options = this._dataTransform(res.data.data);
          }
        }
      });
    }
  }

  onChangeCallback = (value: any) => { };

  onTouchedCallback = (value: any) => { };

  registerOnChange(fn: (value: any) => void) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  writeValue(value: string) {
    this.selectedOption = {value: value};
  }

  /**
   * 根据fieldKey将数组转换下拉数据源
   */
  _dataTransform(data: Array<any>) {
    let _data = [];
    for (let i = 0; i < data.length; i++) {
      _data[i] = {};
      _data[i].label = data[i][this.fieldKey.text];
      _data[i].value = data[i][this.fieldKey.value];
    }
    return _data;
  }
}
