import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Clube} from '../clube.model';
import {ClubeService} from '../clube.service';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  clubes: Clube[];
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

function sort(clubes: Clube[], column: SortColumn, direction: string): Clube[] {
  if (direction === '' || column === '') {
    return clubes;
  } else {
    return [...clubes].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(clube: Clube, term: string, pipe: PipeTransform) {
  return clube.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
    || clube.CL_CLEMAIL.toLowerCase().includes(term.toLowerCase())
    || clube.CL_CLRESPONSAVEL.toLowerCase().includes(term.toLowerCase())
    || clube.CL_CLSIGLA.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class ClubeListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _clubes$ = new BehaviorSubject<Clube[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public CLUBES : Clube[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private clubeServ : ClubeService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._clubes$.next(result.clubes);
      this._total$.next(result.total);
    });

    this.clubeServ.GetAllClube().subscribe((es : Clube[]) => {
      this.CLUBES = es});

    this._search$.next();
  
  }

  get clubes$() { return this._clubes$.asObservable(); }
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
 
    let clubes = sort(this.CLUBES, sortColumn, sortDirection);

    // 2. filter
    clubes = clubes.filter(clube => matches(clube, searchTerm, this.pipe));
    const total = clubes.length;

    // 3. paginate
    clubes = clubes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({clubes, total})

    return of({clubes, total});
    
  }
}