import { Component, ViewChild } from '@angular/core';
import { PartyMasterLibraryService } from '../../party-master-library.service';
import { CustomerVendor, GenericTableComponent } from '../../shared/components/generic/generic-table/generic-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  constructor(public partyMasterService:PartyMasterLibraryService,private router: Router){
  }
  showPopup = false;
  showCustomizeColumnsPopup = false;
  customerData:CustomerVendor[]=[];

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  // Method to open the popup
  openCustomizeColumnsPopup() {
    this.showCustomizeColumnsPopup = true;
  }

  // Method to close the popup
  closeCustomizeColumnsPopup() {
    this.showCustomizeColumnsPopup = false;
  }

  onView(event:any){
    this.router.navigate(["../new-customer",{acid:event, mode:'view',returnUrl: this.router.url}])
  }

  // Method to handle save action
  saveChanges() {
    console.log('Popup Save clicked!');
    this.closeCustomizeColumnsPopup(); // Close the popup after saving
  }
}
