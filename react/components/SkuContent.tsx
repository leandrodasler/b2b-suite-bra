import classNames from 'classnames'
import React, { ReactNode, SyntheticEvent } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import type { Seller } from 'vtex.product-context/react/ProductTypes'
import useProduct from 'vtex.product-context/useProduct'
import { ExtensionPoint } from 'vtex.render-runtime'

import { Item, Product } from '../typings'
import { SkuProvider } from './SkuContext'

const CSS_HANDLES = ['skuContentWrapper', 'selectedSkuContentWrapper'] as const

interface Props {
  product: Product
  item: Item
  isFirstItem: boolean
  children?: ReactNode[]
}

const SkuContent = ({ item, isFirstItem, product, children }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { selectedItem }: { selectedItem: Item } = useProduct()
  const dispatch = useProductDispatch()
  const handleClick = (e: SyntheticEvent) => {
    const clickedElement = e.target as HTMLElement
    const isNumericStepperClicked = clickedElement.classList.value.includes(
      'vtex-numeric-stepper'
    )
    if (dispatch && isNumericStepperClicked) {
      dispatch({ type: 'SET_SELECTED_ITEM', args: { item: item } })
    }
  }
  const containerClasses = classNames(
    'ba mb3 pa5',
    handles.skuContentWrapper,
    {
      [`bw1 b--muted-1 ${handles.selectedSkuContentWrapper}`]:
        selectedItem.itemId != item.itemId,
    },
    {
      [`bw1 b--blue ${handles.selectedSkuContentWrapper}`]:
        selectedItem.itemId == item.itemId,
    }
  )
  return (
    <SkuProvider sku={item} isFirstItem={isFirstItem} product={product}>
      <div
        className={containerClasses}
        onClick={handleClick}
        role="button"
        tabIndex={parseInt(item.itemId)}
        onKeyDown={handleClick}
      >
        {children}
        {item.sellers.map((seller: Seller) => (
          <ExtensionPoint
            id="sku-seller"
            seller={seller}
            item={item}
            product={product}
            key={`seller-${seller.sellerId}`}
          />
        ))}
      </div>
    </SkuProvider>
  )
}

export default SkuContent
