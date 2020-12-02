import { Component, OnInit, Inject, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { fromEvent } from 'rxjs';
import { ViewerOptions } from './type';
@Component({
  selector: 'img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.css']
})
export class ImgViewerComponent implements OnInit {
  imgUrl: string;
  imgWidth = 'auto';
  imgHeight = 'auto';
 // imgTop:string;
  imgBar: boolean;
  navbarShow = false;
  imgSize: string;
  imgPercent: string;
 // rotateStr:string;
  rotate = 0;
  scale = 0;
  scaleX = 1;
  scaleY = 1;
  opacity = 0;
  imgsArr: string[] = [];
  imgEl: HTMLImageElement;
  private initRotate: number;
  private percent: number;
  private speed = 10;
  private ratio: number;
  private changeWidth: number;
  private changeHeight: number;
  private imgObj: any = {};
  public imgModalRef: any;
  public imgOverlay: OverlayRef;
  private timmer: any;
  private index = 0;
  public shadow: boolean;
  @ViewChild('bigImg') bigImg: any;
  constructor(@Inject(DOCUMENT) private document: any, private el: ElementRef, private render: Renderer2) { }
  public imgSourceFun(val: ViewerOptions) {
    this.initRotate = val.initRotate;
    this.rotate = this.initRotate ? this.initRotate : this.rotate;
    this.shadow = val.shadow;
    this.imgUrl = Array.isArray(val.url) ? val.url[0] : val.url;
    this.navbarShow = Array.isArray(val.url) ? true : false;
    this.imgsArr = Array.isArray(val.url) ? val.url : [];
    this.index = 0;
    window.setTimeout(() => {
      this.initImg();
      this.imgResize();
    }, 150);
  }
  ngOnInit() {
     fromEvent(this.el.nativeElement, 'DOMMouseScroll').subscribe((x: MouseEvent) => {
        this.wheel(false, x);
     });
     fromEvent(this.el.nativeElement, 'mousewheel').subscribe((x: MouseEvent) => {
        this.wheel(true,  x);
     });
     fromEvent(window, 'resize').subscribe((x: MouseEvent) => {
      this.resize(x);
   });
   // 键盘事件
   fromEvent(this.document, 'keyup').subscribe((x: KeyboardEvent) => {
     if (x.keyCode === 27 && !this.imgBar) {
       this.close();
     }
   });
  }
  // switch
  switchImg(data: string, num: number) {
    if (this.imgUrl != data ) {
      this.index = num;
      this.imgPrevNext(data);
    }
  }
  // zoom
  imgZoom(type: number) {
     this.zoom(type);
  }
  // 关闭
  stopEvent(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }
  close(e?: MouseEvent) {
    this.scale = 0;
    this.opacity = 0;
    window.setTimeout(() => {
      // tslint:disable-next-line: no-unused-expression
      this.imgModalRef && this.imgOverlay.dispose();
    }, 100);
  }
  // onetoone
  oneOne(flag?: boolean) {
    this.changeWidth = this.imgObj.width;
    this.imgWidth = `${ this.imgObj.width }px`;
    this.imgHeight = `${ this.imgObj.height }px`;
    if (flag) { return; }
    this.imgPercent = `100%`;
    this.timmer = window.setTimeout(() => {
      this.imgPercent = null;
    }, 1000);
  }
  // rotate
  rotateFun(flag: number) {
     this.rotate += flag;
  }
  // flipFun
  flipFun(flag: number) {
    if (flag === 0) {
      this.scaleX = this.scaleX === -1 ? 1 : -1;
    } else {
      this.scaleY = this.scaleY === -1 ? 1 : -1;
    }
  }
  // prev -1 next 1;
  prevNext(flag: number) {
      if (this.imgsArr.length < 1) {
         return;
      }
       if (flag === 1) {
           this.index = this.index === (this.imgsArr.length - 1) ? 0 : (this.index + flag);
       } else {
          this.index = this.index === 0 ? (this.imgsArr.length - 1) : (this.index + flag);
       }
       const url: string = this.imgsArr[this.index];
       this.imgPrevNext(url);
  }
  // reset
  reset() {
    this.rotate = this.initRotate || 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.oneOne(true);
    this.render.setStyle(this.imgEl, 'left', `${(this.document.body.clientWidth - this.imgObj.width) / 2}px`);
    this.render.setStyle(this.imgEl, 'top', `${(this.document.body.clientHeight - this.imgObj.height) / 2}px`);
  }
  // 全屏
  fullScreen(flag: boolean) {
     this.imgBar = flag;
  }
  // initImage
  private initImg() {
    this.imgEl =   this.bigImg.nativeElement;
    this.imgObj.width = this.imgEl.naturalWidth;
    this.imgObj.height = this.imgEl.naturalHeight;
    this.ratio = this.imgObj.width / this.imgObj.height;
    this.changeWidth = this.imgObj.width;
    this.changeHeight = this.imgObj.height;
    this.imgSize = `(${this.imgObj.width} x ${this.imgObj.height})`;
  }
  private imgResize() {
    let width: number = this.document.body.clientWidth;
    let height: number = this.document.body.clientHeight;
    if (height * this.ratio > width) {
         height = width / this.ratio;
    } else {
        width = height * this.ratio;
    }
    width = Math.min(width * 0.9, this.imgObj.width);
    height = Math.min(height * 0.9, this.imgObj.height);
    this.changeWidth = width;
    this.changeHeight = height;
    this.imgWidth = `${width}px`;
    this.imgHeight = `${height}px`;
    this.scale = 1;
    this.opacity = 1;
  //  this.imgTop = `${(this.document.body.clientHeight - height)/2}px`;
    this.render.setStyle(this.imgEl, 'left', `${(this.document.body.clientWidth - width) / 2}px`);
    this.render.setStyle(this.imgEl, 'top', `${(this.document.body.clientHeight - height) / 2}px`);
    this.render.setStyle(this.imgEl, 'position', 'absolute');
}
private resize(e: any) {
  e.stopPropagation();
  e.preventDefault();
  this.imgResize();
}
private wheel(type: boolean, e: any) {
    e.stopPropagation();
    e.preventDefault();
    let dir: number; // -1向下，1向上
    if (type) {
      dir = e.wheelDelta > 0 ? 1 : -1;
    } else {
      dir = e.detail > 0 ? -1 : 1;
    }
    this.zoom(dir);
}
private zoom(dir: number) {
  this.changeWidth = this.changeWidth + (this.speed  + Math.random() * 50) * dir; // this.speed * dir;
  this.percent = parseFloat((this.changeWidth / this.imgObj.width).toFixed(2));
  if ( this.percent < 0.05 ) {
    this.changeWidth = this.imgObj.width * 0.05;
    this.imgPercent = `已达最小`;
  } else if ( this.percent > 10 ) {
     this.changeWidth = this.imgObj.width * 10;
     this.imgPercent = `已达最大`;
   } else {
      this.imgPercent = `${Math.floor(this.percent * 100)}%`;
   }
  this.changeHeight = this.changeWidth / this.ratio;
  this.imgWidth = `${ this.changeWidth }px`;
  this.imgHeight = `${ this.changeHeight }px`;
  this.render.setStyle(this.imgEl, 'left', `${(this.document.body.clientWidth - this.changeWidth) / 2}px`);
  this.render.setStyle(this.imgEl, 'top', `${(this.document.body.clientHeight - this.changeHeight) / 2}px`);
  // tslint:disable-next-line: no-unused-expression
  this.timmer && window.clearTimeout(this.timmer);
  this.timmer = window.setTimeout(() => {
        this.imgPercent = null;
      }, 1000);
}

 private imgPrevNext(data: string) {
    this.imgUrl = data;
    this.scale = 0;
    this.opacity = 0;
    this.rotate = this.initRotate || 0;
    this.scaleX = 1;
    this.scaleY = 1;
    window.setTimeout(() => {
      this.initImg();
      this.imgResize();
    }, 500);
 }
}
