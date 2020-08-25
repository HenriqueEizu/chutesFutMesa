import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';

import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { DashboardRoutingModule } from './dashboard.route';
import { SharedModule} from  '../shared/shared.module';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DashboardRoutingModule,SharedModule.forRoot(),MatExpansionModule],
  exports: [],
  declarations: [DashboardComponent],
  providers: [DashboardService],
})
export class DashboardModule { }
     