import { Item, Variation, Variations } from '../typings'
import { useMemo } from 'react'

export const useVariations = (
  skuItems: Item[],
  shouldNotShow: boolean,
  visibleVariations?: string[]
) => {
  const result = useMemo(() => {
    if (
      shouldNotShow ||
      (visibleVariations && visibleVariations.length === 0)
    ) {
      return {}
    }
    const variations: Variations = {}
    const variationsSet: Record<string, Set<string>> = {}
    if (visibleVariations) {
      visibleVariations = visibleVariations.map(variation => variation.toLowerCase().trim())
    }

    for (const skuItem of skuItems) {
      for (const currentVariation of skuItem.variations) {
        const { name, values } = currentVariation
        if (!visibleVariations || visibleVariations.includes(name.toLowerCase().trim())) {

          const value = values[0]
          const currentSet = variationsSet[name] || new Set()
          currentSet.add(value)
          variationsSet[name] = currentSet
        }
      }
    }
    const variationsNames = Object.keys(variationsSet)
    // Transform set back to array
    for (const variationName of variationsNames) {
      const set = variationsSet[variationName]
      variations[variationName] = Array.from(set)
    }
    return variations
  }, [skuItems, shouldNotShow])
  return result
}

export const toVariationArray = (variations: Variations) => {
  let result: Variation[] = []
  const variationNames = Object.keys(variations)
  for (const variationName of variationNames) {
    result = [
      ...result,
      { name: variationName, values: variations[variationName] },
    ]
  }
  return result
}
