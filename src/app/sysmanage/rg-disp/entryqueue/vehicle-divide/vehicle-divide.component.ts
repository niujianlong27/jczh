import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-divide',
  templateUrl: './vehicle-divide.component.html',
  styleUrls: ['./vehicle-divide.component.css']
})
export class VehicleDivideComponent implements OnInit {

  tabs: Array<any> = [];

  constructor() { 
    this.getallCodest();
  }


  ngOnInit() {
  }


   // 获取表头
   getallCodest(): void {
    const tab: any = {};
    tab.itemCname = "全部";
    tab.itemCode = "root";
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.tabs.push({itemCname:'东二门',itemCode:'1',itemCount:0});
    this.tabs.push({itemCname:'西门',itemCode:'1',itemCount:0});
    this.tabs.push({itemCname:'北门',itemCode:'1',itemCount:0});
    this.tabs.push({itemCname:'东三门',itemCode:'1',itemCount:0});
    this.tabs.push({itemCname:'冷轧东门',itemCode:'1',itemCount:0});
    // this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
    //   (res: any) => {
    //     if (res.success) {
    //       res.data.data.forEach(element => {
    //         if (element.codesetCode == 'PZKRCDM') {
    //           const item: any = {};
    //           item.itemCname = element.itemCname;
    //           item.itemCode = element.itemCode;
    //           item.itemCount = 0;
    //           this.tabs.push(item)
    //         }
    //       });
    //     }
    //   }
    // )

  }

}
