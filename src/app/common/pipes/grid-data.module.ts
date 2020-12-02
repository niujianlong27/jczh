import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDataPipe } from './grid-data.pipe';
@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [ GridDataPipe ],
    exports: [ GridDataPipe ]
})

export class GridDataModule { }