import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgViewerComponent } from './img-viewer.component';
import { ImgViewerDirective } from './img-viewer.directive';
import { ImgViewerService } from './img-viewer.service';
import { FullScreenModule } from '@directive/fullScreen.module';
import { ImgViewerDragDirective } from './img-viewer-drag.directive';
@NgModule({
  declarations: [ ImgViewerComponent, ImgViewerDirective, ImgViewerDragDirective ],
  providers: [ ImgViewerService ],
  imports: [
    CommonModule,
    FullScreenModule
  ],
  exports: [ ImgViewerComponent, ImgViewerDirective ],
  entryComponents: [ ImgViewerComponent ]
})
export class ImgViewerModule { }
