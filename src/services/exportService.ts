/**
 * DRAFER Intelligence - Serviço de Exportação de Dados (CSV e Formato Planilha)
 */

export const ExportService = {
  exportToCsv<T extends Record<string, any>>(
    filename: string,
    data: T[],
    columns?: { key: keyof T; label: string }[]
  ): void {
    if (!data || data.length === 0) {
      alert("Não há dados para exportar com os filtros atuais.");
      return;
    }

    const headers = columns ? columns.map(c => c.label) : Object.keys(data[0]);
    const keys = columns ? columns.map(c => c.key) : (Object.keys(data[0]) as (keyof T)[]);

    const csvRows: string[] = [];

    // Header row
    csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(";"));

    // Data rows
    for (const row of data) {
      const values = keys.map(k => {
        const val = row[k];
        if (val === null || val === undefined) return '""';
        if (typeof val === "number") {
          // Brazilian format comma decimal for Excel
          return `"${String(val).replace(".", ",")}"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(";"));
    }

    // Include UTF-8 BOM (\uFEFF) for proper Excel character encoding
    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
