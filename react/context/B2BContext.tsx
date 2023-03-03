import React, { createContext, FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'vtex.styleguide'

import { getRemainingDaysInMonth } from '../utils'

interface KeyData {
  description: string
  value: string | number | typeof Link
}

export const defaultData: { [key: string]: KeyData } = {
  individualGoal: {
    description: 'Meta individual',
    value: 0,
  },
  customersPortfolio: {
    description: 'Nº de clientes na carteira',
    value: 0,
  },
  remainingDaysInMonth: {
    description: 'Dias remanescentes no mês',
    value: getRemainingDaysInMonth(),
  },
  reachedValue: {
    description: 'Valor atingido',
    value: 0,
  },
  customersOrdersMonth: {
    description: 'Nº de clientes que fizeram pedido este mês',
    value: 0,
  },
  lastOrder: {
    description: 'Último pedido',
    value: 'carregando...',
  },
}

interface B2BContextType {
  data: typeof defaultData
  setData: React.Dispatch<React.SetStateAction<typeof defaultData>>
}

export const B2BContext = createContext<B2BContextType>({
  data: defaultData,
  setData: () => void 0,
})

const B2BContextProvider: FC = ({ children }) => {
  const intl = useIntl()

  defaultData.individualGoal.description = intl.formatMessage({
    id: 'store/representative-area.individualGoal',
  })
  defaultData.reachedValue.description = intl.formatMessage({
    id: 'store/representative-area.reachedValue',
  })
  defaultData.customersPortfolio.description = intl.formatMessage({
    id: 'store/representative-area.customersPortfolio',
  })
  defaultData.customersOrdersMonth.description = intl.formatMessage({
    id: 'store/representative-area.customersOrdersMonth',
  })
  defaultData.remainingDaysInMonth.description = intl.formatMessage({
    id: 'store/representative-area.remainingDaysInMonth',
  })
  defaultData.lastOrder.description = intl.formatMessage({
    id: 'store/representative-area.lastOrder',
  })

  const [data, setData] = useState<typeof defaultData>(defaultData)

  return (
    <B2BContext.Provider value={{ data, setData }}>
      {children}
    </B2BContext.Provider>
  )
}

export default B2BContextProvider