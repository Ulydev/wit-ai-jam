import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { StoreProvider } from "easy-peasy"
import store from "./state/store"

import "react-toastify/dist/ReactToastify.min.css"
import "./index.generated.css"

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
