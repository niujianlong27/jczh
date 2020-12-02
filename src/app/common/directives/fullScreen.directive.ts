import { Directive, HostListener, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Directive({
  selector: '[fullScreen]'
})
export class FullScreenDirective {
    private isFull:boolean;
    @Input() fullScreenElem:any;//需要全屏的元素，不传默认document
    @Output() isFullScreen = new EventEmitter<boolean>();//全屏结果事件
    constructor(@Inject(DOCUMENT) private document: any) { 
    
    }
    ngOnInit() {
     
    }
   @HostListener('click',['$event'])
    onclick(e:Event){
     
       if(!this.isFull){
        const dom = this.fullScreenElem ? this.fullScreenElem : this.document.documentElement;
          this.requestFullscreen(dom);
       }else{
        const dom = this.fullScreenElem ? this.fullScreenElem : this.document;
           this.exitFullscreen(dom);
       }
    //   this.isFull = !this.isFull;
    //   this.isFullScreen.emit(this.isFull);
    }
    @HostListener('document:fullscreenchange',['$event'])
    fullscreenchange(e:Event){
         this.isFull = !this.isFull;
         this.isFullScreen.emit(this.isFull);
    }
    @HostListener('document:webkitfullscreenchange',['$event'])
    webkitfullscreenchange(e:Event){
      this.isFull = !this.isFull;
      this.isFullScreen.emit(this.isFull);
    }
    @HostListener('document:mozfullscreenchange',['$event'])
    mozfullscreenchange(e:Event){
      this.isFull = !this.isFull;
      this.isFullScreen.emit(this.isFull);
    }
    @HostListener('document:MSFullscreenChange',['$event'])
    MSFullscreenChange(e:Event){
      this.isFull = !this.isFull;
      this.isFullScreen.emit(this.isFull);
    }
    @HostListener('document:dblclick',['$event'])
    dbclick(e:Event){
        if(this.isFull){
          const dom = this.fullScreenElem ? this.fullScreenElem : this.document;
          this.exitFullscreen(dom);
        //  this.isFull = !this.isFull;
       //   this.isFullScreen.emit(this.isFull);
        }
    }
    private requestFullscreen(dom:any) {
        if ( !dom.fullscreenElement && !dom.mozFullScreenElement && !dom.webkitFullscreenElement && !dom.msFullscreenElement) {
          if (dom.requestFullscreen) {
            dom.requestFullscreen();
          } else if (dom.msRequestFullscreen) {
            dom.msRequestFullscreen();
          } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
          } else if (dom.webkitRequestFullscreen) {
            dom.webkitRequestFullscreen();
          }
        }
      }
    private exitFullscreen(dom:any) {
        if (dom.exitFullscreen) {
            dom.exitFullscreen();
        } else if (dom.msExitFullscreen) {
            dom.msExitFullscreen();
        } else if (dom.mozCancelFullScreen) {
            dom.mozCancelFullScreen();
        } else if (dom.webkitExitFullscreen) {
            dom.webkitExitFullscreen();
        }
      }
    
}