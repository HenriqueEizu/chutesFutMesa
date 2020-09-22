import { DashboardService } from './../dashboard/dashboard.service';
import { JogosService } from './../jogos/jogos.service';
import { Jogos } from './../jogos/jogos.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

import {EquipeService} from '../equipe/equipe.service'
import { UsuarioService } from '../usuario/usuario.service';
import { Observable, EMPTY, bindCallback } from 'rxjs';
import { Usuario } from '../usuario/usuario.model';
import { Equipe, RankingJogadorStatus } from '../equipe/equipe.model';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { take, switchMap } from 'rxjs/operators';
import { EquipeJogadorService } from './equipe-jogador.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { PARAMETROSSISTEMAS } from '../dashboard/dashboard.model';

@Component({
  selector: 'cft-equipe-jogador',
  templateUrl: './equipe-jogador.component.html',
  styleUrls: ['./equipe-jogador.component.css']
})
export class EquipeJogadorComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = true;
  isLoggedIn$: Observable<boolean>;
  usuarioLogado : Usuario = null;
  EquipeUsuario : Equipe = null;
  imageCardEquipe : string
  imgJogadoresEscalados: string[];
  NomeJogadoresEscalados: string[];
  idJogadoresEscalados : number[];
  idClubeJogadoresEscalados : number[];
  NomeClubeJogadoresEscalados: string[];
  valoresJogadores : number[];
  JogadoreEscalados: RankingJogadorStatus[];
  Jogadores : RankingJogadorStatus[]
  JogadoresFiltro : RankingJogadorStatus[];
  JogadoresCislpa : RankingJogadorStatus[]
  intNumeroJogEscalados: number = 0;
  intTotalPtsEquipe : number = 0;
  intTotalDisponivel : number = 800;
  blnBotaoOrdenarRank : boolean = true;
  blnOrdenarPorClube1 : boolean = true;
  blnOrdenarPorClube2 : boolean = true;
  blnOrdenarPorClube : boolean = true;
  blnOrdenarPorJogador : boolean = true;
  blnOrdenarPorStatus : boolean = true;
  blnOrdenarPorValor : boolean = true;
  blnOrdenarPorRanking : boolean = true;
  blnOrdenarPorRodada : boolean = true;
  blnOrdenarPorData : boolean = true;
  blnOrdenarPorCompeticao : boolean = true;
  escalado: boolean = false;
  faltaEscalar : number = 6;
  blnVenderTudo : boolean = true;
  tabelaJogos : Jogos[];
  mercadoFechado : number;
  diasFechaMercado : number;
  parametros : PARAMETROSSISTEMAS;
  
  constructor(private equipeService: EquipeService
    ,private usuarioService: UsuarioService
    ,private alertService: AlertModalService
    ,private equipeJogadorService :EquipeJogadorService
    ,private jogoService : JogosService
    ,private dashBoardservice : DashboardService
    , private router: Router) { }

  ngOnInit(): void {

    this.isLoggedIn$ = this.usuarioService.isLoggedIn;

    var i:number; 
    
    this.imgJogadoresEscalados = ["","","","","",""];
    this.NomeJogadoresEscalados = ["","","","","",""];
    this.valoresJogadores = [0,0,0,0,0,0];
    this.idJogadoresEscalados = [0,0,0,0,0,0];
    this.JogadoreEscalados= [null,null,null,null,null,null];
    this.idClubeJogadoresEscalados  = [0,0,0,0,0,0];
    this.NomeClubeJogadoresEscalados = ["","","","","",""];
    
    this.dashBoardservice.CarregaParametros().subscribe((pa : PARAMETROSSISTEMAS) => {
      this.parametros = pa[0]
      this.jogoService.TabelaJogos().subscribe((jog : Jogos[]) => {
        this.tabelaJogos = jog.filter(f => formatDate(new Date(f.OBJ_COMPETICAO.CP_CPDATAINICIO),"yyy-MM-dd","en-US") > formatDate(this.parametros.PS_PDDATAINICIOTEMPORADA,"yyy-MM-dd","en-US")
           && formatDate(new Date(f.OBJ_COMPETICAO.CP_CPDATAINICIO),"yyy-MM-dd","en-US") < formatDate(this.parametros.PS_PDDATAFIMTEMPORADA,"yyy-MM-dd","en-US"))
          .sort((a, b) => a.OBJ_COMPETICAO.CP_CPDATAINICIO  > b.OBJ_COMPETICAO.CP_CPDATAINICIO ? -1 : 1);
      });

    });
    
    this.equipeService.Mercadofechado().subscribe((rk : number) => {
      this.mercadoFechado = rk["Mercadofechado"];
    })

    this.equipeService.DiasFechaMercado().subscribe((rk : number) => {
      this.diasFechaMercado = rk["DiasFechaMercado"];
    })
    

    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
      this.equipeService.GetEquipeIdPorusuario(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
        this.EquipeUsuario = jog;
        console.log(this.EquipeUsuario);
        this.equipeService.GetRankingJogadorStatus(this.usuarioLogado.US_USID).subscribe((jog : RankingJogadorStatus[]) => {
          this.JogadoresCislpa = jog.filter( j => j.JO_JOAPELIDO == 'zzzz');
    
        });
        this.equipeService.GetRankingJogadorStatus(this.usuarioLogado.US_USID).subscribe((jog : RankingJogadorStatus[]) => {
          this.JogadoresCislpa = jog.filter( j => j.JO_JOAPELIDO == 'zzzz');
    
        });
        this.equipeService.GetRankingJogadorStatus(this.usuarioLogado.US_USID).subscribe((jog : RankingJogadorStatus[]) => {
          this.Jogadores = jog;
          this.JogadoresFiltro = jog;
          this.JogadoreEscalados = this.Jogadores.filter(f => f.EQ_EQID > 0)
          if (this.JogadoreEscalados.length > 0){
            for( i = 0;i< this.JogadoreEscalados.length;i++) {
              this.imgJogadoresEscalados[i] = this.JogadoreEscalados[i].JO_JOFOTO
              this.NomeJogadoresEscalados[i] = this.JogadoreEscalados[i].JO_JOAPELIDO
              this.valoresJogadores[i] = this.JogadoreEscalados[i].PR_PRPRECO
              this.idJogadoresEscalados[i] = this.JogadoreEscalados[i].JO_JOID
              this.idClubeJogadoresEscalados[i]  = this.JogadoreEscalados[i].CL_CLID
              this.NomeClubeJogadoresEscalados[i] = this.JogadoreEscalados[i].CL_CLEMBLEMA
              this.intNumeroJogEscalados ++;
              this.faltaEscalar --
              this.intTotalPtsEquipe = this.intTotalPtsEquipe + this.JogadoreEscalados[i].PR_PRPRECO
            } 
            this.intTotalDisponivel = this.intTotalDisponivel - this.intTotalPtsEquipe;
          }
        });
      });
    });
  }

  FiltraJogador(strCriterio : string){
    if (this.JogadoresCislpa != undefined && this.JogadoresCislpa.length > 0){
      if (strCriterio.length == 0){
          this.JogadoresFiltro = this.Jogadores.filter( j=> j.JO_JOID != this.JogadoresCislpa[0].JO_JOID);
      }else{
          this.JogadoresFiltro = this.Jogadores.filter(c => c.JO_JOAPELIDO.toLowerCase().indexOf(strCriterio.toLowerCase()) > -1 && c.JO_JOID != this.JogadoresCislpa[0].JO_JOID);
      }
    }else{
      if (strCriterio.length == 0){
        this.JogadoresFiltro = this.Jogadores;
      }else{
        this.JogadoresFiltro = this.Jogadores.filter(c => c.JO_JOAPELIDO.toLowerCase().indexOf(strCriterio.toLowerCase()) > -1);
      }
    }
  }

  OrdenarPorRanking(){
    if (this.blnBotaoOrdenarRank ==  true){
      this.JogadoresFiltro.sort(function(a, b){return a.RJ_RJPOSICAOATUAL - b.RJ_RJPOSICAOATUAL});
      this.blnBotaoOrdenarRank = false;
    }
    else{
      this.JogadoresFiltro.sort(function(a, b){return b.RJ_RJPOSICAOATUAL - a.RJ_RJPOSICAOATUAL});
      this.blnBotaoOrdenarRank = true;
    }
  }

  JogadoresOrdenarPor(campo : string, blnEnable : boolean){
    if (blnEnable ==  true){
      switch  (campo)
      {
        case "clube":
          this.JogadoresFiltro.sort((a, b) => a.CL_CLSIGLA  > b.CL_CLSIGLA ? -1 : 1);
          this.blnOrdenarPorClube = false;
          break;
        case "jogador":
          this.JogadoresFiltro.sort((a, b) => a.JO_JOAPELIDO  > b.JO_JOAPELIDO ? -1 : 1);
          this.blnOrdenarPorJogador = false;
          break;
        case "status":
          this.JogadoresFiltro.sort((a, b) => a.JO_JOATIVO  > b.JO_JOATIVO ? -1 : 1);
          this.blnOrdenarPorStatus = false;
          break;
        case "valor":
          this.JogadoresFiltro.sort(function(a, b){return a.PR_PRPRECO - b.PR_PRPRECO});
          this.blnOrdenarPorValor = false;
          break;
        case "ranking":
          this.JogadoresFiltro.sort(function(a, b){return a.RJ_RJPOSICAOATUAL - b.RJ_RJPOSICAOATUAL});
          this.blnOrdenarPorRanking = false;
          break;
      }
    }
    else{
      switch  (campo)
      {
        case "clube":
          this.JogadoresFiltro.sort((a, b) => b.CL_CLSIGLA  > a.CL_CLSIGLA ? -1 : 1);
          this.blnOrdenarPorClube = true;
          break;
        case "jogador":
          this.JogadoresFiltro.sort((a, b) => b.JO_JOAPELIDO  > a.JO_JOAPELIDO ? -1 : 1);
          this.blnOrdenarPorJogador = true;
          break;
        case "status":
          this.JogadoresFiltro.sort((a, b) => b.JO_JOATIVO  > a.JO_JOATIVO ? -1 : 1);
          this.blnOrdenarPorStatus = true;
          break;
        case "valor":
          this.JogadoresFiltro.sort(function(a, b){return b.PR_PRPRECO - a.PR_PRPRECO});
          this.blnOrdenarPorValor = true;
          break;
        case "ranking":
          this.JogadoresFiltro.sort(function(a, b){return b.RJ_RJPOSICAOATUAL - a.RJ_RJPOSICAOATUAL});
          this.blnOrdenarPorRanking = true;
          break;
      }
    }
  }

  OrdenarPor(campo : string, blnEnable : boolean){

    let dataCompeticao1 : Date;
    var dataCompeticao2 : Date;
    if (blnEnable ==  true){
      switch  (campo)
      {
        case "clube1":
          this.tabelaJogos.sort(function(a, b){return a.OBJ_CLUBE1.CL_CLID - b.OBJ_CLUBE1.CL_CLID});
          this.blnOrdenarPorClube1 = false;
          break;
        case "clube2":
          this.tabelaJogos.sort(function(a, b){return a.OBJ_CLUBE2.CL_CLID - b.OBJ_CLUBE2.CL_CLID});
          this.blnOrdenarPorClube2 = false;
          break;
        case "rodada":
          this.tabelaJogos.sort(function(a, b){return a.OBJ_COMPETICAO.OBJ_Rodada.RO_ROID - b.OBJ_COMPETICAO.OBJ_Rodada.RO_ROID});
          this.blnOrdenarPorRodada = false;
          break;
        case "data":
          this.tabelaJogos.sort(function(a, b) { 
            dataCompeticao1 = new Date(a.OBJ_COMPETICAO.CP_CPDATAINICIO)
            dataCompeticao2 = new Date(b.OBJ_COMPETICAO.CP_CPDATAINICIO)
            console.log(dataCompeticao1)
            console.log(dataCompeticao2)
            return Number(dataCompeticao1) - Number(dataCompeticao2)
          });
          this.blnOrdenarPorData = false;
          break;
        case "competicao":
          this.tabelaJogos.sort(function(a, b){return a.OBJ_COMPETICAO.CP_CPID - b.OBJ_COMPETICAO.CP_CPID});
          this.blnOrdenarPorCompeticao = false;
          break;
      }
    }
    else{
      switch  (campo)
      {
        case "clube1":
          this.tabelaJogos.sort(function(a, b){return b.OBJ_CLUBE1.CL_CLID - a.OBJ_CLUBE1.CL_CLID});
          this.blnOrdenarPorClube1 = true;
          break;
        case "clube2":
          this.tabelaJogos.sort(function(a, b){return b.OBJ_CLUBE2.CL_CLID - a.OBJ_CLUBE2.CL_CLID});
          this.blnOrdenarPorClube2 = true;
          break;
        case "rodada":
          this.tabelaJogos.sort(function(a, b){return b.OBJ_COMPETICAO.OBJ_Rodada.RO_ROID - a.OBJ_COMPETICAO.OBJ_Rodada.RO_ROID});
          this.blnOrdenarPorRodada = true;
          break;
        case "data":
          this.tabelaJogos.sort(function(a, b) { 
            dataCompeticao1 = new Date(b.OBJ_COMPETICAO.CP_CPDATAINICIO)
            dataCompeticao2 = new Date(a.OBJ_COMPETICAO.CP_CPDATAINICIO)
            console.log(dataCompeticao1)
            console.log(dataCompeticao2)
            return Number(dataCompeticao1) - Number(dataCompeticao2)
           });
          this.blnOrdenarPorData = true;
          break;
        case "competicao":
          this.tabelaJogos.sort(function(a, b){return b.OBJ_COMPETICAO.CP_CPID - a.OBJ_COMPETICAO.CP_CPID});
          this.blnOrdenarPorCompeticao = true;
          break;
      }
    }
  }

  RemoverJogadorImagem(id :number,blnNaoAparecerMsg:boolean = false){
    if (this.mercadoFechado != 0){
      return;
    }
    var strJogador : string;
    strJogador = this.NomeJogadoresEscalados[id]
    let jogadorCortado : RankingJogadorStatus;
    jogadorCortado = this.JogadoresFiltro.filter(c=> c.JO_JOAPELIDO == this.NomeJogadoresEscalados[id])[0];
    if (jogadorCortado != undefined){
      this.JogadoresFiltro.filter(c=> c.JO_JOID == jogadorCortado.JO_JOID).map( h=> h.EQ_EQID = null);
      this.imgJogadoresEscalados[id] = "";
      this.NomeJogadoresEscalados[id] = "";
      this.valoresJogadores[id] = 0;
      this.idJogadoresEscalados[id] = 0;
      this.idClubeJogadoresEscalados[id] = 0;
      this.NomeClubeJogadoresEscalados[id] = "";
      this.intNumeroJogEscalados --;
      this.faltaEscalar ++ ;
      this.intTotalPtsEquipe = this.intTotalPtsEquipe - jogadorCortado.PR_PRPRECO;
      this.intTotalDisponivel = this.intTotalDisponivel + jogadorCortado.PR_PRPRECO;
      if (blnNaoAparecerMsg == false){
        this.alertService.showAlertSuccess("Jogador  " + strJogador + "  removido com sucesso");
      }
    }
  }

  RemoverJogador(jogador :  RankingJogadorStatus){
    var strJogador : string;
    var i : number;
    strJogador = jogador.JO_JOAPELIDO;
    let jogadorCortado : RankingJogadorStatus;
    jogadorCortado = this.JogadoresFiltro.filter(c=> c.JO_JOAPELIDO == jogador.JO_JOAPELIDO)[0];
    this.JogadoresFiltro.filter(c=> c.JO_JOID == jogadorCortado.JO_JOID).map( h=> h.EQ_EQID = null);
    for (i = 0; i <= 5; i++)
    {
      if (this.NomeJogadoresEscalados[i] == jogador.JO_JOAPELIDO)
      {
        this.imgJogadoresEscalados[i] = "";
        this.NomeJogadoresEscalados[i] = "";
        this.valoresJogadores[i] = 0;
        this.idJogadoresEscalados[i] = 0;
        this.idClubeJogadoresEscalados[i]  = 0;
        this.NomeClubeJogadoresEscalados[i] = "";
        this.intNumeroJogEscalados --;
        this.faltaEscalar ++ ;
        break;
      }
    }
    
    this.intTotalPtsEquipe = this.intTotalPtsEquipe - jogadorCortado.PR_PRPRECO;
    this.intTotalDisponivel = this.intTotalDisponivel + jogadorCortado.PR_PRPRECO;;
    this.alertService.showAlertSuccess("Jogador  " + strJogador + "  removido com sucesso");
  }

  EscalaJogador(jogador :  RankingJogadorStatus){
    var j : number;
    
    if (this.intNumeroJogEscalados < 6)
    {
      for(j=0; j <= this.intNumeroJogEscalados; j ++ ){
        if (this.imgJogadoresEscalados[j] == ""){
          if (this.intTotalDisponivel < jogador.PR_PRPRECO){
            this.alertService.showAlertDanger("Quantia disponível insuficiente para compra deste jogador.") ;
            return;
          }
          this.imgJogadoresEscalados[j] = jogador.JO_JOFOTO;
          this.NomeJogadoresEscalados[j] = jogador.JO_JOAPELIDO;
          this.valoresJogadores[j] = jogador.PR_PRPRECO;
          this.idJogadoresEscalados[j] = jogador.JO_JOID;
          this.idClubeJogadoresEscalados[j]  = jogador.CL_CLID;
          this.NomeClubeJogadoresEscalados[j] = jogador.CL_CLEMBLEMA
          this.JogadoreEscalados[j] = jogador;
          this.escalado = true;
          this.intTotalPtsEquipe = this.intTotalPtsEquipe + jogador.PR_PRPRECO
          this.intTotalDisponivel = this.intTotalDisponivel - jogador.PR_PRPRECO;
          break;
        } 
      }
      
       this.intNumeroJogEscalados ++;
       this.faltaEscalar -- ;
      jogador.EQ_EQID = 1;
      this.alertService.showAlertSuccess("Jogador  " + jogador.JO_JOAPELIDO + "  inserido com sucesso");
    }
    else{
      this.alertService.showAlertDanger("Já foram escalados 6 jogadores.") ;
    }
  }

  HabilitarSalvar(): boolean{

    var blnEscalados : boolean = true ;
    var j : number;

    if (this.mercadoFechado != 0){
      return true;
    }

    for(j=0; j <= this.NomeJogadoresEscalados.length; j ++ ){
      if (this.NomeJogadoresEscalados[j] == ""){
        blnEscalados = false;
        break;
      }else{
        this.blnVenderTudo = false;
      }
    }
    return !blnEscalados;
  }

  SalvarEscalacaoEquipe(){

    const result$ = this.alertService.showConfirm("Confirmação de Inclusão","Você realmente deseja salvar seu time?","Fechar","Salvar");
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.equipeJogadorService.SalvarEquipeEscalacao(this.EquipeUsuario,this.idJogadoresEscalados) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess("Time salvo com sucesso");
                    this.router.navigate(['dashboard'])
                    },
        error =>  {
                  this.alertService.showAlertDanger("Erro ao salvar time") ;
                  }
      )
  }

  VenderTudo(){
    var i : number;
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja vender todo o seu time?","Fechar","Vender");
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.equipeJogadorService.ExcluirEquipeEscalacao(this.EquipeUsuario) : EMPTY)
      ).subscribe(
        success => {
                    for (i = 0; i <= 5; i++)
                    {
                      this.RemoverJogadorImagem(i,true);
                    }
                    this.blnVenderTudo = true;
                    this.alertService.showAlertSuccess("Time excluido com sucesso");
                    },
        error =>  {
                  this.alertService.showAlertDanger("Erro ao excluir time") ;
                  }
      )
  }

}

