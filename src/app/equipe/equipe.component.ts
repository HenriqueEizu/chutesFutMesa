import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate, DatePipe} from "@angular/common";
import {switchMap, take, map, delay, tap} from  'rxjs/operators'
import {Observable} from 'rxjs'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../shared/alertmodal/alertmodal.service'
import {  EMPTY , Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router'
import { IFormCanDeactivate } from '../guards/form-deactivate';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatAccordion} from '@angular/material/expansion';


import {EquipeService} from './equipe.service'
import {JogadorService} from '../jogadores/jogador.service'
import {DIR_EQUIPE} from '../app.api'
import {Equipe,ImagemEscudo,RankingJogadorStatus, RankingEquipe} from './equipe.model'
import { Jogador } from '../jogadores/jogador.model';
import { Usuario } from '../usuario/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'cft-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css'],
  providers: []  // add NgbCarouselConfig to the component providers
})
export class EquipeComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

 
   
  panelOpenState = true;
  pathImage = DIR_EQUIPE;
  image = "Equipe.png"
  pathimagecomplete = DIR_EQUIPE + this.image;
  imageEscolhida : string;
  equipeCarregada : Equipe;
  equipe : any;
  equipeForm: FormGroup
  equipeSelecionado: Equipe;
  myDate = new Date();
  fileToUpload: File = null;
  Escudos : ImagemEscudo[];
  EscudosFiltro : ImagemEscudo[];
  EscudosEscolhido : ImagemEscudo[];
  Jogadores : RankingJogadorStatus[]
  JogadoresCislpa : RankingJogadorStatus[]
  JogadoresFiltro : RankingJogadorStatus[];
  imageCardEquipe : ImagemEscudo ;
  strImageEscudo : string;
  nomeEquipe : string;
  JogadoreEscalados: RankingJogadorStatus[];
  rankingEquipe :RankingEquipe[];
  posicaoEquipe : RankingEquipe;
  PosicaoEquipe : Number;
  pontosEquipe : Number;
  imgJogadoresEscalados: string[];
  NomeJogadoresEscalados: string[];
  idJogadoresEscalados : number[];
  valoresJogadores : number[];
  intNumeroJogEscalados: number = 0;
  escalado: boolean = false;
  isLoggedIn$: Observable<boolean>;
  usuarioLogadoObs : Observable<Usuario>;
  usuarioLogado : Usuario;
  intTotalPtsEquipe : number = 0;
  blnBotaoOrdenarRank : boolean = true;

  constructor(private equipeService: EquipeService
    , private router: Router
    , private formBuilder : FormBuilder
    , private modalService: BsModalService
    ,private alertService: AlertModalService
    ,private route: ActivatedRoute
    ,private jogadorService : JogadorService
    ,private usuarioService: UsuarioService
    ){

}


  ngOnInit(): void {
    var i:number; 
    
    this.imgJogadoresEscalados = ["","","","","",""];
    this.NomeJogadoresEscalados = ["","","","","",""];
    this.valoresJogadores = [0,0,0,0,0,0];
    this.idJogadoresEscalados = [0,0,0,0,0,0];
    this.JogadoreEscalados= [null,null,null,null,null,null];
    
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
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
          this.strImageEscudo = this.JogadoreEscalados[i].EQ_EQESCUDO
          this.nomeEquipe = this.JogadoreEscalados[i].EQ_EQNOME
          this.intNumeroJogEscalados ++;
          this.intTotalPtsEquipe = this.intTotalPtsEquipe + this.JogadoreEscalados[i].PR_PRPRECO
        } 
      }
      this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
        this.EscudosEscolhido = jog.filter(c => c.IM_IMPATH == this.strImageEscudo);
        this.imageCardEquipe = jog.filter(c => c.IM_IMATIVO == false)[0];
      });
      this.equipeService.GetRankingEquipes(false).subscribe((rEqui : RankingEquipe[]) => {
        this.posicaoEquipe = rEqui.filter(e => e.AJ_EQNOME == this.nomeEquipe)[0];
        this.PosicaoEquipe = this.posicaoEquipe.POSICAO;
        this.pontosEquipe = this.posicaoEquipe.TOTAL;
      })
    });

    this.equipeService.GetRankingEquipes(false).subscribe((rEqui : RankingEquipe[]) => {
      this.posicaoEquipe = rEqui.filter(e => e.AJ_EQNOME == this.nomeEquipe)[0];
    })

    this.equipeService.GetRankingEquipes(false).subscribe((rEqui : RankingEquipe[]) => {
      this.rankingEquipe = rEqui;
    })

    

    this.equipeService.GetRankingJogadorStatus(this.usuarioLogado.US_USID).subscribe((jog : RankingJogadorStatus[]) => {
      this.JogadoresCislpa = jog.filter( j => j.JO_JOAPELIDO == 'zzzz');

    });

    this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
      this.EscudosFiltro = jog.filter(c => c.IM_IMATIVO == true);;
    });

    this.equipe = this.route.snapshot.data['equipe'];
    this.equipeCarregada =this.equipe;
    

    if (this.equipe.EQ_EQESCUDO != "" && this.equipe.EQ_EQESCUDO != null){
      this.pathimagecomplete = this.equipe.EQ_EQESCUDO;
    }

    this.equipeForm = this.formBuilder.group({
      EQ_EQID : [this.equipe.EQ_EQID],
      EQ_EQNOME: this.formBuilder.control(this.equipe.EQ_EQNOME,[Validators.required, Validators.minLength(6),Validators.maxLength(300)],[this.ValidaNomeEquipe.bind(this)]),
      EQ_EQESCUDO: this.formBuilder.control(this.equipe.EQ_EQESCUDO),
      EQ_EQATIVO: this.formBuilder.control(this.equipe.EQ_EQATIVO),
      EQ_EQOBSERVACAO: this.formBuilder.control(this.equipe.EQ_EQOBSERVACAO,Validators.maxLength(300)),
    },);

  }

  VerificaNomeEquipe(NomeEquipe:string, NomeEquipe2:string ="clube"){
    return this.equipeService.VerificaEquipe().pipe(
      delay(3000),
      map((dados: {clubes : any[]}) => dados.clubes),
      tap(console.log),
      map((dados: {nomeEquipe : string}[]) => dados.filter(v => v.nomeEquipe.toUpperCase() === NomeEquipe.toUpperCase() && v.nomeEquipe.toUpperCase() != NomeEquipe2.toUpperCase() )),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }

  ValidaNomeEquipe(formControl : FormControl)
  {
    return this.VerificaNomeEquipe(formControl.value, this.equipe.EQ_EQNOME != null ? this.equipe.EQ_EQNOME : ""  ).pipe(
      tap(console.log),
      map(equipeExiste => equipeExiste ? {nomeEquipeInvalido: true} : null )
    );
  }
 
  drop(event: CdkDragDrop<string[]>) {
    let countJog = this.JogadoresFiltro.length;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length < 6 || event.container.data.length == (countJog)){
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }else{
        this.alertService.showAlertDanger("A equipe deve ter no máximo 6 jogadores") ;
      }
    }
  }
  dropEscudo(event: CdkDragDrop<string[]>) {
    let countEscudo = this.EscudosFiltro.length;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length == 0 || event.container.data.length == (countEscudo)){
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
                          this.imageCardEquipe = event.container.data[0] as unknown  as ImagemEscudo;
                          this.strImageEscudo = this.imageCardEquipe.IM_IMPATH
                          alert (this.imageCardEquipe.IM_IMPATH)
      }else{
        this.alertService.showAlertDanger("Remover escudo existente") ;
      }
    }
  }

  RemoverJogador(id :number){
    var strJogador : string;
    strJogador = this.NomeJogadoresEscalados[id]
    let jogadorCortado : RankingJogadorStatus;
    jogadorCortado = this.JogadoresFiltro.filter(c=> c.JO_JOAPELIDO == this.NomeJogadoresEscalados[id])[0];
    this.JogadoresFiltro.filter(c=> c.JO_JOID == jogadorCortado.JO_JOID).map( h=> h.EQ_EQID = 0);
    this.imgJogadoresEscalados[id] = "";
    this.NomeJogadoresEscalados[id] = "";
    this.valoresJogadores[id] = 0;
    this.idJogadoresEscalados[id] = 0;
    this.intNumeroJogEscalados --;
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
          this.JogadoreEscalados[j] = jogador;
          this.escalado = true;
          this.intTotalPtsEquipe = this.intTotalPtsEquipe + jogador.PR_PRPRECO
          break;
        }
      }
       this.intNumeroJogEscalados ++;
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
      }
    }

    if (this.equipeForm.valid == true && this.EscudosEscolhido.length > 0 && blnEscalados){
      return false;
    }
    return true;
  }

  podeDesativar() {
    return true;
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


  SalvarEquipe(equipe: Equipe){
    let msgSuccess = "Equipe inserido com sucesso";
    let msgErro = "Erro ao incluir equipe. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir esta equipe?"
    let msgBotao = "Inserir"
    if (this.equipeForm.value.CP_CPID != null){
      msgSuccess = "Equipe alterada com sucesso";
      msgErro = "Erro ao atualizar equipe. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar esta equipe?"
      msgBotao = "Alterar"
    }

    this.equipeSelecionado = equipe;
    equipe.EQ_EQESCUDO = this.strImageEscudo;
    equipe.EQ_USID = this.usuarioLogado.US_USID

    equipe.EQ_EQDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.equipeService.SalvarEquipe(equipe,this.idJogadoresEscalados) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['equipes'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )}



}
