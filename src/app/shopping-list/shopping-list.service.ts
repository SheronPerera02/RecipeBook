import {Subject} from 'rxjs';
import Ingredient from '../shared/ingredient.model';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import {Injectable} from '@angular/core';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class ShoppingListService {
  newIngredientAdded = new Subject<Ingredient[]>();
  ingredientSelected = new Subject<number>();
  clear = new Subject();

  private ingredients: Ingredient[] = [];

  constructor(private store: Store<fromApp.AppState>) {
  }

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient): void {
    /*this.ingredients.push(ingredient);
    this.newIngredientAdded.next(this.ingredients.slice());*/
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
  }

  updateIngredient(ingredient: Ingredient): void {
    /*this.ingredients[index] = ingredient;
    this.newIngredientAdded.next(this.ingredients.slice());*/
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
  }

  deleteIngredient(): void {
    /*this.ingredients.splice(index, 1);
    this.newIngredientAdded.next(this.ingredients.slice());*/
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
  }

  addIngredients(ingredients: Ingredient[]): void {
    /*this.ingredients.push(...ingredients);
    this.newIngredientAdded.next(this.ingredients.slice());*/
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  onIngredientSelected(index: number): void {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  onClear(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }


}
