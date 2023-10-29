import map from 'ramda/src/map'
import path from 'ramda/src/path'
import React, { useMemo } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import type { Image } from '../typings'
import generateImageConfig from '../utils/generateImageConfig'
import { useSku } from './SkuContext'

interface Props {
  images: Image[]
}

const CSS_HANDLES = ['skuImage']

const SkuImagesWrapper = (props: Props) => {
  const { sku } = useSku()

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
