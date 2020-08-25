import { RankingJogadores } from './ranking.model';
import { map, take, switchMap } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import {MatAccordion} from '@angular/material/expansion';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RankingService} from './ranking.service'
import { DIR_EXCEL_RANKINHG } from '../app.api';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { JogadorService } from '../jogadores/jogador.service';
import { Jogador } from '../jogadores/jogador.model';
import { EMPTY, BehaviorSubject, Observable } from 'rxjs';
import { newArray } from '@angular/compiler/src/util';
import { formatDate } from '@angular/common';

type AOA = any[][];


@Component({
  selector: 'cft-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  public model: any;
  DadosPlanilha : string[][];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  panelOpenState = true;
  input = document.getElementById('input')
  data: AOA = [[1, 2], [3, 4]];
  dataAdulto :AOA = [[1, 2], [3, 4]];
  dataSub20: AOA = [[1, 2], [3, 4]];
  dataMaster: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  rankingForm: FormGroup;
  fileToUpload: File = null;
  pathImage = DIR_EXCEL_RANKINHG;
  image = "clube1.png"
  rankingJogadores : RankingJogadores[] = new Array(1000)
  
  dataRankingPlanilha : Date;
  jogadores : Jogador[];
  jogador : Jogador;
  
  pathimagecomplete = DIR_EXCEL_RANKINHG + this.image;
  imageEscolhida : string;

  constructor(private formBuilder : FormBuilder,
              private rankingService : RankingService,
              private alertService: AlertModalService,
              private jogadorService: JogadorService) { }

  ngOnInit(): void {

    this.rankingForm = this.formBuilder.group({
      RJ_RJDATA : this.formBuilder.control("",[Validators.required]),
      RJ_RJOBSERVACAO : this.formBuilder.control("",[Validators.required])
      // EQ_EQID : [this.equipe.EQ_EQID],
      // EQ_EQNOME: this.formBuilder.control(this.equipe.EQ_EQNOME,[Validators.required, Validators.minLength(6),Validators.maxLength(300)],[this.ValidaNomeEquipe.bind(this)]),
      // EQ_EQESCUDO: this.formBuilder.control(this.equipe.EQ_EQESCUDO),
      // EQ_EQATIVO: this.formBuilder.control(this.equipe.EQ_EQATIVO),
      // EQ_EQOBSERVACAO: this.formBuilder.control(this.equipe.EQ_EQOBSERVACAO,Validators.maxLength(300)),
    },);

    this.jogadorService.GetAllJogador().subscribe((jgs : Jogador[]) =>{
      this.jogadores = jgs;
    })
    
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.imageEscolhida = files.item(0).name;

}

uploadFileToActivity() :boolean{
  var sucesso : boolean = true;
  this.rankingService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
    if (file != undefined){
      this.image = file;
      }
    else{
      sucesso = false;
    }
  });

  return sucesso;
}


  // onFileChange(evt: any) {
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   let files: FileList;
  //   files = evt.target.files;
  //   this.fileToUpload = files.item(0);
  //   this.imageEscolhida = files.item(0).name;
  //   this.rankingService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
  //     if (file != undefined){
  //       this.image = file;
  //       }
  //     else{
  //       //errro
  //     }
  //   });

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
      this.dataAdulto = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      const wsnameSub20: string = wb.SheetNames[1]; // ranking sub20
      const wsSub20: XLSX.WorkSheet = wb.Sheets[wsnameSub20];
      this.dataSub20=  <AOA>(XLSX.utils.sheet_to_json(wsSub20, { header: 1 }));

      const wsnameMaster: string = wb.SheetNames[2]; // ranking master
      const wsMaster: XLSX.WorkSheet = wb.Sheets[wsnameMaster];
      this.dataMaster=  <AOA>(XLSX.utils.sheet_to_json(wsMaster, { header: 1 }));

    };
    reader.readAsBinaryString(target.files[0]);
  }

  initialize() : RankingJogadores{
    let rank : RankingJogadores;
    rank = { 
      RJ_RJID : 0,
      RJ_RJMES : 0,
      RJ_RJANO : 0,
      RJ_RJDATA : null,
      RJ_JOID : 0,
      RJ_JOMATRICULA : 0,
      RJ_RJPOSICAO : 0,
      RJ_RJPOSICAOANO : 0,
      RJ_RJPONTOS : 0,
      RJ_CJID : 0,
      RJ_RJOBSERVACAO : null,
      RJ_RJATIVO : false,
      RJ_RJDATACADASTRO : null}
    return rank
  }

  PercorrerPlanilha(ranking : RankingJogadores){
    let ano : string;
    let mes : string;
    let IdJogador : number;
    let matricula : number;
    let posicao : number;
    let posicaoAno : number;
    let pontos: number;
    let intCtr : number = 0;
    let rank : RankingJogadores[] = newArray(300);


    
  for (var k = 0; k < 3; k++) {
    if (k == 0)
      this.data = this.dataAdulto;
    else if (k == 1)
      this.data = this.dataSub20;
    else if (k ==2)
      this.data = this.dataMaster;
    
    for(var i = 0; i < this.data.length; i++) {
      rank[intCtr] = this.initialize();
      let cube = this.data[i];
      for(var j = 0; j < cube.length; j++) {
        if (i == 4 && j == 3)
        {
          ano = cube[j].trim().substring(cube[j].length - 4,cube[j].length)
          if (cube[j].search("JANEIRO") > 0){
            mes = "01";
          }else if (cube[j].search("FEVEREIRO") > 0){
            mes = "02";
          }else if (cube[j].search("MARÇO") > 0){
            mes = "03";
          }else if (cube[j].search("ABRIL") > 0){
            mes = "04";
          }else if (cube[j].search("MAIO") > 0){
            mes = "05";
          }else if (cube[j].search("JUNHO") > 0){
            mes = "06";
          }else if (cube[j].search("JULHO") > 0){
            mes = "07";
          }else if (cube[j].search("AGOSTO") > 0){
            mes = "08";
          }else if (cube[j].search("SETEMBRO") > 0){
            mes = "09";
          }else if (cube[j].search("OUTUBRO") > 0){
            mes = "10";
          }else if (cube[j].search("NOVEMBRO") > 0){
            mes = "11";
          }else if (cube[j].search("DEZEMBRO") > 0){
            mes = "12";
          }else {
            this.alertService.showAlertDanger("Mês e  ano do ranking não encontrado do arquivo") ;
            return;
          }
          this.dataRankingPlanilha = new Date(Number(ano),Number(mes),1);
          if (ranking.RJ_RJDATA['month'] != Number(mes) ||
            ranking.RJ_RJDATA['year'] != Number(ano)){
              this.alertService.showAlertDanger("Mês e  ano indicado acima deve ser o mesmo do arquivo (" + mes + " / " +  ano + ") ") ;
              return;
            } 
        }
        if (i > 6 && (j == 5 || j == 25 || j ==1 || j ==2))
        {
          if (j == 5)
            matricula = Number(cube[j]);
          if ( j == 1)
            posicao = Number(cube[j]);
          if ( j == 2)
            posicaoAno = Number(cube[j]);
          if (j == 25)
            pontos = Number(cube[j]);
        }
      }

      if (i > 6)
      {
        rank[intCtr].RJ_RJMES = Number(mes);
        rank[intCtr].RJ_RJANO = Number(ano);
        rank[intCtr].RJ_RJDATA  = formatDate(this.dataRankingPlanilha,"yyyy-MM-dd","en-US");
        this.jogador = this.jogadores.filter(c=> c.JO_JOMATRICULA == matricula)[0];
        if (this.jogador != undefined || this.jogador != null)
        {
          rank[intCtr].RJ_JOID = this.jogador.JO_JOID;
          rank[intCtr].RJ_JOMATRICULA = matricula;
          rank[intCtr].RJ_RJPOSICAO = posicao;
          rank[intCtr].RJ_RJPOSICAOANO = posicaoAno;
          rank[intCtr].RJ_RJPONTOS = pontos;
          rank[intCtr].RJ_RJOBSERVACAO = null;
          rank[intCtr].RJ_RJATIVO = true;
          rank[intCtr].RJ_CJID = k + 1;
          intCtr ++; 
        }
      }
    }
  }
  const result$ = this.alertService.showConfirm("Arquivo validado com sucesso. A importação vai excluir todos os dados do periodo escolhido. Você deseja continuar com a importação?","Confirmação de Importação","Fechar","Importar");
  result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.rankingService.ImportarRanking(rank) : EMPTY)
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
