import React from 'react'
import { useProduct } from 'vtex.product-context'

import type { ConditionProps } from '../typings'

const HasVariationsCondition = ({ Then, Else }: ConditionProps) => {
  const productContext = useProduct()
  const itemsLength = productContext?.product?.items?.length ?? 0

  if (itemsLength > 1) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default HasVariationsCondition
