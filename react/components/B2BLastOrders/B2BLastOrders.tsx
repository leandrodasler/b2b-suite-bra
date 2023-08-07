import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { OverlayLayout, OverlayTrigger } from 'vtex.overlay-layout'
import { Button, Card, Spinner, Tag } from 'vtex.styleguide'

import { formatDate } from '../../utils/dates'
import {
  getOrderStatusTypeTag,
  useFormattedStatus,
  useLastOrders,
} from '../../utils/orders'
import calendarIcon from './calendar-icon.svg'
import './styles.css'
import userIcon from './user-icon.svg'

interface LastOrdersProps {
  limit: number
  orderDetailsPlacement: string
}

const CSS_HANDLES = [
  'container',
  'fistItemImage',
  'orderIdSection',
  'orderDataSection',
  'orderDataSectionValue',
  'orderDetails',
]

const DEFAULT_LIMIT = 6
const DEFAULT_PLACEMENT = 'right'

function B2BLastOrders({
  limit = DEFAULT_LIMIT,
  orderDetailsPlacement = DEFAULT_PLACEMENT,
}: LastOrdersProps) {
  const handles = useCssHandles(CSS_HANDLES)
  const formatStatus = useFormattedStatus()
  const { orders, isLoading, error } = useLastOrders(limit)

  if (error) {
    console.error('Error retrieving orders from organization: ', error)
    return null
  }

  return (
    <div className={`flex flex-wrap justify-center ${handles.container}`}>
      {isLoading ? (
        <Spinner />
      ) : orders?.length === 0 ? (
        <Card>
          <FormattedMessage id="store/last-orders.noOrder" />
        </Card>
      ) : (
        orders?.map?.(order => {
          const firstItemImageUrl = order.items[0]?.imageUrl
          const firstItemName = order.items[0]?.name ?? ''

          const orderCreationDate = formatDate(order.creationDate)

          const orderDetails = (
            <div className={`pa4 nowrap ${handles.orderDetails}`}>
              {order?.items?.map((item, index) => (
                <section
                  key={order.orderId}
                  className={`ma0 ${
                    index !== order.items.length - 1 ? 'mb3' : ''
                  }`}
                >
                  <span className="b">{item.quantity}</span> &#215; {item.name}
                </section>
              ))}
            </div>
          )

          const orderDetailsUrl = `/account#/orders-history/${order.orderId}`

          const orderAgainUrl = `/checkout/cart/add/?${order.items
            .map(
              item =>
                `sku=${item.id}&qty=${item.quantity}&seller=${item.seller}&sc=${order.salesChannel}&`
            )
            .join('')}`

          return (
            <Card key={order.orderId}>
              <article>
                {firstItemImageUrl && (
                  <img
                    className={handles.fistItemImage}
                    src={firstItemImageUrl}
                    alt={firstItemName}
                  />
                )}
                <section className={`mv4 ${handles.orderIdSection}`}>
                  <span className="dark-gray nowrap">
                    <FormattedMessage id="store/last-orders.orderNumber" />:
                  </span>
                  <br />
                  {order.orderId}
                </section>
                <section className="flex items-center mv4">
                  <img
                    className="mr3"
                    width={20}
                    height={20}
                    src={userIcon}
                    alt="User icon"
                  />
                  <section className="flex flex-wrap items-center ma0">
                    <span className="dark-gray mb1 w-100">
                      <FormattedMessage id="store/last-orders.orderMadeBy" />:
                    </span>
                    <span
                      className={`w-100 overflow-hidden nowrap ${handles.orderDataSectionValue}`}
                      title={order.clientName}
                    >
                      {order.clientName}
                    </span>
                  </section>
                </section>
                <section className="flex items-center mv4">
                  <img
                    className="mr3"
                    width={20}
                    height={20}
                    src={calendarIcon}
                    alt="Calendar icon"
                  />
                  <section className="flex flex-wrap items-center ma0">
                    <span className="dark-gray mb1 w-100">
                      <FormattedMessage id="store/last-orders.date" />:
                    </span>
                    <span
                      className={`w-100 overflow-hidden nowrap ${handles.orderDataSectionValue}`}
                      title={orderCreationDate}
                    >
                      {orderCreationDate}
                    </span>
                  </section>
                </section>
                <section className="flex justify-center ma0">
                  <Tag type={getOrderStatusTypeTag(order.status)}>
                    {formatStatus(order.status)}
                  </Tag>
                </section>
                <section className="flex justify-center ma2">
                  <OverlayTrigger trigger="hover">
                    <Button variation="tertiary" href={orderDetailsUrl}>
                      <FormattedMessage id="store/last-orders.moreDetails" />
                    </Button>
                    <OverlayLayout showArrow placement={orderDetailsPlacement}>
                      {orderDetails}
                    </OverlayLayout>
                  </OverlayTrigger>
                </section>
                <section className="flex justify-center ma0">
                  <Button
                    onClick={() => (window.location.href = orderAgainUrl)}
                  >
                    <FormattedMessage id="store/last-orders.orderAgain" />
                  </Button>
                </section>
              </article>
            </Card>
          )
        })
      )}
    </div>
  )
}

B2BLastOrders.schema = {
  title: 'B2B Last Orders',
  type: 'object',
  properties: {
    limit: {
      type: 'number',
      title: 'Maximum number of orders displayed by the component',
      default: DEFAULT_LIMIT,
    },
    orderDetailsPlacement: {
      type: 'string',
      title: 'Order details dropdown box placement',
      enum: ['right', 'left', 'top', 'bottom'],
      default: DEFAULT_PLACEMENT,
    },
  },
}

export default B2BLastOrders
