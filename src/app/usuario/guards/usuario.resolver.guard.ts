import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';

@Injectable({
    providedIn: 'root'
})

export class UsuarioResolverGuard implements Resolve<Usuario> {

constructor(private service: UsuarioService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Usuario> {
        if  (route.params && route.params['id']){
            return this.service.GetIdusuario(route.params['id']); 
        }
 
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
  
}