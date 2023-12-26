import React, { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { FormattedCurrency } from 'vtex.format-currency'
import { Link, Progress } from 'vtex.styleguide'

import { B2BContext } from '../../context/B2BContext'
import { getRemainingDaysInMonth } from '../../utils/dates'
import { getPercent, getPercentFormatted } from '../../utils/numberFormatter'
import { useMonthlyOrders } from '../../utils/orders'
import B2BRepresentativeAreaSkeleton from './B2BRepresentativeAreaSkeleton'
import Charts from './Charts'
import './styles.css'

type Props = {
  reachedValueHistoryMonths?: number
  reachedValueHistoryMonthsMobile?: number
}

const DEFAULT_HISTORY_MONTHS = 6

const B2BRepresentativeArea: StorefrontFunctionComponent<Props> = ({
  reachedValueHistoryMonths = DEFAULT_HISTORY_MONTHS,
  reachedValueHistoryMonthsMobile = DEFAULT_HISTORY_MONTHS,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(['title', 'data', 'description', 'value'])

  const { isMobile } = useDevice()
  const { user } = React.useContext(B2BContext)
  const { monthlyOrders, isLoading: loadingMonthlyOrders } = useMonthlyOrders(
    isMobile ? reachedValueHistoryMonthsMobile : reachedValueHistoryMonths
  )

  const goal = monthlyOrders?.goal
  const totalValue = (monthlyOrders?.totalValue ?? 0) / 100
  const lastValues = monthlyOrders?.lastValues
  const productAmountMap = monthlyOrders?.productAmountMap

  const percent = useMemo(() => {
    return getPercent(totalValue, goal ?? 1)
  }, [goal, totalValue])

  const percentFormatted = useMemo(() => {
    return getPercentFormatted(percent)
  }, [percent])

  if (loadingMonthlyOrders) {
    return <B2BRepresentativeAreaSkeleton />
  }

  return (
    <>
      <h4 className={`t-heading-4 mt0 pb3 mb3 b--black-10 ${handles.title}`}>
        <FormattedMessage id="store/representative-area.title" />:{' '}
        <span className="b">
          {user?.firstName?.value} {user?.lastName?.value}
        </span>
      </h4>
      <div className="flex flex-wrap items-baseline">
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-34-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.individualGoal',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            {goal ? <FormattedCurrency value={goal} /> : '---'}
          </div>
        </div>
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-33-xl justify-center-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.customersPortfolio',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            {monthlyOrders?.allOrdersDistinctClientAmount ?? 0}
          </div>
        </div>
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-33-xl justify-end-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.remainingDaysInMonth',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            {getRemainingDaysInMonth()}
          </div>
        </div>
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-34-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.reachedValue',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            <FormattedCurrency value={totalValue} />
            {!!goal && ` (${percentFormatted})`}
            <Progress percent={percent} type="line" />
          </div>
        </div>
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-33-xl justify-center-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.customersOrdersMonth',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            {monthlyOrders?.monthlyOrdersDistinctClientAmount ?? 0}
          </div>
        </div>
        <div
          className={`flex flex-wrap self-center mb3 w-50 w-33-xl justify-end-xl ${handles.data}`}
        >
          <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
            {intl.formatMessage({
              id: 'store/representative-area.lastOrder',
            })}
            :
          </div>
          <div className={`w-100 w-auto-xl b ${handles.value}`}>
            {monthlyOrders?.lastOrderId ? (
              <Link
                href={`/account#/orders-history/${monthlyOrders?.lastOrderId}`}
              >
                {monthlyOrders?.lastOrderId}
              </Link>
            ) : (
              'N/A'
            )}
          </div>
        </div>
        <Charts
          lastValues={lastValues}
          productAmountMap={productAmountMap}
          goal={goal}
        />
      </div>
    </>
  )
}

B2BRepresentativeArea.schema = {
  title: 'B2B Representative Area',
  type: 'object',
  properties: {
    reachedValueHistoryMonths: {
      type: 'number',
      title: 'Number of months considered in the reached value chart',
      default: DEFAULT_HISTORY_MONTHS,
    },
    reachedValueHistoryMonthsMobile: {
      type: 'number',
      title: 'Number of months considered in the reached value chart on mobile',
      default: DEFAULT_HISTORY_MONTHS,
    },
  },
}

export default B2BRepresentativeArea
