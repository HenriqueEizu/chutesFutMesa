import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate} from "@angular/common";
import {switchMap, take, map, delay, tap} from  'rxjs/operators'
import {Observable} from 'rxjs'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../shared/alertmodal/alertmodal.service'
import {  EMPTY , Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router'
import { IFormCanDeactivate } from '../guards/form-deactivate';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {CompeticaoService} from './competicao.service'
import {DIR_COMPETICAO} from '../app.api'
import {Competicao, Rodadas,Categoriajogo} from './competicao.model'


@Component({
  selector: 'cft-competicao',
  templateUrl: './competicao.component.html',
  styleUrls: ['./competicao.component.css']
})
export class CompeticaoComponent implements OnInit {

  pathImage = DIR_COMPETICAO;
  image = "competicao.png"
  pathimagecomplete = DIR_COMPETICAO + this.image;
  imageEscolhida : string;
  rodadas : Rodadas[];
  categoriaJogos : Categoriajogo[];
  competicaoCarregada : Competicao;
  competicao : any;
  competicaoForm: FormGroup
  competicaoSelecionado: Competicao;
  model: NgbDateStruct;
  model1: NgbDateStruct;
  myDate = new Date();
  fileToUpload: File = null;

  constructor(private competicaoService: CompeticaoService
            , private router: Router
            , private formBuilder : FormBuilder
            , private modalService: BsModalService
            ,private alertService: AlertModalService
            ,private route: ActivatedRoute){
     }

  ngOnInit(): void {

    this.competicaoService.GetAllRodadas().subscribe((rd : Rodadas[]) => {
      this.rodadas = rd;
      });

    this.competicaoService.GetAllCategoriaJogos().subscribe((cj : Categoriajogo[]) => {
      this.categoriaJogos = cj;
      });

      
    this.competicao = this.route.snapshot.data['clube'];
    this.competicaoCarregada =this.competicao;

    if (this.competicao.CP_CPFOTO != "" && this.competicao.CP_CPFOTO != null){
      this.competicao = this.competicao.CP_CPFOTO;
    }

    this.competicaoForm = this.formBuilder.group({
      CP_CPID : [this.competicao.CP_CPID],
      CP_CPDESCRICAO: this.formBuilder.control(this.competicao.CP_CPDESCRICAO,[Validators.required, Validators.minLength(6),Validators.maxLength(300)]),
      CP_CPCIDADE: this.formBuilder.control(this.competicao.CP_CPCIDADE,[Validators.required, Validators.minLength(6),Validators.maxLength(300)]),
      CP_CPDATALIMITEAPOSTA: this.formBuilder.control(this.competicao.CP_CPDATALIMITEAPOSTA,[Validators.required]),
      CP_CPDATAINICIO: this.formBuilder.control(this.competicao.CP_CPDATAINICIO,[Validators.required]),
      CP_CPATIVO: this.formBuilder.control(this.competicao.CP_CPATIVO),
      CP_CPFOTO: this.formBuilder.control(this.competicao.CP_CPFOTO),
      CP_ROID: this.formBuilder.control(this.competicao.CP_ROID,[Validators.required]),
      CP_CJID: this.formBuilder.control(this.competicao.CP_CJID,[Validators.required]),
    },{validator:CompeticaoComponent.CompareDatas});

  }

  static CompareDatas(group: AbstractControl):{[key:string]: boolean}{
    const DataLimite = group.get('CP_CPDATALIMITEAPOSTA')
    const DataInicio = group.get('CP_CPDATAINICIO')
    let dataLim : Date;
    let dataIni : Date;
    if (DataLimite.value != null){
      dataLim = new Date(DataLimite.value.year + "-" + DataLimite.value.month + "-" + DataLimite.value.day);
    }
    if (DataInicio.value != null){
      dataIni = new Date(DataInicio.value.year + "-" + DataInicio.value.month + "-" + DataInicio.value.day);
    }

    if (DataLimite.value == null && DataInicio.value  == null){
      return undefined
    }
    
    if (dataLim < dataIni){
      return undefined
    }

    else{
      return {dataInicioErrada:true}
    }
  }

  podeDesativar() {
    return true;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.imageEscolhida = files.item(0).name;
  }
  uploadFileToActivity() :boolean{
    var sucesso : boolean = true;
    this.competicaoService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
      if (file != undefined){
        this.image = file;
        }
      else{
        sucesso = false;
      }
    });
    return sucesso;
  }


  SalvarCompeticao(competicao: Competicao){
    let msgSuccess = "Usuário inserido com sucesso";
    let msgErro = "Erro ao incluir competicao. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir esta competicao?"
    let msgBotao = "Inserir"
    if (this.competicaoForm.value.US_USID != null){
      msgSuccess = "Competição alterado com sucesso";
      msgErro = "Erro ao atualizar competição. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar esta competição?"
      msgBotao = "Alterar"
    }

    competicao.CP_CPDATALIMITEAPOSTA = competicao.CP_CPDATALIMITEAPOSTA['year'] + "-" + competicao.CP_CPDATALIMITEAPOSTA['month'] + "-" + competicao.CP_CPDATALIMITEAPOSTA['day'];
    competicao.CP_CPDATAINICIO = competicao.CP_CPDATAINICIO['year'] + "-" + competicao.CP_CPDATAINICIO['month'] + "-" + competicao.CP_CPDATAINICIO['day'];

    this.competicaoSelecionado = competicao;

    if (competicao.CP_CPFOTO == "" || competicao.CP_CPFOTO == null){
      competicao.CP_CPFOTO = DIR_COMPETICAO + this.image
    }else if(competicao.CP_CPID == null || this.fileToUpload != null){
      if (this.uploadFileToActivity() == true){
        competicao.CP_CPFOTO = DIR_COMPETICAO + this.imageEscolhida
      }
    }
     
    competicao.CP_CPDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.competicaoService.SalvarCompeticao(competicao) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['competicoes'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )}

}
 