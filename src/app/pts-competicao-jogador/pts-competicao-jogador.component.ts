import { JogosService } from './../jogos/jogos.service';
import { Component, OnInit, Input, ViewChild, ɵConsole} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate, DatePipe} from "@angular/common";
import {switchMap, take, map, delay, tap} from  'rxjs/operators'
import {Observable} from 'rxjs'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../shared/alertmodal/alertmodal.service'
import {  EMPTY , Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router'
import { IFormCanDeactivate } from '../guards/form-deactivate';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

import {PtsCompeticaoJogadorService} from './pts-competicao-jogador.service'
import {PtsCompeticaoJogador} from './PtsCompeticaoJogador.model'
import { Competicao } from './../competicao/competicao.model';
import { Jogador } from './../jogadores/jogador.model';
import { CompeticaoService } from './../competicao/competicao.service';
import { JogadorService } from './../jogadores/jogador.service';
import { Jogos } from '../jogos/jogos.model';

@Component({
  selector: 'cft-pts-competicao-jogador',
  templateUrl: './pts-competicao-jogador.component.html',
  styleUrls: ['./pts-competicao-jogador.component.css']
})
export class PtsCompeticaoJogadorComponent implements OnInit {

  ptscompeticaojogadorCarregada : PtsCompeticaoJogador;
  ptscompeticaojogador : any;
  ptscompeticaojogadorForm: FormGroup
  ptscompeticaojogadorSelecionado: PtsCompeticaoJogador;
  numberPattern = /^-?(0|[1-9]\d*)?$/
  myDate = new Date();
  competicoes : Competicao[];
  jogadores : Jogador[];
  competicaoId : Competicao;
  jogadorId : Jogador = null;
  show = false;
  autohide = true;
  showJogadores = false;
  autohideJog = true;
  anos : number[] ;
  jogos : Jogos[];
  jogoId : Jogos = null;
  showJogo = false;
  autohideJogo = true; 


  constructor(private ptscompeticaojogadorService: PtsCompeticaoJogadorService
    , private router: Router
    , private formBuilder : FormBuilder
    , private modalService: BsModalService
    ,private alertService: AlertModalService
    ,private route: ActivatedRoute
    ,private competicaoService : CompeticaoService
    ,private jogadorService : JogadorService
    ,private jogosServ: JogosService){

}

  ngOnInit(): void {

    
    this.competicaoService.GetAllCompeticao().subscribe((cp : Competicao[]) => {
      this.competicoes = cp.filter(c=>c.CP_CPATIVO == true);
      });

    this.competicaoService.GetAnoCompeticao().subscribe(( cp : number[]) => {
      this.anos = cp;
      if (this.ptscompeticaojogador.ano != null){
        this.FiltraCompeticao(this.ptscompeticaojogador.ano);
      }
    })

    this.jogadorService.GetAllJogador().subscribe((jo : Jogador[]) => {
      this.jogadores = jo.filter(j=>j.JO_JOATIVO == true);
      });

    this.ptscompeticaojogador = this.route.snapshot.data['ptscompeticaojogador']; 
    console.log(this.ptscompeticaojogador.PJ_PJID + "sssssssssssssssssss")
    if (this.ptscompeticaojogador.PJ_PJID != null){
      // this.FiltraCompeticao(this.ptscompeticaojogador.ano);
      this.competicaoService.GetAllCompeticao().subscribe(( cp : Competicao[]) => {
        this.competicoes = cp;
        this.jogosServ.GetAllJogos().subscribe((es : Jogos[]) => {
          this.jogos = es;
        });
      })
    } 

    this.ptscompeticaojogadorCarregada =this.ptscompeticaojogador;

    this.ptscompeticaojogadorForm = this.formBuilder.group({
      PJ_PJID : [this.ptscompeticaojogador.PJ_PJID],
      ano: this.formBuilder.control(this.ptscompeticaojogador.ano),
      PJ_CPID: this.formBuilder.control(this.ptscompeticaojogador.PJ_CPID,[Validators.required]),
      PJ_JOID: this.formBuilder.control(this.ptscompeticaojogador.PJ_JOID,[Validators.required]),
      PJ_PJPONTOS: this.formBuilder.control(this.ptscompeticaojogador.PJ_PJPONTOS,[Validators.required,Validators.pattern(this.numberPattern)]),
      PJ_PJOBSERVACAO: this.formBuilder.control(this.ptscompeticaojogador.PJ_PJOBSERVACAO),
      PJ_PJATIVO: this.formBuilder.control(this.ptscompeticaojogador.PJ_PJATIVO),
      PJ_PJCOLOCACAO : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJCOLOCACAO,[Validators.required,Validators.pattern(this.numberPattern)]),
      PJ_PJPONTOSGANHOS : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJPONTOSGANHOS,[Validators.pattern(this.numberPattern)]),
      PJ_PJJOGOS : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJJOGOS,[Validators.pattern(this.numberPattern)]),
      PJ_PJVITORIAS : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJVITORIAS,[Validators.pattern(this.numberPattern)]),
      PJ_PJEMPATE : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJEMPATE,[Validators.pattern(this.numberPattern)]),
      PJ_PJDERROTA : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJDERROTA,[Validators.pattern(this.numberPattern)]),
      PJ_PJGOLSPRO : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJGOLSPRO,[Validators.pattern(this.numberPattern)]),
      PJ_PJGOLCONTRA : this.formBuilder.control(this.ptscompeticaojogador.PJ_PJGOLCONTRA,[Validators.pattern(this.numberPattern)]),
      PJ_JGID: this.formBuilder.control(this.ptscompeticaojogador.PJ_JGID)
    });

  }

  
  FiltraCompeticao(strCriterio : string){
    this.competicaoService.GetAllCompeticao().subscribe(( cp : Competicao[]) => {
      this.competicoes = cp.filter( j=> j.CP_CPDATAINICIO.substr(0,4) == strCriterio && j.CP_CJID == 1);
    })
  }
  
  MostraRodada(id: number)
  {
    if (id == null || id == 0)
    return;
    this.show = true
    this.competicaoId = this.competicoes.filter(cp => cp.CP_CPID == id)[0];
    this.jogosServ.GetAllJogos().subscribe((es : Jogos[]) => {
      this.jogos = es.filter( c=> c.JG_CPID == id)
      this.jogoId = this.jogos[0];
      console.log(id)
      console.log(this.jogos);
    });
  }
  MostraJogador(id: number)
  {
    this.showJogadores = true
    this.jogadorId = this.jogadores.filter(j => j.JO_JOID == id)[0];
    
  }

  EscolhaJogo(id: number)
    {
      if (id == null || id == 0)
        return;
      this.showJogo = true
      this.jogoId = this.jogos.filter(cp => cp.JG_JGID == id)[0];
      this.jogadores = this.jogadores.filter(j => j.JO_CLID == this.jogoId.OBJ_CLUBE1.CL_CLID ||  j.JO_CLID == this.jogoId.OBJ_CLUBE2.CL_CLID)
    }


  podeDesativar() {
    return true;
  }

  SalvarCompeticao(ptscompeticaojogador: PtsCompeticaoJogador){
    let msgSuccess = "Pontuação de Competição inserido com sucesso";
    let msgErro = "Erro ao incluir pontuação de competição. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir esta pontuação de competição?"
    let msgBotao = "Inserir"
    if (this.ptscompeticaojogadorForm.value.PJ_PJID != null){
      msgSuccess = "Pontuação de Competição alterada com sucesso";
      msgErro = "Erro ao atualizar pontuação de competição. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar esta pontuação de competição?"
      msgBotao = "Alterar"
    }

    console.log(ptscompeticaojogador.PJ_JGID + "iiiiiiiiiiiii");

    ptscompeticaojogador.PJ_JGID = ptscompeticaojogador.PJ_JGID == null ? 0 : ptscompeticaojogador.PJ_JGID;
    ptscompeticaojogador.PJ_JGID = ptscompeticaojogador.PJ_JGID == 0 ? 0 : ptscompeticaojogador.PJ_JGID;
  
    ptscompeticaojogador.PJ_PJDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    ptscompeticaojogador.PJ_JOMATRICULA = this.jogadorId.JO_JOMATRICULA;
    ptscompeticaojogador.PJ_PJSALDOGOLS = ptscompeticaojogador.PJ_PJGOLSPRO - ptscompeticaojogador.PJ_PJGOLCONTRA
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.ptscompeticaojogadorService.SalvarPtsCompeticaoJogador(ptscompeticaojogador) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['ptscompeticoesjogadores'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )}


}
 