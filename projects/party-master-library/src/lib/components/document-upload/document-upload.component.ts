import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PartyMasterLibraryService } from '../../party-master-library.service';


@Component({
  selector: 'lib-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {
  documentName: any;
  fileToUpload!: any;
  filesNames:any[]=[];
  documentUpload : any[]=[];
  @ViewChild("fileSelect") fileSelect!: ElementRef;
  @Input() documentUploadList!:any[];

  constructor(private partyMasterService:PartyMasterLibraryService) { 
    this.partyMasterService.customermasterObj.documentUpload = this.documentUpload;
  }

  ngOnInit(): void {
    // if(this.dataSource.data[this.dataSource.data.length-1].Document != ''){
    //   ELEMENT_DATA.push(this.newRow);
    //   this.dataSource.data = [...ELEMENT_DATA];
    // }
  }
  displayedColumns: string[] = [
    'sn',
    'Document',
    'action'
  ];

  ngAfterViewInit() {
  }

  fileUpload(event:Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      this.fileToUpload = input.files[0];
      this.documentName = input.files[0].name;
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append("DocumentHeading", this.documentName);
    formData.append("file", this.fileToUpload);
    formData.append("TenantId",'' );
    this.filesNames.push(this.documentName);
    this.documentUpload.push({documentExtenstion :this.fileToUpload.type, documentHeading :this.documentName, acid:'', path:''});
    this.partyMasterService.uploadDocument(formData).subscribe(
      (res: any) => {
        if (res.status == "ok") {
          this.partyMasterService.openSuccessDialog("Uploaded Successfully.");
            this.fileToUpload = undefined;
            this.fileSelect.nativeElement.value = null;
        }
        else if (res.status == "error")
        {
          this.partyMasterService.openErrorDialog(res.status);

        }        
      },error => {
        console.log("error",error.message);
      }
    )
    this.fileToUpload = undefined;
    this.fileSelect.nativeElement.value = null;
  }


}
