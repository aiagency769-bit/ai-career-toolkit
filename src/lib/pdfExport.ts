import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ResumeData } from '../types'

export const exportResumeToPDF = async (elementId: string, filename = 'resume.pdf'): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  const imgX = (pdfWidth - imgWidth * ratio) / 2
  const imgY = 0

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

  // Handle multi-page
  const pageHeight = (canvas.width * pdfHeight) / pdfWidth
  let heightLeft = imgHeight - pageHeight
  let position = -pageHeight

  while (heightLeft >= 0) {
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', imgX, position * ratio + imgY, imgWidth * ratio, imgHeight * ratio)
    heightLeft -= pageHeight
    position -= pageHeight
  }

  // Mobile-friendly save: open as data URL if download doesn't work
  try {
    pdf.save(filename)
  } catch {
    const dataUrl = pdf.output('datauristring')
    window.open(dataUrl, '_blank')
  }
}

export const exportCoverLetterToPDF = async (content: string, filename = 'cover-letter.pdf'): Promise<void> => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 20
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2
  const lineHeight = 7
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
    y += lineHeight
  }

  pdf.save(filename)
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(text || '')
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
