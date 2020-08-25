import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

import {EquipeService} from '../equipe/equipe.service'
import { UsuarioService } from '../usuario/usuario.service';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario/usuario.model';
import { Equipe } from '../equipe/equipe.model';
import { DashboardService } from './dashboard.service';
import { ApuracaoJogadores } from './dashboard.model';
import { PtsCompeticaoJogador } from '../pts-competicao-jogador/PtsCompeticaoJogador.model';
import { PtsCompeticaoJogadorService } from '../pts-competicao-jogador/pts-competicao-jogador.service';

@Component({
  selector: 'cft-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = true;
  isLoggedIn$: Observable<boolean>;
  usuarioLogado : Usuario;
  EquipeUsuario : Equipe = null;
  imageCardEquipe : string
  osMaiEscalados : ApuracaoJogadores[];
  osSeusEscalados : ApuracaoJogadores[];
  maisEscaladosJogador : string[];
  maisEscaladodClube: string[];
  maisEscaladosTotal: number[];
  maisEscaladosEmblema: string[];
  maisEscaladosFoto: string[];

  seusEscaladosJogador : string[];
  seusEscaladodClube: string[];
  seusEscaladosTotal: number[];
  seusEscaladosEmblema: string[];
  seusEscaladosFoto: string[];

  ptsCompeticao : PtsCompeticaoJogador[];
  
  constructor(private equipeService: EquipeService
    ,private usuarioService: UsuarioService
    ,private dashBoardservice: DashboardService
    ,private ptcCompeticaoService : PtsCompeticaoJogadorService) { }

  ngOnInit(): void {

    var i:number; 

    this.isLoggedIn$ = this.usuarioService.isLoggedIn;

    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
      this.equipeService.GetEquipeId(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
        this.EquipeUsuario = jog;
        console.log(this.EquipeUsuario);
      });
      this.dashBoardservice.OsSeusEscalados(this.usuarioLogado.US_USID).subscribe((jog : ApuracaoJogadores[]) => {
        this.osSeusEscalados = jog["maisEscalados"];
        console.log(this.osSeusEscalados);
        if (this.osSeusEscalados.length > 0){
          for( i = 0;i < 3 ;i++) {
            this.seusEscaladosJogador[i] = this.osSeusEscalados[i].AJ_JOAPELIDO
            this.seusEscaladodClube[i] = this.osSeusEscalados[i].AJ_CLSIGLA
            this.seusEscaladosTotal[i] = this.osSeusEscalados[i].AJ_AJPONTOS
            this.seusEscaladosEmblema[i] = this.osSeusEscalados[i].AJ_CLEMBLEMA
            this.seusEscaladosFoto[i] = this.osSeusEscalados[i].AJ_JOFOTO
          } 
        }
      });
    });

    this.maisEscaladosJogador = ["","",""];
    this.maisEscaladodClube = ["","",""];
    this.maisEscaladosTotal  = [0,0,0];
    this.maisEscaladosEmblema = ["","",""];
    this.maisEscaladosFoto = ["","",""];

    this.seusEscaladosJogador = ["","",""];
    this.seusEscaladodClube = ["","",""];
    this.seusEscaladosTotal  = [0,0,0];
    this.seusEscaladosEmblema = ["","",""];
    this.seusEscaladosFoto = ["","",""];
    

    this.dashBoardservice.OsMaisEscalados().subscribe((jog : ApuracaoJogadores[]) => {
      this.osMaiEscalados = jog["maisEscalados"];
      console.log(this.osMaiEscalados);
      if (this.osMaiEscalados.length > 0){
        for( i = 0;i < 3 ;i++) {
          this.maisEscaladosJogador[i] = this.osMaiEscalados[i].AJ_JOAPELIDO
          this.maisEscaladodClube[i] = this.osMaiEscalados[i].AJ_CLSIGLA
          this.maisEscaladosTotal[i] = this.osMaiEscalados[i].AJ_AJPONTOS
          this.maisEscaladosEmblema[i] = this.osMaiEscalados[i].AJ_CLEMBLEMA
          this.maisEscaladosFoto[i] = this.osMaiEscalados[i].AJ_JOFOTO
        } 
      }
    });

    this.ptcCompeticaoService.TopPontuadores().subscribe((jog : PtsCompeticaoJogador[]) => {
      this.ptsCompeticao = jog;
      console.log(this.ptsCompeticao);
    });

  }

}
