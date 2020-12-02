import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {toDemical} from '@validator/validator';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-fee-reg-inqu-new',
    templateUrl: './fee-reg-inqu-new.component.html',
    styleUrls: ['./fee-reg-inqu-new.component.css']
})
export class FeeRegInquNewComponent implements OnInit, OnDestroy {

    pageSize: number = 30;
    totalPage: number = 0;
    listLoading: boolean = false;
    dataSet: Array<any> = [];
    private searchData: any = {};
    selectedData: Array<any> = [];

    buttonID: string = '';

    modalVisible = false;
    modalTitle = '';
    modalSpinning = false; // 弹窗加载
    modalFormData: Array<any> = [
        {
            name: '结算单号', eName: 'settleNo', type: 'text', validateCon: '请输入界面ID', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '运单号', eName: 'waybillNo', type: 'text', validateCon: '请输入界面ID', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '开票单位', eName: 'settleCompanyName', type: 'text', validateCon: '请输入界面ID', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '运输单位', eName: 'carrierCompanyName', type: 'text', validateCon: '请输入公司名称', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
                patternStr: '[a-zA-Z0-9]*',
                patternErr: '按钮ID格式不正确，只能填数字或字母'
            }
        },
        {
            name: '司机', eName: 'driverName', type: 'text', validateCon: '业务公司ID', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '车牌', eName: 'vehicleNo', type: 'text', validateCon: '请输入公司名称', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
                patternStr: '[a-zA-Z0-9]*',
                patternErr: '按钮ID格式不正确，只能填数字或字母'
            }
        },
        {
            name: '结算重量', eName: 'totWeight', type: 'text', validateCon: '请选择账户类型', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '结算件数', eName: 'totSheetCount', type: 'text', validateCon: '请输入收款单位', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '客户', eName: 'consignorCompanyName', type: 'text', validateCon: '请输入银行名称', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
        {
            name: '目的地', eName: 'endLocationName', type: 'text', validateCon: '请输入银行名称', require: false, disabled: true,
            validators: {
                require: false,
                pattern: false,
            }
        },
    ];
    modalValidateForm: FormGroup;
    modalDataSet: Array<any> = [];

    numberFormat$: Subject<any> = new Subject<any>();


    constructor(
        private http: HttpUtilService,
        private nm: NzModalService,
        private nn: NzNotificationService,
        private nms: NzMessageService,
        private info: UserinfoService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.formInitialization();
        this.numberFormatSubscribe();

    }

    /**
     * 搜索触发
     * @param param
     */
    listSearch(param: any): void {
        param.page = param.page || 1; //最好有
        param.length = param.length || this.pageSize; //最好有
        this.searchData = param;
        this.getList(this.searchData);
    }

    /**
     * 搜索请求
     * @param param
     */
    getList(param: any): void { //获取列表
        this.listLoading = true;
        this.dataSet = [];
        this.http.post(urls.getWaybillFeeRegister, param).then(
            (res: any) => {
                this.listLoading = false;
                if (res.success) {
                    this.dataSet = res.data.data && res.data.data.data;
                    this.totalPage = res.data.data && res.data.data.total;
                }
            }
        );
    }

    /**
     * 按钮点击
     * @param data
     */
    btnClick(data): void {
        this.buttonID = data.type.buttonId;
        console.log(this.buttonID);
        switch (this.buttonID) {
            case 'regiter': {
                this.btnRegiter();
            }
                break;
            default: {
                this.nms.warning('该按钮不存在定义！');
            }
                break;
        }
    }

    /**
     * 登记点击
     */
    btnRegiter(): void {
        this.modalTitle = '费用登记 > 登记';
        this.modalVisible = true;
        this.modalValidateForm.patchValue(this.selectedData[0]);
        this.getFeeType();
    }

    /**
     * 弹窗确认
     */
    modalOnOk() {
        const status = this.modalDataSet.some(
            value => {
                return (value.agentFlag && !value.receiveType) || (value.payableFlag && !value.payReceiveType);
            }
        );
        if (status) {
            this.nn.warning('提示消息', '请选择计价方式！');
            return;
        }
        this.settleV2AddFeeRegister();
    }

    /**
     * 登记请求
     */
    settleV2AddFeeRegister(): void {
        this.modalSpinning = true;
        const url = urls.settleV2AddFeeRegister;
        const param = {
            tSettleFeeModels: [],
            waybillList: [this.modalValidateForm.getRawValue()]
        };
        param.tSettleFeeModels = this.modalDataSet.map(
            value => {
                return {
                    feeType: value.feeType,
                    feeName: value.feeName,
                    agentFlag: value.agentFlag ? 'YSBJ20' : 'YSBJ10', //应收是否选中
                    payableFlag: value.payableFlag ? 'YFBJ20' : 'YFBJ10', //应付是否选中

                    receiveType: value.agentFlag ? value.receiveType : '', //应收计价方式
                    unitPrice: value.agentFlag ? value.unitPrice : '', //应收单价
                    totalPrice: value.agentFlag ? value.totalPrice : '', //应收总价

                    payReceiveType: value.payableFlag ? value.payReceiveType : '', //应付计价方式
                    payPrice: value.payableFlag ? value.payPrice : '',   //应付单价
                    payTotalPrice: value.payableFlag ? value.payTotalPrice : '',   //应付总价
                };
            }
        );
        this.http.post(url, param).then(
            res => {
                if (res.success) {
                    this.nn.success('提示消息', '登记成功!');
                    this.modalVisible = false;
                    this.listSearch(this.searchData);
                }
            }
        ).finally(
            () => {
                this.modalSpinning = false;
            }
        );
    }

    /**
     * 弹窗取消
     */
    modalOnCancel(): void {
        this.modalVisible = false;
    }

    /**
     * 弹窗关闭后
     */
    modalAfterClose(): void {
        this.modalValidateForm.reset({});
        this.modalDataSet = [];
    }

    /**
     * 选中数据
     * @param params
     */
    updateDataResult(params): void {
        this.selectedData = params;
    }

    /**
     * 弹窗单选更改触发
     */
    modalCheckboxChange(type: string, data: any, value: boolean) {
        switch (type) {
            case 'agentFlag': {
                data.inputDisabled = {
                    receiveType: !value,
                    unitPrice: (!value) || (!(data.receiveType === 'JJFS10')),
                    totalPrice: (!value) || (!(data.receiveType === 'JJFS20')),
                    payReceiveType: data.inputDisabled.payReceiveType,
                    payPrice: data.inputDisabled.payPrice,
                    payTotalPrice: data.inputDisabled.payTotalPrice,
                };
                data.unitPrice = 0;
                data.totalPrice = 0;
            }
                break;
            case 'payableFlag': {
                data.inputDisabled = {
                    receiveType: data.inputDisabled.receiveType,
                    unitPrice: data.inputDisabled.unitPrice,
                    totalPrice: data.inputDisabled.totalPrice,
                    payReceiveType: !value,
                    payPrice: (!value) || (!(data.payReceiveType === 'JJFS10')),
                    payTotalPrice: (!value) || (!(data.payReceiveType === 'JJFS20')),
                };
                data.payPrice = 0;
                data.payTotalPrice = 0;
            }
                break;
        }
    }

    /**
     * 表单初始化
     */
    formInitialization(): void {
        this.modalValidateForm = this.fb.group({});
        this.modalFormData = this.modalFormData ? this.modalFormData : [];
        for (let i = 0; i < this.modalFormData.length; i++) {
            const validatorOrOpts: Array<any> = [];
            if (this.modalFormData[i].validators.require) {
                validatorOrOpts.push(Validators.required);
            }
            if (this.modalFormData[i].validators.pattern) {
                validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
            }
            this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
                {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
            ));
        }
    }

    /**
     * 获取费用类型
     */
    getFeeType(): void {
        this.modalSpinning = true;
        this.http.post(urls.getFeeType, {settleNo: this.selectedData[0].settleNo}).then(
            res => {
                if (res.success) {
                    const {data: {data}} = res;
                    data.forEach(
                        value => {
                            value.agentFlag = (value.agentFlag === 'YSBJ20');
                            value.payableFlag = (value.payableFlag === 'YFBJ20');
                            value.receiveType = value.receiveType || 'JJFS10';
                            value.payReceiveType = value.payReceiveType || 'JJFS10';
                            value.inputDisabled = {
                                receiveType: !value.agentFlag,
                                unitPrice: (!value.agentFlag) || (!(value.receiveType === 'JJFS10')),
                                totalPrice: (!value.agentFlag) || (!(value.receiveType === 'JJFS20')),
                                payReceiveType: !value.payableFlag,
                                payPrice: (!value.payableFlag) || (!(value.payReceiveType === 'JJFS10')),
                                payTotalPrice: (!value.payableFlag) || (!(value.payReceiveType === 'JJFS20')),
                            };
                        }
                    );
                    this.modalDataSet = data;

                }
            }
        ).finally(
            () => {
                this.modalSpinning = false;
            }
        );
    }

    /**
     * 弹窗table输入更改触发
     * @param params
     */
    modalModelChange(params): void {
        const {header: {colEname}, data} = params;
        switch (colEname) {
            case 'receiveType': {
                data.inputDisabled = {
                    receiveType: false,
                    unitPrice: !(data.receiveType === 'JJFS10'),
                    totalPrice: !(data.receiveType === 'JJFS20'),
                    payReceiveType: data.inputDisabled.payReceiveType,
                    payPrice: data.inputDisabled.payPrice,
                    payTotalPrice: data.inputDisabled.payTotalPrice,
                };
            }
                break;
            case 'payReceiveType': {
                data.inputDisabled = {
                    receiveType: data.inputDisabled.receiveType,
                    unitPrice: data.inputDisabled.unitPrice,
                    totalPrice: data.inputDisabled.totalPrice,
                    payReceiveType: false,
                    payPrice: !(data.payReceiveType === 'JJFS10'),
                    payTotalPrice: !(data.payReceiveType === 'JJFS20'),
                };
            }
                break;
            case 'unitPrice':
            case 'totalPrice':
            case 'payPrice':
            case 'payTotalPrice': {
                this.numberFormat$.next({data, colEname});
            }
                break;
        }
    }

    /**
     * 数字格式化订阅
     */
    numberFormatSubscribe(): void {
        this.numberFormat$.pipe(
            debounceTime(500)
        ).subscribe(
            value => {
                const {data, colEname} = value;
                const totWeight = toDemical(Number(this.modalValidateForm.get('totWeight').value), 3);
                data[colEname] = toDemical(data[colEname], 3);
                switch (colEname) {
                    case 'unitPrice': {
                        data.totalPrice = toDemical(Number(data.unitPrice) * Number(totWeight), 3);
                    }
                        break;
                    case 'totalPrice': {
                        data.unitPrice = toDemical(Number(data.totalPrice) / Number(totWeight), 3);
                    }
                        break;
                    case 'payPrice': {
                        data.payTotalPrice = toDemical(Number(data.payPrice) * Number(totWeight), 3);
                    }
                        break;
                    case 'payTotalPrice': {
                        data.payPrice = toDemical(Number(data.payTotalPrice) / Number(totWeight), 3);
                    }
                        break;
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.numberFormat$.unsubscribe();
    }


}
