import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { productListReducer, productReducer } from './Reducers/Product'

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const rootReducer = combineReducers({
  productListReducer,
  productReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer
})

export let persistor = persistStore(store)
