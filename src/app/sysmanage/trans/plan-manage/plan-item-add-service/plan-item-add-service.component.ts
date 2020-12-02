import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { PlanItemAddComponent } from '../plan-item-add/plan-item-add.component';

@Component({
  selector: 'app-plan-item-add-service',
  templateUrl: './plan-item-add-service.component.html',
  styleUrls: ['./plan-item-add-service.component.css']
})
export class PlanItemAddServiceComponent {

  constructor(private modalService: NzModalService) { }

  createModal(): void {

    const modal = this.modalService.create({
      nzTitle: '调度明细选择',
      nzContent: PlanItemAddComponent,
      nzWidth: '85%',
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));
  }

}
