import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDirective } from './fullScreen.directive';
@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [ FullScreenDirective ],
    exports: [ FullScreenDirective ]
})

export class FullScreenModule { }