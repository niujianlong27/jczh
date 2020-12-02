/** 是否为数字 */
export function isNum(value: string | number, abs: boolean = false): boolean {
  const reg = !abs ? /^((-?\d+\.\d+)|(-?\d+)|(-?\.\d+))$/ : /^((\d+\.\d+)|(\d+)|(\.\d+))$/;
  return reg.test(value.toString());
}

/** 是否为整数 */
export function isInt(value: string | number, abs: boolean = false): boolean {
  // tslint:disable-next-line:triple-equals
  return isNum(value, abs) && parseInt(value.toString(), 10) == value;
}

/** 是否为小数 */
export function isDecimal(value: string | number): boolean {
  return isNum(value) && !isInt(value);
}

/** 是否为身份证 */
export function isIdCard(value: any): boolean {
  return (
    typeof value === 'string' && /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(value)
  );
}


/** 是否为手机号 */
export function isMobile(value: any): boolean {
  return (
    typeof value === 'string' &&
    /^(0|\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(
      value,
    )
  );
}

/** 是否为座机号 */
export function isTelphone(value: any): boolean {
  return (
    typeof value === 'string' &&
    /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/.test(value)
  );
}

/** 是否为 重量之类的数字 */
export function isPosNum(value: string | number, abs: boolean = true): boolean {
  const reg = abs ? /^(0|[1-9][0-9]*)(\.[0-9]*)?$/ : /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  return reg.test(value.toString());
}

/** 转换小数，n表示转化成几位小数*/
export function toDemical(value: Number, n?: number) {
  value = Number(value);
  return (value == undefined || value < 0) ? '0.00' : value.toFixed((n || n == 0) ? n : 2);
}

/*是否为字母数字*/
export function isAlphanumeric(value: string) {
  return /^[a-z0-9]+$/i.test(value);
}

/*验证车牌号*/
export function validateVehicleNo() {
  return new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/);
}

/*验证身份证*/
export function validateCardId() {
  return new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/);
}

/*验证手机号*/
export function validatePhone() {
  return new RegExp(/^(0|\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$/);
}

/**验证银行卡号 */
export function validateBankNo(bankno) {
  const lastNum = bankno.substr(bankno.length - 1, 1); // 取出最后一位（与luhm进行比较）
  const first15Num = bankno.substr(0, bankno.length - 1); // 前15或18位
  const newArr = new Array();
  for (let i = first15Num.length - 1; i > -1; i--) {    // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1));
  }
  const arrJiShu = new Array();  // 奇数位*2的积 <9
  const arrJiShu2 = new Array(); // 奇数位*2的积 >9
  const arrOuShu = new Array();  // 偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 === 1) {  // 奇数位
      // tslint:disable-next-line:radix
      if (parseInt(newArr[j]) * 2 < 9) {
        // tslint:disable-next-line:radix
        arrJiShu.push(parseInt(newArr[j]) * 2);
      } else {
        // tslint:disable-next-line:radix
        arrJiShu2.push(parseInt(newArr[j]) * 2);
      }
    } else {  // 偶数位
      arrOuShu.push(newArr[j]);
    }
  }
  const jishu_child1 = new Array(); // 奇数位*2 >9 的分割之后的数组个位数
  const jishu_child2 = new Array(); // 奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    // tslint:disable-next-line:radix
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
    // tslint:disable-next-line:radix
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
  }
  let sumJiShu = 0; // 奇数位*2 < 9 的数组之和
  let sumOuShu = 0; // 偶数位数组之和
  let sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0;
  for (let m = 0; m < arrJiShu.length; m++) {
    // tslint:disable-next-line:radix
    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    // tslint:disable-next-line:radix
    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
  }
  for (let p = 0; p < jishu_child1.length; p++) {
    // tslint:disable-next-line:radix
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
    // tslint:disable-next-line:radix
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
  }
  // 计算总和
  // tslint:disable-next-line:radix
  sumTotal = sumJiShu + sumOuShu + sumJiShuChild1 + sumJiShuChild2;
  // 计算Luhm值
  const k = sumTotal % 10 === 0 ? 10 : sumTotal % 10;
  const luhm = 10 - k;
  // tslint:disable-next-line:radix
  if (parseInt(lastNum) === luhm) {
    if (bankno.length < 16 || bankno.length > 19) {
      return {validate: true, error: true};
    } else {
      return {};
    }
  } else {
    return {validate: true, error: true};
  }
}

/*解析模板内容，赋值到模板参数*/
export function analysisString(value: string) {
  const reg = new RegExp(/\${[a-zA-Z_0-9]{1,}}/g);
  return value.match(reg);
}


/*消息完整性验证，false为填写完整*/
export function regParams(value: string, params) {
  value = value.replace(/\n/g, '');
  // 验证规则：当value和params的key数量相同，相等时验证通过。
  // value: 消息参数的string值；params:
  // reg验证value的json格式是否正确，防止转换时报错

  // const reg = new RegExp(/(^{)(("(\w+)"):("([^/"]*)"),)*(("(\w+)"):("([^/"]*)")(?:,|)}$)/);
  // if (!reg.test(value)) {
  //   return true;
  // }
  let valueArr = null;
  try {
    valueArr = JSON.parse(value); //判断是否是json
  } catch (e) {
    return true;
  }
  if (!valueArr) {
    return true;
  }
  const length = Object.keys(params).length;
  let num = 0;
  for (const i in valueArr) {
    if (valueArr[i] === '' || !valueArr[i]) {
      return true;
    } else {
      for (const b in params) {
        if (i === b) {
          num++;
        }
      }
    }
  }
  return num !== length;
}
