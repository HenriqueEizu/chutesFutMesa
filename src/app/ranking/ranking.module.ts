import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxFileDropModule } from 'ngx-file-drop';


import { RankingComponent } from  './ranking.component'
import { RankingService } from './ranking.service';
import { RankingRouting } from './ranking.routing';
import { SharedModule} from  '../shared/shared.module';

 

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RankingRouting,SharedModule.forRoot(),MatExpansionModule,NgxFileDropModule],
  exports: [],
  declarations: [RankingComponent],
  providers: [RankingService],
})
export class RankingModule { }

