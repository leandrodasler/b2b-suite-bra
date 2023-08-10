import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

interface GoogleSheetsResponse {
  range: string
  majorDimension: string
  values?: string[][]
}

export default class GoogleSheets extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://sheets.googleapis.com/v4/spreadsheets', context, options)
  }

  public async getValues(
    token: string,
    googleSheetId: string,
    tabTitle?: string
  ) {
    const range = tabTitle ?? 'A:ZZZ'

    const response = await this.http.get<GoogleSheetsResponse>(
      `/${googleSheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const { values } = response

    if (!values?.length || values.length === 1) {
      return []
    }

    const [rowTitles] = values
    const dataRows = values.slice(1)

    const resultArray = dataRows.map(dataRow => {
      const dataObject: Record<string, string> = {}

      dataRow.forEach((value, index) => {
        dataObject[rowTitles[index]] = value
      })

      return dataObject
    })

    return resultArray
  }
}
