import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalContentHeightDirective } from './modal-content-height.directive';
@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [ ModalContentHeightDirective ],
    exports: [ ModalContentHeightDirective ]
})

export class ModalContentHeightModule { }