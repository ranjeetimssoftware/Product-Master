import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SpinnerService } from "../spinner.service";

@Component({
  selector: "spinner",
  templateUrl: "spinner.component.html"
})
export class SpinnerComponent implements OnInit, OnDestroy {
  public subscription: Subscription; 
  @ViewChild("spinnerModal") spinnerModal: ModalDirective; 

  displayMessage: string = "";
  isLoading: boolean = false;

  constructor(public spinnerService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.spinnerService.getSpinnerShowHide().subscribe(state => { 
        this.displayMessage = state.text;
        this.isLoading = state.isLoading;
        if(this.isLoading) this.show()
        else this.hide();
    }); 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  show() {
    try {
      this.spinnerModal.show(); 
    } catch (ex) {
    } 
  } 

  hide() {
    try {
      this.spinnerModal.hide(); 
    } catch (ex) {
    }
  }
}
