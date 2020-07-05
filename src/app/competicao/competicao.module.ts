import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CompeticaoComponent } from './competicao.component';
import { CompeticaoListComponent } from './competicao-list/competicao-list.component';
import { CompeticaoService } from './competicao.service';
import { CompeticaoListSortableHeader } from './competicao-list/sortable.directive';
import { CompeticaoRoutingModule } from './competicao.route';
import { SharedModule} from  '../shared/shared.module';
import { CompeticaoResolverGuard } from './guards/competicao.resolver.guard';
 


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, CompeticaoRoutingModule,SharedModule.forRoot()],
  exports: [],
  declarations: [CompeticaoComponent,CompeticaoListComponent,CompeticaoListSortableHeader],
  providers: [CompeticaoService, CompeticaoResolverGuard],
})
export class CompeticaoModule { }
     