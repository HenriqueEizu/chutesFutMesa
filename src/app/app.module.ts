import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {appRoutes} from './app.routing'
import { HttpClientModule, HttpClient , HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonModule} from '@angular/common'
import {LOCALE_ID} from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePt);
import { RouterModule,PreloadAllModules } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule} from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { HomeComponent } from './home/home.component';
import { PaginaNaoEncontradaComponent} from './pagina-nao-encontrada/pagina-nao-encontrada.component'
import { AuthGuard } from './guards/auth.guard';
import { DeactivateGuard } from './guards/deactive.guard';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { NgxScrollTopModule } from 'ngx-scrolltop';


import { DiretivasCustomizadasComponent } from './diretivas-customizadas/diretivas-customizadas.component';
import { ExemplosPipeComponent } from './exemplos-pipe/exemplos-pipe.component';
import { CamelCasePipe } from './camel-case.pipe'
import { ClubeModule } from './clube/clube.module';
import { UsuarioModule} from './usuario/usuario.module'
import { RankingModule } from './ranking/ranking.module';
import { JogadorModule } from './jogadores/jogador.module';
import { JogosModule} from './jogos/jogos.module';
import { CompeticaoModule} from './competicao/competicao.module';
import { PtsCompeticaoJogadorModule } from './pts-competicao-jogador/pts-competicao-jogador.module';
import { EquipeModule } from './equipe/equipe.module';
import { EquipeJogadorModule } from './equipe-jogador/equipe-jogador.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { SharedModule} from  './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import {InscricaoModule} from './inscricao/inscricao.module'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PaginaNaoEncontradaComponent,
    HeaderComponent,
    // HomeComponent,
    DiretivasCustomizadasComponent,
    ExemplosPipeComponent,
    CamelCasePipe,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}),
    CarouselModule.forRoot(),
    FontAwesomeModule,
    HttpClientModule,
    ModalModule.forRoot(),
    SharedModule.forRoot(),
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgxScrollTopModule,

    ClubeModule,
    UsuarioModule,
    JogadorModule,
    JogosModule,
    CompeticaoModule,
    PtsCompeticaoJogadorModule,
    EquipeModule,
    RankingModule,
    EquipeJogadorModule,
    DashboardModule,
    HomeModule,
    InscricaoModule
  ],
  providers: [{provide: LOCALE_ID, useValue:'pt-BR'}, AuthGuard,DeactivateGuard,
              { provide: HTTP_INTERCEPTORS,
                useClass: TokenInterceptor,
                multi: true,
              }
  // ,ClubeService, UsuarioService
],
  bootstrap: [AppComponent],
})
export class AppModule { }
