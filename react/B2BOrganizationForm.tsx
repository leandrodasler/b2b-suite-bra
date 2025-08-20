import React, { useState } from 'react'

const defaultFormState = {
  organizationName: '',
  tradeName: '',
  businessDocument: '',
  stateRegistration: '',

  // Dados do administrador
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',

  // Dados do centro de custo
  costCenterName: '',
  phoneNumber: '',

  // Endereço
  postalCode: '',
  country: 'BRA',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  reference: '',
  receiverName: '',
}

function B2BOrganizationForm() {
  const [cnpjInput, setCnpjInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(defaultFormState)

  // Função para validar CNPJ
  const validarCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (cnpj.length !== 14) return false

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    if (resultado !== parseInt(digitos.charAt(0), 10)) return false

    tamanho += 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1), 10)) return false

    return true
  }

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj: string): string => {
    const numbers = cnpj.replace(/\D/g, '')

    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    )
  }

  // Buscar dados do CNPJ
  const buscarCNPJ = async () => {
    const cnpjNumbers = cnpjInput.replace(/\D/g, '')

    if (!validarCNPJ(cnpjNumbers)) {
      setMessage('❌ CNPJ inválido')

      return
    }

    setSearching(true)
    setMessage('')

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpjNumbers}`
      )

      if (!response.ok) {
        throw new Error('CNPJ não encontrado')
      }

      const data = await response.json()

      // Log completo dos dados da API
      // console.log('📊 DADOS COMPLETOS DA API BRASILAPI:')
      // console.log(JSON.stringify(data, null, 2))
      // console.log('-----------------------------------')
      // console.log('Campos disponíveis:')
      // console.log('razao_social:', data.razao_social)
      // console.log('nome_fantasia:', data.nome_fantasia)
      // console.log('cnpj:', data.cnpj)
      // console.log('descricao_tipo_de_logradouro:', data.descricao_tipo_de_logradouro)
      // console.log('logradouro:', data.logradouro)
      // console.log('numero:', data.numero)
      // console.log('complemento:', data.complemento)
      // console.log('bairro:', data.bairro)
      // console.log('municipio:', data.municipio)
      // console.log('uf:', data.uf)
      // console.log('cep:', data.cep)
      // console.log('ddd_telefone_1:', data.ddd_telefone_1)
      // console.log('email:', data.email)
      // console.log('-----------------------------------')

      // Monta endereço completo
      const enderecoCompleto = [
        data.descricao_tipo_de_logradouro || '',
        data.logradouro || '',
      ]
        .filter(Boolean)
        .join(' ')

      const socio =
        data.qsa?.find(
          (s: Record<string, unknown>) => s.codigo_qualificacao_socio === 5 // Sócio Administrador
        ) ?? data.qsa?.[0]

      // Separa nome e sobrenome
      const nomeCompleto = socio?.nome_socio ?? (data.razao_social || '')
      const [firstName, ...lastNameParts] = nomeCompleto.split(' ')
      const lastName = lastNameParts.join(' ')

      // Atualiza o formulário
      setFormData(prev => ({
        ...prev,
        organizationName: data.razao_social || '',
        tradeName: data.nome_fantasia || '',
        businessDocument: formatarCNPJ(data.cnpj || ''),
        costCenterName: `Centro de Custo - ${data.razao_social}`,
        adminEmail: data.email || '',
        adminFirstName: firstName || '',
        adminLastName: lastName || '',
        receiverName: nomeCompleto || '',
        postalCode: data.cep
          ? `${data.cep}`.replace(/(\d{5})(\d{3})/, '$1-$2')
          : '',
        state: data.uf || '',
        city: data.municipio || '',
        neighborhood: data.bairro || '',
        street: enderecoCompleto,
        number: data.numero || '',
        complement: data.complemento || '',
        phoneNumber: data.ddd_telefone_1 || '',
      }))

      setMessage('✅ Dados do CNPJ carregados com sucesso!')
    } catch (error) {
      setMessage('❌ Erro ao buscar dados do CNPJ')
    } finally {
      setSearching(false)
    }
  }

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Validações básicas
      if (
        !formData.adminEmail ||
        !formData.organizationName ||
        !formData.businessDocument
      ) {
        setMessage('❌ Por favor, preencha todos os campos obrigatórios')
        setLoading(false)

        return
      }

      // Monta o payload no formato esperado pelo GraphQL
      const input = {
        name: formData.organizationName,
        tradeName: formData.tradeName,
        b2bCustomerAdmin: {
          firstName: formData.adminFirstName,
          lastName: formData.adminLastName,
          email: formData.adminEmail,
        },
        defaultCostCenter: {
          name:
            formData.costCenterName ||
            `Centro de Custo - ${formData.organizationName}`,
          address: {
            addressType: 'commercial',
            receiverName:
              formData.receiverName ||
              `${formData.adminFirstName} ${formData.adminLastName}`.trim(),
            postalCode: formData.postalCode,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            neighborhood: formData.neighborhood,
            street: formData.street,
            number: formData.number,
            complement: formData.complement || '',
            reference: formData.reference || '',
          },
          phoneNumber: formData.phoneNumber,
          businessDocument: formData.businessDocument.replace(/\D/g, ''),
          stateRegistration: formData.stateRegistration || '',
        },
        customFields: [],
      }

      // Mutation GraphQL
      const mutation = `
        mutation CreateOrganizationRequest($input: OrganizationInput!) {
          createOrganizationRequest(input: $input, notifyUsers: true) {
            id
            href
            status
          }
        }
      `

      // Envia para o endpoint GraphQL
      const url = '/_v/private/graphql/v1'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          query: mutation,
          variables: { input },
        }),
      })

      if (response.ok) {
        const result = await response.json()

        // Verifica se há erros no GraphQL
        if (result.errors && result.errors.length > 0) {
          setMessage(`❌ Erro: ${result.errors[0].message}`)
        } else if (result.data?.createOrganizationRequest) {
          window.scrollTo(0, 0)
          setMessage(
            '✅ Solicitação de organização enviada com sucesso! Aguarde a aprovação.'
          )
          setFormData(defaultFormState)
          setCnpjInput('')
        } else {
          setMessage('❌ Erro inesperado ao criar organização')
        }
      } else {
        await response.text() // Consome a resposta para evitar memory leak

        // Trata erros específicos
        if (response.status === 401) {
          setMessage(
            '❌ Erro de autenticação. Por favor, faça login novamente.'
          )
        } else if (response.status === 400) {
          setMessage(
            '❌ Dados inválidos. Verifique os campos e tente novamente.'
          )
        } else {
          setMessage(`❌ Erro ao enviar solicitação: ${response.status}`)
        }
      }
    } catch (error) {
      setMessage(`❌ Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h1
        style={{
          marginBottom: '30px',
          color: '#333',
          textAlign: 'center',
          fontSize: '28px',
        }}
      >
        Faça sua Solicitação de Cadastro
      </h1>

      {/* Busca de CNPJ */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ marginBottom: '15px', color: '#495057' }}>
          Consulta de CNPJ
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            disabled={searching}
            type="text"
            value={cnpjInput}
            onChange={e =>
              setCnpjInput(
                e.target.value
                  .replace(/\D/g, '')
                  .replace(/^(\d{2})(\d)/, '$1.$2')
                  .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                  .replace(/\.(\d{3})(\d)/, '.$1/$2')
                  .replace(/(\d{4})(\d)/, '$1-$2')
                  .replace(/(-\d{2})\d+?$/, '$1')
              )
            }
            placeholder="Digite o seu CNPJ. Ex: 00.000.000/0000-00"
            maxLength={18}
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ced4da',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                buscarCNPJ()
              }
            }}
          />
          <button
            onClick={buscarCNPJ}
            disabled={searching || !cnpjInput}
            style={{
              padding: '12px 30px',
              backgroundColor: searching || !cnpjInput ? '#6c757d' : '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: searching || !cnpjInput ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {searching ? 'Buscando...' : 'Buscar CNPJ'}
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${
              message.includes('✅') ? '#c3e6cb' : '#f5c6cb'
            }`,
          }}
        >
          {message}
        </div>
      )}

      {/* Formulário principal */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* Dados da Empresa */}
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Dados da Empresa
            </h3>
          </div>

          <div>
            <label
              htmlFor="organizationName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Razão Social *
            </label>
            <input
              disabled={searching}
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="tradeName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Nome Fantasia
            </label>
            <input
              disabled={searching}
              type="text"
              name="tradeName"
              value={formData.tradeName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="businessDocument"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              CNPJ *
            </label>
            <input
              disabled={searching}
              type="text"
              name="businessDocument"
              value={formData.businessDocument}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                fontSize: '14px',
              }}
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="stateRegistration"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Inscrição Estadual
            </label>
            <input
              disabled={searching}
              type="text"
              name="stateRegistration"
              value={formData.stateRegistration}
              onChange={handleChange}
              placeholder="Opcional"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Dados do Administrador */}
          <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Dados do Administrador
            </h3>
          </div>

          <div>
            <label
              htmlFor="adminFirstName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Nome *
            </label>
            <input
              disabled={searching}
              type="text"
              name="adminFirstName"
              value={formData.adminFirstName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="adminLastName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Sobrenome *
            </label>
            <input
              disabled={searching}
              type="text"
              name="adminLastName"
              value={formData.adminLastName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="adminEmail"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              E-mail *
            </label>
            <input
              disabled={searching}
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              required
              placeholder="email@empresa.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Telefone
            </label>
            <input
              disabled={searching}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#333' }}>
          Endereço do Centro de Custo
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div>
            <label
              htmlFor="costCenterName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Nome do Centro de Custo
            </label>
            <input
              disabled={searching}
              type="text"
              name="costCenterName"
              value={formData.costCenterName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              CEP *
            </label>
            <input
              disabled={searching}
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              placeholder="00000-000"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="state"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Estado *
            </label>
            <select
              disabled={searching}
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="city"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Cidade *
            </label>
            <input
              disabled={searching}
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="neighborhood"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Bairro *
            </label>
            <input
              disabled={searching}
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="street"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Endereço *
            </label>
            <input
              disabled={searching}
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="number"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Número *
            </label>
            <input
              disabled={searching}
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="complement"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Complemento
            </label>
            <input
              disabled={searching}
              type="text"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
              placeholder="Opcional"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label
              htmlFor="receiverName"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Nome do Recebedor *
            </label>
            <input
              disabled={searching}
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            type="submit"
            disabled={searching || loading || !formData.businessDocument}
            style={{
              padding: '16px 60px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor:
                searching || loading || !formData.businessDocument
                  ? '#6c757d'
                  : '#28a745',
              border: 'none',
              borderRadius: '4px',
              cursor:
                searching || loading || !formData.businessDocument
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default B2BOrganizationForm
