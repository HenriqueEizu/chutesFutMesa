import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { PtsCompeticaoJogador } from './../PtsCompeticaoJogador.model';
import { PtsCompeticaoJogadorService } from './../pts-competicao-jogador.service';

@Injectable({
    providedIn: 'root'
}) 

export class PtsCompeticaoJogadorResolverGuard implements Resolve<PtsCompeticaoJogador> {

constructor(private service: PtsCompeticaoJogadorService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PtsCompeticaoJogador> {
        if  (route.params && route.params['id']){
            return this.service.GetPtsCompeticaoJogadorId(route.params['id']) 
        }
 
        return of ({
            PJ_PJID : null,
            PJ_CPID : null,
            OBJ_COMPETICAO : null,
            PJ_JOID : null,
            OBJ_JOGADOR : null,
            PJ_PJPONTOS : null,
            PJ_PJOBSERVACAO : null,
            PJ_PJATIVO : null,
            PJ_PJDATACADASTRO : null
        });
    }
   
} 