
import { Injectable, EventEmitter } from "@angular/core"
import {Observable} from 'rxjs'
import {catchError, tap, map, shareReplay,switchMap,retry,publishReplay, refCount, take} from  'rxjs/operators'
import { HttpClient ,HttpClientModule,HttpResponse, HttpHeaders,HttpErrorResponse,HttpParams  } from '@angular/common/http'; 
import {BehaviorSubject,throwError} from 'rxjs'
import { Router } from '@angular/router'

import {MEAT_API} from '../app.api'
import {Usuario,GrupoUsuario} from "../usuario/usuario.model"


@Injectable() 
export class UsuarioService{

  // mostrarMenuEmmiter = new EventEmitter<boolean>();
   
  private loggedIn = new BehaviorSubject<boolean>(false);

  usuarioLogado1: Usuario = null;

  private usuarioLogado = new BehaviorSubject<Usuario>(this.usuarioLogado1);

  get usuarioCacheFunc() {
    return this.usuarioLogado; // {2}
  }

    get isLoggedIn() {
      return this.loggedIn.asObservable(); // {2}
    }

    constructor(private http: HttpClient
                ,private router: Router){ }

    GetAllGrupoUsuario(): Observable<GrupoUsuario[]>{
        const headers = new HttpHeaders()
        headers.append("Accept","*/*");
        // var gp : any; 
        // headers.append('Content-Type','application/json')
        headers.append("Accept-Encoding","gzip, deflate");
        headers.append("Access-Control-Request-Headers","Content-type");
        headers.append("Access-Control-Request-Method","POST,OPTIONS.GET");
        headers.append('X-Requested-With','XMLHttpRequest');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4200 ' );
 

        
        return this.http.get<GrupoUsuario[]>(`${MEAT_API}/grupousuario`).pipe(retry(10),
        catchError(this.handleError)) ;
        // return this.http.get(`${MEAT_API}/grupousuario/show`,new RequestOptions({headers: headers}))
        // .map(gps => gps.json());

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
 
  InserirUsuario(usuario : Usuario) : Observable<boolean>{
      return this.http.post<boolean>(`${MEAT_API}/usuario/Incluir` ,usuario)
  }

  AlterarUsuario(usuario : Usuario) : Observable<boolean>{
    return this.http.put<boolean>(`${MEAT_API}/usuario/Alterar/${usuario.US_USID}`,usuario).pipe(take(1));
  }

  ExcluirUsuario(id : number) : Observable<boolean>{
    return this.http.delete<boolean>(`${MEAT_API}/usuario/Excluir/${id}`);
  }

  SalvarUsuario(usuario : Usuario): Observable<boolean>{
    if (usuario.US_USID){
      return this.AlterarUsuario(usuario);
    }
    return this.InserirUsuario(usuario);
  } 

  VerificaUsuario(usuario: Usuario): Observable<Usuario>{
    var usuarioLocal : Observable<Usuario>
    // usuarioLocal = this.http.post<Usuario>(`${MEAT_API}/usuario`,usuario).pipe();
    usuarioLocal = this.http.post<Usuario>(`${MEAT_API}/usuario/login`,usuario)
    usuarioLocal.subscribe((us : any) => {
      console.log(usuarioLocal);
      if (us != null){
        // this.mostrarMenuEmmiter.emit(true);
        this.loggedIn.next(true);
        this.usuarioCacheFunc.next(us.usuario);
        localStorage.setItem('token', us.token);
        this.router.navigate([''])
      }
      // else{
      //   this.mostrarMenuEmmiter.emit(false);
      // }

    });
    return usuarioLocal;
  }

  VerificaLogin() {
    return this.http.get<any>(`${MEAT_API}/usuario/verificaLogin`).pipe();
  }

  GetIdusuario(id: number):Observable<Usuario>{
    var usuarioLocal : Observable<Usuario>
    usuarioLocal = this.http.get<Usuario>(`${MEAT_API}/usuario/GetIdusuario/${id}` ).pipe();
    return usuarioLocal;
  }

  GetAllUsuarios(): Observable<any[]>{
    var usuarios$ = this.http.get<Usuario[]>(`${MEAT_API}/usuario/listausuarios`).pipe();
    return usuarios$;
  }

  logout() {                           // {4}
    this.loggedIn.next(false);
  } 

  EnviarEmail(strEmail:string){
    const obj = {
      email: strEmail,
    };
    return this.http.post(`${MEAT_API}/usuario/EnviarEmail`, obj);
  }

  TrocarSenha(strSenha:string, strGuide:string){
    const obj = {
      senha: strSenha, 
      guide: strGuide
    };
    return this.http.post(`${MEAT_API}/usuario/TrocarSenha`, obj);
  }
}