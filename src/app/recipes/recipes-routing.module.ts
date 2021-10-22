import {RecipesComponent} from './recipes.component';
import {AuthGuard} from '../auth/auth.guard';
import {EditRecipeComponent} from './edit-recipe/edit-recipe.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'new', component: EditRecipeComponent},
      {path: ':index', component: RecipeDetailComponent},
      {path: ':index/edit', component: EditRecipeComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}
