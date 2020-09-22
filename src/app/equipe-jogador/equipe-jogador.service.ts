import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor, HttpParams } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';

import {EquipeJogador} from './equipe-jogador.model'
import { Equipe } from '../equipe/equipe.model';
import { Jogos } from '../jogos/jogos.model';

@Injectable({
  providedIn: 'root'
})
export class EquipeJogadorService {

  constructor(private http: HttpClient) { }

  ExisteEquipeUsuario(id: number) : Observable<EquipeJogador>{
    return this.http.get<EquipeJogador>(`${MEAT_API}/equipejogador/existeEquipeUsuario/${id}`).pipe();
  }

  GetEquipeJogadorId(id: number) : Observable<EquipeJogador>{
    return this.http.get<EquipeJogador>(`${MEAT_API}/equipejogador/getEquipeJogadorId/${id}`).pipe();
  }

  SalvarEquipeEscalacao(equipe : Equipe, idJogadoreEscalado : number[]): Observable<boolean>{
    let params : string;
    params =  idJogadoreEscalado.join(', ');
    return this.http.put<boolean>(`${MEAT_API}/equipejogador/SalvarEquipeEscalacao/${params}`,equipe).pipe(take(1));    
  } 

  ExcluirEquipeEscalacao(equipe : Equipe): Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/equipejogador/ExcluirEquipeEscalacao/${equipe.EQ_EQID}`);
  } 

  

  

}
