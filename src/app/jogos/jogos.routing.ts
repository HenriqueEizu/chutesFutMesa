import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import { JogosComponent } from  './jogos.component'
import { JogosListComponent } from './jogos-list/jogos-list.component';
import { JogosResolverGuard} from './guards/jogos.resolver.guard'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'



export const JogosRoutes: Routes = [
    {path: 'jogo', component: JogosComponent,resolve:{jogo :JogosResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'jogo/:id',component : JogosComponent,resolve:{ jogo :JogosResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'jogos', component: JogosListComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(JogosRoutes)],
  exports: [RouterModule]
})
export class JogosRouting { }
  