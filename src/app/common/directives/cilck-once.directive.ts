import {Directive, Input, OnDestroy, OnInit, HostListener, Output, EventEmitter, Renderer2, ElementRef, HostBinding} from '@angular/core';
import { throttleTime,delay } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Directive({
  selector: '[appCilckOnce]'
})
export class CilckOnceDirective  implements OnInit, OnDestroy {
  @Output('click.once') clickCall: EventEmitter<MouseEvent> = new EventEmitter();
  @Input() duration: any; // 必须是数字，传入时要用绑定语法
  @Input('appCilckOnce') appCilckOnce: boolean;
  @Input() innerDisable: boolean; // 组件内部会有disabled 设置true可以去掉
  private $sub = new Subject<any>();
  private subscription: Subscription;
  private isDisabled: boolean;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(){
    this.subscription = this.$sub.pipe(
      throttleTime(this.duration),
      // delay(this.duration)
    ).subscribe(e => {
      this.clickCall.emit(e);
      // this.renderer.removeAttribute(this.elementRef.nativeElement,'disabled');
    });
    this.isDisabled = this.appCilckOnce;
  }

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    if (this.innerDisable) {
      return;
    }
    if(this.isDisabled){
       return;
    }
    event.preventDefault();   // 通常是不需要冒泡的
    event.stopPropagation();
    this.$sub.next(event);
    this.renderer.setAttribute(this.elementRef.nativeElement,'disabled','true');
    setTimeout(()=>{
      this.renderer.removeAttribute(this.elementRef.nativeElement,'disabled');
    },this.duration)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
