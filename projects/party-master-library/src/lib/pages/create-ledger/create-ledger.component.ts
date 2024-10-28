import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdditionalInfo, CustomerMasterObj, PartyMasterLibraryService } from '../../party-master-library.service';

export interface Branch {
  sn: number;
  branch: string;
}

const ELEMENT_DATA: Branch[] = [
  {
    sn: 1,
    branch: 'Branch Name 1',
  },
  {
    sn: 2,
    branch: 'Branch Name 2',
  },
  {
    sn: 3,
    branch: 'Branch Name 3',
  },
  {
    sn: 3,
    branch: 'Branch Name 3',
  },
  {
    sn: 3,
    branch: 'Branch Name 3',
  },
  {
    sn: 3,
    branch: 'Branch Name 3',
  },
];


@Component({
  selector: 'lib-create-ledger',
  templateUrl: './create-ledger.component.html',
  styleUrls: ['./create-ledger.component.css'],
})
export class CreateLedgerComponent {
  mode:string="add";
  userSettings:any;
  isOpen: boolean = false;
  displayedColumns: string[] = [];
  branchDataSource = ELEMENT_DATA;
  selectedAccount: string | null = null;
  [key: string]: any; // Add this line

 
  menuData = [
    { label: 'Fixed Assets' },
    {
      label: 'Current Assets',
      children: [
        {
          label: 'Cash & Bank',
          children: [{ label: 'Cash' }, { label: 'Bank' }],
        },
        {
          label: 'Bills Receiveable',
          children: [{ label: 'Bills' }, { label: 'Receive' }],
        },
      ],
    },
  ];

  ledgerForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder,public partyMasterService:PartyMasterLibraryService) {
    this.partyMasterService.customermasterObj.AdditionalInfo = <AdditionalInfo>{};
    this.partyMasterService.customermasterObj.customerPartyAccount = <any>{};
    this.partyMasterService.getAllsettings().subscribe((res:any) => {
      if(res.status == "ok")
      this.userSettings = JSON.parse(res.result);
    })
    this.ledgerForm = this.fb.group({
      AccountCode: ['', Validators.required],
      AccountType: ['', Validators.required],
      AccountName: ['', Validators.required],
      ParentGroup: ['', Validators.required],
      Category: ['', Validators.required],
      CreditLimit: ['', Validators.required],
      Tds: ['', Validators.required],
      ActivityType: ['', Validators.required],
      HasSubLedger: ['', Validators.required],
      AllBranches: ['', Validators.required],
    });

    this.displayedColumns = ['sn', 'branch', 'action'];
  }

  getSubMenu(item: any): any {
    return this[`menu_${item.name.replace(/\s+/g, '_')}`];
  }

  openDialog() {
    this.isOpen = true;
  }

  save() {
    this.isOpen = false; // Method to close the pop-up
  }

  close() {
    this.isOpen = false; // Method to close the pop-up
  }

  onSelectParent(event:any){
    this.partyMasterService.customermasterObj.customerPartyAccount.parent = event.label;
  }

  submit() {
    if(this.partyMasterService.customermasterObj.customerCode == "" || this.partyMasterService.customermasterObj.customerCode == undefined || this.partyMasterService.customermasterObj.customerCode == null){
      alert("Please Enter Account Code.");
      return;
    }if(this.partyMasterService.customermasterObj.customerName == "" || this.partyMasterService.customermasterObj.customerName == undefined || this.partyMasterService.customermasterObj.customerName == null){
      alert("Please Enter Account Name.");
      return;
    }
    if(this.partyMasterService.customermasterObj.customerPartyAccount.acType == "" || this.partyMasterService.customermasterObj.customerPartyAccount.acType == undefined || this.partyMasterService.customermasterObj.customerPartyAccount.acType == null){
      alert("Please Select Account Type.");
      return;
    }
    this.partyMasterService.customermasterObj.customerPartyAccount.type = "A";
    this.partyMasterService.customermasterObj.customerPartyAccount.pType = "";
    this.partyMasterService.customermasterObj.customerPartyAccount.mapId = this.partyMasterService.customermasterObj.customerPartyAccount.category;
    this.partyMasterService.customermasterObj.contactNo=this.partyMasterService.customermasterObj.phone
    this.partyMasterService.saveCustomer(this.mode, this.partyMasterService.customermasterObj).subscribe((res:any) => {
      if(res.status == "ok"){
        this.partyMasterService.openSuccessDialog(res.result);
        this.partyMasterService.customermasterObj = <CustomerMasterObj>{};
        this.partyMasterService.customermasterObj.AdditionalInfo = <AdditionalInfo>{};
        this.router.navigate(['/general-ledger']);
      }else if(res.status == "error"){
        this.partyMasterService.openErrorDialog(res.result);
      }
    });
  }

  goBack() {
    this.router.navigate(['/general-ledger']); // Navigate to the previous route
  }
}
