import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './common/guard/auth-guard.service';
import { LoginGuardService } from './common/guard/login-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { environment } from '../environments/environment';
const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '', loadChildren: './home-page/home-page.module#HomePageModule' },
  { path: 'appload', loadChildren: './appload/appload.module#ApploadModule' },
  { path: 'portal', loadChildren: './portal/portal.module#PortalModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [LoginGuardService] },
  { path: 'system', loadChildren: './sysmanage/sysmanage.module#SysmanageModule', canLoad: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: environment.production })
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
