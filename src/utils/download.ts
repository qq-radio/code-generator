export function downloadFile(filename: string, data: any, type: string) {
  const blob = new Blob([data], { type })
  const blobURL = window.URL.createObjectURL(blob)

  const downloadLink = document.createElement('a')
  downloadLink.style.display = 'none'
  downloadLink.href = blobURL
  downloadLink.setAttribute('download', filename)

  if (typeof downloadLink.download === 'undefined') {
    downloadLink.setAttribute('target', '_blank')
  }

  document.body.appendChild(downloadLink)
  downloadLink.click()

  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(blobURL)
}

export function downloadJson(filename: string, data: any) {
  return downloadFile(filename, JSON.stringify(data), 'application/json')
}

export function downloadJavascript(filename: string, data: any) {
  return downloadFile(filename, data, 'application/javascript')
}
