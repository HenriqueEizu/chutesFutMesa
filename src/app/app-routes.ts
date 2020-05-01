import {Routes} from '@angular/router'
import {LoginComponent} from "./login/login.component"
import {UsuarioComponent} from "./usuario/usuario.component"
import {HomeComponent} from "./home/home.component"
import {ClubeComponent} from './clube/clube.component'
import {ClubeListComponent} from './clube/clube-list/clube-list.component'
import {ClubeResolverGuard} from './clube/guards/clube.resolver.guard'
import {DiretivasCustomizadasComponent} from './diretivas-customizadas/diretivas-customizadas.component'
import {ExemplosPipeComponent} from './exemplos-pipe/exemplos-pipe.component'


export const appRoutes: Routes = [
    {path: '', component : LoginComponent},
    {path: 'usuario', component: UsuarioComponent},
    {path: 'home', component: HomeComponent},
    {path: 'clube', component: ClubeComponent,resolve:{clube :ClubeResolverGuard}},
    {path: 'clube/:id',component : ClubeComponent,resolve:{ clube :ClubeResolverGuard}},
    {path: 'clubes', component: ClubeListComponent},
    {path: 'diretivasCuston', component: DiretivasCustomizadasComponent},
    {path: 'exemplosPipes',component: ExemplosPipeComponent}
]