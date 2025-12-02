import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import {
    Activity,
    Droplet,
    Clock,
    AlertCircle,
    Wifi,
    Smartphone,
    Monitor,
} from 'lucide-react';

// Simulated Gompertz Curve Data (Microbial Growth)
const generateData = () => {
    const data = [];
    for (let i = 0; i <= 12; i += 0.5) {
        const growth = 100 * Math.exp(-Math.exp(-0.8 * (i - 4)));
        data.push({
            time: i,
            growth: Math.max(0, growth + (Math.random() * 2 - 1)),
            threshold: 80,
        });
    }
    return data;
};

const data = generateData();

export const BioDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className="w-full flex flex-col items-center justify-center gap-8 mt-10 px-4">
            {/* Botões de Alternância (Tabs) */}
            <div className="flex gap-2 sm:gap-4 mb-4 p-1 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <button
                    onClick={() => setActiveTab('desktop')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full transition-all text-sm sm:text-base ${
                        activeTab === 'desktop'
                            ? 'bg-auftek-blue text-white shadow-lg shadow-auftek-blue/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Monitor size={18} />
                    <span className="hidden sm:inline">Monitoramento Web</span>
                    <span className="sm:hidden">Web</span>
                </button>
                <button
                    onClick={() => setActiveTab('mobile')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full transition-all text-sm sm:text-base ${
                        activeTab === 'mobile'
                            ? 'bg-auftek-blue text-white shadow-lg shadow-auftek-blue/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Smartphone size={18} />
                    <span className="hidden sm:inline">App Mobile</span>
                    <span className="sm:hidden">App</span>
                </button>
            </div>

            {/* --- VISUALIZAÇÃO DESKTOP (Dashboard Web) --- */}
            {activeTab === 'desktop' ? (
                <div className="w-full max-w-5xl bg-[#1a2c42] rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in mx-auto">
                    {/* Mock Browser Header - Responsivo (esconde URL em mobile muito pequeno) */}
                    <div className="bg-[#0e223b] px-4 py-3 flex items-center gap-4 border-b border-gray-700">
                        <div className="flex gap-1.5 shrink-0">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 bg-[#1a2c42] px-3 py-1.5 rounded text-xs text-gray-400 flex items-center gap-2 truncate max-w-2xl">
                            <Wifi
                                size={12}
                                className="text-auftek-green shrink-0"
                            />
                            <span className="truncate">
                                bioailab.auftek.com/dashboard/analysis/ID-8821
                            </span>
                        </div>
                    </div>

                    {/* Grid Layout: 1 coluna no mobile, 3 no desktop */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar Stats (Esquerda) */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                                <h4 className="text-auftek-green text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-auftek-green animate-pulse"></div>
                                    Status da Análise
                                </h4>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-white font-bold text-xl sm:text-2xl">
                                        Em Progresso
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-auftek-blue h-full w-[65%] rounded-full animate-[width_2s_ease-out]"></div>
                                </div>
                                <p className="text-gray-400 text-xs mt-2 font-mono">
                                    Tempo decorrido: 04h 12m
                                </p>
                            </div>

                            {/* Grid 2x1 para status menores em mobile */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700/50">
                                    <h4 className="text-gray-400 text-xs mb-1">
                                        Estimativa E. coli
                                    </h4>
                                    <div className="text-lg sm:text-xl font-bold text-white">
                                        1.2 x 10³{' '}
                                        <span className="text-xs font-normal text-gray-500 block sm:inline">
                                            UFC/mL
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700/50">
                                    <h4 className="text-gray-400 text-xs mb-1">
                                        Coliformes Totais
                                    </h4>
                                    <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                        Detectado
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Chart (Direita/Baixo) */}
                        <div className="lg:col-span-2 bg-[#0e223b] p-4 sm:p-6 rounded-lg border border-gray-700/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                                <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <Activity
                                        size={18}
                                        className="text-auftek-blue"
                                    />
                                    Curva de Crescimento (Gompertz)
                                </h3>
                                <span className="text-xs bg-auftek-green/10 text-auftek-green px-2 py-1 rounded border border-auftek-green/20">
                                    Tempo Real
                                </span>
                            </div>

                            {/* Altura responsiva do gráfico: menor no mobile */}
                            <div className="h-48 sm:h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient
                                                id="colorGrowth"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#1e90ff"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#1e90ff"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#334155"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            axisLine={false}
                                            tickLine={false}
                                            width={30}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="growth"
                                            stroke="#1e90ff"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorGrowth)"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="threshold"
                                            stroke="#ef4444"
                                            strokeDasharray="5 5"
                                            dot={false}
                                            strokeWidth={1}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-4 bg-[#1a2c42] py-2 rounded">
                                Detecção automática de fase logarítmica via IA
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- VISUALIZAÇÃO MOBILE (App Simulador) --- */
                <div className="relative w-[280px] sm:w-[320px] h-[550px] sm:h-[600px] bg-black rounded-[2.5rem] border-[6px] sm:border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col mx-auto">
                    {/* Mobile Top Bar */}
                    <div className="h-7 bg-black w-full flex justify-center items-center z-20 shrink-0">
                        <div className="w-20 h-4 bg-black rounded-b-xl absolute top-0"></div>
                    </div>

                    {/* Mobile App Header */}
                    <div className="bg-auftek-dark p-4 pt-6 pb-4 flex justify-between items-center z-10 border-b border-gray-800">
                        <div className="text-white font-bold text-base">
                            BioAiLab
                            <span className="text-auftek-green text-[10px] align-top">
                                ®
                            </span>
                        </div>
                        <Wifi size={14} className="text-auftek-green" />
                    </div>

                    {/* Mobile Content */}
                    <div className="flex-1 bg-[#0b1624] p-4 overflow-y-auto space-y-4 scrollbar-hide">
                        {/* Status Card */}
                        <div className="bg-[#1a2c42] p-4 rounded-xl border border-gray-700/50 shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-xs">
                                    Amostra #2910
                                </span>
                                <span className="text-[10px] text-auftek-blue bg-auftek-blue/10 px-2 py-0.5 rounded-full border border-auftek-blue/20">
                                    Ativo
                                </span>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">
                                E. coli Monitoring
                            </h3>
                            <div className="flex items-center gap-2 mt-2 bg-black/20 p-2 rounded-lg">
                                <Clock
                                    size={14}
                                    className="text-auftek-green"
                                />
                                <span className="text-gray-300 text-xs">
                                    Restante estimado: <b>1h 30m</b>
                                </span>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="bg-[#1a2c42] p-4 rounded-xl border border-gray-700/50 h-40 shadow-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-gray-400 text-xs">
                                    Crescimento (Log)
                                </h4>
                                <Activity
                                    size={12}
                                    className="text-auftek-green"
                                />
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.slice(0, 15)}>
                                    <Line
                                        type="monotone"
                                        dataKey="growth"
                                        stroke="#a9deca"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Actions Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-auftek-blue text-white py-3 rounded-lg text-xs font-semibold hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 active:scale-95">
                                Gerar Relatório
                            </button>
                            <button className="bg-white/5 text-white border border-white/10 py-3 rounded-lg text-xs font-semibold hover:bg-white/10 transition active:scale-95">
                                Configurar Alertas
                            </button>
                        </div>
                    </div>

                    {/* Mobile Tab Bar */}
                    <div className="bg-[#0e223b] h-14 flex justify-around items-center border-t border-gray-800 shrink-0 pb-1">
                        <div className="flex flex-col items-center gap-1 text-auftek-blue">
                            <Activity size={20} />
                            <span className="text-[9px]">Monitor</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                            <Droplet size={20} />
                            <span className="text-[9px]">Amostras</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                            <AlertCircle size={20} />
                            <span className="text-[9px]">Alertas</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
