import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {ClubeComponent} from './clube.component'
import {ClubeListComponent} from './clube-list/clube-list.component'
import {ClubeResolverGuard} from './guards/clube.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const clubeRoutes: Routes = [
    {path: 'clube', component: ClubeComponent,resolve:{clube :ClubeResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'clube/:id',component : ClubeComponent,resolve:{ clube :ClubeResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'clubes', component: ClubeListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(clubeRoutes)], 
  exports: [RouterModule]
})
export class CursoRoutingModule { }
  