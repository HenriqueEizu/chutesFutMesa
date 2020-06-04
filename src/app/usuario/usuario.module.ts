import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { UsuarioComponent } from './usuario.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioService } from './usuario.service';
import { UsuarioListSortableHeader } from './usuario-list/sortable.directive';
import { UsuarioRouting } from './usuario.routing';
import { SharedModule} from  '../shared/shared.module';
import { UsuarioInicialComponent } from './usuario-inicial/usuario-inicial.component';
import { ResetSenhaComponent } from './reset-senha/reset-senha.component';
import { TrocaSenhaComponent } from './troca-senha/troca-senha.component';
// import { Usuario } from './guards/clube-deactive.guard';
// import { UsuarioResolverGuard } from './guards/clube.resolver.guard';


@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, UsuarioRouting,SharedModule.forRoot()],
  exports: [],
  declarations: [UsuarioComponent,UsuarioListComponent,UsuarioListSortableHeader, UsuarioInicialComponent, ResetSenhaComponent, TrocaSenhaComponent],
  providers: [UsuarioService], //,ClubeDeactivateGuard, ClubeResolverGuard],
})
export class UsuarioModule {}

