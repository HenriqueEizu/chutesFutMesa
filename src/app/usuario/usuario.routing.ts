import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {UsuarioComponent} from './usuario.component'
import {UsuarioListComponent} from './usuario-list/usuario-list.component'
import {UsuarioResolverGuard} from './guards/usuario.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const clubeRoutes: Routes = [
    {path: 'usuario', component: UsuarioComponent,resolve:{usuario :UsuarioResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'usuario/:id',component : UsuarioComponent,resolve:{ usuario :UsuarioResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'listausuarios', component: UsuarioListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(clubeRoutes)],
  exports: [RouterModule]
})
export class UsuarioRouting { }
