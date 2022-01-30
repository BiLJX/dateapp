import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from "redux"
import * as bannerAction from "./action/banner"
import reducers from "./reducer"
import { Provider } from 'react-redux';
const w: any = window

const store = createStore(
  reducers,
  w.__REDUX_DEVTOOLS_EXTENSION__ && w.__REDUX_DEVTOOLS_EXTENSION__()
  );
ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store} >
      <App />
    </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
