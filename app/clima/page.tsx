'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AlertCircle, Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';

const weatherAlerts = [
  {
    id: 1,
    title: 'Aviso de Chuvas Fortes',
    description: 'Previsão de chuvas moderadas a fortes (30-50mm) nas próximas 48h. Risco de alagamento em zonas baixas.',
    region: 'Província de Maputo e Gaza',
    severity: 'warning',
  },
];

const forecastDays = [
  {
    day: 'Hoje',
    date: '30 Mar',
    high: 28,
    low: 20,
    condition: 'Parcialmente nublado',
    icon: '⛅',
    rainProb: 20,
  },
  {
    day: 'Ter',
    date: '31 Mar',
    high: 25,
    low: 19,
    condition: '80% prob. chuva',
    icon: '🌧️',
    rainProb: 80,
  },
  {
    day: 'Qua',
    date: '01 Abr',
    high: 24,
    low: 18,
    condition: '60% prob. chuva',
    icon: '🌧️',
    rainProb: 60,
  },
  {
    day: 'Qui',
    date: '02 Abr',
    high: 29,
    low: 20,
    condition: 'Céu limpo',
    icon: '☀️',
    rainProb: 0,
  },
];

export default function Clima() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          Previsão e Alertas
        </h1>
        <p className="text-stone-600">
          Informação meteorológica para a sua machamba.
        </p>
      </div>

      {/* Weather Alerts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-stone-900">
            Alertas do INAM
          </h2>
        </div>

        <div className="space-y-4">
          {weatherAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4"
            >
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">
                  {alert.title}
                </h3>
                <p className="text-amber-800 text-sm mb-3">
                  {alert.description}
                </p>
                <p className="text-amber-700 text-xs flex items-center gap-2">
                  <span>📍 {alert.region}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900 mb-6">
          Previsão para Boane
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {forecastDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-stone-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Day and Date */}
              <div className="mb-4">
                <p className="font-bold text-stone-900">{day.day}</p>
                <p className="text-stone-500 text-sm">{day.date}</p>
              </div>

              {/* Weather Icon */}
              <div className="text-4xl mb-4">{day.icon}</div>

              {/* Temperature */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-stone-900">
                  {day.high}° / {day.low}°
                </p>
                <p className="text-stone-600 text-sm mt-1">
                  {day.condition}
                </p>
              </div>

              {/* Rain Probability */}
              {day.rainProb > 0 && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Droplets className="w-4 h-4" />
                  {day.rainProb}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Extended Forecast Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            Recomendações para a sua Machamba
          </h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="text-xl">💧</span>
              <span>Com as chuvas previstas, reduza a irrigação nos próximos dias para economizar água.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">🌾</span>
              <span>Proteja os seus campos de erosão com cobertura vegetal antes das chuvas fortes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">🛡️</span>
              <span>Inspecione as drenagens para evitar alagamento após as chuvas.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
