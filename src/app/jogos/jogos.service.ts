import { Jogos } from './jogos.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {catchError, tap, map, shareReplay,switchMap,retry,publishReplay, refCount, take} from  'rxjs/operators'
import { HttpClient ,HttpClientModule,HttpResponse, HttpHeaders,HttpErrorResponse,HttpParams  } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import { Router } from '@angular/router'

import {MEAT_API} from '../app.api'

@Injectable({
  providedIn: 'root'
})
export class JogosService {

  constructor(private http: HttpClient
    ,private router: Router) { }

  GetIdJogo(id: number):Observable<Jogos>{
    var jogadorLocal : Observable<Jogos>
    jogadorLocal = this.http.get<Jogos>(`${MEAT_API}/jogos/GetIdJogo/${id}` ).pipe();
    return jogadorLocal;
  }

  GetAllJogos(): Observable<Jogos[]>{
    let jogadores$ = new Observable<Jogos[]>();
    jogadores$ = this.http.get<Jogos[]>(`${MEAT_API}/jogos`).pipe();
    return jogadores$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

  InserirJogo(jogo : Jogos) : Observable<boolean>{
    return this.http.post<boolean>(`${MEAT_API}/jogos/Incluir` ,jogo)
  }

  AlterarJogo(jogo : Jogos) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/jogos/Alterar/${jogo.JG_JGID}`,jogo).pipe(take(1));
  }

  ExcluirJogo(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/jogos/Excluir/${id}`);
  }

  SalvarJogos(jogo : Jogos): Observable<boolean>{
    if (jogo.JG_JGID){
      return this.AlterarJogo(jogo);
    }
    return this.InserirJogo(jogo);
  } 

  TabelaJogos(): Observable<Jogos[]>{
    let jogos$ = new Observable<Jogos[]>();
    jogos$ = this.http.get<Jogos[]>(`${MEAT_API}/jogos/TabelaJogos`).pipe();
    return jogos$;
  }

}
