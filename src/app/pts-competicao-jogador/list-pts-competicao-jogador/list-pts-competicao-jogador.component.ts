import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {PtsCompeticaoJogador} from '../PtsCompeticaoJogador.model';
import {PtsCompeticaoJogadorListService} from './pts-competicao-jogador-list.service'
import {PtsCompeticaoJogadorService} from '../pts-competicao-jogador.service'
import {PtsCompeticaoJogadorListSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'cft-list-pts-competicao-jogador',
  templateUrl: './list-pts-competicao-jogador.component.html',
  styleUrls: ['./list-pts-competicao-jogador.component.css'],
  providers: [PtsCompeticaoJogadorListService, DecimalPipe] 
})
export class ListPtsCompeticaoJogadorComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: PtsCompeticaoJogadorListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private ptscompeticaojogadorService : PtsCompeticaoJogadorService,
        private router: Router) {
    this.ptscompeticoesjogadores$ = service.ptsCompeticoesJogadores$;
    this.total$ = service.total$;
  }
  
  ngOnInit(): void { 
    delay(3000);
  }

  ptscompeticoesjogadores$: Observable<PtsCompeticaoJogador[]>;
  total$: Observable<number>;

  @ViewChildren(PtsCompeticaoJogadorListSortableHeader) headers: QueryList<PtsCompeticaoJogadorListSortableHeader>;

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
 
  ExcluiCompeticao(id: number){
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja excluir esta a pontuação da competição?","Fechar","Excluir");
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.ptscompeticaojogadorService.ExcluirPtsCompeticaoJogador(id) : EMPTY)
    ).subscribe(
      success => {  
                   this.alertService.showAlertSuccess("Pontuação de Competicao excluida com sucesso");
                  //  window.location.reload();
                   this.router.navigate(['home'])
                   },
      error =>  { 
                this.alertService.showAlertDanger("Erro ao excluir pontuação de competicao. Tente novamente") ;
                }
    )
  }

  onDeclineInsert(){
    this.insertModalRef.hide();
  }
   

}
 