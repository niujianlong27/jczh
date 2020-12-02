import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {CacheService} from '@service/cache.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-billing-manage',
  templateUrl: './billing-manage.component.html',
  styleUrls: ['./billing-manage.component.css']
})
export class BillingManageComponent implements OnInit {

  redirectUrl: any;

  constructor(
    private sanitizer: DomSanitizer,
    private cache: CacheService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const billingManageData = this.cache.getSession('billingManageData');
    if (billingManageData) {
      this.redirectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(billingManageData);
      this.cache.clearSession('billingManageData');
    } else {
      this.router.navigate(['/system/receivableManage/invoiceInformation']);
    }
  }

}
