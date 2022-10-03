/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { /* Dropdown, */ RadioGroup, Spinner } from 'vtex.styleguide'
// import type { B2BOrganization } from 'vtex.b2b-organizations-graphql'

import GET_ORGANIZATIONS from '../../graphql/getOrganizationsByEmail.graphql'
import {
  ROLE_MAP,
  setOrganizationUserSession,
  useSessionUser,
} from '../../utils'
// import GET_USER from './graphql/getUser.graphql'
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

  // const filteredOrganizations = organizations?.getOrganizationsByEmail.filter(
  //   (o: B2BOrganizationUser) => o?.id !== user?.b2bUserId
  // )

  useEffect(() => {
    if (!loadingUser && !loadingOrganizations) {
      setSelectedOrganizationUser(
        organizations?.getOrganizationsByEmail.find(
          (o: B2BOrganizationUser) => o?.id === user?.b2bUserId
        )?.id
      )

      // if (organizations?.getOrganizationsByEmail.length) {
      //   setUser(prevUser => {
      //     if (prevUser) {
      //       const myOrganization = organizations?.getOrganizationsByEmail.find(
      //         (o: B2BOrganizationUser) => o?.id === prevUser?.b2bUserId
      //       )
      //       return {
      //         ...prevUser,
      //         costCenterName: myOrganization?.costCenterName,
      //         role: myOrganization?.roleId,
      //       }
      //     }
      //     return prevUser
      //   })
      // }
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

  const handleChangeOrganization = (e: ChangeEvent<HTMLSelectElement>) => {
    const organization = organizations?.getOrganizationsByEmail.find(
      (o: B2BOrganizationUser) => o?.id === e.target.value
    )
    console.log('selected organization: ', organization)
    setSelectedOrganizationUser(organization?.id)
    setOrganizationUserSession(
      organization?.id,
      organization?.orgId,
      organization?.costId
    ).then(() => {
      // if (response.status === 200) {
      window.location.reload()
      // } else {
      //   window.alert(
      //     `Erro ao selecionar perfil: ${response.status} - ${response.statusText}`
      //   )
      // }
    })
  }

  return (
    <>
      {loadingUser || loadingOrganizations ? (
        <Spinner />
      ) : (
        <div className={`flex flex-column ${handles.containerSwitch}`}>
          {/* {filteredOrganizations && filteredOrganizations?.length > 0 && ( */}
          {organizations?.getOrganizationsByEmail &&
            organizations?.getOrganizationsByEmail?.length > 0 && (
              <>
                <RadioGroup
                  // label={<span className="b">Autenticado como:</span>}
                  hideBorder
                  options={organizations?.getOrganizationsByEmail?.map(
                    (o: B2BOrganizationUser) => ({
                      // disabled: o?.id === user?.b2bUserId,
                      value: o.id ?? '',
                      label: (
                        <div>
                          <div className="b">{o.organizationName}</div>
                          <div className="c-muted-1 f6">
                            Função:{' '}
                            <span className="b">{ROLE_MAP[o.roleId]}</span>
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
                {/* <Dropdown
                placeholder="Selecione outro perfil"
                options={filteredOrganizations?.map(
                  (o: B2BOrganizationUser) => ({
                    value: o.id ?? '',
                    label: `${o.organizationName} - Função: ${
                      ROLE_MAP[o.roleId]
                    } - Centro de custo: ${o.costCenterName}`,
                  })
                )}
                value={selectedOrganizationUser}
                onChange={handleChangeOrganization}
                preventTruncate
              /> */}
                {/* <select
                className={`b--none ${handles.selectSwitch}`}
                value={selectedOrganizationUser}
                onChange={handleChangeOrganization}
              >
                <option>Selecione outro perfil de acesso</option>

                {filteredOrganizations?.map((o: B2BOrganizationUser) => (
                  <option key={o.id ?? ''} value={o.id ?? ''}>
                    {o.organizationName} {' - '}
                    Função: {ROLE_MAP[o.roleId]} {' - '}
                    Centro de custo: {o.costCenterName}
                  </option>
                ))}
              </select> */}
              </>
            )}
          {/* <div className={handles.roleSwitch}>
            Minha função:
            <br />
            <strong>{ROLE_MAP[user?.role || 'default']}</strong>
          </div>
          <div className={handles.roleSwitch}>
            Meu centro de custos:
            <br />
            <strong>{user?.costCenterName || '---'}</strong>
          </div> */}
        </div>
      )}
    </>
  )
}

export default B2BSwitchOrganizations
