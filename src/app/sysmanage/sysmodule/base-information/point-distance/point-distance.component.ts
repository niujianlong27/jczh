import {Component, OnInit} from '@angular/core';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-point-distance',
    templateUrl: './point-distance.component.html',
    styleUrls: ['./point-distance.component.css']
})
export class PointDistanceComponent implements OnInit {

    pageSize = 30; // 条数
    dataSet: Array<any> = []; // 列表数据
    totalPage = 0; // 数据总数
    listLoading = false; // list加载
    searchData: any = {}; // 搜索数据
    selectData: Array<any> = [];
    buttonId: string;   // 按钮ID

    modalVisible = false;
    modalOkLoading = false;
    modalTitle = '测试';
    modalValidateForm: FormGroup;
    linkContent = '<a>选择地点</a>';
    rowid = '';

    findSetStartLocationName: any = {
        formId: 'point_pop',
        name: '起始地点',
        parameter: 'address',
        parameterSend: 'locationId',
        url: 'point',
        insertType: 'address'
    };// input-pop相关
    findSetEndLocationName: any = {
        formId: 'point_pop',
        name: '到达地点',
        parameter: 'address',
        parameterSend: 'locationId',
        url: 'point',
        insertType: 'address'
    };// input-pop相关
    status: string = ''; //弹窗状态
    customerId: any;// 委托人id
    startLocationName: string = '';//起始地点
    startLocationId: string = '';//起始地点
    endLocationName: string = '';//到达地点
    endLocationId: string = '';//到达地点

    modalFormData: Array<any> = [
        {
            name: '起始地点', eName: 'startLocationId', type: 'startLocationName', validateCon: '请选择起始地点', require: true,
            validators: {
                require: true
            }
        },
        {
            name: '到达地点', eName: 'endLocationId', type: 'endLocationName', validateCon: '请选择到达地点', require: true, disabled: false,
            validators: {
                require: true
            }
        },
        {
            name: '路程(公里)', eName: 'distance', type: 'number', validateCon: '请输入路程(公里)', require: true, disabled: false,
            validators: {
                require: true
            },
        },
        {
            name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
            validators: {
                require: false
            },
        }
    ];

    constructor(
        private http: HttpUtilService,
        private angularHttp: HttpClient,
        private nn: NzNotificationService,
        private nzModal: NzModalService,
        private nm: NzMessageService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        // 数据弹出框初始化
        this.modalValidateForm = this.fb.group({});
        this.modalFormData.forEach(
            res => {
                let validatorOrOpts: Array<any> = [];
                res.validators.require ? validatorOrOpts.push(Validators.required) : null;
                res.validators.pattern ? validatorOrOpts.push(Validators.required) : null;
                this.modalValidateForm.addControl(res.eName, new FormControl(
                    {value: '', disabled: res.disabled}, validatorOrOpts
                ));
            }
        );

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
        const url = urls.getPagePointDistance;
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
            case 'Add': { // 新增
                this.btnAdd();
            }
                break;
            case 'Update': { // 修改
                this.btnUpdate();
            }
                break;
            case 'Delete': { // 删除
                this.btnDelete();
            }
                break;
            default: {
                this.nm.warning('点击按钮功能未定义!');
            }
                break;
        }
    }

    /**
     * 添加点击
     */
    btnAdd(): void {
        this.modalTitle = '地点路程维护 > 新增';
        this.modalVisible = true;
        this.status = 'add';
    }

    /**
     * 修改数据
     */
    btnUpdate(): void {
        this.modalTitle = '地点路程维护 > 修改';
        this.modalVisible = true;
        this.status = 'update';
        this.modalValidateForm.patchValue(this.selectData[0]);
        this.startLocationName = this.selectData[0].startLocationName;
        this.endLocationName = this.selectData[0].endLocationName;
        this.rowid = this.selectData[0].rowid;
    }

    /**
     * 删除
     */
    btnDelete(): void {
        this.nzModal.confirm({
            nzTitle: '地点路程维护 > 删除',
            nzContent: '是否确认删除选中数据?',
            nzOnOk: () => this.deleteRequest()
        });
    }

    /**
     * 删除请求
     */
    deleteRequest(): Promise<void> {
        const url = urls.deletePointDistance;
        const param = {
            pointDistanceList: []
        };
        this.selectData.forEach(
            value => {
                param.pointDistanceList.push({rowid: value.rowid});
            }
        );
        return this.http.post(url, param).then(
            res => {
                if (res.success) {
                    this.nm.success('删除成功！');
                    this.getListSearch(this.searchData);
                }
            }
        );
    }


    /**
     * 弹窗确认
     */
    handleOk() {
        for (const i in this.modalValidateForm.controls) {
            this.modalValidateForm.controls[i].markAsDirty();
            this.modalValidateForm.controls[i].updateValueAndValidity();
        }

        if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {
            this.addData();
        }

        if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
            this.updateData();
        }

    }

    /**
     * 添加数据
     */
    addData(): void {
        this.modalOkLoading = true;
        const url = urls.insertPointDistance;
        const param = this.modalValidateForm.getRawValue();
        this.http.post(url, param).then(
            res => {
                this.modalOkLoading = false;
                if (res.success) {
                    this.nm.success('新增成功！');
                    this.modalVisible = false;
                    this.getListSearch(this.searchData);
                }
            }
        );
    }

    /**
     * 修改数据
     */
    updateData(): void {
        this.modalOkLoading = true;
        const url = urls.updatePointDistance;
        const param = this.modalValidateForm.getRawValue();
        param.rowid = this.rowid;
        this.http.post(url, param).then(
            res => {
                this.modalOkLoading = false;
                if (res.success) {
                    this.nm.success('修改成功！');
                    this.modalVisible = false;
                    this.getListSearch(this.searchData);
                }
            }
        );
    }

    /**
     * 弹窗取消
     */
    handleCancel() {
        this.modalVisible = false;
    }

    /**
     * 弹窗关闭回调
     */
    closeResult() {
        this.modalValidateForm.reset({});
        this.startLocationName = '';
        this.endLocationName = '';
        this.rowid = '';
        this.startLocationId = '';
        this.endLocationId = '';
    }

    /**
     * input-modal弹窗抛出值
     * @param params
     * @param source
     */
    inpEmit(params, source): void {
        const data = params.selData[0];
        console.log(this.startLocationId, this.endLocationId, 'ggggg');
        switch (source) {
            case 'startLocationName': {
                if (!params) {
                    this.startLocationName = '';
                    this.modalValidateForm.get('startLocationId').setValue('');
                    return;
                }
                this.startLocationName = `${data.provinceName || ''}${data.cityName ? '\\' + data.cityName : ''}${data.districtName ? '\\' + data.districtName : ''} ${data.address || ''}`;
                this.modalValidateForm.get('startLocationId').setValue(data.locationId);
            }
                break;
            case 'endLocationName': {
                if (!params) {
                    this.endLocationName = '';
                    this.modalValidateForm.get('endLocationId').setValue('');
                    return;
                }
                this.endLocationName = `${data.provinceName || ''}${data.cityName ? '\\' + data.cityName : ''}${data.districtName ? '\\' + data.districtName : ''} ${data.address || ''}`;
                this.modalValidateForm.get('endLocationId').setValue(data.locationId);
            }
                break;
        }
        setTimeout(()=>{
            this.startLocationId = '';
            this.endLocationId = '';

        },200)
    }

}
