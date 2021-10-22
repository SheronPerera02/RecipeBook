import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpParams,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import {AuthService} from './auth.service';
import {exhaustMap, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, handler: HttpHandler)
    : Observable<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>> {
    return this.authService.loggedUser.pipe(take(1), exhaustMap((user) => {
      if (!user) {
        return handler.handle(req);
      }
      const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
      return handler.handle(modifiedReq);
    }));
  }
}
