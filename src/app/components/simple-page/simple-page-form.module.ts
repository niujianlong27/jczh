import { ModuleWithProviders, NgModule } from '@angular/core';

import { InquBlockModule } from './inqu-block/inqu-block.module';
import { ButtonBlockModule } from './button-block/button-block.module';
import { GridBlockModule } from './grid-block/grid-block.module';
import { SimplePageModule } from './simple-page/simple-page.module';
import { SelectModule } from './data-entry/select/select.module';
import { XlsxModule } from './xlsx/public_api';


export * from './button-block/public-api';
export * from './grid-block/public-api';
export * from './inqu-block/public-api';
export * from './simple-page/public-api';
export * from './data-entry/select/public-api';
export * from './xlsx/public_api';

@NgModule({
  exports: [
    ButtonBlockModule,
    GridBlockModule,
    InquBlockModule,
    SimplePageModule,
    SelectModule,
    XlsxModule,
  ],
  declarations: []
})
export class SimplePageFormModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimplePageFormModule
    };
  }
}
