import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import {Usuario,GrupoUsuario} from '../usuario.model'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable, EMPTY, Subject, of} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
registerLocaleData(localeBR, "br");
import {UsuarioService} from '../usuario.service'
import { delay, map, tap, filter, take, switchMap } from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
import { AlertModalComponent } from 'src/app/shared/alertmodal/alertmodal.component';

export enum AlertTypes{
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Component({
  selector: 'cft-usuario-inicial',
  templateUrl: './usuario-inicial.component.html',
  styleUrls: ['./usuario-inicial.component.css']
})
export class UsuarioInicialComponent implements OnInit {

  confirmResult : Subject<boolean>;
  gruposUsuarios: GrupoUsuario[];
  blnExisteLogin : boolean;
  usuarioLocal : Usuario;
  usuarioForm: FormGroup
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  numberPattern = /^[1-9]*$/
  message: String;
  usuarioExiste : Observable<Usuario>;
  usuarioCarregado : Usuario;
  usuario : any;
  myDate = new Date();

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
      US_USLOGIN: this.formBuilder.control(null,[Validators.required, Validators.minLength(6)],[this.ValidaLogin.bind(this)]),
      US_USSENHA: this.formBuilder.control(null, [Validators.required, Validators.minLength(6)]),
      US_USSENHA_CONFIRMA: this.formBuilder.control(null,[Validators.required, Validators.minLength(6)]),
      US_USNOMETRATAMENTO: this.formBuilder.control(null,[Validators.required, Validators.minLength(5)]),
      US_CLID: [1],
      US_USEMAIL: this.formBuilder.control(null,[Validators.required, Validators.pattern(this.emailPattern)],[this.ValidaEmail.bind(this)]),
      US_USATIVO: [true],
      US_GUID: [1],
    },{validator:UsuarioInicialComponent.equalsTo})
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


  Verificalogin(Login:string, Login2 :string = "login"){
    return this.usuarioService.VerificaLogin().pipe(
      delay(3000),
      map((dados: {usuarios : any[]}) => dados.usuarios),
      tap(console.log),
      map((dados: {login : string}[]) => dados.filter(v => v.login.toUpperCase() === Login.toUpperCase() && v.login.toUpperCase() != Login2.toUpperCase())),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }

  ValidaLogin(formControl : FormControl)
  {
    return this.Verificalogin(formControl.value, this.usuario.US_USLOGIN != null ? this.usuario.US_USLOGIN : "").pipe(
      tap(console.log),
      map(loginExiste => loginExiste ? {loginInvalido: true} : null )
    );
  }

  VerificaEmail(Email:string, Email2:string = "email"){
    return this.usuarioService.VerificaLogin().pipe(
      delay(3000),
      map((dados: {usuarios : any[]}) => dados.usuarios),
      tap(console.log),
      map((dados: {email : string}[]) => dados.filter(v => v.email.toUpperCase() === Email.toUpperCase() && v.email.toUpperCase() != Email2.toUpperCase())),
      tap(console.log ),
      map(dados => dados.length > 0),
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


  static equalsTo(group: AbstractControl):{[key:string]: boolean}{
    const senha = group.get('US_USSENHA')
    const senhaConfirmacao = group.get('US_USSENHA_CONFIRMA')
    if (!senha || !senhaConfirmacao){
      return undefined
    }
    if (senha.value !== senhaConfirmacao.value){
      return {senhaNoMatch:true}
    }
    return undefined
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


  SalvarUsuario(usuario: Usuario){
     
    usuario.US_USDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    usuario.US_USLOGIN = usuario.US_USLOGIN.trim();
    usuario.US_USNOMETRATAMENTO = usuario.US_USNOMETRATAMENTO.trim();
    usuario.US_USSENHA = usuario.US_USSENHA.trim();
    usuario.US_GUID = 4; // jogador usuario
    
    this.usuarioService.SalvarUsuario(usuario).subscribe(
        success => {
                    this.showAlertSuccess("Jogador inserido com sucesso");
                    this.onClose();
                    this.router.navigate(['login'])
                    },
        error =>  {
                  this.showAlertDanger("Erro ao inserir Jogador") ;
                  this.onClose();
                  this.router.navigate(['login'])
                  }
      )
  }



}
