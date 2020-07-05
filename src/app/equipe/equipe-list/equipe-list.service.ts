
import {Injectable, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';

import { Equipe } from './../equipe.model';
import {EquipeService} from '../equipe.service';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  equipes: Equipe[];
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

function sort(equipes: Equipe[], column: SortColumn, direction: string): Equipe[] {
  if (direction === '' || column === '') {
    return equipes;
  } else {
    return [...equipes].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
} 
 
function matches(equipe: Equipe, term: string, pipe: PipeTransform) {
  return equipe.EQ_EQNOME.toLowerCase().includes(term.toLowerCase())
    || equipe.OBJ_USUARIO.US_USNOMETRATAMENTO.toLowerCase().includes(term.toLowerCase())
    || equipe.EQ_EQATIVO
}

@Injectable({providedIn: 'root'})
export class EquipeListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _equipes$ = new BehaviorSubject<Equipe[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public EQUIPES : Equipe[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private competicaoServ : EquipeService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._equipes$.next(result.equipes);
      this._total$.next(result.total);
    });

    this.competicaoServ.GetAllEquipe().subscribe((cp : Equipe[]) => {
      this.EQUIPES = cp});

    this._search$.next(); 
  
  }

  get equipes$() { return this._equipes$.asObservable(); }
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
 
    let equipes = sort(this.EQUIPES, sortColumn, sortDirection);

    // 2. filter
    equipes = equipes.filter(competicao => matches(competicao, searchTerm, this.pipe));
    const total = equipes.length; 

    // 3. paginate
    equipes = equipes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({equipes, total})

    return of({equipes, total});
    
  }
}