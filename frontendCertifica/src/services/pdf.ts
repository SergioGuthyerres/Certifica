function escaparTextoPdf(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

function quebrarLinhas(texto: string, maxChars: number): string[] {
  const palavras = texto.split(" ")
  const linhas: string[] = []
  let linhaAtual = ""

  for (const palavra of palavras) {
    const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra
    if (tentativa.length > maxChars) {
      if (linhaAtual) linhas.push(linhaAtual)
      linhaAtual = palavra
    } else {
      linhaAtual = tentativa
    }
  }
  if (linhaAtual) linhas.push(linhaAtual)
  return linhas
}

/** Gera um PDF minimalista (sem dependências) só para simular o download no protótipo. */
export function gerarCertificadoPdfMock(titulo: string, corpo: string, codigoVerificacao: string): Blob {
  const linhasCorpo = quebrarLinhas(corpo, 78)
  let y = 620

  const comandosTexto: string[] = []
  comandosTexto.push(`BT /F1 20 Tf 60 700 Td (${escaparTextoPdf(titulo)}) Tj ET`)
  for (const linha of linhasCorpo) {
    comandosTexto.push(`BT /F1 13 Tf 60 ${y} Td (${escaparTextoPdf(linha)}) Tj ET`)
    y -= 22
  }
  comandosTexto.push(`BT /F1 10 Tf 60 80 Td (Codigo de verificacao: ${escaparTextoPdf(codigoVerificacao)}) Tj ET`)

  const conteudoStream = comandosTexto.join("\n")

  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 792 612] /Contents 5 0 R >>",
    "<< /Font << /F1 6 0 R >> >>",
    `<< /Length ${conteudoStream.length} >>\nstream\n${conteudoStream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]

  let pdf = "%PDF-1.4\n"
  const offsets: number[] = []

  objetos.forEach((corpoObjeto, indice) => {
    offsets.push(pdf.length)
    pdf += `${indice + 1} 0 obj\n${corpoObjeto}\nendobj\n`
  })

  const inicioXref = pdf.length
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`

  return new Blob([pdf], { type: "application/pdf" })
}

export function baixarBlob(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
