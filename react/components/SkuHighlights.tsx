import React from 'react'
import { useSku } from './SkuContext'
import { useCssHandles } from 'vtex.css-handles'
import { Item, Variation } from '../typings'
import { toVariationArray, useVariations } from '../hooks/useVariations'
import { propOr } from 'ramda'
import HtmlParser from 'react-html-parser'

const CSS_HANDLES = [
  'highlightContent',
  'itemHighlight',
  'highlightTitle',
  'highlightValue',
]

interface Props {
  conditional: {
    typeSpecifications: string
    highlight: string
  }
  skuSelected: Item
  visibleVariations?: string[]
  showLabel: boolean
}

const SkuHighlights = (props: Props) => {

  const valuesFromContext = useSku()
  const { conditional, showLabel } = props
  const skuSelected =
    props.skuSelected != null
      ? props.skuSelected
      : valuesFromContext.sku
  const skuItems = [skuSelected]
  const shouldNotShow =
    skuItems.length === 0 ||
    !skuSelected?.variations ||
    skuSelected.variations.length === 0
  const variations = useVariations(skuItems, shouldNotShow, props.visibleVariations)

  const handles = useCssHandles(CSS_HANDLES)

  if (shouldNotShow || !skuSelected) {
    return null
  }

  const getHighlights = () => {
    const choose: string = propOr('', 'highlight', conditional)
    const allSpecifications: Variation[] = toVariationArray(variations)

    if (choose === 'admin/editor.sku-list.highlights.allSpecifications') {
      return allSpecifications
    }

    if (choose === 'admin/editor.sku-list.highlights.chooseDefaultSpecification') {
      const typeSpecifications: string = propOr('', 'typeSpecifications', conditional)
      const specificationNames: string[] = typeSpecifications.trim().split(',')

      return specificationNames.reduce((acc: Variation[], item: string) => {
        const highlight = allSpecifications.filter(
          x => x.name.toLowerCase() === item.trim().toLowerCase(),
        )
        return acc.concat(highlight)
      }, [])
    }
    return []
  }

  const highlights: Variation[] = getHighlights()

  return (
    <div className={`${handles.highlightContent} pt3 pb5`}>
      {highlights.length == 0 ? <div className={`${handles.itemHighlight} pv2`}>
        <span
          className={`${handles.highlightValue} t-body c-muted-1 lh-copy `}
        >
          {'N/A'}
          </span>
      </div> : highlights.map((item: Variation, i: number) => (
        <div
          className={`${handles.itemHighlight} pv2`}
          data-name={item.name}
          data-value={item.values[0]}
          key={i}
        >
          {showLabel && (<span
            className={`${handles.highlightTitle} t-body c-on-base fw7 pr3 `}
          >
            {HtmlParser(item.name)}
            {': '}
          </span>)}
          <span
            className={`${handles.highlightValue} t-body c-muted-1 lh-copy `}
          >
            {HtmlParser(item.values[0])}
          </span>
        </div>
      ))}
    </div>
  )
}

SkuHighlights.defaultProps = {
  showLabel: true,
}

SkuHighlights.schema = {
  title: 'admin/editor.sku-list.highlights.title',
  description: 'admin/editor.sku-list.highlights.description',
  type: 'object',
  definitions: {
    highlightGroupDefault: {
      title: 'highlightGroupDefault',
      type: 'object',
      properties: {
        highlight: {
          title: 'admin/editor.sku-list.highlights.default',
          type: 'string',
          enum: [
            'admin/editor.sku-list.highlights.allSpecifications',
            'admin/editor.sku-list.highlights.chooseDefaultSpecification',
          ],
          default: 'admin/editor.sku-list.highlights.allSpecifications',
        },
      },
      required: ['highlight'],
      dependencies: {
        highlight: {
          oneOf: [
            {
              properties: {
                highlight: {
                  enum: [
                    'admin/editor.sku-list.highlights.allSpecifications',
                  ],
                },
              },
            },
            {
              properties: {
                highlight: {
                  enum: [
                    'admin/editor.sku-list.highlights.chooseDefaultSpecification',
                  ],
                },
                typeSpecifications: {
                  type: 'string',
                  title:
                    'admin/editor.sku-list.highlights.typeSpecifications.title',
                },
              },
              required: [''],
            },
          ],
        },
      },
    },
  },
  properties: {
    showHighlight: {
      type: 'boolean',
      title: 'admin/editor.sku-list.highlights.showHighlight.title',
      default: false,
      isLayout: false,
    },
    showLabel: {
      type: 'boolean',
      title: 'admin/editor.sku-list.highlights.showLabel.title',
      default: true,
      isLayout: false,
    },
    conditional: {
      title: 'Conditional',
      $ref: '#/definitions/highlightGroupDefault',
    },
  },
}

export default SkuHighlights
