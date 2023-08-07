import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useContext,
} from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { ImageList } from 'vtex.store-image'

import { B2BContext } from '../../context/B2BContext'
import GET_SALES_CHANNEL from '../../graphql/getOrganizationSalesChannel.graphql'
import Skeleton from '../Skeleton/Skeleton'
import { IMAGE_LIST_SCHEMA } from './schema'

interface Link {
  url: string
  attributeNofollow: boolean
  attributeTitle?: string
  openNewTab?: boolean
  newTab?: boolean
}

interface SingleImage {
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

interface SalesChannelBannerProps {
  images: Array<SingleImage> | null
  height?: number
  heightMobile?: number
  autoplay?: number
}

interface SalesChannelQuery {
  getOrganizationById: { salesChannel: string }
}

const imageHasSalesChannelFactory = (salesChannel: string) => (
  image: SingleImage
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
  heightMobile,
  autoplay,
  children,
  ...rest
}: PropsWithChildren<SalesChannelBannerProps>) => {
  const { device } = useDevice()

  const { user, loadingUser } = useContext(B2BContext)

  const organizationId = user?.organization

  const {
    data: organizationSalesChannel,
    loading: loadingOrganizationSalesChannel,
  } = useQuery<SalesChannelQuery>(GET_SALES_CHANNEL, {
    variables: {
      organizationId,
    },
    skip: !organizationId,
  })

  if (!images?.length) {
    return null
  }

  const salesChannel =
    organizationSalesChannel?.getOrganizationById?.salesChannel

  const responsiveHeight =
    device === 'phone' && !!heightMobile ? heightMobile : height

  if (loadingUser || loadingOrganizationSalesChannel) {
    return <Skeleton height={responsiveHeight} />
  }

  const filteredImages = images.filter(
    imageHasSalesChannelFactory(salesChannel ?? '')
  )

  const slider =
    !!autoplay && (filteredImages?.length ?? 0) > 1
      ? Children.map(children as ReactElement, child =>
          cloneElement(child, {
            autoplay: { timeout: autoplay, stopOnHover: true },
          })
        )
      : children

  return (
    !!filteredImages?.length && (
      <ImageList images={filteredImages} height={responsiveHeight} {...rest}>
        {slider}
      </ImageList>
    )
  )
}

SalesChannelBanner.schema = IMAGE_LIST_SCHEMA

export default SalesChannelBanner
