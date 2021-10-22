import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../environments/environment';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  loggedUser = new BehaviorSubject<User>(null);

  tokenExpirationTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
      environment.firebaseAPIKey, {
      email,
      password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap((respData) => {
      this.handleAuthentication(respData);
    }));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
      + environment.firebaseAPIKey, {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap((respData) => {
      this.handleAuthentication(respData);
    }));
  }

  logout(): void {
    this.loggedUser.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    clearTimeout(this.tokenExpirationTimeout);
  }

  showLogoutToastr(): void {
    this.toastrService.success('Successful', 'Logout');
  }

  autoLogin(): boolean {
    const user = JSON.parse(localStorage.getItem('userData'));

    if (!user) {
      return false;
    }

    const loggedUser = new User(
      user.email,
      user.id,
      user.idToken,
      new Date(user.expirationDate)
    );

    if (loggedUser.token) {
      this.loggedUser.next(loggedUser);
      this.router.navigate(['/recipes']);
      this.setAutoLogout(new Date(user.expirationDate).getTime() - new Date().getTime());
      return true;
    }
    this.logout();
    return false;
  }

  setAutoLogout(tokenExpirationDuration: number): void {
    this.tokenExpirationTimeout = setTimeout(() => {
      this.logout();
      this.toastrService.warning('Successful', 'Security Logout');
    }, tokenExpirationDuration);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred!';
    if (err.statusText === 'Unknown Error') {
      return throwError(errorMessage);
    }
    if (err.error.error.message) {
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS' :
          errorMessage = 'This email already exists!';
          break;
        case 'USER_DISABLED' :
          errorMessage = 'Your account has been disabled!';
          break;
        case 'EMAIL_NOT_FOUND' :
          errorMessage = 'Invalid credentials!';
          break;
        case 'INVALID_PASSWORD' :
          errorMessage = 'Invalid credentials!';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily ' +
        'disabled due to many failed login attempts. You can immediately restore it by resetting ' +
        'your password or you can try again later.' :
          errorMessage = 'Try again later!';

      }
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(respData): void {

    const expirationDate = new Date(new Date().getTime() + (respData.expiresIn * 1000));

    const user = new User(
      respData.email,
      respData.localId,
      respData.idToken,
      expirationDate
    );

    this.loggedUser.next(user);
    this.setAutoLogout(respData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
