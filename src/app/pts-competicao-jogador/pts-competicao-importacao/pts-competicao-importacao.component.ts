import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate, DatePipe} from "@angular/common";
import {switchMap, take, map, delay, tap} from  'rxjs/operators'
import {Observable} from 'rxjs'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {  EMPTY , Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router'
import { newArray } from '@angular/compiler/src/util';
import * as XLSX from 'xlsx';

import {PtsCompeticaoJogadorService} from '.././pts-competicao-jogador.service'
import {PtsCompeticaoJogador} from '.././PtsCompeticaoJogador.model'
import { Competicao } from '.././../competicao/competicao.model';
import { CompeticaoService } from '.././../competicao/competicao.service';
import { Jogador } from 'src/app/jogadores/jogador.model';
import { JogadorService } from 'src/app/jogadores/jogador.service';

type AOA = any[][];

@Component({
  selector: 'cft-pts-competicao-importacao',
  templateUrl: './pts-competicao-importacao.component.html',
  styleUrls: ['./pts-competicao-importacao.component.css']
})
export class PtsCompeticaoImportacaoComponent implements OnInit {

  ptscompeticaojogadorCarregada : PtsCompeticaoJogador;
  ptscompeticaojogador : any;
  ptscompeticaojogadorForm: FormGroup
  ptscompeticaojogadorSelecionado: PtsCompeticaoJogador;
  numberPattern = /^-?(0|[1-9]\d*)?$/
  myDate = new Date();
  competicoes : Competicao[];
  competicaoId : Competicao;
  show = false;
  autohide = true;
  showJogadores = false;
  autohideJog = true; 

  input = document.getElementById('input')
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  jogadores : Jogador[];
  jogador : Jogador;

  constructor(private ptscompeticaojogadorService: PtsCompeticaoJogadorService
    , private router: Router
    , private formBuilder : FormBuilder
    , private modalService: BsModalService
    ,private alertService: AlertModalService
    ,private route: ActivatedRoute
    ,private competicaoService : CompeticaoService
    ,private jogadorService: JogadorService
    ,private ptsCompService: PtsCompeticaoJogadorService
    ) { }

  ngOnInit(): void {

    this.competicaoService.GetAllCompeticao().subscribe((cp : Competicao[]) => {
      this.competicoes = cp.filter(c=>c.CP_CPATIVO == true);
      });

      this.jogadorService.GetAllJogador().subscribe((jgs : Jogador[]) =>{
        this.jogadores = jgs;
      })

      this.ptscompeticaojogadorForm = this.formBuilder.group({
        PJ_CPID: this.formBuilder.control("",[Validators.required]),
        PJ_PJOBSERVACAO: this.formBuilder.control("",[Validators.required]),
      });

  } 

  MostraRodada(id: number)
  {
    this.show = true
    this.competicaoId = this.competicoes.filter(cp => cp.CP_CPID == id)[0];
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target); 
    console.log(target.files[0] + "...arquivo...");
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
    /* read workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0]; // ranking adulto
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    for(var i = 0; i < this.data.length; i++) {
      let cube = this.data[i];
      for(var j = 0; j < cube.length; j++) {
        console.log("cube[" + i + "," + j + "] = " + cube[j])
      }
    }

    // console.log(this.data)

    // const wsnameSub20: string = wb.SheetNames[1]; // ranking sub20
    // const wsSub20: XLSX.WorkSheet = wb.Sheets[wsnameSub20];
    // this.dataSub20=  <AOA>(XLSX.utils.sheet_to_json(wsSub20, { header: 1 }));

    // const wsnameMaster: string = wb.SheetNames[2]; // ranking master
    // const wsMaster: XLSX.WorkSheet = wb.Sheets[wsnameMaster];
    // this.dataMaster=  <AOA>(XLSX.utils.sheet_to_json(wsMaster, { header: 1 }));

  };
  reader.readAsBinaryString(target.files[0]);
}

initialize() : PtsCompeticaoJogador{
  let ptsCompeticao : PtsCompeticaoJogador;
  ptsCompeticao = { 
    PJ_PJID : 0,
    PJ_CPID : 0,
    OBJ_COMPETICAO : null,
    PJ_JOMATRICULA : 0,
    PJ_JOID : 0,
    OBJ_JOGADOR : null,
    PJ_PJCOLOCACAO : 0,
    PJ_PJPONTOSGANHOS : 0,
    PJ_PJJOGOS : 0,
    PJ_PJVITORIAS : 0,
    PJ_PJEMPATE : 0,
    PJ_PJDERROTA : 0,
    PJ_PJGOLSPRO : 0,
    PJ_PJGOLCONTRA : 0,
    PJ_PJSALDOGOLS : 0,
    PJ_PJPONTOS : 0,
    PJ_PJOBSERVACAO : null,
    PJ_PJATIVO : null,
    PJ_PJDATACADASTRO : null}
    return ptsCompeticao
}

PercorrerPlanilha(ptsCompeticao : PtsCompeticaoJogador){
  let colocacao : number; //PJ_PJCOLOCACAO : 0,
  let pontosGanhos : number; //PJ_PJPONTOSGANHOS : 0,
  let jogos : number; //PJ_PJJOGOS : 0,
  let vitorias : number; //PJ_PJVITORIAS : 0,
  let empates : number; //PJ_PJEMPATE : 0,
  let derrotas : number; //PJ_PJDERROTA : 0,
  let golsPro : number; //PJ_PJGOLSPRO : 0,
  let golsContra : number; //PJ_PJGOLCONTRA : 0,
  let saldoGols : number; //PJ_PJSALDOGOLS : 0,
  let pontos : number; //PJ_PJPONTOS : 0,
  let matricula : number; //PJ_JOMATRICULA
  let intCtr : number = 0;
  let ptsComp : PtsCompeticaoJogador[] = newArray(100);

  
  for(var i = 0; i < this.data.length; i++) {
    ptsComp[intCtr] = this.initialize();
    let cube = this.data[i];
    for(var j = 0; j < cube.length; j++) {
      if (i > 3 && (j > 0))
      {
        if (j == 1)
          matricula = Number(cube[j]);
        if (j == 2)
          colocacao = Number(cube[j]);
        if (j == 4)
          pontosGanhos = Number(cube[j]);
        if (j == 5)
          jogos = Number(cube[j]);
        if (j == 6)
          vitorias = Number(cube[j]);
        if (j == 7)
          empates = Number(cube[j]);
        if (j == 8)
          derrotas = Number(cube[j]);
        if (j == 9)
          golsPro = Number(cube[j]);
        if (j == 10)
          golsContra = Number(cube[j]);
        if (j == 11)
          saldoGols = Number(cube[j]);
        if (j == 12)
          pontos = Number(cube[j]);
      }
    }

    if (i > 3)
    {

      this.jogador = this.jogadores.filter(c=> c.JO_JOMATRICULA == matricula)[0];
      if (this.jogador != undefined || this.jogador != null)
      {
        ptsComp[intCtr].PJ_CPID = ptsCompeticao.PJ_CPID;
        ptsComp[intCtr].PJ_JOID = this.jogador.JO_JOID;
        ptsComp[intCtr].PJ_JOMATRICULA = matricula;
        ptsComp[intCtr].PJ_PJCOLOCACAO = colocacao,
        ptsComp[intCtr].PJ_PJPONTOSGANHOS = pontosGanhos,
        ptsComp[intCtr].PJ_PJJOGOS = jogos,
        ptsComp[intCtr].PJ_PJVITORIAS = vitorias,
        ptsComp[intCtr].PJ_PJEMPATE = empates,
        ptsComp[intCtr].PJ_PJDERROTA = derrotas,
        ptsComp[intCtr].PJ_PJGOLSPRO = golsPro,
        ptsComp[intCtr].PJ_PJGOLCONTRA = golsContra,
        ptsComp[intCtr].PJ_PJSALDOGOLS = saldoGols,
        ptsComp[intCtr].PJ_PJPONTOS = pontos,
        intCtr ++; 
      }
    }
  }

const result$ = this.alertService.showConfirm("Arquivo validado com sucesso. A importação vai excluir todos os dados do jogadores contidos na planilha. Você deseja continuar com a importação?","Confirmação de Importação","Fechar","Importar");
result$.asObservable()
  .pipe(
    take(1),
    switchMap(result => result ? this.ptsCompService.ImportarPontosCompeticao(ptsComp) : EMPTY)
  ).subscribe(
    success => {
                this.alertService.showAlertSuccess("Impotação efetuada com sucesso");
                },
    error =>  {
              this.alertService.showAlertDanger("Erro na importação") ;
              }
  )
}

}
