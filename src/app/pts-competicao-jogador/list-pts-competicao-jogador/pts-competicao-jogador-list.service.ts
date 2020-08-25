import {Injectable, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';

import {PtsCompeticaoJogador} from '../PtsCompeticaoJogador.model';
import {PtsCompeticaoJogadorService} from '../pts-competicao-jogador.service';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  ptsCompeticoesJogadores: PtsCompeticaoJogador[];
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

function sort(ptsCompeticoesJogadores: PtsCompeticaoJogador[], column: SortColumn, direction: string): PtsCompeticaoJogador[] {
  if (direction === '' || column === '') {
    return ptsCompeticoesJogadores;
  } else {
    return [...ptsCompeticoesJogadores].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(ptsCompeticaoJogador: PtsCompeticaoJogador, term: string, pipe: PipeTransform) {
  return ptsCompeticaoJogador.OBJ_COMPETICAO.CP_CPDESCRICAO.toLowerCase().includes(term.toLowerCase())
    || ptsCompeticaoJogador.OBJ_JOGADOR.JO_JOAPELIDO.toLowerCase().includes(term.toLowerCase())
    || String(ptsCompeticaoJogador.PJ_PJPONTOS).toLowerCase().includes(term.toLowerCase())
    || String(ptsCompeticaoJogador.OBJ_COMPETICAO.OBJ_Rodada.RO_RODESCRICAO).toLowerCase().includes(term.toLowerCase())
    || ptsCompeticaoJogador.OBJ_JOGADOR.OBJ_CLUBE.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class PtsCompeticaoJogadorListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _ptsCompeticoesJogadores$ = new BehaviorSubject<PtsCompeticaoJogador[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public PTSCOMPETICOESJOGADORES : PtsCompeticaoJogador[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private PtsCompeticaoJogadorServ : PtsCompeticaoJogadorService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._ptsCompeticoesJogadores$.next(result.ptsCompeticoesJogadores);
      this._total$.next(result.total);
    });

    this.PtsCompeticaoJogadorServ.GetAllPtsCompeticaoJogador().subscribe((cp : PtsCompeticaoJogador[]) => {
      this.PTSCOMPETICOESJOGADORES = cp
      this._search$.next(); 
    });
  
  }

  get ptsCompeticoesJogadores$() { return this._ptsCompeticoesJogadores$.asObservable(); }
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
 
    let ptsCompeticoesJogadores = sort(this.PTSCOMPETICOESJOGADORES, sortColumn, sortDirection);

    // 2. filter
    ptsCompeticoesJogadores = ptsCompeticoesJogadores.filter(ptsCompeticaoJogador => matches(ptsCompeticaoJogador, searchTerm, this.pipe));
    const total = ptsCompeticoesJogadores.length; 

    // 3. paginate
    ptsCompeticoesJogadores = ptsCompeticoesJogadores.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({ptsCompeticoesJogadores, total})

    return of({ptsCompeticoesJogadores, total});
    
  }
}