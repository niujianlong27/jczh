import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { hmrBootstrap } from "./hmr";

if (environment.production) {
  enableProdMode();
  //重写console
  window.console.log = function(){};
  window.console.info = function(){};
  window.console.warn = function(){};
  window.console.error = function(){};
  window.console.debug = function(){};
}

 const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
  
 if (environment.hmr) {
    if (module["hot"]) {
      hmrBootstrap(module, bootstrap);
    } else {
      console.error("HMR is not enabled for webpack-dev-server!");
      console.log("Are you using the --hmr flag for ng serve?");
    }

 } else {
   bootstrap().catch(err => console.log(err));
 }
 

