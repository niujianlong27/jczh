import { Component, Renderer2, OnInit } from '@angular/core';
import { GlobalService } from './common/services/global-service.service';
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  title = '汇好运';
  styleSet = {
    'song': false,
    'imitationSong': false,
    'blockFont': false,
    'gridLine': false,
  };
  connection: any;
  constructor (private globalSer: GlobalService, private rend: Renderer2) {}



  ngOnInit () {
    const userSet =  JSON.parse(localStorage.getItem('USERSET') || '{}');
    const themeVal = userSet.themeVal;
    this.globalSer.loadStyleTheme(themeVal, this.rend);
    this.styleSet.gridLine = userSet.gridLine;
    if (userSet.font) {
      this.styleSet[userSet.font] = true;
    }
    this.styleFilterFun(this.styleSet);
    this.globalSer.fontEmitter.subscribe((val: any) => {// 触发
      this.styleSet = { // $^$
        'song': false,
        'imitationSong': false,
        'blockFont': false,
        'gridLine': false,
      };
      this.globalSer.loadStyleTheme(val.setInfo.themeVal, this.rend);
      this.styleSet.gridLine = val.setInfo.gridLine;
      if (val.setInfo.font) {
        this.styleSet[val.setInfo.font] = true;
      }
      this.styleFilterFun(this.styleSet);
    }
    );
  }
  styleFilterFun(sty: any) {
     const _body = document.querySelector('html body');
     Object.keys(sty).forEach((key: string) =>  sty[key] ? this.rend.addClass(_body, key) : this.rend.removeClass(_body, key) );
  }

}
