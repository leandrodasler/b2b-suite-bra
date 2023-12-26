import React, { memo } from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { BarChart, Collapsible, LineChart } from 'vtex.styleguide'

import { getMonthFormatted } from '../../utils/dates'
import { getPercent, getPercentFormatted } from '../../utils/numberFormatter'

type Props = {
  lastValues?: Array<{
    month: number
    value: number
  }>
  productAmountMap?: Record<string, number>
  goal?: number
}

const limitString = (inputString: string): string => {
  const limit = 15

  if (inputString.length <= limit) {
    return inputString
  }

  return `${inputString.slice(0, limit)}...`
}

const Charts: StorefrontFunctionComponent<Props> = ({
  lastValues,
  productAmountMap = {},
  goal,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(['chartsContainer', 'chart', 'chartTitle'])
  const quantityLabel = intl.formatMessage({
    id: 'store/product-quantity.quantity',
  })

  const [openReachedValueTimeSeries, setOpenReachedValueTimeSeries] =
    React.useState(false)

  if (!lastValues?.length || !Object.keys(productAmountMap).length) {
    return null
  }

  const tooltipFormatter = (value: number) => {
    const formattedValue = (
      <>
        <FormattedCurrency value={value} /> (
        {getPercentFormatted(getPercent(value, goal ?? 1))})
      </>
    )

    return [
      formattedValue,
      intl.formatMessage({
        id: 'store/representative-area.reachedValue',
      }),
    ]
  }

  return (
    <div className="w-100">
      <Collapsible
        header={
          <span className="c-action-primary hover-c-action-primary fw5">
            {intl.formatMessage({
              id: 'store/representative-area.moreStats',
            })}
          </span>
        }
        isOpen={openReachedValueTimeSeries}
        onClick={() =>
          setOpenReachedValueTimeSeries(!openReachedValueTimeSeries)
        }
      >
        <div
          className={`flex flex-wrap justify-around mt3 ${handles.chartsContainer}`}
        >
          <div className={`flex flex-column items-center ${handles.chart}`}>
            <h3 className={`tc ${handles.chartTitle}`}>
              {intl.formatMessage(
                {
                  id: 'store/representative-area.reachedValueTimeSeries',
                },
                { months: lastValues.length }
              )}
            </h3>
            <LineChart
              data={lastValues.map(v => ({
                value: v.value / 100,
                month: getMonthFormatted(v.month),
              }))}
              dataKeys={['value']}
              xAxisKey="month"
              yAxisKey="value"
              config={{
                xAxis: { tickLine: true, axisLine: true },
                yAxis: { tickLine: true, axisLine: true },
                grid: { vertical: true, horizontal: true },
              }}
              lineProps={{ type: 'linear' }}
              tooltipFormatter={tooltipFormatter}
            />
          </div>
          <div className={`flex flex-column items-center ${handles.chart}`}>
            <h3 className={`tc ${handles.chartTitle}`}>
              {intl.formatMessage(
                {
                  id: 'store/representative-area.topSellingProducts',
                },
                { months: lastValues.length }
              )}
            </h3>
            <BarChart
              data={Object.keys(productAmountMap).map(key => ({
                product: limitString(key),
                [quantityLabel]: productAmountMap[key],
              }))}
              xAxisKey="product"
              yAxisKey={quantityLabel}
            />
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

export default memo(Charts)
