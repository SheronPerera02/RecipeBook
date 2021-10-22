import * as ShoppingListActions from './shopping-list.actions';
import Ingredient from '../../shared/ingredient.model';

export interface State {
  ingredients: Ingredient[];
  editItemIndex: number;
  editingItem: Ingredient;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apple', 3),
    new Ingredient('Tomato', 10)
  ],
  editItemIndex: -1,
  editingItem: null
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListAction): any {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action.payload
        ]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          ...action.payload
        ]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const currIngredients = state.ingredients.slice();
      currIngredients[state.editItemIndex] = action.payload;
      return {
        ...state,
        ingredients: [
          ...currIngredients
        ]
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      const currentIngredients = state.ingredients.slice();
      currentIngredients.splice(state.editItemIndex, 1);
      return {
        ...state,
        ingredients: [
          ...currentIngredients
        ]
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editItemIndex: action.payload,
        editingItem: state.ingredients[action.payload]
      };
    case ShoppingListActions.STOP_EDIT:
      return{
        ...state,
        editItemIndex: -1,
        editingItem: null
      };
    default:
      return state;
  }
}
