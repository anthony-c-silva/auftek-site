"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Droplet, Clock, AlertCircle, Wifi, Smartphone, Monitor } from 'lucide-react';

// Simulated Gompertz Curve Data (Microbial Growth)
const generateData = () => {
  const data = [];
  for (let i = 0; i <= 12; i += 0.5) {
    // Sigmoid-like curve equation approximation
    const growth = 100 * Math.exp(-Math.exp(-0.8 * (i - 4)));
    data.push({
      time: i,
      growth: Math.max(0, growth + (Math.random() * 2 - 1)), // Add tiny noise
      threshold: 80
    });
  }
  return data;
};

const data = generateData();

export const BioDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  // Adicionei este useEffect para garantir que o componente montou no cliente
  // Isso evita erros de "Hydration Mismatch" comuns com Recharts
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-64 bg-gray-900/50 rounded-xl animate-pulse"></div>;
  }

  return (
      <div className="w-full flex flex-col items-center justify-center gap-8 mt-10">
        <div className="flex gap-4 mb-4">
          <button
              onClick={() => setActiveTab('desktop')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'desktop' ? 'bg-auftek-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <Monitor size={18} />
            <span>Monitoramento Web</span>
          </button>
          <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'mobile' ? 'bg-auftek-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <Smartphone size={18} />
            <span>App Mobile</span>
          </button>
        </div>

        {activeTab === 'desktop' ? (
            <div className="w-full max-w-5xl bg-[#1a2c42] rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
              {/* Mock Browser Header */}
              <div className="bg-[#0e223b] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 bg-[#1a2c42] px-3 py-1 rounded text-xs text-gray-400 flex items-center gap-2 w-1/2">
                  <Wifi size={12} className="text-auftek-green" />
                  bioailab.auftek.com/dashboard/analysis/ID-8821
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Stats */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700">
                    <h4 className="text-auftek-green text-sm font-semibold uppercase tracking-wider mb-2">Status da Análise</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-auftek-blue rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-xl">Em Progresso</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Tempo decorrido: 04h 12m</p>
                  </div>

                  <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700">
                    <h4 className="text-gray-400 text-sm mb-1">Estimativa E. coli</h4>
                    <div className="text-2xl font-bold text-white">1.2 x 10³ <span className="text-sm font-normal text-gray-500">UFC/mL</span></div>
                  </div>

                  <div className="bg-[#0e223b] p-4 rounded-lg border border-gray-700">
                    <h4 className="text-gray-400 text-sm mb-1">Coliformes Totais</h4>
                    <div className="text-2xl font-bold text-white">Detectado <span className="text-auftek-blue"><Activity size={16} className="inline"/></span></div>
                  </div>
                </div>

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-[#0e223b] p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Activity size={18} className="text-auftek-blue"/>
                      Curva de Crescimento (Gompertz)
                    </h3>
                    <span className="text-xs bg-auftek-green/10 text-auftek-green px-2 py-1 rounded">Tempo Real</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            label={{ value: 'Tempo (h)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                        />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="growth" stroke="#1e90ff" fillOpacity={1} fill="url(#colorGrowth)" />
                        <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">Detecção automática de fase logarítmica via IA</p>
                </div>
              </div>
            </div>
        ) : (
            <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Mobile Top Bar */}
              <div className="h-8 bg-black w-full flex justify-center items-center z-20">
                <div className="w-24 h-4 bg-black rounded-b-xl absolute top-0"></div>
              </div>

              {/* Mobile App Header */}
              <div className="bg-auftek-dark p-4 pt-8 pb-4 flex justify-between items-center z-10">
                <div className="text-white font-bold text-lg">BioAiLab<span className="text-auftek-green text-xs align-top">®</span></div>
                <Wifi size={16} className="text-auftek-green" />
              </div>

              {/* Mobile Content */}
              <div className="flex-1 bg-gray-900 p-4 overflow-y-auto space-y-4">

                {/* Status Card */}
                <div className="bg-[#1a2c42] p-4 rounded-xl border border-gray-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-400 text-xs">Amostra #2910</span>
                    <span className="text-xs text-auftek-blue bg-auftek-blue/10 px-2 py-0.5 rounded-full">Ativo</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">E. coli Monitoring</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={14} className="text-auftek-green" />
                    <span className="text-gray-300 text-sm">Restante: 1h 30m</span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-[#1a2c42] p-4 rounded-xl border border-gray-700/50 h-48">
                  <h4 className="text-gray-400 text-xs mb-2">Crescimento Bacteriano</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(0, 15)}>
                      <Line type="monotone" dataKey="growth" stroke="#a9deca" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-auftek-blue text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition">Relatório</button>
                  <button className="bg-white/10 text-white py-3 rounded-lg text-sm font-semibold hover:bg-white/20 transition">Alertas</button>
                </div>
              </div>

              {/* Mobile Tab Bar */}
              <div className="bg-black/90 h-16 flex justify-around items-center border-t border-gray-800">
                <Activity className="text-auftek-blue" size={24} />
                <Droplet className="text-gray-600" size={24} />
                <AlertCircle className="text-gray-600" size={24} />
              </div>
            </div>
        )}
      </div>
  );
};