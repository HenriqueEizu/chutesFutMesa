import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import { Equipe } from './../equipe.model';
import { EquipeListService} from './equipe-list.service';
import { EquipeService} from '../equipe.service'
import { EquipeListSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'cft-equipe-list',
  templateUrl: './equipe-list.component.html',
  styleUrls: ['./equipe-list.component.css'],
  providers: [EquipeListService, DecimalPipe] 
})
export class EquipeListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: EquipeListService,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private equipeService : EquipeService,
    private router: Router) {
  this.equipes$ = service.equipes$;
  this.total$ = service.total$;
  }

  ngOnInit(): void { 
    delay(3000);
  }
 
  equipes$: Observable<Equipe[]>;
  total$: Observable<number>;

  @ViewChildren(EquipeListSortableHeader) headers: QueryList<EquipeListSortableHeader>;

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

  ExcluirEquipe(id: number){
    const result$ = this.alertService.showConfirm("Confirmação de Exclusão","Você realmente deseja excluir esta equipe?","Fechar","Excluir");
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.equipeService.ExcluirEquipe(id) : EMPTY)
    ).subscribe(
      success => {  
                   this.alertService.showAlertSuccess("Equipe excluir com sucesso");
                  //  window.location.reload();
                   this.router.navigate(['home'])
                   },
      error =>  { 
                this.alertService.showAlertDanger("Erro ao excluir equipe. Tente novamente") ;
                }
    )
  }

}
