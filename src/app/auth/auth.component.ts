import {Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponse, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {DataStorageService} from '../shared/data-storage.service';
import {ToastrService} from 'ngx-toastr';
import {AlertComponent} from '../shared/alert/alert.component';
import {HostContainerDirective} from '../shared/host-container.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoading = false;
  errorMessage: string = null;

  @ViewChild('authForm', {static: false}) form: NgForm;

  @ViewChild(HostContainerDirective, {static: false}) hostContainerRef: HostContainerDirective;

  observable: Observable<AuthResponse>;

  closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataStorageService: DataStorageService,
    private toastrService: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {

  }


  onSignUp(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.observable = this.authService.signUp(this.form.value.email, this.form.value.password);
    this.subscribe();

  }

  onLogin(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.observable = this.authService.login(this.form.value.email, this.form.value.password);
    this.subscribe();
  }

  subscribe(): void {
    this.observable.subscribe(
      (resp: AuthResponse) => {
        this.dataStorageService.fetchRecipes(false);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
        this.toastrService.success('Successful', 'Login');
      },
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
        this.showError(errorMessage);
        this.isLoading = false;
      }
    );
  }

  onClose(): void {
    this.errorMessage = null;
  }

  showError(message: string): void {
    const componentFactoryResolver = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const viewContainerRef = this.hostContainerRef.viewContainerRef;

    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactoryResolver);

    componentRef.instance.message = message;

    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      componentRef.destroy();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
