import {User} from '../user.model';
import * as AuthActions from './auth.action';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(state: State = initialState, action: AuthActions.AuthAction): any {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default :
      return state;
  }
}
