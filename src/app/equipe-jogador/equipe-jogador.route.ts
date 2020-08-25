import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {EquipeJogadorComponent} from './equipe-jogador.component'
import {EquipeJogadorResolverGuard} from './guards/equipe-jogador.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'

 

export const equipeJogadorRoutes: Routes = [
    {path: 'equipejogador', component: EquipeJogadorComponent,resolve:{equipe :EquipeJogadorResolverGuard},canActivate : [AuthGuard], canLoad:[AuthGuard]},
    {path: 'equipejogador/:id',component : EquipeJogadorComponent,resolve:{ equipe :EquipeJogadorResolverGuard},canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(equipeJogadorRoutes)], 
  exports: [RouterModule]
})
export class EquipeJogadorRouting { }
   