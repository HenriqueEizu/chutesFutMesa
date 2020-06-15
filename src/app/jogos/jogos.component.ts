import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate,DatePipe,registerLocaleData} from "@angular/common";
import {Observable, EMPTY, Subject,merge} from 'rxjs'
import {Router, ActivatedRoute} from '@angular/router'
import localeBR from "@angular/common/locales/br";
import { delay, map, tap, filter, take, switchMap, distinctUntilChanged, debounceTime, debounce } from 'rxjs/operators';
import { IFormCanDeactivate } from '../guards/form-deactivate';
registerLocaleData(localeBR, "br");
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
//import * as jquery from 'jquery';
import * as $$ from 'jquery-typeahead'
let $: any = $$;

import { Jogador } from './../jogadores/jogador.model';
import {JogosService} from './jogos.service'
import { AlertModalService } from '../shared/alertmodal/alertmodal.service';
import { JogadorService } from '../jogadores/jogador.service';
import {Jogos} from './jogos.model'

const states = ['<html><img src="/assets/images/icons/jogo1.png" class="mr-2" style="width: 30px"></html>', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  

@Component({
  selector: 'cft-jogos',
  templateUrl: './jogos.component.html',
  styleUrls: ['./jogos.component.css']
})
export class JogosComponent implements OnInit {

  jogosForm: FormGroup
  jogo : any;
  numberPattern = /^[1-9]*$/
  Jogadores : Jogador[]
  $: any;
  

  model: any;

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? states
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  constructor(private jogosService: JogosService
            , private jogadorService :JogadorService
            , private router: Router
            , private formBuilder : FormBuilder
            ,private route: ActivatedRoute
            ,private alertService: AlertModalService){
            }

  podeDesativar() {
    return true;
  }

  // pipe = new DatePipe('pt-BR'); // Use your own locale
  myDate = new Date();
    
  ngOnInit(): void {
   //************************************************** */

   $.typeahead({
    input: ".js-typeahead-user_v1",
    order: "asc",
    source: {
        groupName: {
            // Ajax Request
            // ajax: {
            //     url: "..."
            // }
        }
    },
    callback: {
        onClickBefore: function () 
        // { ... }
    {}}
})

   //**************************************************** */
    

    this.jogadorService.GetAllJogador ().subscribe((jog : Jogador[]) => {
      this.Jogadores = jog;
    });


    this.jogo = this.route.snapshot.data['jogo'];

    this.jogosForm = this.formBuilder.group({
      JG_JGID: [this.jogo.JG_JGID],
      JG_JGDATA: this.formBuilder.control(this.jogo.JG_JGDATA,[Validators.required]),
      JG_CJID: this.formBuilder.control(this.jogo.JG_CJID,[Validators.required, Validators.pattern(this.numberPattern)]),
      JG_JOID1: this.formBuilder.control(this.jogo.JG_JOID1,[Validators.required, Validators.pattern(this.numberPattern)]),
      JG_JGGOL1: this.formBuilder.control(this.jogo.JG_JGGOL1,[Validators.required, Validators.pattern(this.numberPattern)]),
      JG_JOID2: this.formBuilder.control(this.jogo.JG_JOID1,[Validators.required, Validators.pattern(this.numberPattern)]),
      JG_JGGOL2: this.formBuilder.control(this.jogo.JG_JGGOL1,[Validators.required, Validators.pattern(this.numberPattern)]),
      JG_JGATIVO: this.formBuilder.control(this.jogo.JG_JGATIVO),
    })

  }
  
  SalvarJogo(jogo: Jogos){
    let msgSuccess = "Jogador inserido com sucesso";
    let msgErro = "Erro ao incluir Jogador. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir este Jogador?"
    let msgBotao = "Inserir"
    if (this.jogosForm.value.JO_JOID != null){
      msgSuccess = "Jogador alterado com sucesso";
      msgErro = "Erro ao atualizar Jogador. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar este Jogador?"
      msgBotao = "Alterar"
    }

    // jodador.JO_JODATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");
    // const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    // result$.asObservable()
    //   .pipe(
    //     take(1),
    //     switchMap(result => result ? this.jogadorService.SalvarJogador(jodador) : EMPTY)
    //   ).subscribe(
    //     success => {
    //                 delay(30000);
    //                 this.alertService.showAlertSuccess(msgSuccess);
    //                 this.router.navigate(['jogadores'])
    //                 },
    //     error =>  {
    //               this.alertService.showAlertDanger(msgErro) ;
    //               }
    //   )

  }



}
