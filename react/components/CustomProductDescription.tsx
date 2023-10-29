import React from 'react'
import HtmlParser from 'react-html-parser'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import GradientCollapse from 'vtex.store-components/GradientCollapse'

type Props = {
  collapseHeight?: number
}

const CustomProductDescription = ({ collapseHeight = 220 }: Props) => {
  const productContext = useProduct()
  const description = productContext?.product?.description
  const handles = useCssHandles(['productDescriptionContainer'])

  return (
    !!description && (
      <article className={handles.productDescriptionContainer}>
        <GradientCollapse collapseHeight={collapseHeight}>
          {HtmlParser(description)}
        </GradientCollapse>
      </article>
    )
  )
}

export default CustomProductDescription
