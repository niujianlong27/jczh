import { NgModule } from '@angular/core';
import { TestComponent } from './test/test.component';
import { TestRoutingModule } from './test-routing.module';
import { ShareModule } from '../../../common/share/share.module';

@NgModule({
  imports: [
    ShareModule,
    TestRoutingModule,
  ],
  declarations: [
    TestComponent
  ]
})
export class TestModule { }
