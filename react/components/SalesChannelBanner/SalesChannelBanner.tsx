import React, { PropsWithChildren, useContext } from 'react'
import { useQuery } from 'react-apollo'
import { ImageList } from 'vtex.store-image'

import { B2BContext } from '../../context/B2BContext'
import GET_ORGANIZATION_SALES_CHANNEL from '../../graphql/getOrganizationSalesChannel.graphql'
import Skeleton from '../Skeleton/Skeleton'
import { IMAGE_LIST_SCHEMA } from './schema'

interface Link {
  url: string
  attributeNofollow: boolean
  attributeTitle?: string
  openNewTab?: boolean
  newTab?: boolean
}

export type ImagesSchema = Array<{
  image: string
  mobileImage: string
  link?: Link
  title?: string
  salesChannels?: string
  description: string
  experimentalPreventLayoutShift?: boolean
  width?: number | string
  analyticsProperties?: 'none' | 'provide'
  promotionId?: string
  promotionName?: string
  promotionPosition?: string
}>

export interface ImageListProps {
  images: ImagesSchema | null
  height?: number
  preload?: boolean
}

interface B2BOrganizationSalesChannelQuery {
  getOrganizationById: { salesChannel: string }
}

const SalesChannelBanner = ({
  images,
  height = 420,
  ...rest
}: PropsWithChildren<ImageListProps>) => {
  const {
    data: { organizationId },
  } = useContext(B2BContext)

  const { data: organizationSalesChannel } = useQuery<
    B2BOrganizationSalesChannelQuery
  >(GET_ORGANIZATION_SALES_CHANNEL, {
    variables: {
      organizationId,
    },
    skip: !organizationId,
  })

  const {
    getOrganizationById: { salesChannel },
  } = organizationSalesChannel || { getOrganizationById: { salesChannel: '' } }

  const filteredImages = salesChannel
    ? images
      ? images.filter(image => {
          const salesChannels =
            image.salesChannels && !/^\s*$/.test(image.salesChannels)
              ? image.salesChannels?.trim().split(/\s*,\s*/)
              : null

          if (!salesChannels) {
            return true
          }

          return salesChannels.includes(salesChannel)
        })
      : []
    : undefined

  if (!images?.length) {
    return null
  }

  if (!filteredImages) {
    return <Skeleton height={height} />
  }

  return <ImageList images={filteredImages} height={height} {...rest} />
}

SalesChannelBanner.schema = IMAGE_LIST_SCHEMA

export default SalesChannelBanner
