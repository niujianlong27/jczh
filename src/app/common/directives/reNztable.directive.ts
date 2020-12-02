import { Directive, ElementRef, Renderer2, Output, EventEmitter, Input, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subscription, from, of } from 'rxjs';
import { debounceTime, filter, takeWhile, switchMap, map, distinct, tap } from 'rxjs/operators';
import { ContainerHeightService } from '../services/container-height.service';
@Directive({
  selector: '[reNzTable]'
})
export class ReNztableDirective implements AfterViewInit {
  private selfGridHeight: string;
  private clientHeight: number;
  private searchHeight: number;
  private btnHeight: number;
  private alive = true;
  private tableBody: HTMLElement;
  public mainContent: HTMLElement;
  public btnBox: HTMLElement;
  public searchForm: HTMLElement;
  @Input() set selfTableHeight(val: string | null | undefined) {
     this.selfGridHeight = val;
     if (this.selfGridHeight) {
       window.setTimeout(() => {
         this.tableBody && this.rend.setStyle(this.tableBody,'height',this.selfGridHeight);
       })
     }
  }
  @Input() extraTableHeight: number; // 表格之外高度
  @Input() formId: string;
  @Output() scrollBottom = new EventEmitter(); //
  @Output() heightEmit = new EventEmitter();
  constructor(private ref: ElementRef, private rend: Renderer2,
    private ch: ContainerHeightService,  @Inject(DOCUMENT) private document: any) {
    this.clientHeight = this.document.body.offsetHeight;
  }
  ngAfterViewInit() {
   this.tableBody  = this.ref.nativeElement.querySelector('.ant-table-body.cdk-virtual-scroll-viewport');
   const antTableBody = this.ref.nativeElement.querySelector('div.ant-table-body');
   const tableScroll =  fromEvent(antTableBody,'scroll');
   const windowResize = fromEvent(window,'resize');
   this.tableBody = this.tableBody ? this.tableBody : antTableBody;
   if(antTableBody){
    tableScroll.pipe(
      takeWhile(x => this.alive)
    ).subscribe(x => {
      const h = antTableBody.scrollHeight;
      const t = antTableBody.scrollTop;
      const hh = antTableBody.clientHeight;
        if (h <= t + hh) {
           this.scrollBottom.emit();
        }
      });
   }
   this.ch.primarySearchHeight.pipe(
     takeWhile(() => this.alive),
     filter(x => x.formId === this.formId)
   ).subscribe((data: any) => {
      this.searchHeight = data.height;
   })
   this.ch.primaryButtonHeight.pipe(
    takeWhile(() => this.alive),
    filter(x => x.formId === this.formId)
   ).subscribe((data:any) => {
      this.btnHeight = data.height;
   })
      /**
       * 优化
       */
      window.setTimeout(()=>{
       !this.selfGridHeight && this.tableBody && this.tableResize(this.tableBody);
      },1000)
      windowResize.pipe(
      takeWhile(() => this.alive),
      debounceTime(300),
      switchMap(e => of(this.document.body.offsetHeight)),
     // distinct()
     ).subscribe((x:number)=>{
       this.clientHeight = x;
      !this.selfGridHeight && this.tableBody && this.tableResize(this.tableBody);
      })
      this.ch.currentSearchHeight.pipe(
        takeWhile( () => this.alive),
        filter(x => x.formId === this.formId)
      ).subscribe(
       (x: any) => {
         this.searchHeight = x.height;
         !this.selfGridHeight && this.tableBody && this.tableResize(this.tableBody)
       }
      )
  }
  private tableResize(antTableBody:HTMLElement){
    let tableHeight = this.clientHeight - 197 - Number(this.btnHeight || 0) - Number(this.searchHeight || 0) - Number(this.extraTableHeight || 0);
      if(tableHeight < 100){
        tableHeight = 100;
      }
      this.heightEmit.emit(tableHeight);
    requestAnimationFrame(() => this.rend.setStyle(antTableBody,'height',`${tableHeight}px`));
}
  ngOnDestroy(){
   this.alive = false;
  }
}

/** colDrag */
@Directive({
    selector: '[colDrag]'
  })
  export class ColDragDirective implements AfterViewInit {
     private beElemWidth: number; // 前一个
     private dex: number;
     private currentElem: HTMLElement;
     private downX = 0; // x轴
     private canMoveX = 0;
     private canMove = false;
     private leftMove = false;
     private listener1: any;
     private listener2: any;
     private listener3: Subscription;
   //  private listenerCurrent:any;
     private elemObj = {t: 0, x: 0}; // t真实值，x传入值
     private colEmlemts: any;
     private resizeHandle: any;
     @Input('colDrag') headerData: any[] = [];
     @Input() set headers(val: boolean) {
       if(val){
         window.setTimeout(() => {
          this.colEmlemts = this.ref.nativeElement.querySelectorAll('th.table-th');
          this.resizeHandle = this.ref.nativeElement.querySelectorAll('span.resize-handle');
          this.isStart();
         }, 1000);
       }
     }
     @Output() canColDrag = new EventEmitter<any>(); // colDrag
    constructor(private ref: ElementRef, private rend: Renderer2) {}
    ngAfterViewInit() {
      this.listener2 = fromEvent(document.body,'mouseup').pipe(
        tap(() => {
          if (!this.currentElem) { this.canMoveX = 0; }
          this.canMove = false;
        }),
        filter(() => !!this.currentElem)
      ).subscribe((event: MouseEvent) => {
          this.rend.setStyle(this.currentElem, 'opacity', 0);
          this.rend.setStyle(this.currentElem, 'right', `-3px`);
          this.rend.removeClass(this.currentElem, 'col-drag');
        if (this.leftMove) {
          const nex = Math.ceil((Number(this.beElemWidth) + Number(this.canMoveX)) * (this.elemObj.x / this.elemObj.t));
          this.canColDrag.emit({nex: nex, index: this.dex});
        }
        this.leftMove = false;
        this.currentElem = null;
        this.canMoveX = 0;
        // window.setTimeout(()=>{
        //   this.listenerCurrent && this.listenerCurrent();
        // })
      });
    this.listener3 = fromEvent(document.body,'mousemove').pipe(
      filter(() => this.currentElem && this.canMove),
      map((e: any) => e.clientX),
      distinct()
    ).subscribe((x: number) => {
            const moveX = x - this.downX;
            if (this.isStop(moveX)) {
              this.leftMove = true;
              requestAnimationFrame(() => this.currentElem && this.rend.setStyle(this.currentElem, 'right', `${Number(-moveX) - 3}px`));
              this.canMoveX = moveX;
            }
      });
    }
    private isStart() {
       this.rend.listen(this.ref.nativeElement, 'mousedown',(e: MouseEvent) => {
           e.preventDefault();
           e.stopPropagation();
           from(this.resizeHandle).pipe(
             filter( (x: any, index: number) => {
               if (x === e.target) { this.dex = index; }
               return x === e.target;
             }),
             tap(elem => fromEvent(elem, 'click').subscribe((e: MouseEvent) => e.stopPropagation()))
           ).subscribe((y: any) => {
               this.currentElem = y;
               this.elemObj.x = parseFloat(this.headerData[this.dex].width || '0');
               this.beElemWidth =  this.colEmlemts[this.dex].offsetWidth; // 前一个
               this.elemObj.t = this.beElemWidth;
               this.downX =  e.clientX;
               this.canMove = true;
               this.rend.setStyle(this.currentElem,'opacity',1);
               this.rend.addClass(this.currentElem,'col-drag');
               this.leftMove = false;
           });
       });
    }
    private isStop(x: number): boolean {
         const bool = x < 0 ? false : true; // 正右加，负左减
         const nex = Number(this.beElemWidth) + Number(this.canMoveX);
         if (  bool && (nex > 1000) || !bool && (nex < 50) ) {
          return false;
        }
         return true;
    }
    ngOnDestroy() {
      this.listener1 && this.listener1();
      this.listener2 && this.listener2.unsubscribe();
      this.listener3 && this.listener3.unsubscribe();
    }
  }
