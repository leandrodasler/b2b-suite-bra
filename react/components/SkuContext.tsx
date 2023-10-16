import React, { createContext, useContext, useReducer } from 'react'

import { Item, Product } from '../typings'

const SkuContext = createContext<State | undefined>(undefined)
const SkuDispatchContext = createContext<Dispatch | undefined>(undefined)

interface State {
  product: Product
  sku: Item
  isFirstItem: boolean
  isHovering: boolean
  isLoading: boolean
  selectedQuantity: number
  buyButton: {
    clicked: boolean
  }
}

type Dispatch = (action: Action) => void

interface SetHoverAction {
  type: 'SET_HOVER'
  args: {
    isHovering: boolean
  }
}

interface SetLoadingAction {
  type: 'SET_LOADING'
  args: {
    isLoading: boolean
  }
}

interface SetProductQuantity {
  type: 'SET_QUANTITY'
  args: {
    quantity: number
  }
}

interface SetBuyButtonClicked {
  type: 'SET_BUY_BUTTON_CLICKED'
  args: { clicked: boolean }
}

type Action =
  | SetHoverAction
  | SetLoadingAction
  | SetProductQuantity
  | SetBuyButtonClicked

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_HOVER': {
      return {
        ...state,
        isHovering: action.args.isHovering,
      }
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.args.isLoading,
      }
    }
    case 'SET_QUANTITY': {
      return {
        ...state,
        selectedQuantity: action.args.quantity,
      }
    }
    case 'SET_BUY_BUTTON_CLICKED': {
      const args = action.args || {}
      return {
        ...state,
        buyButton: {
          ...state.buyButton,
          clicked: args.clicked,
        },
      }
    }
    default:
      return state
  }
}

interface Props {
  sku: Item
  isFirstItem: boolean
  product: Product
  children: any
}

export const SkuProvider = ({ sku, isFirstItem, product, children }: Props) => {
  const initialState = {
    product,
    sku,
    isFirstItem,
    isHovering: false,
    isLoading: false,
    selectedQuantity: 0,
    buyButton: {
      clicked: false,
    },
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SkuContext.Provider value={state}>
      <SkuDispatchContext.Provider value={dispatch}>
        {children}
      </SkuDispatchContext.Provider>
    </SkuContext.Provider>
  )
}

export function useSkuDispatch() {
  const context = useContext(SkuDispatchContext)

  if (context === undefined) {
    throw new Error('useSkuDispatch must be used within a SkuDispatchProvider')
  }

  return context
}

export function useSku() {
  const context = useContext(SkuContext)

  if (context === undefined) {
    throw new Error('useSku must be used within a SkuProvider')
  }

  return context
}
