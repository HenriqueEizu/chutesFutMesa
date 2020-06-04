import { Component, OnInit } from '@angular/core';
import {UsuarioService} from  '../usuario/usuario.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'cft-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'chutesfutmesa';
  isLoggedIn$: Observable<boolean>;
  blnLogado : boolean = false;
  // mostrarMenuEmmiter : boolean = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.isLoggedIn.subscribe((bl : boolean) => { this.blnLogado = bl});
  }

}
