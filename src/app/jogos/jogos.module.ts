import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { JogosComponent } from  './jogos.component'
import { JogosListComponent } from './jogos-list/jogos-list.component';
import { JogosService } from './jogos.service';
import { JogosListSortableHeader } from './jogos-list/sortable.directive';
import { JogosRouting } from './jogos.routing';
import { SharedModule} from  '../shared/shared.module';
import { JogosResolverGuard } from './guards/jogos.resolver.guard';

 

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, JogosRouting,SharedModule.forRoot()],
  exports: [],
  declarations: [JogosComponent,JogosListComponent,JogosListSortableHeader],
  providers: [JogosService, JogosResolverGuard],
})
export class JogosModule { }

