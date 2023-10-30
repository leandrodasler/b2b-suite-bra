import React from 'react'

import { useSkuWithBenefits } from '../services'
import type { ConditionProps } from '../typings'

type Props = ConditionProps & { variation: string }

const SkuHasVariationCondition = ({ Then, Else, variation }: Props) => {
  const { itemVariations } = useSkuWithBenefits()
  const hasVariation = itemVariations.find(v => v.name === variation)

  if (hasVariation) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default SkuHasVariationCondition
