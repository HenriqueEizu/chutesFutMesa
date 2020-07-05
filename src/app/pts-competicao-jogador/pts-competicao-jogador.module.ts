import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {PtsCompeticaoJogadorComponent} from './pts-competicao-jogador.component'
import {ListPtsCompeticaoJogadorComponent} from './list-pts-competicao-jogador/list-pts-competicao-jogador.component'
import {PtsCompeticaoJogadorService } from './pts-competicao-jogador.service';
import { PtsCompeticaoJogadorListSortableHeader } from './list-pts-competicao-jogador/sortable.directive';
import { PtsCompeticaoJogadorRouting } from './pts-competicao-jogador.route';
import { SharedModule} from  '../shared/shared.module';
import {PtsCompeticaoJogadorResolverGuard} from './guards/pts-competicao-jogador.resolver.guard'

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PtsCompeticaoJogadorRouting,SharedModule.forRoot()],
  exports: [],
  declarations: [PtsCompeticaoJogadorComponent,ListPtsCompeticaoJogadorComponent,PtsCompeticaoJogadorListSortableHeader],
  providers: [PtsCompeticaoJogadorService, PtsCompeticaoJogadorResolverGuard],
})
export class PtsCompeticaoJogadorModule { }
    
 