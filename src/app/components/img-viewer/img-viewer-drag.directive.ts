import { Directive, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Directive({
    selector:'[imgViewerDrag]'
})

export class ImgViewerDragDirective{
    private canMove = false;
    private initX: number;
    private initY: number;
    private downX: number;
    private downY: number;
    private X: number;
    private Y: number;
    private downListener: any;
    private moveListener: any;
    private upListener: any;
   constructor(private el: ElementRef, private render: Renderer2, @Inject(DOCUMENT) private document: any) {}

  ngAfterViewInit() {
       this.downListener = this.render.listen(this.el.nativeElement, 'mousedown', ( e: MouseEvent) => {
                this.canMove = true;
                this.initX = this.el.nativeElement.offsetLeft;
                this.initY = this.el.nativeElement.offsetTop;
                this.downX = e.clientX;
                this.downY = e.clientY;
        });
       this.moveListener = this.render.listen(this.document.body, 'mousemove', (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.canMove) {
                this.X = e.clientX - this.downX;
                this.Y = e.clientY - this.downY;
                this.render.setStyle(this.el.nativeElement, 'left', `${this.X + this.initX }px`);
                this.render.setStyle(this.el.nativeElement, 'top', `${this.Y + this.initY }px`);
            }
        });
       this.upListener = this.render.listen(this.document, 'mouseup', (e: MouseEvent) => {
                this.canMove = false;
        });
  }
  ngOnDestroy() {
     this.downListener && this.downListener();
     this.moveListener && this.moveListener();
     this.upListener && this.upListener();
  }
}