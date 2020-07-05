import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';
 
import {Competicao,Rodadas,Categoriajogo} from './competicao.model'
 
@Injectable({
  providedIn: 'root'
})
export class CompeticaoService {

  constructor(private http: HttpClient) { }

  GetAllRodadas(): Observable<Rodadas[]>{
    return this.http.get<Rodadas[]>(`${MEAT_API}/rodada`).pipe(retry(10),
    catchError(this.handleError)) ;
  }

  GetAllCategoriaJogos(): Observable<Categoriajogo[]>{
    return this.http.get<Categoriajogo[]>(`${MEAT_API}/categoriajogo`).pipe(retry(10),
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

  GetAllCompeticao(): Observable<Competicao[]>{
    let competicoes$ = new Observable<Competicao[]>();
    competicoes$ = this.http.get<Competicao[]>(`${MEAT_API}/competicao`).pipe();
    return competicoes$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

  GetCompeticaoId(id: number):Observable<Competicao>{
    var competicaoLocal : Observable<Competicao>
    competicaoLocal = this.http.get<Competicao>(`${MEAT_API}/competicao/GetCompeticaoId/${id}` ).pipe();
    return competicaoLocal;
  }

  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/competicao/upload`,formData).pipe();
    return teste;
  }

  InserirCompeticao(competicao : Competicao) : Observable<boolean>{ 
      return this.http.post<boolean>(`${MEAT_API}/competicao/Incluir` ,competicao)
  }

  ExcluirCompeticao(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/competicao/Excluir/${id}`);
  }

  AlterarCompeticao(competicao : Competicao) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/competicao/Alterar/${competicao.CP_CPID}`,competicao).pipe(take(1));
  }

  SalvarCompeticao(competicao : Competicao): Observable<boolean>{
    if (competicao.CP_CPID){
      return this.AlterarCompeticao(competicao);
    }
    return this.InserirCompeticao(competicao);
  }
 
}
