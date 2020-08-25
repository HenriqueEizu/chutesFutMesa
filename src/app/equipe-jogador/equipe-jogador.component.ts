import { Component, OnInit, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

import {EquipeService} from '../equipe/equipe.service'
import { UsuarioService } from '../usuario/usuario.service';
import { Observable, EMPTY } from 'rxjs';
import { Usuario } from '../usuario/usuario.model';
import { Equipe, RankingJogadorStatus } from '../equipe/equipe.model';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { take, switchMap } from 'rxjs/operators';
import { EquipeJogadorService } from './equipe-jogador.service';
import { Router } from '@angular/router';

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
  blnBotaoOrdenarRank : boolean = true;
  escalado: boolean = false;
  faltaEscalar : number = 6;
  blnVenderTudo : boolean = true;
  
  constructor(private equipeService: EquipeService
    ,private usuarioService: UsuarioService
    ,private alertService: AlertModalService
    ,private equipeJogadorService :EquipeJogadorService
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
    

    

    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
      this.equipeService.GetEquipeId(this.usuarioLogado.US_USID).subscribe((jog : Equipe) => {
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


    // if (this.blnBotaoOrdenarRank ==  true){
    //   this.JogadoresFiltro = this.Jogadores.sort(function(a, b){return a - b})
    // }
  }
  RemoverJogadorImagem(id :number,blnNaoAparecerMsg:boolean = false){
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
    this.alertService.showAlertSuccess("Jogador  " + strJogador + "  removido com sucesso");
  }

  EscalaJogador(jogador :  RankingJogadorStatus){
    var j : number;
    
    if (this.intNumeroJogEscalados < 6)
    {
      for(j=0; j <= this.intNumeroJogEscalados; j ++ ){
        if (this.imgJogadoresEscalados[j] == ""){
          this.imgJogadoresEscalados[j] = jogador.JO_JOFOTO;
          this.NomeJogadoresEscalados[j] = jogador.JO_JOAPELIDO;
          this.valoresJogadores[j] = jogador.PR_PRPRECO;
          this.idJogadoresEscalados[j] = jogador.JO_JOID;
          this.idClubeJogadoresEscalados[j]  = jogador.CL_CLID;
          this.NomeClubeJogadoresEscalados[j] = jogador.CL_CLEMBLEMA
          this.JogadoreEscalados[j] = jogador;
          this.escalado = true;
          this.intTotalPtsEquipe = this.intTotalPtsEquipe + jogador.PR_PRPRECO
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
                    this.router.navigate(['equipes'])
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

