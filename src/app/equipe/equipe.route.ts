import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {EquipeComponent} from './equipe.component'
import {EquipeListComponent} from './equipe-list/equipe-list.component'
import {EquipeResolverGuard} from './guards/equipe.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'

 

export const equipeRoutes: Routes = [
    {path: 'equipe', component: EquipeComponent,resolve:{equipe :EquipeResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'equipe/:id',component : EquipeComponent,resolve:{ equipe :EquipeResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'equipes', component: EquipeListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(equipeRoutes)], 
  exports: [RouterModule]
})
export class EquipeRouting { }
   