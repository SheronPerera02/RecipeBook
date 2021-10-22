import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import Ingredient from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import Recipe from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  recipes: Recipe[] = [
    /*
    new Recipe(
      'Sample Recipe 1',
      'This is the sample recipe 1',
      'https://media.self.com/photos/5f1eef2914b005b8d8eba4d0/4:3/w_384/30-Minute-
      Roasted-Vegetable-Tacos-with-Chimichurri-BIG-flavor-sat
      isfying-HEALTHY-vegan-glutenfree-plantbased-tacos-chimichurri-cauliflower-minimalistbaker-recipe-6.jpg',
      [new Ingredient('Onions', 5), new Ingredient('Tomatoes', 10)]
    ),
    new Recipe(
      'Sample Recipe 2',
      'This is the sample recipe 2',
      'https://www.seriouseats.com/2019/07/20190618-grilled-turkish-chicken-wings-vicky-wasik-13-1500x1125.jpg',
      [new Ingredient('Chillies', 7), new Ingredient('Chicken Wings', 12)]
    ),
     */
  ];

  constructor(private shoppingListService: ShoppingListService) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.onRecipesChanged();
  }

  onAddIngredients(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(newRecipe: Recipe): void {
    this.recipes.push(newRecipe);
    this.onRecipesChanged();
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.onRecipesChanged();
  }

  onRecipesChanged(): void {
    if (this.recipes != null) {
      this.recipesChanged.next(this.recipes.slice());
    }
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.onRecipesChanged();
  }
}
