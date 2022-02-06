import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { delay, map, tap, filter, take, switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import {Observable, EMPTY, Subject} from 'rxjs'

import { CompeticaoService } from '../competicao/competicao.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../shared/alertmodal/alertmodal.service'
import { Competicao } from '../competicao/competicao.model';
import { Jogador } from '../jogadores/jogador.model';
import { Inscricao} from '../inscricao/inscricao.model'
import { JogadorService } from '../jogadores/jogador.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/usuario.model';
import { InscricaoService } from './inscricao.service';


@Component({
  selector: 'cft-inscricao',
  templateUrl: './inscricao.component.html',
  styleUrls: ['./inscricao.component.css']
})
export class InscricaoComponent implements OnInit {

  competicoes : Competicao[];
  competicaoId : Competicao;
  inscricaoForm: FormGroup;
  show = false;
  autohide = true;
  Jogadores : Jogador[];
  JogadoresTodos : Jogador[];
  blnOrdenarPorMatricula : boolean;
  blnOrdenarPorJogador : boolean;
  blnOrdenarPorInscrito : boolean;
  JogadoresInscritos : Jogador[] = []
  JogadoresInscritosAux : Array<Jogador>;
  idClube : number;
  jaInscritos : Inscricao[] = []

  constructor(
    private router: Router
    , private formBuilder : FormBuilder
    , private modalService: BsModalService
    ,private alertService: AlertModalService
    ,private route: ActivatedRoute
    ,private competicaoService : CompeticaoService
    ,private jogadorService: JogadorService
    ,private usuarioService: UsuarioService
    ,private inscricaoService : InscricaoService
    ) { }

  ngOnInit(): void {

    this.competicaoService.GetAllCompeticao().subscribe((cp : Competicao[]) => {
      this.competicoes = cp.filter(c=>c.CP_CPATIVO == true && c.CP_CJID != 1);
      });

    this.inscricaoForm = this.formBuilder.group({
      IS_CPID: this.formBuilder.control("",[Validators.required]),
    });

    this.usuarioService.usuarioCacheFunc.subscribe((u : Usuario) =>{
      this.jogadorService.GetAllJogador().subscribe((jg : Jogador[]) => {
        this.idClube = u.US_CLID;
        this.Jogadores = jg.filter(c=>c.JO_CLID == u.US_CLID && c.JO_JOATIVO == true);
        this.JogadoresTodos = jg.filter(c=>c.JO_CLID == u.US_CLID);
        this.JogadoresInscritos = jg.filter(c=>c.JO_JOID== -1);
        this.JogadoresInscritosAux = jg.filter(c=>c.JO_JOID== -1);
        });
    });

   

    
  }

  MostraRodada(id: number)
  {
    var i : number;
    console.log(id)
    this.show = true
    this.competicaoId = this.competicoes.filter(cp => cp.CP_CPID == id)[0];

    this.inscricaoService.GetInscricaoClube(id).subscribe((ic : Inscricao[]) =>{
      this.jaInscritos = ic.filter(c=>c.IS_CLID == ic[0].IS_CLID);
      console.log("ooooooooooooooooooooooooooo");
      console.log(ic[0]);
      console.log("ooooooooooooooooooooooooooo");
      console.log(this.jaInscritos);
      for (i = 0; i < this.Jogadores.length ; i++){
        console.log(this.Jogadores[i])
        if (this.jaInscritos.filter(c=> c.IS_JOID == this.Jogadores[i].JO_JOID).length > 0){
          console.log(this.Jogadores[i])
          this.Jogadores[i].JO_JOINSCRITO = true;
        }
      }
      this.JogadoresInscritos = this.Jogadores.filter(c=> c.JO_JOINSCRITO == true)

      console.log(this.JogadoresInscritos);
    });
    
    

    // alimentar 
    // this.JogadoresInscritos
  }

  JogadoresOrdenarPor(campo : string, blnEnable : boolean){
    if (blnEnable ==  true){
      switch  (campo)
      {
        case "matricula":
          this.Jogadores.sort((a, b) => a.JO_JOMATRICULA  > b.JO_JOMATRICULA ? -1 : 1);
          this.blnOrdenarPorMatricula = false;
          break;
        case "jogador":
          this.Jogadores.sort((a, b) => a.JO_JOAPELIDO  > b.JO_JOAPELIDO ? -1 : 1);
          this.blnOrdenarPorJogador = false;
          break;
        case "inscrito":
          this.Jogadores.sort((a, b) => a.JO_JOINSCRITO  > b.JO_JOINSCRITO ? -1 : 1);
          this.blnOrdenarPorInscrito = false;
          break;
      }
    }
    else{
      switch  (campo)
      {
        case "matricula":
          this.Jogadores.sort((a, b) => b.JO_JOMATRICULA  > a.JO_JOMATRICULA ? -1 : 1);
          this.blnOrdenarPorMatricula = true;
          break;
        case "jogador":
          this.Jogadores.sort((a, b) => b.JO_JOAPELIDO  > a.JO_JOAPELIDO ? -1 : 1);
          this.blnOrdenarPorJogador = true;
          break;
        case "inscrito":
          this.Jogadores.sort((a, b) => b.JO_JOINSCRITO  > a.JO_JOINSCRITO ? -1 : 1);
          this.blnOrdenarPorInscrito = true;
          break;
      }
    }
  }

  EscalaJogador(jogador : Jogador) {
    jogador.JO_JOINSCRITO = true;
    this.JogadoresInscritos.push(jogador)
    console.log(this.JogadoresInscritos)
  }

  RemoverJogador(jogador : Jogador) {
    var i : number;
    jogador.JO_JOINSCRITO = false;
    console.log(jogador)
    for (i = 0; i <= this.JogadoresInscritos.length -1; i++) {
      if (this.JogadoresInscritos[i].JO_JOID != jogador.JO_JOID){
        console.log(this.JogadoresInscritos[i])
        this.JogadoresInscritosAux.push(this.JogadoresInscritos[i])
      }
    }

    while(this.JogadoresInscritos.length) {
      this.JogadoresInscritos.pop();
    } 
    console.log("coleção")
    console.log(this.JogadoresInscritos)

    for (i = 0; i <= this.JogadoresInscritosAux.length - 1; i++) {
      this.JogadoresInscritos.push(this.JogadoresInscritosAux[i])
    }
    while(this.JogadoresInscritosAux.length) {
      this.JogadoresInscritosAux.pop();
    } 
    console.log(this.JogadoresInscritos)
  }

  FiltraJogador(strCriterio : string){
    if (this.JogadoresTodos != undefined && this.JogadoresTodos.length > 0){
      if (strCriterio.length <= 0){
          this.Jogadores = this.JogadoresTodos;
      }else{
          console.log(strCriterio);
          this.Jogadores = this.JogadoresTodos.filter(c => c.JO_JOAPELIDO.toLowerCase().indexOf(strCriterio.toLowerCase()) > -1 ||  c.JO_JOMATRICULA == Number(strCriterio));
      }
    }
  }

  SalvarInscritos(incrito : Inscricao){
    var i : number;
    var incricoes : Inscricao[] = []
    let DataAtual = new Date();
    var jogadores : string = "";
    var msgPergunta : string = "";

    for (i = 0; i <= this.JogadoresInscritos.length - 1; i++) {
      
      var incricao = new Inscricao;
      incricao.IS_JOID = this.JogadoresInscritos[i].JO_JOID;
      incricao.IS_CPID = incrito.IS_CPID;
      incricao.IS_ISDATACADASTRO = formatDate(DataAtual,"yyyy-MM-dd","en-US");
      incricao.IS_CLID = this.JogadoresInscritos[i].JO_CLID;
      incricoes.push(incricao);
      jogadores = jogadores + this.JogadoresInscritos[i].JO_JOAPELIDO + " - ";
      
    }


    msgPergunta = "Você deseja realmente inscrever estes " + String(i) + " jogadores: *******" + jogadores;
    msgPergunta = msgPergunta +  " ********* para a competicao " + this.competicaoId.CP_CPDESCRICAO 

    const result$ = this.alertService.showConfirm("Inscritos Competicao",msgPergunta,"Fechar","Salvar");
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.inscricaoService.InserirInscricao(incricoes) : EMPTY)
      ).subscribe(
        success => {
                    delay(30000);
                    this.alertService.showAlertSuccess("Jogadores inscritos com sucesso");
                    this.router.navigate(['home'])
                    },
        error =>  {
                  this.alertService.showAlertDanger("Erro ao inscrver jogadores") ;
                  }
      )

  }

}
