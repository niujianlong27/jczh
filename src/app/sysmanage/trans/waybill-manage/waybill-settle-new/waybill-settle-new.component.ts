import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {TRANS_URLS} from '@model/trans-urls';
import {ImgViewerService} from '@component/img-viewer/img-viewer.service';

@Component({
    selector: 'app-waybill-settle-new',
    templateUrl: './waybill-settle-new.component.html',
    styleUrls: ['./waybill-settle-new.component.css']
})
export class WaybillSettleNewComponent implements OnInit {

    pageSize = 30; // 条数
    dataSet: Array<any> = []; // 列表数据
    totalPage = 0; // 数据总数
    listLoading = false; // list加载
    searchData: any = {}; // 搜索数据
    selectData: Array<any> = [];
    buttonId: string;   // 按钮ID

    @ViewChild('urlImg') urlImg: TemplateRef<any>;

    constructor(
        private http: HttpUtilService,
        private angularHttp: HttpClient,
        private nn: NzNotificationService,
        private nzModal: NzModalService,
        private nm: NzMessageService,
        private fb: FormBuilder,
        private imgService: ImgViewerService,
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
        const url = TRANS_URLS.settleV2GetPage;
        this.http.post(url, data).then(
            (res: any) => {
                if (res.success) {
                    this.dataSet = res.data.data && res.data.data.data || [];
                    this.totalPage = res.data.data && res.data.data.total || 0;
                    this.selectData = [];
                }

            }
        ).finally(() => {
            this.listLoading = false;
        });
    }

    /**
     * 按钮点击
     * @param param
     */
    btnClick(param: any) {
        this.buttonId = param.type.buttonId;
        switch (this.buttonId) {
            case 'Export': { // 新增
                this.btnExport();
            }
                break;
            default: {
                this.nm.warning('点击按钮功能未定义!');
            }
                break;
        }
    }

    btnExport(): void {
        let url: any = TRANS_URLS.settleV2Export;

        this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            var objectUrl = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = objectUrl;
            a.target = '_blank';
            a.download = `运单查询（结算）.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        });
    }

    columns(data: any) {
        const url = data.filter((x: any) => x.colEname === 'returnPic');
        url[0].tdTemplate = this.urlImg;
    }

    getView(e: MouseEvent, data: string, item: any) {
        e.preventDefault();
        e.stopPropagation();
        if (data) {
            const urls = data.split(';');
            this.imgService.viewer({url: urls});
        }
    }

}
