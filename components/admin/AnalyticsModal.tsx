"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, ArrowUpDown, ExternalLink } from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

// Tipos de dados
interface ChartData {
    date: string;
    users: number;
    views: number;
    formattedDate: string;
}

interface PageData {
    path: string;
    title: string;
    views: number;
}

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [pagesData, setPagesData] = useState<PageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estado para ordenação da tabela
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch("/api/analytics")
                .then((res) => {
                    if (!res.ok) throw new Error("Erro ao buscar dados");
                    return res.json();
                })
                .then((data) => {
                    // Formata datas do gráfico
                    const formattedChart = data.chart.map((item: any) => ({
                        ...item,
                        formattedDate: item.date
                            ? `${item.date.substring(6, 8)}/${item.date.substring(4, 6)}`
                            : "",
                    }));

                    setChartData(formattedChart);
                    setPagesData(data.pages);
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    // Lógica de Ordenação
    const sortedPages = [...pagesData].sort((a, b) => {
        return sortOrder === 'desc'
            ? b.views - a.views
            : a.views - b.views;
    });

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    if (!isOpen) return null;

    const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Relatório de Performance</h2>
                            <p className="text-sm text-slate-400">Total de {totalViews} visualizações nos últimos 30 dias</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Conteúdo com Scroll */}
                <div className="p-6 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Carregando dados do Google...</span>
                        </div>
                    ) : error ? (
                        <div className="h-64 flex items-center justify-center text-red-400 bg-red-900/10 rounded-lg border border-red-900/50">
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Seção 1: Gráfico */}
                            <div className="h-[250px] w-full bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                            labelStyle={{ color: '#94a3b8' }}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Seção 2: Tabela de Páginas */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    Páginas mais visitadas
                                </h3>

                                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-800 text-slate-400 uppercase font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Página / URL</th>
                                            <th className="px-6 py-3 text-right cursor-pointer hover:text-white transition-colors" onClick={toggleSort}>
                                                <div className="flex items-center justify-end gap-1">
                                                    Visualizações
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </div>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                        {sortedPages.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                                                    Nenhuma página visualizada neste período.
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedPages.map((page, index) => (
                                                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                                                    <td className="px-6 py-4 max-w-[300px] truncate">
                                                        <div className="flex flex-col">
                                <span className="text-slate-200 font-medium truncate" title={page.title || 'Sem título'}>
                                  {page.title || '(Sem título)'}
                                </span>
                                                            <a
                                                                href={page.path}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-400 hover:underline text-xs flex items-center gap-1 mt-0.5"
                                                            >
                                                                {page.path}
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-300 font-mono">
                                                        {page.views}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}