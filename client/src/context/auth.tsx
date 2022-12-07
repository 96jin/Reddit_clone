import { createContext } from 'react';
import { User } from '../types';

interface State{
  authenticated: boolean; // user의 인증유무
  user: User | undefined;
  loading: boolean;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true
})

const DispatchContext = createContext<any>(null)  // 유저의 정보를 업데이트하거나 인증유무를 업데이트

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}