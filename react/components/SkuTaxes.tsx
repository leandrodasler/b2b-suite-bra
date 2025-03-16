import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'
import { useProduct } from 'vtex.product-context'

import { useTaxes, withQueryProvider } from '../services'
import type { Item } from '../typings'

type Props = {
  prefix: string
}

function SkuTaxes({ prefix }: Props) {
  const { data: allTaxes } = useTaxes()
  const productContext = useProduct()
  const item = productContext?.selectedItem as Item
  const tax = item.sellers.find(seller => seller.sellerDefault)?.commertialOffer
    ?.Tax

  if (!tax) return null

  return (
    <div className="c-muted-1 t-mini">
      {prefix}
      <FormattedCurrency value={tax} />
      {allTaxes?.length && <> ({allTaxes.map(t => t.name).join(', ')})</>}
    </div>
  )
}

SkuTaxes.schema = {
  title: 'SKU Taxes',
  type: 'object',
  properties: {
    prefix: {
      type: 'string',
      title: 'Taxes prefix',
    },
  },
}

export default withQueryProvider(SkuTaxes)
