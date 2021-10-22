import {Component, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import Ingredient from 'src/app/shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) form: NgForm;
  editModeIsOn = false;
  selectedIngredientIndex: number;
  subscription: Subscription;

  constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {

    this.subscription = this.store.select('shoppingList').subscribe((state) => {

      if (state.editItemIndex > -1) {
        const index = state.editItemIndex;
        this.editModeIsOn = true;
        this.selectedIngredientIndex = index;

        this.form.form.patchValue({
          name: state.editingItem.name,
          amount: state.editingItem.amount,
        });
      } else {
        this.selectedIngredientIndex = -1;
      }

    });

  }

  addIngredient(): void {
    if (this.editModeIsOn) {
      this.shoppingListService.updateIngredient(new Ingredient(this.form.value.name, this.form.value.amount));
    } else {
      this.shoppingListService.addIngredient(
        new Ingredient(this.form.value.name, this.form.value.amount)
      );
    }
    this.onClear();
  }

  onClear(): void {
    this.form.reset();
    this.editModeIsOn = false;
    this.shoppingListService.onClear();
  }

  onDelete(): void {
    this.shoppingListService.deleteIngredient();
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.onClear();
  }
}
