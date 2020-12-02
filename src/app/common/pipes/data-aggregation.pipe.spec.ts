import {DataAggregationPipe} from './data-aggregation.pipe';

describe('数据汇总测试', () => {
  it('测试例1-args不存在', () => {
    const pipe = new DataAggregationPipe();
    const list: Array<any> = [
      {
        number: 1
      },
      {
        number: 3
      }
    ];
    expect(pipe.transform(list, 'a')).toBe(0);
  });

  it('测试例2-参数正常', () => {
    const pipe = new DataAggregationPipe();
    const list: Array<any> = [
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1127',
        'payReportNo': 'YF190820000009',
        'parentCompanyId': 'C000000882',
        'billDate': '2019-08-20 16:13:24',
        'totAmount': '2234.00',
        'totWeight': '2176.000',
        'checkStatus': 'BBPZ10',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receiveFeeStatus': 'BBFK10',
        'receivefeeClientName': '',
        'reportName': ' 信息费报表',
        'businessType': '009',
        'remake': '信息费',
        'createId': 'U000000405',
        'createDate': '2019-08-20 16:13:24',
        'updateDate': '2019-08-20 16:13:24',
        'companyId': 'C000000882',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'checkStatusName': '初始',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '2234.00',
        'unpaidAmount': '2234.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1126',
        'carrierCompanyId': 'C000000882',
        'carrierCompanyName': 'UAT-日钢物流',
        'payReportNo': 'YF190820000008',
        'billDate': '2019-08-20 15:23:14',
        'totAmount': '72241.00',
        'totWeight': '2176.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'flatAmount': '0.000000',
        'confirmationMark': 'QRBJ20',
        'settleCompanyId': 'C000000882',
        'transCompanyId': 'C000000882',
        'fleetCompanyId': 'C000000882',
        'receivefeeClientNo': 'C000000882',
        'receivefeeClientName': '',
        'reportName': '',
        'businessType': '009',
        'remake': '',
        'feeDesc': '运费;',
        'createId': 'U000000405',
        'createDate': '2019-08-20 15:23:14',
        'updateId': 'U000000405',
        'updateDate': '2019-08-20 16:13:18',
        'companyId': 'C000000882',
        'appliedAmount': '72241.00',
        'settleCompanyName': 'UAT-日钢物流',
        'transCompanyName': 'UAT-日钢物流',
        'createName': '尹乐乐',
        'updateName': '尹乐乐',
        'checkStatusName': '全部',
        'businessTypeName': '汽运-日钢省内',
        'receivefeeClientNoName': 'UAT-日钢物流',
        'unappliedAmount': '0.00',
        'unpaidAmount': '72241.00',
        'confirmationMarkName': '待确认',
        'fleetCompanyName': 'UAT-日钢物流',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1125',
        'carrierCompanyId': 'C000005354',
        'carrierCompanyName': '山东京创物流有限公司',
        'payReportNo': 'YF190820000007',
        'billDate': '2019-08-20 15:11:55',
        'totAmount': '5.00',
        'totWeight': '1.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000005354',
        'transCompanyId': 'C000005300',
        'fleetCompanyId': 'C000005091',
        'commissionSystem': 'WTLY10',
        'receivefeeClientName': '',
        'reportName': '1',
        'businessType': '009',
        'feeDesc': '',
        'createDate': '2019-08-20 15:11:55',
        'updateDate': '2019-08-20 15:12:40',
        'companyId': 'C000000882',
        'appliedAmount': '5.00',
        'settleCompanyName': '山东京创物流有限公司',
        'transCompanyName': '虚拟开票单位',
        'checkStatusName': '全部',
        'commissionSystemcName': '手动添加',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '0.00',
        'unpaidAmount': '5.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': '京创智汇（上海）物流科技',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1124',
        'carrierCompanyId': 'C000005354',
        'carrierCompanyName': '山东京创物流有限公司',
        'payReportNo': 'YF190820000006',
        'billDate': '2019-08-20 15:11:00',
        'totAmount': '5.00',
        'totWeight': '1.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000005354',
        'transCompanyId': 'C000005322',
        'fleetCompanyId': 'C000005091',
        'commissionSystem': 'WTLY10',
        'receivefeeClientName': '',
        'reportName': '1',
        'businessType': '009',
        'feeDesc': '',
        'createDate': '2019-08-20 15:11:00',
        'updateDate': '2019-08-20 15:13:00',
        'companyId': 'C000000882',
        'appliedAmount': '5.00',
        'settleCompanyName': '山东京创物流有限公司',
        'transCompanyName': '超舞时代',
        'checkStatusName': '全部',
        'commissionSystemcName': '手动添加',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '0.00',
        'unpaidAmount': '5.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': '京创智汇（上海）物流科技',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1123',
        'carrierCompanyId': 'C000001992',
        'carrierCompanyName': '江苏驰迅物流有限公司',
        'payReportNo': 'YF190820000005',
        'billDate': '2019-08-20 15:09:07',
        'totAmount': '5.00',
        'totWeight': '1.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000005354',
        'transCompanyId': 'C000005354',
        'fleetCompanyId': 'C000005091',
        'commissionSystem': 'WTLY10',
        'receivefeeClientName': '',
        'reportName': 'a',
        'businessType': '009',
        'feeDesc': '',
        'createDate': '2019-08-20 15:09:07',
        'updateDate': '2019-08-20 15:09:53',
        'companyId': 'C000000882',
        'appliedAmount': '5.00',
        'settleCompanyName': '山东京创物流有限公司',
        'transCompanyName': '山东京创物流有限公司',
        'checkStatusName': '全部',
        'commissionSystemcName': '手动添加',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '0.00',
        'unpaidAmount': '5.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': '京创智汇（上海）物流科技',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1123',
        'carrierCompanyId': 'C000001992',
        'carrierCompanyName': '江苏驰迅物流有限公司',
        'payReportNo': 'YF190820000005',
        'billDate': '2019-08-20 15:09:07',
        'totAmount': '5.00',
        'totWeight': '1.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000005354',
        'transCompanyId': 'C000005354',
        'fleetCompanyId': 'C000005091',
        'commissionSystem': 'WTLY10',
        'receivefeeClientName': '',
        'reportName': 'a',
        'businessType': '009',
        'feeDesc': '',
        'createDate': '2019-08-20 15:09:07',
        'updateDate': '2019-08-20 15:09:53',
        'companyId': 'C000000882',
        'appliedAmount': '5.00',
        'settleCompanyName': '山东京创物流有限公司',
        'transCompanyName': '山东京创物流有限公司',
        'checkStatusName': '全部',
        'commissionSystemcName': '手动添加',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '0.00',
        'unpaidAmount': '5.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': '京创智汇（上海）物流科技',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      },
      {
        'returned': 0,
        'dateStartSuffix': ' 00:00:00',
        'dateEndSuffix': ' 23:59:59',
        'rowid': '1122',
        'carrierCompanyId': 'C000001992',
        'carrierCompanyName': '江苏驰迅物流有限公司',
        'payReportNo': 'YF190820000004',
        'billDate': '2019-08-20 14:46:37',
        'totAmount': '5.00',
        'totWeight': '1.000',
        'checkStatus': 'QKZT30',
        'allocationAmount': '0.000000',
        'confirmationMark': 'QRBJ10',
        'settleCompanyId': 'C000005322',
        'transCompanyId': 'C000005300',
        'fleetCompanyId': 'C000005091',
        'commissionSystem': 'WTLY10',
        'receivefeeClientName': '',
        'reportName': '1',
        'businessType': '009',
        'feeDesc': '',
        'createDate': '2019-08-20 14:46:37',
        'updateDate': '2019-08-20 15:08:04',
        'companyId': 'C000000882',
        'appliedAmount': '5.00',
        'settleCompanyName': '超舞时代',
        'transCompanyName': '虚拟开票单位',
        'checkStatusName': '全部',
        'commissionSystemcName': '手动添加',
        'businessTypeName': '汽运-日钢省内',
        'unappliedAmount': '0.00',
        'unpaidAmount': '5.00',
        'confirmationMarkName': '初始化',
        'fleetCompanyName': '京创智汇（上海）物流科技',
        'turnCompany': 'C000000885',
        'turnCompanyName': '唐山管厂物流',
        'virtualCompany': 'C000000886',
        'virtualCompanyName': '衡水管厂物流',
        'settleType': '车队支付'
      }
    ];
    expect(pipe.transform(list, 'totWeight')).toBe(4356.000);
    expect(pipe.transform(list, 'totAmount')).toBe(74495.00);
  });

  it('测试例3-value非数组', () => {
    const pipe = new DataAggregationPipe();
    const list = 'a';
    // @ts-ignore
    expect(pipe.transform(list, 'number')).toBe(0);
  });

  it('测试例4-args参数不存在', () => {
    const pipe = new DataAggregationPipe();
    const list = [];

    expect(pipe.transform(list)).toBe(0);
  });

});
