import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericDialogComponent } from '../../shared/components/generic/generic-dialog/generic-dialog.component';
import { AdditionalInfo, CustomerMasterObj, MembershipObj, PartyMasterLibraryService } from '.././../party-master-library.service';

@Component({
  selector: 'lib-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent {
  customerForm: FormGroup;
  mode:string="add";
  userSettings:any;


  constructor(private router: Router, private fb: FormBuilder,public dialog: MatDialog, public partyMasterService:PartyMasterLibraryService,private _activatedRoute: ActivatedRoute) {
    this.partyMasterService.customermasterObj.AdditionalInfo = <AdditionalInfo>{};
    this.userSettings =this.partyMasterService.userSettings;
    this.customerForm = this.fb.group({
      CustomerCode: ['', Validators.required],
      CustomerName: ['', Validators.required],
      Address: ['', Validators.required],
      VATNo: [''],
      Email: ['', Validators.required],
      Mobile: ['', Validators.required],
      Phone: [''],
      LedgerAc:[0]
    });
    if(this.userSettings.CompanyType == "B2B"){
      this.partyMasterService.customermasterObj.isCustomerLedger = 1;
      this.partyMasterService.customermasterObj.customerPartyAccount = <any>{};
    }
  }

  ngOnInit(){
    if (!!this._activatedRoute.snapshot.params['mode']) {
      if (this._activatedRoute.snapshot.params['mode'] === 'view') {
        this.mode = 'view';
        this.customerForm.disable();        
      }
      let acid = this._activatedRoute.snapshot.params['acid'];
      this.partyMasterService.getCustomerById('C',acid).subscribe((res:any) => {
        this.partyMasterService.customermasterObj = res.result;
        this.partyMasterService.customermasterObj.AdditionalInfo = res.result.additionalInfo;
      })
    }
  }




  selectedTab: number = 0;

  // Method to handle tab change
  onTabChange(index: number) {
    this.selectedTab = index;
  }


  submit() {
    if(this.partyMasterService.customermasterObj.customerName == "" || this.partyMasterService.customermasterObj.customerName == undefined || this.partyMasterService.customermasterObj.customerName == null){
      alert("Please Enter Customer Name.");
      return;
    }
    if(this.partyMasterService.customermasterObj.address == "" || this.partyMasterService.customermasterObj.address == undefined || this.partyMasterService.customermasterObj.address == null){
      alert("Please Enter Address.");
      return;
    }
    if((this.partyMasterService.customermasterObj.vatNo == "" || this.partyMasterService.customermasterObj.vatNo == undefined || this.partyMasterService.customermasterObj.vatNo == null) && this.userSettings.CompanyType == "B2B"){
      alert("Please Enter VAT No.");
      return;
    }else if(this.partyMasterService.customermasterObj.vatNo != "" && this.partyMasterService.customermasterObj.vatNo != undefined && this.partyMasterService.customermasterObj.vatNo != null && this.partyMasterService.customermasterObj.AdditionalInfo.isOverSeasCustomer == 0){
      if(this.partyMasterService.customermasterObj.vatNo.length == 9){
        alert("VAT no. must be of 9 digits.");
        return;
      }
    }
    if(this.partyMasterService.customermasterObj.mobile == "" || this.partyMasterService.customermasterObj.mobile == undefined || this.partyMasterService.customermasterObj.mobile == null){
      alert("Please Enter Mobile No.");
      return;
    }
    if(this.userSettings.SalesmanCompulsoryInPartyMaster == 1 && (this.partyMasterService.customermasterObj.AdditionalInfo.dealingSalesman == "" || this.partyMasterService.customermasterObj.AdditionalInfo.dealingSalesman == undefined || this.partyMasterService.customermasterObj.AdditionalInfo.dealingSalesman == null)){
      alert("Please Select Salesman.");
      return;
    }
    if(this.partyMasterService.customermasterObj.isCustomerLedger == 1){
      this.partyMasterService.customermasterObj.customerPartyAccount.type = "A";
      this.partyMasterService.customermasterObj.customerPartyAccount.parent = "PA";
      this.partyMasterService.customermasterObj.customerPartyAccount.pType = "C";
    }
    this.partyMasterService.customermasterObj.contactNo=this.partyMasterService.customermasterObj.phone;
    this.partyMasterService.saveCustomer(this.mode, this.partyMasterService.customermasterObj).subscribe((res:any) => {
      if(res.status == "ok"){
        this.partyMasterService.openSuccessDialog(res.result);
        this.partyMasterService.customermasterObj = <CustomerMasterObj>{};
        this.partyMasterService.customermasterObj.AdditionalInfo = <AdditionalInfo>{};
        this.router.navigate(['/customer']); 
      }else if(res.status == "error"){
        this.partyMasterService.openErrorDialog(res.result);
      }
    });

  }

  goBack() {
    this.router.navigate(['/customer']); // Navigate to the previous route
  }
}
