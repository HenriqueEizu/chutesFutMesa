import { EquipeService } from './../equipe/equipe.service';
import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../usuario/usuario.service'
import {Usuario} from '../usuario/usuario.model'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'
import { Equipe } from '../equipe/equipe.model';

@Component({
  selector: 'cft-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  usuarioLogadoObs : Observable<Usuario>;
  usuarioLogado : Usuario;
  equipeUser : Equipe;
  strNome : string;
  blnHabilitaDashboard : boolean = false;
  constructor(private usuarioService: UsuarioService
              ,private router: Router
              ,private equipeService: EquipeService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
      if (this.usuarioLogado != null){
        this.equipeService.GetEquipeIdPorusuario(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
          console.log(jog);
          this.equipeUser = jog
          if (this.equipeUser != null){
            if (this.equipeUser.EQ_EQID > 0){
              this.blnHabilitaDashboard = true;
            }
          }
        });
      }
    });
  }

  logout(){
    this.usuarioService.logout();
    this.router.navigate(['login'])
  } 

}
