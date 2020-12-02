import { Component, OnInit, } from '@angular/core';
import { Ship } from './ship.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';
@Component({
    templateUrl: './ship-list.component.html',
    providers: [
        Ship
    ],
    styles: [`
        .ant-pagination:after {
            content: " xxxxxxxx";
            display: block;
            height: 64px !important;
            clear: both;
            overflow: hidden;
            visibility: visible !important;
        }

        .backstyel10{color:grey}
        .backstyel20{color:orange}
        .backstyel31{color:red}
        .backstyel30{color:green}
        .line-clamp1 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    `]
})
export class ShipListComponent implements OnInit {

    page: Page = new Page();
    platPage: Page = new Page();

    // 主界面
    inqu: any = {};
    queryLoading: boolean = false;

    optionsMap: any = {};

    result: Array<any> = [];

    constructor(private http: HttpUtilService,
        private router: Router ) {

    }

    ngOnInit() {
        this.initOptions();
        this.query();
    }

    query(): void {
        this.queryLoading = true;
        this.http.post(SEA_URLS.SHIP_QUERY, { ...this.page.getPagingObj, ...this.inqu })
            .then((res: any) => {
                if (res.success) {
                    this.result = res.data.data.data;
                    this.page.total = res.data.data.total;

                }
                this.queryLoading = false;
            });
    }

    renderList() {
        if (this.result && this.result.length > 0) {
            for (let item of this.result) {
                if (item.status == 10) {
                    item.statusName = '待提交';
                }
                if (item.status == 20) {
                    item.statusName = '待审核';
                }
                if (item.status == 30) {
                    item.statusName = '审核通过';
                }
                if (item.status == 31) {
                    item.statusName = '停用';
                }
            }
        }
    }

    getCodeName(name, value) {
        var lable = ''
        if (name == 'type') {
            if (value == 1) {
                lable = '船东'
            }
            if (value == 2) {
                lable = '船代'
            }
        }
        if (name == 'bizType') {
            if (value == 1) {
                lable = '近洋'
            }
            if (value == 2) {
                lable = '远洋'
            }
            if (value == 0) {
                lable = '全部'
            }
        }
        if (name == 'isMargin' || name == 'isBilling') {
            if (value == 0) {
                lable = '否'
            }
            if (value == 1) {
                lable = '是'
            }
        }
        return lable;
    }

    initOptions(): void {
        /*this.http.post('CODESET.GET', "disp.feigang")
            .subscribe((res: any) => {
                Object.assign(this.optionsMap, { 'disp.feigang': res.data.map(item => new Object({ 'value': item.itemCode, 'label': item.itemCname })) })
            });
        this.http.post('CODESETDESC.GETALL', {})
            .subscribe((res: any) => {
                Object.assign(this.optionsMap, { 'disp.codeset': res.data.map(item => new Object({ 'value': item.codesetCode, 'label': item.codesetDesc })) })
            });*/

            // query() {
            //     this.queryLoading = true;
            //     this.http.post(SEA_URLS.getBasicHarborList, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
            //       if (res.success) {
            //         this.result = res.data.data.data;
            //         this.page.total = res.data.data.total;
            
            //         this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(",") : []);
            //       }
            //       this.queryLoading = false;
            //     });
            //   }
        this.http.post(SEA_URLS.SHIP_QUERY, {}).then((res:any)=>{
            this.queryLoading = true;
            if(res.success){
                this.result = res.data.data.data;
                this.page.total = res.data.data.total;
                this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(","):[]);
            }
            this.queryLoading = false;
        });

    }

    addShip(planId?: string): void {
        this.router.navigate(['/system/sea/basic/ship-add'], { queryParams: null });
    }

    editShip(shipId?: string): void {
        this.router.navigate(['/system/sea/basic/ship-add'], { queryParams: { 'shipId': shipId } });
    }

    audit(carrierId?: string): void {
        console.log(carrierId);
        this.router.navigate(['/system/sea/basic/carrier-add'], { queryParams: { 'carrierId': carrierId, 'flag': 'audit' } });
    }

    delete(carrierId?: string): void {
        //删除数据
        this.http.post(SEA_URLS.CARRIER_DELETE, carrierId).then((res: any) => {
            if (res.success) {
                this.query();
            }
        })
    }

    bidStatus(value: string[]): void {
        console.log("'" + value.join("','") + "'")
    }

    planType(value: string[]): void {
        console.log("'" + value.join("','") + "'")
    }


    /**
   * 修改每页显示数量
   * @param pageSize 
   */
    pageSizeChange(pageSize: any) {
        //this.page.itemsPerPage = pageSize;
        this.query();
    }

    /**
     * 修改页码
     * @param pageIndex 
     */
    pageIndexChange(pageIndex: any) {
        //this.page.bigCurrentPage = pageIndex;
        this.query();
    }

    refreshStatus(checked: boolean, id: string): void{
   
    }

}
