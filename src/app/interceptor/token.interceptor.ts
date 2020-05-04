import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http'
import { Observable } from 'rxjs';
import {MEAT_API, MEAT_APP} from '../app.api'
import { NgbPaginationNext } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

    intercept(request:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const requestUrl: Array<any> = request.url.split('/');
        const token = localStorage.getItem('token');
        const apiUrl = MEAT_API.split('/');

        if (token && (requestUrl[2] === apiUrl[2])){
            const newRequest =  request.clone({ setHeaders: {'Authorization' : `Bearer ${token}`}})
            return next.handle(newRequest);
        }else{
            return next.handle(request)  ;
        }
    }
        
    
}