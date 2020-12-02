import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableFormComponent } from '../table-form/table-form.component';
import { GlobalService } from '@service/global-service.service';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-grid-resize',
  templateUrl: './grid-resize.component.html',
  styleUrls: ['./grid-resize.component.css']
})
export class GridResizeComponent implements OnInit {
  @Input() lineTopExtra: number = -8;
  @Input() extraHeight: number;
  @Input() gridOne: TableFormComponent;
  @Input() gridTwo: TableFormComponent;
  @Input() formId: string;
  @Input() mode: 'horizontal' | 'vertical' = 'horizontal';
  tempFormId: string;
  lineShow:boolean;
  leftWidth:string;
  rightWidth:string;
  display:string = 'block';
  lineLeft:string = '49.5%';
  lineTop:string;
  h:number;
  bigBoxHeight:number;
  @Output() selfHeightResult = new EventEmitter<any>();
  constructor(private glo: GlobalService, private info: UserinfoService) {
    glo.fontEmitter.subscribe((x:any) => {
      this.mode = x.setInfo.moreGridShow ? 'vertical':'horizontal';
      this.leftWidth = this.mode === 'horizontal' ? '49.5%' : '100%';
      this.rightWidth = this.mode === 'horizontal' ? '49.5%' : '100%';
      this.lineLeft = '49.5%';
      this.display = 'block';
      this.selfheightFun();
    });
    const userSet =  JSON.parse(localStorage.getItem('USERSET') || '{}');
    this.mode = userSet.moreGridShow ? 'vertical' : 'horizontal';
   }

  ngOnInit() {
    this.tempFormId = this.formId || this.info.get('formId');
    this.leftWidth = this.mode === 'horizontal' ? '49.5%' : '100%';
    this.rightWidth = this.mode === 'horizontal' ? '49.5%' : '100%';
  }
  ngAfterViewInit() {
    
  }
  result(data:any){
    if(this.mode === 'horizontal'){
      this.leftWidth = `${data.left}%`;
      this.rightWidth = `${data.right}%`;
      this.lineLeft = `${data.left}%`;
      if(data.left >= 99 || data.left <= 0){
        this.display = 'none';
      }else{
        this.display = 'block';
      }
    }
  }
  resizeGrid(){
    if(!this.lineShow){
      if(this.mode === 'horizontal'){
        this.leftWidth = '99%';
        this.rightWidth = '0%';
        this.lineLeft = `99%`;
      }else{
        const one = this.h - 60;
        const two = 0;
        this.lineTop = `${this.bigBoxHeight + Number(this.lineTopExtra)}px`;
        this.selfHeightResult.emit({one: one,two: two});
      }
      this.display = 'none';
    }else{
      if(this.mode === 'horizontal'){
        this.leftWidth = '49.5%';
        this.rightWidth = '49.5%'
        this.lineLeft = `49.5%`;
      }else{
        const one =  this.h /2 - 70;
        const two = one;
        this.lineTop = `${this.bigBoxHeight /2 + Number(this.lineTopExtra)}px`;
        this.selfHeightResult.emit({one: one,two: two});
      }
      this.display = 'block';
    }
   this.lineShow = !this.lineShow;
  }
  boxHeight(obj:any){
    window.setTimeout(() => {
      this.h = obj.tableHeight;
      this.bigBoxHeight = obj.boxHeight;
      this.selfheightFun();
    }) 
  }

  private selfheightFun(){
    let one:number,two:number;
    if(this.mode === 'horizontal'){
      one = this.h - 60;
      two = one;
    }else{
      if(this.display === 'block'){
        one = this.h /2 - 70;
        const hei = Number(this.bigBoxHeight /2) + Number(this.lineTopExtra)
        this.lineTop = `${hei < 170 ? 170 : hei}px`;
        two = one;
      }else{
        one = this.h - 60;
        this.lineTop = `${Number(this.bigBoxHeight) + Number(this.lineTopExtra)}px`;
        two = 0;
      }
    }
    
   this.selfHeightResult.emit({one: one,two: two});
  }
}
