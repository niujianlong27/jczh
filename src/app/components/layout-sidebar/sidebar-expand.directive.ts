import { Directive, HostListener,Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscription  } from 'rxjs';
import { debounceTime } from 'rxjs/operators'; 
@Directive({
  selector: '[navExpand]'
})
export class SidebarExpandDirective {
  private mouseove = new Subject<any>();
  private subscription: Subscription;
  private mouselev = new Subject<any>();
  private levSubscription: Subscription;
  constructor(private ref: ElementRef,private render: Renderer2) { 
    
  }
  ngOnInit() {
    this.subscription = this.mouseove.pipe(debounceTime(50)).subscribe(()=>{
      this.render.addClass(this.ref.nativeElement,'nav-expand');
    })
    this.levSubscription = this.mouselev.pipe(debounceTime(50)).subscribe(()=>{
      this.render.removeClass(this.ref.nativeElement,'nav-expand');
    })
  }
  @HostListener('mouseover',['$event'])
  mouserover(e:MouseEvent){
     this.mouseove.next(e);
  }
  @HostListener('mouseleave',['$event'])
  mouseleave(e:MouseEvent){
    this.mouselev.next(e);
  }
  @HostListener('click',['$event'])
  onclick(){
   this.render.removeClass(this.ref.nativeElement,'nav-expand');
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.levSubscription.unsubscribe();
  }
}