import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Ship } from './ship.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploadFiles } from '../../../../common/services/upload-files';

@Component({
    templateUrl: 'ship-add.component.html',
    providers: [
        Ship
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

export class ShipAddComponent implements OnInit {

    form: FormGroup;
    updateFlag: boolean = false;
    auditFlag: boolean = false;

    monthFormat = 'yyyy-MM';

    queryLoading: boolean = false;//标记修改的查询状态
    result: Array<any> = [];//修改状态下的查出来的数据
    //shipOne ={};//作为查询一条数据的ship

    constructor(
        public ship: Ship,
        private fb: FormBuilder,
        private http: HttpUtilService,
        private route: ActivatedRoute,
        private router: Router,
        private el: ElementRef,
        public upload: UploadFiles, private renderer2: Renderer2
    ) { }

    piCertFileList = [];
    isscCertFileList = [];
    classCertFileList = [];
    shipImgFileList = [];
    previewImage = '';
    previewVisible = false;

    codesetsOption: any = {};

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    handleChange(info, name) {
        if (info.file.status === 'done') {
            console.log(`${name}:${this.piCertFileList[0].url}:${info}`);
            if (name == 'piCertUrl') {
                this.piCertFileList = [info.file.originFileObj];
                this.piCertFileList = this.piCertFileList.map(item => item.originFileObj ? item.originFileObj : item);
                const Urls = this.piCertFileList.map(item => item.url).join(";");

                this.form.patchValue({piCertUrl: Urls});
            }
            if (name == 'isscCertUrl') {
                this.isscCertFileList = [info.file.originFileObj];
                this.isscCertFileList = this.isscCertFileList.map(item => item.originFileObj ? item.originFileObj : item);
                const Urls = this.isscCertFileList.map(item => item.url).join(";");
                this.form.patchValue({isscCertUrl: Urls});
            }
            if (name == 'classCertUrl') {
                this.classCertFileList = [info.file.originFileObj];
                this.classCertFileList = this.classCertFileList.map(item => item.originFileObj ? item.originFileObj : item);
                const Urls = this.classCertFileList.map(item => item.url).join(";");
                this.form.patchValue({classCertUrl:Urls});
            }
            if (name == "shipImgUrl") {
                this.shipImgFileList.push[info.file.originFileObj];
                this.shipImgFileList = this.shipImgFileList.map(item => item.originFileObj ? item.originFileObj : item);
                const Urls = this.shipImgFileList.map(item => item.url).join(";");
                this.form.patchValue({shipImgUrl: Urls});
            }
        }
        if (info.file.status === 'removed') {
            if (name == 'piCertUrl') {
                // this.ship.piCertUrl = '';
                this.form.patchValue({piCertUrl: ''});
            }
            if (name == 'isscCertUrl') {
                // this.ship.isscCertUrl = '';
                this.form.patchValue({isscCertUrl: ''});
            }
            if (name == 'classCertUrl') {
                // this.ship.classCertUrl = '';
                this.form.patchValue({classCertUrl: ''});
            }
            if (name == "shipImgUrl") {
                // console.log(info);
                // this.ship.shipImgUrl = this.setImgUrl(info.fileList);
                this.form.patchValue({shipImgUrl: ''});
                
            }
        }
    }

    setImgUrl = (fileList: any[]) => {
        var url = '';
        if (fileList && fileList.length > 0) {
            for (var i = 0; i < fileList.length; i++) {
                if(fileList[i].uid && fileList[i].uid.substr(0,2) == '-1'){
                    url += fileList[i].url + ";";
                }else{
                    url += fileList[i].originFileObj.url + ";";
                }
            }
            if (url.length > 0) {
                url = url.substr(0, url.length - 1);
            }
        }
        return url;
    }

    setImgFileList(url) {
        var fileList = [];
        var strs = new Array(); //定义一数组 
        strs = url.split(";"); //字符分割 
        console.log("str===================="+strs);
        for (var i = 0; i < strs.length; i++) {
            var file: any = {};
            file.uid = '-1' + i;
            file.name = 'ship' + i;
            file.status = 'done';
            file.url = strs[i];
            fileList.push(file);
        }
        return fileList;
    }

    onChange(result: Date): void {
        
    }


    getCodesetMap(): void {
        /*this.http.post('CODESET.CODESETMAP', { codeset: 'hw.shipmentTerm,hw.shipSociety' }).subscribe((res: any) => {
            Object.assign(this.codesetsOption, res.data);
        })*/
    }


    /**
     * 拿到修改传递的参数shipId
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
    

    ngOnInit() {

        this.form = this.fb.group({
                        id: [null, []],
                        shipId: [null, []],
                        carrierCode: [null, []],
                        carrierName: [null, [Validators.required]],
                        flagCountry: [null, []],
                        contact: [null, [Validators.required]],
                        contactPhone: [null, [Validators.required, Validators.maxLength(11)]],
                        type: [null, [Validators.required]],

                        role: [null, []],
                        score: [null, []],
                        shipLength: [null, [Validators.required]],
                        shipWidth: [null, []],
                        shipHeight: [null, [Validators.required]],
                        draft: [null, [Validators.required]],
                        deadWeight: [null, [Validators.required]],
                        netDeadWeight: [null, []],
                        capacity: [null, []],
                        netCapacit: [null, []],

                        bulkCapacity: [null, []],
                        baleCapacity: [null, []],
                        hatchSize: [null, []],
                        speed: [null, []],

                        shipClass: [null, []],
                        imo: [null, []],
                        crane: [null, []],
                        mmsi: [null, []],
                        buildDate: [null, []],
                        shipPhone: [null, []],
                        shipOwner: [null, []],
                        piCertUrl: [null, []],
                        isscCertUrl: [null, []],
                        classCertUrl: [null, []],
                        shipImgUrl: [null, []],
                        shipImgUrl2: [null, []],
                    });

        // this.getCodesetMap();
        var Request = new this.UrlSearch();
        //根据拿到的shipId，去后台调用参数查询
        //console.info("123456:"+Request.shipId)
        this.http.post(SEA_URLS.SHIP_SELECTONE, {shipId:Request.shipId}).then((res:any)=>{
            this.queryLoading = true;
            if(res.success){
                this.form.patchValue(res.data.data);
                //把得到的图片url转化为图片
                this.piCertFileList = this.upload.getFileList(res.data.data.piCertUrl);
                this.isscCertFileList = this.upload.getFileList(res.data.data.isscCertUrl);
                this.classCertFileList = this.upload.getFileList(res.data.data.classCertUrl);
                this.shipImgFileList = this.upload.getFileList(res.data.data.shipImgUrl);
            }
            this.queryLoading = false;
        });


        this.route.queryParams.subscribe(queryParams => {
            if (queryParams.shipId) {
                this.query(queryParams.shipId);
                this.updateFlag = true;

            }
        });

        //this.upload.setUpload();
    }


    query(shipId: string): void {
        this.http.post(SEA_URLS.SHIP_DETAIL, shipId).then((res: any) => {
            if (res.success && res.data) {
                this.ship = res.data;
                if (res.data.piCertUrl) {
                    this.piCertFileList = [
                        {
                            uid: -1,
                            name: '公司.png',
                            status: 'done',
                            url: res.data.piCertUrl
                        }
                    ]
                }
                if (res.data.isscCertUrl) {
                    this.isscCertFileList = [
                        {
                            uid: -2,
                            name: '营业执照.png',
                            status: 'done',
                            url: res.data.isscCertUrl
                        }
                    ]
                }
                if (res.data.classCertUrl) {
                    this.classCertFileList = [
                        {
                            uid: -3,
                            name: '证书.png',
                            status: 'done',
                            url: res.data.classCertUrl
                        }
                    ]
                }
                if (res.data.shipImgUrl) {
                    console.log("打印shipImUrl"+res.data.shipImgUrl);
                    this.shipImgFileList = this.setImgFileList(res.data.shipImgUrl);
                }
            } else {

            }
        })
    }





    save(): void {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        }
        
        // if(this.ship.buildDate && this.ship.buildDate.length > 6){
        //     this.ship.buildDate = this.ship.buildDate.substr(0,7);
        // }
        let serviceURL = SEA_URLS.SHIP_INSERT;
        if (this.updateFlag) {
            serviceURL = SEA_URLS.SHIP_UPDATE;
        }
        let param = this.form.getRawValue();
        this.http.post(serviceURL, param).then((res: any) => {
            if (res.success && res.data) {
                this.updateFlag = true;
                //this.ship.shipId = res.data.shipId;
                this.router.navigate(['/system/sea/basic/sea-ship'], { queryParams: null });
            }
        })
    }

    changeMargin(name): void {

    }


    submitService(carrierId) {

    }


    cancel(e: MouseEvent) {
        this.router.navigate(['/system/sea/basic/sea-ship'], { queryParams: null });
    }

    audit(e: MouseEvent) {

    }

    rejected(e: MouseEvent) {

    }
}