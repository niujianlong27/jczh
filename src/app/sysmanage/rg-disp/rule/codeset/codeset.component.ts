import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CommonService } from '../../../../common/services/common.service';
@Component({
	selector: 'app-codeset',
	templateUrl: './codeset.component.html',
	styleUrls: [ './codeset.component.css' ]
})
export class CodesetComponent implements OnInit {
	modalTitle: string;
	listLoading: boolean = false;
	isOkLoading: boolean;
	dataSet: any;
	pageSize: number = 30; //条数
	totalPage: number; //数据总条数
	//  hidden:{[key:number]:any} = {};//保存取消按钮
	tplModal: NzModalRef; //操作成功后弹窗属性
	InsertFormVisible: boolean = false; //新增弹框
	modalValidateForm: FormGroup; //新增代码集弹窗
	codeArr: Array<any> = [];
	codesetCode: String;
	codesetDesc: String;
	tempSearchData:any={};
	UpdateArr:Array<any>=[];
    saveFlag:boolean=true;


	modalFormData: Array<any> = [];
	modalFormData1: Array<any> = [
		{
			name: '代码集编码',
			eName: 'codesetCode',
			type: 'input',
			validateCon: '请输入代码集编码',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '代码集名称',
			eName: 'codesetDesc',
			type: 'input',
			validateCon: '请输入代码集名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
    },
    {
			name: '备注',
			eName: 'bk1',
			type: 'input',
			validateCon: '',
			require: false,
			validators: {
				require: false,
				pattern: false
			}
    }
	];
	modalFormData2: Array<any> = [
		{
			name: '代码集名称',
			eName: 'codesetCode',
			type: 'select',
			validateCon: '请输入代码集名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '元素编码',
			eName: 'itemCode',
			type: 'input',
			validateCon: '请输入代码编码',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '元素名称',
			eName: 'itemCname',
			type: 'input',
			validateCon: '请输入代码名称',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '序号',
			eName: 'sortId',
			type: 'input',
			validateCon: '请输入序号',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '备注',
			eName: 'remark',
			type: 'select',
			validateCon: '请输入备注',
			require: false,
			validators: {
				require: true,
				pattern: false
			}
		}
	];
	constructor(
		private fb: FormBuilder,
		private cm: CommonService,
		private modal: NzModalService,
		private http: HttpUtilService,
		private info: UserinfoService,
		private nm: NzModalService
	) {
		this.getallCodest();
		this.listSearch({ page: 1, length: this.pageSize });
	}

	ngOnInit() {
		this.modalValidateForm = this.fb.group({});
		this.modalFormData = this.modalFormData1; //初始化第一个tab页
		for (let i = 0; i < this.modalFormData.length; i++) {
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}
	}

	getallCodest() {
		this.http.post(RGDISPURL.CODESETGETALL, {}).then((res: any) => {
			if (res.success) {
				console.log(res.data.data);
				res.data.data.forEach((element) => {
					//排队大类名称
					const item: any = {};
					item.itemCname = element.codesetDesc;
					item.itemCode = element.codesetCode;
					this.codeArr.push(item);
					//console.log( this.queueArr)
				});
			}
		});
	}

	listSearch(data) {
		this.saveFlag=true;
    	this.UpdateArr=[];
		data.page = data.page || 1; //最好有
		data.length = data.length || this.pageSize; //最好有
		this.getListSearch(data);
	}

	getListSearch(data) {
		this.tempSearchData=data;
		this.listLoading = true;
		this.http.post(RGDISPURL.CODESETGETRECORDS, data).then((res: any) => {
			if (res.success) {
				this.listLoading = false;
				this.dataSet = res.data.data.data;
				this.totalPage = res.data.data.total;
				this.dataSet.map((x) => (x.editstate = 0));
				console.log(res.data.data.data[0].codesetCode);
				this.dataSet.map((x) => (x.status == 'CDJ10' ? (x.status = '启用') : (x.status = '作废')));
			}
		});
	}

	//修改按钮
	update(data) {
		//this.hidden[flag] = true;
		if(this.UpdateArr.length==0){
			this.tplModal = this.nm.warning({
			  nzTitle: '提示信息',
			  nzContent: '请选择一条数据之后修改'          
			});
			return;
		  }
		this.saveFlag=false;
		//let data=this.UpdateArr[0];
		data.editstate = 1;
		if (data.status == '启用') {
			data.status = 'CDJ10';
		} else {
			data.status = 'CDJ20';
		}
	}
	//修改方法
	saveData(data) {
		//let data=this.UpdateArr[0];
		if (this.cm.canOperate([ data ], 'sortId', [ '' ], '序号不能为空请重新填写')) {
			return;
		}
		// this.dataSet.map(x => x.status == '启用' ? x.dealType='CSCL10': x.dealType='CSCL20');
		data.recRevisor = this.info.APPINFO.USER.name;
		// this.hidden[flag] = false;
		data.editstate = 0;
		this.http.post(RGDISPURL.CODESETUPDATE, data).then((res: any) => {
			if (res.success) {
				this.dataSet = res.data.data.data;
				this.totalPage = res.data.data.total;
				this.tplModal = this.nm.info({
					nzTitle: '提示信息',
					nzContent: '修改成功'
				});
			}
			//this.getPageIndex1(1);
			this.listSearch(this.tempSearchData);
		});
	}

	//取消保存
	cancle(data, flag = null) {
		// this.hidden[flag] = false;
		data.editstate = 0;
		this.listSearch({ page: 1, length: this.pageSize });
	}

	btnClick(data: any) {
		switch (data.buttonId) {
			case 'Add':
				this.modalFormData = this.modalFormData1;
				this.continue();
				break;
			case 'Del':
				this.modalFormData = this.modalFormData2;
				this.continue();
				break;
			case 'Update':
				this.update(this.UpdateArr[0]);
				break;
			case 'Save':
				this.saveData(this.dataSet.filter(x=>x.editstate==1)[0]);
				break;
		}
		
		
	}

	continue(){
		this.removeController(); //先移除所有控制器
		for (let i = 0; i < this.modalFormData.length; i++) {
			//重新再加入新控制器
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);
			if (this.modalFormData[i].validators.pattern)
				validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}
		this.InsertFormVisible = true;
		this.modalValidateForm.reset();
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
		this.isOkLoading = true;
		let url = RGDISPURL.CODESETDESCINSERT;
		console.log(this.modalValidateForm.getRawValue());
		if (data.codesetDesc == '' || data.codesetDesc == undefined) {
			data.codesetDesc = this.codesetDesc;
			url = RGDISPURL.CODESETINSERT;
			console.log('新增子项+0000000000000000000000000000');
		}
		data.recRevisor = this.info.APPINFO.USER.name;
		const params = { url: url, data: data, method: 'POST' };
		//console.log(this.modalValidateForm.getRawValue())
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
			this.getallCodest();
			this.listSearch({ page: 1, length: this.pageSize });
		});
	}

	destroyTplModal() {
		window.setTimeout(() => {
			this.tplModal.destroy();
		}, 1500);
	}

	//移除所有控制器
	removeController(): void {
		this.modalValidateForm.removeControl('codesetCode');
		this.modalValidateForm.removeControl('codesetCode');
		this.modalValidateForm.removeControl('codesetDesc');
		this.modalValidateForm.removeControl('itemCode');
		this.modalValidateForm.removeControl('itemCname');
		this.modalValidateForm.removeControl('sortId');
		this.modalValidateForm.removeControl('remark');
	}

	codeChange(data) {
		console.log(data);
		this.codesetCode = data;
		this.codeArr.forEach((element) => {
			if (this.codesetCode == element.itemCode) {
				this.codesetDesc = element.itemCname;
			}
		});
	}

	updateDataResult(data:any){
		this.UpdateArr=data;
	  }

	    /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
	
    this.tempSearchData.page=page;
    this.listSearch(this.tempSearchData);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchData.length = pageSize;
    this.listSearch(this.tempSearchData);
  }
}
