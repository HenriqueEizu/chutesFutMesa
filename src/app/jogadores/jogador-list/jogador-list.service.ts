import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Jogador} from '../jogador.model';
import {JogadorService} from '../jogador.service';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  jogadores: Jogador[];
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

function sort(jogadores: Jogador[], column: SortColumn, direction: string): Jogador[] {
  if (direction === '' || column === '') {
    return jogadores;
  } else {
    return [...jogadores].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(jogador: Jogador, term: string, pipe: PipeTransform) {
  return jogador.JO_JONOME.toLowerCase().includes(term.toLowerCase())
    || jogador.JO_JOAPELIDO.toLowerCase().includes(term.toLowerCase())
    || jogador.OBJ_CLUBE.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class JogadorListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _jogadores$ = new BehaviorSubject<Jogador[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public JOGADORES : Jogador[];

  private _state: State = {
    page: 1,
    pageSize: 50,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private jogadorServ : JogadorService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._jogadores$.next(result.jogadores);
      this._total$.next(result.total);
    });

    this.jogadorServ.GetAllJogador().subscribe((es : Jogador[]) => {
      this.JOGADORES = es
      this._search$.next();
    });

    
  
  }

  get jogadores$() { return this._jogadores$.asObservable(); }
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
 
    let jogadores = sort(this.JOGADORES, sortColumn, sortDirection);

    // 2. filter
    jogadores = jogadores.filter(jogador => matches(jogador, searchTerm, this.pipe));
    const total = jogadores.length; 

    // 3. paginate
    jogadores = jogadores.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({jogadores, total})

    return of({jogadores, total});
    
  }
}