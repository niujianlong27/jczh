import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.css']
})
export class TableTestComponent implements OnInit {


  apiUrl: string = "http://localhost:2001/logLogin/test";

  textValue: string = "初始化的值";

  rightText: string = "左边的值!";
  leftText: string = "右边的值";

  isUnchanged = true;

  name = "数据绑定";
  inputValue: string;
  userNames: any[] = ["哆啦A梦", "大熊", "静香"];

  heroes = [{ "id": 1, "name": "Windstorm" }, { "id": 2, "name": "Bombasto" }, { "id": 3, "name": "Magneta" }, { "id": 4, "name": "Tornado" }];

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public conversionCiphertext() {
    // this.http.send.
    this.http.post(this.apiUrl, {
      "msg": this.leftText
    }).pipe(timeout(10000))
      .subscribe((res: any) => {
        console.log(res);
        if (res['code'] == 100) {
          this.rightText = res['msg']
        }
      })
    /* .toPromise()
     .then((x:any)=>{
       console.log(x)
     })
     .catch();*/
  }

  public conversionCiphertext2() {
    // this.http.send.
    this.http.post(this.apiUrl, {
      "msg": this.leftText
    }).pipe(timeout(10000))
      .subscribe((res: any) => {
        console.log(res);
        if (res['code'] == 100) {
          this.rightText = res['msg']
        }
      })
    /* .toPromise()
     .then((x:any)=>{
       console.log(x)
     })
     .catch();*/
  }



}
