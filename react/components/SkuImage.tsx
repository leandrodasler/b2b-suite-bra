import React, { useMemo } from 'react'
import { useSku } from './SkuContext'
import { path, map } from 'ramda'

import generateImageConfig from '../utils/generateImageConfig'
import { Item, Image } from '../typings'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  images: Image[]
}

const CSS_HANDLES = ['skuImage']

const SkuImagesWrapper = (props: Props) => {
  const { sku }: { sku: Item } = useSku()

  const images: Image[] = useMemo(
    () =>
      props.images != null
        ? props.images
        : map(generateImageConfig, path(['images'], sku) || []),
    [props.images, sku]
  )

  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div className={handles.skuImage}>
      <img
        src={path([0, 'imageUrl'], images)}
        alt={path([0, 'imageText'], images)}
      />
    </div>
  )
}

export default SkuImagesWrapper
