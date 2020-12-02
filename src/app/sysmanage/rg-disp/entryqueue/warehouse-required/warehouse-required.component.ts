import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { format} from 'date-fns';
import { GlobalService } from 'src/app/common/services/global-service.service';
import {CommonService} from '@service/common.service';
@Component({
	selector: 'app-warehouse-required',
	templateUrl: './warehouse-required.component.html',
	styleUrls: [ './warehouse-required.component.css' ],
	providers: [
		{
			provide: DatePipe,
			useFactory: (locale) => new DatePipe('en-US'),
			deps: []
		}
	]
})
export class WarehouseRequiredComponent implements OnInit {
	inqu: any = {};
	tabs: Array<any> = [];
	listLoading: boolean = false;
	dataSet: any;
	pageSize: number = 30; //条数
	totalPage: number; //数据总条数
	pageNUm: number; //当前页面序号
	kindArr: Array<any> = [];
	warehouseArr: Array<any> = [];
	nodes = [];
	tplModal: NzModalRef; //操作成功后弹窗属性
	kindNameArr = [];
	matArr = []; //二级品种
	subArr = []; //三级品种
	subKindArr: Array<any> = [];
	truckArr: Array<any> = [];
	subkindArr: Array<any> = [];
  updateDate:any=[]
  Update:boolean = false
  @ViewChild('addWeight') addWeight:ElementRef;
	map = {}; //存放kindCode与辅助分类
	//hidden:{[key:number]:any} = {};//保存取消按钮
	constructor(
		private datePipe: DatePipe,
		private fb: FormBuilder,
		private modal: NzModalService,
		private http: HttpUtilService,
		private info: UserinfoService,
		private nm: NzModalService,
		private globalSer: GlobalService,
    private nz:NzNotificationService,
    private cm:CommonService,
	) {}

	ngOnInit() {
		this.getallCodest();
		this.inqu.planDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
		this.query();
	}

	getallCodest() {
		this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.matKind'}).then(
		  (res: any) => {
		    if (res.success) {
		      console.log(res.data.data)
		      res.data.data.forEach(element => {
		        //排队大类名称
		          const item: any = {};
		          item.itemCname = element.itemCname;
		          item.itemCode = element.itemCode;
		          this.kindArr.push(item);
		          //console.log( this.queueArr)
		      });
		    }
		  }
		)
		this.http.post(RGDISPURL.MATKINDGETALL, {}).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					const ite: any = {};
					ite.itemCname = element.matKindName;
					ite.itemCode = element.matKindCode;
					this.kindNameArr.push(ite);
					//排队大类名称
					if (element.matKindCode.length == 3) {
						this.nodes.push({
							title: element.matKindName,
							key: element.matKindCode,
							children: []
						});
					} else if (element.matKindCode.length == 5) {
						this.matArr.push(element);
					} else {
						this.subArr.push(element);
					}
				});
				this.nodes.forEach((element) => {
					this.matArr.forEach((secondElement) => {
						if (secondElement.matKindCode.slice(0, 3) === element.key) {
							element.children.push({
								title: secondElement.matKindName,
								key: secondElement.matKindCode,
								children: []
							});
						}
					});
				});

				console.log(this.nodes);
				this.nodes.forEach((element) => {
					element.children.forEach((ele) => {
						this.subArr.forEach((secondElement) => {
							if (secondElement.matKindCode.slice(0, 5) == ele.key) {
								ele.children.push({
									title: secondElement.matKindName,
									key: secondElement.matKindCode,
									isLeaf: true
								});
							}
						});
					});
				});
			}
		});

		this.http.post(RGDISPURL.GETWAREHOUSE, {}).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					const item: any = {};
					item.itemCname = element.label;
					item.itemCode = element.value;
					this.warehouseArr.push(item);
				});
			}
		});

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.truckKind' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.truckArr.push(item);
				});
				console.log(this.truckArr);
			}
		});

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.feigang' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.subkindArr.push(item);
				});
				console.log(this.subkindArr);
			}
		});
	}

	query() {
    this.Update = false;
		this.inqu.page = 1; //最好有
		this.pageNUm = 1;
		this.inqu.length = this.pageSize || 30; //最好有
		this.globalSer.pageNumEmitter.emit({
			formId: 'form_rgDisp_warehouseRequired',
			gridId: 'grid1',
			length: this.inqu.length,
			page: 1,
			search: true
		});
		this.getListSearch();
	}
	pageSizeEmit(data: number) {
		console.log(data);
		this.pageSize = data;
	}
	pageIndexEmit(data: number) {
		console.log(data);
		this.pageNUm = data;
		this.inqu.page = this.pageNUm;
		this.inqu.length = this.pageSize;
		//this.inqu.page=this.
		this.getListSearch();
	}
	getListSearch() {
		this.listLoading = true;
		this.inqu.planDate = this.inqu.planDate && this.inqu.planDate instanceof Date ? format(this.inqu.planDate,'YYYY-MM-DD') : this.inqu.planDate || null;
		this.http.post(RGDISPURL.WAREHOUSEGET, this.inqu).then((res: any) => {
			if (res.success) {
				this.listLoading = false;
				this.dataSet = res.data.data.data;
				this.dataSet.forEach(item=>{
				  item.selectShow = false;
        })
				this.totalPage = res.data.data.total;
				this.dataSet.map((x) => (x.editstate = 0));
				this.dataSet.map((x) => (x.actpalnWeight = Number(x.planWeight) + Number(x.addWeight)));
				this.dataSet.map((x) => {
					if (x.subKindName) x.kindName = x.kindName + '_' + x.subKindName;
				});
				this.dataSet.forEach((element) => {
					if (element.id.slice(0, 4) == 'disp') {
						element._bgColor = 'yellow';
					}
				});
			} else {
				this.listLoading = false;
			}
		});
	}

	//修改按钮
	update(data: any, flag = null) {
		// this.hidden[flag] = true;
		data.editstate = 1;
		data.selectShow = true
	}

	//取消保存
	cancle(data: any, flag = null) {
		//this.hidden[flag] = false;
		data.editstate = 0;
    data.selectShow = false
		this.query();
	}

	//修改方法
	saveData(data) {
		// data.recRevisor=this.info.APPINFO.USER.name;
		// this.hidden[flag] = false;
		data.editstate = 0;
		this.http.post(RGDISPURL.WAREHOUSEUPDATE, data).then((res: any) => {
			if (res.success) {
				this.dataSet = res.data.data.data;
				this.totalPage = res.data.data.total;
				this.tplModal = this.nm.info({
					nzTitle: '提示信息',
					nzContent: '修改成功'
				});
				// this.pageNUm=1;
				// this.pageSize=30;
				this.query();
			}
		});
	}

	onChange(data): void {
		//根据下拉框选中的值去判断是否有辅助下拉框，并且查询值
		console.log(data);
    //this.getFzByKindCode(data);
    if(data){
      this.http.post(RGDISPURL.GETAUXILIARYBYKINDCODE, { 'matKindCode': data }).then((res: any) => {
        if (res.success) {
          console.log(res.data.data[0])
          if (res.data.data[0].auxiliary){
            this.map[data] = res.data.data[0].auxiliary;
            this.http.post(RGDISPURL.GETCODESET, { codesetCode: this.map[data] }).then((res: any) => {
              if (res.success) {
                this.subkindArr = [];
                res.data.data.forEach((element) => {
                  const item: any = {};
                  item.itemCname = element.itemCname;
                  item.itemCode = element.itemCode;
                  this.subkindArr.push(item);
                });
              }
            });
          }
        }
      });
    }
	}
  colName(data:any){
    let addWeight = data.filter(x => x.colEname === 'addWeight')
    addWeight[0].tdTemplate = this.addWeight;
  }
	//新增时根据物料编码来判断是否有辅助分类编码
	// getFzByKindCode(code:string){
	//   this.http.post(RGDISPURL.GETAUXILIARYBYKINDCODE, {'matKindCode':code}).then((res: any) => {
	//     if (res.success) {
	//       if(res.data.data[0].auxiliary){
	//         console.log(res.data.data[0].auxiliary)
	//         this.map[code]=res.data.data[0].auxiliary;
	//       }
	//     }
	//   });
	// }

  btnClick(data:any){
    switch (data.buttonId){
      case 'Update':
        this.btnUpdate();
        break;
      case 'Save':
        this.saveData(this.dataSet.filter(x=>x.editstate==1)[0]);
        break;
      default:
        break;
    }
  }
  btnUpdate(){
    if(this.updateDate.length!=1){
      this.nz.error('提示信息','请勾选一条数据')
      return;
    }
    this.Update = true;
    this.update(this.updateDate[0]);
  }

  updateDataResult(data:any){
	  this.updateDate = data;
  }
}
