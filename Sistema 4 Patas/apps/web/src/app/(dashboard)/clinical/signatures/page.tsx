"use client";
import { Input } from '@/components/ui/input';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { FileSignature, Copy, CheckCircle, Clock } from 'lucide-react';

export default function SignaturesPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Termo de Consentimento para Cirurgia');
  const [newContent, setNewContent] = useState('<p>Eu, autorizo o procedimento cirúrgico...</p><br/><br/><p>Estou ciente dos riscos.</p>');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/signatures');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      await api.post('/signatures', {
        title: newTitle,
        content: newContent,
      });
      setShowModal(false);
      fetchDocuments();
    } catch (err) {
      alert('Erro ao criar documento');
    }
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`http://localhost:3002/sign/${token}`);
    alert('Link copiado! Envie para o Tutor via WhatsApp.');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assinaturas Digitais</h1>
          <p className="text-slate-500">Gerencie termos de consentimento e assinaturas remotas dos tutores.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <FileSignature className="h-4 w-4 mr-2" />
          Gerar Novo Termo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Carregando...</p> : documents.map(doc => (
          <Card key={doc.id} className="p-6 relative">
            <div className="absolute top-4 right-4">
              {doc.status === 'SIGNED' ? (
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  <CheckCircle className="h-3 w-3 mr-1" /> ASSINADO
                </span>
              ) : (
                <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  <Clock className="h-3 w-3 mr-1" /> PENDENTE
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-800 mb-1 pr-24">{doc.title}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {new Date(doc.createdAt).toLocaleDateString('pt-BR')} Ã s {new Date(doc.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </p>

            {doc.status === 'SIGNED' ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Assinatura capturada:</p>
                <div className="bg-white border rounded p-2 flex justify-center">
                  <img src="/signatures/mock-signature.png" alt="Assinatura" className="h-16 object-contain" width={500} height={500} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">IP: {doc.ipAddress}</p>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button 
                  onClick={() => copyLink(doc.magicToken)} 
                  variant="outline" 
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copiar Link do Tutor
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Novo Termo de Consentimento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título do Documento</label>
                <Input 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Corpo do Texto (HTML permitido)</label>
                <textarea 
                  value={newContent} 
                  onChange={e => setNewContent(e.target.value)} 
                  className="w-full border p-2 rounded h-32" 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button onClick={createDocument} className="bg-blue-600 hover:bg-blue-700">Gerar Link Mágico</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
