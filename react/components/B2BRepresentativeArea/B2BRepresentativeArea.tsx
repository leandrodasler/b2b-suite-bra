import React, { useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { Link, Progress } from 'vtex.styleguide'

import { B2BContext } from '../../context/B2BContext'
import { getRemainingDaysInMonth } from '../../utils/dates'
import { getPercent, getPercentFormatted } from '../../utils/numberFormatter'
import { useMonthlyOrders } from '../../utils/orders'
import B2BRepresentativeAreaSkeleton from './B2BRepresentativeAreaSkeleton'
import './styles.css'

interface RepresentativeAreaProps {
  individualGoal: number
  reachedValue: number
  customersPortfolio: number
  customersOrdersMonth: number
}

const CSS_HANDLES = ['title', 'data', 'description', 'value']

const B2BRepresentativeArea: StorefrontFunctionComponent<RepresentativeAreaProps> = (
  props = {
    individualGoal: 0,
    reachedValue: 0,
    customersPortfolio: 0,
    customersOrdersMonth: 0,
  }
) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { user } = React.useContext(B2BContext)
  const organization = user?.organization
  const { monthlyOrders, isLoading: loadingMonthlyOrders } = useMonthlyOrders()

  const individualGoal = monthlyOrders?.goal
    ? monthlyOrders?.goal
    : organization === '47da0c2b-a4a5-11ec-835d-02bbf463c079'
    ? 40000
    : organization === 'df6965b9-a499-11ec-835d-0aa8762320bd'
    ? 35000
    : organization === '4b3635cf-b937-11ed-83ab-02032078fba7'
    ? 30000
    : organization === '0d3ea49a-c1e6-11ed-83ab-12e19e79322b'
    ? 25000
    : props.individualGoal

  const totalValue = (monthlyOrders?.totalValue ?? 0) / 100

  const percent = useMemo(() => getPercent(totalValue, individualGoal ?? 1), [
    individualGoal,
    totalValue,
  ])

  const percentFormatted = useMemo(() => getPercentFormatted(percent), [
    percent,
  ])

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
            {individualGoal ? (
              <FormattedCurrency value={individualGoal} />
            ) : (
              '---'
            )}
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
            {individualGoal !== 0 && ` (${percentFormatted})`}
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
      </div>
    </>
  )
}

B2BRepresentativeArea.schema = {
  title: 'B2B Representative Area',
  type: 'object',
  properties: {
    individualGoal: {
      type: 'number',
      title: 'Individual goal',
      default: 0,
    },
    reachedValue: {
      type: 'number',
      title: 'Reached value',
      default: 0,
    },
    customersPortfolio: {
      type: 'number',
      title: 'Number of customers in portfolio',
      default: 0,
    },
    customersOrdersMonth: {
      type: 'number',
      title: 'Number of customers that ordered this month',
      default: 0,
    },
  },
}

export default B2BRepresentativeArea
