import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css'],
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  inEditMode = false;

  form: FormGroup;

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params) => {
      this.inEditMode = params.index != null;
      this.onPathChange(+params.index);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddIngredient(): void {
    (this.form.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onRemove(index: number): void {
    (this.form.get('ingredients') as FormArray).removeAt(index);
  }

  onPathChange(index: number): void {
    let recipeName = '';
    let description = '';
    let imagePath = '';
    const ingredients = new FormArray([]);

    if (this.inEditMode) {
      const recipe = this.recipeService.getRecipes()[index];
      if (recipe) {
        recipeName = recipe.name;
        description = recipe.description;
        imagePath = recipe.imagePath;
        for (const ing of recipe.ingredients) {
          ingredients.push(
            new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(description, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      ingredients,
    });
  }

  onSubmit(): void {
    if (this.inEditMode) {
      this.recipeService.updateRecipe(
        +this.route.snapshot.params.index,
        this.form.value
      );
    } else {
      this.recipeService.addRecipe(this.form.value);
    }
    this.router.navigate(['']);
  }

  getIngredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  onCancel(): void {
    if (this.inEditMode) {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../0'], {relativeTo: this.route});
    }
  }
}
