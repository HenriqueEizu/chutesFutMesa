import { Injectable } from "@angular/core"
 import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient ,HttpClientModule,HttpResponse, HttpHeaders,HttpErrorResponse,HttpParams  } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import {Clube,Estado} from './clube.model'

import 'rxjs/Rx';


@Injectable() 
export class ClubeService{

    constructor(private http: HttpClient){ }

    GetAllEstado(): Observable<Estado[]>{
        return this.http.get<Estado[]>(`${MEAT_API}/estados`).pipe(retry(10),
        catchError(this.handleError)) ;
    }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

  GetAllClube(): Observable<Clube[]>{
    let clubes$ = new Observable<Clube[]>();
    clubes$ = this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
    return clubes$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }
 
  VerificaClube(clube: string): Observable<Clube>{
    // let params = new HttpParams();
    // params = params.append('login', clube);
    var clubeLocal : Observable<Clube>
    clubeLocal = this.http.get<Clube>(`${MEAT_API}/clube/verificaClube/${clube}` ).pipe();
    return clubeLocal;
  }
  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/upload`,formData).pipe();
    return teste;
    }

    InserirClube(clube : Clube) : Observable<boolean>{
        return this.http.post<boolean>(`${MEAT_API}/clube/Incluir` ,clube)
    }

    ExcluirClube(id : number) : Observable<boolean>{
      return this.http.delete<boolean>(`${MEAT_API}/clube/Excluir/${id}`);
    }

    AlterarClube(clube : Clube) : Observable<boolean>{
      return this.http.put<boolean>(`${MEAT_API}/clube/Alterar/${clube.CL_CLID}`,clube).pipe(take(1));
    }

    SalvarClube(clube : Clube): Observable<boolean>{
      if (clube.CL_CLID){
        return this.AlterarClube(clube);
      }
      return this.InserirClube(clube);
    }

  
}