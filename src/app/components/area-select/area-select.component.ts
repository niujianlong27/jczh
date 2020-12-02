import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { urls } from '@model/url';
import {HttpUtilService} from '@service/http-util.service';


@Component({
  selector: 'app-area-select',
  templateUrl: './area-select.component.html',
  styles: [
    '.areaSelect{width: 23%;float: left;margin-top: 5px;}'
  ]
})
export class AreaSelectComponent implements OnInit {
  areaObj:any = {   //存放省市区以及选中的省市区
    provinceValue:null,
    cityValue:null,
    areaValue:null,
    townValue:null,
    province:[],
    city:[],
    area:[],
    town:[]
  };

  @Output() areaEmit = new EventEmitter<any>();

  constructor(private http : HttpUtilService) { }

  ngOnInit() {
  //  this.getArea('province',{valueSetCode:'PROVINCE'});
     this.getPlace({level: 'DZDJ10'},'DZDJ10');
  }
 private clearPlace(type:number){
     switch(type){
        case 0:
        this.areaObj.city = [];
        this.areaObj.area = [];
        this.areaObj.town = [];
        this.areaObj.areaValue = null;
        this.areaObj.townValue = null;
        this.areaObj.cityValue = null;
        break;
        case 1:
        this.areaObj.area = [];
        this.areaObj.town = [];
        this.areaObj.areaValue = null;
        this.areaObj.townValue = null;
        break;
        case 2:
        this.areaObj.town = [];
        this.areaObj.townValue = null;
        break;
        default:
        break;
     }
  }
  placeChange(data:any,type:string){
    switch (type){
      case 'DZDJ10':
      this.clearPlace(0);
      data && this.getPlace({level:'DZDJ20',parentCode:data.code},'DZDJ20');
      break;
      case 'DZDJ20':
      this.clearPlace(1);
      data && this.getPlace({level:'DZDJ30',parentCode: data.code},'DZDJ30');
      break;
      case 'DZDJ30':
      this.clearPlace(2);
      data && this.getPlace({level:'DZDJ40',parentCode: data.code},'DZDJ40');
      break;
      case 'DZDJ40':
      break;
      default:
      break;
   }
   this.areaEmit.emit(this.areaObj);
  }
  private getPlace(param:any,type:string){
      this.http.post(urls.selectProvices,param).then((res:any)=>{
          if(res.data.code === 100){
             switch (type){
                case 'DZDJ10':
                 this.areaObj.province = res.data.data || [];
                break;
                case 'DZDJ20':
                this.areaObj.city = res.data.data || [];
                break;
                case 'DZDJ30':
                this.areaObj.area = res.data.data || [];
                break;
                case 'DZDJ40':
                this.areaObj.town = res.data.data || [];
                break;
                default:
                break;
             }
          }
      })
  }
}
