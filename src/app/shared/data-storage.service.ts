import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RecipeService} from '../recipes/recipe.service';
import Recipe from '../recipes/recipe.model';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {Observable, throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
  }

  saveRecipes(): Observable<any> {
    return this.http.put('https://recipebook-6388f-default-rtdb.firebaseio.com/recipes.json', this.recipeService.getRecipes())
      .pipe(
        catchError((err) => {
          let errorMessage = 'Unknown error occurred';
          if (err.statusText && err.statusText === 'Unknown Error') {
            errorMessage = 'Check your internet connection';
          }
          return throwError(errorMessage);
        })
      );
  }

  fetchRecipes(triggeredFromHeader: boolean): Observable<any> {

    const observable = this.http.get<Recipe[]>('https://recipebook-6388f-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        catchError((err) => {
          let errorMessage = 'Unknown error occurred';
          if (err.statusText && err.statusText === 'Unknown Error') {
            errorMessage = 'Check your internet connection';
          }
          return throwError(errorMessage);
        }),
        map((recipes) => {
          return recipes.map((recipe) => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        })
      );

    if (triggeredFromHeader) {
      return observable;
    }

    observable.subscribe((result: Recipe[]) => {
      this.recipeService.setRecipes(result);
    }, (errorMessage) => {
      if (errorMessage === 'Check your internet connection') {
        this.toastrService.warning(errorMessage, 'Failed To Load Recipes');
      } else {
        this.toastrService.warning(errorMessage, 'Error');
      }
    });
  }
}
