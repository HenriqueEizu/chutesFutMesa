import { Component, OnInit } from '@angular/core';
import {UsuarioService} from  './usuario/usuario.service'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'
import { take } from 'rxjs/operators';

@Component({
  selector: 'cft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'chutesfutmesa';
  isLoggedIn$: Observable<boolean>;
  blnLogado : boolean;
  // mostrarMenuEmmiter : boolean = false;

  constructor(private usuarioService: UsuarioService,
              private router : Router) { }

  ngOnInit(): void {
    // this.usuarioService.mostrarMenuEmmiter.subscribe(
    //   mostrar => this.mostrarMenuEmmiter = mostrar
    // );
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
  }

  logout(){
    this.usuarioService.logout();
    this.router.navigate(['login'])
  }
}
