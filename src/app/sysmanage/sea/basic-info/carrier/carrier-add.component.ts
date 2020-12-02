import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Carrier } from './carrier.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as datefns from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';
import { UploadFiles } from '../../../../common/services/upload-files';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';



@Component({
    templateUrl: 'carrier-add.component.html',
    providers: [
        Carrier
    ],
    styles: [
        `
        .dynamic-delete-button {
          cursor: pointer;
          position: relative;
          top: 4px;
          font-size: 24px;
          color: #999;
          transition: all .3s;
        }
  
        .dynamic-delete-button:hover {
          color: #777;
        }
      `
    ],
})

export class CarrierAddComponent implements OnInit {


    
    form: FormGroup;
    updateFlag: boolean = false;
    auditFlag: boolean = false;
    page: Page = new Page();
    platPage: Page = new Page();

    //提供给两个按钮使用
    isMarginFlag:boolean = false;
    isBillingFlag:boolean = false;
    // 主界面
    inqu: any = {};
    queryLoading: boolean = false;
    constructor(public carrier: Carrier,
        private fb: FormBuilder,
        private http: HttpUtilService,
        private route: ActivatedRoute,
        private router: Router,
        private el: ElementRef,
        private renderer2: Renderer2,
        private info: UserinfoService,
        public upload: UploadFiles, private msg: NzMessageService
    ) {

    }

    imageFileList = [];
    licenseImageFileList = [];
    nvoccImageFileList = [];
    previewImage = '';
    previewVisible = false;

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    handleChange(info, name) {
        if (info.file.status === 'done') {
            if (name == 'imageUrl') {
                this.imageFileList = [info.file.originFileObj];
                this.carrier.imageUrl = this.imageFileList[0].url;
            }
            if (name == 'licenseImageUrl') {
                this.licenseImageFileList = [info.file.originFileObj];
                this.carrier.licenseImageUrl = this.licenseImageFileList[0].url;
            }
            if (name == 'nvoccImageUrl') {
                this.nvoccImageFileList = [info.file.originFileObj];
                this.carrier.nvoccImageUrl = this.nvoccImageFileList[0].url;
            }
        }

        if (info.file.status === 'removed') {
            if (name == 'imageUrl') {
                this.carrier.imageUrl = '';
            }
            if (name == 'licenseImageUrl') {
                this.carrier.licenseImageUrl = '';
            }
            if (name == 'nvoccImageUrl') {
                this.carrier.nvoccImageUrl = '';
            }
        }
    }


    ngOnInit() {

        this.form = this.fb.group({
            id: [null, []],
            carrierId: [null, []],
            carrierCode: [null, []],
            carrierName: [null, [Validators.required]],
            pinyin: [null, []],
            address: [null, []],
            contact: [null, [Validators.required]],
            contactPhone: [null, [Validators.required, Validators.maxLength(11)]],
            type: [null, [Validators.required]],
            bizType: [null, [Validators.required]],
            email: [null, [Validators.email]],
            creditCode: [null, [Validators.required]],
            contactAddress: [null, []],
            accountName: [null, [Validators.required]],
            accountBank: [null, [Validators.required]],
            accountNo: [null, [Validators.required]],
            imageUrl: [null, []],
            licenseImageUrl: [null, []],
            nvoccImageUrl: [null, []],
            isMargin: [null, []],
            marginAmt: [null, [Validators.maxLength(10)]],
            isBilling: [null, []],
            billingAmt: [null, [Validators.maxLength(10)]],
            createTime: [null, []],
            creator: [null, []],
            reviseTime: [null, []],
            revisor: [null, []],
        });

        var Request = new this.UrlSearch();
        this.http.post(SEA_URLS.CARRIER_SELECTONE, {carrierId:Request.carrierId}).then((res:any)=>{
            this.queryLoading = true;
            if(res.success){
                this.form.patchValue(res.data.data);
                //把得到的图片url转化为图片
                this.imageFileList = this.upload.getFileList(res.data.data.imageUrl);
                this.licenseImageFileList = this.upload.getFileList(res.data.data.licenseImageUrl);
                this.nvoccImageFileList = this.upload.getFileList(res.data.data.nvoccImageUrl);
                if(res.data.data.isMargin=="1"){
                    this.form.patchValue({'isMargin': true});
                    this.isMarginFlag = true;
                }else{
                    this.form.patchValue({'isMargin': false});
                }
                if(res.data.data.isBilling=="1"){
                    this.form.patchValue({'isBilling': true});
                    this.isBillingFlag = true;
                }else{
                    this.form.patchValue({'isBilling': false});
                }

                this.updateFlag = true;
            }
            this.queryLoading = false;
        });
        
        if(Request.flag=='audit'){
            this.auditFlag = true; 
        }
        //this.upload.setUpload();
    }

/**
     * 拿到修改传递的参数carrierId
     */
    UrlSearch() {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?");
        str = str.substr(num + 1); //取得所有参数  stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
          num = arr[i].indexOf("=");
          if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
          }
        }
    }


    query(carrierId: string): void {
        this.http.post(SEA_URLS.CARRIER_DETAIL, { ...this.inqu, ...this.page.getPagingObj() }).then((res: any) => {
            if (res.success) {
                this.carrier = res.data;
                if (res.data.imageUrl) {
                    this.imageFileList = [
                        {
                            uid: -1,
                            name: '公司.png',
                            status: 'done',
                            url: res.data.imageUrl
                        }
                    ]
                }
                if (res.data.licenseImageUrl) {
                    this.licenseImageFileList = [
                        {
                            uid: -2,
                            name: '营业执照.png',
                            status: 'done',
                            url: res.data.licenseImageUrl
                        }
                    ]
                }
                if (res.data.nvoccImageUrl) {
                    this.nvoccImageFileList = [
                        {
                            uid: -3,
                            name: '证书.png',
                            status: 'done',
                            url: res.data.nvoccImageUrl
                        }
                    ]
                }
                if (res.data.isMargin && res.data.isMargin == '1') {
                    this.carrier.isMarginFlag = true;
                }
                if (res.data.isBilling && res.data.isBilling == '1') {
                    this.carrier.isBillingFlag = true;
                }
            }
            this.queryLoading = false;
        });
        
    }

    save(): void {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        }
        let serviceURL = SEA_URLS.CARRIER_INSERT;
        var id = this.info.APPINFO.USER.name;
        let param = this.form.getRawValue();


        param.status = '10';
        if (this.updateFlag) {
            serviceURL = SEA_URLS.CARRIER_UPDATE;
            param.revisor = id;
        }else{
            param.creator = id;
        }


        this.http.post(serviceURL, param).then((res: any) => {
            if (res.success) {
                this.carrier.carrierId = res.data.carrierId;
                this.msg.success("成功");
                this.updateFlag = true;
                this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
            }
        });
        
    }

    changeMargin(): void {
        let param = this.form.getRawValue();
        console.log("param.marginAmt="+param.isMargin);
            if (param.isMargin) {
                this.isMarginFlag = true;       
            } else {
                this.form.patchValue({'marginAmt': null});
                this.isMarginFlag = false;
            }  
    }
    changeBilling(): void{
        let param = this.form.getRawValue();
            if (param.isBilling) {      
                this.isBillingFlag = true;
            } else {
                this.form.patchValue({'billingAmt': null});
                this.isBillingFlag = false;
            }
        
    }

    submit(e: MouseEvent) {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        }
        let serviceURL = SEA_URLS.CARRIER_INSERT;
        var id = this.info.APPINFO.USER.name;
        let param = this.form.getRawValue();

        param.status = '20';
        if (this.updateFlag) {
            serviceURL = SEA_URLS.CARRIER_UPDATE;
            param.revisor = id;
        }else{
            param.creator = id;
        }

        this.http.post(serviceURL, param).then((res: any) => {
            if (res.success) {
                this.carrier.carrierId = res.data.carrierId;
                this.msg.success("成功");
                this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
            }
        });
    }

    submitService(carrierId) {
        let param = this.form.getRawValue();
        this.http.post(SEA_URLS.CARRIER_SUBMIT, param).then((res: any) => {
            if (res.success) {
                this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
            }
        });
    }


    cancel(e: MouseEvent) {
        this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
    }

    audit(e: MouseEvent) {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        }
        let param = this.form.getRawValue();
        this.http.post(SEA_URLS.CARRIER_UPDATE,param).then((res: any) => {
            if (res.success) {
                //修改状态
                param.status = '30';
                this.http.post(SEA_URLS.CARRIER_AUDIT, param).then((res: any) => {
                    if (res.success) {
                        this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
                    } else {

                    }
                })
            }
        });
    }

    rejected(e: MouseEvent) {
        let param = this.form.getRawValue();
        let serviceURL = SEA_URLS.CARRIER_INSERT;
        param.status = '10';
        this.http.post(SEA_URLS.CARRIER_REJECTED, param.carrierId).then((res: any) => {
            if (res.success) {
                this.router.navigate(['/system/sea/basic/carrier-list'], { queryParams: null });
            } else {

            }
        })
    }
}