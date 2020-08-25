import {Injectable, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';

import {Competicao} from '../competicao.model';
import {CompeticaoService} from '../competicao.service';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  competicoes: Competicao[];
  total: number;
}
 
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
 
const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(competicoes: Competicao[], column: SortColumn, direction: string): Competicao[] {
  if (direction === '' || column === '') {
    return competicoes;
  } else {
    return [...competicoes].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
} 

function matches(competicao: Competicao, term: string, pipe: PipeTransform) {
  return competicao.CP_CPDESCRICAO.toLowerCase().includes(term.toLowerCase())
    || competicao.OBJ_Rodada.RO_RODESCRICAO.toLowerCase().includes(term.toLowerCase())
    || competicao.OBJ_CATEGORIAJOGADOR.CJ_CJDESCRICAO.toLowerCase().includes(term.toLowerCase())
    || String(competicao.CP_CPDATAINICIO).toLowerCase().includes(term.toLowerCase())
    || String(competicao.CP_CPDATALIMITEAPOSTA).toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class CompeticaoListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _competicoes$ = new BehaviorSubject<Competicao[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public COMPETICOES : Competicao[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private competicaoServ : CompeticaoService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._competicoes$.next(result.competicoes);
      this._total$.next(result.total);
    });

    this.competicaoServ.GetAllCompeticao().subscribe((cp : Competicao[]) => {
      this.COMPETICOES = cp
      this._search$.next(); 
    });

    
  
  }

  get competicoes$() { return this._competicoes$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {

    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    var search$ : Observable<SearchResult>;
 
    let competicoes = sort(this.COMPETICOES, sortColumn, sortDirection);

    // 2. filter
    competicoes = competicoes.filter(competicao => matches(competicao, searchTerm, this.pipe));
    const total = competicoes.length; 

    // 3. paginate
    competicoes = competicoes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({competicoes, total})

    return of({competicoes, total});
    
  }
}