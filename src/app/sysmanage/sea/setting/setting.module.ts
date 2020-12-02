import { NgModule } from '@angular/core';
import { SettingComponent } from './setting/setting.component';
import { ShareModule } from '../../../common/share/share.module';
import { SettingRoutingModule } from './setting-routing.module';
import { UserSettingComponent } from './user-setting/user-setting.component';

@NgModule({
  imports: [
    ShareModule,
    SettingRoutingModule,
  ],
  declarations: [SettingComponent, UserSettingComponent]
})
export class SettingModule { }
