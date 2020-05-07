import {Routes, RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'

import {LoginComponent} from "./login/login.component"
import {UsuarioComponent} from "./usuario/usuario.component"
import {HomeComponent} from "./home/home.component"
import {ClubeComponent} from './clube/clube.component'
import {ClubeListComponent} from './clube/clube-list/clube-list.component'
import {ClubeResolverGuard} from './clube/guards/clube.resolver.guard'
import {DiretivasCustomizadasComponent} from './diretivas-customizadas/diretivas-customizadas.component'
import {ExemplosPipeComponent} from './exemplos-pipe/exemplos-pipe.component'
import { AuthGuard } from './guards/auth.guard'
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component'



export const appRoutes: Routes = [
    {path: 'login', component : LoginComponent},
    {path: 'usuario', component: UsuarioComponent, canActivate : [AuthGuard],canLoad:[AuthGuard]},  //canActivateChild
    {path: 'home', component: HomeComponent, canActivate : [AuthGuard],canLoad:[AuthGuard]},
    { path: '', redirectTo : 'home', pathMatch: 'full'},
    // {path: 'clube', component: ClubeComponent,resolve:{clube :ClubeResolverGuard}},
    // {path: 'clube/:id',component : ClubeComponent,resolve:{ clube :ClubeResolverGuard}},
    // {path: 'clubes', component: ClubeListComponent},
    {path: 'diretivasCuston', component: DiretivasCustomizadasComponent},
    {path: 'exemplosPipes',component: ExemplosPipeComponent} ,
    {path: '**',component: PaginaNaoEncontradaComponent,canActivate : [AuthGuard]}  
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
