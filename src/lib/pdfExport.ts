import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ResumeData } from '../types'

const isMobile = (): boolean =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

// Mobile-friendly: uses browser print dialog (Save as PDF)
const printElement = (element: HTMLElement, filename: string): void => {
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.cssText = 'width:794px;background:white;padding:40px;box-sizing:border-box;'

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) {
    // If popup blocked, print current page with only resume visible
    const overlay = document.createElement('div')
    overlay.id = '__print_overlay__'
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;background:white;overflow:auto;padding:20px;'
    overlay.appendChild(clone)
    document.body.appendChild(overlay)

    const style = document.createElement('style')
    style.id = '__print_style__'
    style.innerHTML = `@media print{body>*:not(#__print_overlay__){display:none!important}#__print_overlay__{display:block!important}}`
    document.head.appendChild(style)

    window.print()

    setTimeout(() => {
      document.body.removeChild(overlay)
      document.head.removeChild(style)
    }, 2000)
    return
  }

  win.document.write(`<!DOCTYPE html><html><head>
    <title>${filename}</title>
    <style>
      *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      body{margin:0;padding:0;background:white}
      @page{size:A4;margin:0}
      @media print{body{margin:0}}
    </style>
  </head><body></body></html>`)
  win.document.body.appendChild(clone)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
    win.close()
  }, 600)
}

export const exportResumeToPDF = async (
  elementId: string,
  filename = 'resume.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume preview not found. Please open the Preview tab first.')

  // Mobile: use print dialog (reliable on all Android/iOS WebViews)
  if (isMobile()) {
    printElement(element, filename)
    return
  }

  // Desktop: use html2canvas + jsPDF for proper PDF file download
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()
    const ratio = pdfW / canvas.width
    const imgH = canvas.height * ratio

    let y = 0
    while (y < imgH) {
      if (y > 0) pdf.addPage()
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        -y,
        pdfW,
        imgH
      )
      y += pdfH
    }

    pdf.save(filename)
  } catch {
    // Fallback to print on desktop too if canvas fails
    printElement(element, filename)
  }
}

export const exportCoverLetterToPDF = async (
  content: string,
  filename = 'cover-letter.pdf'
): Promise<void> => {
  if (isMobile()) {
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><title>${filename}</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;font-size:12pt;line-height:1.6;white-space:pre-wrap}</style>
      </head><body>${content.replace(/</g, '&lt;')}</body></html>`)
      win.document.close()
      setTimeout(() => { win.print(); win.close() }, 400)
    }
    return
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 20
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2
  let y = margin
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  pdf.setTextColor(30, 30, 30)
  const lines = pdf.splitTextToSize(content, pageWidth)
  for (const line of lines) {
    if (y > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage()
      y = margin
    }
    pdf.text(line, margin, y)
    y += 7
  }
  pdf.save(filename)
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve((e.target?.result as string) || '')
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
