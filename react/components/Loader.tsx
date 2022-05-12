import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = () => (
  <ContentLoader
    height={170}
    width={180}
    style={{
      width: '100%'
    }}>
    <rect width="180" height="180" />
  </ContentLoader>
)

export default Loader
