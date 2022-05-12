import React, { FC , useEffect, useState } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { useIntl, defineMessages } from 'react-intl'
import { Item } from './typings'
import { Button, ToastProvider, ToastConsumer } from 'vtex.styleguide'

const messages = defineMessages({
  label: {
    id: 'store/add-all-to-cart-button.label',
  },
  successMessage: {
    id: 'store/add-all-to-cart-button.successMessage',
  },
})

const AddAllToCartButton: FC = () => {
  const productContext = useProduct()
  // eslint-disable-next-line prettier/prettier
  const selectedItemsInitialState: Item[] = productContext.product.items?.map(
    (item: Item) => ({ ...item, quantity: 0 })
  )
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    selectedItemsInitialState
  )
  const [loading, setLoading] = useState<boolean>(false)

  const { formatMessage } = useIntl()

  useEffect(() => {
    setSelectedItems(selectedItemsInitialState);
    productContext.selectedQuantity = 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productContext.product.productId])

  useEffect(() => {
    setSelectedItems((selectedItems) => {
      const selectedItemIndex = selectedItems.findIndex(
        (item: Item) => item.itemId === productContext.selectedItem.itemId
      )
      const newSelectedItems = [...selectedItems]
      newSelectedItems[selectedItemIndex] = {
        ...productContext.selectedItem,
        quantity: productContext.selectedQuantity,
      }

      return newSelectedItems
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productContext.selectedItem.itemId, productContext.selectedQuantity])

  const haveAllItemsQuantityZero = () => selectedItems.every(item => item.quantity === 0)

  const handleAddAllToCart = (showToast: any) => {
    setLoading(true)

    const buttons = document.querySelectorAll(
      '.ssesandbox04-my-sku-list-0-x-skuContentWrapper .vtex-button'
    ) as NodeListOf<HTMLButtonElement>

    const timeInMs = 500

    for (let i = 0; i < buttons.length; i++) {
      setTimeout(() => {
        buttons[i].click()
      }, timeInMs * i)
    }

    setTimeout(() => {
      setLoading(false)
      showToast({
        message: formatMessage(messages.successMessage),
      })
    }, timeInMs * buttons.length)
  }

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: any) => (
          <Button
            disabled={haveAllItemsQuantityZero()}
            onClick={() => handleAddAllToCart(showToast)}
            variation="primary"
            isLoading={loading}>
            {formatMessage(messages.label)}
          </Button>
        )}
      </ToastConsumer>
    </ToastProvider>
  )
}

export default AddAllToCartButton
