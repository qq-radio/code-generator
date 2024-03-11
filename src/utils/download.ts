export function downloadJson(data: BlobPart, filename: string) {
  const blobData = [JSON.stringify(data)]
  const blob = new Blob(blobData, { type: 'application/json' })
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
