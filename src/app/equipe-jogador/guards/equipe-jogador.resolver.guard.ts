
import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { EquipeJogador } from './../equipe-jogador.model';
import { EquipeJogadorService } from '../equipe-jogador.service';

@Injectable({
    providedIn: 'root'
}) 
  
export class EquipeJogadorResolverGuard implements Resolve<EquipeJogador> {

constructor(private service: EquipeJogadorService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EquipeJogador> {
        if  (route.params && route.params['id']){
            return this.service.GetEquipeJogadorId(route.params['id']) 
        }
 
        return of ({
            EJ_EJID : null,
            EJ_EQID : null,
            OBJ_Equipe : null,
            EJ_JOID : null,
            OBJ_Jogador : null,
            EJ_EJOBSERVACAO : null,
            EJ_EJATIVO : null,
            EJ_EJDATACADASTRO : null
        });
    }
   
} 