import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad{

  blnLogado : boolean;
  constructor(private usuarioServico:  UsuarioService
              , private route : Router) { }
  canLoad(route: Route) : Observable<boolean> | Promise<boolean> | boolean{
    return this.blnLogado;
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
    
      if (this.VerificaLogin() == false ){
          this.route.navigate(['login']);
          this.blnLogado = false;
      }
    return this.blnLogado;

  }

  VerificaLogin() : boolean{
    this.usuarioServico.isLoggedIn.subscribe((logado : Boolean) => {
      if (logado == true){
        this.blnLogado = true;
      }else{
          this.blnLogado = false;
      }
    });
    return this.blnLogado;
  }
}
