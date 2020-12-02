import {Directive, Input, OnDestroy, OnInit, HostListener, Output, EventEmitter, Renderer2, ElementRef, HostBinding} from '@angular/core';
import { throttleTime,delay } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Directive({
  selector: '[appClickDisabled]'
})

export class ClickDisabledDirective {
  @Output('click.disabled') clickCall: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}


  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.preventDefault();   // 通常是不需要冒泡的
    event.stopPropagation();
    this.renderer.setAttribute(this.elementRef.nativeElement,'disabled','true');
  }

}
