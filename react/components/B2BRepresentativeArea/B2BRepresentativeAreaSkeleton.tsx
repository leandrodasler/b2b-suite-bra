import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

import Skeleton from '../Skeleton/Skeleton'
import './styles.css'

const CSS_HANDLES = ['title', 'data']

const skeleton = <Skeleton display="inline-flex" width="100%" height={23} />

function B2BRepresentativeAreaSkeleton() {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <h4
        className={`t-heading-4 mt0 pb3 ph3 mb3 b--black-10 ${handles.title}`}
      >
        <FormattedMessage id="store/representative-area.loading" />
      </h4>
      <div className="flex flex-wrap items-center">
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-34-xl ${handles.data} `}
        >
          {skeleton}
        </div>
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-33-xl justify-center-xl ${handles.data} `}
        >
          {skeleton}
        </div>
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-33-xl justify-end-xl ${handles.data} `}
        >
          {skeleton}
        </div>
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-34-xl ${handles.data} `}
        >
          {skeleton}
        </div>
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-33-xl justify-center-xl ${handles.data} `}
        >
          {skeleton}
        </div>
        <div
          className={`flex flex-wrap self-center mv6 mv0-xl mb3-xl ph3 w-50 w-33-xl justify-end-xl ${handles.data} `}
        >
          {skeleton}
        </div>
      </div>
    </>
  )
}

export default B2BRepresentativeAreaSkeleton
