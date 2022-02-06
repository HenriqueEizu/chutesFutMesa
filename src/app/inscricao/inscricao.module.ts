import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';


import { InscricaoComponent } from './inscricao.component';
import { InscricaoRoutingModule } from './inscricao.route';
import { SharedModule} from  '../shared/shared.module';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, InscricaoRoutingModule,SharedModule.forRoot(),MatExpansionModule],
  exports: [],
  declarations: [InscricaoComponent],
})
export class InscricaoModule { }
     