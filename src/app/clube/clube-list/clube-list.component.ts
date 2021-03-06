import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {Clube} from '../clube.model';
import {ClubeListService} from './clube-list.service';
import {ClubeService} from '../clube.service'
import {ClubeListSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'cft-clube-list',
  templateUrl: './clube-list.component.html',
  styleUrls: ['./clube-list.component.css'],
  providers: [ClubeListService, DecimalPipe]
})
export class ClubeListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: ClubeListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private clubeService : ClubeService,
        private router: Router) {
    this.clubes$ = service.clubes$;
    this.total$ = service.total$;
  }
  
  ngOnInit(): void { 
    delay(3000);
  }

  clubes$: Observable<Clube[]>;
  total$: Observable<number>;

  @ViewChildren(ClubeListSortableHeader) headers: QueryList<ClubeListSortableHeader>;

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

  ExcluiClube(id: number){
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja excluir este clube?","Fechar","Excluir");
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.clubeService.ExcluirClube(id) : EMPTY)
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
 