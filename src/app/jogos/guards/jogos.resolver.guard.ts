import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Jogos } from '../jogos.model';
import { JogosService } from '../jogos.service';

@Injectable({
    providedIn: 'root'
})

export class JogosResolverGuard implements Resolve<Jogos> {

constructor(private service: JogosService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Jogos> {
        if  (route.params && route.params['id']){
            return null
            // return this.service.GetIdJogo(route.params['id']); 
        }
 
        return of ({
            JG_JGID : null,
            JG_JGDATA : null,
            JG_CJID : null,
            OBJ_CATEGORIAJOGO : null,
            JG_JOID1 : null,
            OBJ_JOGADOR1 : null,
            JG_JGGOL1 : null,
            JG_JGVITORIA1 : null,
            JG_JGEMPATE1 : null,
            JG_DERROTA1 : null,
            JG_JOID2 : null,
            OBJ_JOGADOR2 : null,
            JG_JGGOL2 : null,
            JG_JGVITORIA2 : null,
            JG_JGEMPATE2 : null,
            JG_DERROTA2 : null,
            JG_JGATIVO : null,
            JG_JGDATACADASTRO : null

        });
    }
  
}