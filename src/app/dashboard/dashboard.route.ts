import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {DashboardComponent} from './dashboard.component'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const dashboardRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent,canActivate : [AuthGuard],  canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)], 
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
   