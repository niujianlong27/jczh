import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserinfoService} from '@service/userinfo-service.service';
import {environment} from '@env/environment';
import {HttpUtilService} from '@service/http-util.service';
import {TplButtonsService} from '../tpl-buttons/tpl-buttons.service';

@Component({
  selector: 'company-choice',
  templateUrl: './company-choice.component.html',
  styleUrls: ['./company-choice.component.css']
})
export class CompanyChoiceComponent implements OnInit {

  @Input() selectedCompany: any;
  @Output() selectedCompanyChange = new EventEmitter<any>();

  @Output() companyChange = new EventEmitter<any>();

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测
  selectedCompanyData: Array<any> = []; // 业务公司列表
  formId: string;

  constructor(private info: UserinfoService, private http: HttpUtilService, private tplbtnService: TplButtonsService) {
  }

  ngOnInit() {
    if (this.permissions) {
      let data = JSON.parse(sessionStorage.getItem('companyData'));
      this.getCompanyData(data);
    } else {
      sessionStorage.removeItem('companyData');
    }
  }

  // 选择触发事件
  selectedCompanyClick(): void {
    if (this.selectedCompany) {
      sessionStorage.setItem('companyData', JSON.stringify(this.selectedCompanyData.find(value => value.companyId === this.selectedCompany)));
    } else {
      sessionStorage.removeItem('companyData');
    }
    this.selectedCompanyChange.emit(this.selectedCompany);
    this.companyChange.emit();
    this.tplbtnService.formReset.emit({formId: this.info.APPINFO.formId});
  }

  // 下属公司数据获取
  getCompanyData(data: any): void {
    this.http.post(`${environment.baseUrl}BizCompany/getCompanyBizCompany`, {}).then(
      (res: any) => {
        if (res.success) {
          this.selectedCompanyData = res.data.data;
          if (data) {
            this.selectedCompany = data.companyId;
            this.selectedCompanyChange.emit(this.selectedCompany);
          }
        }
        this.companyChange.emit();

      }
    );
  }

}
