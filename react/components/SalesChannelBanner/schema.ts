import { defineMessages } from 'react-intl'

const IMAGE_LIST_MESSAGES = defineMessages({
  title: { id: 'admin/editor.sales-channel-banner.title' },
  description: {
    id: 'admin/editor.sales-channel-banner.description',
  },
  imagesImageTitle: {
    id: 'admin/editor.sales-channel-banner.images.image.title',
  },
  imagesMobileImageTitle: {
    id: 'admin/editor.sales-channel-banner.images.mobileImage.title',
  },
  imagesImageDescription: {
    id: 'admin/editor.sales-channel-banner.images.description.title',
  },
  imagesImageAttributeTitle: {
    id: 'admin/editor.sales-channel-banner.images.title.title',
  },
  imagesImageLinkUrl: {
    id: 'admin/editor.sales-channel-banner.images.link.url.title',
  },
  imagesImageLinkOpenNewTab: {
    id: 'admin/editor.sales-channel-banner.images.link.openNewTab.title',
  },
  imagesImageLinkNoFollow: {
    id: 'admin/editor.sales-channel-banner.images.link.noFollow.title',
  },
  imagesImageLinkTitle: {
    id: 'admin/editor.sales-channel-banner.images.link.title.title',
  },
  imagesTitle: {
    id: 'admin/editor.sales-channel-banner.images.title',
  },
  heightTitle: {
    id: 'admin/editor.sales-channel-banner.height.title',
  },
  heightMobileTitle: {
    id: 'admin/editor.sales-channel-banner.heightMobile.title',
  },
  autoplayTitle: {
    id: 'admin/editor.sales-channel-banner.autoplay.title',
  },
  autoplayDescription: {
    id: 'admin/editor.sales-channel-banner.autoplay.description',
  },
  widthTitle: {
    id: 'admin/editor.sales-channel-banner.images.width.title',
  },
  widthDescription: {
    id: 'admin/editor.sales-channel-banner.images.width.description',
  },
  analyticsTitle: {
    id: 'admin/editor.image.analytics.title',
  },
  analyticsNone: {
    id: 'admin/editor.image.analytics.none',
  },
  analyticsProvide: {
    id: 'admin/editor.image.analytics.provide',
  },
  analyticsPromotionId: {
    id: 'admin/editor.image.analytics.promotionId',
  },
  analyticsPromotionName: {
    id: 'admin/editor.image.analytics.promotionName',
  },
  analyticsPromotionPosition: {
    id: 'admin/editor.image.analytics.promotionPosition',
  },
})

export const IMAGE_LIST_SCHEMA = {
  title: IMAGE_LIST_MESSAGES.title.id,
  description: IMAGE_LIST_MESSAGES.description.id,
  type: 'object',
  properties: {
    height: {
      default: 420,
      isLayout: false,
      title: IMAGE_LIST_MESSAGES.heightTitle.id,
      type: 'number',
    },
    heightMobile: {
      isLayout: false,
      title: IMAGE_LIST_MESSAGES.heightMobileTitle.id,
      type: 'number',
    },
    autoplay: {
      isLayout: false,
      title: IMAGE_LIST_MESSAGES.autoplayTitle.id,
      description: IMAGE_LIST_MESSAGES.autoplayDescription.id,
      type: 'number',
    },
  },
}
