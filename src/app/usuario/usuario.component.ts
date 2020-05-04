
import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors } from '@angular/forms'
import {Usuario,GrupoUsuario} from './usuario.model'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");

import { Clube } from '../clube/clube.model';
import {UsuarioService} from './usuario.service'
import { ClubeService } from './../clube/clube.service';


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

  constructor(private usuarioService: UsuarioService
               , private clubeService: ClubeService
               , private router: Router
               , private formBuilder : FormBuilder
               ,private route: ActivatedRoute){

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

    const usuario = this.route.snapshot.data['usuario'];

    this.route.params.subscribe((params:any) => {
      console.log(params);
      this.usuarioCarregado = params['usuario']
    });


    this.usuarioForm = this.formBuilder.group({
      US_USID: [usuario.US_USID],
      US_USLOGIN: this.formBuilder.control(usuario.US_USLOGIN,[Validators.required, Validators.minLength(6)],[this.customerNameValidator.bind(this)]),
      US_USSENHA: this.formBuilder.control(usuario.US_USSENHA,[Validators.required, Validators.minLength(6)]),
      US_USSENHA_CONFIRMA: this.formBuilder.control(usuario.US_USSENHA_CONFIRMA,[Validators.required, Validators.minLength(6)]),
      US_USNOMETRATAMENTO: this.formBuilder.control(usuario.US_USNOMETRATAMENTO,[Validators.required, Validators.minLength(5)]),
      US_CLID: this.formBuilder.control(usuario.US_CLID,[Validators.required, Validators.pattern(this.numberPattern)]),
      US_USEMAIL: this.formBuilder.control(usuario.US_USEMAIL,[Validators.required, Validators.pattern(this.emailPattern)]),
      US_USATIVO: this.formBuilder.control(usuario.US_USATIVO),
      US_GUID: this.formBuilder.control(usuario.US_GUID,[Validators.required]),
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
