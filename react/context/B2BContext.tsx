import React, { createContext, FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'vtex.styleguide'

import { getRemainingDaysInMonth, getUser, User } from '../utils'

interface KeyData {
  description: string
  value: string | number | typeof Link
}

export interface RepresentativeAreaContextProps {
  individualGoal: KeyData
  customersPortfolio: KeyData
  remainingDaysInMonth: KeyData
  reachedValue: KeyData
  customersOrdersMonth: KeyData
  lastOrder: KeyData
}

export interface B2BContextProps {
  user?: User
  loadingUser: boolean
  representativeArea: RepresentativeAreaContextProps
}

interface B2BContextType {
  data?: B2BContextProps
  setData?: React.Dispatch<React.SetStateAction<B2BContextProps>>
}

export const B2BContext = createContext<B2BContextType>({})

const B2BContextProvider: FC = ({ children }) => {
  const intl = useIntl()

  const [data, setData] = useState<B2BContextProps>({
    loadingUser: true,
    representativeArea: {
      individualGoal: {
        description: intl.formatMessage({
          id: 'store/representative-area.individualGoal',
        }),
        value: 0,
      },
      customersPortfolio: {
        description: intl.formatMessage({
          id: 'store/representative-area.customersPortfolio',
        }),
        value: 0,
      },
      remainingDaysInMonth: {
        description: intl.formatMessage({
          id: 'store/representative-area.remainingDaysInMonth',
        }),
        value: getRemainingDaysInMonth(),
      },
      reachedValue: {
        description: intl.formatMessage({
          id: 'store/representative-area.reachedValue',
        }),
        value: 0,
      },
      customersOrdersMonth: {
        description: intl.formatMessage({
          id: 'store/representative-area.customersOrdersMonth',
        }),
        value: 0,
      },
      lastOrder: {
        description: intl.formatMessage({
          id: 'store/representative-area.lastOrder',
        }),
        value: intl.formatMessage({
          id: 'store/representative-area.lastOrderLoading',
        }),
      },
    },
  })

  useEffect(() => {
    getUser().then(recoveredUser => {
      setData((prevData: B2BContextProps) => ({
        ...prevData,
        user: recoveredUser,
        loadingUser: false,
      }))
    })
  }, [])

  return (
    <B2BContext.Provider value={{ data, setData }}>
      {children}
    </B2BContext.Provider>
  )
}

export default B2BContextProvider
