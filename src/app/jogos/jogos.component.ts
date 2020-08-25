import { Competicao, Rodadas } from './../competicao/competicao.model';

import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable, EMPTY, Subject,merge} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { delay, map, tap, filter, take, switchMap, distinctUntilChanged, debounceTime, debounce } from 'rxjs/operators';
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");

import {JogosService} from './jogos.service'
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { Jogos} from './jogos.model'
import { ClubeService } from './../clube/clube.service';
import { Clube } from '../clube/clube.model';
import { CompeticaoService } from '../competicao/competicao.service';

@Component({
  selector: 'cft-jogos',
  templateUrl: './jogos.component.html',
  styleUrls: ['./jogos.component.css']
})
export class JogosComponent implements OnInit {

  jogosForm: FormGroup
  jogo : any;
  numberPattern = /^[1-9]*$/
  clubes1 : Clube[];
  clubes2 : Clube[];
  imagemClube1 : string;
  imagemClube2 : string;
  competicoes : Competicao[];
  rodadas : Rodadas[];
  anos : number[] ;
  show = false;
  autohide = true;
  showJogadores = false;
  autohideJog = true;
  competicaoId : Competicao = null;

  constructor(private jogosService: JogosService
            , private competicaoService :CompeticaoService
            , private clubeService : ClubeService
            , private router: Router
            , private formBuilder : FormBuilder
            ,private route: ActivatedRoute
            ,private alertService: AlertModalService){
            }

  podeDesativar() {
    return true;
  }

  myDate = new Date();
    
  ngOnInit(): void {
   
    this.clubeService.GetAllClube().subscribe((cl : Clube[]) => {
      this.clubes1 = cl;
    });

    this.competicaoService.GetAnoCompeticao().subscribe(( cp : number[]) => {
      this.anos = cp;
    })



    this.jogo = this.route.snapshot.data['jogo'];

    this.jogosForm = this.formBuilder.group({
      JG_JGID: [this.jogo.JG_JGID],
      ano: this.formBuilder.control(null,[Validators.required]),
      JG_CPID: this.formBuilder.control(this.jogo.JG_CJID,[Validators.required]),
      JG_JGATIVO : this.formBuilder.control(this.jogo.JG_JGATIVO),
      JG_CLID1: this.formBuilder.control(this.jogo.JG_JOID1,[Validators.required]),
      JG_JGPTS1: this.formBuilder.control(this.jogo.JG_JGPTS1,[Validators.required, Validators.maxLength(3),Validators.pattern(this.numberPattern)]),
      JG_CLID2: this.formBuilder.control(this.jogo.JG_JOID1,[Validators.required]),
      JG_JGPTS2: this.formBuilder.control(this.jogo.JG_JGPTS2,[Validators.required, Validators.maxLength(3),Validators.pattern(this.numberPattern)]),
    })

  }

  MostraRodada(id: number)
  {
    if (String(id) != ''){
      this.show = true
      this.competicaoId = this.competicoes.filter(cp => cp.CP_CPID == id)[0];
    }
  }

  FiltraCompeticao(strCriterio : string){
    this.competicaoService.GetAllCompeticao().subscribe(( cp : Competicao[]) => {
      this.competicoes = cp.filter( j=> j.CP_CPDATAINICIO.substr(0,4) == strCriterio && j.CP_CJID == 1);
    })
  }

  FiltraClube(Criterio : number){
    this.clubes2 = this.clubes1.filter(c => c.CL_CLID != Criterio);
    this.imagemClube1 = this.clubes1.filter(c => c.CL_CLID == Criterio)[0].CL_CLEMBLEMA;
  }
  FiltraClube2(Criterio : number){
    this.imagemClube2 = this.clubes1.filter(c => c.CL_CLID == Criterio)[0].CL_CLEMBLEMA;
  }

  
  SalvarJogo(jogo: Jogos){
    let msgSuccess = "Jogo inserido com sucesso";
    let msgErro = "Erro ao incluir jogo. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir este Jogo?"
    let msgBotao = "Inserir"
    if (this.jogosForm.value.JO_JOID != null){
      msgSuccess = "Jogo alterado com sucesso";
      msgErro = "Erro ao atualizar Jogo. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar este Jogo?"
      msgBotao = "Alterar"
    }

    jogo.JG_JGPG1 = jogo.JG_JGPTS1 > jogo.JG_JGPTS2 ? 3 : jogo.JG_JGPTS1 == jogo.JG_JGPTS2 ? 1 : 0;
    jogo.JG_JGSG1 = jogo.JG_JGPTS1 - jogo.JG_JGPTS2;
    jogo.JG_JGVITORIA1 = jogo.JG_JGPTS1 > jogo.JG_JGPTS2 ? 1 : 0;
    jogo.JG_JGEMPATE1 = jogo.JG_JGPTS1 == jogo.JG_JGPTS2 ? 1 : 0;
    jogo.JG_DERROTA1 = jogo.JG_JGPTS1 < jogo.JG_JGPTS2 ? 1 : 0;

    jogo.JG_JGPG2 = jogo.JG_JGPTS2 > jogo.JG_JGPTS1 ? 3 : jogo.JG_JGPTS2 == jogo.JG_JGPTS1 ? 1 : 0;
    jogo.JG_JGSG2 = jogo.JG_JGPTS2 - jogo.JG_JGPTS1;
    jogo.JG_JGVITORIA2 = jogo.JG_JGPTS2 > jogo.JG_JGPTS1 ? 1 : 0;
    jogo.JG_JGEMPATE2 = jogo.JG_JGPTS2 == jogo.JG_JGPTS1 ? 1 : 0;
    jogo.JG_DERROTA2 = jogo.JG_JGPTS2 < jogo.JG_JGPTS1 ? 1 : 0;

    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.jogosService.SalvarJogos(jogo) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['jogos'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )}
} 
