import { Directive, ElementRef, Renderer2, Output, Input, Inject, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Directive({
    selector:'[modalContentHeight]'
})

export class ModalContentHeightDirective{
    @Input() selfConHeight:number;
    @Output() currentHeight = new EventEmitter<number>();
    constructor(private el: ElementRef, @Inject(DOCUMENT) private document:any, private render: Renderer2){}
    private minHeight:number = 100;
    ngAfterViewInit(){
        window.setTimeout(()=>{
            const tableBody = this.el.nativeElement.querySelector('div.ant-table-body');
            let currentTableHeight = this.document.body.clientHeight - (this.selfConHeight? this.selfConHeight:500);
            currentTableHeight = (currentTableHeight < this.minHeight) ? this.minHeight : currentTableHeight;
            this.render.setStyle(tableBody,'minHeight',`${currentTableHeight}px`);
            this.currentHeight.emit(currentTableHeight);
        })
    }
}