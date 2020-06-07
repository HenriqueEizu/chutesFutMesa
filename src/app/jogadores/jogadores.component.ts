import { Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable, EMPTY, Subject} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { delay, map, tap, filter, take, switchMap } from 'rxjs/operators';
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");

import { Clube } from '../clube/clube.model';
import { ClubeService } from './../clube/clube.service';
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { JogadorService } from './jogador.service';
import { DIR_JOGADOR } from '../app.api';
import { Jogador } from './jogador.model';


@Component({
  selector: 'cft-jogadores',
  templateUrl: './jogadores.component.html',
  styleUrls: ['./jogadores.component.css']
})
export class JogadoresComponent implements OnInit {

  clubes: Clube[];
  blnExisteLogin : boolean;
  jogadorForm: FormGroup
  jogador : any;
  myDate = new Date();
  fileToUpload: File = null;
  pathImage = DIR_JOGADOR;
  image = "jogador.png"
  pathimagecomplete = DIR_JOGADOR + this.image;
  imageEscolhida : string;

  constructor(private jogadorService: JogadorService
    , private clubeService: ClubeService
    , private router: Router
    , private formBuilder : FormBuilder
    ,private route: ActivatedRoute
    ,private alertService: AlertModalService){
     }

    podeDesativar() {
      return true;
    }

  ngOnInit(): void {

    this.clubeService.GetAllClube().subscribe((cls : Clube[]) =>{
      this.clubes = cls;
    })

    this.jogador = this.route.snapshot.data['jogador'];

    if (this.jogador.JO_JOFOTO != "" && this.jogador.JO_JOFOTO != null){
      this.pathimagecomplete = this.jogador.JO_JOFOTO;
    }

    this.jogadorForm = this.formBuilder.group({
      JO_JOID: [this.jogador.JO_JOID],
      JO_JONOME: this.formBuilder.control(this.jogador.JO_JONOME,[Validators.required, Validators.minLength(6)],[this.ValidaNomeJogador.bind(this)]),
      JO_JOAPELIDO: this.formBuilder.control(this.jogador.JO_JOAPELIDO, [Validators.required, Validators.minLength(2)],[this.ValidaApelido.bind(this)]),
      JO_CLID: this.formBuilder.control(this.jogador.JO_CLID,[Validators.required]),
      JO_JOATIVO: this.formBuilder.control(this.jogador.JO_JOATIVO),
      JO_JOFOTO: this.formBuilder.control(this.jogador.JO_JOFOTO),
    })
  }

  VerificaNomeJogador(NomeJogador:string, NomeJogador2 :string = "NomeJogador"){
    return this.jogadorService.VerificaNomeJogador().pipe(
      delay(3000),
      map((dados: {jogadores : any[]}) => dados.jogadores),
      tap(console.log),
      map((dados: {nomeJogador : string}[]) => dados.filter(v => v.nomeJogador.toUpperCase() === NomeJogador.toUpperCase() && v.nomeJogador.toUpperCase() != NomeJogador2.toUpperCase())),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }

  ValidaNomeJogador(formControl : FormControl)
  {
    return this.VerificaNomeJogador(formControl.value, this.jogador.JO_JONOME != null ? this.jogador.JO_JONOME : "").pipe(
      tap(console.log),
      map(NomeJgExiste => NomeJgExiste ? {jogadorInvalido: true} : null )
    );
  }

  VerificaApelido(Apelido:string, Apelido2 :string = "NomeJogador"){
    return this.jogadorService.VerificaApelido().pipe(
      delay(3000),
      map((dados: {jogadores : any[]}) => dados.jogadores),
      tap(console.log),
      map((dados: {apelidoJogador : string}[]) => dados.filter(v => v.apelidoJogador.toUpperCase() === Apelido.toUpperCase() && v.apelidoJogador.toUpperCase() != Apelido2.toUpperCase())),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }

  ValidaApelido(formControl : FormControl)
  {
    return this.VerificaApelido(formControl.value, this.jogador.JO_JOAPELIDO != null ? this.jogador.JO_JOAPELIDO : "").pipe(
      tap(console.log),
      map(ApelidoExiste => ApelidoExiste ? {apelidoInvalido: true} : null )
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.imageEscolhida = files.item(0).name;
  }

  uploadFileToActivity() :boolean{
    var sucesso : boolean = true;
    this.jogadorService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
      if (file != undefined){
        this.image = file;
        }
      else{
        sucesso = false;
      }
    });

    return sucesso;
  }

  SalvarJogador(jodador: Jogador){
    let msgSuccess = "Jogador inserido com sucesso";
    let msgErro = "Erro ao incluir Jogador. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir este Jogador?"
    let msgBotao = "Inserir"
    if (this.jogadorForm.value.JO_JOID != null){
      msgSuccess = "Jogador alterado com sucesso";
      msgErro = "Erro ao atualizar Jogador. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar este Jogador?"
      msgBotao = "Alterar"
    }

    if (jodador.JO_JOFOTO == ""){
      jodador.JO_JOFOTO = DIR_JOGADOR + this.image
    }else if(jodador.JO_JOID == null || this.fileToUpload != null){
      if (this.uploadFileToActivity() == true){
        jodador.JO_JOFOTO = DIR_JOGADOR + this.imageEscolhida
      }
    }

    jodador.JO_JODATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.jogadorService.SalvarJogador(jodador) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['jogadores'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )

  }


}
