import { Component, OnInit } from '@angular/core';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
//import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { stringToArrayBuffer } from '@angular/http/src/http_utils';
@Component({
	selector: 'app-jgwlqueue',
	templateUrl: './jgwlqueue.component.html',
	styleUrls: [ './jgwlqueue.component.css' ]
})
export class JgwlqueueComponent implements OnInit {
	tabs: Array<any> = [];
	dataSet: any = [];
	listLoading: boolean = false;
	pageSize1: any = 30;
	totalPage: any;
	tempSearchParam: any;
	index: any;
	// status: string = '';
	status:string='^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)';
	// 计算排队时长定时器
	interval: any;
	//carNum:number=0;
	tplModal: NzModalRef; //操作成功后弹窗属性
	UpdateArr: Array<any> = [];
	buttonArr: any[] = [];
	tabsArr: any[] = [];
	statusString: string = '';

	constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {}

	ngOnInit() {
		this.getallCodest();
		this.listSearch({page: 1, length: this.pageSize1});
		this.interval = setInterval(() => {
			this.setQueueingTime();
		}, 1000 * 60);
	}

	/**
   * 获取主列表方法
   * @param data
   */
	getList1(data: any): void {
		this.UpdateArr = [];
		let url = RGDISPURL.getRecordsJgwl;
		let url1 = RGDISPURL.getStatsJgwl;
		this.listLoading = true;
		this.dataSet = [];
		this.tempSearchParam = data;
		this.http.post(url, data).then((res: any) => {
			if (res.success) {
				this.listLoading = false;
				this.dataSet = (res.data.data && res.data.data.data) || [];
				this.setQueueingTime();
				this.totalPage = (res.data.data && res.data.data.total) || 0;
			}
		});
		let sum: number = 0;
		this.tabs.forEach((item) => {
			item.itemCount = 0;
		});
		this.http.post(url1, { status: this.status, parkCode: 'disp.park_1' }).then((res) => {
			if (res.success) {
				this.tabs[0].itemCount = 0;
				res.data.data.forEach((item) => {
					for (let i: number = 1; i < this.tabs.length; i++) {
						if (item.status == this.tabs[i].itemCode) {
							this.tabs[i].itemCount = item.ct;
							// if (this.tabs[0].buttonId == 'All') {
								this.tabs[0].itemCount += item.ct;
							// }
						}
					}
				});
			}
		});
	}

	// 获取表头
	getallCodest(): void {
		const tab: any = {};
		tab.itemCname = '全部';
		tab.itemCode = "^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)";
		// tab.itemCode = '';
		tab.itemCount = 0;
		tab.buttonId = 'All';
		tab.formId = 'form_rgDisp_jgwlqueue0';
		this.tabs.push(tab);
		this.tabs.push({
			itemCname: '已取号',
			itemCode: 'disp_queueDetailStatus_20',
			itemCount: 0,
			formId: 'form_rgDisp_jgwlqueue1',
			buttonId: 'TakeNumber'
		});
		this.tabs.push({
			itemCname: '确认进场',
			itemCode: 'disp_queueDetailStatus_23',
			itemCount: 0,
			formId: 'form_rgDisp_jgwlqueue2',
			buttonId: 'ConfirmPage'
		});
		this.tabs.push({
			itemCname: '待入厂',
			itemCode: 'disp_queueDetailStatus_35',
			itemCount: 0,
			formId: 'form_rgDisp_jgwlqueue3',
			buttonId: 'WaitFactory'
		});
	}

	/**
   * 查询方法
   * @param data
   */
	listSearch(data: any) {
		data.page = data.page || 1;
		data.length = data.length || this.pageSize1;
		//data.status=this.tabs[0].itemCode;
		data.status = this.status;
		data.parkCode = 'disp.park_1';
		//data.kindCode = "disp_matKind_FG"
		//*this.status = '^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)';
		this.getList1(data);
	}

	delete(data: any) {
		if (this.UpdateArr.length == 0) {
			this.tplModal = this.nm.warning({
				nzTitle: '提示信息',
				nzContent: '请选择一条数据之后修改'
			});
			return;
		}
		if (this.UpdateArr[0].status != 'disp_queueDetailStatus_20') {
			this.tplModal = this.nm.warning({
				nzTitle: '提示信息',
				nzContent: '只有已取号的车辆才可以确认进场'
			});
			return;
		}
		this.http.post(RGDISPURL.updateStatsJgwl, data).then((res) => {
			if (res.success) {
				this.nz.success('提示信息', res.data.data);
				this.getList1(this.tempSearchParam);
			}
		});
	}

	/**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
	getPageSize1(pageSize: any): void {
		this.pageSize1 = pageSize;
		this.getList1({ page: 1, length: this.pageSize1 });
	}

	/**
   * 主列表当前页数改变的方法
   * @param page
   */
	getPageIndex1(page: any): void {
		this.getList1({ page: page, length: this.pageSize1 });
	}

	nzSelect(data: any) {
		this.tempSearchParam.status = data;
		this.getList1(this.tempSearchParam);
		this.status = data;
	}

	ngOnDestroy() {
		// 清除定时器
		clearInterval(this.interval);
	}

	//计算排队时长
	setQueueingTime() {
		const curDateTime = new Date().getTime();
		this.dataSet.map((item) => {
			if (item.queueStartTime) {
				const queueingTime = curDateTime - new Date(item.queueStartTime.replace(/-/g, '/')).getTime();
				const hours = Math.trunc(queueingTime / (1000 * 60 * 60));
				const minutes = Math.trunc((queueingTime % (1000 * 60 * 60)) / (1000 * 60));
				if (hours > 0) {
					item.queueingTime = hours + '小时' + minutes + '分';
				} else if (minutes >= 0) {
					item.queueingTime = minutes + '分';
				}
				// if(hours > 47){
				//   item._bgColor='#f86c6b';
				// }else if(hours > 23){
				//   item._bgColor='#ffbf00';
				// }else {
				//   item._bgColor = "";
				// }
			}
			if (item.recReviseTime) {
				const inboundTime = curDateTime - new Date(item.recReviseTime.replace(/-/g, '/')).getTime();
				item.inboundTime = Math.trunc(inboundTime / (1000 * 60)) + '分';
			}
			// if(item.status == 'disp_queueDetailStatus_27'){
			//   item._bgColor = '#63c2de';
			// }
		});
	}

	// selectChange(data:any){
	//   switch(this.carNum){
	//     case 0:
	//       this.status='^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)';
	//       break;
	//     case 1:
	//       this.status='disp_queueDetailStatus_20';
	//       break;
	//     case 2:
	//         this.status='disp_queueDetailStatus_23';
	//         break;
	//         case 3:
	//             this.status='disp_queueDetailStatus_35';
	//             break;
	//   }
	//   console.log(data)
	// }

	btnClick(data: any) {
		switch (data.buttonId) {
			case 'Confirm':
				this.delete(this.UpdateArr[0]);
				break;
		}
	}

	updateDataResult(data: any) {
		this.UpdateArr = data;
	}
	// //根据按钮返回的数据决定那tab页面显示
	// btnDataReturn(data: any) {
	// 	console.log(data);
	// 	if (this.buttonArr.length < 1) {
	// 		this.buttonArr.push(data);
	// 		console.log(this.buttonArr);
	// 		for (var i = 0; i < this.tabs.length; i++) {
	// 			for (var j = 0; j < data.length; j++) {
	// 				if (this.tabs[i].buttonId === data[j].buttonId) {
	// 					this.tabsArr.push(this.tabs[i]);
	// 					//把不是全部的状态全部拼接起来
	// 					if (this.tabs[i].buttonId != 'All') {
	// 						this.statusString += this.tabs[i].itemCode + '|';
	// 					}
	// 				}
	// 			}
	// 		}
	// 		this.statusString.substr(0, this.statusString.length - 1);
	// 		this.tabs = this.tabsArr;
	// 		//如果有全部得话，全部得状态是根据后面的状态拼接起来
	// 		if (this.tabs[0]) {
	// 			if (this.tabs[0].buttonId == 'All') {
	// 				this.tabs[0].itemCode = '^(' + this.statusString.substr(0, this.statusString.length - 1) + ')';
	// 			}
	// 			//第一次查询得是第一个tab得状态
	// 			this.status = this.tabs[0].itemCode;
	// 			//data返回后再执行查询
	// 			this.listSearch({ page: 1, length: this.pageSize1 });
	// 		}
	// 	}
	// }
}
