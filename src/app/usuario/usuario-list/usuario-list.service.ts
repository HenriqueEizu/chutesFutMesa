import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Usuario} from '../usuario.model';
import {UsuarioService} from '../usuario.service';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap, take} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  usuarios: Usuario[];
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

function sort(usuarios: Usuario[], column: SortColumn, direction: string): Usuario[] {
  if (direction === '' || column === '') {
    return usuarios;
  } else {
    return [...usuarios].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(usuario: Usuario, term: string, pipe: PipeTransform) {
  return usuario.US_USLOGIN.toLowerCase().includes(term.toLowerCase())
    || usuario.US_USNOMETRATAMENTO.toLowerCase().includes(term.toLowerCase())
    || usuario.OBJ_CLUBE.CL_CLNOME.toLowerCase().includes(term.toLowerCase())
    || usuario.OBJ_GRUPOUSUARIO.GU_GUDESCRICAO.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class UsuarioListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _usuarios$ = new BehaviorSubject<Usuario[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public USUARIOS : any[];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private usuarioServ : UsuarioService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._usuarios$.next(result.usuarios);
      this._total$.next(result.total);
    });

    this.usuarioServ.GetAllUsuarios().subscribe((es : any[]) => {
      this.USUARIOS = es});

    this._search$.next();
  
  }

  get usuarios$() { return this._usuarios$.asObservable(); }
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
 
    let usuarios = sort(this.USUARIOS, sortColumn, sortDirection);

    // 2. filter
    usuarios = usuarios.filter(usuario => matches(usuario, searchTerm, this.pipe));
    const total = usuarios.length;

    // 3. paginate
    usuarios = usuarios.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    search$ = of({usuarios, total})

    return of({usuarios, total});
    
  }
}