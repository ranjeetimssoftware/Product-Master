import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PartyMasterLibraryService } from '../../party-master-library.service';
import { Product } from '../../pages/ProductItem';
import { ProductMasterService } from '../../pages/Product-master.service';
import { MultiSelectGenericGridComponent, MultiSelectGenericPopUpSettings } from '../../shared/components/generic/multiselect-generic-grid/multiselect-generic-grid.component';


@Component({
  selector: 'lib-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.css'],
})
export class DetailInfoComponent implements OnInit {
  isDiscounted:number=0;
  userSetting:any;
  applyPipeInRate: boolean = true;
  mode:string = 'add';

  @ViewChild('DiscontinuedItem') DiscontinuedItem!: ElementRef;
  @Input() productObj: Product = <Product>{};

  @ViewChild("genericGridSupplierPopup") genericGridSupplierPopup!: MultiSelectGenericGridComponent;
  gridPopupSettingsForSupplier: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  @ViewChild("genericGridAccountLedger_Sales") genericGridAccountLedger_Sales!: MultiSelectGenericGridComponent;
  gridPopupSettingsForAccountLedgerList_Sales: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  @ViewChild("genericGridAccountLedger_SalesReturn") genericGridAccountLedger_SalesReturn!: MultiSelectGenericGridComponent;
  gridPopupSettingsForAccountLedgerList_SalesReturn: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  @ViewChild("genericGridAccountLedger_Purchase") genericGridAccountLedger_Purchase!: MultiSelectGenericGridComponent;
  gridPopupSettingsForAccountLedgerList_Purchase: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  @ViewChild("genericGridAccountLedger_PurchaseReturn") genericGridAccountLedger_PurchaseReturn!: MultiSelectGenericGridComponent;
  gridPopupSettingsForAccountLedgerList_PurchaseReturn: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  @ViewChild("genericMultiSelectItem") genericMultiSelectItem!: MultiSelectGenericGridComponent;
  gridPopupSettingsForItem: MultiSelectGenericPopUpSettings = new MultiSelectGenericPopUpSettings();
  MCatList: any[] = [];
  LocationList: any[] = [];
  MCat1List: any[] = [];
  KOTcatList: any[] = [];
  colorGroupList: any[] = [];


  constructor(private cdr: ChangeDetectorRef, private productMasterService:ProductMasterService) { 
    this.userSetting = this.productMasterService.userSetting;
  }

  ngOnInit(): void {
    if(this.mode == 'add'){
      if(this.userSetting.AutoCheckInExpiryDateInput == 1){
        this.productObj.REQEXPDATE = 1;
      }
    }
    this.getCategoryList();
    if(this.userSetting.EnableProductWiseAccMapping == 0) this.getSalesDetail();
    this.getKOTCategoryList();
    this.getColorGroupList();
    this.getLocationList();
  }


  onCheckOption(event: Event, targetObj: any, targetKey: string) {
    const input = event.target as HTMLInputElement;
    if (input) {
      targetObj[targetKey] = input.checked ? 1 : 0;
      this.cdr.detectChanges();
    } else {
      alert("Invalid input element");
    }
  }

  getCategoryList(){
    this.productMasterService.getMCatList().subscribe((res) => {
      this.MCatList = res;
      this.productObj.MCAT = this.MCatList[0].MENUCAT;
    });

    this.productMasterService.getMCat1List().subscribe((res) => {
      this.MCat1List = res;
    });
  }

  getLocationList(){
    this.productMasterService.getLocationList().subscribe((res: any) => {
      this.LocationList = res;
    });

  }

  getKOTCategoryList(){
    this.productMasterService.getKOTCategory().subscribe((res: any) => {
      if (res.status == 'ok') {
        this.KOTcatList = res.result;
      }
    });
  }

  getColorGroupList(){
    this.productMasterService.getColorGroup().subscribe(
      (response: any) => {
        const res = response;
        if (res && res['status'] === 'ok' && res.result !== null) {
          this.colorGroupList = res && res.result ? res.result : [];
        } else {
          this.colorGroupList = [];
        }
      },
      (err) => {
        this.colorGroupList = [];
      }
    );
  }

  onEnterSupplierCommand() {
    this.getCustomersList();
    this.genericGridSupplierPopup.show();
  }

  getCustomersList() {
    this.gridPopupSettingsForSupplier = {
      title: 'Supplier',
      apiEndpoints: `/getAccountPagedListByPType/PA/V/0`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'ACNAME',
          title: 'NAME',
          hidden: false,
          noSearch: false,
        },
        {
          key: 'VATNO',
          title: 'PAN NO.',
          hidden: false,
          noSearch: false,
        },
        {
          key: 'ADDRESS',
          title: 'ADDRESS',
          hidden: false,
          noSearch: false,
        },
      ],
    };
  }

  dblClickPopupParty(customer:any) {
    this.productObj.SUPCODE = customer.ACID;
    this.productObj.supplierName = customer.ACNAME;
  }

  getSalesDetail(){
    this.productMasterService.getSalesInfo().subscribe((data) => {
    const arrayData = Object.values(data);
    
    let salesAc = arrayData.filter(x => x.ACID == this.productMasterService.userSetting.SalesAc);
    this.productObj.SAC_ACNAME = salesAc[0].ACNAME;

    let salesReturnAc = arrayData.filter(x => x.ACID == this.productMasterService.userSetting.SalesReturnAc);
    this.productObj.SRAC_ACNAME = salesReturnAc[0].ACNAME;

    let purchaseAc = arrayData.filter(x => x.ACID == this.productMasterService.userSetting.PurchaseAc);
    this.productObj.PAC_ACNAME = purchaseAc[0].ACNAME;

    let purchaseReturnAc = arrayData.filter(x => x.ACID == this.productMasterService.userSetting.PurchaseReturnAc);
    this.productObj.PRAC_ACNAME = purchaseReturnAc[0].ACNAME;     
    })
  }
  SalesAccountEnterClicked() {
    this.gridPopupSettingsForAccountLedgerList_Sales = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/Product Master`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: 'ACID',
          title: 'AC CODE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'ACNAME',
          title: 'A/C NAME',
          hidden: false,
          noSearch: false
        },
      ]}
    this.genericGridAccountLedger_Sales.show();
  }

  dblClickSalesAccountSelect(account:any) {
    this.productObj.SAC = account.ACID;
    this.productObj.SAC_ACNAME = account.ACNAME;
  }

  
  SalesReturnAccountEnterClicked() {
    this.gridPopupSettingsForAccountLedgerList_SalesReturn = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Details/Product Master`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: 'ACID',
          title: 'AC CODE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'ACNAME',
          title: 'A/C NAME',
          hidden: false,
          noSearch: false
        },
      ]}
    this.genericGridAccountLedger_SalesReturn.show();
  }

  dblClickSalesReturnAccountSelect(account:any) {
    this.productObj.SRAC = account.ACID;
    this.productObj.SRAC_ACNAME = account.ACNAME;
  }

  
  PurchaseAccountEnterClicked() {
    this.gridPopupSettingsForAccountLedgerList_Purchase = {
      title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Master/Product Master`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACID',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
    }
    this.genericGridAccountLedger_Purchase.show();
  }

  dblClickPurchaseAccountSelect(account:any) {
    this.productObj.PAC = account.ACID;
    this.productObj.PAC_ACNAME = account.ACNAME;
  }

  
  PurchaseReturnAccountEnterClicked() {
    this.gridPopupSettingsForAccountLedgerList_PurchaseReturn = {
      title: "Accounts",
        apiEndpoints: `/getAccountPagedListByMapId/Master/Product Master`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'ACID',
            title: 'AC CODE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'A/C NAME',
            hidden: false,
            noSearch: false
          },
        ]
    }
    this.genericGridAccountLedger_PurchaseReturn.show();
  }

  dblClickPurchaseReturnAccountSelect(account:any) {
    this.productObj.PRAC = account.ACID;
    this.productObj.PRAC_ACNAME = account.ACNAME;
  }

  onEnterMasterItemList(){
    this.gridPopupSettingsForItem = {
      title: "Product List",
      apiEndpoints: `/getMenuitemWithStockPagedList/0/A/all/PI/w`,
      defaultFilterIndex: 0,
      showIsDefaultSelection: true,
      columns: [
        {
          key: "DESCA",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "MENUCODE",
          title: "PRODUCT CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "BASEUNIT",
          title: "UNIT",
          hidden: false,
          noSearch: false
        },
      ]
    }
    this.genericMultiSelectItem.show();
  }

  onSelectItem(value:any){
    this.productObj.SUPITEMCODE = value.MCODE;
    this.productObj.SUPITEMNAME = value.DESCA;
  }
  RecalculateVATAmount() {
    if (this.productObj.VAT == 1) {
      if (
        this.productObj.IN_RATE_A ||
        this.productObj.IN_RATE_A == 0 ||
        this.productObj.IN_RATE_A == null
      ) {
        let IN_Rate_A = (
          this.productObj.IN_RATE_A /
          this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate)
        ).toFixed(5);
        // this.productObj.RATE_A = Number(
        //   Number(IN_Rate_A).toFixed(2)
        // );
        this.productObj.RATE_A = Number(IN_Rate_A);
      }
      if (
        this.productObj.IN_RATE_B ||
        this.productObj.IN_RATE_B == 0 ||
        this.productObj.IN_RATE_B == null
      ) {
        let IN_Rate_B = (
          this.productObj.IN_RATE_B /
          this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate)
        ).toFixed(5);
        // this.productObj.RATE_B = Number(
        //   Number(IN_Rate_B).toFixed(2)
        // );
        this.productObj.RATE_B = Number(IN_Rate_B);
      }
      if (
        this.productObj.IN_RATE_C ||
        this.productObj.IN_RATE_C == 0 ||
        this.productObj.IN_RATE_C == null
      ) {
        this.productObj.IN_RATE_C =
          this.productObj.IN_RATE_C;
        let IN_Rate_C = (
          this.productObj.IN_RATE_C /
          this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate)
        ).toFixed(5);
        // this.productObj.RATE_C = Number(
        //   Number(IN_Rate_C).toFixed(2)
        // );
        this.productObj.RATE_C = Number(IN_Rate_C);
      }
    } else {
      if (
        this.productObj.IN_RATE_A ||
        this.productObj.IN_RATE_A == 0 ||
        this.productObj.IN_RATE_A == null
      ) {
        this.productObj.RATE_A =
          this.productObj.IN_RATE_A;
      }
      if (
        this.productObj.IN_RATE_B ||
        this.productObj.IN_RATE_B == 0 ||
        this.productObj.IN_RATE_B == null
      ) {
        this.productObj.RATE_B = this.productObj.IN_RATE_B;
      }
    }
  }

  RecalculateNonVATAmount_Ex_Prate_A() {
    if (this.productObj.VAT == 1) {
      if (
        this.productObj.PRATE_A ||
        this.productObj.PRATE_A == 0
      ) {
        this.productObj.PRATE_A = this.productObj.PRATE_A;
        let IN_PRATE_A = Number((
          this.productMasterService.nullToZeroConverter(
            this.productObj.PRATE_A
          ) * this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate)
        ).toFixed(5));
        // this.productObj.IN_PRATE_A = Number(
        //   Number(IN_PRATE_A).toFixed(2)
        // );
        this.productObj.IN_PRATE_A = Number(IN_PRATE_A);
      }
    } else {
      this.productObj.PRATE_A = this.productObj.PRATE_A;
    }
    this.productObj.CRATE=this.productObj.PRATE_A
  }


  RecalculateNonVATAmount_Ex_Rate_A() {
    if (this.productObj.VAT == 1) {
      if (
        this.productObj.RATE_A ||
        this.productObj.RATE_A == 0 ||
        this.productObj.RATE_A == null ||
        this.applyPipeInRate
      ) {
        let Rate_A =
          this.productMasterService.nullToZeroConverter(
            this.productObj.RATE_A
          ) * this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate);
        this.productObj.IN_RATE_A = Number(Rate_A);
      }
    } else {
      if (
        this.productObj.RATE_A ||
        this.productObj.RATE_A == 0 ||
        this.productObj.RATE_A == null
      ) {
        this.productObj.IN_RATE_A =
          this.productObj.RATE_A;
      }
    }
  }
  RecalculateNonVATAmount_Ex_Rate_B() {
    if (this.productObj.VAT == 1) {
      if (
        this.productObj.RATE_B ||
        this.productObj.RATE_B == 0 ||
        this.productObj.RATE_B == null
      ) {
        let RATE_B = (
          this.productMasterService.nullToZeroConverter(
            this.productObj.RATE_B
          ) * this.productMasterService.nullToZeroConverter(this.userSetting.VatConRate)
        ).toFixed(5);
        this.productObj.IN_RATE_B = Number(RATE_B);
      }
    } else {
      if (
        this.productObj.RATE_B ||
        this.productObj.RATE_B == 0 ||
        this.productObj.RATE_B == null
      ) {
        this.productObj.IN_RATE_B =
          this.productObj.RATE_B;
      }
    }
  }

  preventInput($event:any) {
    $event.preventDefault();
    return false;
  }

  



  ngAfterViewInit() {
  }


}
