import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Recipe from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const initialRecipe = this.recipeService.getRecipes()[
      +this.route.snapshot.params.index
    ];
    this.recipe = initialRecipe;

    this.route.params.subscribe((params) => {
      this.recipe = this.recipeService.getRecipes()[+params.index];
    });

    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = recipes[this.route.snapshot.params.index];
    });
  }

  addToShoppingList(): void {
    this.recipeService.onAddIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe(): void {
    this.recipeService.deleteRecipe(+this.route.snapshot.params.index);
    this.router.navigate(['../0'], { relativeTo: this.route });
  }
}
