import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ShoppingListService} from './shopping-list.service';
import {Store} from '@ngrx/store';
import Ingredient from '../shared/ingredient.model';
import * as fromApp from '../store/app.reducer';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

    sub: Subscription;

    selectedIndex: number;

    ingredients: Ingredient[];

    constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.sub = this.store.select('shoppingList').subscribe((state) => {
            this.ingredients = state.ingredients;
            this.selectedIndex = state.editItemIndex;
        });

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onItemSelected(index: number): void {
        this.selectedIndex = index;
        this.shoppingListService.onIngredientSelected(index);
    }

}
