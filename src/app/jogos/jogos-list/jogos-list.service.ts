import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Jogos} from '../jogos.model';
import {JogosService} from '../jogos.service';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  jogos: Jogos[];
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

function sort(jogos: Jogos[], column: SortColumn, direction: string): Jogos[] {
  if (direction === '' || column === '') {
    return jogos;
  } else {
    return [...jogos].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(jogo: Jogos, term: string, pipe: PipeTransform) {
  return jogo.JG_JGDATA
    || jogo.OBJ_JOGADOR1.JO_JOAPELIDO.toLowerCase().includes(term.toLowerCase())
    || jogo.OBJ_JOGADOR2.JO_JOAPELIDO.toLowerCase().includes(term.toLowerCase())
    || jogo.OBJ_JOGADOR1.OBJ_CLUBE.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
    || jogo.OBJ_JOGADOR2.OBJ_CLUBE.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class JogosListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _jogos$ = new BehaviorSubject<Jogos[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public JOGOS : Jogos[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private jogosServ : JogosService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._jogos$.next(result.jogos);
      this._total$.next(result.total);
    });

    this.jogosServ.GetAllJogos().subscribe((es : Jogos[]) => {
      this.JOGOS = es});

    this._search$.next();
  
  }

  get jogos$() { return this._jogos$.asObservable(); }
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
 
    let jogos = sort(this.JOGOS, sortColumn, sortDirection);

    // 2. filter
    jogos = jogos.filter(jogos => matches(jogos, searchTerm, this.pipe));
    const total = jogos.length; 

    // 3. paginate
    jogos = jogos.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({jogos, total})

    return of({jogos, total});
    
  }
}