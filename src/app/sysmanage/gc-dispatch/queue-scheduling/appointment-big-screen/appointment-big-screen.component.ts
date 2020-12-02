import {Component, OnInit, ViewChild} from '@angular/core';
import {gcDispatchURL} from '@model/gcDispatchURL';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService, NzTabChangeEvent} from 'ng-zorro-antd';

@Component({
    selector: 'app-appointment-big-screen',
    templateUrl: './appointment-big-screen.component.html',
    styleUrls: ['./appointment-big-screen.component.css']
})
export class AppointmentBigScreenComponent implements OnInit {

    @ViewChild('detailsModal') detailsModal;

    tabs = ['未报到', '已报到', '已进厂', '已出厂'];

    pageSize = 30; // 条数
    dataSet: Array<any> = []; // 列表数据
    totalPage = 0; // 数据总数
    listLoading = false; // list加载
    searchData: any = {}; // 搜索数据
    selectData: Array<any> = [];
    buttonId: string;   // 按钮ID
    spinning = false; //  对话框加载状态
    planStatus: string = 'DDZT20'; // 类型

    modalSpin = false;
    modalDataSet: Array<any> = [];

    constructor(
        private http: HttpUtilService,
        public upload: UploadFiles,
        private fb: FormBuilder,
        private nn: NzNotificationService,
        private nzModal: NzModalService,
        private nm: NzMessageService,
    ) {
    }

    ngOnInit() {
    }

    /**
     * 查询事件
     * @param param
     */
    listSearch(param: any) {
        param.page = param.page || 1; // 最好有
        param.length = param.length || this.pageSize; // 最好有
        this.searchData = param;
        this.getListSearch(param);
    }

    /**
     * 列表查询数据获取
     * @param data
     */
    getListSearch(data: any): void {
        this.listLoading = true;
        const url = gcDispatchURL.getBigScreen;
        data.planStatus = this.planStatus;
        this.http.post(url, data).then(
            (res: any) => {
                if (res.success) {
                    this.dataSet = res.data.data && res.data.data.data || [];
                    this.totalPage = res.data.data.total || 0;
                    this.selectData = [];
                }
                this.listLoading = false;
            }
        );
    }

    /**
     * tab更改触发事件
     * @param params
     */
    tabSetSelectChange(params: NzTabChangeEvent): void {
        switch (params.tab.nzTitle) {
            case '未报到': {
                this.planStatus = 'DDZT20';
            }
                break;
            case '已报到': {
                this.planStatus = 'DDZT50,DDZT58,DDZT62';
            }
                break;
            case '已进厂': {
                this.planStatus = 'DDZT68';
            }
                break;
            case '已出厂': {
                this.planStatus = 'DDZT80';
            }
                break;
        }
        this.getListSearch(this.searchData);
    }

    /**
     * 明细点击
     */
    detailsClick(obj: any): void {
        this.nzModal.create({
            nzTitle: '预约大屏>查看明细',
            nzContent: this.detailsModal,
            nzStyle: {top: 0},
            nzWidth: 800,
            nzFooter: null
        });
        this.detailRequest(obj);
    }


    /**
     * 明细获取
     */
    detailRequest(obj: any) {
        this.modalSpin = true;
        this.modalDataSet = [];
        const url = gcDispatchURL.getOrderItemByPlan;
        const param: any = {};
        param.planNo = obj.planNo;
        param.companyId = obj.companyId;
        return this.http.post(url, param).then(
            res => {
                this.modalSpin = false;
                if (res.success) {
                    this.modalDataSet = res.data.data || [];
                }
            }
        );
    }

}
