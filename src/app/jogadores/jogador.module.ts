import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { JogadoresComponent } from  './jogadores.component'
import { JogadorListComponent } from './jogador-list/jogador-list.component';
import { JogadorService } from './jogador.service';
import { JogadorListSortableHeader } from './jogador-list/sortable.directive';
import { JogadorRouting } from './jogador.routing';
import { SharedModule} from  '../shared/shared.module';
import { jogadorResolverGuard } from './guards/jogador.resolver.guard';

 

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, JogadorRouting,SharedModule.forRoot()],
  exports: [],
  declarations: [JogadoresComponent,JogadorListComponent,JogadorListSortableHeader],
  providers: [JogadorService, jogadorResolverGuard],
})
export class JogadorModule { }

