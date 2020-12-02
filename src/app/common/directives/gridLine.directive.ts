import { Directive, ElementRef, Renderer2, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[gridLine]'
})

export class GridLineDirective {
    private copyEl: HTMLElement;
    private parentEl: HTMLElement;
    private downLeft: number;
    private eLeft: number;
    private downlisten: any;
    private movelisten: any;
    private uplisten: any;
    private moveLeft: number;
    @Output() gridLineResult = new EventEmitter<any>();
    constructor(
      private el: ElementRef,
      private rend: Renderer2
      ) {

    }
    ngAfterViewInit() {
      const mainContent: HTMLElement = document.querySelector('div.main-content');
      const m_width = mainContent && mainContent.clientWidth;
      const gridLineBtn: HTMLElement = this.el.nativeElement.querySelector('span.grid-line-btn');
      this.rend.listen(gridLineBtn, 'mousedown', (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
     });
    this.downlisten = this.rend.listen(this.el.nativeElement, 'mousedown', (e: MouseEvent) => {
          this.copyEl = this.el.nativeElement.cloneNode(true);
          const griLineBtn = this.copyEl.querySelector('span.grid-line-btn');
          this.rend.removeChild(this.copyEl, griLineBtn);
           this.eLeft = this.el.nativeElement.offsetLeft;
           this.downLeft = e.clientX;
           this.parentEl = this.el.nativeElement.parentNode;
          this.rend.setStyle(this.copyEl, 'left', `${this.eLeft}px`);
          this.rend.appendChild(this.parentEl, this.copyEl);
      });
     this.movelisten = this.rend.listen(mainContent, 'mousemove', (e: MouseEvent) => {
       e.preventDefault();
        if (this.copyEl) {
          this.moveLeft = e.clientX - this.downLeft + this.eLeft;
          this.rend.setStyle(this.copyEl, 'left', `${this.moveLeft}px`);
        }
      });
      this.uplisten = this.rend.listen(mainContent, 'mouseup', (e: MouseEvent) => {
          if (!isNaN(this.moveLeft) && this.copyEl){
            let result = this.moveLeft / (m_width - m_width * 0.02);
            result = Math.floor(result * 100) / 100;
            this.gridLineResult.emit(result);
          }
          // tslint:disable-next-line: no-unused-expression
          this.copyEl &&  this.rend.removeChild(this.parentEl, this.copyEl);
          this.copyEl = null;
      });
    }
    ngOnDestroy() {
      this.downlisten && this.downlisten();
      this.movelisten && this.movelisten();
      this.uplisten && this.uplisten();
    }
}
