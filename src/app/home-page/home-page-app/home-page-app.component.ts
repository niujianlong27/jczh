import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home-page-app',
  templateUrl: './home-page-app.component.html',
  styleUrls: ['./home-page-app.component.css']
})
export class HomePageAppComponent implements OnInit {
  showIndex: any = 'web';
  preWebLogo: any;
  preAppLogo: any;
  preOwnLogo: any;
  preIntLogo: any;
  constructor(
    private titleEmit: Title
  ) { }
  ngOnInit() {
    this.titleEmit.setTitle('汇好运-产品介绍');
    this.preWebLogo = document.getElementById('preWebLogo');
    this.preAppLogo = document.getElementById('preAppLogo');
    this.preOwnLogo = document.getElementById('preOwnLogo');
    this.preIntLogo = document.getElementById('preIntLogo');
  }

  changeIndex(val): void {
    console.log(val);
    this.showIndex = val;
    if (this.showIndex === 'web') {
      this.preWebLogo.src = '../../../assets/static/webLogoed.png';
      this.preAppLogo.src = '../../../assets/static/preAppLogo.png';
      this.preOwnLogo.src = '../../../assets/static/preOwnLogo.png';
      this.preIntLogo.src = '../../../assets/static/preIntLogo.png';

    } else if ( this.showIndex === 'app') {
      this.preWebLogo.src = '../../../assets/static/preWebLogo.png';
      this.preAppLogo.src = '../../../assets/static/appLogoed.png';
      this.preOwnLogo.src = '../../../assets/static/preOwnLogo.png';
      this.preIntLogo.src = '../../../assets/static/preIntLogo.png';

    } else if (this.showIndex === 'own') {
      this.preWebLogo.src = '../../../assets/static/preWebLogo.png';
      this.preAppLogo.src = '../../../assets/static/preAppLogo.png';
      this.preOwnLogo.src = '../../../assets/static/ownLogoed.png';
      this.preIntLogo.src = '../../../assets/static/preIntLogo.png';
    }
    else if (this.showIndex === 'int') {
      this.preWebLogo.src = '../../../assets/static/preWebLogo.png';
      this.preAppLogo.src = '../../../assets/static/preAppLogo.png';
      this.preOwnLogo.src = '../../../assets/static/preOwnLogo.png';
      this.preIntLogo.src = '../../../assets/static/intLogoed.png';

    }
  }
}
