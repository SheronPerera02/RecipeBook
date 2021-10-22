import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {ToastrService} from 'ngx-toastr';
import {RecipeService} from '../recipes/recipe.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  userSub: Subscription;

  isAuthenticated = false;

  confirming = false;

  constructor(
    private dataStorageService: DataStorageService,
    private toastr: ToastrService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData(): void {
    this.dataStorageService.saveRecipes().subscribe((result) => {
      this.toastr.success('Saved!', 'Recipes');
    }, (errorMessage) => {
      if (errorMessage === 'Check your internet connection') {
        this.toastr.warning(errorMessage, 'Failed To Save Recipes');
      } else {
        this.toastr.warning(errorMessage, 'Error');
      }
    });
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipes(true).subscribe((result) => {
      this.recipeService.setRecipes(result);
      this.toastr.info('Fetched!', 'Recipes');
    }, (errorMessage) => {
      if (errorMessage === 'Check your internet connection') {
        this.toastr.warning(errorMessage, 'Failed To Load Recipes');
      } else {
        this.toastr.warning(errorMessage, 'Error');
      }
    });
  }

  onLogout(): void {
    this.confirming = true;
  }

  onLogoutConfirmed(): void {
    this.confirming = false;
    this.authService.logout();
    this.authService.showLogoutToastr();
  }

  onLogoutCancel(): void {
    this.confirming = false;
  }
}
