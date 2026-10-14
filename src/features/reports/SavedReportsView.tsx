import React, { useEffect, useState } from "react";
import { dataProvider, BusinessFormulas } from "../../services";
import { SavedReportModel } from "../../types/reports";
import { FolderOpen, Play, Trash2, Share2, Calendar, User, Tag, Plus } from "lucide-react";

interface SavedReportsViewProps {
  onOpenReportBuilder: () => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({ onOpenReportBuilder }) => {
  const [reports, setReports] = useState<SavedReportModel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = () => {
    setLoading(true);
    dataProvider.getSavedReports().then(res => {
      setReports(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente remover este modelo de relatório?")) {
      await dataProvider.deleteReport(id);
      loadReports();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Relatórios Salvos & Modelos Corporativos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Modelos de relatórios salvos e compartilhados entre as áreas de Controladoria, Comercial e Diretoria.
          </p>
        </div>

        <button
          onClick={onOpenReportBuilder}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Relatório</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(rep => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {rep.dataSource === "sales" ? "Vendas" : rep.dataSource === "receivables" ? "Recebíveis" : "Pagar"}
                </span>
                {rep.isShared && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Share2 className="w-3 h-3" />
                    Compartilhado
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {rep.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {rep.tags.map(t => (
                  <span
                    key={t}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1 text-[10px]">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[110px]">{rep.createdBy.split(" ")[0]}</span>
                <span>·</span>
                <span>{rep.updatedAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(rep.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Excluir modelo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenReportBuilder}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 rounded text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Play className="w-3 h-3 text-blue-600" />
                  <span>Executar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
