import React, { FC, useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { OrderForm } from 'vtex.order-manager'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import useProduct from 'vtex.product-context/useProduct'
import { useIntl, defineMessages } from 'react-intl'
import { Button, ToastProvider, ToastConsumer } from 'vtex.styleguide'
import { addToCart as ADD_TO_CART } from 'vtex.checkout-resources/Mutations'

import { Item, OrderFormArgs, OrderFormItemInput } from './typings'

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
  }, [productContext.product.productId])

  useEffect(() => {
    setSelectedItems(selectedItems => {
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

  // useEffect(() => {
  //   console.log('\nuseEffect[selectedItems]\n')
  //   selectedItems.forEach((item: Item) => {
  //     console.log(`${item.name} - ${item.quantity}`)
  //   })
  // }, [selectedItems])

  const haveAllItemsQuantityZero = () =>
    selectedItems.every(item => item.quantity === 0)

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
        {({ showToast }: any) => (
          <Button
            disabled={haveAllItemsQuantityZero()}
            onClick={() => handleAddAllToCart(showToast)}
            variation="primary"
            isLoading={loading}
          >
            {formatMessage(messages.label)}
          </Button>
        )}
      </ToastConsumer>
    </ToastProvider>
  )
}

export default AddAllToCartButton
