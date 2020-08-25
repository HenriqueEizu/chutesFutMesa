import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { EquipeComponent } from './equipe.component';
import { EquipeListComponent } from './equipe-list/equipe-list.component';
import { EquipeService } from './equipe.service';
import { EquipeListSortableHeader } from './equipe-list/sortable.directive';
import { EquipeRouting } from './equipe.route';
import { SharedModule} from  '../shared/shared.module';
import { EquipeResolverGuard } from './guards/equipe.resolver.guard';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxScrollTopModule } from 'ngx-scrolltop';
 

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DragDropModule,EquipeRouting,SharedModule.forRoot(),MatExpansionModule,NgxScrollTopModule],
  exports: [],
  declarations: [EquipeComponent,EquipeListComponent,EquipeListSortableHeader],
  providers: [EquipeService, EquipeResolverGuard],
})
export class EquipeModule { }
 