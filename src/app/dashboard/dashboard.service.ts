
import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';

import { ApuracaoJogadores } from './dashboard.model';


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

}
