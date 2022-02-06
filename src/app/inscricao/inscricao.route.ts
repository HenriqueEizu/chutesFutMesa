import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {InscricaoComponent} from './inscricao.component'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const inscricaoRoutes: Routes = [
    {path: 'inscricao', component: InscricaoComponent,canActivate : [AuthGuard],  canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(inscricaoRoutes)], 
  exports: [RouterModule]
})
export class InscricaoRoutingModule { }
   