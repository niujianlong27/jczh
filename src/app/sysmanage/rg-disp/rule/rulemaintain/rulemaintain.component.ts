import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CommonService } from '../../../../common/services/common.service';
@Component({
	selector: 'app-rulemaintain',
	templateUrl: './rulemaintain.component.html',
	styleUrls: [ './rulemaintain.component.css' ]
})
export class RulemaintainComponent implements OnInit {
	tabs: Array<any> = [];
	listLoading: boolean = false;
	dataSet: any;
	pageSize: number = 30; //条数
	totalPage: number; //数据总条数
	//carNum: number = 0;
	// hidden:{[key:number]:any} = {};//保存取消按钮

	deleteVisible: boolean = false; //删除弹框
	deletemodaltitle: string; //弹框的标题
	finishCon: string; //弹窗文字内容
	deleteId: string;

	tplModal: NzModalRef; //操作成功后弹窗属性
	InsertFormVisible: boolean = false; //新增弹框
	kindCode: String;
	kindName: String;
	auxiliaryNameArr: Array<any> = [];
	private columnsArr: any[] = [];
	kindNameArr: Array<any> = [];
	queueArr: Array<any> = [];
	fzArr: Array<any> = [];
	qeueClass: String;
	gateArr: Array<any> = [];
	truckArr: Array<any> = [];
	subKindCode: String;
	subKindName: String;
	truckKind: String;
	truckKindName: String;
	gateNames: String;
	gateCodes: String;
	expandKeys = [ '100', '1001' ];

	UpdateArr:Array<any>=[];
	saveFlag:boolean=true;
	
	buttonArr: any[] = [];
	tabsArr: any[] = [];
	//ruleType:number;

	formId: any;
	map = {}; //存放kindCode与辅助分类
	nodes = []; //一级品种
	matArr = []; //二级品种
	subArr = []; //三级品种
	subKindArr: Array<any> = [];
	parkArr: Array<any> = [];
	parkName: Array<any> = [];
	parkCode: String;
  queueClassName: String;
  auxiliary:string;
  ruleType:number;
	modalValidateForm: FormGroup; //新增代码集弹窗
	modalFormData: Array<any> = [];
	columnarrArr: Array<any> = []; //将三个columnsarr存放在里面，根据页面获取不同的columnarr
	modalFormData1: Array<any> = [
		{
			name: '分类名称',
			eName: 'kindCode',
			type: 'select',
			validateCon: '请输入分类名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '排队优先级',
			eName: 'qeueClass',
			type: 'select',
			validateCon: '请输入排队优先级',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		}
	];
	modalFormData2: Array<any> = [
		{
			name: '分类名称',
			eName: 'kindCode',
			type: 'select',
			validateCon: '请输入分类名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '辅助分类',
			eName: 'subKindCode',
			type: 'select',
			validateCon: '请输入辅助分类名称',
			require: false,
			validators: {
				require: false,
				pattern: false
			}
		},
		{
			name: '可入厂大门',
			eName: 'gateCodes',
			type: 'select',
			validateCon: '请输入可入厂大门',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '车型',
			eName: 'truckKind',
			type: 'select',
			validateCon: '',
			require: false,
			validators: {
				require: false,
				pattern: false
			}
		}
	];
	modalFormData3: Array<any> = [
		{
			name: '分类名称',
			eName: 'kindCode',
			type: 'select',
			validateCon: '请输入分类名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '辅助分类',
			eName: 'subKindCode',
			type: 'select',
			validateCon: '请输入辅助分类名称',
			require: false,
			validators: {
				require: false,
				pattern: false
			}
		},
		{
			name: '可用停车场',
			eName: 'parkCode',
			type: 'input',
			validateCon: '请输入可入厂大门',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		}
	];
	modalTitle: any;
	isOkLoading: any;
	subNameArr: Array<any> = [];
	@ViewChild('subKindName1') subKindName1: ElementRef;
	constructor(
		private fb: FormBuilder,
		private cm: CommonService,
		private modal: NzModalService,
		private http: HttpUtilService,
		private info: UserinfoService,
		private nm: NzModalService
	) {
	
	}

	listSearch(data) {
		this.saveFlag=true;
		this.UpdateArr=[];
		data.page = data.page || 1; //最好有
		data.length = data.length || this.pageSize; //最好有
		this.getListSearch(data);
	}

	getListSearch(data) {
		this.listLoading = true;
		// switch (this.carNum) {
		// 	case 0:
		// 		data.ruleType = 1;
		// 		break;
		// 	case 1:
		// 		data.ruleType = 2;
		// 		break;
		// 	case 2:
		// 		data.ruleType = 3;
		// 		break;
		// }
		data.ruleType=this.ruleType;
		this.http.post(RGDISPURL.RULEGETRECORDS, data).then((res: any) => {
			if (res.success) {
				this.dataSet = res.data.data.data;
				this.totalPage = res.data.data.total;
				//this.dataSet.map(x =>x.subKindName=x.subKindName.split(','));
				this.dataSet.forEach((element) => {
					if (element.subKindName) {
						element.subKindCode = element.subKindCode.split(',');
						console.log(element.subKindCode);
          }
					if (element.auxiliary) {
						this.getInitCodeset(element.auxiliary); //如果存在辅助分类，把查询到的辅助分类存放进数组中,为了查询的时候能显示在多选下拉框中
						this.map[element.kindCode] = element.auxiliary; //利用map去匹配判断新增时有无辅助分类下拉框
					}
				});
				console.log(this.map + ' this.map');
				this.dataSet.map((x) => (x.editstate = 0));
				this.dataSet.map((x) => (x.flag = true));
				this.dataSet.map((x) => (x.status == 'PDGZ10' ? (x.status = '启用') : (x.status = '作废')));
			}
			this.listLoading = false;
		});
  }
  //遍历所有数据
  // getMap(){
  //   this.http.post(RGDISPURL.RULEGETALLRECORDS, {}).then((res: any) => {
	// 		if (res.success) {
  //       console.log(res.data.data)
  //       this.dataSet = res.data.data;
	// 			this.dataSet.forEach((element) => {
	// 				if (element.auxiliary) {
	// 					this.getInitCodeset(element.auxiliary); 
	// 					this.map[element.kindCode] = element.auxiliary; 
	// 				}
  //       });
	// 		}
	// 	});
  // }

	ngOnInit() {
		this.getallCodest();
		this.ruleType=this.tabs[0].ruleType;
		this.listSearch({ page: 1, length: this.pageSize });
		this.modalValidateForm = this.fb.group({});
		this.modalFormData = this.modalFormData1; //初始化第一个tab页
		for (let i = 0; i < this.modalFormData.length; i++) {
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}
	}

	// 获取表头
	getallCodest(): void {
		this.tabs.push({ itemCname: '品种优先级设置', itemCode: 'PZYXJ', formId: 'form_rgDisp_rulemaintain0',ruleType:1 });
		this.tabs.push({ itemCname: '品种可入厂大门', itemCode: 'PZKRCDM', formId: 'form_rgDisp_rulemaintain1' ,ruleType:2});
		this.tabs.push({ itemCname: '停车场管理', itemCode: 'TCCGL', formId: 'form_rgDisp_rulemaintain2' ,ruleType:3});
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

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.queueClass' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.queueArr.push(item);
					//console.log( this.queueArr)
				});
			}
		});

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.gate' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.gateArr.push(item);
					//console.log( this.queueArr)
				});
			}
		});

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.park' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.parkArr.push(item);
					//console.log( this.queueArr)
				});
			}
		});

		// this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.feigang' }).then(
		//   (res: any) => {
		//     if (res.success) {
		//       console.log(res.data.data)
		//       res.data.data.forEach(element => {
		//         //排队大类名称
		//         const item: any = {};
		//         item.itemCname = element.itemCname;
		//         item.itemCode = element.itemCode;
		//         this.subKindArr.push(item);
		//       });
		//     }
		//   }
		// )

		this.http.post(RGDISPURL.GETCODESET, { codesetCode: 'disp.truckKind' }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.truckArr.push(item);
					//console.log( this.queueArr)
				});
			}
		});

		this.http.post(RGDISPURL.GETFZKIND, {}).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((item) => {
					this.auxiliaryNameArr.push(item);
				});
			}
		});
	}
	//修改时获取可以选择的辅助分类
	getCodeset(code,kindCode,subKindCode,subKindName,ruleType) {
		this.fzArr = [];
		console.log(subKindCode+'subKindCode')
		console.log(subKindName+'subKindName')
		console.log(subKindCode instanceof Array)
		console.log(subKindName instanceof Array)
		if(subKindCode instanceof Array){
			let currSubNameArr=subKindName.split(',');
			for(let i=0;i<currSubNameArr.length;i++){
				const itemTemp:any={};
				itemTemp.itemCname=currSubNameArr[i];
				itemTemp.itemCode=subKindCode[i];
				console.log(itemTemp)
				this.fzArr.push(itemTemp);
			}
			console.log(currSubNameArr)
			console.log(subKindCode)
		}
		this.http.post(RGDISPURL.GETRESTAUILIARY, { 'kindCode': kindCode,'auxiliary':code,'ruleType':ruleType}).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.fzArr.push(item);
				});
			}
		});
		console.log(this.fzArr)
	}

  //查询时给辅助数组中增加数据显示在页面上
	getInitCodeset(code: string) {
		this.http.post(RGDISPURL.GETCODESET, { codesetCode: code }).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.itemCname;
					item.itemCode = element.itemCode;
					this.fzArr.push(item);
				});
			}
		});
	}

	selectChange(data:any): void {
		this.removeController(); //先移除所有控制器
		if (data.itemCode == 'PZYXJ') {
			this.modalFormData = this.modalFormData1;
		} else if (data.itemCode == 'PZKRCDM') {
			this.modalFormData = this.modalFormData2;
			// if (this.columnarrArr) {
			// 	this.columnarrArr.forEach((element) => {
			// 		if(element.indexOf('gateNames') >-1){
			// 			this.columnsArr = element;
			// 		}
			// 	});
			// }
		} else if (data.itemCode == 'TCCGL') {
			this.modalFormData = this.modalFormData3;
			/*if (this.columnarrArr) {
				this.columnarrArr.forEach((element) => {
					// if (element[4].colEname == 'parkName') {
					// 	this.columnsArr = element;
					// }
					if(element.indexOf('parkName') >-1){
						this.columnsArr = element;
					}
				});
			}*/
		}
	//	this.listSearch({ page: 1, length: this.pageSize });

		for (let i = 0; i < this.modalFormData.length; i++) {
			//重新再加入新控制器
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);
			if (this.modalFormData[i].validators.pattern)
				validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}
		this.ruleType=data.ruleType;
		this.listSearch({ page: 1, length: this.pageSize });
  }
  
  //新增时根据物料编码来判断是否有辅助分类编码
  getFzByKindCode(code:string){
    this.http.post(RGDISPURL.GETAUXILIARYBYKINDCODE, {'matKindCode':code}).then((res: any) => {
			if (res.success) {
        if(res.data.data[0].auxiliary){
          this.map[code]=res.data.data[0].auxiliary;
        }
			}
		});
  }


	//修改方法
	update(data) {
		if(this.UpdateArr.length==0){
			this.tplModal = this.nm.warning({
			  nzTitle: '提示信息',
			  nzContent: '请选择一条数据之后修改'          
			});
			return;
		  }
		  this.saveFlag=false;
		// if(this.carNum==0){
		// 	data.ruleType=1
		// }else if(this.carNum==1){
		// 	data.ruleType=2
		// }else if(this.carNum==2){
		// 	data.ruleType=3
		// }

		//在切换tab页时已经修改过ruletype
		data.ruleType=this.ruleType;
		if (data.auxiliary) {
			this.getCodeset(data.auxiliary,data.kindCode,data.subKindCode,data.subKindName,data.ruleType);
			console.log(this.fzArr);
		}
		console.log(data)
		data.gateNames = data.gateCodes;
		data.truckKindName = data.truckKind;
		data.parkName = data.parkCode;
		data.qeueClassName = data.qeueClass;
		//data.subKindName=data.subKindCode;
		data.editstate = 1;
		if (data.auxiliary) {
			data.flag = false;
		}
		console.log(data.truckKindName);
		if (data.status == '启用') {
			data.status = 'PDGZ10';
		} else {
			data.status = 'PDGZ20';
		}

		// this.hidden[flag] = true;
	}
	//取消保存
	cancle(data, flag = null) {
		// this.hidden[flag] = false;
		data.editstate = 0;
		this.listSearch({ page: 1, length: this.pageSize });
	}
	saveData(data) {
    if(data.subKindCode instanceof Array){
          this.arrChange(data.subKindCode);
		  data.subKindCode = data.subKindCode.join(',').startsWith(',')?data.subKindCode.join(',').slice(1):data.subKindCode.join(',');
		  console.log(data.subKindCode)
		  data.subKindName = this.subNameArr.join(',');
    }
		console.log(data);
				if (this.cm.canOperate([ data ], 'status', [ '', undefined, null ], '状态不能为空，请重新填写')) {
					return;
				}
			
		if (this.ruleType == 1) {
			if (this.cm.canOperate([ data ], 'qeueClassName', [ '', undefined, null ], '排队优先级不能为空，请重新填写')) {
				return;
			}
		}

		if (this.ruleType == 3) {
			if (this.cm.canOperate([ data ], 'parkName', [ '', undefined, null ], '停车场不能为空，请重新填写')) {
				return;
			}
		}

		if (this.ruleType == 2) {
			if (this.cm.canOperate([ data ], 'gateNames', [ '', undefined, null ], '入厂大门不能为空，请重新填写')) {
				return;
			}
		}
		
		data.revisor = this.info.APPINFO.USER.name;
		// this.hidden[flag] = false;
		data.editstate = 0;
		data.qeueClass = data.qeueClassName;
		data.gateCodes = data.gateNames;
		data.parkCode = data.parkName;
		data.truckKind = data.truckKindName;
		console.log(data + '00000000000000000000000000000000000');
		this.http.post(RGDISPURL.RULEUPDATE, data).then((res: any) => {
			if (res.success) {
				this.dataSet = res.data.data.data;
				this.totalPage = res.data.data.total;
				this.tplModal = this.nm.info({
					nzTitle: '提示信息',
					nzContent: '修改成功'
				});
			}
			this.listSearch({ page: 1, length: this.pageSize });
		});
	}

	btnClick(data: any) {
		switch (data.buttonId) {
			case 'Add':
				this.addData();
				break;
				case 'Update':
						this.update(this.UpdateArr[0]);
						break;
						case 'Save':
						  this.saveData(this.dataSet.filter(x=>x.editstate==1)[0])
						  break;
						  case 'Delete':
							this.deleteBtn(this.UpdateArr[0]);
							break;
		}
	}

	addData() {
		this.InsertFormVisible = true;
		// if(this.carNum==0){
		// 	this.ruleType=1
		// }else if(this.carNum==1){
		// 	this.ruleType=2
		// }else if(this.carNum==2){
		// 	this.ruleType=3
		// }
	}

	columns(data: any[]) {
		this.columnsArr = data;
		//this.columnarrArr.push(data);
		console.log(this.columnarrArr);

		let subKindName = this.columnsArr.filter((x) => x.colEname === 'subKindName');
		if (subKindName[0]) {
			subKindName[0].tdTemplate = this.subKindName1;
		}
	}

	// 数据弹出框取消
	closeResult(): void {
		this.modalValidateForm.reset();
	}

	// 数据弹出框取消
	handleCancel(): void {
		this.InsertFormVisible = false;
	}
	//新增弹框确认
	handleOk() {
		for (const i in this.modalValidateForm.controls) {
			this.modalValidateForm.controls[i].markAsDirty();
			this.modalValidateForm.controls[i].updateValueAndValidity();
		}
		if (this.modalValidateForm.status == 'INVALID') {
			return;
		}
		const data = { ...this.modalValidateForm.getRawValue() };
		data.kindName = this.kindName;
		data.revisor = this.info.APPINFO.USER.name;
		if (this.ruleType == 1) {
			data.queueClassName = this.queueClassName;
			//品种相同时不能新增
			for(let i=0;i<this.dataSet.length;i++){
				if(this.dataSet[i].kindName == data.kindName){
				 this.tplModal = this.nm.warning({
				   nzTitle: '提示信息',
				   nzContent: '该品种对应的优先级已存在，请确认后再新增'          
				 });
				 return;
				}
			  }
		} else if (this.ruleType == 2) {
			data.gateNames = this.gateNames;
			data.truckKindName = this.truckKindName;
			for(let i=0;i<this.dataSet.length;i++){
                if(this.dataSet[i].kindCode == data.kindCode && this.dataSet[i].gateNames == data.gateNames){
                 this.tplModal = this.nm.warning({
                   nzTitle: '提示信息',
                   nzContent: '此品种对应的大门已存在，请确认后再新增'          
                 });
                 return;
                }
              }
	 // data.subKindName = this.subKindName;//新增时进行转换
		}else if(this.ruleType == 3){
			for(let i=0;i<this.dataSet.length;i++){
                if(this.dataSet[i].kindCode == data.kindCode && this.dataSet[i].parkCode == data.parkCode){
                 this.tplModal = this.nm.warning({
                   nzTitle: '提示信息',
                   nzContent: '此品种对应的停车场已存在，请确认后再新增'          
                 });
                 return;
                }
              }
		}
		if(this.map[data.kindCode]){
			this.arrChange1(data.subKindCode);
			console.log(data.subKindCode);
			data.subKindCode = data.subKindCode.join(',').startsWith(',')?data.subKindCode.join(',').slice(1):data.subKindCode.join(',');
			  data.subKindName = this.subNameArr.join(',');
		   }
		// switch (this.carNum) {
		// 	case 0:
		// 		data.ruleType = 1;
		// 		break;
		// 	case 1:
		// 		data.ruleType = 2;
		// 		break;
		// 	case 2:
		// 		data.ruleType = 3;
		// 		break;
		// }

		data.ruleType=this.ruleType;
		// this.carNum == 0?data.ruleType=1:data.ruleType=2;
		//this.listLoading = true;
		const url = RGDISPURL.RULEINSERT;
		const params = { url: url, data: data, method: 'POST' };
		console.log(this.modalValidateForm.getRawValue());
		this.isOkLoading=true;
		this.http.request(params).then((res: any) => {
			if (res.success) {
				this.tplModal = this.nm.info({
					nzTitle: '提示信息',
					nzContent: '新增成功!'
				});
				this.isOkLoading = false;
				this.destroyTplModal();
				console.log('0000000');
				//查询
				this.InsertFormVisible = false;
				// this.listSearch();
			} else {
				this.isOkLoading = false;
			}
			this.listSearch({ page: 1, length: this.pageSize });
		});
	}

	destroyTplModal() {
		window.setTimeout(() => {
			this.tplModal.destroy();
		}, 1500);
	}

	onChange(data): void {//根据下拉框选中的值去判断是否有辅助下拉框，并且查询值
	console.log(data);
	if(data){
		this.getFzByKindCode(data);
	}
    console.log(this.map[data]+'this.map[data]');
		if (this.map[data]) {
			console.log('存在辅助分类');
			console.log(this.map[data] + '辅助分类代码');
			this.http.post(RGDISPURL.GETRESTAUILIARY, { 'kindCode': data,'auxiliary':this.map[data],'ruleType':this.ruleType}).then((res: any) => {
				if (res.success) {
          this.subKindArr=[];
					res.data.data.forEach((element) => {
						const item: any = {};
						item.itemCname = element.itemCname;
						item.itemCode = element.itemCode;
						this.subKindArr.push(item);
					});
				}
			});
		}
		this.kindCode = data;
		this.kindNameArr.forEach((element) => {
			if (this.kindCode == element.itemCode) {
				this.kindName = element.itemCname;
			}
		});
	}

	queueChange(data) {
		console.log(data);
		this.qeueClass = data;
		this.queueArr.forEach((element) => {
			if (this.qeueClass == element.itemCode) {
				this.queueClassName = element.itemCname;
			}
		});
		console.log(this.qeueClass + '' + this.queueClassName);
	}

	subChange(data) {
		console.log(data);
		this.subKindCode = data;
		this.subArr.forEach((element) => {
			if (this.subKindCode == element.itemCode) {
				this.subKindName = element.itemCname;
			}
		});
		console.log(this.qeueClass + '' + this.queueClassName);
	}

	truckChange(data) {
		console.log(data);
		this.truckKind = data;
		this.truckArr.forEach((element) => {
			if (this.truckKind == element.itemCode) {
				this.truckKindName = element.itemCname;
			}
		});
	}

	gatesChange(data) {
		console.log(data);
		this.gateCodes = data;
		this.gateArr.forEach((element) => {
			if (this.gateCodes == element.itemCode) {
				this.gateNames = element.itemCname;
			}
		});
		console.log(this.gateNames);
	}

	//移除所有控制器
	removeController(): void {
		this.modalValidateForm.removeControl('qeueClass');
		this.modalValidateForm.removeControl('gateCodes');
		this.modalValidateForm.removeControl('kindCode');
		this.modalValidateForm.removeControl('subKindCode');
		this.modalValidateForm.removeControl('truckKind');
		this.modalValidateForm.removeControl('parkCode');
	}

	parkChange(data) {
		this.parkCode = data;
		this.truckArr.forEach((element) => {
			if (this.parkCode == element.itemCode) {
				this.parkName = element.itemCname;
			}
		});
	}

	//删除按钮
	deleteBtn(data) {
	if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后删除'          
      });
      return;
	}
	if(data.status != '作废'){
		this.tplModal = this.nm.warning({
		  nzTitle: '提示信息',
		  nzContent: '作废数据才可以删除'          
		});
		return;
	  }
		this.deletemodaltitle = '提示信息';
		this.finishCon = '是否删除此数据';
		this.deleteId = data.id;
		this.deleteVisible = true;
	}
	//删除方法
	deleteData(data) {
		//console.log(data)
		if ('ok' == data.type) {
			this.http.post(RGDISPURL.RULEDELETE, { id: this.deleteId }).then((res: any) => {
				if (res.success) {
					this.tplModal = this.nm.info({
						nzTitle: '提示信息',
						nzContent: '操作成功'
					});
					this.deleteVisible = false;
					this.listSearch({ page: 1, length: this.pageSize });
				}
			});
		} else if ('cancel' == data.type) {
			console.log('取消');
			this.deleteVisible = false;
		}
	}
	//修改时转换
	arrChange(array) {
    this.subNameArr = [];
	console.log(array)
	console.log(this.fzArr+'this.fzarr')
      array.forEach((element) => {
        this.fzArr.forEach((queueelement) => {
          if (element == queueelement.itemCode) {
            this.subNameArr.push(queueelement.itemCname);
          }
        });
      });
  }
  //新增时转换
  arrChange1(array) {
    this.subNameArr = [];
    array.forEach((element) => {
        this.subKindArr.forEach((queueelement) => {
          if (element == queueelement.itemCode) {
            this.subNameArr.push(queueelement.itemCname);
          }
        });
      });
	}

	updateDataResult(data:any){
		this.UpdateArr=data;
	  }

	//根据按钮返回的数据决定那tab页面显示
	// btnDataReturn(data: any) {
	// 	console.log(data);
	// 	if (this.buttonArr.length < 1) {
	// 		this.buttonArr.push(data);
	// 		console.log(this.buttonArr);
	// 		for (var i = 0; i < this.tabs.length; i++) {
	// 			for (var j = 0; j < data.length; j++) {
	// 				if (this.tabs[i].itemCode === data[j].buttonId) {
	// 					this.tabsArr.push(this.tabs[i]);
	// 				}
	// 			}
	// 		}
	// 		this.tabs = this.tabsArr;
	// 		if(this.tabs[0]){
	// 			this.ruleType=this.tabs[0].ruleType;
	// 			this.listSearch({ page: 1, length: this.pageSize });
	// 		}
	// 	}
	// }
}
