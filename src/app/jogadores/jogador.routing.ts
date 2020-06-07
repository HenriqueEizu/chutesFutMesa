import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import { JogadoresComponent } from  './jogadores.component'
import { JogadorListComponent } from './jogador-list/jogador-list.component';
import { jogadorResolverGuard} from './guards/jogador.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const jogadoresRoutes: Routes = [
    {path: 'jogador', component: JogadoresComponent,resolve:{jogador :jogadorResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'jogador/:id',component : JogadoresComponent,resolve:{ jogador :jogadorResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'jogadores', component: JogadorListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(jogadoresRoutes)],
  exports: [RouterModule]
})
export class JogadorRouting { }
  