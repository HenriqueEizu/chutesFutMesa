import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ClubeComponent } from './clube.component';
import { ClubeListComponent } from './clube-list/clube-list.component';
import { ClubeService } from './clube.service';
import { ClubeListSortableHeader } from './clube-list/sortable.directive';
import { CursoRoutingModule } from './clube.routing.module';
import { SharedModule} from  '../shared/shared.module';
import { ClubeResolverGuard } from './guards/clube.resolver.guard';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, CursoRoutingModule,SharedModule.forRoot()],
  exports: [],
  declarations: [ClubeComponent,ClubeListComponent,ClubeListSortableHeader],
  providers: [ClubeService, ClubeResolverGuard],
})
export class ClubeModule {} 

