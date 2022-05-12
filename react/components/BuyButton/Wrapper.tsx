import React, { FC } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart } from './modules/catalogItemToCart'
import { Item, Maybe, ProductContextState } from '../../typings'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  customOneClickBuyLink: string
  showToast: Function
  selectedItem: Maybe<Item>
  selectedQuantity: number
}

const Wrapper: FC<Props> = ({
  isOneClickBuy,
  available,
  disabled,
  customToastUrl,
  showToast,
  customOneClickBuyLink,
  selectedItem,
  selectedQuantity,
}) => {
  const productContext: Maybe<ProductContextState> = useProduct()

  if (!productContext) {
    throw new Error('useProduct must be used within a ProductContextProvider')
  }

  const isEmptyContext = Object.keys(productContext).length === 0

  const product = productContext && productContext.product
  // const selectedItem = productContext && productContext.selectedItem
  const assemblyOptions = productContext && productContext.assemblyOptions
  const selectedSeller =
    productContext &&
    productContext.selectedItem &&
    productContext.selectedItem.sellers[0]
  const quantity = selectedQuantity != null ? selectedQuantity : 0

  const skuItems = mapCatalogItemToCart({
    product,
    selectedItem,
    quantity,
    selectedSeller,
    assemblyOptions,
  })

  const isAvailable =
    isEmptyContext || available != null
      ? available
      : Boolean(
          selectedSeller &&
            selectedSeller.commertialOffer &&
            selectedSeller.commertialOffer.AvailableQuantity > 0
        )

  const groupsValidArray =
    (assemblyOptions &&
      assemblyOptions.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []

  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)
  const isDisabled =
    isEmptyContext || disabled != null ? disabled : !areAssemblyGroupsValid

  const areAllSkuVariationsSelected =
    productContext && productContext.skuSelector.areAllVariationsSelected

  return (
    <AddToCartButton
      allSkuVariationsSelected={areAllSkuVariationsSelected}
      skuItems={skuItems}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      disabled={isDisabled}
      customToastUrl={customToastUrl}
      showToast={showToast}
      customOneClickBuyLink={customOneClickBuyLink}
    />
  )
}

export default withToast(Wrapper)
