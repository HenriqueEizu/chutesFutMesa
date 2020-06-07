import { Component, OnInit } from '@angular/core'
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import {Observable, EMPTY, Subject, of} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import { delay, map, tap, filter, take, switchMap } from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'

import { AlertModalComponent } from 'src/app/shared/alertmodal/alertmodal.component';
import {Usuario} from '../usuario.model'
import {UsuarioService} from '../usuario.service'


export enum AlertTypes{
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Component({
  selector: 'cft-reset-senha',
  templateUrl: './reset-senha.component.html',
  styleUrls: ['./reset-senha.component.css']
})
export class ResetSenhaComponent implements OnInit {

  confirmResult : Subject<boolean>;
  usuarioForm: FormGroup
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  usuario : any;

  constructor(private usuarioService: UsuarioService
    , private router: Router
    , private formBuilder : FormBuilder
    ,private route: ActivatedRoute
    ,public bsModalRef:BsModalRef
    ,private modalService: BsModalService){
   
     }

     ngOnInit(): void {
      this.confirmResult = new Subject();
      this.usuario = this.UsuarioNulo();
      this.usuarioForm = this.formBuilder.group({
        US_USEMAIL: this.formBuilder.control(null,[Validators.required, Validators.pattern(this.emailPattern)],[this.ValidaEmail.bind(this)]),
      })
    }
  
    UsuarioNulo(){
      return of ({
        US_USID: null,
        US_USLOGIN: null,
        US_USSENHA: null,
        US_USATIVO: null,
        US_USNOMETRATAMENTO: null,
        US_CLID: null,
        OBJ_CLUBE : null,
        US_GUID : null,
        OBJ_GRUPOUSUARIO : null,
        US_USEMAIL : null,
        US_USDATACADASTRO : null
    
    });
  }
  
   
  
    onClose(){
      this.confirmAndClose(false);
    }
  
    private confirmAndClose(value: boolean){
      this.confirmResult.next(value);
      this.bsModalRef.hide();
    }
  
    VerificaEmail(Email:string, Email2:string = "email"){
      return this.usuarioService.VerificaLogin().pipe(
        delay(3000),
        map((dados: {usuarios : any[]}) => dados.usuarios),
        tap(console.log),
        map((dados: {email : string}[]) => dados.filter(v => v.email.toUpperCase() === Email.toUpperCase() && v.email.toUpperCase() != Email2.toUpperCase())),
        tap(console.log ),
        map(dados => dados.length == 0),
        tap(console.log)
      )
    }
  
    ValidaEmail(formControl : FormControl)
    {
      return this.VerificaEmail(formControl.value, this.usuario.US_USEMAIL != null ? this.usuario.US_USEMAIL : "").pipe(
        tap(console.log),
        map(emailExiste => emailExiste ? {emailInvalido: true} : null )
      );
    }
  
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
  
  
    EnviarEmail(usuario: Usuario){

      this.usuarioService.EnviarEmail(usuario.US_USEMAIL).subscribe(
          success => {
                      this.showAlertSuccess("Email enviado com sucesso");
                      this.onClose();
                      this.router.navigate(['login'])
                      },
          error =>  {
                    this.showAlertDanger("Erro ao enviar email. Tente novamente.") ;
                    this.onClose();
                    this.router.navigate(['login'])
                    }
        )
    }

}
