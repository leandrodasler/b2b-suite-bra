import { path, pathOr } from 'ramda'
import React, { FunctionComponent, useContext, useEffect } from 'react'
import { ProductContext } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'

import { Item, Product } from '../typings'

enum Device {
  mobile = 'mobile',
  desktop = 'desktop',
}

const SkuListComponent = React.memo(({ device }: { device: Device }) => {
  const valuesFromContext = useContext(ProductContext)
  const items: Item[] = pathOr([], ['product', 'items'], valuesFromContext)
  const product: Product | undefined = path(['product'], valuesFromContext)

  const renderContent = (item: Item) => {
    switch (device) {
      case Device.mobile:
        return (
          <ExtensionPoint
            id="sku-content.mobile"
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
            item={item}
            product={product}
            key={`sku-content-${item.itemId}`}
          />
        )
    }
  }

  return (
    <div className="mw9 center pa3">
      {items.map((item: Item) => renderContent(item))}
    </div>
  )
})

SkuListComponent.displayName = 'SkuListComponent'

const SkuList: FunctionComponent = () => {
  const { isMobile } = useDevice()

  useEffect(() => {
    document
      .querySelectorAll(
        '.vtex-numeric-stepper__plus-button, .vtex-numeric-stepper__minus-button'
      )
      .forEach(element => {
        element.setAttribute('tabindex', '-1')
      })
  }, [])

  return <SkuListComponent device={isMobile ? Device.mobile : Device.desktop} />
}

export default SkuList
