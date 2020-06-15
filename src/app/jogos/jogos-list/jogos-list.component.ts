import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router'; 

import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import {Jogos} from '../jogos.model';
import {JogosListService} from './jogos-list.service';
import {JogosService} from '../jogos.service'
import {JogosListSortableHeader, SortEvent} from './sortable.directive';
@Component({
  selector: 'cft-jogos-list',
  templateUrl: './jogos-list.component.html',
  styleUrls: ['./jogos-list.component.css'],
  providers: [JogosListService, DecimalPipe]
})
export class JogosListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: JogosListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private jogadorService : JogosService,
        private router: Router) {
    this.jogos$ = service.jogos$;
    this.total$ = service.total$;
  }
 
  ngOnInit(): void {
    delay(3000); 
  }

  jogos$: Observable<Jogos[]>;
  total$: Observable<number>;

  @ViewChildren(JogosListSortableHeader) headers: QueryList<JogosListSortableHeader>;

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

}
