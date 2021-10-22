import {NgModule} from '@angular/core';
import {ShoppingListComponent} from './shopping-list.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';

const routes: Routes = [
  {path: '', component: ShoppingListComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {
}
