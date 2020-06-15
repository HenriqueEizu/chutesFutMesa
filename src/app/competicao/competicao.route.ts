import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {CompeticaoComponent} from './competicao.component'
import {CompeticaoListComponent} from './competicao-list/competicao-list.component'
import {CompeticaoResolverGuard} from './guards/competicao.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const competicaoRoutes: Routes = [
    {path: 'competicao', component: CompeticaoComponent,resolve:{clube :CompeticaoResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'competicao/:id',component : CompeticaoComponent,resolve:{ clube :CompeticaoResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'competicoes', component: CompeticaoListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(competicaoRoutes)], 
  exports: [RouterModule]
})
export class CompeticaoRoutingModule { }
  