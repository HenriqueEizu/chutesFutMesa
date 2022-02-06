import { EquipeService } from './../equipe/equipe.service';
import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../usuario/usuario.service'
import {Usuario} from '../usuario/usuario.model'
import {Router} from '@angular/router'
import {Observable} from 'rxjs'
import { Equipe } from '../equipe/equipe.model';
import { Clube } from '../clube/clube.model';
import { ClubeService } from '../clube/clube.service';

@Component({
  selector: 'cft-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  logado : boolean;
  usuarioLogadoObs : Observable<Usuario>;
  usuarioLogado : Usuario;
  equipeUser : Equipe;
  clube1 : Clube;
  strNome : string;
  blnHabilitaDashboard : boolean = false;
  constructor(private usuarioService: UsuarioService
              ,private router: Router
              ,private equipeService: EquipeService
              ,private clubeService : ClubeService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;

    this.usuarioService.isLoggedIn.subscribe(( p : boolean) => {
      this.logado = p
      if (p == false)
      {
        this.router.navigate(['login'])
      }
    });

    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
      if (this.usuarioLogado != null){
        this.clubeService.GetClubeId(this.usuarioLogado.US_CLID).subscribe((club : Clube) => {
          this.clube1 = club;
        })
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
