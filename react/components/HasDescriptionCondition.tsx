import React from 'react'
import { useProduct } from 'vtex.product-context'

import type { ConditionProps } from '../typings'

const HasDescriptionCondition = ({ Then, Else }: ConditionProps) => {
  const productContext = useProduct()
  const hasDescription = !!productContext?.product?.description

  if (hasDescription) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default HasDescriptionCondition
