import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useContext,
} from 'react'
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

interface Image {
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
}

type ImagesSchema = Array<Image>

interface ImageListProps {
  images: ImagesSchema | null
  height?: number
  preload?: boolean
}

interface B2BOrganizationSalesChannelQuery {
  getOrganizationById: { salesChannel: string }
}

const imageHasSalesChannelFactory = (salesChannel: string) => (
  image: Image
) => {
  const imageSalesChannels =
    image.salesChannels && !/^\s*$/.test(image.salesChannels)
      ? image.salesChannels?.trim().split(/\s*,\s*/)
      : null

  if (!imageSalesChannels) {
    return true
  }

  return imageSalesChannels.includes(salesChannel)
}

const SalesChannelBanner = ({
  images,
  height = 420,
  children,
  ...rest
}: PropsWithChildren<ImageListProps>) => {
  const {
    data: { user, loadingUser },
  } = useContext(B2BContext)

  const organizationId = user?.organization

  const { data: organizationSalesChannel } = useQuery<
    B2BOrganizationSalesChannelQuery
  >(GET_ORGANIZATION_SALES_CHANNEL, {
    variables: {
      organizationId,
    },
    skip: !organizationId,
  })

  if (!images?.length) {
    return null
  }

  const {
    getOrganizationById: { salesChannel },
  } = organizationSalesChannel || { getOrganizationById: { salesChannel: '' } }

  const filteredImages =
    loadingUser && !salesChannel
      ? undefined
      : images.filter(imageHasSalesChannelFactory(salesChannel))

  if (!filteredImages) {
    return <Skeleton height={height} />
  }

  const slider =
    filteredImages.length > 1
      ? Children.map(children as ReactElement, child =>
          cloneElement(child, {
            autoplay: { timeout: 8000, stopOnHover: true },
          })
        )
      : children

  return (
    <ImageList images={filteredImages} height={height} {...rest}>
      {slider}
    </ImageList>
  )
}

SalesChannelBanner.schema = IMAGE_LIST_SCHEMA

export default SalesChannelBanner
