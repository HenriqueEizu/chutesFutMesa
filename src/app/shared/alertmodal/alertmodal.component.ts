import { Component, Input,OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal'

@Component({
  selector: 'cft-alert-modal',
  templateUrl: './alertmodal.component.html',
  styleUrls: ['./alertmodal.component.css']
})
export class AlertModalComponent implements OnInit {

  @Input() message: string;
  @Input() type : string;

  constructor(public bsModalRef:BsModalRef) { }

  ngOnInit(): void {
  }

  onClose(){
    this.bsModalRef.hide();
  }

}
