import React, { useEffect } from 'react'
import { Spinner, Card, Button, Tag, Link } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { OverlayTrigger, OverlayLayout } from 'vtex.overlay-layout'

import { B2BContext } from './B2BContext'
import './B2BLastOrders.css'
import { getOrders, getOrderStatusTypeTag, formatDate } from './utils'
import type { LastOrdersProps, Order } from './utils'

// eslint-disable-next-line
const userIcon = require('./user-icon.svg') as string
// eslint-disable-next-line
const calendarIcon = require('./calendar-icon.svg') as string

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
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const { data, setData } = React.useContext(B2BContext)
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    setLoading(true)
    getOrders(limit).then((ordersWithDetails) => {
      setOrders(ordersWithDetails)
      setData((prevData: typeof data) => ({
        ...prevData,
        lastOrder: {
          description: prevData.lastOrder.description,
          value:
            (
              <Link
                href={`/account#/orders-history/${ordersWithDetails[0]?.orderId}`}
              >
                {ordersWithDetails[0]?.orderId}
              </Link>
            ) ?? 'N/A',
        },
      }))
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, setData])

  return (
    <div className={`flex flex-wrap justify-center ${handles.container}`}>
      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <Card>Nenhum pedido para exibir</Card>
      ) : (
        orders.map((order) => {
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
              (item) =>
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
                  <span className="dark-gray nowrap">Pedido nº:</span>
                  <br />
                  {order.orderId}
                </section>
                <section className="flex items-center mv4">
                  <img
                    className="mr3"
                    width={20}
                    height={20}
                    src={userIcon}
                    alt="Ícone de Usuário"
                  />
                  <section className="flex flex-wrap items-center ma0">
                    <span className="dark-gray mb1 w-100">Feito por:</span>
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
                    alt="Ícone de Calendário"
                  />
                  <section className="flex flex-wrap items-center ma0">
                    <span className="dark-gray mb1 w-100">Data:</span>
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
                    {order.statusDescription}
                  </Tag>
                </section>
                <section className="flex justify-center ma2">
                  <OverlayTrigger trigger="hover">
                    <Button variation="tertiary" href={orderDetailsUrl}>
                      Mais detalhes
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
                    Pedir novamente
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
      title: 'Quantidade máxima de pedidos exibidos pelo componente',
      default: DEFAULT_LIMIT,
    },
    orderDetailsPlacement: {
      type: 'string',
      title: 'Posicionamento da caixa suspensa de detalhes do pedido',
      enum: ['right', 'left', 'top', 'bottom'],
      default: DEFAULT_PLACEMENT,
    },
  },
}

export default B2BLastOrders
