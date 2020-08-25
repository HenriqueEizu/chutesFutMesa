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
import {Equipe,ImagemEscudo} from './equipe.model'
import { Usuario } from '../usuario/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'cft-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css'],
  providers: []  // add NgbCarouselConfig to the component providers
})
export class EquipeComponent implements OnInit, IFormCanDeactivate {

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
  Escudos : ImagemEscudo[];
  EscudosFiltro : ImagemEscudo[];
  EscudosEscolhido : ImagemEscudo[];
  imageCardEquipe : ImagemEscudo ;
  strImageEscudo : string;
  nomeEquipe : string;
  isLoggedIn$: Observable<boolean>;
  usuarioLogado : Usuario;

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
    
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.usuarioLogado = u
    });

    this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
      this.EscudosEscolhido = jog.filter(c => c.IM_IMPATH == this.strImageEscudo || c.IM_IMPATH == this.equipe.EQ_EQESCUDO);
      this.imageCardEquipe = jog.filter(c => c.IM_IMATIVO == false)[0];
    });

    this.equipeService.GetImagemEscudo().subscribe((jog : ImagemEscudo[]) => {
      this.EscudosFiltro = jog.filter(c => c.IM_IMATIVO == true && c.IM_IMPATH != this.equipe.EQ_EQESCUDO);;
    });

    this.equipe = this.route.snapshot.data['equipe'];
    this.equipeCarregada =this.equipe;
    

    if (this.equipe.EQ_EQESCUDO != "" && this.equipe.EQ_EQESCUDO != null){
      this.pathimagecomplete = this.equipe.EQ_EQESCUDO;
      this.strImageEscudo = this.equipe.EQ_EQESCUDO;
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

  HabilitarSalvar(): boolean{

    var blnEscalados : boolean = true ;
    var j : number;

    if (this.EscudosEscolhido == undefined)
      return false;

    if (this.equipeForm.valid == true && this.EscudosEscolhido.length > 0 && blnEscalados){
      return false;
    }
    return true;
  }

  podeDesativar() {
    return true;
  }

  SalvarEquipe(equipe: Equipe){
    let msgSuccess = "Equipe inserido com sucesso";
    let msgErro = "Erro ao incluir equipe. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir esta equipe?"
    let msgBotao = "Inserir"
    if (this.equipeForm.value.EQ_EQID != null){
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
        switchMap(result => result ? this.equipeService.SalvarEquipe(equipe) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['dashboard'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
  )}



}
