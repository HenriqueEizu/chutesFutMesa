import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { EquipeJogadorComponent } from './equipe-jogador.component';
import { EquipeJogadorService } from './equipe-jogador.service';
import { EquipeJogadorRouting } from './equipe-jogador.route';
import { SharedModule} from  '../shared/shared.module';
import { EquipeJogadorResolverGuard } from './guards/equipe-jogador.resolver.guard';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxScrollTopModule } from 'ngx-scrolltop';
 

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DragDropModule,EquipeJogadorRouting,SharedModule.forRoot(),MatExpansionModule,NgxScrollTopModule],
  exports: [],
  declarations: [EquipeJogadorComponent],
  providers: [EquipeJogadorService, EquipeJogadorResolverGuard],
})
export class EquipeJogadorModule { }
 