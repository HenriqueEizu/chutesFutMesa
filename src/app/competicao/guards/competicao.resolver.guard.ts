import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Competicao } from '../competicao.model';
import { CompeticaoService } from '../competicao.service';

@Injectable({
    providedIn: 'root'
})

export class CompeticaoResolverGuard implements Resolve<Competicao> {

constructor(private service: CompeticaoService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Competicao> {
        if  (route.params && route.params['id']){
            return this.service.GetCompeticaoId(route.params['id']) 
        }
 
        return of ({
            CP_CPID : null,
            CP_CPDESCRICAO : null,
            CP_CPCIDADE : null,
            CP_ROID : null,
            OBJ_Rodada : null,
            CP_CPDATALIMITEAPOSTA : null,
            CP_CPDATAINICIO : null,
            CP_CJID : null,
            OBJ_CATEGORIAJOGADOR : null,
            CP_CPATIVO : null,
            CP_CPDATACADASTRO : null,
            CP_CPFOTO : null
        });
    }
   
} 