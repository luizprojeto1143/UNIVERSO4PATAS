"use client";

import React, { useState } from 'react';
import { Camera, Search, User, Calendar, Clock, Plus, Check, MapPin, Bone, Home, AlertCircle, Info, Bell, Settings, LogOut, CheckCircle2 } from 'lucide-react';

export default function BoardingPage() {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({
    show: false,
    message: '',
    type: 'info'
  });
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkingOutPet, setCheckingOutPet] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSaveCheckIn = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowModal(false);
      showToast('Check-in realizado com sucesso!', 'success');
    }, 1500);
  };

  const handleCheckOut = (petName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckingOutPet(petName);
    setTimeout(() => {
      setCheckingOutPet(null);
      showToast(`${petName} fez checkout com sucesso!`);
    }, 800);
  };

  const handleBaiaClick = (baia: string, status: string) => {
    if (status === 'livre') {
      showToast(`Baia ${baia} selecionada para novo pet.`, 'info');
    } else if (status === 'manutencao') {
      showToast(`Baia ${baia} em manutenção.`, 'info');
    } else {
      showToast(`Abrindo prontuário da Baia ${baia}...`, 'info');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl transform transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hotel & Creche</h1>
          <p className="text-gray-500 mt-1">Gerenciamento de hospedagem e creche (daycare)</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-70 disabled:cursor-wait text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Novo Check-in
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Baia Management & Cameras */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Kennel / Baia Management */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-600" />
                Mapa de Baias
              </h2>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div> Livre (8)</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div> Ocupado (4)</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div> Manutenção (1)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Baia 1 */}
              <div onClick={() => handleBaiaClick('01', 'ocupado')} className="border border-blue-100 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 01</span>
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=150&auto=format&fit=crop" alt="Dog" className="w-14 h-14 rounded-full object-cover mb-2 ring-4 ring-white shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-bold text-gray-900 text-sm">Rex</span>
                <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full mt-1">Hotelzinho</span>
              </div>

              {/* Baia 2 */}
              <div onClick={() => handleBaiaClick('02', 'livre')} className="border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 02</span>
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                   <Plus className="w-6 h-6 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-bold text-emerald-600 text-sm">Livre</span>
                <span className="text-xs text-transparent mt-1">--</span>
              </div>

              {/* Baia 3 */}
              <div onClick={() => handleBaiaClick('03', 'ocupado')} className="border border-blue-100 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 03</span>
                <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=150&auto=format&fit=crop" alt="Dog" className="w-14 h-14 rounded-full object-cover mb-2 ring-4 ring-white shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-bold text-gray-900 text-sm">Luna</span>
                <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-0.5 rounded-full mt-1">Creche</span>
              </div>
              
              {/* Baia 4 */}
               <div onClick={() => handleBaiaClick('04', 'livre')} className="border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 04</span>
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                   <Plus className="w-6 h-6 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-bold text-emerald-600 text-sm">Livre</span>
                <span className="text-xs text-transparent mt-1">--</span>
              </div>

              {/* Baia 5 */}
              <div onClick={() => handleBaiaClick('05', 'manutencao')} className="border border-amber-100 bg-gradient-to-b from-amber-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-amber-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 05</span>
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                   <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <span className="font-bold text-amber-600 text-sm">Manutenção</span>
                <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-0.5 rounded-full mt-1">Limpeza</span>
              </div>
              
               {/* Baia 6 */}
              <div onClick={() => handleBaiaClick('06', 'ocupado')} className="border border-blue-100 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 06</span>
                <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=150&auto=format&fit=crop" alt="Dog" className="w-14 h-14 rounded-full object-cover mb-2 ring-4 ring-white shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-bold text-gray-900 text-sm">Thor</span>
                <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full mt-1">Hotelzinho</span>
              </div>

               {/* Baia 7 & 8 as free */}
               <div onClick={() => handleBaiaClick('07', 'livre')} className="border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 07</span>
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                   <Plus className="w-6 h-6 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-bold text-emerald-600 text-sm">Livre</span>
                <span className="text-xs text-transparent mt-1">--</span>
              </div>
               <div onClick={() => handleBaiaClick('08', 'livre')} className="border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center relative group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-gray-400 font-medium text-xs mb-3">BAIA 08</span>
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                   <Plus className="w-6 h-6 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-bold text-emerald-600 text-sm">Livre</span>
                <span className="text-xs text-transparent mt-1">--</span>
              </div>
            </div>
          </div>

          {/* Live Cameras */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                Câmeras ao Vivo
              </h2>
              <button 
                onClick={() => showToast('Carregando todas as câmeras...', 'info')}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group cursor-pointer" onClick={() => showToast('Câmera ampliada: Pátio Principal', 'info')}>
                <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop" alt="Play area camera" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  AO VIVO
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  <div className="text-white font-medium drop-shadow-md">
                    Pátio Principal
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 text-white text-xs drop-shadow-md bg-black/40 backdrop-blur px-2 py-1 rounded-md">
                  14:20:05
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group cursor-pointer" onClick={() => showToast('Câmera ampliada: Área de Descanso', 'info')}>
                <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop" alt="Sleep area camera" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  AO VIVO
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  <div className="text-white font-medium drop-shadow-md">
                    Área de Descanso
                  </div>
                </div>
                 <div className="absolute bottom-3 right-3 text-white text-xs drop-shadow-md bg-black/40 backdrop-blur px-2 py-1 rounded-md">
                  14:20:05
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checked-in Pets & Today's Schedule */}
        <div className="space-y-8">
          
          {/* Checked-in Pets */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Pets Hospedados (4)</h2>
              <button className="text-gray-400 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 p-2 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Pet Item */}
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=150&auto=format&fit=crop" alt="Rex" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Rex</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-gray-400"/> Baia 01 • Hotelzinho</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Até 10/08</span>
                   <button 
                     onClick={(e) => handleCheckOut('Rex', e)}
                     disabled={checkingOutPet === 'Rex'}
                     className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                   >
                     {checkingOutPet === 'Rex' ? <div className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" /> : <LogOut className="w-3 h-3" />}
                     Checkout
                   </button>
                </div>
              </div>
              
              {/* Pet Item */}
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=150&auto=format&fit=crop" alt="Luna" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Luna</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-gray-400"/> Baia 03 • Creche</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[11px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Hoje 18:00</span>
                   <button 
                     onClick={(e) => handleCheckOut('Luna', e)}
                     disabled={checkingOutPet === 'Luna'}
                     className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                   >
                     {checkingOutPet === 'Luna' ? <div className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" /> : <LogOut className="w-3 h-3" />}
                     Checkout
                   </button>
                </div>
              </div>

               {/* Pet Item */}
               <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=150&auto=format&fit=crop" alt="Thor" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Thor</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-gray-400"/> Baia 06 • Hotelzinho</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Até 12/08</span>
                   <button 
                     onClick={(e) => handleCheckOut('Thor', e)}
                     disabled={checkingOutPet === 'Thor'}
                     className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                   >
                     {checkingOutPet === 'Thor' ? <div className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" /> : <LogOut className="w-3 h-3" />}
                     Checkout
                   </button>
                </div>
              </div>

               {/* Pet Item */}
               <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                <img src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=150&auto=format&fit=crop" alt="Bidu" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Bidu</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-gray-400"/> Sem Baia • Creche</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[11px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Hoje 19:30</span>
                   <button 
                     onClick={(e) => handleCheckOut('Bidu', e)}
                     disabled={checkingOutPet === 'Bidu'}
                     className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                   >
                     {checkingOutPet === 'Bidu' ? <div className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" /> : <LogOut className="w-3 h-3" />}
                     Checkout
                   </button>
                </div>
              </div>

            </div>
            
            <button 
              onClick={() => showToast('Carregando lista completa de pets...', 'info')}
              className="w-full mt-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
            >
              Ver Todos os Pets
            </button>
          </div>

          {/* Atividades */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute -top-10 -right-10 opacity-10 transform rotate-12 transition-transform duration-700 hover:rotate-45">
              <Bone className="w-48 h-48" />
            </div>
            <h2 className="text-lg font-bold mb-5 relative z-10 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximas Atividades
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">Refeição Tarde</span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full group-hover:bg-white/30 transition-colors">15:00</span>
                </div>
                <p className="text-sm text-purple-100">3 pets precisam ser alimentados. Rações específicas.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">Passeio Grupo A</span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full group-hover:bg-white/30 transition-colors">16:30</span>
                </div>
                <p className="text-sm text-purple-100">Rex, Luna e Thor. (Pátio externo)</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">Medicação - Thor</span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full group-hover:bg-white/30 transition-colors">18:00</span>
                </div>
                <p className="text-sm text-purple-100">Antialérgico (1 comprimido).</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Novo Check-in */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo Check-in</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Pet</label>
                <select className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Selecione o pet...</option>
                  <option value="rex">Rex</option>
                  <option value="luna">Luna</option>
                  <option value="thor">Thor</option>
                  <option value="bidu">Bidu</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Data de Entrada</label>
                  <input type="date" className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Previsão de Saída</label>
                  <input type="date" className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Instruções de Alimentação / Dieta</label>
                <textarea rows={3} placeholder="Descreva as instruções alimentares..." className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveCheckIn}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-70 disabled:cursor-wait text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

