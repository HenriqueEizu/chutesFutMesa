import { Jogador } from './jogador.model';
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
export class JogadorService { 

  constructor(private http: HttpClient
              ,private router: Router) { }

  InserirJogador(jogador : Jogador) : Observable<boolean>{
      return this.http.post<boolean>(`${MEAT_API}/jogador/Incluir` ,jogador)
  }

  AlterarJogador(jogador : Jogador) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/jogador/Alterar/${jogador.JO_JOID}`,jogador).pipe(take(1));
  }

  ExcluirJogador(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/jogador/Excluir/${id}`);
  }

  SalvarJogador(jogador : Jogador): Observable<boolean>{
    if (jogador.JO_JOID){
      return this.AlterarJogador(jogador);
    }
    return this.InserirJogador(jogador);
  } 

  VerificaNomeJogador() {
    return this.http.get<any>(`${MEAT_API}/jogador/VerificaNomeJogador`).pipe(); 
  }

  VerificaApelido() {
    return this.http.get<any>(`${MEAT_API}/jogador/VerificaNomeJogador`).pipe();
  }

  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/jogador/upload`,formData).pipe();
    return teste;
    }

  GetIdjogador(id: number):Observable<Jogador>{
    var jogadorLocal : Observable<Jogador>
    jogadorLocal = this.http.get<Jogador>(`${MEAT_API}/jogador/GetIdjogador/${id}` ).pipe();
    return jogadorLocal;
  }

  GetAllJogador(): Observable<Jogador[]>{
    let jogadores$ = new Observable<Jogador[]>();
    jogadores$ = this.http.get<Jogador[]>(`${MEAT_API}/jogador`).pipe();
    return jogadores$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

}
