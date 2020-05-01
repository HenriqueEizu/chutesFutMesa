import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import { Clube } from '../clube.model';
import { ClubeService } from '../clube.service';

@Injectable({
    providedIn: 'root'
})

export class ClubeResolverGuard implements Resolve<Clube> {

constructor(private service: ClubeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Clube> {
        if  (route.params && route.params['id']){
            return this.service.VerificaClube(route.params['id'])
        }

        return of ({
            CL_CLID : null,
            CL_CLNOME  : null,
            CL_CLENDERECO    : null,
            CL_CLCIDADE : null,
            CL_CLUF : null,
            CL_CLATIVO : null,
            CL_CLSIGLA  : null,
            CL_CLEMBLEMA : null,
            CL_CLEMAIL : null,
            CL_CLRESPONSAVEL : null,
            CL_CLDATACADASTRO : null,
            CL_CLTELEFONE : null,

        });
    }
  
}