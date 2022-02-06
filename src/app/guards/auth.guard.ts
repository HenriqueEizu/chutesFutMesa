import { EquipeService } from './../equipe/equipe.service';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './../usuario/usuario.model';

import { UsuarioService } from '../usuario/usuario.service';
import { Equipe } from '../equipe/equipe.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad{

  blnLogado : boolean;
  usuarioLogado : Usuario;
  blnHome : boolean = false;
  constructor(private usuarioServico:  UsuarioService
              , private route : Router
              , private equipeService : EquipeService) { }
  canLoad(route: Route) : Observable<boolean> | Promise<boolean> | boolean{
    return this.blnLogado;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{

    if (state.url == "/home"){
      this.blnHome = true;
    }else{
      this.blnHome = false;
    }

      if (this.VerificaLogin(this.blnHome) == false ){
          this.route.navigate(['login']);
          this.blnLogado = false;
      }

    return this.blnLogado;

  }

  VerificaLogin(blnHome: boolean) : boolean{
    this.usuarioServico.isLoggedIn.subscribe((logado : Boolean) => {
      if (logado == true){
        this.blnLogado = true;
        this.usuarioServico.usuarioCacheFunc.subscribe((user : Usuario) => {
          this.usuarioLogado = user;
          if (this.usuarioLogado != null && blnHome == true){
            this.equipeService.GetEquipeIdPorusuario(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
              console.log(jog.EQ_EQID)
              if (jog.EQ_EQID > 0){
                this.route.navigate(['dashboard']);
              }
            });
          }
        })
      }else{
          this.blnLogado = false;
      }
    });

    return this.blnLogado;
  }
}
