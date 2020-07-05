import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Equipe } from '../equipe.model';
import { EquipeService } from '../equipe.service';

@Injectable({
    providedIn: 'root'
}) 
  
export class EquipeResolverGuard implements Resolve<Equipe> {

constructor(private service: EquipeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Equipe> {
        if  (route.params && route.params['id']){
            return this.service.GetEquipeId(route.params['id']) 
        }
 
        return of ({
            EQ_EQID  : null,
            EQ_EQNOME : null,
            EQ_USID : null,
            OBJ_USUARIO : null,
            OBJ_JOGADOR : null,
            EQ_EQESCUDO : null,
            EQ_EQOBSERVACAO : null,
            EQ_EQATIVO : null,
            EQ_EQDATACADASTRO : null
        });
    }
   
} 