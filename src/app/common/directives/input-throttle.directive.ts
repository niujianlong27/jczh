import {
  Directive,
  OnDestroy,
  OnInit,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
/**
 * select框远程搜索，防抖
 */
@Directive({
  selector: '[appInputThrottle]'
})
export class InputThrottleDirective implements OnInit, OnDestroy {
  // 监听宿主元素上的方法
  @Output() throttleSearch: EventEmitter<any> = new EventEmitter();
  private $sub = new Subject<any>();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    /**
     * 订阅者赋值
     */
    this.subscription = this.$sub
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(e => {
        this.throttleSearch.emit(e);
      });
  }
  /**
   * 监听select框的nzOnSearch函数
   * @param event
   */
  @HostListener('nzOnSearch', ['$event'])
  /**
   * 执行订阅函数
   */
  ChangeEvent(event: any) {
    this.$sub.next(event);
  }
  /**
   * 指令销毁，取消订阅
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
