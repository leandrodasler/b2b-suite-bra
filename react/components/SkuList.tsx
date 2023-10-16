import { path, pathOr } from 'ramda'
import React, { FunctionComponent, useContext } from 'react'
import { useDevice } from 'vtex.device-detector'
import { ProductContext } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'

import { Item, Product } from '../typings'

enum Device {
  mobile = 'mobile',
  desktop = 'desktop',
}

const getSkuDisplaySequence = (item: Item) =>
  +(
    item.variations.find(variation => variation.name === 'skuDisplaySequence')
      ?.values?.[0] ?? 0
  )

const compareItemsSequence = (a: Item, b: Item) =>
  getSkuDisplaySequence(a) - getSkuDisplaySequence(b)

const SkuListComponent = React.memo(({ device }: { device: Device }) => {
  const valuesFromContext = useContext(ProductContext)
  const items: Item[] = pathOr([], ['product', 'items'], valuesFromContext)
  const product: Product | undefined = path(['product'], valuesFromContext)
  const sortedItems = [...items].sort(compareItemsSequence)

  const renderContent = (item: Item, index: number) => {
    switch (device) {
      case Device.mobile:
        return (
          <ExtensionPoint
            id="sku-content.mobile"
            isFirstItem={index === 0}
            item={item}
            product={product}
            key={`sku-content-${item.itemId}`}
          />
        )
      case Device.desktop:
      default:
        return (
          <ExtensionPoint
            id="sku-content.desktop"
            isFirstItem={index === 0}
            item={item}
            product={product}
            key={`sku-content-${item.itemId}`}
          />
        )
    }
  }

  return <div className="mw9 center pa3">{sortedItems.map(renderContent)}</div>
})

SkuListComponent.displayName = 'SkuListComponent'

const SkuList: FunctionComponent = () => {
  const { isMobile } = useDevice()

  return <SkuListComponent device={isMobile ? Device.mobile : Device.desktop} />
}

export default SkuList
