
import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import {Usuario,GrupoUsuario} from './usuario.model'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable, EMPTY} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");

import { Clube } from '../clube/clube.model';
import {UsuarioService} from './usuario.service'
import { ClubeService } from './../clube/clube.service';
import { delay, map, tap, filter, take, switchMap } from 'rxjs/operators';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';


@Component({
  selector: 'cft-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, IFormCanDeactivate {

  gruposUsuarios: GrupoUsuario[];
  clubes: Clube[];
  blnExisteLogin : boolean;
  usuarioLocal : Usuario;
  usuarioForm: FormGroup
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  numberPattern = /^[1-9]*$/
  message: String;
  usuarioExiste : Observable<Usuario>;
  usuarioCarregado : Usuario;
  usuario : any;

  constructor(private usuarioService: UsuarioService
               , private clubeService: ClubeService
               , private router: Router
               , private formBuilder : FormBuilder
               ,private route: ActivatedRoute
               ,private alertService: AlertModalService){

                }
  podeDesativar() {
    return true;
  }

  // pipe = new DatePipe('pt-BR'); // Use your own locale
  myDate = new Date();


  ngOnInit(): void {

    this.usuarioService.GetAllGrupoUsuario().subscribe((gruposUsuarios : GrupoUsuario[]) => {
      this.gruposUsuarios = gruposUsuarios;
    });

    this.clubeService.GetAllClube().subscribe((cls : Clube[]) =>{
      this.clubes = cls;
    })

    this.usuario = this.route.snapshot.data['usuario'];

    this.usuarioLocal = this.usuario;

    this.route.params.subscribe((params:any) => {
      console.log(params);
      this.usuarioCarregado = params['usuario']
    });


    this.usuarioForm = this.formBuilder.group({
      US_USID: [this.usuario.US_USID],
      US_USLOGIN: this.formBuilder.control(this.usuario.US_USLOGIN,[Validators.required, Validators.minLength(6)],[this.ValidaLogin.bind(this)]),
      US_USSENHA: this.formBuilder.control(this.usuario.US_USSENHA, [Validators.required, Validators.minLength(6)]),
      US_USSENHA_CONFIRMA: this.formBuilder.control(this.usuario.US_USSENHA,[Validators.required, Validators.minLength(6)]),
      US_USNOMETRATAMENTO: this.formBuilder.control(this.usuario.US_USNOMETRATAMENTO,[Validators.required, Validators.minLength(5)]),
      US_CLID: this.formBuilder.control(this.usuario.US_CLID,[Validators.required, Validators.pattern(this.numberPattern)]),
      US_USEMAIL: this.formBuilder.control(this.usuario.US_USEMAIL,[Validators.required, Validators.pattern(this.emailPattern)],[this.ValidaEmail.bind(this)]),
      US_USATIVO: this.formBuilder.control(this.usuario.US_USATIVO),
      US_GUID: this.formBuilder.control(this.usuario.US_GUID,[Validators.required]),
    },{validator:UsuarioComponent.equalsTo})
  }

  Verificalogin(Login:string, Login2:string = "login"){
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
    return this.Verificalogin(formControl.value, this.usuario.US_USLOGIN).pipe(
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
    return this.VerificaEmail(formControl.value, this.usuario.US_USEMAIL).pipe(
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
 
  SalvarUsuario(usuario: Usuario){
    let msgSuccess = "Usuário inserido com sucesso";
    let msgErro = "Erro ao incluir usuário. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir este usuário?"
    let msgBotao = "Inserir"
    if (this.usuarioForm.value.US_USID != null){
      msgSuccess = "Usuário alterado com sucesso";
      msgErro = "Erro ao atualizar usuário. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar este usuário?"
      msgBotao = "Alterar"
      if (this.usuario.US_USSENHA == usuario.US_USSENHA) { usuario.US_USSENHA = null}
    }
    
    usuario.US_USDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.usuarioService.SalvarUsuario(usuario) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['listausuarios'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )}
}

