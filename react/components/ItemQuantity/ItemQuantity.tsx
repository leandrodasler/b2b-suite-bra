import React from 'react'
import { useSkuDispatch } from '../SkuContext'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import BaseProductQuantity from './components/BaseItemQuantity'
import { Item } from '../../typings'

const ItemQuantity: StorefrontFunctionComponent<Props> = ({
  selectedItem,
  warningQuantityThreshold,
  selectedQuantity,
  inputType,
  showLabel,
}) => {
  const skuDispatch = useSkuDispatch()
  const productDispatch = useProductDispatch()
  return (
    <BaseProductQuantity
      warningQuantityThreshold={warningQuantityThreshold}
      selectedItem={selectedItem}
      selectedQuantity={selectedQuantity}
      skuDispatch={skuDispatch}
      productDispatch={productDispatch}
      inputType={inputType}
      showLabel={showLabel}
    />
  )
}

interface Props {
  warningQuantityThreshold: number
  selectedItem: Item
  selectedQuantity: number
  inputType: 'stepper' | 'number'
  showLabel: boolean
}

ItemQuantity.schema = {
  title: 'admin/editor.sku-list.item-quantity.title',
  description: 'admin/editor.sku-list.item-quantity.description',
  type: 'object',
  properties: {
    inputType: {
      type: 'string',
      title: 'admin/editor.sku-list.item-quantity.inputType.title',
      enum: ['stepper', 'number'],
      enumNames: [
        'admin/editor.sku-list.item-quantity.inputType.stepper',
        'admin/editor.sku-list.item-quantity.inputType.number',
      ],
      widget: {
        'ui:options': {
          inline: false,
        },
        'ui:widget': 'radio',
      },
      default: 'stepper',
      isLayout: false,
    },
    showLabel: {
      type: 'boolean',
      title: 'admin/editor.sku-list.item-quantity.showLabel.title',
      default: true,
      isLayout: false,
    },
  },
}

export default ItemQuantity
