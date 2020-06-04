import { ResetSenhaComponent } from './../../usuario/reset-senha/reset-senha.component';
import { UsuarioInicialComponent } from './../../usuario/usuario-inicial/usuario-inicial.component';
import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalComponent} from './alertmodal.component'
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
// import { ConfirmModalComponent} from '../confirm-modal/confirm-modal.component'

export enum AlertTypes{
  DANGER = 'danger',
  SUCCESS = 'success'
}


@Injectable({
  providedIn: 'root'
})
export class AlertModalService { 

  constructor(private modalService: BsModalService) { }

  private showAlert(message: string, type: AlertTypes){
    const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = type;
    bsModalRef.content.message = message
  }

  showAlertDanger(message: string){
    this.showAlert(message, AlertTypes.DANGER);
  }

  showAlertSuccess(message: string){
    this.showAlert(message, AlertTypes.SUCCESS);
  }

  showConfirm(titulo: string,corpo :string, btnCancelar? :string, btnAcao? :string){
    const bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent);
    bsModalRef.content.titulo = titulo;
    bsModalRef.content.corpo = corpo;
    if (btnCancelar){
      bsModalRef.content.btnCancelar = btnCancelar;
    }
    if (btnAcao){
      bsModalRef.content.btnAcao = btnAcao;
    }

    return (<ConfirmModalComponent>bsModalRef.content).confirmResult;
  }

  Cadastrousuario(){
    const bsModalRef: BsModalRef = this.modalService.show(UsuarioInicialComponent);
    return (<UsuarioInicialComponent>bsModalRef.content).confirmResult;
  }

  ResetSenha(){
    const bsModalRef: BsModalRef = this.modalService.show(ResetSenhaComponent);
    return (<ResetSenhaComponent>bsModalRef.content).confirmResult;
  }
}
