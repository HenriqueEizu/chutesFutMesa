

import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';

import { ApuracaoJogadores, PARAMETROSSISTEMAS } from './dashboard.model';
import { Jogos } from './../jogos/jogos.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  OsMaisEscalados(): Observable<ApuracaoJogadores[]>{
    let apuracao$ = new Observable<ApuracaoJogadores[]>();
    apuracao$ = this.http.get<ApuracaoJogadores[]>(`${MEAT_API}/ranking/OsMaisEscalados`).pipe();
    return apuracao$;
  }

  OsSeusEscalados(id : number): Observable<ApuracaoJogadores[]>{
    let apuracao$ = new Observable<ApuracaoJogadores[]>();
    apuracao$ = this.http.get<ApuracaoJogadores[]>(`${MEAT_API}/ranking/OsSeusEscalados/${id}`).pipe();
    return apuracao$;
  }

  CarregaParametros(): Observable<PARAMETROSSISTEMAS>{
    let apuracao$ = new Observable<PARAMETROSSISTEMAS>();
    apuracao$ = this.http.get<PARAMETROSSISTEMAS>(`${MEAT_API}/ranking/CarregaParametros`).pipe();
    return apuracao$;
  }

  
  

}
