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

interface B2BOrganizationUser {
  id: string
  organizationName: string
  orgId: string
  costId: string
  costCenterName: string
  roleId: keyof typeof ROLE_MAP
}

interface B2BOrganizationUserQuery {
  getOrganizationsByEmail: B2BOrganizationUser[]
}

function B2BSwitchOrganizations() {
  const { user, loading: loadingUser } = useSessionUser()

  const userEmail = user?.email?.value

  const { data: organizations, loading: loadingOrganizations } = useQuery<
    B2BOrganizationUserQuery
  >(GET_ORGANIZATIONS, {
    variables: {
      email: userEmail,
    },
    skip: !userEmail,
  })

  const organizationUsers = organizations?.getOrganizationsByEmail

  const handles = useCssHandles(['containerSwitch'])

  const [selectedOrganizationUser, setSelectedOrganizationUser] = useState<
    string
  >()

  useEffect(() => {
    if (!loadingUser && !loadingOrganizations) {
      setSelectedOrganizationUser(
        organizationUsers?.find(
          (o: B2BOrganizationUser) => o?.id === user?.b2bUserId
        )?.id
      )
    }
  }, [loadingOrganizations, loadingUser, organizationUsers, user])

  const handleChangeOrganizationUser = (e: ChangeEvent<typeof RadioGroup>) => {
    const selected = organizationUsers?.find(
      (o: B2BOrganizationUser) => o?.id === e.target.value
    )

    setSelectedOrganizationUser(selected?.id)
    setOrganizationUserSession(
      selected?.id,
      selected?.orgId,
      selected?.costId
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
    <div className={`flex flex-column items-center ${handles.containerSwitch}`}>
      {loadingUser || loadingOrganizations ? (
        <Spinner />
      ) : (
        organizationUsers &&
        organizationUsers.length > 0 && (
          <RadioGroup
            label={<span className="b">Autenticado como:</span>}
            hideBorder
            options={organizationUsers.map((o: B2BOrganizationUser) => ({
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
            }))}
            value={selectedOrganizationUser}
            onChange={handleChangeOrganizationUser}
          />
        )
      )}
    </div>
  )
}

export default B2BSwitchOrganizations
