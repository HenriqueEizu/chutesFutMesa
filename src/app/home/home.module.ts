import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';

import { HomeComponent } from './home.component';
import { HomedRoutingModule } from './home.route';
import { SharedModule} from  '../shared/shared.module';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, HomedRoutingModule,SharedModule.forRoot(),MatExpansionModule],
  exports: [],
  declarations: [HomeComponent],
})
export class HomeModule { }
     