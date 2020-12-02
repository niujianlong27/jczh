import { Component, OnInit } from '@angular/core'
import { HttpClient } from "@angular/common/http"
import { environment } from "@env/environment"
@Component({
  selector: 'app-customer-settlement',
  templateUrl: './customer-settlement.component.html',
  styleUrls: ['./customer-settlement.component.css']
})
export class CustomerSettlementComponent implements OnInit {

  constructor( private http: HttpClient) { }
   private searchData: any = {};
   public data: any[] = [];
   public total: number = 0;
   public loading: boolean = false;
  ngOnInit() {
  }
  search(data:any){
    this.searchData = data;
    this.getData(this.searchData);
  }
  private getData(param = {}){
    this.loading = true;
     this.http.post(`${environment.baseUrlSettle}order/getOrdersInfo`,param).subscribe(
       (res:any) => {
         this.loading = false;
         if(res.code === 100){
            this.data = res.data.data;
            this.total = res.data.total;
         }
       }
     )
  }
}
