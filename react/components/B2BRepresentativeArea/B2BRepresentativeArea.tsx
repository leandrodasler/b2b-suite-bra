import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { Progress } from 'vtex.styleguide'

import {
  B2BContext,
  B2BContextProps,
  RepresentativeAreaContextProps,
} from '../../context/B2BContext'
import {
  RepresentativeAreaProps,
  getGoal,
  getMonthlyOrders,
  getPercentReachedValue,
  getPercentReachedValueFormatted,
} from '../../utils'
import B2BRepresentativeAreaSkeleton from './B2BRepresentativeAreaSkeleton'
import './styles.css'

const CSS_HANDLES = ['title', 'data', 'description', 'value']

function B2BRepresentativeArea(
  props: RepresentativeAreaProps = {
    individualGoal: 0,
    reachedValue: 0,
    customersPortfolio: 0,
    customersOrdersMonth: 0,
  }
) {
  const [loading, setLoading] = useState(true)
  const { data, setData } = React.useContext(B2BContext)
  const handles = useCssHandles(CSS_HANDLES)
  const [goal, setGoal] = useState(0)
  const [monthlyOrders, setMonthlyOrders] = useState<{
    totalValue: number
    monthlyOrdersDistinctClientAmount: number
    allOrdersDistinctClientAmount: number
  }>({
    totalValue: 0,
    monthlyOrdersDistinctClientAmount: 0,
    allOrdersDistinctClientAmount: 0,
  })

  const { representativeArea, user } = data || {}

  useEffect(() => {
    if (user?.organization) {
      // setLoading(true)

      getGoal(user.organization).then(goal => {
        setGoal(goal)
        getMonthlyOrders().then(orders => {
          setMonthlyOrders(orders)
          setLoading(false)
        })
      })
    }
  }, [user])

  useEffect(() => {
    setData?.((prevData: B2BContextProps) => ({
      ...prevData,
      representativeArea: {
        ...prevData.representativeArea,
        individualGoal: {
          ...prevData.representativeArea.individualGoal,
          value: goal
            ? goal
            : user?.organization === '47da0c2b-a4a5-11ec-835d-02bbf463c079'
            ? 40000
            : user?.organization === 'df6965b9-a499-11ec-835d-0aa8762320bd'
            ? 35000
            : user?.organization === '4b3635cf-b937-11ed-83ab-02032078fba7'
            ? 30000
            : user?.organization === '0d3ea49a-c1e6-11ed-83ab-12e19e79322b'
            ? 25000
            : props.individualGoal,
        },
        reachedValue: {
          ...prevData.representativeArea.reachedValue,
          value: monthlyOrders?.totalValue / 100,
        },
        customersPortfolio: {
          ...prevData.representativeArea.customersPortfolio,
          value: monthlyOrders?.allOrdersDistinctClientAmount,
        },
        customersOrdersMonth: {
          ...prevData.representativeArea.customersOrdersMonth,
          value: monthlyOrders?.monthlyOrdersDistinctClientAmount,
        },
      },
    }))
  }, [props, setData, monthlyOrders, user, goal])

  const percent = useCallback(getPercentReachedValue, [representativeArea])
  const percentFormatted = useCallback(getPercentReachedValueFormatted, [
    representativeArea,
  ])

  if (loading) return <B2BRepresentativeAreaSkeleton />

  return (
    <>
      <h4 className={`t-heading-4 mt0 pb3 mb3 b--black-10 ${handles.title}`}>
        <FormattedMessage id="store/representative-area.title" />:{' '}
        <span className="b">
          {`${user?.firstName?.value} ${user?.lastName?.value}`}
        </span>
      </h4>
      <div className="flex flex-wrap items-baseline">
        {!!representativeArea &&
          Object.keys(representativeArea).map((key, index) => (
            <div
              className={`
              flex flex-wrap self-center mb3 w-50 w-33-xl
              ${handles.data}
              ${[0, 3].includes(index) ? 'w-34-xl' : ''}
              ${[1, 4].includes(index) ? 'justify-center-xl' : ''}
              ${[2, 5].includes(index) ? 'justify-end-xl' : ''}
              ${[2, 5].includes(index) ? 'justify-end-xl' : ''}
            `}
              key={key}
            >
              <div className={`w-100 w-auto-xl mr2 ${handles.description}`}>
                {
                  representativeArea[
                    key as keyof RepresentativeAreaContextProps
                  ].description
                }
                :{' '}
              </div>
              <div className={`w-100 w-auto-xl b ${handles.value}`}>
                {['individualGoal', 'reachedValue'].includes(key) && (
                  <FormattedCurrency
                    value={
                      +representativeArea[
                        key as keyof RepresentativeAreaContextProps
                      ].value ?? '---'
                    }
                  />
                )}

                {key === 'reachedValue' && (
                  <>
                    {representativeArea.individualGoal.value !== 0 &&
                      ` (${percentFormatted(representativeArea)})`}
                    <Progress
                      percent={percent(representativeArea)}
                      type="line"
                    />
                  </>
                )}

                {!['individualGoal', 'reachedValue'].includes(key) &&
                  (representativeArea[
                    key as keyof RepresentativeAreaContextProps
                  ].value ??
                    '---')}
              </div>
            </div>
          ))}
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
