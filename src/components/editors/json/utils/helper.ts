export const parseJsonSchemaString = (jsonString: string): Record<string, unknown> => {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    return {}
  }
}
export const minifyJsonString = (jsonString: string): string => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null)
  } catch (err) {
    return jsonString
  }
}

export const prettifyJsonString = (jsonString: string): string => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, '\t')
  } catch (err) {
    return jsonString
  }
}

import { v4 as uuid } from 'uuid'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const downloadJsonFile = async (jsonString: string) => {
  const fileName = uuid()
  // Set the HREF to a Blob representation of the data to be downloaded
  const blob = new Blob([jsonString], { type: 'application/json' })

  try {
    // create an invisible A element
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)

    const href = await window.URL.createObjectURL(blob)
    // blob ready, download it
    link.href = href
    link.download = `${fileName}.json`

    // trigger the download by simulating click
    link.click()

    // cleanup
    window.document.body.removeChild(link)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error: fail to download a file.')
  }
}
