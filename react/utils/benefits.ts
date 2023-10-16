// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const distinctBenefits = (benefits?: any[]) => {
  // eslint-disable-next-line no-undef
  const uniqueMinQuantity = new Set()

  const uniqueBenefits = benefits?.map(b => {
    const minQuantity = b?.items?.[0]?.minQuantity ?? 1
    if (!uniqueMinQuantity.has(minQuantity)) {
      uniqueMinQuantity.add(minQuantity)
      return b
    }
    return {}
  })

  return uniqueBenefits?.filter(benefit => Object.keys(benefit).length > 0)
}
