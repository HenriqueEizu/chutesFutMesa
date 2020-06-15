import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {Competicao} from '../competicao.model';
import {CompeticaoListService} from './competicao-list.service';
import {CompeticaoService} from '../competicao.service'
import {CompeticaoListSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'cft-competicao-list',
  templateUrl: './competicao-list.component.html',
  styleUrls: ['./competicao-list.component.css'],
  providers: [CompeticaoService, DecimalPipe]
})
export class CompeticaoListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: CompeticaoListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private competicaoService : CompeticaoService,
        private router: Router) {
    this.competicoes$ = service.competicoes$;
    this.total$ = service.total$;
  }
 
  ngOnInit(): void { 
    delay(3000);
  }

  competicoes$: Observable<Competicao[]>;
  total$: Observable<number>;

  @ViewChildren(CompeticaoListSortableHeader) headers: QueryList<CompeticaoListSortableHeader>;

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
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja excluir esta competicao?","Fechar","Excluir");
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.competicaoService.ExcluirCompeticao(id) : EMPTY)
    ).subscribe(
      success => {  
                   this.alertService.showAlertSuccess("Competicao excluir com sucesso");
                  //  window.location.reload();
                   this.router.navigate(['home'])
                   },
      error =>  { 
                this.alertService.showAlertDanger("Erro ao excluir competicao. Tente novamente") ;
                }
    )
  }

  onDeclineInsert(){
    this.insertModalRef.hide();
  }

 
}
