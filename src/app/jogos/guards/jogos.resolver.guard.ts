import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Jogos } from '../jogos.model';
import { JogosService } from '../jogos.service';
import { NullTemplateVisitor } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})

export class JogosResolverGuard implements Resolve<Jogos> {

constructor(private service: JogosService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Jogos> {
        if  (route.params && route.params['id']){
            return this.service.GetIdJogo(route.params['id']); 
        }
 
        return of ({
            JG_JGID : null,
            ano : null,
            JG_CPID: null,
            OBJ_COMPETICAO : null,
            JG_CLID1 : null,
            OBJ_CLUBE1 : null,
            JG_JGPTS1 : null,
            JG_JGPG1 : null,
            JG_JGSG1 : null,
            JG_JGVITORIA1 : null,
            JG_JGEMPATE1 : null,
            JG_DERROTA1 : null,
            JG_CLID2 : null,
            OBJ_CLUBE2 : null,
            JG_JGPTS2 : null,
            JG_JGPG2 : null,
            JG_JGSG2 : null,
            JG_JGVITORIA2 : null,
            JG_JGEMPATE2 : null,
            JG_DERROTA2 : null,
            JG_JGATIVO : null,
            JG_JGDATACADASTRO : null
        });
    }
  
}