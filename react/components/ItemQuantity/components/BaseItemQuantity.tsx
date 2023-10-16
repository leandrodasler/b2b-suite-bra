import pathOr from 'ramda/src/pathOr'
import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Input } from 'vtex.styleguide'

import { Item } from '../../../typings'
import NumericStepper from '../../NumericStepper/NumericStepper'

const CSS_HANDLES = [
  'quantitySelectorContainer',
  'quantitySelectorTitle',
  'quantitySelectorStepper',
  'availableQuantityContainer',
] as const

const BaseItemQuantity: StorefrontFunctionComponent<Props> = ({
  warningQuantityThreshold = 0,
  selectedQuantity,
  selectedItem,
  productDispatch,
  skuDispatch,
  inputType,
  showLabel,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const onChange = useCallback(
    e => {
      const quantity = inputType == 'stepper' ? e.value : e.target.value
      productDispatch({ type: 'SET_QUANTITY', args: { quantity: quantity } })
      skuDispatch({ type: 'SET_QUANTITY', args: { quantity: quantity } })
    },
    [inputType, productDispatch, skuDispatch]
  )

  const availableQuantity = pathOr(
    0,
    ['sellers', 0, 'commertialOffer', 'AvailableQuantity'],
    selectedItem
  )

  const showAvailable = availableQuantity <= warningQuantityThreshold

  if (availableQuantity < 1) return null

  return (
    <div
      className={`${handles.quantitySelectorContainer} flex flex-column mb4`}
    >
      {showLabel && (
        <div
          className={`${handles.quantitySelectorTitle} mb3 t-body c-on-base fw7 pr3`}
        >
          <FormattedMessage id="store/product-quantity.quantity" />
        </div>
      )}
      <div className={handles.quantitySelectorStepper}>
        {inputType == 'number' ? (
          <Input
            type="number"
            value={selectedQuantity}
            min={0}
            max={availableQuantity ? availableQuantity : undefined}
            onChange={onChange}
          />
        ) : (
          <NumericStepper
            size="small"
            value={selectedQuantity}
            minValue={0}
            maxValue={availableQuantity ? availableQuantity : Infinity}
            onChange={onChange}
          />
        )}
      </div>
      {showAvailable && (
        <div
          className={`${handles.availableQuantityContainer} mv4 c-muted-2 t-small`}
        >
          <FormattedMessage
            id="store/product-quantity.quantity-available"
            values={{ availableQuantity }}
          />
        </div>
      )}
    </div>
  )
}

interface Props {
  warningQuantityThreshold: number
  selectedQuantity: number
  selectedItem: Item
  skuDispatch: any
  productDispatch: any
  inputType: 'stepper' | 'number'
  showLabel?: boolean
}

BaseItemQuantity.defaultProps = {
  warningQuantityThreshold: 0,
  inputType: 'stepper',
  showLabel: true,
}

export default BaseItemQuantity
