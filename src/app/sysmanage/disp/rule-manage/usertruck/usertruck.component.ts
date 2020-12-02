import { Component, OnInit, ɵConsole } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { type } from 'os';
import { copyFileSync } from 'fs';

@Component({
	selector: 'app-usertruck',
	templateUrl: './usertruck.component.html',
	styleUrls: [ './usertruck.component.css' ]
})
export class UsertruckComponent implements OnInit {
	constructor(
		private http: HttpUtilService,
		private nm: NzModalService,
		private fb: FormBuilder,
		private msg: NzMessageService,
		private modalService: NzModalService,
		private info: UserinfoService,
		private nn: NzNotificationService
	) {}

	modalFormData: Array<any> = [
		{
			name: '工号',
			eName: 'userCode',
			type: 'text'
		},

		{
			name: '姓名',
			eName: 'userName',
			type: 'text',
			validateCon: '请输入姓名',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},
		{
			name: '电话',
			eName: 'mobile',
			type: 'text',
			validateCon: '请输入电话',
			validators: {
				require: true,
				pattern: true,
				patternStr: '1[3|4|5|7|8][0-9]{9}',
				patternErr: '不是正确的手机号'
			}
		},
		{
			name: '车牌号',
			eName: 'truckNo',
			type: 'text',
			validateCon: '请输入车牌号',
			require: true,

			validators: {
				require: true,
				pattern: true,
				patternStr: '[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂]{1}',
				patternErr: '不是正确的车牌号'
			}
		},

		{
			name: '所属车队',
			eName: 'truckTeam',
			type: 'text',
			validateCon: '请输入所属车队',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		},

		{
			name: '类型',
			eName: 'type1',
			type: 'select',
			validateCon: '请输入类型',
			require: true,
			validators: {
				require: true,
				pattern: false
			}
		}

		// {name: '是否启用', eName:'enable1', type: 'select', validateCon: '请输入状态',require:true,
		//   validators:{
		//     require: true,
		//     pattern:false,

		//   }
		// },
	];

	modalValidateForm: FormGroup; //弹窗块
	// 数据弹出框
	modalFormVisible = false; // 弹窗可视化
	modalTitle: string; // 弹出框标题
	tplModal: NzModalRef; //操作成功后弹窗属性

	listLoading: boolean = true; // 表单加载状态
	dataSet: Array<any> = []; // 表单数据
	searchData: any; //存储查询的数据
	tempSearchParam: any;

	deleteVisible = false; //删除弹窗显示控制
	deleteCon: string; //删除弹窗文字内容
	selectedData: Array<any> = [];

	// 页数控制
	pageSize: number = 30; //条数
	totalPage: number; //数据总条数

	private rowId: number;
	private status: string;

	enable1: any;
	isShow: boolean; //状态是否隐藏
	type1: any;

	isOkLoading: boolean = false; //加载

	themArrData: any = {};
	param: any = {};

	updatedata: any = {}; //选中的数据

	unbindVisible: boolean = false; //司机解绑弹窗
	unbindmodalTitle: string = ''; //司机解绑主题
	unbindCon: string = ''; //司机解绑提示

  tempSearchData:any={};
	//查询
	// 列表查询数据获取
	getListSearch(data: any): void {
    this.tempSearchData=data;
		const params = { url: '', data: {}, method: 'POST' };
		params.url = DISPURL.GETUSERTRUCKLIST; //查询集合或者对象
		data.enterpriseId = this.info.APPINFO.USER.companyId;

		params.data = data;
		this.tempSearchParam = data;
		this.http.request(params).then((res: any) => {
			this.listLoading = false;
			if (res.success) {
				if (res.data.data) {
					this.dataSet = res.data.data.data;
					this.totalPage = res.data.data.total;
				} else {
					this.dataSet = [];
				}
			}
		});
		console.log(this.dataSet);
	}

	// 列表查询
	listSearch(data: any) {
		data.page = data.page || 1; //最好有
		data.length = data.length || this.pageSize; //最好有
		this.searchData = data;
		this.listLoading = true;
		this.getListSearch(data);
	}

	ngOnInit() {
		console.dir(this);
		this.getallCodest(); //小代码刷新显示
		this.listSearch({ page: 1, length: this.pageSize });

		//数据弹出框初始化
		this.modalValidateForm = this.fb.group({});

		this.modalFormData = this.modalFormData ? this.modalFormData : [];
		for (let i = 0; i < this.modalFormData.length; i++) {
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);

			if (this.modalFormData[i].validators && this.modalFormData[i].validators.pattern)
				validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}
	}

	//小代码选择
	themeArrS: Array<any> = []; //状态小代码下拉列表
	themeArrL: Array<any> = []; //类型小代码下拉列表
	getallCodest(): void {
		//下拉框
		this.http.post(DISPURL.GETAllCODESET, { enterpriseId: this.info.APPINFO.USER.companyId }).then((res: any) => {
			if (res.success) {
				res.data.data.forEach((element) => {
					//数据状态
					if (element.codesetCode == 'disp.status') {
						const item: any = {};
						item.itemCname = element.itemCname;
						item.itemCode = element.itemCode;
						this.themeArrS.push(item);
					}
					//类型
					if (element.codesetCode == 'YHGLLX') {
						const item: any = {};
						item.itemCname = element.itemCname;
						item.itemCode = element.itemCode;
						this.themeArrL.push(item);
					}
				});
			}
		});
	}

	//删除
	btnDelete(data: any): void {
		if (data.data.length < 1) {
			this.tplModal = this.nm.warning({
				nzTitle: '提示信息',
				nzContent: '请选中后进行删除！'
			});
			this.destroyTplModal();
			return;
		}

		this.modalTitle = '提示信息';
		this.deleteVisible = true;
		this.deleteCon = '确定要删除所选记录?';
		this.selectedData = data.data;
		this.status = 'delete';
		console.log(this.selectedData);
	}

	// 异常弹出框
	modalErrorResult(data: any) {
		this.modalTitle = '提示信息';
		this.deleteVisible = true;
		this.deleteCon = `${data}`;
	}

	// 删除数据
	deleteData() {
		const params = { url: '', data: {}, method: 'POST' };
		params.url = DISPURL.DELECTUSERTRUCK;
		params.data = this.selectedData;
		this.http.request(params).then((res: any) => {
			if (res.success) {
				this.selectedData = [];
				this.listSearch({});
				this.nn.success('提示消息', '删除成功！');
			} else {
				this.nn.error('提示消息', '删除失败！');
			}
		});
	}

	//删除框确认
	modalConfirmResult(data: any): void {
		if ('ok' === data.type) {
			if ('delete' === this.status) {
				this.deleteData();
				this.status = '';
			}
		}
		this.deleteVisible = false;
	}

	// 修改
	btnUpdate(data: any): void {
		if (data.data.length < 1 || data.data.length > 1) {
			this.tplModal = this.nm.info({
				nzTitle: '提示信息',
				nzContent: '请选中一条数据后进行修改!'
			});
			return;
		}

		this.modalFormVisible = true;
		this.modalTitle = '基本信息 > 修改';
		this.status = 'update';

		// if(this.modalFormData.length>5){
		//   this.modalFormData.pop();//"状态"修改时,显示
		// }
		// this.modalFormData.push(
		//   {name: '是否启用', eName:'enable1', type: 'select', validateCon: '请输入状态',require:true,
		//     validators:{
		//       require: true,
		//       pattern:false,

		//     }
		//   },
		// );

		//刷新(必须有)
		for (let i = 0; i < this.modalFormData.length; i++) {
			let validatorOrOpts: Array<any> = [];
			if (this.modalFormData[i].require) validatorOrOpts.push(Validators.required);

			if (this.modalFormData[i].validators && this.modalFormData[i].validators.pattern)
				validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
			this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl('', validatorOrOpts));
		}

		//this.rowId = data.data[0].rowId;
		//console.log(this.rowId)

		this.enable1 = data.data[0].enable;

		this.themeArrS.forEach((element) => {
			if (element.itemCname === data.data[0].enableName) {
				this.enable1 = element.itemCode;
			}
		});

		if (data.data.length >= 1) {
			this.param.rowId = data.data[0].rowId;
		}
		this.param.enterpriseId = this.info.APPINFO.USER.companyId;

		this.http.post(DISPURL.GETUSERTRUCKLIST, this.param).then((res: any) => {
			if (res.success) {
				this.themArrData = res.data.data.data;
			}
			this.rowId = data.data[0].rowId;
			console.log(this.rowId);
			this.modalValidateForm.patchValue(this.themArrData[0]); //将信息显示到弹出窗内
		});
		//this.modalValidateForm.patchValue(data.data[0]);//将信息显示到弹出窗内

		//类型
		let type: string;
		this.themeArrL.forEach((element) => {
			if (element.itemCname === data.data[0].typeName) {
				type = element.itemCode;
			}
		});
		this.modalValidateForm.get('type1').setValue(type);
	}

	//修改
	//修改方法
	updateData(data: any) {
		const params = { url: '', data: {}, method: 'POST' };

		//data.enterpriseId =this.info.APPINFO.USER.companyId ;
		// data.recRevisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
		data.recRevisor = this.info.APPINFO.USER.name;
		data.enterpriseId = this.info.APPINFO.USER.companyId;
		params.url = DISPURL.UPDATEUSERTRUCK;
		//data.userCode = data.mobile;//当修改电话时,工号也随之改变
		data.rowId = this.rowId;
		data.enable = this.enable1;
		//data.type = this.type1;
		data.type = data.type1;

		params.data = data;

		this.http.request(params).then((res: any) => {
			if (res.success) {
				this.listSearch(this.tempSearchParam);
				this.modalFormVisible = false;

				//修改信息成功后弹窗
				this.tplModal = this.nm.info({
					nzTitle: '提示信息',
					nzContent: '修改成功'
				});
				this.destroyTplModal();

				this.isOkLoading = false;
			} else {
				this.isOkLoading = false;
			}
		});
	}

	// 数据弹出框相关
	handleOk(): void {
		for (const i in this.modalValidateForm.controls) {
			this.modalValidateForm.controls[i].markAsDirty();
		}
		// if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
		//     this.isOkLoading = true;

		// for(let i=0;i<this.dataSet.length;i++){
		//     if(this.dataSet[i].mobile==this.searchData.mobile){
		//       this.tplModal = this.nm.info({
		//         nzTitle: '提示信息',
		//         nzContent: '此工号已存在!'
		//       });
		//     }
		//   }
		// this.addData(this.modalValidateForm.value);
		//}
		for (const i in this.modalValidateForm.controls) {
			this.modalValidateForm.controls[i].updateValueAndValidity();
		}
		if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
			this.isOkLoading = true; //加载

			this.updateData(this.modalValidateForm.value);
		}
	}

	// 数据弹出框取消
	handleCancel(): void {
		this.modalFormVisible = false;
	}

	// 数据弹出框取消
	closeResult(): void {
		this.modalValidateForm.reset();
	}

	//提示弹窗自动关闭
	destroyTplModal(): void {
		window.setTimeout(() => {
			this.tplModal.destroy();
		}, 1500);
	}

	/**
 * 按钮点击事件
 * @param data 
 */
	btnclick(data: any) {
		console.log(data.type.buttonId);
		switch (data.type.buttonId) {
			case 'Unbind':
				this.unbindClick(this.updatedata);
				break;
		}
	}

	/**
   * 司机解绑弹框
   */
	unbindClick(data: any) {
		if (data.length != 1) {
			this.tplModal = this.nm.warning({
				nzTitle: '警告信息',
				nzContent: '请选中一条数据后进行操作'
			});
		} else {
			this.unbindmodalTitle = '提示信息';
			this.unbindVisible = true;
			this.unbindCon = '确定要解绑所选数据的设备?';
		}
	}

	/**
   * 确定司机解绑按钮
   */
	driverUnbind(data: any) {
		if ('ok' === data.type) {
      console.log('司机确定解绑');
      this.driverUnbindPort(this.updatedata[0]);
		}
		this.unbindVisible = false;
  }
  
  	/**
   * 司机解绑接口
   */
  driverUnbindPort(data:any){
    let url = DISPURL.DRIVERUNBIND;
    this.listLoading = true;
    data.driverPhone=data.mobile;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '解绑成功'
        });
      }
      this.listLoading =false;
      this.getListSearch(this.tempSearchData);
    })
  }

	/**
   * 页面选中数据赋值给全局变量
   * @param data 
   */
	updateDataResult(data: any) {
		this.updatedata = data;
		console.dir(this.updatedata);
	}
}
