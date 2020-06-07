import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {Jogador} from '../jogador.model';
import {JogadorListService} from './jogador-list.service';
import {JogadorService} from '../jogador.service'
import {JogadorListSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'cft-jogador-list',
  templateUrl: './jogador-list.component.html',
  styleUrls: ['./jogador-list.component.css'],
  providers: [JogadorListService, DecimalPipe]
})
export class JogadorListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: JogadorListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private jogadorService : JogadorService,
        private router: Router) {
    this.jogadores$ = service.jogadores$;
    this.total$ = service.total$;
  }
 
  ngOnInit(): void {
    delay(3000);
  }

  jogadores$: Observable<Jogador[]>;
  total$: Observable<number>;

  @ViewChildren(JogadorListSortableHeader) headers: QueryList<JogadorListSortableHeader>;

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

  ExcluiJogador(id: number){
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja excluir este clube?","Fechar","Excluir");
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.jogadorService.ExcluirJogador(id) : EMPTY)
    ).subscribe(
      success => {  
                   this.alertService.showAlertSuccess("Clube excluir com sucesso");
                  //  window.location.reload();
                   this.router.navigate(['home'])
                   },
      error =>  { 
                this.alertService.showAlertDanger("Erro ao excluir clube. Tente novamente") ;
                }
    )
  }

  onDeclineInsert(){
    this.insertModalRef.hide();
  }

}
 