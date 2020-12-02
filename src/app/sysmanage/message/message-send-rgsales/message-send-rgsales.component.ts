import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {CommonService} from '@service/common.service';
import {GlobalService} from '@service/global-service.service';
import {messageUrl} from '@model/messageUrl';
import {analysisString, regParams} from '@validator/validator';
import {urls} from '@model/url';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService} from '@service/cache.service';
import {format} from 'date-fns';


@Component({
    selector: 'app-message-send-rgsales',
    templateUrl: './message-send-rgsales.component.html',
    styleUrls: ['./message-send-rgsales.component.css']
})
export class MessageSendRGSalesComponent implements OnInit {

    public topicCodeList: Array<any> = []; // 消息主题列表
    public modalValidateForm: FormGroup;
    public isLoadingTopic = false;
    public receiveDisabled: boolean = true; // 接收人是否可选
    public btnText: String = '接收人未选择';
    private topicCode: any; // 选择的消息主题rowID
    private sendType: any; // 选择消息主题的发送类型
    private plateCompanyId: any; // 主题归属公司id
    truckValue: any; // 车型
    paramRequired: boolean = true; // 消息参数是否必填
    paramsValidator: {}; // 消息参数验证用
    topicPageIndex: any = 1;
    topicSearchValue: any;
    receiversModalVisible = false;
    usersSelectData: Array<any> = []; // 待选用户数组
    usersSelectedData: Array<any> = []; // 已选用户数组
    receiversModalTitle: String = '日钢销售消息 > 选择接收人';
    receiversIdList: Array<any> = [];
    selectData: Array<any> = [];
    public allChecked: boolean = false; // 是否可以全选
    public indeterminate: boolean = false;
    // truckKindArr: Array<any> = [];
    driverArr: Array<any> = [];
    inqu: any = {};
    pageSize: any = 1000000; // 页面显示数据条数
    pageNum: number;
    loading = false;
    totalPage: number;
    refresh = 0;
    private queryStatus: string = '';
    mobile: string;
    modalSpinning: boolean = false; //弹窗加载状态
    spinning = false;// 全局加载状态
    attationCarTeam: Array<any> = []; // 要关注车队列表

    constructor(
        private httpUtilService: HttpUtilService,
        private fb: FormBuilder,
        private common: CommonService,
        private globalSer: GlobalService,
        private nn: NzNotificationService,
        private nzModal: NzModalService,
        private nm: NzMessageService,
        private router: Router,
        private route: ActivatedRoute,
        private cache: CacheService,
    ) {
    }

    ngOnInit() {
        this.getTopicList();
        // this.getReceivers();
        this.getDriver();
        // this.getStatic(this.truckKindArr, 'disp.truckKind');
        this.modalValidateForm = this.fb.group({
            topicCode: [null, [Validators.required]],
            receiveIdList: [null],
            messageBody: [null, [Validators.required]],
            messageParam: [null, [Validators.required, this.bodyParamValite]],
            remark: [null]
        });
        this.selectAttationCarTeam();
    }

    /**
     * 获取主题列表
     */
    private getTopicList(): void {
        const params = {
            url: messageUrl.messageTopicSearch,
            data: {
                page: this.topicPageIndex,
                length: 30,
                queryParameterList: this.topicSearchValue
                    ? [
                        {
                            formId: '',
                            value2: null,
                            queryBoxType: 'string',
                            value1: this.topicSearchValue,
                            postQuery: '且',
                            parameter: 'topicName',
                            query: '包含',
                            name: '主题名称',
                            format: '',
                            parameter2: 'topicName_between_end',
                            checkBox: true
                        }
                    ]
                    : null
            },
            method: 'POST'
        };
        this.httpUtilService.request(params).then((res: any) => {
            if (res.success) {
                const data = res.data.data.data ? res.data.data.data : [];
                this.isLoadingTopic = false;
                this.topicCodeList = [...this.topicCodeList, ...data];
                this.routeChange();
            }
        });
    }


    /**
     * 消息参数完整性验证
     */
    private bodyParamValite = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        } else {
            if (regParams(control.value, this.paramsValidator)) {
                return {
                    complete: true,
                    error: true
                };
            }
            return {};
        }
    };


    /**
     * 搜索-主题
     * @param value
     */
    public SearchChange(value: any): void {
        this.isLoadingTopic = true;
        this.topicSearchValue = value;
        this.topicPageIndex = 1;
        this.topicCodeList = [];
        this.getTopicList();
    }

    /**
     * 主题列表滚动到底部回调
     */
    public scrollToBottom(): void {
        this.topicPageIndex++;
        this.isLoadingTopic = true;
        this.getTopicList();
    }

    /**
     * 消息推送form框，目标类型值不为空则显示推送目标
     * @param data 选中消息主题topicCode
     */
    public optionsChange(data: EventEmitter<any[]>): void {
        const selectedTopic = this.topicCodeList.filter(
            res => res.topicCode === data
        );
        this.modalValidateForm.controls.receiveIdList.setValue([]);
        this.paramRequired = false;
        if (selectedTopic.length > 0) {
            // 人员选择框--初始化---start
            this.resetReceivers();
            // 人员选择框--初始化---end
            this.receiveDisabled = false;
            this.topicCode = selectedTopic[0].topicCode;
            this.sendType = selectedTopic[0].sendType;
            this.plateCompanyId = selectedTopic[0].plateCompanyId;
            this.modalValidateForm.controls.messageBody.setValue(
                selectedTopic[0].messageTemplateBody
            );
            const paramsArr = analysisString(selectedTopic[0].messageTemplateBody); // 解析模板内容的param
            let paramsString: String = ''; // 消息参数内容
            this.modalValidateForm.controls.messageParam.clearValidators(); // 清除消息参数的验证
            this.modalValidateForm.controls.messageParam.setValue(null); // 消息参数初始化
            if (paramsArr) {
                this.paramRequired = true;
                const paramArray = {};
                for (const i of paramsArr) {
                    const name = i.replace(/[${}]/g, '');
                    paramArray[name] = ''; // 消息参数数组添加
                }
                this.paramsValidator = paramArray;
                // 字符串参数名换行
                paramsString = JSON.stringify(paramArray)
                    .replace(/,/g, ',\n')
                    .replace(/{/g, '{\n')
                    .replace(/}/g, '\n}');
                this.modalValidateForm.controls.messageParam.setValue(paramsString); // 消息参数赋值
                // 如果消息内容解析param存在，则重设消息参数的验证
                this.modalValidateForm.controls.messageParam.setValidators([
                    Validators.required,
                    this.bodyParamValite
                ]);
            }
            this.cache.setLocal('topicName', selectedTopic[0].topicName);
            // this.getReceivers();
            // this.getBindCompanys(selectedTopic[0]);
        }
    }

    /**
     * 获取待选用户
     * @param status
     * @param source 来源：按钮，非按钮
     */
    getReceivers(status?: string, source?: string) {
        this.modalSpinning = true;
        this.pageNum = this.pageNum || 1;
        this.pageSize = this.pageSize || 1000000;
        this.inqu.page = this.inqu.page || 1;
        this.inqu.length = this.inqu.length || 1000000;
        this.globalSer.pageNumEmitter.emit({
            formId: 'form_rg_sell_sms',
            gridId: 'grid1',
            length: this.inqu.length,
            page: 1,
            search: true
        });
        let url: string;
        if (source) {
            this.pageNum = 1;
            this.pageSize = 1000000;
            this.inqu.page = 1;
            this.inqu.length = 1000000;
        }
        if (status && status === 'companyId') {
            this.queryStatus = status;
            url = messageUrl.getSysUserByCompany;
        } else {
            this.queryStatus = '';
            url = messageUrl.getWaybillUser;
        }
        this.inqu.loadDateStart = this.inqu.loadDateStart && format(new Date(this.inqu.loadDateStart), 'YYYY-MM-DD HH:mm:ss');
        this.inqu.loadDateEnd = this.inqu.loadDateEnd && format(new Date(this.inqu.loadDateEnd), 'YYYY-MM-DD HH:mm:ss');

        this.httpUtilService.post(url, this.inqu).then((res: any) => {
            this.modalSpinning = false;
            if (res.success) {
                this.loading = false;
                this.usersSelectData = res.data.data && res.data.data.data || [];
                this.totalPage = res.data.data && res.data.data.total || 0;
                this.checkData();
            } else {
                this.usersSelectData = [];
                this.totalPage = 0;
            }
            this.loading = false;
        });
    }

    /**
     * 按钮点击
     * @param button
     */
    public btnClick(button: any): void {
        switch (button.buttonId) {
            case 'Send':
                this.sendData();
                break;
            case 'Cancel':
                this.resetForm();
                break;
            case 'Select': {
                this.btnSelect();
            }
                break;
            case 'Attention': {
                this.btnAttention();
            }
                break;
            default:
                this.common.createTplModal('warning', '按钮未绑定方法！');
        }
    }

    /**
     * 接收人弹框afterclose函数
     */
    closeResult() {
        this.inqu = {};
    }

    /**
     * 接收人弹框确认按钮
     */
    handleOk() {
        this.receiversIdList = Utils.deepCopy(this.usersSelectedData);
        if (
            this.receiversIdList.length === 0
        ) {
            this.common.createTplModal('warning', '接收人未选择！');
            return;
        }
        this.common.createTplModal('success', '接收人选择成功！', () => {
            this.receiversModalVisible = false;
            this.btnText = '接收人已选择';
            return true;
        });
    }

    /**
     * 待选用户选择数据
     */
    selectData1(event: Array<any>) {
        this.selectData = this.unique(event, this.usersSelectedData);
    }

    // 数组去重
    unique(arr1: Array<any>, arr2: Array<any>) {
        return arr1.filter(
            (i) => {
                return !arr2.some(value => i.userId === value.userId);
            }
        );
    }

    pageSizeEmit1(data: number) {
        this.pageSize = data;
        this.inqu.page = 1;
        this.inqu.length = this.pageSize;
        this.getReceivers(this.queryStatus);
    }

    pageIndexEmit1(data: number) {
        this.pageNum = data;
        this.inqu.page = this.pageNum;
        this.inqu.length = this.pageSize;
        this.getReceivers(this.queryStatus);
    }

    //
    // /**
    //  * 已选用户选择数据
    //  */
    // selectData2(event: any) {
    //
    // }


    /**
     * 将选择的接收人推到已选择表中
     */
    public pushData(): void {

        if (this.selectData.length === 0) {
            this.common.createTplModal('warning', '未勾选接收人！');
            return;
        }
        this.usersSelectedData = [...this.usersSelectedData, ...this.selectData];
        this.checkData();
        this.selectData = [];
    }

    /**
     * 删除所有接收人
     */
    public deleteData(): void {
        this.usersSelectedData = [];
        this.checkData();
        this.refresh = Math.random();
    }

    // 获取静态数据
    getStatic(data: Array<any>, valueSetCode: string): void {
        this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
            (res: any) => {
                if (res.success) {
                    Array.prototype.push.apply(data, res.data.data.data);
                }
            }
        );
    }

    /**
     * 检查待选接收人与已选择接收人重复性
     */
    private checkData(): void {
        const _this = this;
        // if (this.usersSelectedData.length === 0) {
        //   this.allChecked = false;
        //   this.indeterminate = false;
        // }
        this.usersSelectData.map(item => {
            const indexNum = _this.usersSelectedData.findIndex(e => {
                return item.companyId === e.companyId && item.userId === e.userId;
            });
            if (indexNum > -1) {
                item.checked = true;
                item.disabled = true;
            } else {
                item.checked = false;
                item.disabled = false;
            }
            return item;
        });
        this.usersSelectedData = this.usersSelectedData.filter(item => item.checked);
    }


    /*
    * 删除已选用户
    * */
    delUser(data, source?: string) {

        this.arrRemove(data, this.usersSelectedData);
        this.refresh = Math.random();
        this.checkData();
        if (source && source === 'main') {
            this.receiversIdList = Utils.deepCopy(this.usersSelectedData);
            if (this.receiversIdList.length === 0) {
                this.btnText = '接收人未选择';
            }
        }
    }

    getArrIndex(val, arr1) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] === val) {
                return i;
            }
        }
        return -1;
    }

    arrRemove(val, arr1) {
        const index = this.getArrIndex(val, arr1);
        if (index > -1) {
            arr1.splice(index, 1);
        }
    }

    // 表单验证
    private validateForm(): boolean {
        for (const i in this.modalValidateForm.controls) {
            if (i) {
                this.modalValidateForm.controls[i].markAsDirty();
                this.modalValidateForm.controls[i].updateValueAndValidity();
            }
        }
        return this.modalValidateForm.status === 'VALID';
    }

    /**
     * 消息推送
     * 计划发送时间不为空，则调用发布接口
     */
    private sendData(): void {
        if (this.validateForm() && this.receiversIdList.length !== 0) {
            const url = messageUrl.messagePush;
            const params = this.modalValidateForm.getRawValue();
            params.sendType = this.sendType;
            params.topicCode = this.topicCode;
            params.plateCompanyId = this.plateCompanyId;
            params.receiveIdList = this.receiversIdList.map(item => {
                return {companyId: item.companyId, userId: item.userId};
            });
            this.httpUtilService.post(url, params).then(res => {
                if (res.success) {
                    this.common.createTplModal('success', '消息推送成功！');
                    this.resetForm();
                    this.resetReceivers();
                }
            });
        }
    }

    /**
     * form重置
     */
    private resetForm(): void {
        this.modalValidateForm.reset();
        this.receiveDisabled = true;
        this.usersSelectedData = [];
        this.receiversIdList = [];
        this.btnText = '接收人未选择';
    }

    /**
     * 重置接收人选择
     */
    private resetReceivers(): void {
        this.usersSelectData = [];
        this.usersSelectedData = [];
        this.receiversIdList = [];
        this.selectData = [];
        this.btnText = '接收人未选择';
    }

    /**
     * 获取车队
     */
    getDriver() {
        let url = urls.selectDriver;
        this.httpUtilService.post(url, {}).then((res: any) => {
            if (res.success) {
                res.data.data.forEach(item => {
                    this.driverArr.push({companyName: item.companyName, companyId: item.companyId});
                });
            }
        });
    }

    handleCancel() {
        this.receiversModalVisible = false;
        let status;
        if (this.receiversIdList.length === 0 || this.usersSelectedData.length === 0) {
            status = false;
        } else {
            status = this.receiversIdList.every(
                value => this.usersSelectedData.some(
                    value1 => value.userId === value1.userId
                )
            );
        }

        if (!status) {
            this.usersSelectedData = Utils.deepCopy(this.receiversIdList);
            this.checkData();
            this.refresh = Math.random();
        }
        // this.usersSelectedData = [];
        // this.receiversIdList = [];
        // this.selectData = [];
        // this.btnText = '接收人未选择';
    }

    /**
     * 根据手机号查询 并插入
     */
    mobileFind(param) {
        const url = messageUrl.getSysUserByMobile;
        this.httpUtilService.post(url, {mobile: this.mobile}).then((res: any) => {
            if (res.success) {
                const tmp = res.data.data;
                const status = this.usersSelectedData.some(
                    value => value.userId === tmp.userId
                );
                if (!status) {
                    tmp.checked = true;
                    this.usersSelectedData = [tmp, ...this.usersSelectedData];
                    this.checkData();
                    this.nm.success('成功查询并添加！');
                } else {
                    this.nm.warning('查询用户已添加！');
                }
            }
        });

    }

    /**
     * 接收人按钮点击
     */
    receiverClick() {
        this.receiversModalVisible = true;
        // this.getReceivers();
    }

    /**
     * 查看历史点击
     */
    btnSelect() {
        this.router.navigate(['../messageSendRGSalesAllMessage'], {relativeTo: this.route});
    }

    /**
     * 关注车队点击
     */
    btnAttention(): void {

        const selectList = this.attationCarTeam.filter(value => value.checked).map(value => value.value);

        if (selectList.length === 0) {
            this.nm.warning('请选择要关注的车队！');
            return;
        }
        this.attentionRequest(selectList);

    }

    /**

     * 关注车队请求
     */
    attentionRequest(carTeamList: Array<any>): void {
        const url = urls.attentionCarTeam;
        const params = {
            userIdList: [],
            carTeamList: carTeamList
        };
        this.usersSelectedData.forEach(
            value => params.userIdList.push(value.userId)
        );
        this.spinning = true;
        this.httpUtilService.post(url, params).then(
            res => {
                this.spinning = false;
                if (res.success) {
                    this.nm.success('关注成功!');
                }
            }
        );
    }

    /**
     * 路由更改事件
     */
    routeChange(): void {
        this.route.paramMap.subscribe(
            params => {
                let topicCode = params.get('topicCode');
                if (!topicCode) {
                    return;
                }
                const sendData = this.cache.getLocal('rgSalesMessage');
                if (sendData && sendData.modalValidateForm && sendData.modalValidateForm.topicCode === topicCode) {
                    this.modalValidateForm.get('topicCode').setValue(sendData.modalValidateForm.topicCode);
                    this.modalValidateForm.get('remark').setValue(sendData.modalValidateForm.remark);
                    this.optionsChange(sendData.modalValidateForm.topicCode);
                    this.modalValidateForm.get('messageParam').setValue(sendData.modalValidateForm.messageParam);

                    this.receiversIdList = Utils.deepCopy(sendData.receiveIdList);
                    this.usersSelectedData = Utils.deepCopy(sendData.receiveIdList);
                    this.btnText = '接收人已选择';
                    // this.checkData();
                    this.cache.clearLocal('rgSalesMessage');
                }
            }
        );
    }

    /**
     * 获取当前公司要关注车队
     */
    selectAttationCarTeam(): void {
        this.httpUtilService.post(urls.selectAttationCarTeam, {}).then(
            res => {
                if (res.success) {
                    this.attationCarTeam = (res.data.data && res.data.data.data).map(
                        value => {
                            return {label:`关注${value.name}`, value: value.value};
                        }
                    );

                }
            }
        );
    }
}
