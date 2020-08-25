import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';

import { PtsCompeticaoJogador } from './PtsCompeticaoJogador.model';
 

@Injectable({
  providedIn: 'root'
})
export class PtsCompeticaoJogadorService {

  constructor(private http: HttpClient) { }

  GetAllPtsCompeticaoJogador(): Observable<PtsCompeticaoJogador[]>{
    let ptscompeticoesjogadores$ = new Observable<PtsCompeticaoJogador[]>();
    ptscompeticoesjogadores$ = this.http.get<PtsCompeticaoJogador[]>(`${MEAT_API}/ptscompeticaojogador`).pipe();
    return ptscompeticoesjogadores$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

  GetPtsCompeticaoJogadorId(id: number):Observable<PtsCompeticaoJogador>{
    var ptscompeticaojogadorLocal : Observable<PtsCompeticaoJogador>
    ptscompeticaojogadorLocal = this.http.get<PtsCompeticaoJogador>(`${MEAT_API}/ptscompeticaojogador/GetPtsCompeticaoJogadorId/${id}` ).pipe();
    return ptscompeticaojogadorLocal;
  }

  InserirPtsCompeticaoJogador(ptscompeticaojogador : PtsCompeticaoJogador) : Observable<boolean>{ 
    return this.http.post<boolean>(`${MEAT_API}/ptscompeticaojogador/Incluir` ,ptscompeticaojogador)
  }

  ExcluirPtsCompeticaoJogador(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/ptscompeticaojogador/Excluir/${id}`);
  }

  AlterarPtsCompeticaoJogador(ptscompeticaojogador : PtsCompeticaoJogador) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/ptscompeticaojogador/Alterar/${ptscompeticaojogador.PJ_PJID}`,ptscompeticaojogador).pipe(take(1));
  }

  SalvarPtsCompeticaoJogador(ptscompeticaojogador : PtsCompeticaoJogador): Observable<boolean>{
    if (ptscompeticaojogador.PJ_PJID){
      return this.AlterarPtsCompeticaoJogador(ptscompeticaojogador);
    }
    return this.InserirPtsCompeticaoJogador(ptscompeticaojogador);
  }

  ImportarPontosCompeticao( ptsComp : PtsCompeticaoJogador[]): Observable<boolean>{
    let rkJogadores$ = new Observable<boolean>();
    rkJogadores$ =  this.http.post<boolean>(`${MEAT_API}/ptscompeticaojogador/ImportarPontosCompeticao`,ptsComp)
    return rkJogadores$;
  } 

  TopPontuadores(): Observable<PtsCompeticaoJogador[]>{
    let ptscompeticoesjogadores$ = new Observable<PtsCompeticaoJogador[]>();
    ptscompeticoesjogadores$ = this.http.get<PtsCompeticaoJogador[]>(`${MEAT_API}/ptscompeticaojogador/TopPontuadores`).pipe();
    return ptscompeticoesjogadores$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

}
 