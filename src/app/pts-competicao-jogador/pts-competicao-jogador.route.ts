import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'


import {PtsCompeticaoJogadorComponent} from './pts-competicao-jogador.component'
import {ListPtsCompeticaoJogadorComponent} from './list-pts-competicao-jogador/list-pts-competicao-jogador.component'
import { PtsCompeticaoImportacaoComponent} from './pts-competicao-importacao/pts-competicao-importacao.component'
import {PtsCompeticaoJogadorResolverGuard} from './guards/pts-competicao-jogador.resolver.guard'
import {PtsEquipesImportaComponent} from './pts-equipes-importa/pts-equipes-importa.component'
import { AuthGuard } from '../guards/auth.guard'
import { DeactivateGuard } from '../guards/deactive.guard'

export const ptscompeticaojogadorRoutes: Routes = [
    {path: 'ptscompeticaojogador', component: PtsCompeticaoJogadorComponent,resolve:{ptscompeticaojogador :PtsCompeticaoJogadorResolverGuard},canActivate : [AuthGuard], canDeactivate : [DeactivateGuard], canLoad:[AuthGuard]},
    {path: 'ptscompeticaojogador/:id',component : PtsCompeticaoJogadorComponent,resolve:{ ptscompeticaojogador :PtsCompeticaoJogadorResolverGuard},canActivate : [AuthGuard],canDeactivate : [DeactivateGuard],canLoad:[AuthGuard]},
    {path: 'ptscompeticoesjogadores', component: ListPtsCompeticaoJogadorComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
    {path: 'importacaoptscomp', component: PtsCompeticaoImportacaoComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
    {path: 'importacaojogoequipe', component: PtsEquipesImportaComponent,canActivate : [AuthGuard],canLoad:[AuthGuard]},
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(ptscompeticaojogadorRoutes)], 
  exports: [RouterModule]
})
export class PtsCompeticaoJogadorRouting { }