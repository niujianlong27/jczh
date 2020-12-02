import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '@service/common.service';
import {urls} from '@model/url';
import {Goods_Allocation_Url} from '@model/goodsAllocation-url';
import {contractUrl} from '../../../../common/model/contractUrl';
import {ENgxPrintComponent} from '@component/e-ngx-print';
import set = Reflect.set;

@Component({
  selector: 'app-bill-of-lading',
  templateUrl: './bill-of-lading.component.html',
  styleUrls: ['./bill-of-lading.component.css']
})
export class BillOfLadingComponent implements OnInit {
  mapOfExpandData: { [loadTaskId: string]: boolean } = {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true,9:true,10:true,11:true,12:true,13:true,14:true,15:true,16:true,17:true,18:true,19:true,20:true };
  salesman:any={}; //业务员
  findSetBuyCompany:any = {formId:'form_billofloding',gridId:'grid2',name:'购货单位',parameter:'customerName',url:'getmanCode',parameterSend:'cusType'};//购货单位的findSet
  findSetitemid:any  = {formId:'form_billofloding',gridId:'grid3',name:'物资代码',parameter:'itemId',url:'getitemid'}
  popFindSet:any = {formId:'form_billofloding',gridId:'grid6',param:[['productId','itemId'],['fLoc','locid'],['material','gh00']],findUrl:'getReverseData'}
  menCode:any ;  //购货单位
  menCodeId:any;
  salesmanArr:any =[]
  dataSet:any=[];
  inputModalModel:any
  inputModalModel1:any
  selfTableHeight:any;
  fWhsArr:any=[]
  specArr:any = []
  @ViewChild('fWhs') fWhs:ElementRef;
  @ViewChild('itemId') itemId:ElementRef;

  visibleUpdate:boolean = false;//是否显示调整弹窗
  validateForm1:FormGroup
  updateData:any = {};
  open:boolean = false
  loadTaskIdArr:any=[];   // 所有车次列表
  loadTaskIdFlag:boolean = false
  loadTaskId:any
  mainIndex:any;
  itemIndex:any;
  singleWeight:any   //单根重量
  singleRootNumber:any  //单件根数
  isShow:boolean = false
  shareBillingVisible:boolean = false; //拼单弹窗是否显示
  shareBillingArr:any =[];  //拼单列表数据
  totalPage:any
  gridOneHeight:any = '300px'
  checkDate:any =[];
  statusArr:any =[];
  statusArr1:any=[];
  // carArr:any=[{"returned":0,"dateStartSuffix":" 00:00:00","dateEndSuffix":" 23:59:59","rowid":0,"loadTaskId":"lt_5df264b220a011ea95b9","weight":"1695","items":[{"returned":0,"dateStartSuffix":" 00:00:00","dateEndSuffix":" 23:59:59","rowid":0,"deliveryNo":"ds_5df2619220a011ea95b9","weight":"1695","product_type":"螺旋焊管","spec":"273X6.0X12000","item_id":"0C1273*6.0*12000","f_whs":"lxk","f_loc":"n","material":"Q235B","quantity":"2","free_pcs":"2","delivery_no":"ds_5df2619220a011ea95b9","total_pcs":"4","delivery_item_no":"di_5df2628220a011ea95b9","itemStatus":"true","productType":"螺旋焊管","itemId":"0C1273*6.0*12000","fWhs":"lxk","fLoc":"n","freePcs":"2","gbgzl":"423.76",'gsPer':'1'}],"delivery_no":"ds_5df2619220a011ea95b9","batch_no":"ba_5df25f6c20a011ea95b9","total_pcs":"4","totalPcs":"4","load_task_id":"lt_5df264b220a011ea95b9"}] ; //开单推荐得到的数组
    carArr:any =[]
  carArrs:any={}
  menCodeRefreshUrl:any = contractUrl.refreshMenCode;
  itemIdRefreshUrl:any = contractUrl.refreshItemId;
  weight:number= 0;
    totalWeight:number = 0
  saveLoading:boolean  = false
  truckWeight = 33
  selectedIndex = 0
  showHead:boolean = false;
  buyCompanyParam:any={};
  itemIdParam:any={};
  deliveryNoArr:any = []
  isOpeningRecommendation:boolean = false;
  @ViewChild('print1') printComponent1: ENgxPrintComponent;
  print:any =[]
  printVisible:boolean = false;
  remark:string='';
  totalWeight1:any = 0
  totalPrice:any =0
  tabs:any =[{title:'综合推荐'},{title:'重量优先'},{title:'规格优先'}]
  type:any
  similarGroupsRD:any=['热镀','热度','热镀1'];
  similarGroupsHG:any=['焊管','焊管 ','焊管1'];
  constructor(
    private nzModal: NzModalService,
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private xlsx: XlsxService,
    private nzMess: NzMessageService,
    private info: UserinfoService,
    private router: Router,
    private cm: CommonService,
    private elRef: ElementRef,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.deliveryNoArr = [];
    this.http.post(Goods_Allocation_Url.getSaleMan,{}).then(res=>{
      console.log(res)
      if(res.success){
        this.salesmanArr = res.data&&res.data.data||[];
        if(JSON.parse(sessionStorage.getItem('abcd') || '').status === 'FHZT00'){
          this.route.queryParams.subscribe(x => {
            let a:any = JSON.parse(x.state)
            this.dataSet = a.item;
            a.item.forEach(x=>{
              this.deliveryNoArr.push(x.deliveryNo)
            })
            console.log( JSON.parse(x.state));
            this.salesmanArr.forEach(item=>{
              if(item.orgId===a.main.orgid&&item.manCode===a.main.salesmanId){
                this.salesman = item;
              }
            })
            this.inputModalModel = a.main.custname;
            this.menCode = a.main.custname;
            this.menCodeId = a.main.customerId;
            this.remark = a.main.remark;
            this.truckWeight = a.main.truckWeight
          });
          this.dataSet.forEach(item=>{
            item.inputModalModel1 = item.itemId
            item.singleRootNumber = item.gsPer;
            item.singleWeight = item. gbgzl;
            item.totalPrice = (this.isNotANumber(Number(item.weight))/1000)*this.isNotANumber(Number(item.unitPrice))

          })
          this.totalWeight1 = Number((((this.dataSet.map(item => item.weight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));
          this.totalPrice = this.dataSet.map(item=>item.totalPrice).reduce((acc,cur)=>this.isNotANumber(Number(acc))+this.isNotANumber(Number(cur)),0).toFixed(3)

        }
      }
    })
    this.http.post(Goods_Allocation_Url.getCustomerId,{}).then(res=>{
      console.log(res)
      if(res.success){
        this.fWhsArr = res.data&&res.data.data||[];
      }
    })
    this.validateForm1 = this.fb.group({
      loadTaskId: [null],
      itemId: [null],
      newloadTaskId: [null],
      quantity: [null],
      freePcs: [null],
      weight: [null],
    });
    this.getStatic(this.statusArr,'FHZT');
    console.log(JSON.parse(sessionStorage.getItem('abcd') ))
    this.dataSet.push({})
      console.log(this.dataSet)
  }

  searchList(data:any){

  }


  btnClick(data){
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
        case 'DirectOrder':
          this.btnDirectOrder();
          break;
      case 'OpeningRecommendation':
        this.btnOpeningRecommendation();
        break;
      case 'Reserved':
        this.btnReserved();
        break;
      default:
        break;
    }
  }

  btnAdd(){
    if(this.dataSet.length===0){
      this.dataSet.push({checked:true});
    }else{
      this.dataSet.push({fWhs:this.dataSet[this.dataSet.length-1].fWhs,checked:true})
    }
    this.dataSet = [...this.dataSet];
  }

  btnDirectOrder(){

    if(JSON.stringify(this.salesman) == "{}"){
      this.nz.error('提示信息','请选择业务员')
      return;
    }
    if(this.menCode==undefined){
      this.nz.error('提示信息','请选择购货单位')
      return;
    }
    if(this.dataSet.length<=0){
      this.nz.error('提示信息','请至少添加一条数据');
      return;
    }
    if(this.truckWeight.toString()===""){
      this.nz.error('提示信息','请输入车辆载重')
      return;
    }
    if(this.isInputData()){
      this.nz.error('提示信息','请给每一条数据填写正确的信息');
      return;
    }
    if(this.canOperate(this.dataSet,'weight',[0],'物资代码重量未维护,请刷新物资代码！')){
      return;
    }
    let flag = false;
    for(let i =0;i<this.dataSet.length;i++){
      for(let j = i+1 ;j<this.dataSet.length;j++){
        if(this.dataSet[i].itemId===this.dataSet[j].itemId&&this.dataSet[i].fLoc===this.dataSet[j].fLoc&&this.dataSet[i].material===this.dataSet[j].material){
          flag = true;
        }
      }
    }
    if(flag){
      this.nz.error('提示信息','请去除重复的物资代码')
      return;
    }

    let url :any = Goods_Allocation_Url.directOrder ;
    let param :any ={};
    param. salesmanModel = this.salesman;
    param. customerName = this.menCode;
    param.customerId = this.menCodeId;
    param.truckWeight = this.truckWeight
    param.tgaDeliveryItems = this.dataSet
    param.status = 'FHZT10'
    param.remark = this.remark;
    param.stringList = this.deliveryNoArr;
    if(this.deliveryNoArr.length!==0){
      param.statusName = 'true'
    }
    this.http.post(url,param).then(res=>{
      if(res.success){
        console.log(res)
        this.nz.create('success','提示信息',`提货单开单成功,提货单号为${res.data.data.toString()}`,{nzDuration: 3000})
        this.dataSet=[];
        this.carArr=[];
        let arr :any =[]
        res.data.data.forEach(item=>{
          arr.push({deliveryNo:item});
        })
        this.getPrintData({tgaDeliverySheets:arr});
      }
    })
  }

  isInputData(){
    let flag :boolean = false;
    this.dataSet.forEach(item=>{
      if(!item.itemId){
        flag = true
      }
      if(item.quantity<=0&&item.freePcs<=0){
        flag = true
      }
    })
    return flag
  }


  btnOpeningRecommendation(){
    if(JSON.stringify(this.salesman) == "{}"){
      this.nz.error('提示信息','请选择业务员')
      return;
    }
    if(this.menCode==undefined){
      this.nz.error('提示信息','请选择购货单位')
      return;
    }
    if(this.truckWeight.toString()===""){
      this.nz.error('提示信息','请输入车辆载重')
      return;
    }
    if(this.dataSet.length<=0){
      this.nz.error('提示信息','请至少添加一条数据');
      return;
    }
    if(this.isInputData()){
      this.nz.error('提示信息','请给每一条数据填写正确的信息');
      return;
    }
    if(this.canOperate(this.dataSet,'weight',[0],'物资代码重量未维护,请刷新物资代码！')){
      return;
    }
    let flag = false;
    for(let i =0;i<this.dataSet.length;i++){
      for(let j = i+1 ;j<this.dataSet.length;j++){
        if(this.dataSet[i].itemId===this.dataSet[j].itemId&&this.dataSet[i].fLoc===this.dataSet[j].fLoc&&this.dataSet[i].material===this.dataSet[j].material){
  flag = true;
        }
      }
    }
    if(flag){
      this.nz.error('提示信息','请去除重复的物资代码')
      return;
    }
    this.isOpeningRecommendation = true

    let url = Goods_Allocation_Url.recommendOrder
    let param :any = {items:[]};
    param.items = this.dataSet;
    param.salesman = this.salesman.manCode
    param.customerId = this.menCodeId
    param.truckWeight = this.truckWeight
    this.http.post(url,param).then(res=>{
      console.log(res)
      if(res.success){
        if(res.data.data.length<=0){
          this.nz.warning('提示信息','无推荐结果请直接开单！');
          return;
        }
        this.isShow = true;
        this.carArrs = res.data.data
        this.selectedIndex = 0
        this.carArr = res.data.data.recommend_first;
        this.carArr .forEach(data=>{
          data.statusArr = this.statusArr
          data.status = 'FHZT10'
          data.remark = this.remark
          data.selfTableHeight = `${41*data.items.length}px`
          data.items.forEach(item=>{
            item.editstate = 1;
          })
        })
        console.log(this.carArr)
      }
    })
  }

  /*
  * 拼车按钮
  */
  btnCarpooling(data:any){
    if(this.carArr[data].status === 'FHZT00'){
      this.nz.warning('提示信息','预留状态车次不可拼单')
      return;
    }
    this.mainIndex = data;
      let url = Goods_Allocation_Url.spellOrder
      let param :any = {items:[]}
    param.items = this.carArr[data].items
      param.customerId = this.menCodeId
    param.stringList = this.deliveryNoArr

    this.http.post(url,param).then(res=>{
        console.log(res)
        if(res.success){
          this.shareBillingArr = res.data&&res.data.data ||[];
          this.shareBillingVisible = true
          this.totalPage = res.data.data.length;
          this.shareBillingArr .forEach(item=>{
            if(item.remark){
              item.checked = true;
            }
          })
          this.checkDate = this.shareBillingArr .filter(x=>x.checked);
          this.weight = Number(((this.checkDate.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))/1000).toFixed(3));
          this.totalWeight = Number((((this.checkDate.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))+Number(this.carArr[this.mainIndex].weight))/1000).toFixed(3));
        }
      })
  }

  colName1(data:any){
    let fWhs = data.filter(x => x.colEname === 'fWhs')
    fWhs[0].tdTemplate = this.fWhs;
    let itemId = data.filter(x => x.colEname === 'itemId')
    itemId[0].tdTemplate = this.itemId;
  }

  getBuyCompany(data:any){
    console.log(data)
    this.menCode = data.selData&&data.selData[0].cusType||'';
    this.menCodeId = data.selData&&data.selData[0].custId||'';
    this.inputModalModel = data&&data.inpValue||'';
    console.log(this.inputModalModel)
    this.salesmanArr.forEach(item=>{
      if(data.selData[0].manode===item.manCode){
        this.salesman = item;
      }
    })
  }

  getitemid(data:any,data1:any){
    console.log(data)
    let arr:any=[]
    data.selData.forEach(item=>{
      this.dataSet.push({fWhs:data1.fWhs,itemId:item.itemId,
        fLoc:item.locid,material:item.gh00,inputModalModel1:item.itemId,singleWeight:item.gbgzl,
          singleRootNumber:item.gsPer,spec:item.spec,cName:item.cName,quantity:null,freePcs:null,weight:null})
    })
    this.dataSet.splice(this.dataSet.indexOf(data1),1)
    this.dataSet = [...this.dataSet]
    this.totalWeight1 = Number((((this.dataSet.map(item => item.weight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));
    this.totalPrice = this.dataSet.map(item=>item.totalPrice).reduce((acc,cur)=>this.isNotANumber(Number(acc))+this.isNotANumber(Number(cur)),0).toFixed(3)
    setTimeout(()=>{
      let arr1 =[]
      this.elRef.nativeElement.querySelectorAll('input.ant-input').forEach(item=>{
        arr1.push(item)
      })
      //document.activeElement
      console.log(document.activeElement)
      console.log(this.elRef.nativeElement.querySelectorAll('input.ant-input'))
      console.log(arr.indexOf(document.activeElement))
      arr1[arr1.indexOf(document.activeElement)+2].focus();
    },500)

    // data1.itemId = data.selData[0]&& data.selData[0].itemId||'';
    // data1.fLoc = data.selData[0]&& data.selData[0].locid||'';
    // data1.material = data.selData[0]&& data.selData[0].gh00||'';
    // data1.inputModalModel1 = data.selData[0]&& data.selData[0].itemId||'';
    // data1.singleWeight = data.selData[0]&&data.selData[0].gbgzl||0;
    // data1.singleRootNumber = data.selData[0]&&data.selData[0].gsPer||0;
    // data1.spec = data.selData[0]&& data.selData[0].spec||'';
    // data1.cName = data.selData[0]&& data.selData[0].cName||'';
    // data1.quantity = null;
    // data1.weight = null;
    // data1.freePcs = null;
  //locid   gh00
  }
  //
  // modelChange(data:any){
  //   console.log(data)
  // }
  inputModalModelChange(data:any){
    console.log(data)
    this.inputModalModel = data
  }

  deleteItem(data:any,data1:any,data2:any){
    console.log(data)
    console.log(data1)
    let arr:any = []
    let arr2:any=[]
    arr = this.carArr[data1].items
    if(data2.deliveryNo===undefined||data2.itemStatus){
      arr.splice(arr.indexOf(data2),1)
    }else{
      arr.forEach(item=>{
        if(item.deliveryNo!==undefined){
          if(item.deliveryNo ===data2.deliveryNo){
            arr2.push(item);
          }
        }
      })
      arr2.forEach(item=>{
        arr.splice(arr.indexOf(item),1);
      })
    }

    this.carArr[data1].items =[...arr];
    if(this.carArr[data1].items.length<=0){
      this.carArr.splice(data1,1)
    }
    this.carArr.forEach(item=>{
      if(item.items.filter(x=>x.itemStatus==false).length>0){
        item.statusArr = this.statusArr1;
      }else{
        item.statusArr = this.statusArr
      }
    })
    this.tableModelChange1({})
    console.log(this.carArr)
    this.tableHeightChange();
    this.carArr = [...this.carArr]
  }


  updateItem(data:any,data1:any){
    this.loadTaskIdArr=[]
    this.loadTaskIdFlag = true
    this.carArr.forEach(items=>{
      if(Number(items.loadTaskId)!==Number(this.carArr[data1].loadTaskId)){
        this.loadTaskIdArr.push({loadTaskId:Number(items.loadTaskId)})
      }
    })
    this.loadTaskIdArr.push({loadTaskId:'新车次'});
    this.mainIndex = data1;
    this.itemIndex = data;
    this.updateData = this.carArr[data1];
    console.log(this.carArr[data1])
    this.visibleUpdate = true;
    this.validateForm1.get('loadTaskId').setValue(this.updateData.loadTaskId);
    this.validateForm1.get('itemId').setValue(this.updateData.items[data].itemId);
    this.validateForm1.get('quantity').setValue(this.updateData.items[data].quantity);
    this.validateForm1.get('freePcs').setValue(this.updateData.items[data].freePcs);
    this.validateForm1.get('weight').setValue(this.updateData.items[data].weight);
  }

  canOperate(list:Array<any>,option:string,statusArr:Array<any>,tipInfo:string):boolean{
    let flag = false;
    list.forEach((item) => {
      if(statusArr.indexOf(item[option]) >= 0){
        flag = true;
      }
    });
    if(flag){
      this.nz.warning('提示信息',tipInfo)
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag
  }

  /*
  * 调整弹窗取消
  */
  handleCancel(){
    this.visibleUpdate = false
    this.loadTaskId = undefined;
  }

  /*
  *  调整弹窗确定
  */
  handleOk() {
    if(!this.loadTaskId){
      this.nz.warning('提示信息','请选择车次号');
      return;
    }
    if(this.validateForm1.get('quantity').value>this.carArr[this.mainIndex].items[this.itemIndex].quantity||this.validateForm1.get('freePcs').value>this.carArr[this.mainIndex].items[this.itemIndex].freePcs){
      this.nz.warning('提示信息','调整件数和调整根数不可大于原有的件数和根数')
      return;
    }

    let arr1: any = [];
    this.carArr.forEach(items=>{
      arr1.push(Number(items.loadTaskId))
    })


    if (arr1.indexOf(this.loadTaskId) >= 0) {
      this.carArr.forEach(item1=>{
        if(item1.loadTaskId==this.loadTaskId){
          item1.items.forEach(item2=>{
            if(this.validateForm1.get('itemId').value===item2.itemId&&this.carArr[this.mainIndex].items[this.itemIndex].fLoc===item2.fLoc&&this.carArr[this.mainIndex].items[this.itemIndex].material===item2.material){
              item2.quantity= Number(item2.quantity) + Number(this.validateForm1.get('quantity').value);
              item2.freePcs=Number(item2.freePcs) + Number(this.validateForm1.get('freePcs').value);
              item2.weight= Number(item2.weight) + Number(this.validateForm1.get('weight').value);
            }
          })
          if(item1.items.filter(x=>x.itemId!=this.validateForm1.get('itemId').value||this.carArr[this.mainIndex].items[this.itemIndex].fLoc!==x.fLoc||this.carArr[this.mainIndex].items[this.itemIndex].material!==x.material).length==item1.items.length){
            if(item1.items.filter(x=>x.itemId.substring(0,2)===this.validateForm1.get('itemId').value.substring(0,2)).length>0){
              console.log(item1.items.filter(x=>x.cName===this.carArr[this.mainIndex].items[this.itemIndex].cName))
              item1.items.push({
                deliveryNo:item1.items.filter(x=>x.itemId.substring(0,2)===this.validateForm1.get('itemId').value.substring(0,2))[0].deliveryNo,
                fWhs: this.carArr[this.mainIndex].items[this.itemIndex].fWhs,
                itemId: this.validateForm1.get('itemId').value,
                cName: this.carArr[this.mainIndex].items[this.itemIndex].cName,
                spec: this.carArr[this.mainIndex].items[this.itemIndex].spec,
                fLoc: this.carArr[this.mainIndex].items[this.itemIndex].fLoc,
                material: this.carArr[this.mainIndex].items[this.itemIndex].material,
                quantity: this.validateForm1.get('quantity').value,
                freePcs: this.validateForm1.get('freePcs').value,
                weight: this.validateForm1.get('weight').value,
                itemStatus:this.carArr[this.mainIndex].items[this.itemIndex].itemStatus,
                gbgzl:this.carArr[this.mainIndex].items[this.itemIndex].gbgzl,
                gsPer:this.carArr[this.mainIndex].items[this.itemIndex].gsPer,
              })
            }else{
              let arr3:any=[]
              item1.items.forEach(item2=>{
                arr3.push(Number(item2.deliveryNo.slice(-1)))
              })
              item1.items.push({
                deliveryNo:item1.items[0].deliveryNo.slice(0,item1.items[0].deliveryNo.length-1)+(Math.max.apply(null,arr3)+1).toString(),
                fWhs: this.carArr[this.mainIndex].items[this.itemIndex].fWhs,
                itemId: this.validateForm1.get('itemId').value,
                cName: this.carArr[this.mainIndex].items[this.itemIndex].cName,
                spec: this.carArr[this.mainIndex].items[this.itemIndex].spec,
                fLoc: this.carArr[this.mainIndex].items[this.itemIndex].fLoc,
                material: this.carArr[this.mainIndex].items[this.itemIndex].material,
                quantity: this.validateForm1.get('quantity').value,
                freePcs: this.validateForm1.get('freePcs').value,
                weight: this.validateForm1.get('weight').value,
                itemStatus:this.carArr[this.mainIndex].items[this.itemIndex].itemStatus,
                gbgzl:this.carArr[this.mainIndex].items[this.itemIndex].gbgzl,
                gsPer:this.carArr[this.mainIndex].items[this.itemIndex].gsPer,
              })
            }

          }

        }
      })
      if (Number(this.validateForm1.get('quantity').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity) && Number(this.validateForm1.get('freePcs').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs) && Number(this.validateForm1.get('weight').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].weight)) {
        let arr: any = []
        arr.push(this.carArr[this.mainIndex].items);
        arr.splice(this.itemIndex, 1)
        this.carArr[this.mainIndex].items.splice(this.itemIndex, 1)
        if( this.carArr[this.mainIndex].items.length<=0){
          this.carArr.splice(this.mainIndex,1)
        }
      }else{
        if (Number(this.validateForm1.get('quantity').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity)) {
          this.carArr[this.mainIndex].items[this.itemIndex].quantity = Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity) - Number(this.validateForm1.get('quantity').value);
        }
        if (Number(this.validateForm1.get('freePcs').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs)) {
          this.carArr[this.mainIndex].items[this.itemIndex].freePcs = Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs) - Number(this.validateForm1.get('freePcs').value);

        }
        if (Number(this.validateForm1.get('weight').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].weight)) {
          this.carArr[this.mainIndex].items[this.itemIndex].weight = Number(this.carArr[this.mainIndex].items[this.itemIndex].weight) - Number(this.validateForm1.get('weight').value);
        }
      }






          console.log(this.carArr)
          this.tableModelChange1({})
      this.tableHeightChange();
          this.carArr.forEach(item=>{
            item.items = [...item.items]
          })



    } else {
      let object: any = {}
      object.loadTaskId = Math.max.apply(null,arr1)+1;
      object.weight = this.validateForm1.get('weight').value;

      object.totalPcs = Number((Number(this.validateForm1.get('quantity').value) * Number(this.carArr[this.mainIndex].items[this.itemIndex].gsPer) + Number(this.validateForm1.get('freePcs').value)));;  //有问题  缺字段 后续补充
      object.statusArr = this.carArr[this.mainIndex].statusArr;
      object.status = 'FHZT10';
      object.items = [];
      let object1: any = {}
      object1.deliveryNo = `提货单${object.loadTaskId}-1`
      object1.fWhs = this.carArr[this.mainIndex].items[this.itemIndex].fWhs;
      object1.itemId = this.carArr[this.mainIndex].items[this.itemIndex].itemId;
      object1.cName = this.carArr[this.mainIndex].items[this.itemIndex].cName;
      object1.spec = this.carArr[this.mainIndex].items[this.itemIndex].spec;
      object1.fLoc = this.carArr[this.mainIndex].items[this.itemIndex].fLoc;
      object1.material = this.carArr[this.mainIndex].items[this.itemIndex].material;
      object1.quantity = this.validateForm1.get('quantity').value;
      object1.freePcs = this.validateForm1.get('freePcs').value
      object1.weight = this.validateForm1.get('weight').value;
      object1.itemStatus=this.carArr[this.mainIndex].items[this.itemIndex].itemStatus,
        object1.gbgzl=this.carArr[this.mainIndex].items[this.itemIndex].gbgzl,
        object1.gsPer=this.carArr[this.mainIndex].items[this.itemIndex].gsPer,
        object.items .push(object1);
      this.carArr .push(object);
      if (Number(this.validateForm1.get('quantity').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity) && Number(this.validateForm1.get('freePcs').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs) && Number(this.validateForm1.get('weight').value) === Number(this.carArr[this.mainIndex].items[this.itemIndex].weight)) {
        let arr: any = []
        arr.push(this.carArr[this.mainIndex].items);
        arr.splice(this.itemIndex, 1)
        this.carArr[this.mainIndex].items.splice(this.itemIndex, 1)
        if( this.carArr[this.mainIndex].items.length<=0){
          this.carArr.splice(this.mainIndex,1)
        }
      }else{
        if (Number(this.validateForm1.get('quantity').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity)) {
          this.carArr[this.mainIndex].items[this.itemIndex].quantity = Number(this.carArr[this.mainIndex].items[this.itemIndex].quantity) - Number(this.validateForm1.get('quantity').value);
        }
        if (Number(this.validateForm1.get('freePcs').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs)) {
          this.carArr[this.mainIndex].items[this.itemIndex].freePcs = Number(this.carArr[this.mainIndex].items[this.itemIndex].freePcs) - Number(this.validateForm1.get('freePcs').value);

        }
        if (Number(this.validateForm1.get('weight').value) <= Number(this.carArr[this.mainIndex].items[this.itemIndex].weight)) {
          this.carArr[this.mainIndex].items[this.itemIndex].weight = Number(this.carArr[this.mainIndex].items[this.itemIndex].weight) - Number(this.validateForm1.get('weight').value);
        }
      }

      this.tableModelChange1({})
      this.tableHeightChange();
      this.carArr.forEach(item=>{
        item.items = [...item.items]
      })
    }
    this.carArr.forEach(item=>{
      if(item.items.filter(x=>x.itemStatus==false).length>0){
        item.statusArr = this.statusArr1;
      }else{
        item.statusArr = this.statusArr
      }
    })
    this.visibleUpdate = false
    this.loadTaskId = undefined;
  }
  open1(){
    this.open  = true
  }

  /*
  *   选择新车次
  */
  modelChange(data:any){
    if(!this.loadTaskIdFlag){
      return;
    }
    this.loadTaskId = data
    this.loadTaskIdFlag = false
  }

  /*
  *   表格修改件数根数
  */
  tableModelChange(data:any){
    console.log(data)
    if(data.header.colEname==='freePcs'){
      if(Number(data.val)>=Number(data.data.singleRootNumber)){
        data.data.quantity = Number(data.data.quantity) + Math.floor(Number(Number(data.val)/Number(data.data.singleRootNumber)));
        data.data.freePcs = Number(data.val)%Number(data.data.singleRootNumber)
      }
    }
    this.dataSet[data.index].weight = (this.isNotANumber(Number(data.data.quantity))*this.isNotANumber(Number(data.data.singleRootNumber))+this.isNotANumber(Number(data.data.freePcs)))*this.isNotANumber(Number(data.data.singleWeight));
    this.dataSet[data.index].totalPcs = Number(data.data.quantity)*Number(data.data.singleRootNumber)+this.isNotANumber(Number(data.data.freePcs))
    this.totalWeight1 = Number((((this.dataSet.map(item => item.weight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));
    this.dataSet[data.index].totalPrice = (this.isNotANumber(Number(data.data.weight))/1000)*this.isNotANumber(Number(data.data.unitPrice))
    this.totalPrice = this.dataSet.map(item=>item.totalPrice).reduce((acc,cur)=>this.isNotANumber(Number(acc))+this.isNotANumber(Number(cur)),0).toFixed(3)
  }


  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

  /*
  *
  */
  sheetModelChange(index:any,index1:any,data:any){
    this.carArr[index1].weight = 0;
    this.carArr[index1].totalPcs = 0;
    this.carArr[index1].item.forEach(item=>{
      item.weight = (data*item.gsPer+item.freePcs)*item.gbgzl;
      this.carArr[index1].weight = 0;
      this.carArr[index1].weight += item.weight;
      this.carArr[index1].totalPcs += data*item.gsPer+item.freePcs
    })
  }

  shareDataResult(data:any){
    data.forEach(item=>{
      this.shareBillingArr.forEach(item1=>{
        if(item.deliveryNo === item1.deliveryNo){
          item1.checked = true;
        }
      })
    })
    this.checkDate = this.shareBillingArr.filter(x=>x.checked);
    console.log(this.checkDate)
    this.weight = Number(((this.checkDate.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))/1000).toFixed(3));
    this.totalWeight = Number((((this.checkDate.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))+Number(this.carArr[this.mainIndex].weight))/1000).toFixed(3));

  }

  doShareBilling(){
    this.checkDate.forEach(item=>{
      item.itemStatus = false
      item.editstate = 0;
      let object1: any = {}
      object1.deliveryNo = item .deliveryNo
      object1.fWhs = item.fWhs;
      object1.itemId = item.itemId;
      object1.cName = item.productName;
      object1.spec = item.spec;
      object1.fLoc = item.fLoc;
      object1.material = item.material;
      object1.quantity = item.quantity;
      object1.freePcs =  item.freePcs
      object1.weight =  item.weight;
      object1.itemStatus=item.itemStatus,
        object1.gbgzl=item.gbgzl,
        object1.gsPer=item.gsPer,
        object1.editstate = 0;
      this.carArr[this.mainIndex].items .push(object1)
    })
    this.carArr[this.mainIndex].statusArr= this.statusArr1
    this.tableModelChange1({})
    this.tableHeightChange();
    this.carArr[this.mainIndex].items = [...this.carArr[this.mainIndex].items]
    this.shareBillingVisible = false
  }


  doShareCancel(){
    this.shareBillingVisible = false
  }


  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data.filter(x=>x.value2==='1'));
          this.statusArr1 = data.filter(x=>x.value!=='FHZT00'&&x.value2==='1');
        }
        console.log(this.statusArr1)
      }
    );
  }


  saveClick(){
    let flag:boolean = false;
    this.carArr.forEach(item=>{
      item.items.forEach(item1=>{
        if(item1.weight==0){
          flag = true;
        }
      })
    })
    if(flag){
      this.nz.warning('提示信息','件数和散根数不能同时为空')
      return;
    }
    this.saveLoading = true;
    let url = Goods_Allocation_Url.saveOrder;
    let param:any = {};
    param.tgaDeliverySheets = this.carArr;
    param.type = this.type
    param.truckWeight = this.truckWeight
    param.tgaDeliverySheets.forEach(item=>{
      item.totalPcs = 0
      item.items.forEach(item1=>{
          item1.totalPcs = this.isNotANumber(Number(item1.quantity))*this.isNotANumber(Number(item1.gsPer))+this.isNotANumber(Number(item1.freePcs))
          item1.total_pcs = item1.totalPcs;
          item.totalPcs+=item1.totalPcs
      })
      item.total_pcs = item.totalPcs
    })
    param. salesmanModel = this.salesman;
    param.customerId = this.menCodeId;
    param.stringList = this.deliveryNoArr;
    if(this.deliveryNoArr.length!==0){
      param.statusName = 'true'
    }
    this.http.post(url,param).then(res=>{
      console.log(res)
      if(res.success){
        this.isOpeningRecommendation = false
        this.nz.create('success','提示信息',res.data.msg,{nzDuration: 3000})
        this.isShow = false;
        this.dataSet = [];
        this.totalWeight1 = 0
        this.totalPrice = 0
        let arr:any =[]
        res.data.data.forEach(item=>{
          arr.push({deliveryNo:item});
        })
        this.carArr.forEach(item=>{
          item.items.forEach(item1=>{
            if(item1.deliveryNo.indexOf('提货单')<0){
              arr.push({deliveryNo:item1.deliveryNo})
            }
          })
        })
        if(arr.length>0){
          this.getPrintData({tgaDeliverySheets:arr});
        }
      }
      document.getElementsByClassName('content ps ps--active-y')[0].scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.saveLoading = false;
    })
  }

  freePcsModelChange(index:any,index1:any,data:any){
    this.carArr[index1].weight = 0;
    this.carArr[index1].totalPcs = 0;
    this.carArr[index1].item.forEach(item=>{
      item.weight = (item.quantity*item.gsPer+data)*item.gbgzl;
      this.carArr[index1].weight = 0;
      this.carArr[index1].weight += item.weight;
      this.carArr[index1].totalPcs += item.quantity*item.gsPer+data
    })
  }

  /*
  *  当改变业务员时制空购货公司
  */
  salesManModelChange(data:any){
    console.log(data)
    if(data !==null){

      this.buyCompanyParam.manode = data.manCode;
    }
    this.inputModalModel = undefined
    this.menCodeId = undefined;
    this.menCode = undefined;
  }
  delete(data:any,index:any){
    this.dataSet.splice(index,1);

    this.dataSet = [...this.dataSet]
    this.totalWeight1 = Number((((this.dataSet.map(item => item.weight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));
    this.totalPrice = this.dataSet.map(item=>item.totalPrice).reduce((acc,cur)=>this.isNotANumber(Number(acc))+this.isNotANumber(Number(cur)),0).toFixed(3)

  }

  /*
  *  调整界面修改件数
  */
  quantityModelChange(data:any){
    this.validateForm1.get('weight').setValue(Number((Number(data) * Number(this.carArr[this.mainIndex].items[this.itemIndex].gsPer) + Number(this.validateForm1.get('freePcs').value)) * Number(this.carArr[this.mainIndex].items[this.itemIndex].gbgzl)))
  }

  /*
  *  调整界面修改根数
  */
  freePcstzModelChange(data:any){
    this.validateForm1.get('weight').setValue(Number((Number(this.validateForm1.get('quantity').value) * Number(this.carArr[this.mainIndex].items[this.itemIndex].gsPer) + Number(data)) * Number(this.carArr[this.mainIndex].items[this.itemIndex].gbgzl)))
}

  tableModelChange1(data:any){
    console.log(this.carArr)
    this.carArr.forEach(item1=>{
      item1.weight = 0;
      item1.totalPcs = 0;
      item1.items.forEach(item=>{

        item.weight = Number(((Number(item.quantity)*Number(item.gsPer)+Number(item.freePcs))*Number(item.gbgzl)).toFixed(0));
        item1.weight += Number(item.weight);
        item1.totalPcs += Number(item.quantity)*Number(item.gsPer)+Number(item.freePcs)
      })
    })
      this.carArr=[...this.carArr]
    // this.dataSet[data.index].weight = (this.isNotANumber(Number(data.data.quantity))*this.singleRootNumber+this.isNotANumber(Number(data.data.freePcs)))*this.singleWeight
  }


  /*
*打印完成
 */
  printComplete() {
    this.showHead = false
    console.log('打印完成！');
    this.print=[]
  }

  /*
  * 打印
   */

  customPrint() {
    this.showHead = true

      const printHTML: HTMLElement = document.getElementById('document1')
      console.log(this.elRef.nativeElement.childNodes)
    console.log(document.getElementById('document1'))
      this.printComponent1.print(printHTML);


  }


  /*
  *   打印数据获取
  */
  getPrintData(data:any){
    this.http.post(Goods_Allocation_Url.selectItem,data).then(res=>{
      if(res.success){
        console.log(res)
        data.tgaDeliverySheets.forEach(item=>{
          let test1 :any = {};
          test1.deliveryNo = item.deliveryNo;
          test1.currentTime = new Date().toLocaleDateString();
          test1.menCodeId = this.menCodeId;
          test1.menCode = this.menCode;
          test1.kaipiaorenPrint = this.info.APPINFO.USER.name;
          test1.yewukePrint = this. salesman.maName.split('-')[1];
          test1.yewuyuanPrint = this. salesman.maName.split('-')[0];
          test1.items=[]
          test1.page = 0
          test1.totalPage = 0;
          this.print.push(test1);
        })
        res.data.data.forEach((item,index)=>{
          this.print.forEach(item1=>{
            if(item.deliveryNo === item1.deliveryNo){
              item1.remark = item.remark;
              item.no = item.deliveryItemNo
              item1.items.push(item);
            }
          })
        })
        console.log(this.print)
        this.print.forEach(item=>{
          item.totalQuantity =item.items.map(item1 => item1.quantity).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0);
          item.totalPcs =item.items.map(item1 => item1.freePcs).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0);
        })
        let print1:any=[]
        this.print.forEach(item=>{
          for(let i = 0;i<Number(Math.floor(item.items.length/9+1));i++){
            let items = this.deepClone(item)
            items.items = this.deepClone(item.items.slice(i*9,(i+1)*9))
            items.page = i+1;
            items.totalPage = Number(Math.floor(item.items.length/9+1));
            print1.push(items);
          }
        })
        console.log(print1)
        this.print = print1

        this.printVisible = true;
      }

    })
  }

  /*
  * 打印确定
  */

  modalConfirmResult(data:any){
    if(data.type=='ok'){
      this.customPrint();
      this.printVisible = false
    }else{
      this.printVisible = false
    }
  }

  /*
  * 预留接口
  */
  btnReserved(){
    if(JSON.stringify(this.salesman) == "{}"){
      this.nz.error('提示信息','请选择业务员')
      return;
    }
    if(this.menCode==undefined){
      this.nz.error('提示信息','请选择购货单位')
      return;
    }
    if(this.truckWeight.toString()===""){
      this.nz.error('提示信息','请输入车辆载重')
      return;
    }
    if(this.dataSet.length<=0){
      this.nz.error('提示信息','请至少添加一条数据');
      return;
    }
    if(this.isInputData()){
      this.nz.error('提示信息','请给每一条数据填写正确的信息');
      return;
    }
    if(this.canOperate(this.dataSet,'weight',[0],'物资代码重量未维护,请刷新物资代码！')){
      return;
    }
    let flag = false;
    for(let i =0;i<this.dataSet.length;i++){
      for(let j = i+1 ;j<this.dataSet.length;j++){
        if(this.dataSet[i].itemId===this.dataSet[j].itemId&&this.dataSet[i].fLoc===this.dataSet[j].fLoc&&this.dataSet[i].material===this.dataSet[j].material){
          flag = true;
        }
      }
    }
    if(flag){
      this.nz.error('提示信息','请去除重复的物资代码')
      return;
    }

    let url :any = Goods_Allocation_Url.directOrder ;
    let param :any ={};
    param. salesmanModel = this.salesman;
    param. customerName = this.menCode;
    param.customerId = this.menCodeId;
    param.tgaDeliveryItems = this.dataSet
    param.status = 'FHZT00'
    param.remark = this.remark
    param.stringList = this.deliveryNoArr;
    if(this.deliveryNoArr.length!==0){
      param.statusName = 'true'
    }
    this.http.post(url,param).then(res=>{
      if(res.success){
        console.log(res)
        console.log(res.data.data.toString())
        this.nz.create('success','提示信息',`提货单预留成功,提货单号为${res.data.data.toString()}`,{nzDuration: 3000})
        this.dataSet=[];
      }
    })
  }

  fWhsChange(data:any){
    this.itemIdParam.defwhs = data.fWhs;
    data.itemId = undefined;
    data.inputModalModel1 = undefined;
    data.spec = undefined;
    data.cName = undefined;
    data.fLoc = undefined;
    data.material = undefined;
    data.quantity = undefined;
    data.freePcs = undefined;
    data.weight = undefined;
    this.totalWeight1 = Number((((this.dataSet.map(item => item.weight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));
    this.totalPrice = this.dataSet.map(item=>item.totalPrice).reduce((acc,cur)=>this.isNotANumber(Number(acc))+this.isNotANumber(Number(cur)),0).toFixed(3)

  }

  tableHeightChange(){
    this.carArr.forEach(item=>{
      item.selfTableHeight = `${41*item.items.length}px`
    })
  }


  listClick(data:any){
    console.log(data)
    if(data.checked){
      data.checked = false;
    }else{
      data.checked = true;
    }
    this.shareDataResult(this.shareBillingArr.filter(x=>x.checked));
  }

  deepClone(data: any = {}) {
    if (typeof data !== 'object' || data == null) {
      //  obj是null ，或者不是对象和数组  直接返回
      return data;
    }

    //  初始化返回结果
    let result;
    if (data instanceof Array) {
      result = [];
    } else {
      result = {};
    }
    for (const key in data) {
      //  保证key不是原型的属性
      if (data.hasOwnProperty(key)) {
        // 递归调用
        result[key] = this.deepClone(data[key]);
      }
    }
    //  返回结果
    return result;
  }

  keyboard(data:any){
    console.log(data)
    console.log(this.dataSet)

    if(this.isOpeningRecommendation){
      return;
    }
    if(data.keyboardData.code==='ArrowDown'){
      if(this.dataSet.indexOf(data.tableData)===this.dataSet.length-1){
        this.btnAdd()
        setTimeout(()=>{
          let arr =[]
          this.elRef.nativeElement.querySelectorAll('input.ant-input').forEach(item=>{
            arr.push(item)
          })
          console.log(this.elRef.nativeElement.querySelectorAll('input.ant-input'))
          arr[arr.length- 4].focus();
        },500)
      }else{
        let arr =[]
        this.elRef.nativeElement.querySelectorAll('input.ant-input').forEach(item=>{
          arr.push(item)
        })
    //document.activeElement
        console.log(document.activeElement)
        console.log(this.elRef.nativeElement.querySelectorAll('input.ant-input'))
        console.log(arr.indexOf(document.activeElement))
        arr[arr.indexOf(document.activeElement)+4].focus();
      }
    }
    // if(data.code==='ArrowDown'){
    //   this.btnAdd()
    // }
  }

  nzSelectChange(data:any){
    console.log(data)
    if(data.index===0){
      this.carArr = this.carArrs.recommend_first
      this.type = 'recommend_first'
      this.carArr .forEach(data=>{
        data.statusArr = this.statusArr
        data.status = 'FHZT10'
        data.remark = this.remark
        data.selfTableHeight = `${41*data.items.length}px`
        data.items.forEach(item=>{
          item.editstate = 1;
        })
      })
    }else if(data.index === 1){
      this.carArr = this.carArrs.weight_first
      this.type = 'weight_first'
      this.carArr .forEach(data=>{
        data.statusArr = this.statusArr
        data.status = 'FHZT10'
        data.remark = this.remark
        data.selfTableHeight = `${41*data.items.length}px`
        data.items.forEach(item=>{
          item.editstate = 1;
        })
      })
    }else {
      this.carArr = this.carArrs.spec_first
      this.type = 'spec_first'
      this.carArr .forEach(data=>{
        data.statusArr = this.statusArr
        data.status = 'FHZT10'
        data.remark = this.remark
        data.selfTableHeight = `${41*data.items.length}px`
        data.items.forEach(item=>{
          item.editstate = 1;
        })
      })
    }
  }
}
