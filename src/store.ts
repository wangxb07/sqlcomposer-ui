import {init, RematchDispatch, RematchRootState} from "@rematch/core";
import {models, RootModel} from "./models";
import {connectRouter, routerMiddleware} from 'connected-react-router'
import {createBrowserHistory} from "history";

export const history = createBrowserHistory();

export const store = init({
  models,
  redux: {
    reducers: {
      router: connectRouter(history),
    },
    middlewares: [
      routerMiddleware(history),
    ]
  }
});

// export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type iRootState = RematchRootState<RootModel>
