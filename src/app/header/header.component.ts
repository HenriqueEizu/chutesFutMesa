import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../usuario/usuario.service'
import {Usuario} from '../usuario/usuario.model'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'

@Component({
  selector: 'cft-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  usuarioLogadoObs : Observable<Usuario>;
  usuarioLogado : Usuario;
  strNome : string;
  constructor(private usuarioService: UsuarioService
              ,private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
    });
  }

  logout(){
    this.usuarioService.logout();
    this.router.navigate(['login'])
  } 

}
