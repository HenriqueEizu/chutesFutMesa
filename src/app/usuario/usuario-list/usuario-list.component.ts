import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren,OnInit, ViewChild} from '@angular/core';
import {Observable, EMPTY} from 'rxjs';

import {Usuario} from '../usuario.model';
import {UsuarioListService} from './usuario-list.service';
import {UsuarioService} from '../usuario.service'
import {UsuarioListSortableHeader, SortEvent} from './sortable.directive';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService} from '../../shared/alertmodal/alertmodal.service'
import { take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router'; 

@Component({
  selector: 'cft-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  providers: [UsuarioListService, DecimalPipe]
})
export class UsuarioListComponent implements OnInit {

  insertModalRef : BsModalRef;
  @ViewChild('template') template;

  constructor(public service: UsuarioListService,
        private modalService: BsModalService,
        private alertService: AlertModalService,
        private usuarioService : UsuarioService,
        private router: Router) {
    this.usuarios$ = service.usuarios$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {

  }

  usuarios$: Observable<Usuario[]>;
  total$: Observable<number>;

  @ViewChildren(UsuarioListSortableHeader) headers: QueryList<UsuarioListSortableHeader>;

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

  ExcluiUsuario(id: number){
    // const result$ = this.alertService.showConfirm("Confirmação de Inclusão","Você realmente deseja inserir este clube?","Fechar","Inserir");
    // result$.asObservable()
    // .pipe(
    //   take(1),
    //   switchMap(result => result ? this.usuarioService.ExcluirClube(id) : EMPTY)
    // ).subscribe(
    //   success => {  
    //                this.alertService.showAlertSuccess("Clube excluir com sucesso");
    //               //  window.location.reload();
    //                this.router.navigate(['home'])
    //                },
    //   error =>  { 
    //             this.alertService.showAlertDanger("Erro ao excluir clube. Tente novamente") ;
    //             }
    // )
  }

  onDeclineInsert(){
    this.insertModalRef.hide();
  }

} 
