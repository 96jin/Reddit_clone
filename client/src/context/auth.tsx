import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';
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

interface Action {
  type: string;
  payload?: any;
}

const reducer = (state: State, {type, payload}: Action) => {
  switch(type){
    case "LOGIN" :
      return {
        ...state,
        authenticated:  true,
        user: payload
      }
    case "LOGOUT" :
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case "STOP_LOADING" :
      return {
        ...state,
        loading: false
      }
    default :
      throw new Error(`Unknown action type: ${type}`)
  }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true
  })

  useEffect(()=>{
    async function loadUser(){
      try {
        const res = await axios.get('/auth/me')
        console.log(res.data)
        dispatch({type: "LOGIN", payload: res.data})
      } catch (error) {
        console.log(error)
      }finally{
        dispatch({type: "STOP_LOADING"})
      }
    }
    loadUser()
  },[])

  
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

// 함수 export 는 아래처럼 두가지 방법으로 할 수 있다.
// 다른 컴포넌트에서 쉽게 StateContext 의 value와 DispatchContext 의 value 를 사용할 수 있게 export 해준다.
// 여기서 export 하지 않아도 해당 컴포넌트에서 useContext 를 사용해서 value를 가져올 수
export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)
// export function useAuthDispatch(): any{
//   useContext(DispatchContext)
// }