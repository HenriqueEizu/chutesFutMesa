import { Injectable } from "@angular/core"
import {Observable} from 'rxjs'
import {MEAT_API, MEAT_APP} from '../app.api'
import {catchError, retry, take} from  'rxjs/operators'
import { HttpClient , HttpHeaders,HttpErrorResponse,HttpInterceptor, HttpParams } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import 'rxjs/Rx';
 
import {Equipe,ImagemEscudo,RankingJogadorStatus, RankingEquipe} from './equipe.model'
 

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
 
  constructor(private http: HttpClient) { }

  VerificaEquipe(){
    return this.http.get<any>(`${MEAT_API}/equipe/VerificaEquipe`).pipe();
  }

  GetAllEquipe(): Observable<Equipe[]>{
    let equipes$ = new Observable<Equipe[]>();
    equipes$ = this.http.get<Equipe[]>(`${MEAT_API}/equipe`).pipe();
    return equipes$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

  GetImagemEscudo(): Observable<ImagemEscudo[]>{
    let imagemEscudo$ = new Observable<ImagemEscudo[]>();
    imagemEscudo$ = this.http.get<ImagemEscudo[]>(`${MEAT_API}/equipe/imagemEscudo`).pipe();
    return imagemEscudo$;
    // return this.http.get<Clube[]>(`${MEAT_API}/clubes`).pipe();
  }

  GetRankingJogadorStatus(id: number) : Observable<RankingJogadorStatus[]>{
    let rkJogStatus$ = new Observable<RankingJogadorStatus[]>();
    rkJogStatus$ = this.http.get<RankingJogadorStatus[]>(`${MEAT_API}/equipe/RankingJogadorStatus/${id}`).pipe();
    return rkJogStatus$;
  }

  

  GetEquipeId(id: number):Observable<Equipe>{
    var equipeLocal : Observable<Equipe>
    equipeLocal = this.http.get<Equipe>(`${MEAT_API}/equipe/GetEquipeId/${id}` ).pipe();
    return equipeLocal;
  }

  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/equipe/upload`,formData).pipe();
    return teste;
  }

  InserirEquipe(equipe : Equipe,params : string) : Observable<boolean>{ 
    return this.http.put<boolean>(`${MEAT_API}/equipe/Incluir/${params}`,equipe).pipe(take(1));    
  }

  ExcluirEquipe(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/equipe/Excluir/${id}`);
  }

  AlterarEquipe(equipe : Equipe, params :string) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/equipe/Alterar/${params}`,equipe).pipe(take(1));    
  }

  SalvarEquipe(equipe : Equipe, idJogadoreEscalado : number[]): Observable<boolean>{
    let params : string;
    params =  idJogadoreEscalado.join(', ');
    if (equipe.EQ_EQID){
      return this.AlterarEquipe(equipe,params);
    }
    return this.InserirEquipe(equipe,params);
  } 

  GetRankingEquipes(blnPorRodada: boolean): Observable<RankingEquipe[]>{
    let rkEquipes$ = new Observable<RankingEquipe[]>();
    rkEquipes$ =  this.http.get<RankingEquipe[]>(`${MEAT_API}/equipe/GetRankingEquipes/${blnPorRodada}`).pipe();
    return rkEquipes$;
  }
} 
     