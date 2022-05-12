import React, { useEffect } from 'react'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'

import { B2BContext } from './B2BContext'
import './B2BRepresentativeArea.css'
import { getUser } from './utils'
import { User, RepresentativeAreaProps } from './utils'

const CSS_HANDLES = ['title', 'data', 'description', 'value']

function B2BRepresentativeArea(
  props: RepresentativeAreaProps = {
    individualGoal: 0,
    reachedValue: 0,
    customersPortfolio: 0,
    customersOrdersMonth: 0,
  }
) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { data, setData } = React.useContext(B2BContext)
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    setLoading(true)
    getUser().then((recoveredUser) => {
      setUser(recoveredUser)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setData((prevData: typeof data) => ({
      ...prevData,
      individualGoal: {
        description: prevData.individualGoal.description,
        value: props.individualGoal,
      },
      reachedValue: {
        description: prevData.reachedValue.description,
        value: props.reachedValue,
      },
      customersPortfolio: {
        description: prevData.customersPortfolio.description,
        value: props.customersPortfolio,
      },
      customersOrdersMonth: {
        description: prevData.customersOrdersMonth.description,
        value: props.customersOrdersMonth,
      },
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, setData])

  if (loading) return <Spinner />

  return (
    <>
      <h4 className={`t-heading-4 mt0 pb3 mb3 b--black-10 ${handles.title}`}>
        Área do representante:{' '}
        {/* eslint-disable-next-line prettier/prettier */}
        <span className="b">{`${user?.firstName?.value} ${user?.lastName?.value}`}</span>
      </h4>
      <div className="flex flex-wrap items-baseline">
        {Object.keys(data).map((key, index) =>  (
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
              {data[key as keyof typeof data].description}:{' '}
            </div>
            <div className={`w-100 w-auto-xl b ${handles.value}`}>
              {['individualGoal', 'reachedValue'].includes(key) && (
                <FormattedCurrency
                  value={+data[key as keyof typeof data].value ?? '---'}
                />
              )}

              {key === 'reachedValue' && data.individualGoal.value !== 0 &&
                ` (${Math.floor(
                  (+data.reachedValue.value /
                    (+data.individualGoal.value ?? 1)) *
                    100
                )}%)`}

              {!['individualGoal', 'reachedValue'].includes(key) &&
                (data[key as keyof typeof data].value ?? '---')}
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
      title: 'Meta individual',
      default: 0,
    },
    reachedValue: {
      type: 'number',
      title: 'Valor atingido',
      default: 0,
    },
    customersPortfolio: {
      type: 'number',
      title: 'Número de clientes na carteira',
      default: 0,
    },
    customersOrdersMonth: {
      type: 'number',
      title: 'Número de pedidos no mês',
      default: 0,
    },
  },
}

export default B2BRepresentativeArea
