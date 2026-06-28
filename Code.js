function doGet(e) {
  // Mengambil file Index.html dan mengaturnya agar responsif (mobile-friendly)
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('MONADO 8203 - Digital Monitoring Worksheet')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Penting agar bisa meload eksternal asset jika diperlukan
}

/**
 * Fungsi pembantu jika Anda ingin menyisipkan file HTML lain (seperti CSS/JS terpisah)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
