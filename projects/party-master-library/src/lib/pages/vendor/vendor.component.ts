import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyMasterLibraryService } from '../../party-master-library.service';

@Component({
  selector: 'lib-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  constructor(private router: Router, private partyMasterService: PartyMasterLibraryService) { }

  ngOnInit(): void {
  }

  onView(event:any){
    this.router.navigate([this.router.url+"/new-vendor",{acid:event, mode:'view',returnUrl: this.router.url}])
  }
  onEdit(event:any){
    this.router.navigate([this.router.url+"/new-vendor",{acid:event, mode:'edit',returnUrl: this.router.url}])
  }
}
