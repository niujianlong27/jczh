export class Company {

   creditCode: string;
   companyAddress: string;
   companyPhone: string;
   bankName: string;
   bankAccount: string;
   taxNo?: string;
   remark?: string;
   invoiceType?: string;



  constructor() {
    this.creditCode = null;
    this.companyAddress = null;
    this.companyPhone = null;
    this.bankName = null;
    this.bankAccount = null;
    this.taxNo = null;
    this.remark = null;
    this.invoiceType = null;
  }

  clear() {
    this.creditCode = '';
    this.companyAddress = '';
    this.companyPhone = '';
    this.bankName = '';
    this.bankAccount = '';
    this.taxNo = '';
    this.remark = '';
    this.invoiceType = '';
  }

  changeCompany(data: Company) {
    if (data) {
      this.creditCode = data.creditCode;
      this.companyAddress = data.companyAddress;
      this.companyPhone = data.companyPhone;
    } else {
      this.creditCode = '';
      this.companyAddress = '';
      this.companyPhone = '';
    }

  }

}
