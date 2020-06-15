import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,AsyncValidatorFn,ValidationErrors, FormControl } from '@angular/forms'
import { formatDate} from "@angular/common";
import {switchMap, take, map, delay, tap} from  'rxjs/operators'
import {Observable} from 'rxjs'
import {ClubeService} from './clube.service'
import {Router, ActivatedRoute} from '@angular/router'
import {Clube, Estado} from './clube.model'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../shared/alertmodal/alertmodal.service'
import {  EMPTY , Subscription } from 'rxjs';
import {DIR_CLUBE} from '../app.api'
import { IFormCanDeactivate } from '../guards/form-deactivate';


@Component({
  selector: 'cft-clube',
  templateUrl: './clube.component.html',
  styleUrls: ['./clube.component.css']
})
export class ClubeComponent implements OnInit, IFormCanDeactivate {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;
  estados : Estado[];
  blnExisteClube : boolean;
  clubeForm: FormGroup
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  numberPattern = /^[1-9]*$/
  message: String;
  clubeExiste : Observable<Clube>;
  fileToUpload: File = null;
  myDate = new Date();
  clubeSelecionado: Clube;
  clubeCarregado : Clube;
  inscricao :  Subscription;
  clube : any;
  // pagina : number;

   pathImage = DIR_CLUBE;
   image = "clube1.png"


   pathimagecomplete = DIR_CLUBE + this.image;
   imageEscolhida : string;

  constructor(private clubeService: ClubeService
     , private router: Router
     , private formBuilder : FormBuilder
      , private modalService: BsModalService
     ,private alertService: AlertModalService
     ,private route: ActivatedRoute){

      }
  podeDesativar() {
    return true;
  }
  
  ngOnInit(): void {
    this.clubeService.GetAllEstado().subscribe((es : Estado[]) => {
    this.estados = es;
    });

   //***************  queryString  */
    // this.inscricao = this.route.queryParams.subscribe((queryParams: any) =>{
    //   this.pagina = queryParams['pagina'];
    // })

        // this.inscricao = this.route.params.subscribe((params:any) => {
    //   this.clubeCarregado = params['clube'];
    // })
    // this.router.navigate(['/clubes'],{queryParams: {'pagina': 2}})
    //*********************************fim   **************** */

    // this.route.params.subscribe((params: any) =>{
    //       const id = params['id'];
    //       const clube$ = this.clubeService.VerificaClube(id);
    //       clube$.subscribe((clube : Clube) => {
    //         this.updateForm(clube);
    //       });

    //   }

    // this.route.params.pipe(map((params : any) => params['id']),
    // switchMap(id => this.clubeService.VerificaClube(id)))
    // .subscribe(clube => {
    //   this.pathimagecomplete = clube.CL_CLEMBLEMA;
    //   this.updateForm(clube)});


    this.clube = this.route.snapshot.data['clube'];
    this.clubeCarregado =this.clube;

    // this.route.params.subscribe((params:any) => {
    //   console.log(params);
    //   this.clubeCarregado = params['clube']
    // });

    if (this.clube.CL_CLEMBLEMA != "" && this.clube.CL_CLEMBLEMA != null){
      this.pathimagecomplete = this.clube.CL_CLEMBLEMA;
    }


    this.clubeForm = this.formBuilder.group({
      CL_CLID : [this.clube.CL_CLID],
      CL_CLNOME: this.formBuilder.control(this.clube.CL_CLNOME,[Validators.required, Validators.minLength(6),Validators.maxLength(300)],[this.ValidaNomeClube.bind(this)]),
      CL_CLENDERECO: this.formBuilder.control(this.clube.CL_CLENDERECO),
      CL_CLCIDADE: this.formBuilder.control(this.clube.CL_CLCIDADE),
      CL_CLSIGLA: this.formBuilder.control(this.clube.CL_CLSIGLA,[Validators.required, Validators.minLength(2),Validators.maxLength(5)],[this.ValidaSiglaClube.bind(this)]),
      CL_CLEMBLEMA: this.formBuilder.control(this.clube.CL_CLEMBLEMA),
      CL_CLEMAIL: this.formBuilder.control(this.clube.CL_CLEMAIL,[Validators.required, Validators.pattern(this.emailPattern)]),
      CL_CLATIVO: this.formBuilder.control(this.clube.CL_CLATIVO),
      CL_CLRESPONSAVEL: this.formBuilder.control(this.clube.CL_CLRESPONSAVEL,[Validators.required, Validators.minLength(6)]),
      CL_CLTELEFONE: this.formBuilder.control(this.clube.CL_CLTELEFONE,[Validators.maxLength(14)]),
      CL_CLUF: this.formBuilder.control(this.clube.CL_CLUF),
    });

  }

  VerificaNomeClube(NomeClube:string, NomeClube2:string ="clube"){
    return this.clubeService.VerificaClube().pipe(
      delay(3000),
      map((dados: {clubes : any[]}) => dados.clubes),
      tap(console.log),
      map((dados: {nomeClube : string}[]) => dados.filter(v => v.nomeClube.toUpperCase() === NomeClube.toUpperCase() && v.nomeClube.toUpperCase() != NomeClube2.toUpperCase() )),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }

  ValidaNomeClube(formControl : FormControl)
  {
    return this.VerificaNomeClube(formControl.value, this.clube.CL_CLNOME != null ? this.clube.CL_CLNOME : ""  ).pipe(
      tap(console.log),
      map(emailExiste => emailExiste ? {nomeClubeInvalido: true} : null )
    );
  }

  VerificaSiglaClube(SiglaClube:string, SiglaClube2:string = "sigla"){
    
    return this.clubeService.VerificaClube().pipe(
      delay(3000),
      map((dados: {clubes : any[]}) => dados.clubes),
      tap(console.log),
      map((dados: {siglaClube : string}[]) => dados.filter(v => v.siglaClube.toUpperCase() === SiglaClube.toUpperCase() && v.siglaClube.toUpperCase() != SiglaClube2.toUpperCase())),
      tap(console.log ),
      map(dados => dados.length > 0),
      tap(console.log)
    )
  }


  ValidaSiglaClube(formControl : FormControl) 
  {
    return this.VerificaSiglaClube(formControl.value, this.clube.CL_CLSIGLA != null ? this.clube.CL_CLSIGLA : "").pipe(
      tap(console.log),
      map(emailExiste => emailExiste ? {SiglaClubeInvalido: true} : null )
    );
  }





  ngOnDestroy(){
    // this.inscricao.unsubscribe();
  }

  updateForm(clube : Clube){
    this.clubeForm.patchValue({
      CL_CLNOME: clube.CL_CLNOME,
      CL_CLENDERECO: clube.CL_CLENDERECO,
      CL_CLCIDADE: clube.CL_CLCIDADE,
      CL_CLSIGLA: clube.CL_CLSIGLA,
      CL_CLEMBLEMA: clube.CL_CLEMBLEMA,
      CL_CLEMAIL: clube.CL_CLEMAIL,
      CL_CLATIVO: clube.CL_CLATIVO,
      CL_CLRESPONSAVEL: clube.CL_CLRESPONSAVEL,
      CL_CLTELEFONE: clube.CL_CLTELEFONE,
      CL_CLUF: clube.CL_CLUF,
    })

  }

  handleError(){
    this.alertService.showAlertDanger("Erro ao inserir um novo clube.");
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao inserir um novo clube.'
  }

  handleFileInput(files: FileList) {
      this.fileToUpload = files.item(0);
      this.imageEscolhida = files.item(0).name;

  }

  onConfirmInsert(){
    var blnResponse : boolean;
    this.handleError();
    this.clubeService.InserirClube(this.clubeSelecionado).subscribe(
      success => {alert("ok"); this.onDeclineInsert()},
      error =>  {this.handleError(), this.onDeclineInsert()}
    )
  }

  onDeclineInsert(){
    this.insertModalRef.hide();
  }

  uploadFileToActivity() :boolean{
    var sucesso : boolean = true;
    this.clubeService.postFile(this.fileToUpload).pipe(take(1)).subscribe((file : string) => {
      if (file != undefined){
        this.image = file;
        }
      else{
        sucesso = false;
      }
    });

    return sucesso;
  }

  SalvarClube(clube: Clube){

    let msgSuccess = "Clube inserido com sucesso";
    let msgErro = "Erro ao incluir clube. Tente novamente";
    let msgQuestãoTitulo = "Confirmação de Inclusão"
    let msgQuestaoCorpo = "Você realmente deseja inserir este clube?"
    let msgBotao = "Inserir"
    if (this.clubeForm.value.CL_CLID != null){
      msgSuccess = "Clube alterado com sucesso";
      msgErro = "Erro ao atualizar clube. Tente novamente"
      msgQuestãoTitulo = "Confirmação de Alteração"
      msgQuestaoCorpo = "Você realmente deseja alterar este clube?"
      msgBotao = "Alterar"
    }

    this.clubeSelecionado = clube;

    if (clube.CL_CLEMBLEMA == "" || clube.CL_CLEMBLEMA == null){
      clube.CL_CLEMBLEMA = DIR_CLUBE + this.image
    }else if(clube.CL_CLID == null || this.fileToUpload != null){
      if (this.uploadFileToActivity() == true){
        clube.CL_CLEMBLEMA = DIR_CLUBE + this.imageEscolhida
      }
    }

    clube.CL_CLDATACADASTRO = formatDate(this.myDate,"yyyy-MM-dd","en-US");


    const result$ = this.alertService.showConfirm(msgQuestãoTitulo,msgQuestaoCorpo,"Fechar",msgBotao);
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.clubeService.SalvarClube(clube) : EMPTY)
      ).subscribe(
        success => {
                    this.alertService.showAlertSuccess(msgSuccess);
                    this.router.navigate(['clubes'])
                    },
        error =>  {
                  this.alertService.showAlertDanger(msgErro) ;
                  }
      )

  }

}
