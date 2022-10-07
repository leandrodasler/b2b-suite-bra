import React, { ChangeEvent, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { RadioGroup, Spinner } from 'vtex.styleguide'

import GET_ORGANIZATIONS from '../../graphql/getOrganizationsByEmail.graphql'
import {
  ROLE_MAP,
  setOrganizationUserSession,
  useSessionUser,
} from '../../utils'
import './styles.css'

interface B2BOrganizationUser {
  id: string
  organizationName: string
  orgId: string
  costId: string
  costCenterName: string
  roleId: keyof typeof ROLE_MAP
}

interface B2BOrganizationUserQuery {
  getOrganizationsByEmail: [B2BOrganizationUser]
}

function B2BSwitchOrganizations() {
  const { user, setUser, loading: loadingUser } = useSessionUser()

  const userEmail = user?.email?.value

  const { data: organizations, loading: loadingOrganizations } = useQuery<
    B2BOrganizationUserQuery
  >(GET_ORGANIZATIONS, {
    variables: {
      email: userEmail,
    },
    skip: !userEmail,
  })

  const handles = useCssHandles([
    'containerSwitch',
    'selectSwitch',
    'roleSwitch',
  ])

  const [selectedOrganizationUser, setSelectedOrganizationUser] = useState<
    string
  >()

  useEffect(() => {
    if (!loadingUser && !loadingOrganizations) {
      setSelectedOrganizationUser(
        organizations?.getOrganizationsByEmail.find(
          (o: B2BOrganizationUser) => o?.id === user?.b2bUserId
        )?.id
      )
    }
  }, [loadingOrganizations, loadingUser, organizations, user])

  useEffect(() => {
    if (organizations?.getOrganizationsByEmail.length) {
      setUser(prevUser => {
        if (prevUser) {
          const myOrganization = organizations?.getOrganizationsByEmail.find(
            (o: B2BOrganizationUser) => o?.id === prevUser?.b2bUserId
          )
          return {
            ...prevUser,
            costCenterName: myOrganization?.costCenterName,
            role: myOrganization?.roleId,
          }
        }
        return prevUser
      })
    }
  }, [organizations, setUser])

  const handleChangeOrganization = (e: ChangeEvent<typeof RadioGroup>) => {
    const selectedOrganization = organizations?.getOrganizationsByEmail.find(
      (o: B2BOrganizationUser) => o?.id === e.target.value
    )

    setSelectedOrganizationUser(selectedOrganization?.id)
    setOrganizationUserSession(
      selectedOrganization?.id,
      selectedOrganization?.orgId,
      selectedOrganization?.costId
    ).then(response => {
      if (response.status === 200) {
        window.location.reload()
      } else {
        window.alert(
          `Erro ao selecionar perfil: ${
            response.status
          } - ${response.statusText || 'sem mensagem'}`
        )
      }
    })
  }

  return (
    <>
      <div
        className={`flex flex-column items-center ${handles.containerSwitch}`}
      >
        {loadingUser || loadingOrganizations ? (
          <Spinner />
        ) : (
          organizations?.getOrganizationsByEmail &&
          organizations?.getOrganizationsByEmail?.length > 0 && (
            <RadioGroup
              label={<span className="b">Autenticado como:</span>}
              hideBorder
              options={organizations?.getOrganizationsByEmail?.map(
                (o: B2BOrganizationUser) => ({
                  value: o.id ?? '',
                  label: (
                    <div>
                      <div className="b">{o.organizationName}</div>
                      <div className="c-muted-1 f6">
                        Função: <span className="b">{ROLE_MAP[o.roleId]}</span>
                      </div>
                      <div className="c-muted-1 f6">
                        Centro de custo:{' '}
                        <span className="b">{o.costCenterName}</span>
                      </div>
                    </div>
                  ),
                })
              )}
              value={selectedOrganizationUser}
              onChange={handleChangeOrganization}
            />
          )
        )}
      </div>
    </>
  )
}

export default B2BSwitchOrganizations
