import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { ReNztableDirective, ColDragDirective } from './reNztable.directive';
@NgModule({
    imports:[
   //     CommonModule
    ],
    declarations: [ ReNztableDirective, ColDragDirective ],
    exports: [ ReNztableDirective, ColDragDirective ]
})

export class ReNztableModule { }