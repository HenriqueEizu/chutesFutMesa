import {NgModule, ModuleWithProviders} from "@angular/core"
import {CommonModule} from '@angular/common'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import {InputComponent} from './input/input.component';
import { AlertModalComponent } from './alertmodal/alertmodal.component';
import { AlertModalService } from './alertmodal/alertmodal.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FundoAmareloDirective } from './fundo-amarelo.directive';
import { HighlightMouseDirective } from './highlight-mouse.directive';
import { HighlightDirective } from './highlight.directive';
import { NgElseDirective } from './ng-else.directive';
import { TooltipModule } from 'ng2-tooltip-directive';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { TableSortFilterSearchComponent } from './table-sort-filter-search/table-sort-filter-search.component';

// import { AlertModalComponent } from './alert-modal/alert-modal.component'

@NgModule({
    declarations: [InputComponent, AlertModalComponent, ConfirmModalComponent,FundoAmareloDirective
                , HighlightMouseDirective, HighlightDirective, NgElseDirective],
    imports : [CommonModule,FormsModule,ReactiveFormsModule,TooltipModule,Ng2SearchPipeModule
                ,NgxPaginationModule,NgbModule],
    exports: [InputComponent,CommonModule,FormsModule,ReactiveFormsModule,HighlightDirective
                ,AlertModalComponent,ConfirmModalComponent,FundoAmareloDirective
                ,HighlightMouseDirective,HighlightDirective,NgElseDirective
                ,TooltipModule,Ng2SearchPipeModule,NgxPaginationModule,NgbModule],
    entryComponents : [AlertModalComponent],
})

export class SharedModule{
    static forRoot(): ModuleWithProviders{
        return {
            ngModule: SharedModule,
            providers: [AlertModalService]
        }
    }
}