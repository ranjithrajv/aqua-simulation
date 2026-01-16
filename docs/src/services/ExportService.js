export class ExportService {
  static exportJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  }

  static exportPNG(canvas, filename) {
    try {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      throw error;
    }
  }

  static generateExportData(data) {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: data,
    };
  }

  static generateTimestampedFilename(prefix, extension) {
    const date = new Date().toISOString().slice(0, 10);
    return `${prefix}-${date}.${extension}`;
  }
}
