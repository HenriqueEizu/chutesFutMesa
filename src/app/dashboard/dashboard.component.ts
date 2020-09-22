import { RankingEquipe } from './../equipe/equipe.model';
import { RankingService } from './../ranking/ranking.service';
import { Jogos } from './../jogos/jogos.model';
import { CompeticaoService } from './../competicao/competicao.service';
import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

import {EquipeService} from '../equipe/equipe.service'
import { UsuarioService } from '../usuario/usuario.service';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario/usuario.model';
import { Equipe } from '../equipe/equipe.model';
import { DashboardService } from './dashboard.service';
import { ApuracaoJogadores, PARAMETROSSISTEMAS } from './dashboard.model';
import { PtsCompeticaoJogador } from '../pts-competicao-jogador/PtsCompeticaoJogador.model';
import { PtsCompeticaoJogadorService } from '../pts-competicao-jogador/pts-competicao-jogador.service';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { Competicao } from '../competicao/competicao.model';
import { RankingJogadores } from '../ranking/ranking.model';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DataRowOutlet } from '@angular/cdk/table';

@Component({
  selector: 'cft-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  active = 1;
  panelOpenState = true;
  isLoggedIn$: Observable<boolean>;
  usuarioLogado : Usuario = null;
  EquipeUsuario : Equipe ;
  imageCardEquipe : string
  osMaiEscalados : ApuracaoJogadores[];
  osSeusEscalados : ApuracaoJogadores[];
  maisEscaladosJogador : string[] = ["","",""];
  maisEscaladodClube: string[] = ["","",""];;
  maisEscaladosTotal: number[] = [0,0,0];;
  maisEscaladosEmblema: string[] = ["","",""];
  maisEscaladosFoto: string[] = ["","",""];
  
  seusEscaladosJogador : string[] = ["","",""];
  seusEscaladodClube: string[] = ["","",""];
  seusEscaladosTotal: number[] = [0,0,0];;
  seusEscaladosEmblema: string[] = ["","",""];
  seusEscaladosFoto: string[] = ["","",""];;
  competicoes : Competicao[];
  rankingGeralAdulto : RankingJogadores[];
  rankingGeralMaster : RankingJogadores[];
  rankingGeralSub20 : RankingJogadores[];
  rankingEquipeGeral : RankingEquipe[];
  PontuacaoUltimaRodada : RankingEquipe[];
  rankingEquipe : RankingEquipe = null;
  dataranking : string;
  diasFechaMercado : number;
  mercadoFechado : number;
  parametros : PARAMETROSSISTEMAS;

  ptsCompeticao : PtsCompeticaoJogador[];
  
  constructor(private equipeService: EquipeService
    ,private usuarioService: UsuarioService
    ,private dashBoardservice: DashboardService
    ,private rankingService : RankingService
    ,private ptcCompeticaoService : PtsCompeticaoJogadorService
    ,private alertService: AlertModalService
    ,private competicaoService : CompeticaoService
    ,private router: Router) { }

  ngOnInit(): void {

    var i:number; 

    this.dashBoardservice.CarregaParametros().subscribe((pa : PARAMETROSSISTEMAS) => {
      this.parametros = pa[0];

      this.competicaoService.GetAllCompeticao().subscribe((cp : Competicao[]) => {
        this.competicoes = cp.filter(f => formatDate(new Date(f.CP_CPDATAINICIO),"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                   && formatDate(new Date(f.CP_CPDATAINICIO),"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"))
                                  .sort((a, b) => a.CP_CPDATAINICIO  > b.CP_CPDATAINICIO ? -1 : 1);
      });
  
      this.rankingService.RankingGeral().subscribe((cp : RankingJogadores[]) => {
        this.rankingGeralAdulto = cp.filter(c=> c.RJ_CJID == 1 && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                                                && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));
        this.rankingGeralMaster = cp.filter(c=> c.RJ_CJID == 3  && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                                                && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));
        this.rankingGeralSub20 = cp.filter(c=> c.RJ_CJID == 2  && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                                                && formatDate(c.RJ_RJDATA,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));
        this.dataranking = cp[0].RJ_RJDATA
      });
  
      
      
      this.isLoggedIn$ = this.usuarioService.isLoggedIn;
  
      this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
        this.usuarioLogado = u
        this.equipeService.GetEquipeIdPorusuario(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
          this.EquipeUsuario = jog;
          console.log(this.EquipeUsuario);
        });
  
        this.equipeService.GetRankingEquipes().subscribe((rk : RankingEquipe[]) => {
          this.rankingEquipeGeral = rk.filter(c=> formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
          && formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"))
          
          this.rankingEquipe = this.rankingEquipeGeral.filter(c=> c.AJ_USID == this.usuarioLogado.US_USID &&
            formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                      && formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"))[0];
        })
  
        this.equipeService.DiasFechaMercado().subscribe((rk : number) => {
          this.diasFechaMercado = rk["DiasFechaMercado"];
        })
  
        this.equipeService.Mercadofechado().subscribe((rk : number) => {
          this.mercadoFechado = rk["Mercadofechado"];
        })
  
        
  
        this.equipeService.PontuacaoUltimaRodada().subscribe((rk : RankingEquipe[]) => {
          this.PontuacaoUltimaRodada = rk.filter(c=> formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
          && formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));;
        })
  
        this.dashBoardservice.OsSeusEscalados(this.usuarioLogado.US_USID).subscribe((jog : ApuracaoJogadores[]) => {
          if (jog["maisEscalados"] != undefined)
          {
            this.osSeusEscalados = jog["maisEscalados"]
            .filter(c=> formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
            && formatDate(c.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));

            console.log(this.osSeusEscalados);
            if (this.osSeusEscalados != null){
              if (this.osSeusEscalados.length > 0){
                for( i = 0;i < 3 ;i++) {
                  this.seusEscaladosJogador[i] = this.osSeusEscalados[i].AJ_JOAPELIDO
                  this.seusEscaladodClube[i] = this.osSeusEscalados[i].AJ_CLSIGLA
                  this.seusEscaladosTotal[i] = this.osSeusEscalados[i].AJ_AJPONTOS
                  this.seusEscaladosEmblema[i] = this.osSeusEscalados[i].AJ_CLEMBLEMA
                  this.seusEscaladosFoto[i] = this.osSeusEscalados[i].AJ_JOFOTO
                } 
              }
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
        // this.osMaiEscalados = jog["maisEscalados"];
        this.osMaiEscalados = jog["maisEscalados"].filter(j => formatDate(j.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                                            && formatDate(j.AJ_AJDATAVIGENTE,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));

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
        if (jog != null)
        {
          this.ptsCompeticao = jog.filter(j => formatDate(j.OBJ_COMPETICAO.CP_CPDATAINICIO,"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
                                          && formatDate(j.OBJ_COMPETICAO.CP_CPDATAINICIO,"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"));
        }                                        
      });
    });
  }
}
