import { RankingJogadores } from './ranking.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MEAT_API } from '../app.api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private http: HttpClient) { }

  postFile(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    var teste = this.http.post<string>(`${MEAT_API}/ranking/upload`,formData).pipe();
    return teste;
  }

  ImportarRanking( rakings : RankingJogadores[]): Observable<boolean>{
    let rkJogadores$ = new Observable<boolean>();
    rkJogadores$ =  this.http.post<boolean>(`${MEAT_API}/ranking/ImportarRanking`,rakings)
    return rkJogadores$;
  } 

  RankingGeral(): Observable<RankingJogadores[]>{
    let apuracao$ = new Observable<RankingJogadores[]>();
    apuracao$ = this.http.get<RankingJogadores[]>(`${MEAT_API}/ranking/RankingGeral`).pipe();
    return apuracao$;
  }

}
