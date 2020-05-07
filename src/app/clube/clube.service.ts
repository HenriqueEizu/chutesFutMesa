import { Injectable } from "@angular/core"
 import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import {Clube,Estado} from './clube.model'

import 'rxjs/Rx';


@Injectable() 
export class ClubeService {

  header = new HttpHeaders();

    constructor(private http: HttpClient){ 
     
    this.header.append("Content-Type","application/json") ;
    this.header.append("Authorization","Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVU19VU0xPR0lOIjoiRkFSQUggIiwiVVNfVVNFTUFJTCI6IkZBUkFIQEZBUkFILkNPTS5CUiIsImlhdCI6MTU4ODUxMTU5NSwiZXhwIjoxNTg4NTE1MTk1fQ.bqKs5K3DiTsfFvE6A6P1UTolNJ1jEbyHp21-gq9D7Gc") ;
                        }

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

    GetClubeId(id: number):Observable<Clube>{
      var clubeLocal : Observable<Clube>
      clubeLocal = this.http.get<Clube>(`${MEAT_API}/clubes/GetClubeId/${id}` ).pipe();
      return clubeLocal;
    }
    
    VerificaClube(){
      return this.http.get<any>(`${MEAT_API}/clubes/VerificaClube`).pipe();
    }

  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/clubes/upload`,formData).pipe();
    return teste;
    }

    InserirClube(clube : Clube) : Observable<boolean>{
        return this.http.post<boolean>(`${MEAT_API}/clubes/Incluir` ,clube)
    }

    ExcluirClube(id : number) : Observable<boolean>{
      return this.http.delete<boolean>(`${MEAT_API}/clubes/Excluir/${id}`);
    }

    AlterarClube(clube : Clube) : Observable<boolean>{
      return this.http.put<boolean>(`${MEAT_API}/clubes/Alterar/${clube.CL_CLID}`,clube).pipe(take(1));
    }

    SalvarClube(clube : Clube): Observable<boolean>{
      if (clube.CL_CLID){
        return this.AlterarClube(clube);
      }
      return this.InserirClube(clube);
    }

  
}