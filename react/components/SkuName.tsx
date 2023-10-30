import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useSku } from './SkuContext'

const CSS_HANDLES = ['skuName'] as const

interface Props {
  showLabel: boolean
}

const SkuName = ({ showLabel }: Props) => {
  const { sku } = useSku()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div>
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          <FormattedMessage id="store/sku-list.sku.name.title" />:{' '}
        </span>
      )}
      <h4 className={`${handles.skuName} t-heading-4 c-muted-1`}>{sku.name}</h4>
    </div>
  )
}

export default SkuName
