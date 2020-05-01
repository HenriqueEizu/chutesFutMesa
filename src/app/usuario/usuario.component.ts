import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors } from '@angular/forms'
import {Usuario,GrupoUsuario} from './usuario.model'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable} from 'rxjs'
import {UsuarioService} from './usuario.service'
import {Router} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { throwError } from 'rxjs';
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");

@Component({
  selector: 'cft-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, IFormCanDeactivate {

  gruposUsuarios: GrupoUsuario[];
  blnExisteLogin : boolean;
  usuarioLocal : Usuario;
  usuarioForm: FormGroup
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  numberPattern = /^[1-9]*$/
  message: String;
  usuarioExiste : Observable<Usuario>;

  constructor(private usuarioService: UsuarioService
               , private router: Router
               , private formBuilder : FormBuilder){

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

    this.usuarioForm = this.formBuilder.group({
      US_USLOGIN: this.formBuilder.control('',[Validators.required, Validators.minLength(6)],[this.customerNameValidator.bind(this)]),
      US_USSENHA: this.formBuilder.control('',[Validators.required, Validators.minLength(6)]),
      US_USSENHA_CONFIRMA: this.formBuilder.control('',[Validators.required, Validators.minLength(6)]),
      US_USNOMETRATAMENTO: this.formBuilder.control('',[Validators.required, Validators.minLength(5)]),
      US_CLID: this.formBuilder.control('',[Validators.required, Validators.pattern(this.numberPattern)]),
      US_USEMAIL: this.formBuilder.control('',[Validators.required, Validators.pattern(this.emailPattern)]),
      US_USATIVO: this.formBuilder.control(''),
      US_GUID: this.formBuilder.control('',[Validators.required]),
    },{validator:UsuarioComponent.equalsTo})
  }

  customerNameValidator(c: AbstractControl):Observable<Usuario>
  {
    var login = c.value;
    var user : Usuario;
    this.usuarioExiste =  this.usuarioService.VerificaLogin(String(login)).pipe()
    this.usuarioExiste.subscribe((e : Usuario) => {
        user = e
        alert(user);
        if (user == null){
          this.blnExisteLogin = false
          return undefined;
        }else{
          this.blnExisteLogin = true
          return this.usuarioExiste
        }
      
      });
    return this.usuarioExiste;
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

  InserirUsuario(usuario: Usuario){
    usuario.US_USDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    var blnResponse : boolean;
    this.usuarioService.InserirUsuario(usuario).subscribe((resp : boolean) => {
      blnResponse = resp
      if (blnResponse == true){
        this.router.navigate(['home'])
        this.message = "Erro a inserir usuario"
      }
      else{
        this.message = "Erro a inserir usuario"
      }
    });
  }
}
