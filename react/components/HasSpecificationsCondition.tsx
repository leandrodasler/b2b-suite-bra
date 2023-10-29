import React from 'react'
import { useProduct } from 'vtex.product-context'

import type { ConditionProps } from '../typings'

const HasSpecificationsCondition = ({ Then, Else }: ConditionProps) => {
  const productContext = useProduct()
  const hasSpecifications = productContext?.product?.specificationGroups?.length

  if (hasSpecifications) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default HasSpecificationsCondition
