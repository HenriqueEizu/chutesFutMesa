import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms'
import {UsuarioService} from '../usuario/usuario.service'
import {Usuario} from '../usuario/usuario.model'
import {Router} from '@angular/router'
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import {AlertModalService} from '../shared/alertmodal/alertmodal.service'
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';


@Component({
  selector: 'cft-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  usuarioLocal : Usuario;
  message: String;
  faAddressBook = faAddressBook;
  bdModalRef: BsModalRef;


  constructor(private usuarioService: UsuarioService
              
              , private formBuilder : FormBuilder
              ,private alertService: AlertModalService){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      US_USLOGIN: this.formBuilder.control('',[Validators.required, Validators.minLength(6)]),
      US_USSENHA: this.formBuilder.control('',[Validators.required, Validators.minLength(6)])
    })
  }

  VerificaUsuario(usuario: Usuario){
      this.usuarioService.VerificaUsuario(usuario)
        .subscribe((usuarioLocal: Usuario) => {
          this.usuarioLocal = usuarioLocal
          if (this.usuarioLocal == undefined || this.usuarioLocal == null){
            this.handlerError();
            // this.message = "Login ou Senha não conferem"
            this.loginForm.reset();
          }
        });
  } 
handlerError(){
  this.alertService.showAlertDanger("Login ou senha incorreta")
}

}
