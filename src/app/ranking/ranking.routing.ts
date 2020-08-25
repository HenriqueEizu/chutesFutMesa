import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import { RankingComponent } from  './ranking.component'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const RankingRoutes: Routes = [
    {path: 'ranking', component: RankingComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(RankingRoutes)],
  exports: [RouterModule]
})
export class RankingRouting { }
  