import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { AlertModalService } from 'src/app/shared/alertmodal/alertmodal.service';

@Component({
  selector: 'cft-troca-senha',
  templateUrl: './troca-senha.component.html',
  styleUrls: ['./troca-senha.component.css']
})
export class TrocaSenhaComponent implements OnInit {

  usuarioForm: FormGroup
  usuario : any;
  strGuide : string;

  constructor(private usuarioService: UsuarioService
    , private router: Router
    , private formBuilder : FormBuilder
    ,private route: ActivatedRoute
    ,private alertService: AlertModalService){

      this.route.params.subscribe(params => this.strGuide = params['id']);
   
     }

     ngOnInit(): void {
      this.usuario = this.UsuarioNulo();
      this.usuarioForm = this.formBuilder.group({
        US_USSENHA: this.formBuilder.control(this.usuario.US_USSENHA, [Validators.required, Validators.minLength(6)]),
        US_USSENHA_CONFIRMA: this.formBuilder.control(this.usuario.US_USSENHA,[Validators.required, Validators.minLength(6)]),
      },{validator:TrocaSenhaComponent.equalsTo})
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

  TrocarSenha(usuario: Usuario){

    this.usuarioService.TrocarSenha(usuario.US_USSENHA, this.strGuide).subscribe(
        success => {
                    this.alertService.showAlertSuccess("Troca de Senha efetuada com sucesso");
                    this.router.navigate(['login'])
                    },
        error =>  {
                  this.alertService.showAlertDanger("Erro ao trocar a senha") ;
                  }
      )
  }

}
