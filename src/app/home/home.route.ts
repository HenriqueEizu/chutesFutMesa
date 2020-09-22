import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {HomeComponent} from './home.component'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const homeRoutes: Routes = [
    {path: 'home', component: HomeComponent,canActivate : [AuthGuard],  canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)], 
  exports: [RouterModule]
})
export class HomedRoutingModule { }
   