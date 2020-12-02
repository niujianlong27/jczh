import { Directive,  ComponentRef, ElementRef, Renderer2, Input } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ImgViewerComponent } from './img-viewer.component';
import { ViewerOptions } from './type';
@Directive({
    selector:'[imgViewer]'
})

export class ImgViewerDirective{
    @Input('imgViewer') imgSource: ViewerOptions;
    private listener: any;
    private overlayRef: OverlayRef;
    private modalRef: ComponentRef<ImgViewerComponent>;
    constructor(private overlay: Overlay, private el: ElementRef, private rend: Renderer2) {}
    ngAfterViewInit(){
       this.listener = this.rend.listen(this.el.nativeElement, 'click', (e: MouseEvent) => {
            e.stopPropagation(); /// ?
            e.preventDefault(); /// ?
            this.overlayRef = this.overlay.create();
            this.modalRef = this.overlayRef.attach(new ComponentPortal(ImgViewerComponent));
            this.modalRef.instance.imgSourceFun(this.imgSource);
            this.modalRef.instance.imgModalRef = this.modalRef;
            this.modalRef.instance.imgOverlay = this.overlayRef;
        });
    }
   ngOnDestroy() {
     this.listener && this.listener();
     this.modalRef && this.overlayRef.dispose();
   }
}