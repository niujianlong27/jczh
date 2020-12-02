import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {urls} from '@model/url';
import {Utils} from '@util/utils';

@Component({
    selector: 'app-rg-price-trend',
    templateUrl: './rg-price-trend.component.html',
    styleUrls: ['./rg-price-trend.component.css']
})
export class RGPriceTrendComponent implements OnInit {

    pageSize = 30; // 条数
    dataSet: Array<any> = []; // 列表数据
    totalPage = 0; // 数据总数
    listLoading = false; // list加载
    searchData: any = {}; // 搜索数据
    selectData: Array<any> = [];
    buttonId: string;   // 按钮ID


    tplModal: NzModalRef;
    modalButtonLoading = false;
    modalTableLoading = false;
    modalDataSet: Array<any> = [];
    modalSelectedData: Array<any> = [];
    modalColunm: Array<any> = [];
    rgProd: Array<any> = [];
    cityList: Array<any> = [];
    districtList: Array<any> = [];

    @ViewChild('modal') modal;
    @ViewChild('dataFooter') dataFooter;
    @ViewChild('visibleFooter') visibleFooter;
    @ViewChild('dataButtons') dataButtons;
    @ViewChild('visibleButtons') visibleButtons;

    constructor(
        private http: HttpUtilService,
        private angularHttp: HttpClient,
        private nn: NzNotificationService,
        private nzModal: NzModalService,
        private nm: NzMessageService,
    ) {
    }

    ngOnInit() {
        this.getAddressData({level: 'DZDJ20', parentCode: '370000000'});
        this.selectRgProd();
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
        const url = urls.selectAll;
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
     * 选择事件
     * @param param
     */
    updateDataResult(param: Array<any>) {
        this.selectData = param;
    }

    /**
     * 按钮点击
     * @param param
     */
    btnClick(param: any) {
        this.buttonId = param.type.buttonId;
        switch (this.buttonId) {
            case 'Data': { // 数据
                this.btnData();
            }
                break;
            case 'visible': { //显示
                this.btnVisible();
            }
                break;
            default: {
                this.nm.warning('点击按钮功能未定义!');
            }
                break;
        }
    }

    /**
     * 数据点击
     */
    btnData(): void {
        this.modalDataSet = [];
        this.selectAllByCity();
        this.createModal();
    }

    /**
     * 显示
     */
    btnVisible(): void {
        this.modalDataSet = [];
        this.selectRgPriceDisplay();
        this.createModal();
    }

    /**
     * 弹窗选中数据
     * @param params
     */
    modalUpdateDataResult(params: Array<any>): void {
        this.modalSelectedData = params;
    }

    /**
     * 弹窗创建
     */
    createModal(): void {
        const title = this.buttonId === 'Data' ? '数据' : '显示';
        const footer = this.buttonId === 'Data' ? this.dataFooter : this.visibleFooter;
        this.tplModal = this.nzModal.create({
            nzTitle: `日钢省内价格趋势 > ${title}`,
            nzContent: this.modal,
            nzWidth: 1200,
            nzFooter: footer,
            nzStyle: {
                top: 0
            }
        });
    }

    /**
     * 弹窗按钮点击
     * @param buttonID
     */
    btnModalClick(buttonID: string): void {
        switch (buttonID) {
            case 'dataSave': {
                this.btnDataSave();
            }
                break;
            case 'preview': {
                this.btnPreview();
            }
                break;
            case 'visibleSave': {
                this.btnVisibleSave();
            }
                break;
            case 'dataAdd': {
                this.btnDataAdd();
            }
                break;
            case 'visibleAdd': {
                this.btnVisibleAdd();
            }
                break;
            case 'visibleUpdate': {
                this.btnVisibleUpdate();
            }
                break;
            case 'visibleDelete': {
                this.btnVisibleDelete();
            }
                break;
            case 'cancel': {
                this.btnCancel();
            }
                break;
        }
    }

    /**
     * 数据弹窗保存按钮点击
     */
    btnDataSave(): void {
        if (this.modalDataSet.length === 0) {
            this.nm.warning('请添加数据！');
            return;
        }
        const status = this.modalDataSet.every(
            value => {
                return value.date && value.city && value.district && value.variety && value.price;
            }
        );
        if (!status) {
            this.nm.warning('请填写全数据！');
            return;
        }
        this.dataAddRequest();

    }


    /**
     * 数据弹窗保存请求
     */
    dataAddRequest(): void {
        const url = urls.insertPriceList;
        const param = {rgPriceList: []};
        this.modalDataSet.forEach(
            value => {
                param.rgPriceList.push(
                    {
                        rowid: value.rowid,
                        date: Utils.dateFormat(new Date(value.date)),
                        city: value.city,
                        district: value.district,
                        variety: value.variety,
                        price: value.price,
                    }
                );
            }
        );
        this.modalButtonLoading = true;
        this.http.post(url, param).then(
            res => {
                this.modalButtonLoading = false;
                if (res.success) {
                    this.nm.success('数据保存成功！');
                    this.tplModal.close();
                    this.getListSearch(this.searchData);
                }
            }
        );
    }


    /**
     * 数据弹窗新增按钮点击
     */
    btnDataAdd(): void {
        const status = this.selectData.length > 0;
        const inputDisabled = {
            date: status,
            city: false,
            district: true,
            variety: false,
            price: false,
        };
        const date = status ? this.selectData[0].date : Utils.dateFormat(new Date());
        this.modalDataSet = [...this.modalDataSet, {EDIT: true, inputDisabled, date}];
    }


    /**
     * 显示弹窗新增按钮点击
     */
    btnVisibleAdd(): void {
        const inputDisabled = {
            city: false,
            district: true,
            variety: false,
        };
        this.modalDataSet = [...this.modalDataSet, {EDIT: true, inputDisabled}];
    }

    /**
     * 显示弹窗修改按钮点击
     */
    btnVisibleUpdate(): void {
        const inputDisabled = {
            city: false,
            district: false,
            variety: false,
        };
        this.modalSelectedData.forEach(
            value => {
                value.EDIT = true;
                value.inputDisabled = inputDisabled;
                value.districtDisabled = false;
            }
        );
    }

    /**
     * 显示弹窗删除按钮点击
     */
    btnVisibleDelete(): void {
        this.modalDataSet = this.modalDataSet.filter(
            value => {
                const status = this.modalSelectedData.some(
                    value1 => value === value1
                );
                return !status;
            }
        );
    }

    /**
     * 显示弹窗预览按钮点击
     */
    btnPreview(): void {
        window.open('https://datav.jczh56.com/screen/rgPriceTrend');
    }

    /**
     * 点击弹窗取消
     */
    btnCancel(): void {
        this.tplModal.close();
    }

    /**
     * 显示弹窗保存点击
     */
    btnVisibleSave(): void {
        if (this.modalDataSet.length === 0) {
            this.nm.warning('请添加数据！');
            return;
        }
        const status = this.modalDataSet.every(
            value => {
                return value.city && value.district && value.variety;
            }
        );
        if (!status) {
            this.nm.warning('请填写全数据！');
            return;
        }
        this.visibleSaveRequest();
    }

    /**
     * 显示弹窗保存请求
     */
    visibleSaveRequest(): void {
        const url = urls.insertRgPriceDisplay;
        const param = {rgPriceList: []};
        this.modalDataSet.forEach(
            value => {
                param.rgPriceList.push(
                    {
                        rowid: value.rowid,
                        city: value.city,
                        district: value.district,
                        variety: value.variety,
                    }
                );
            }
        );
        this.modalButtonLoading = true;
        this.http.post(url, param).then(
            res => {
                this.modalButtonLoading = false;
                if (res.success) {
                    this.nm.success('数据保存成功！');
                    this.tplModal.close();
                    this.getListSearch(this.searchData);
                }
            }
        );
    }

    /**
     * 获取地点
     * @param params
     * @param other
     */
    getAddressData(params: any, other?: any): void {
        const param = {level: params.level, parentCode: params.parentCode || ''};
        this.http.post(urls.selectProvices, param).then(
            res => {
                if (res.success) {
                    switch (params.level) {
                        case 'DZDJ20': {
                            this.cityList = res.data.data.map(
                                value => {
                                    return {name: value.name, value: value.code};
                                }
                            );
                        }
                            break;
                        case 'DZDJ30': {
                            this.districtList = res.data.data.map(
                                value => {
                                    return {name: value.name, value: value.code};
                                }
                            );
                            other.optionList = this.districtList;

                        }
                            break;
                    }
                }
            }
        );
    }

    /**
     * 弹窗表头弹出
     * @param params
     */
    modalColumns(params: Array<any>) {
        this.modalColunm = params;
        this.modalColunm.forEach(
            value => {
                if (value.colEname === 'city') {
                    value.apiParameter.optionList = this.cityList;
                }
                if (value.colEname === 'variety') {
                    value.apiParameter.optionList = this.rgProd;
                }
            }
        );
    }

    /**
     * 弹窗input更改
     * @param params
     */
    modelChange(params): void {
        if (params.header.colEname === 'city') {
            if (params.val) {

                this.getAddressData({level: 'DZDJ30', parentCode: params.val}, params.data);
                params.data.district = null;
            } else {
                params.data.district = null;
                params.data.inputDisabled.district = true;
            }
        }
    }

    /**
     * 获取日钢大屏展示品种
     */
    selectRgProd(): void {
        const url = urls.selectRgProd;
        this.http.post(url, {}).then(
            res => {
                if (res) {
                    this.rgProd = res.data.data.map(
                        value => {
                            return {
                                name: value.name,
                                value: value.valueId
                            };
                        }
                    );
                }
            }
        );
    }

    /**
     * 数据弹窗 数据查询
     */
    selectAllByCity(): void {
        this.modalTableLoading = true;
        const url = urls.selectAllByCity;
        const param = this.selectData[0] || {};
        this.http.post(url, param).then(
            res => {
                this.modalTableLoading = false;
                if (res.success) {
                    const inputDisabled = {
                        city: true,
                        district: true,
                        variety: true,
                        date: true,
                    };
                    const tmp = res.data.data.data || [];
                    const status = Utils.dateFormat(new Date(tmp[0].date)) === Utils.dateFormat(new Date());
                    this.modalDataSet = tmp.map(
                        value => {
                            value.inputDisabled = inputDisabled;
                            value.EDIT = true;
                            value.districtDisabled = true;
                            this.getAddressData({level: 'DZDJ30', parentCode: value.city}, value);

                            if ((this.selectData.length === 0) && !status) {
                                value.date = Utils.dateFormat(new Date());
                                delete value.rowid;
                            }
                            return value;
                        }
                    );
                }
            }
        );
    }

    /**
     * 显示弹窗 数据查询
     */
    selectRgPriceDisplay(): void {
        this.modalTableLoading = true;
        const url = urls.selectRgPriceDisplay;
        const param = this.selectData[0];
        this.http.post(url, param).then(
            res => {
                this.modalTableLoading = false;
                if (res.success) {
                    const inputDisabled = {
                        city: true,
                        district: true,
                        variety: true,
                    };
                    this.modalDataSet = res.data.data.data || [];
                    this.modalDataSet.forEach(
                        value => {
                            value.inputDisabled = inputDisabled;
                            value.EDIT = true;
                            value.districtDisabled = true;
                            this.getAddressData({level: 'DZDJ30', parentCode: value.city}, value);
                        }
                    );
                }
            }
        );
    }

}
