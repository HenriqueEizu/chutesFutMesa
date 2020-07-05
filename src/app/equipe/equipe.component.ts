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
import {Equipe,ImagemEscudo,RankingJogadorStatus} from './equipe.model'
import { Jogador } from '../jogadores/jogador.model';

@Component({
  selector: 'cft-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css'],
  providers: []  // add NgbCarouselConfig to the component providers
})
export class EquipeComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;


   
  panelOpenState = false;
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
  JogadoreEscalados: Jogador[];
  imgJogadoresEscalados: string[];
  NomeJogadoresEscalados: string[];
  intNumeroJogEscalados: number = 0;

  constructor(private equipeService: EquipeService
    , private router: Router
    , private formBuilder : FormBuilder
    , private modalService: BsModalService
    ,private alertService: AlertModalService
    ,private route: ActivatedRoute
    ,private jogadorService : JogadorService
    ){

}


step = 0;

setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

  ngOnInit(): void {
    this.imgJogadoresEscalados = ["","","","","",""];
    this.NomeJogadoresEscalados = ["","","","","",""];
    this.JogadoreEscalados= [null,null,null,null,null,null];

    this.equipeService.GetRankingJogadorStatus ().subscribe((jog : RankingJogadorStatus[]) => {
      this.Jogadores = jog;
      this.JogadoresFiltro = this.Jogadores
    });

    this.equipeService.GetRankingJogadorStatus().subscribe((jog : RankingJogadorStatus[]) => {
      this.JogadoresCislpa = jog.filter( j => j.JO_JOAPELIDO == 'zzzz');
    });

    this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
      this.EscudosFiltro = jog.filter(c => c.IM_IMATIVO == true);;
    });

    this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
      this.EscudosEscolhido = jog.filter(c => c.IM_IMATIVO == false);
      this.imageCardEquipe = jog.filter(c => c.IM_IMATIVO == false)[0];
    });

    this.equipe = this.route.snapshot.data['equipe'];
    this.equipeCarregada =this.equipe;
    

    if (this.equipe.EQ_EQESCUDO != "" && this.equipe.EQ_EQESCUDO != null){
      this.pathimagecomplete = this.equipe.EQ_EQESCUDO;
    }

    this.equipeForm = this.formBuilder.group({
      EQ_EQID : [this.equipe.EQ_EQID],
      EQ_EQNOME: this.formBuilder.control(this.equipe.EQ_EQNOME,[Validators.required, Validators.minLength(6),Validators.maxLength(300)]),
      EQ_EQESCUDO: this.formBuilder.control(this.equipe.EQ_EQESCUDO),
      EQ_EQATIVO: this.formBuilder.control(this.equipe.EQ_EQATIVO),
      EQ_EQOBSERVACAO: this.formBuilder.control(this.equipe.EQ_EQOBSERVACAO,Validators.maxLength(300)),
    },);

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

  EscalaJogador(jogador :  Jogador){

    if (this.intNumeroJogEscalados < 6)
    {
      this.imgJogadoresEscalados[this.intNumeroJogEscalados] = jogador.JO_JOFOTO;
      this.NomeJogadoresEscalados[this.intNumeroJogEscalados] = jogador.JO_JOAPELIDO;
      this.JogadoreEscalados[this.intNumeroJogEscalados] = jogador;
      this.intNumeroJogEscalados ++;
    }
    else{
      this.alertService.showAlertDanger("Já foram escalados 6 jogadores.") ;
    }
  }

  podeDesativar() {
    return true;
  }

  EscudoEsc(equipe: Equipe){
    alert(equipe.EQ_EQESCUDO);
  }

  EscudoImagem(strImagem: string){
    alert(strImagem);
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

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.imageEscolhida = files.item(0).name;
  }
  uploadFileToActivity() :boolean{
    var sucesso : boolean = true;
    this.equipeService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
      if (file != undefined){
        this.image = file;
        }
      else{
        sucesso = false;
      }
    });
    return sucesso;
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

    if (equipe.EQ_EQESCUDO == "" || equipe.EQ_EQESCUDO == null){
      equipe.EQ_EQESCUDO = DIR_EQUIPE + this.image
    }else if(equipe.EQ_EQID == null && this.fileToUpload != null){
      if (this.uploadFileToActivity() == true){
        equipe.EQ_EQESCUDO = DIR_EQUIPE + this.imageEscolhida
      }
    }
     
    equipe.EQ_EQDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.equipeService.SalvarEquipe(equipe) : EMPTY)
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
