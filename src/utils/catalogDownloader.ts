// Utility to reliably download both Surge Shore product catalog PDFs

export const CATALOG_FILES = [
  { url: '/downloads/Surge-Shore-Motors-Pumps-Catalog.pdf', filename: 'Surge-Shore-Motors-Pumps-Catalog.pdf' },
  { url: '/downloads/Surge-Shore-Vibrator-Motors-Catalog.pdf', filename: 'Surge-Shore-Vibrator-Motors-Catalog.pdf' }
];

export async function downloadBothPDFs(): Promise<void> {
  for (let i = 0; i < CATALOG_FILES.length; i++) {
    const file = CATALOG_FILES[i];
    try {
      const res = await fetch(file.url);
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 45000);
    } catch {
      // Direct link fallback
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    }

    if (i < CATALOG_FILES.length - 1) {
      // 1200ms spacing ensures browser handles the 8.7MB and 6.7MB files sequentially
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
}
