import { Component, OnInit, Input } from '@angular/core';

interface TaxDetail{
  itemTitle?: string;
  spec?: string;
  unit?: string;
  quantity?: string | number;
  quantityStr?: string | number;
  price?: string | number;
  priceStr?: string | number;
  moneyStr?: string | number;
  taxMoneyStr?: string | number;

  money?: string | number;
  taxRatePercent?: string | number;
  taxMoney?: string | number;
}
interface TaxModel{
  invNo?: string;
  invNum?: string;
  gmtCreate?: string;
  checkNo?: string;
  buyerName?: string;
  buyerTaxCode?: string;
  buyerAddress?: string;
  buyerTel?: string;
  buyerBankName?: string;
  buyerBankAccount?: string;
  texCtrlNo?: string;
  details?: TaxDetail[];
  money?: string | number;
  moneyStr?: string | number;

  taxMoney?: string | number;
  totalMoneyChina?: string | number;
  totalMoney?: string | number;
  sellerName?: string;
  sellerTaxCode?: string;
  sellerAddress?: string;
  sellerTel?: string;
  sellerBankName?: string;
  sellerBankAccount?: string;
  remark?: string;
  payee?: string;
  reviewer?: string;
  creator?: string;
}
@Component({
  selector: 'app-added-value-tax-template',
  templateUrl: './added-value-tax-template.component.html',
  styleUrls: ['./added-value-tax-template.component.css']
})
export class AddedValueTaxTemplateComponent implements OnInit {
  public _data: TaxModel;
  @Input() set data(val: TaxModel) {
    this._data = val || {};
  }

  get data() {
    return this._data;
  }

  constructor() { }

  ngOnInit() {
  }

}
