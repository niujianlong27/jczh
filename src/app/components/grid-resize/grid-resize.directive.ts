import { Directive, ElementRef, Renderer2, Inject, Input,Output, EventEmitter} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, of } from 'rxjs';
import { ContainerHeightService } from '@service/container-height.service';
import { filter, debounceTime, switchMap, distinct, tap, map, takeUntil, delay, takeLast } from 'rxjs/operators';
@Directive({
    selector:'[grid-resize]'
})

export class GridResizeDirective{
  private searchHeight: number;
  private btnHeight: number;
  private clientHeight: number;
  private gridLine: HTMLElement;
  private gridLineCopy: any;
  private gridBoxHeight:number;
  @Input() formId: string;
  @Input() extraHeight: number;
  @Input() mode: 'vertical' | 'horizontal';
  @Output() gridResizeResult = new EventEmitter<any>();
  @Output() boxHeight = new EventEmitter<any>();
    constructor(private el:ElementRef, private render: Renderer2,
       @Inject(DOCUMENT) private document:any, private conHeight: ContainerHeightService){
       }
    ngAfterViewInit(){
      this.clientHeight = this.document.body.offsetHeight;
      this.conHeight.primarySearchHeight.pipe(
        filter(x => x.formId === this.formId)
      ).subscribe(
         (data:any) => this.searchHeight = data.height
      )
      this.conHeight.primaryButtonHeight.pipe(
        filter(x => x.formId === this.formId)
      ).subscribe(
        (data:any) => this.btnHeight = data.height
      )
      this.conHeight.currentSearchHeight.pipe(
        filter(x => x.formId === this.formId)
      ).subscribe(
       (data:any) => {
        this.searchHeight = data.height;
        this.boxSelftHeight();
       } 
      )
      const boxWidth = this.el.nativeElement.offsetWidth;
      this.gridLine = this.mode === 'horizontal' ? this.el.nativeElement.querySelector('div.line-box') : this.el.nativeElement.querySelector('div.tableLine-vertical');
      const mousedown = fromEvent(this.gridLine,'mousedown');
      const mousemove = fromEvent(this.el.nativeElement,'mousemove');
      const mouseup = fromEvent(this.document,'mouseup');
      const resize$ = fromEvent(window,'resize');
      this.gridLineCopy = this.gridLine.cloneNode(true);
      const griLineBtn =  this.mode === 'horizontal' ? this.gridLineCopy.querySelector('span.grid-line-btn') : this.gridLineCopy.querySelector('span.grid-line-btn-vertical');
      const lineBtn =  this.mode === 'horizontal' ? this.gridLine.querySelector('span.grid-line-btn') : this.gridLine.querySelector('span.grid-line-btn-vertical');
      this.render.removeChild(this.gridLineCopy,griLineBtn);
      this.render.addClass(this.gridLineCopy,'grid-line-copy');
      const btnMousedown = fromEvent(lineBtn,'mousedown');
      window.setTimeout( () => {
        this.boxSelftHeight();
      },1000)
      resize$.pipe(
        debounceTime(300),
        switchMap(e => of(this.document.body.offsetHeight)),
       // distinct()
      ).subscribe( x =>  {
        this.clientHeight = x;
        this.boxSelftHeight();
      });
    //  click$.subscribe( e => this.boxSelftHeight());
    btnMousedown.subscribe((e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    })
  
    mousedown.pipe(
      filter(x => this.mode === 'horizontal'),
      delay(100),
      tap(x => {
        const left = this.gridLine.offsetLeft;
        this.render.setStyle(this.gridLineCopy,'left',`${left}px`);
        this.render.appendChild(this.el.nativeElement,this.gridLineCopy);
      }),
      map(
       (x:any) => {
        return {eLeft: this.gridLineCopy.offsetLeft, downLeft: x.clientX};
       }
      ),
      switchMap((data:any) => mousemove.pipe(
        map((x:any) => x.clientX - data.downLeft + data.eLeft),
        tap(
           x => requestAnimationFrame(() => this.render.setStyle(this.gridLineCopy,'left',`${x}px`))
        ),
        takeUntil(mouseup.pipe(
          tap(x =>this.render.removeChild(this.el.nativeElement,this.gridLineCopy))
        )),
        takeLast(1)
      ))
    ).subscribe(
      x => {
          const width = (x/boxWidth)*99;
          const right = 99 - width;
          this.gridResizeResult.emit({left:width,right:right});
      }
    )
    }
    private boxSelftHeight(){
       const boxHeight = this.clientHeight - Number(this.btnHeight || 0) - Number(this.searchHeight || 0) - Number(this.extraHeight || 0) - 113;
       this.gridBoxHeight = boxHeight - 30;
       this.boxHeight.emit({tableHeight:this.gridBoxHeight,boxHeight: boxHeight});
    }
   
}
