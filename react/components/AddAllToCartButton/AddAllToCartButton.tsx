/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'
import { addToCart as ADD_TO_CART } from 'vtex.checkout-resources/Mutations'
import { useCssHandles } from 'vtex.css-handles'
import { OrderForm } from 'vtex.order-manager'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import useProduct from 'vtex.product-context/useProduct'
import { Button, ToastConsumer, ToastProvider } from 'vtex.styleguide'

import type { Item, OrderFormArgs, OrderFormItemInput } from '../../typings'

const messages = defineMessages({
  label: {
    id: 'store/add-all-to-cart-button.label',
  },
  successMessage: {
    id: 'store/add-all-to-cart-button.successMessage',
  },
})

const AddAllToCartButton: FC = () => {
  const handles = useCssHandles(['addToCartButtonContainer'])
  const productContext = useProduct()

  // eslint-disable-next-line prettier/prettier
  const selectedItemsInitialState: Item[] = productContext.product.items?.map(
    (item: Item) => ({ ...item, quantity: 0 })
  )

  const [selectedItems, setSelectedItems] = useState<Item[]>(
    selectedItemsInitialState
  )

  const [addToCart, { error, loading }] = useMutation<
    { addToCart: OrderFormArgs },
    { items: OrderFormItemInput[] }
  >(ADD_TO_CART)

  const { setOrderForm } = OrderForm.useOrderForm()

  const { push } = usePixel()

  const { formatMessage } = useIntl()

  useEffect(() => {
    setSelectedItems(selectedItemsInitialState)
    productContext.selectedQuantity = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productContext.product.productId])

  useEffect(() => {
    setSelectedItems(currentSelectedItems => {
      const selectedItemIndex = currentSelectedItems.findIndex(
        (item: Item) => item.itemId === productContext.selectedItem.itemId
      )

      const newSelectedItems = [...currentSelectedItems]

      newSelectedItems[selectedItemIndex] = {
        ...productContext.selectedItem,
        quantity: productContext.selectedQuantity,
      }

      return newSelectedItems
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productContext.selectedItem.itemId, productContext.selectedQuantity])

  // useEffect(() => {
  //   console.log('\nuseEffect[selectedItems]\n')
  //   selectedItems.forEach((item: Item) => {
  //     console.log(`${item.name} - ${item.quantity}`)
  //   })
  // }, [selectedItems])

  const haveAllItemsQuantityZero = () =>
    selectedItems.every(item => item.quantity === 0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddAllToCart = async (showToast: any) => {
    const mutationResult = await addToCart({
      variables: {
        items: selectedItems
          .filter(item => item.quantity > 0)
          .map(item => ({
            id: +item.itemId,
            quantity: +item.quantity,
            seller: item.sellers[0].sellerId.toString(),
          })),
      },
    })

    if (error) {
      showToast({ message: 'Erro ao adicionar os itens ao carrinho' })

      return
    }

    if (mutationResult.data) {
      setOrderForm(mutationResult.data.addToCart)
      push({
        event: 'addToCart',
        items: selectedItems
          // .filter(item => item.quantity > 0)
          .map(item => ({
            skuId: +item.itemId,
            quantity: +item.quantity,
          })),
      })
      showToast({ message: formatMessage(messages.successMessage) })
    }
  }

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {({ showToast }: any) => (
          <div
            className={`flex justify-end ${handles.addToCartButtonContainer}`}
          >
            <Button
              disabled={haveAllItemsQuantityZero()}
              onClick={() => handleAddAllToCart(showToast)}
              variation="primary"
              isLoading={loading}
            >
              {formatMessage(messages.label)}
            </Button>
          </div>
        )}
      </ToastConsumer>
    </ToastProvider>
  )
}

export default AddAllToCartButton
