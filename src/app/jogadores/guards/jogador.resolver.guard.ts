import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Jogador } from '../jogador.model';
import { JogadorService } from '../jogador.service';

@Injectable({
    providedIn: 'root'
})

export class jogadorResolverGuard implements Resolve<Jogador> {

constructor(private service: JogadorService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Jogador> {
        if  (route.params && route.params['id']){
            return this.service.GetIdJogador(route.params['id']); 
        }
 
        return of ({

            JO_JOID: null,
            JO_JONOME: null,
            JO_JOFOTO: null,
            JO_JOAPELIDO: null,
            JO_JOATIVO: null,
            JO_CLID : null,
            OBJ_CLUBE : null,
            JO_JODATACADASTRO : null,
            JO_JOMATRICULA : null,
            JO_JOINSCRITO : null,
            JO_JODIA : null,

        });
    }
  
}