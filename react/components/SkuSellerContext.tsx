import React, { ReactNode, useReducer } from 'react'
import { createContext, useContext } from 'react'
import { Seller, Item, Product } from '../typings'

const SkuSellerContext = createContext<State | undefined>(undefined)
const SkuSellerDispatchContext = createContext<Dispatch | undefined>(undefined)

interface State {
  seller: Seller
  item: Item
  product: Product
  isHovering: boolean
  isLoading: boolean
  selectedQuantity: number
}

type Dispatch = (action: Action) => void

// type SetProductAction = {
//   type: 'SET_PRODUCT',
//   args: {
//     product: any
//   }
// }

// type SetProductQueryAction = {
//   type: 'SET_PRODUCT_QUERY',
//   args: {
//     query: string
//   }
// }

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

type Action = SetHoverAction | SetLoadingAction | SetProductQuantity

export function reducer(state: State, action: Action) {
  switch (action.type) {
    // case 'SET_PRODUCT': {
    //   const product = action.args.product
    //   return {
    //     ...state,
    //     product: product,
    //     //TODO: STOP USING PRODUCT.SKU https://app.clubhouse.io/vtex/story/18547/productsummarycontext-refactor
    //     selectedItem: product.sku
    //   }
    // }
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
    // case 'SET_PRODUCT_QUERY':
    //   return {
    //     ...state,
    //     query: action.args.query,
    //   }
    default:
      return state
  }
}

interface Props {
  seller: Seller
  item: Item
  product: Product
  children?: ReactNode[]
}

export const SkuSellerProvider = ({
  seller,
  item,
  product,
  children,
}: Props) => {
  const initialState = {
    seller,
    item,
    product,
    isHovering: false,
    isLoading: false,
    selectedQuantity: 0,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SkuSellerContext.Provider value={state}>
      <SkuSellerDispatchContext.Provider value={dispatch}>
        {children}
      </SkuSellerDispatchContext.Provider>
    </SkuSellerContext.Provider>
  )
}

export function useSkuSellerDispatch() {
  const context = useContext(SkuSellerDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSkuSellerDispatch must be used within a SkuSellerDispatchProvider'
    )
  }

  return context
}

export function useSkuSeller() {
  const context = useContext(SkuSellerContext)

  if (context === undefined) {
    throw new Error('useSkuSeller must be used within a SkuSellerProvider')
  }

  return context
}
