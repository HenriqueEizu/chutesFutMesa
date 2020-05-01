import { Component, OnInit, Input } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs';

@Component({
  selector: 'cft-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  @Input() titulo : string;
  @Input() corpo : string;
  @Input() btnCancelar = 'Cancelar' ;
  @Input() btnAcao = 'Salvar';

  confirmResult : Subject<boolean>;

  constructor(public bsModalRef:BsModalRef) { }

  ngOnInit(){
    this.confirmResult = new Subject();
  }

  onClose(){
    this.confirmAndClose(false);
  }

  onConfirm(){
    this.confirmAndClose(true);
  }
  private confirmAndClose(value: boolean){
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
