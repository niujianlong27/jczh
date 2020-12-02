import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { ImgViewerComponent } from './img-viewer.component';
import { ViewerOptions } from './type';
@Injectable()
export class ImgViewerService{
    private overlayRef: OverlayRef;
    private modalRef: ComponentRef<ImgViewerComponent>;
    constructor(private overlay: Overlay) {}
    viewer(options: ViewerOptions) {
        this.overlayRef = this.overlay.create();
        this.modalRef = this.overlayRef.attach(new ComponentPortal(ImgViewerComponent));
        this.modalRef.instance.imgSourceFun(options);
        this.modalRef.instance.imgModalRef = this.modalRef;
        this.modalRef.instance.imgOverlay = this.overlayRef;
    }
    ngOnDestroy(){
        this.modalRef && this.overlayRef.dispose();
    }
}