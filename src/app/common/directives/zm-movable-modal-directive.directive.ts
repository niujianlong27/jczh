import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[zmMovableModal]'
})
export class ZmMovableModalDirectiveDirective {
  //只有当鼠标点下之后，鼠标抬起之前，才能移动
  private canMove: boolean = false;
  //modal开始移动时的x,y坐标
  private modalX: number = 0;
  private modalY: number = 0;
  //鼠标点下时，鼠标所在的坐标
  private mouseDownX: number = 0;
  private mouseDownY: number = 0;

  modalElement:ElementRef;
  modalTitleElement:ElementRef;

  constructor(private elementRef: ElementRef, private render: Renderer2) { }

  ngAfterViewInit() {
    this.modalElement = this.getModalElement();
    this.modalTitleElement = this.getModalTitleElment();
    this.render.listen(this.modalTitleElement, 'mousedown', function (event) {
      this.mouseDownX = event.clientX;
      this.mouseDownY = event.clientY;
      this.modalX = this.modalElement.offsetLeft;
      this.modalY = this.modalElement.offsetTop;
      this.render.setStyle(this.modalElement, "position", "absolute");
      this.render.setStyle(this.modalElement, "top", `${this.modalY}px`);
      this.render.setStyle(this.modalElement, "left", `${this.modalX}px`);
      this.canMove = true;
    }.bind(this));
    this.render.listen(this.modalTitleElement, 'mouseup', function (event) {
      this.canMove = false;
    }.bind(this));
    this.render.listen(this.elementRef.nativeElement, 'mousemove', function (event) {
      if (this.canMove) {
        let moveX = event.clientX - this.mouseDownX;
        let moveY = event.clientY - this.mouseDownY;
        let newModalX = this.modalX + moveX;
        let newModalY = this.modalY + moveY;
        this.render.setStyle(this.modalElement, "top", `${newModalY}px`);
        this.render.setStyle(this.modalElement, "left", `${newModalX}px`);
      }
    }.bind(this));

  }

  getModalElement() {
    return this.elementRef.nativeElement.querySelector('.ant-modal');
  }
  getModalTitleElment() {
    // let header = this.elementRef.nativeElement.querySelector('.ant-modal-header');
    let element = document.createElement("div") as any;
    // this.render.setStyle(element,"background","orange");
    this.render.setStyle(element, "width", "100%");
    this.render.setStyle(element, "height", "60px");
    this.render.setStyle(element, "position", "absolute");
    this.render.setStyle(element, "top", "0");
    this.render.setStyle(element, "left", "0");
    this.render.appendChild(this.modalElement, element);
    return element;
  }

}
