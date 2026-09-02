"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useStore } from "@/stores/useStore";
import { 
  Stethoscope, FileText, Pill, FlaskConical, AlertTriangle, 
  Activity, Save, CheckCircle, Clock, Search, ShoppingCart, Info,
  Calculator, UploadCloud, CalendarPlus, Syringe, QrCode, ClipboardList,
  Mic, Square, Sparkles, Volume2, Download, User as UserIcon, Check,
  Calendar, MapPin, MessageCircle, Phone, Tag, Pencil, PawPrint, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, User, Plus,
  Trash2, X, PlusCircle, PackagePlus, Cake, DollarSign, History, Eye, Pin, CreditCard, RotateCw, ArrowRight
} from "lucide-react";
import { useLabStore } from "@/store/useLabStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClinicalWorkspaceClient({ 
  recordId = '', 
  initialTimeline = {}, 
  users = [],
  initialTab
}: { 
  recordId?: string, 
  initialTimeline?: any, 
  users?: any[],
  initialTab?: string
}) {
  const router = useRouter();
  
  const isExamTab = initialTab === 'exam' || initialTab === 'triagem' || initialTab === 'exame_fisico' || initialTab === 'exame-fisico';
  const [activeWidget, setActiveWidget] = useState<'anamnesis' | 'exam' | 'history' | 'diagnostic' | 'prescription' | 'labs' | 'calc' | 'docs' | 'vaccine' | 'upload' | 'return'>(
    isExamTab ? 'exam' : 'anamnesis'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') || urlParams.get('widget');
      if (tabParam === 'exam' || tabParam === 'triagem' || tabParam === 'exame_fisico' || tabParam === 'exame-fisico') {
        setActiveWidget('exam');
      }
    }
  }, []);

  const [historyFilter, setHistoryFilter] = useState<'all' | 'notes' | 'prescriptions' | 'exams' | 'vaccines'>('all');
  const [historySearch, setHistorySearch] = useState('');
  
  // Status do atendimento
  const [attendanceStatus, setAttendanceStatus] = useState<'aberto' | 'retorno' | 'pagamento_pendente' | 'pago_parcialmente' | 'atendido_totalmente'>('aberto');

  // Campos superiores centrais
  const [sector, setSector] = useState(initialTimeline?.sector || 'Consultório 1');
  const [phase, setPhase] = useState(initialTimeline?.phase || 'Em Atendimento');
  const [attendant, setAttendant] = useState(initialTimeline?.attendant || 'Dra. Jéssica');

  // Modais de Edição e Cadastro
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState(false);
  const [isEditTutorModalOpen, setIsEditTutorModalOpen] = useState(false);

  // Modais do Carrinho
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credito' | 'debito' | 'dinheiro'>('pix');

  // Abas e seções do Carrinho
  const [cartTab, setCartTab] = useState<'atual' | 'pendente' | 'orcamento' | 'historico'>('atual');
  const [servicesOpen, setServicesOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  // Itens de Serviços e Produtos no Carrinho (Fiel à imagem de referência)
  const [cartServices, setCartServices] = useState<any[]>([
    {
      id: 'srv-1',
      name: 'Consulta Domiciliar',
      patientName: initialTimeline?.patientName || 'Rock',
      quantity: 1,
      price: 150.00,
      user: 'KEVIN',
      date: '28/08 16:54',
      vet: 'Dra. Jéssica'
    }
  ]);

  const [cartProducts, setCartProducts] = useState<any[]>([
    {
      id: 'prd-1',
      name: 'Plano - Vacina Giardia',
      patientName: initialTimeline?.patientName || 'Rock',
      quantity: 1,
      price: 120.00,
      user: 'LETICIA',
      date: '28/08 12:04',
      vet: 'Dra. Jéssica',
      pinned: true
    },
    {
      id: 'prd-2',
      name: 'Plano - Vacina V10 _ Polivalent...',
      patientName: initialTimeline?.patientName || 'Rock',
      quantity: 1,
      price: 100.00,
      user: 'LETICIA',
      date: '28/08 12:05',
      vet: 'Dra. Jéssica',
      pinned: true
    }
  ]);

  // Forms dos Modais de Adicionar Serviço/Produto
  const [serviceModalForm, setServiceModalForm] = useState({ name: 'Consulta Especializada', price: 150, quantity: 1, vet: 'Dra. Jéssica' });
  const [productModalForm, setProductModalForm] = useState({ name: 'Simparic 10-20kg (1 comp)', price: 98, quantity: 1, vet: 'Dra. Jéssica' });

  // Modal para Visualizar / Trocar Comissão e Profissional Responsável (Pessoinha)
  const [editingCommissionModal, setEditingCommissionModal] = useState<{
    open: boolean;
    type: 'service' | 'product';
    id: string;
    name: string;
    vet: string;
    commissionPercent: number;
    price: number;
    quantity: number;
  }>({
    open: false,
    type: 'service',
    id: '',
    name: '',
    vet: 'Dra. Jéssica',
    commissionPercent: 20,
    price: 0,
    quantity: 1
  });

  // Modal para Editar Item (Animal, Quantidade, Valor) (Olho)
  const [editingItemModal, setEditingItemModal] = useState<{
    open: boolean;
    type: 'service' | 'product';
    id: string;
    name: string;
    patientName: string;
    quantity: number;
    price: number;
  }>({
    open: false,
    type: 'service',
    id: '',
    name: '',
    patientName: 'Rock',
    quantity: 1,
    price: 0
  });

  // Alternar produto como Insumo (Uso interno na clínica) (Alfinete)
  const toggleProductSupply = (productId: string) => {
    setCartProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.isSupply;
        showToast(nextState ? `"${p.name}" marcado como Insumo (Uso Interno).` : `"${p.name}" marcado como Venda.`);
        return { ...p, isSupply: nextState };
      }
      return p;
    }));
  };

  // Salvar troca de profissional / comissão
  const handleSaveCommission = () => {
    if (editingCommissionModal.type === 'service') {
      setCartServices(prev => prev.map(s => s.id === editingCommissionModal.id ? {
        ...s,
        vet: editingCommissionModal.vet,
        commissionPercent: editingCommissionModal.commissionPercent
      } : s));
    } else {
      setCartProducts(prev => prev.map(p => p.id === editingCommissionModal.id ? {
        ...p,
        vet: editingCommissionModal.vet,
        commissionPercent: editingCommissionModal.commissionPercent
      } : p));
    }
    setEditingCommissionModal({ ...editingCommissionModal, open: false });
    showToast(`Comissão e profissional (${editingCommissionModal.vet}) atualizados com sucesso!`, "success");
  };

  // Salvar edição rápida do item (animal, quantidade, valor)
  const handleSaveEditItem = () => {
    if (editingItemModal.type === 'service') {
      setCartServices(prev => prev.map(s => s.id === editingItemModal.id ? {
        ...s,
        patientName: editingItemModal.patientName,
        quantity: Math.max(1, editingItemModal.quantity),
        price: Math.max(0, editingItemModal.price)
      } : s));
    } else {
      setCartProducts(prev => prev.map(p => p.id === editingItemModal.id ? {
        ...p,
        patientName: editingItemModal.patientName,
        quantity: Math.max(1, editingItemModal.quantity),
        price: Math.max(0, editingItemModal.price)
      } : p));
    }
    setEditingItemModal({ ...editingItemModal, open: false });
    showToast("Item atualizado com sucesso!", "success");
  };

  // Dados do Tutor (fiel à referência d.vet)
  const [tutorData, setTutorData] = useState({
    code: initialTimeline?.tutorId ? String(initialTimeline.tutorId).slice(0, 4) : '399',
    name: initialTimeline?.tutorName || 'Jose Roberto Silva',
    type: initialTimeline?.tutorType || 'Pessoa Física',
    cpf: initialTimeline?.tutorCpf || '016.779.118-40',
    phone: initialTimeline?.tutorPhone || '(37) 99844-5527',
    secondaryPhone: '(37) 98822-1100',
    email: 'jose.roberto@email.com',
    address: initialTimeline?.tutorAddress || 'R. Marques de caravelas, 21 - Pousada Del rey - IGARAPÉ - MG',
    neighborhood: 'Pousada Del rey',
    city: 'Igarapé',
    state: 'MG',
    postalCode: '32900-000',
    tags: ''
  });

  // Dados do Pet Ativo e Pets do Tutor (fiel à referência d.vet)
  const [tutorPets, setTutorPets] = useState([
    {
      code: '486',
      name: 'Bimbo',
      isDeceased: true,
      deceasedText: 'Falecimento em 00/00/0000 as 00:00',
      weight: '8,50',
      gender: 'Macho',
      fertility: 'Fértil',
      species: 'Canina',
      breed: 'Dachshund',
      age: '7 anos',
      sector: 'Nenhum Setor',
      phase: 'Selecione um setor primeiro',
      attendant: '...',
      obsAgenda: 'Buscar para consulta no endereço: R. Marques de caravelas, 21...',
      tags: 'sem tags'
    },
    {
      code: '2520',
      name: 'Ringo',
      isDeceased: false,
      weight: '10,00',
      gender: 'Macho',
      fertility: 'Fértil',
      species: 'Canina',
      breed: 'SRD',
      age: '5 anos',
      sector: 'Exames Sangue',
      phase: 'Aguardando exames',
      attendant: 'Jéssica Goulart',
      obsAgenda: '',
      tags: 'sem tags'
    }
  ]);

  const [petData, setPetData] = useState({
    code: initialTimeline?.patientId ? String(initialTimeline.patientId).slice(0, 4) : '2520',
    name: initialTimeline?.patientName || 'Ringo',
    weight: initialTimeline?.patientWeight || '10,00',
    gender: initialTimeline?.patientGender || 'Macho',
    fertility: initialTimeline?.patientFertility || 'Fértil',
    species: initialTimeline?.patientSpecies || 'Canina',
    breed: initialTimeline?.patientBreed || 'SRD',
    birthDate: '12/04/2021',
    age: '5 anos',
    microchip: '981098102938102',
    coatColor: 'Padrão',
    tags: 'sem tags',
    allergy: ''
  });

  // Form de Novo Pet
  const [newPetForm, setNewPetForm] = useState({
    name: '',
    species: 'Canina',
    breed: 'SRD',
    gender: 'Macho',
    fertility: 'Fértil',
    birthDate: '',
    age: '',
    weight: '',
    coatColor: '',
    allergy: '',
    microchip: ''
  });

  // Estados do Modal do Carrinho & Checkout (fiel às fotos d.vet 1, 2 e 3)
  const [isFullCartModalOpen, setIsFullCartModalOpen] = useState(false);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [serviceSearchQty, setServiceSearchQty] = useState(1);
  const [costCenter, setCostCenter] = useState('Atendimento');
  const [subCenter, setSubCenter] = useState('— sem subcentro —');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchQty, setProductSearchQty] = useState(1);

  // Estados do Modal "Receitas, Exames & Termos" (Fiel à foto do usuário media_1788275272548.png)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [rxForm, setRxForm] = useState({
    description: 'Receituário, simples',
    type: 'Receita',
    model: 'Receituário, simples',
    header: 'Sim',
    usage: 'Uso Oral',
    medication: 'Amoxicilina + Clavulanato 250mg',
    shapeQty: '10 Comprimidos',
    posology: 'Dar 1 comprimido a cada 12 horas durante 7 dias',
    pharmacyType: 'Farmácia Veterinária'
  });

  const [checkoutTab, setCheckoutTab] = useState<'pagamento' | 'itens' | 'repasses'>('pagamento');
  const [selectedAttendantCheckout, setSelectedAttendantCheckout] = useState('Luiz');
  const [selectedTerminalCheckout, setSelectedTerminalCheckout] = useState('Terminal Todos');

  // Itens do Carrinho / Faturamento
  const [cartItems, setCartItems] = useState<any[]>([
    { id: 'cons-1', name: 'Consulta Clínica', type: 'service', price: 150, quantity: 1 }
  ]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  
  const [billingQueue, setBillingQueue] = useState<any[]>([]);
  const addToClinicalQueue = useStore(state => state.addToClinicalQueue);
  const { addExam, updateStatus, exams: labExams } = useLabStore();
  const [events, setEvents] = useState(initialTimeline?.events || []);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [vetId, setVetId] = useState(users?.[0]?.id || "");
  const [toast, setToast] = useState({show: false, message: '', type: 'success'});

  // --- RECURSO: GRAVADOR DE ÁUDIO COM IA (VET.AI) ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [aiTranscription, setAiTranscription] = useState<string | null>(null);
  const timerRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const displayRecordId = recordId 
    ? recordId.substring(0, 6) 
    : (initialTimeline?.recordId ? initialTimeline.recordId.substring(0, 6) : 'CLIN-01');
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  
  // Modal & Search Pet
  const [isSearchPetModalOpen, setIsSearchPetModalOpen] = useState(false);
  const [petSearchQuery, setPetSearchQuery] = useState('');

  // Forms state
  const [anamnesisData, setAnamnesisData] = useState({ title: "Anamnese e Queixa Principal", description: "" });
  const [examData, setExamData] = useState({ temperature: "", weight: "", heartRate: "", respiratoryRate: "", notes: "" });
  
  // Diagnóstico Form
  const [diagnosticForm, setDiagnosticForm] = useState({
    hypotheses: "Gastroenterite hemorrágica suspeita, Suspeita de Parvovirose",
    definitive: "Gastroenterite viral aguda"
  });

  // Vacinas Form
  const [vaccineForm, setVaccineForm] = useState({
    vaccine: "V10 Déctupla Canina",
    batch: "LOT-2026-V10",
    applyDate: "2026-08-28",
    nextDate: "2027-08-28"
  });

  // Retorno Form
  const [returnForm, setReturnForm] = useState({
    date: "2026-09-10",
    time: "14:00",
    reason: "Reavaliação clínica e checagem de exames"
  });

  // Calculadora Form
  const [calcForm, setCalcForm] = useState({
    weight: "7.8",
    dose: "10",
    concentration: "50"
  });

  // Anexos State & Widget Scrollbar Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const widgetBarRef = useRef<HTMLDivElement>(null);

  const scrollWidgetBar = (direction: 'left' | 'right') => {
    if (widgetBarRef.current) {
      widgetBarRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  const [attachmentList, setAttachmentList] = useState<any[]>([
    { id: 'att-1', name: 'Exame_Ultrassom_Abdominal.pdf', size: '2.4 MB', date: '28/08/2026' }
  ]);

  const [prescriptionItems, setPrescriptionItems] = useState([{ name: "", dose: "", route: "", frequency: "" }]);
  const [labItems, setLabItems] = useState([
    { name: "Hemograma Completo", checked: false, price: 120 },
    { name: "Perfil Renal (Ureia, Creatinina)", checked: false, price: 90 },
    { name: "Ultrassom Abdominal", checked: false, price: 250 },
  ]);

  // Lista Mock para Buscar Pet
  const mockPatientsList = [
    { code: '2316', name: 'Rock', tutor: 'Cosme Junio', tutorCode: '2227', cpf: '123.456.789-00', phone: '(31) 99271-5224', species: 'Canina', breed: 'SRD', gender: 'Macho', weight: '7,80', fertility: 'Fértil', age: '3 anos e 4 meses', allergy: 'Alérgico a Dipirona' },
    { code: '1042', name: 'Thor', tutor: 'Maria Silva', tutorCode: '1001', cpf: '987.654.321-11', phone: '(31) 98888-1122', species: 'Canina', breed: 'Golden Retriever', gender: 'Macho', weight: '28,50', fertility: 'Castrado', age: '5 anos', allergy: 'Nenhuma' },
    { code: '3091', name: 'Mel', tutor: 'João Santos', tutorCode: '2002', cpf: '456.789.123-22', phone: '(31) 97777-3344', species: 'Felina', breed: 'Siamês', gender: 'Fêmea', weight: '4,20', fertility: 'Castrado', age: '2 anos', allergy: 'Nenhuma' },
    { code: '4012', name: 'Luna', tutor: 'Ana Clara', tutorCode: '3003', cpf: '321.654.987-33', phone: '(31) 96666-5566', species: 'Canina', breed: 'Poodle', gender: 'Fêmea', weight: '5,10', fertility: 'Fértil', age: '4 anos', allergy: 'Nenhuma' }
  ];

  // --- LÓGICA DE GRAVAÇÃO DE ÁUDIO ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        processAiTranscription();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      showToast("Gravação de áudio iniciada!", "info");
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      showToast("Microfone não permitido ou indisponível.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAiTranscription = async () => {
    setIsTranscribing(true);
    showToast("Transcrevendo e organizando relato médico...", "info");

    setTimeout(() => {
      const structuredSOAP = `• RELATO DO TUTOR:\n"O tutor relatou que o paciente Thor vomitou 3 vezes pela manhã e recusa alimentação desde ontem à noite. Apresenta letargia e choro à palpação abdominal."\n\n• EXAME FÍSICO E SINAIS:\nMucosas normocoradas, desidratação leve (~5%). Sensibilidade na palpação epigástrica.\n\n• CONDUTA E RECOMENDAÇÃO MÉDICA:\nRecomenda-se solicitar Hemograma Completo + Perfil Renal e prescrever antiemético (Ondansetrona).`;
      
      setAiTranscription(structuredSOAP);
      setIsTranscribing(false);
      showToast("Transcrição do áudio concluída!", "success");
    }, 2000);
  };

  const applyAiTranscriptionToAnamnesis = () => {
    if (aiTranscription) {
      setAnamnesisData(prev => ({
        ...prev,
        description: prev.description ? `${prev.description}\n\n${aiTranscription}` : aiTranscription
      }));
      showToast("Transcrição da IA inserida na Anamnese!", "success");
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveEvent = async (type: string, title: string, description: string, metrics?: any) => {
    if (!vetId) {
      showToast("Selecione o Médico Veterinário", "error");
      return false;
    }
    setIsSaving(true);
    try {
      const res = await fetchApi(`clinical/${recordId}/events`, {
        method: "POST",
        body: JSON.stringify({ veterinarianId: vetId, type, title, description, metrics })
      });
      const newEvent = {
        id: Math.random().toString(),
        title, description, type, metrics,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' }),
        professional: users?.find((u: any) => u.id === vetId)?.email || 'Vet',
        color: type === 'NOTE' ? 'indigo' : type === 'EXAM' ? 'emerald' : 'amber'
      };
      setEvents([newEvent, ...events]);
      showToast("Salvo com sucesso!");
      return true;
    } catch (e) {
      showToast("Erro ao salvar no prontuário", "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAnamnesis = async () => {
    if (!anamnesisData.description) return;
    if (await saveEvent("NOTE", anamnesisData.title, anamnesisData.description)) setAnamnesisData({ ...anamnesisData, description: "" });
  };

  const handleSaveExam = async () => {
    const desc = `Triagem salva.\n${examData.notes}`;
    if (await saveEvent("NOTE", "Exame Físico e Triagem", desc, examData)) {
      setExamData({ temperature: "", weight: "", heartRate: "", respiratoryRate: "", notes: "" });
    }
  };

  const handleSavePrescription = async () => {
    const validItems = prescriptionItems.filter(i => i.name && i.name.trim() !== '');
    if (validItems.length === 0) {
      showToast("Adicione ao menos um medicamento com nome", "error");
      return;
    }
    let desc = "Medicamentos Prescritos:\n";
    validItems.forEach(i => desc += `- ${i.name} | Dose: ${i.dose || 'Conforme instrução'} | Freq: ${i.frequency || 'Uso contínuo'}\n`);
    
    // Tenta salvar via API backend NestJS também
    try {
      await fetchApi('/clinical/prescription', {
        method: 'POST',
        body: JSON.stringify({
          clinicalRecordId: displayRecordId,
          items: validItems,
          notes: desc
        })
      });
    } catch (e) {
      console.warn("Backend API endpoint fallback for prescription");
    }

    if (await saveEvent("PRESCRIPTION", "Receituário Médico", desc)) {
      showToast("Receita médica registrada com sucesso no prontuário!", "success");
    }
  };

  const handlePrintPrescription = () => {
    const valid = prescriptionItems.filter(i => i.name && i.name.trim() !== '');
    if (valid.length === 0) {
      showToast("Adicione ao menos um medicamento no receituário para imprimir", "error");
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Permita janelas pop-up no navegador para abrir a impressão", "error");
      return;
    }

    const itemsHtml = valid
      .map((i, idx) => `
        <div style="margin-bottom: 16px; padding: 14px 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="font-weight: 800; font-size: 15px; color: #0f172a;">${idx + 1}. ${i.name}</div>
          <div style="font-size: 13px; color: #334155; margin-top: 4px;">
            <strong>Dose/Qtd:</strong> ${i.dose || 'Conforme orientação'} &nbsp;|&nbsp; <strong>Frequência/Duração:</strong> ${i.frequency || 'Uso contínuo'}
          </div>
        </div>
      `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receituário Veterinário - ${petData.name}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 20px; }
          .logo-box { display: flex; flex-direction: column; }
          .logo-title { font-size: 32px; font-weight: 900; color: #0284c7; letter-spacing: -1px; }
          .logo-sub { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
          .clinic-info { text-align: right; }
          .clinic-title { font-size: 22px; font-weight: 900; color: #1e293b; margin: 0; }
          .clinic-sub { font-size: 12px; font-weight: 700; color: #0284c7; margin-top: 2px; }
          .clinic-phone { font-size: 12px; font-weight: 700; color: #475569; }
          .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 14px; margin-bottom: 20px; font-size: 12px; }
          .data-title { font-size: 10px; font-weight: 900; color: #475569; text-transform: uppercase; margin-bottom: 4px; }
          .doc-date { text-align: right; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 12px; }
          .doc-heading { text-align: center; font-size: 20px; font-weight: 900; color: #0284c7; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0; }
          .med-list { margin-bottom: 24px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 16px 0; }
          .med-item { margin-bottom: 12px; padding: 10px 14px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; display: flex; justify-content: space-between; }
          .signature-section { text-align: center; margin-top: 40px; margin-bottom: 24px; }
          .signature-line { width: 320px; border-top: 1px solid #475569; margin: 0 auto 6px auto; }
          .disclaimer-box { border: 1px solid #cbd5e1; background: #f8fafc; padding: 12px; border-radius: 12px; font-size: 10.5px; color: #334155; margin-top: 12px; line-height: 1.4; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-box">
            <div class="logo-title">4patas 🐾</div>
            <div class="logo-sub">saúde animal</div>
          </div>
          <div class="clinic-info">
            <div class="clinic-title">Clínica Veterinária</div>
            <div class="clinic-sub">Rua Cristiano Machado, 415, Centro, Igarapé</div>
            <div class="clinic-phone">(31)3534-4623, (31) 999320279</div>
          </div>
        </div>

        <div class="data-grid">
          <div>
            <div class="data-title">DADOS DO RESPONSÁVEL:</div>
            <div><strong>Nome:</strong> ${tutorData.name} (CPF: ${tutorData.cpf})</div>
            <div><strong>Endereço:</strong> ${tutorData.address}</div>
          </div>
          <div>
            <div class="data-title">DADOS DO PACIENTE:</div>
            <div><strong>Nome:</strong> ${petData.name} | <strong>Peso:</strong> ${petData.weight} KG | <strong>Espécie:</strong> ${petData.species}</div>
            <div><strong>Sexo:</strong> ${petData.gender} | <strong>Idade:</strong> ${petData.age} | <strong>Raça:</strong> ${petData.breed}</div>
          </div>
        </div>

        <div class="doc-date">
          Igarapé, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>

        <div class="doc-heading">Prescrição</div>

        <div class="med-list">
          ${itemsHtml}
        </div>

        <div class="signature-section">
          <div class="signature-line"></div>
          <div style="font-weight: 800; font-size: 14px;">${attendant || 'Dra. Jéssica Goulart'}, CRMV-MG</div>
        </div>

        <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 16px;">
          Retorno: DD/MM/20AA - Data sugerida, AGENDAR NA RECEPÇÃO.
        </div>

        <div class="disclaimer-box">
          • Medicações podem causar reações adversas de acordo com a resposta individual ao produto.<br/>
          • Avisar a clínica de imediato qualquer intercorrência ou piora do quadro clínico.<br/>
          • O retorno do paciente deverá ser marcado em até 30 dias corridos na recepção, após esse período será cobrado nova consulta.<br/>
          • Retorno não será cobrado, exames complementares e procedimentos serão cobrados a parte caso sejam necessários.<br/>
          • Retorno para falar sobre outro problema de saúde ou mesmo outro paciente, que não relacionado com o anterior, será cobrado uma nova consulta.
        </div>

        <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 12px;">
          Observações: Qualquer intercorrência (alterações, dúvidas, piora) avisar a clínica de imediato.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSaveDiagnosticFull = async () => {
    if (!diagnosticForm.hypotheses && !diagnosticForm.definitive) {
      showToast("Informe as hipóteses ou o diagnóstico definitivo", "error");
      return;
    }
    const desc = `Hipóteses Diagnósticas:\n${diagnosticForm.hypotheses || 'N/A'}\n\nDiagnóstico Definitivo:\n${diagnosticForm.definitive || 'A esclarecer'}`;
    if (await saveEvent("NOTE", "Diagnóstico Clínico", desc)) {
      showToast("Diagnóstico salvo no prontuário!", "success");
    }
  };

  const handleSaveVaccine = async () => {
    if (!vaccineForm.vaccine) {
      showToast("Informe a vacina", "error");
      return;
    }
    const desc = `Vacina Aplicada: ${vaccineForm.vaccine}\nLote: ${vaccineForm.batch || 'N/D'}\nData de Aplicação: ${vaccineForm.applyDate}\nPróximo Reforço: ${vaccineForm.nextDate}`;
    if (await saveEvent("VACCINE", `Vacina: ${vaccineForm.vaccine}`, desc)) {
      const now = new Date();
      const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCartProducts(prev => [
        ...prev,
        {
          id: `prd-vac-${Date.now()}`,
          name: `Vacina - ${vaccineForm.vaccine}`,
          patientName: petData.name || 'Rock',
          quantity: 1,
          price: 95.00,
          user: 'KEVIN',
          date: timeStr,
          vet: 'Dra. Jéssica'
        }
      ]);
      showToast(`Vacina "${vaccineForm.vaccine}" registrada no prontuário e adicionada ao carrinho (R$ 95,00)!`, "success");
    }
  };

  const handleSaveReturn = async () => {
    if (!returnForm.date) {
      showToast("Informe a data do retorno", "error");
      return;
    }
    const desc = `Agendamento de Retorno:\nData: ${returnForm.date} às ${returnForm.time || '14:00'}\nMotivo: ${returnForm.reason || 'Reavaliação clínica'}`;
    if (await saveEvent("NOTE", "Agendamento de Retorno", desc)) {
      setAttendanceStatus('retorno');
      showToast(`Retorno agendado para ${returnForm.date} às ${returnForm.time}! Status do atendimento: Retorno.`, "success");
    }
  };

  const handleDownloadDocument = (docTitle: string) => {
    showToast(`Gerando "${docTitle}" para impressão...`, "info");
    const content = `====================================================\nUNIVERSO 4 PATAS - CLÍNICA VETERINÁRIA\nDOCUMENTO OFICIAL / TERMO DE CONSENTIMENTO\n====================================================\n\n` +
      `Documento: ${docTitle}\n` +
      `Paciente: ${petData.name} (${petData.species}, ${petData.breed}, ${petData.weight}kg)\n` +
      `Tutor: ${tutorData.name} - CPF: ${tutorData.cpf}\n` +
      `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n` +
      `Médico Veterinário Responsável: ${attendant}\n\n` +
      `DECLARAÇÃO:\n` +
      `Por meio deste instrumento, eu, ${tutorData.name}, portador(a) do CPF ${tutorData.cpf}, na qualidade de responsável legal pelo paciente ${petData.name}, autorizo a realização dos procedimentos referentes a "${docTitle}", declarando estar ciente dos riscos e condutas descritas.\n\n` +
      `___________________________________________\n` +
      `Assinatura do Tutor (${tutorData.name})\n\n` +
      `___________________________________________\n` +
      `Assinatura do Médico Veterinário (${attendant})\n`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${petData.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('pt-BR')
      };
      setAttachmentList(prev => [newAtt, ...prev]);
      showToast(`Arquivo "${file.name}" anexado com sucesso!`, "success");
    }
  };

  const handleSelectSearchedPet = (p: any) => {
    setPetData({
      code: p.code,
      name: p.name,
      weight: p.weight,
      gender: p.gender,
      fertility: p.fertility,
      species: p.species,
      breed: p.breed,
      birthDate: '12/04/2023',
      age: p.age,
      microchip: '981098102938102',
      coatColor: 'Padrão',
      tags: 'Paciente Selecionado',
      allergy: p.allergy
    });
    setTutorData(prev => ({
      ...prev,
      code: p.tutorCode,
      name: p.tutor,
      cpf: p.cpf,
      phone: p.phone
    }));
    setIsSearchPetModalOpen(false);
    showToast(`Paciente ${p.name} (${p.tutor}) selecionado para atendimento!`, "success");
  };

  const handleSaveLabs = async () => {
    const selected = labItems.filter(i => i.checked);
    if (selected.length === 0) return;
    
    let desc = "Exames Solicitados:\n";
    const addedExamIds: string[] = [];
    
    selected.forEach(i => {
      desc += `- ${i.name}\n`;
      const id = addExam({
        patient: initialTimeline?.patientName || 'Thor',
        tutor: initialTimeline?.tutorName || 'Luciana Santos',
        exam: i.name,
        vet: users?.find((u: any) => u.id === vetId)?.email?.split('@')[0] || 'Vet',
        daysSinceConsult: 0,
      });
      addedExamIds.push(id);
    });

    if (await saveEvent("EXAM", "Solicitação de Exames", desc, { examIds: addedExamIds })) {
      setBillingQueue([...billingQueue, ...selected]);
      setLabItems(labItems.map(i => ({...i, checked: false})));
    }
  };

  const handleSimulateExamResult = async (examName: string) => {
    const desc = `Laudo do Exame: ${examName}\nResultado: Leucócitos 8.500/uL, Hemácias 6.2M/uL, Plaquetas 250.000/uL. Parâmetros dentro da normalidade. Concluso por Dra. Jéssica.`;
    if (await saveEvent("EXAM", `Laudo Recebido: ${examName}`, desc, { examStatus: 'Laudo Concluído / Sem Alterações' })) {
      showToast(`Laudo do exame "${examName}" recebido e inserido no prontuário!`, "success");
    }
  };

  const availableServices = [
    { id: 'srv-2629', code: '2629', name: 'Cir. Ablação do conduto auditivo', price: 1200.00 },
    { id: 'srv-3090', code: '3090', name: 'Cir. Cílio Ectópico', price: 230.00 },
    { id: 'srv-2796', code: '2796', name: 'Cir. Colocação de sonda Nasogastrica', price: 250.00 },
    { id: 'srv-3081', code: '3081', name: 'Cir. Conchectomia Patológica', price: 750.00 },
    { id: 'srv-2477', code: '2477', name: 'Cir. Correção de hérnia', price: 750.00 },
    { id: 'srv-2028', code: '2028', name: 'Cir. Debridamento de Córnea com Swab', price: 300.00 },
    { id: 'srv-1001', code: '1001', name: 'Consulta Domiciliar', price: 150.00 },
    { id: 'srv-1002', code: '1002', name: 'Consulta Clínica Geral', price: 150.00 },
    { id: 'srv-1003', code: '1003', name: 'Consulta Especializada', price: 220.00 },
    { id: 'srv-1004', code: '1004', name: 'Retorno Clínico', price: 0.00 },
    { id: 'srv-2104', code: '2104', name: 'Castração Macho Canino', price: 350.00 },
    { id: 'srv-2105', code: '2105', name: 'Tartarectomia (Limpeza de Tártaro)', price: 400.00 },
    { id: 'srv-1010', code: '1010', name: 'Aplicação de Medicamento Injetável', price: 35.00 },
    { id: 'srv-1011', code: '1011', name: 'Fluidoterapia / Hidratação', price: 110.00 },
    { id: 'srv-1012', code: '1012', name: 'Diária de Internação / UTI', price: 220.00 },
    { id: 'srv-6001', code: '6001', name: 'Ultrassonografia Abdominal', price: 250.00 },
    { id: 'srv-6002', code: '6002', name: 'Eletrocardiograma (ECG)', price: 180.00 },
    { id: 'srv-6003', code: '6003', name: 'Hemograma Completo', price: 120.00 }
  ];

  const availableProducts = [
    { id: 'prd-5012', code: '5012', name: 'Plano - Vacina Giardia', price: 120.00, stock: 35 },
    { id: 'prd-5010', code: '5010', name: 'Plano - Vacina V10 _ Polivalente', price: 100.00, stock: 42 },
    { id: 'prd-4001', code: '4001', name: 'Simparic 10-20kg (1 comp)', price: 98.00, stock: 14 },
    { id: 'prd-4002', code: '4002', name: 'Bravecto 4.5-10kg (1 comp)', price: 185.00, stock: 9 },
    { id: 'prd-4003', code: '4003', name: 'Ondansetrona 8mg (10 comp)', price: 32.50, stock: 22 },
    { id: 'prd-4004', code: '4004', name: 'Meloxivet 1mg Anti-inflamatório', price: 44.00, stock: 18 },
    { id: 'prd-4005', code: '4005', name: 'Otodex Solução Otológica 15ml', price: 58.00, stock: 11 },
    { id: 'prd-4006', code: '4006', name: 'Shampoo Clorexidina 200ml', price: 65.00, stock: 7 },
    { id: 'prd-4007', code: '4007', name: 'Ração Royal Canin Gastro 2kg', price: 145.00, stock: 5 },
    { id: 'prd-4008', code: '4008', name: 'Seringa Descartável 3ml com Agulha', price: 3.50, stock: 150 },
    { id: 'prd-4009', code: '4009', name: 'Gaviz V 10mg (Omeprazol Vet)', price: 48.00, stock: 16 }
  ];

  const handleAddService = () => {
    const srv = availableServices.find(s => s.id === selectedServiceId);
    if (!srv) {
      showToast("Selecione um serviço", "error");
      return;
    }
    setCartItems(prev => [...prev, {
      id: `srv-${Date.now()}`,
      name: srv.name,
      type: 'service',
      price: srv.price,
      quantity: 1
    }]);
    setSelectedServiceId('');
    showToast(`Serviço "${srv.name}" adicionado!`, "success");
  };

  const handleAddProduct = () => {
    const prd = availableProducts.find(p => p.id === selectedProductId);
    if (!prd) {
      showToast("Selecione um produto", "error");
      return;
    }
    const qty = Number(productQuantity) > 0 ? Number(productQuantity) : 1;
    setCartItems(prev => [...prev, {
      id: `prd-${Date.now()}`,
      name: prd.name,
      type: 'product',
      price: prd.price,
      quantity: qty
    }]);
    setSelectedProductId('');
    setProductQuantity(1);
    showToast(`Produto "${prd.name}" (${qty}x) adicionado!`, "success");
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
    showToast("Item removido do faturamento.");
  };

  const cartTotal = cartItems.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0);

  const handleSendToReception = () => {
    addToClinicalQueue(cartItems);
    showToast("Itens enviados para a Recepção!");
  };

  const handleFinalizeAttendance = () => {
    setAttendanceStatus('atendido_totalmente');
    showToast("Atendimento finalizado com sucesso! Status: Atendido Totalmente.", "success");
  };

  const attendanceNumber = recordId ? recordId.replace(/\D/g, '').slice(0, 4) || '4893' : '4893';
  const currentDateStr = new Date().toLocaleDateString('pt-BR');

  const statusOptions = [
    { value: 'aberto', label: 'Aberto', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    { value: 'retorno', label: 'Retorno', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    { value: 'pagamento_pendente', label: 'Pagamento Pendente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    { value: 'pago_parcialmente', label: 'Pago Parcialmente', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-500' },
    { value: 'atendido_totalmente', label: 'Atendido Totalmente', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
  ];

  const currentStatusObj = statusOptions.find(s => s.value === attendanceStatus) || statusOptions[0];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      {toast.show && (
        <div className={`absolute top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'} text-white`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
      
      {/* 1. LEFT SIDEBAR: PATIENT & TUTOR CONTEXT (VERTICAL STACK) */}
      <div className="w-[360px] bg-slate-100/70 border-r border-slate-200 flex flex-col shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-10 shrink-0 h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          
          {/* CARD 1: ATENDIMENTO & TUTOR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-3">
            {/* Header: Atendimento Tag e Data */}
            <div className="flex items-center gap-2">
              <div className="bg-[#1b6b93] text-white px-2.5 py-1 rounded-lg shadow-sm flex flex-col items-center justify-center leading-tight">
                <span className="text-[8px] font-black uppercase tracking-wider text-sky-200">Atendimento:</span>
                <span className="text-xs font-black">#{attendanceNumber}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentDateStr}</span>
              </div>
            </div>

            {/* Tutor Main Info */}
            {/* Tutor Main Info */}
            <div className="flex items-start gap-3 pt-1">
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner overflow-hidden">
                  <User className="w-7 h-7 text-white" />
                </div>
                <button 
                  onClick={() => setIsEditTutorModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors" 
                  title="Editar Ficha do Tutor"
                >
                  <Pencil className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-slate-800 leading-snug truncate">
                  [{tutorData.code}] {tutorData.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-normal">Tipo de pessoa: {tutorData.type}</p>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{tutorData.address}</span>
                </p>
              </div>
            </div>

            {/* Tutor Tags & Contatos */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Pencil className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="font-bold text-slate-600">Tags:</span>
                <span className="text-slate-400 italic text-[11px]">{tutorData.tags || 'sem tags'}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 text-slate-600 font-bold">
                  <Pencil className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Contatos:</span>
                </div>
                <a
                  href={`https://wa.me/55${tutorData.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[11px] border border-slate-200 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>{tutorData.phone}</span>
                </a>
                {tutorData.secondaryPhone && tutorData.secondaryPhone.trim() !== '' && (
                  <span 
                    title={`Telefone Secundário: ${tutorData.secondaryPhone}`}
                    className="bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-full text-[10px] border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    +1
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS: BUSCAR PET & NOVO PET */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsSearchPetModalOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600 transition-all text-xs font-bold gap-1 shadow-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Buscar Pet</span>
            </button>
            <button 
              onClick={() => setIsNewPetModalOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600 transition-all text-xs font-bold gap-1 shadow-sm"
            >
              <PawPrint className="w-4 h-4 text-slate-400" />
              <span>Novo Pet</span>
            </button>
          </div>

          {/* CARD 2: MULTI-PETS DO TUTOR (EXATAMENTE COMO NA IMAGEM DE REFERÊNCIA) */}
          <div className="space-y-3">
            {tutorPets.map((pet) => (
              <div 
                key={pet.code} 
                className={`rounded-2xl border p-3.5 shadow-sm space-y-2.5 transition-all ${
                  pet.name === petData.name 
                    ? 'bg-white border-blue-400 ring-2 ring-blue-100' 
                    : 'bg-slate-50/80 border-slate-200 opacity-90'
                }`}
              >
                {/* Header do Pet */}
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 truncate">
                    {pet.isDeceased ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        † [{pet.code}] {pet.name} - <span className="text-[10px] font-normal text-rose-500">{pet.deceasedText}</span>
                      </span>
                    ) : (
                      <span>[{pet.code}] {pet.name} , {pet.weight}Kg , {pet.age}</span>
                    )}
                  </div>
                  {pet.name === petData.name && (
                    <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Pet Ativo
                    </span>
                  )}
                </div>

                {/* Pet Avatar & Selects de Setor / Fase / Atendente */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden ${
                      pet.isDeceased ? 'bg-slate-300 text-slate-600' : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white'
                    }`}>
                      <PawPrint className="w-6 h-6 text-white" />
                    </div>
                    <button 
                      onClick={() => {
                        setPetData({
                          code: pet.code,
                          name: pet.name,
                          weight: pet.weight,
                          gender: pet.gender,
                          fertility: pet.fertility,
                          species: pet.species,
                          breed: pet.breed,
                          birthDate: '12/04/2021',
                          age: pet.age,
                          microchip: '981098102938102',
                          coatColor: 'Padrão',
                          tags: pet.tags,
                          allergy: ''
                        });
                        showToast(`Atendimento alterado para o paciente ${pet.name}!`, "info");
                      }}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors" 
                      title="Selecionar este Pet para Atendimento"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Selects internos do Card do Pet (Setor / Fase / Atendente) */}
                  <div className="flex-1 min-w-0 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-400 font-medium">Setor:</span>
                      <select 
                        defaultValue={pet.sector} 
                        className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 font-bold text-slate-800 text-[10px] outline-none"
                      >
                        <option value="Nenhum Setor">Nenhum Setor</option>
                        <option value="Exames Sangue">Exames Sangue</option>
                        <option value="Consultório 1">Consultório 1</option>
                        <option value="Internação">Internação</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-400 font-medium">Fase:</span>
                      <select 
                        defaultValue={pet.phase} 
                        className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 font-bold text-slate-800 text-[10px] outline-none"
                      >
                        <option value="Selecione um setor primeiro">Selecione um setor primeiro</option>
                        <option value="Aguardando exames">Aguardando exames</option>
                        <option value="Em Atendimento">Em Atendimento</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-400 font-medium">Atendente:</span>
                      <select 
                        defaultValue={pet.attendant} 
                        className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 font-bold text-slate-800 text-[10px] outline-none"
                      >
                        <option value="...">...</option>
                        <option value="Jéssica Goulart">Jéssica Goulart</option>
                        <option value="Dr. Nogueira">Dr. Nogueira</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer do Pet Card: Sexo, Raça, Obs Agenda */}
                <div className="pt-1.5 border-t border-slate-100 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-600">
                    {pet.gender}, {pet.fertility} - {pet.species}, {pet.breed}
                  </p>
                  {pet.obsAgenda && (
                    <p className="text-[10px] text-blue-600 bg-blue-50/70 p-1.5 rounded-lg border border-blue-100 font-medium">
                      Obs. Agenda: {pet.obsAgenda}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 italic">
                    ✏️ {pet.tags}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* LINHA DO TEMPO */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
              Linha do Tempo
            </h3>
            
            <div className="space-y-2.5">
              {events.length === 0 ? (
                <p className="text-xs text-slate-400 italic px-1">Nenhum evento registrado ainda.</p>
              ) : (
                events.map((event: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0 shadow-sm mt-0.5" title={event.title}>
                      {event.type === 'NOTE' ? <FileText className="w-3 h-3" /> : event.type === 'EXAM' ? <FlaskConical className="w-3 h-3" /> : <Pill className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 p-2 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm">
                      <h4 className="font-bold text-slate-900 text-xs">{event.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{event.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. CENTER: WORKSPACE CLÍNICO COM CABEÇALHO SUPERIOR (VETERINÁRIO, SETOR, FASE, ATENDENTE) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* TOPO SUPERIOR CENTRAL COM CAMPOS DE CONTROLE */}
        <div className="h-auto min-h-16 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between px-6 py-3 gap-3 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Veterinário */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="text-xs font-black text-slate-600 uppercase">Vet:</span>
              <select 
                className="text-xs font-black text-indigo-700 bg-transparent outline-none cursor-pointer"
                value={vetId} 
                onChange={e => setVetId(e.target.value)}
              >
                <option value="vet-1">Dra. Jéssica</option>
                <option value="vet-2">Dr. Nogueira</option>
              </select>
            </div>

            {/* Setor */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-black text-slate-600 uppercase">Setor:</span>
              <select 
                className="text-xs font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                value={sector} 
                onChange={e => setSector(e.target.value)}
              >
                <option value="Consultório 1">Consultório 1</option>
                <option value="Consultório 2">Consultório 2</option>
                <option value="Triagem">Triagem</option>
                <option value="Internação / UTI">Internação / UTI</option>
                <option value="Centro Cirúrgico">Centro Cirúrgico</option>
                <option value="Emergência">Emergência</option>
                <option value="Nenhum Setor">Nenhum Setor</option>
              </select>
            </div>

            {/* Fase */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-black text-slate-600 uppercase">Fase:</span>
              <select 
                className="text-xs font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                value={phase} 
                onChange={e => setPhase(e.target.value)}
              >
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Em Consulta">Em Consulta</option>
                <option value="Em Triagem">Em Triagem</option>
                <option value="Aguardando Exames">Aguardando Exames</option>
                <option value="Em Procedimento">Em Procedimento</option>
                <option value="Pós-Consulta">Pós-Consulta</option>
              </select>
            </div>

            {/* Status do Atendimento — ao lado de Fase */}
            <div className="relative">
              <select 
                value={attendanceStatus} 
                onChange={(e: any) => setAttendanceStatus(e.target.value)}
                className={`text-[11px] font-black rounded-xl px-3 py-2 border-2 outline-none cursor-pointer shadow-sm transition-all pr-7 appearance-none ${currentStatusObj.bg} ${currentStatusObj.text} ${currentStatusObj.border}`}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-white text-slate-800 font-bold">
                    ● {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
            </div>

            {/* Atendente */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-black text-slate-600 uppercase">Atendente:</span>
              <select 
                className="text-xs font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                value={attendant} 
                onChange={e => setAttendant(e.target.value)}
              >
                <option value="Dra. Jéssica">Dra. Jéssica</option>
                <option value="Dr. Nogueira">Dr. Nogueira</option>
                <option value="Ana Paula (Recepção)">Ana Paula (Recepção)</option>
                <option value="Carlos Mendes (Auxiliar)">Carlos Mendes (Auxiliar)</option>
                <option value="Kevin (Recepção)">Kevin (Recepção)</option>
                <option value="Letícia (Recepção)">Letícia (Recepção)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* PAINEL VET.AI & GRAVADOR DE ÁUDIO COM TUTOR (INTEGRADO AO PRONTUÁRIO) */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-indigo-200 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-lg flex items-center gap-2">
                    Transcritor & Ditado de Consulta 🎙️
                  </h3>
                  <p className="text-xs text-indigo-200">Grave a conversa com o tutor para transcrição automática no prontuário médico</p>
                </div>
              </div>

              {/* Botão de Gravação de Áudio */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <Mic className="w-4 h-4" /> Gravar Consulta com Tutor
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all animate-pulse text-sm"
                >
                  <Square className="w-4 h-4" /> Parar Gravação ({formatTime(recordingSeconds)})
                </button>
              )}
            </div>

            {/* Status da Gravação e Player de Áudio Salvo */}
            {audioUrl && (
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-emerald-300" />
                  <div>
                    <p className="text-xs font-bold text-indigo-100">Áudio Gravado da Consulta (.webm)</p>
                    <audio controls src={audioUrl} className="h-8 mt-1 rounded-lg" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={audioUrl} download="consulta-tutor.webm" className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                    <Download className="w-4 h-4" /> Baixar Áudio
                  </a>
                  {aiTranscription && (
                    <button onClick={applyAiTranscriptionToAnamnesis} className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                      <Mic className="w-4 h-4" /> Inserir Transcrição do Áudio
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Resultado da Transcrição Estruturada */}
            {isTranscribing && (
              <div className="p-4 bg-indigo-950/60 rounded-2xl border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center gap-3">
                <Activity className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Processando voz do tutor e estruturando prontuário médico...</span>
              </div>
            )}

            {aiTranscription && (
              <div className="p-4 bg-indigo-950/70 rounded-2xl border border-indigo-400/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Transcrição Estruturada do Áudio
                  </span>
                  <button onClick={applyAiTranscriptionToAnamnesis} className="text-xs text-indigo-200 underline hover:text-white">
                    Inserir na Anamnese
                  </button>
                </div>
                <pre className="text-xs font-sans text-indigo-100 whitespace-pre-wrap leading-relaxed">
                  {aiTranscription}
                </pre>
              </div>
            )}
          </div>

          {/* Menu de Widgets com botões de navegação (◄ ►) */}
          <div className="relative flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 gap-1">
            <button 
              onClick={() => scrollWidgetBar('left')}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 border border-slate-200 bg-slate-50"
              title="Anterior (Rolar Esquerda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div ref={widgetBarRef} className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth px-1 flex-1 py-0.5">
              <WidgetBtn active={activeWidget === 'anamnesis'} onClick={() => setActiveWidget('anamnesis')} icon={<Info className="w-4 h-4"/>} label="Anamnese" />
              <WidgetBtn active={activeWidget === 'exam'} onClick={() => setActiveWidget('exam')} icon={<Stethoscope className="w-4 h-4"/>} label="Exame Físico" />
              <WidgetBtn active={activeWidget === 'history'} onClick={() => setActiveWidget('history')} icon={<Clock className="w-4 h-4"/>} label="Histórico do Paciente" />
              <WidgetBtn active={activeWidget === 'diagnostic'} onClick={() => setActiveWidget('diagnostic')} icon={<ClipboardList className="w-4 h-4"/>} label="Diagnóstico" />
              <WidgetBtn active={activeWidget === 'prescription'} onClick={() => setActiveWidget('prescription')} icon={<Pill className="w-4 h-4"/>} label="Receituário" />
              <WidgetBtn active={activeWidget === 'labs'} onClick={() => setActiveWidget('labs')} icon={<FlaskConical className="w-4 h-4"/>} label="Exames" />
              <div className="w-px bg-slate-200 my-1 mx-1 shrink-0"></div>
              <WidgetBtn active={activeWidget === 'calc'} onClick={() => setActiveWidget('calc')} icon={<Calculator className="w-4 h-4"/>} label="Calculadora" />
              <WidgetBtn active={activeWidget === 'docs'} onClick={() => setActiveWidget('docs')} icon={<FileText className="w-4 h-4"/>} label="Termos" />
              <WidgetBtn active={activeWidget === 'vaccine'} onClick={() => setActiveWidget('vaccine')} icon={<Syringe className="w-4 h-4"/>} label="Vacina" />
              <WidgetBtn active={activeWidget === 'upload'} onClick={() => setActiveWidget('upload')} icon={<UploadCloud className="w-4 h-4"/>} label="Anexos" />
              <WidgetBtn active={activeWidget === 'return'} onClick={() => setActiveWidget('return')} icon={<CalendarPlus className="w-4 h-4"/>} label="Retorno" />
            </div>

            <button 
              onClick={() => scrollWidgetBar('right')}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 border border-slate-200 bg-slate-50"
              title="Próximo (Rolar Direita)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ÁREA DE PREENCHIMENTO DO WIDGET */}
          <div className="max-w-4xl">
            {activeWidget === 'anamnesis' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800">Anamnese e Queixa Principal</h3>
                  {aiTranscription && (
                    <button onClick={applyAiTranscriptionToAnamnesis} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Inserir Transcrição do Áudio
                    </button>
                  )}
                </div>
                <div className="p-8">
                  <textarea 
                    value={anamnesisData.description}
                    onChange={e => setAnamnesisData({...anamnesisData, description: e.target.value})}
                    placeholder="Descreva o histórico, queixa principal, sintomas relatados pelo tutor ou use a gravação de áudio..."
                    className="w-full h-64 border-2 border-slate-300 rounded-2xl p-5 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 font-semibold placeholder:text-slate-400 resize-none shadow-sm text-sm"
                  />
                  <div className="mt-6 flex justify-end">
                    <Button disabled={isSaving} onClick={handleSaveAnamnesis} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Salvar Anamnese
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeWidget === 'exam' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-800">Triagem e Sinais Vitais</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-2">Peso (kg)</label>
                      <Input 
                        type="number" 
                        value={examData.weight} 
                        onChange={e=>setExamData({...examData, weight: e.target.value})} 
                        className="w-full border-2 border-slate-300 rounded-xl p-3 bg-white outline-none font-bold text-slate-900 focus:border-indigo-600 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-2">Temp (°C)</label>
                      <Input 
                        type="number" 
                        value={examData.temperature} 
                        onChange={e=>setExamData({...examData, temperature: e.target.value})} 
                        className={`w-full border-2 rounded-xl p-3 bg-white outline-none font-bold shadow-sm ${Number(examData.temperature) > 39.5 ? 'border-red-400 text-red-700 focus:border-red-600' : 'border-slate-300 text-slate-900 focus:border-indigo-600'}`} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-2">FC (bpm)</label>
                      <Input 
                        type="number" 
                        value={examData.heartRate} 
                        onChange={e=>setExamData({...examData, heartRate: e.target.value})} 
                        className="w-full border-2 border-slate-300 rounded-xl p-3 bg-white outline-none font-bold text-slate-900 focus:border-indigo-600 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-2">FR (mpm)</label>
                      <Input 
                        type="number" 
                        value={examData.respiratoryRate} 
                        onChange={e=>setExamData({...examData, respiratoryRate: e.target.value})} 
                        className="w-full border-2 border-slate-300 rounded-xl p-3 bg-white outline-none font-bold text-slate-900 focus:border-indigo-600 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">Achados Físicos & Inspeção</label>
                    <textarea 
                      value={examData.notes} 
                      onChange={e => setExamData({...examData, notes: e.target.value})} 
                      placeholder="Descreva inspeção, palpação, ausculta cardíaca/pulmonar, mucosas, etc..."
                      className="w-full h-32 border-2 border-slate-300 rounded-2xl p-4 bg-white outline-none text-slate-900 font-semibold placeholder:text-slate-400 resize-none shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" 
                    />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button disabled={isSaving} onClick={handleSaveExam} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Salvar Exame Físico
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET: HISTÓRICO DO PACIENTE */}
            {activeWidget === 'history' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      Histórico do Paciente ({petData.name})
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Consultas anteriores, exames, vacinas e prescrições registradas no prontuário
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Buscar no histórico..." 
                        value={historySearch}
                        onChange={e => setHistorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white border-2 border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Filtros por tipo */}
                <div className="px-8 py-3 bg-slate-50/30 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
                  <button 
                    onClick={() => setHistoryFilter('all')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${historyFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('notes')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${historyFilter === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    Consultas & Anamneses
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('prescriptions')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${historyFilter === 'prescriptions' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    Receituários
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('exams')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${historyFilter === 'exams' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    Exames & Laudos
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('vaccines')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${historyFilter === 'vaccines' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    Vacinas
                  </button>
                </div>

                {/* Lista de Registros Clínicos */}
                <div className="p-8 space-y-4 max-h-[550px] overflow-y-auto">
                  {[
                    ...events,
                    {
                      id: 'h-1',
                      date: '14/05/2026',
                      time: '10:30',
                      type: 'NOTE',
                      title: 'Consulta de Rotina & Vacinação Anual',
                      description: 'Paciente ativo, alerta e sem queixas gastrointestinais. Mucosas coradas, TRC < 2s. Administrada vacina V10 (Déctupla) e Antirrábica.',
                      professional: 'Dr. Nogueira (CRMV-SP 45120)',
                      metrics: { weight: '7.8kg', temperature: '38.4°C', heartRate: '110 bpm' }
                    },
                    {
                      id: 'h-2',
                      date: '20/01/2026',
                      time: '15:45',
                      type: 'EXAM',
                      title: 'Hemograma Completo + Perfil Hepático',
                      description: 'Coleta sanguínea realizada sem intercorrências. Leucograma dentro dos padrões da espécie. ALT e FA normais.',
                      professional: 'Dra. Jéssica (CRMV-SP 52180)',
                      metrics: { examStatus: 'Laudo Concluído / Sem Alterações' }
                    },
                    {
                      id: 'h-3',
                      date: '10/11/2025',
                      time: '09:15',
                      type: 'PRESCRIPTION',
                      title: 'Tratamento de Otite Externa Bilateral',
                      description: 'Prescrito Otosyl gotas (4 gotas em cada conduto a cada 12h por 7 dias) e limpeza prévia com solução ceruminolítica.',
                      professional: 'Dr. Nogueira (CRMV-SP 45120)',
                      metrics: {}
                    },
                    {
                      id: 'h-4',
                      date: '15/08/2025',
                      time: '14:20',
                      type: 'VACCINE',
                      title: 'Aplicação de Vacina Giardíase (1ª Dose)',
                      description: 'Imunização preventiva contra Giárdia. Lote: GIA-2025-99. Sem reações adversas pós-vacinais imediatas.',
                      professional: 'Dra. Jéssica (CRMV-SP 52180)',
                      metrics: {}
                    }
                  ]
                    .filter((item: any) => {
                      const matchesSearch = !historySearch || 
                        item.title?.toLowerCase().includes(historySearch.toLowerCase()) || 
                        item.description?.toLowerCase().includes(historySearch.toLowerCase()) ||
                        item.professional?.toLowerCase().includes(historySearch.toLowerCase());
                      if (!matchesSearch) return false;
                      if (historyFilter === 'notes') return item.type === 'NOTE';
                      if (historyFilter === 'prescriptions') return item.type === 'PRESCRIPTION';
                      if (historyFilter === 'exams') return item.type === 'EXAM';
                      if (historyFilter === 'vaccines') return item.type === 'VACCINE';
                      return true;
                    })
                    .map((item: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${
                              item.type === 'NOTE' ? 'bg-indigo-100 text-indigo-700' :
                              item.type === 'EXAM' ? 'bg-emerald-100 text-emerald-700' :
                              item.type === 'PRESCRIPTION' ? 'bg-amber-100 text-amber-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {item.type === 'NOTE' ? <FileText className="w-5 h-5" /> :
                               item.type === 'EXAM' ? <FlaskConical className="w-5 h-5" /> :
                               item.type === 'PRESCRIPTION' ? <Pill className="w-5 h-5" /> :
                               <Syringe className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                <span>📅 {item.date || 'Hoje'} às {item.time}</span>
                                <span>•</span>
                                <span className="font-semibold text-indigo-600">{item.professional}</span>
                              </p>
                            </div>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            item.type === 'NOTE' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            item.type === 'EXAM' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            item.type === 'PRESCRIPTION' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}>
                            {item.type === 'NOTE' ? 'Consulta' : item.type === 'EXAM' ? 'Exame' : item.type === 'PRESCRIPTION' ? 'Receita' : 'Vacina'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                          {item.description}
                        </p>

                        {item.metrics && Object.keys(item.metrics).length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            {item.metrics.weight && (
                              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                ⚖️ Peso: {item.metrics.weight}
                              </span>
                            )}
                            {item.metrics.temperature && (
                              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                🌡️ Temp: {item.metrics.temperature}
                              </span>
                            )}
                            {item.metrics.heartRate && (
                              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                ❤️ FC: {item.metrics.heartRate}
                              </span>
                            )}
                            {item.metrics.examStatus && (
                              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                                ✓ {item.metrics.examStatus}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* WIDGET: DIAGNÓSTICO */}
            {activeWidget === 'diagnostic' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-purple-50/30">
                  <h3 className="text-lg font-black text-purple-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-600" /> Hipóteses e Diagnóstico Clínico
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">Hipóteses Diagnósticas (Diferenciais)</label>
                    <textarea 
                      value={diagnosticForm.hypotheses}
                      onChange={e => setDiagnosticForm({ ...diagnosticForm, hypotheses: e.target.value })}
                      placeholder="Descreva as principais suspeitas e diagnósticos diferenciais..."
                      className="w-full h-32 border-2 border-slate-300 rounded-2xl p-4 bg-white outline-none font-semibold text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">Diagnóstico Definitivo / Conclusão</label>
                    <Input 
                      value={diagnosticForm.definitive}
                      onChange={e => setDiagnosticForm({ ...diagnosticForm, definitive: e.target.value })}
                      placeholder="Ex: Gastroenterite viral leve, Otite fúngica, etc."
                      className="w-full border-2 border-slate-300 rounded-xl p-3 bg-white outline-none font-bold text-slate-900 focus:border-purple-600 shadow-sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveDiagnosticFull} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      <Save className="w-5 h-5" /> Salvar Diagnóstico
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeWidget === 'prescription' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-amber-50/30">
                  <h3 className="text-lg font-black text-amber-900 flex items-center gap-2"><Pill className="w-5 h-5 text-amber-600" /> Receituário Dinâmico</h3>
                </div>
                <div className="p-8">
                  <div className="space-y-4 mb-6">
                    {prescriptionItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex-1">
                          <label className="block text-xs font-black text-slate-700 uppercase mb-1">Medicamento</label>
                          <Input 
                            type="text" 
                            className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-amber-500 shadow-sm" 
                            value={item.name} 
                            onChange={e => { const newI = [...prescriptionItems]; newI[idx].name = e.target.value; setPrescriptionItems(newI); }} 
                            placeholder="Ex: Amoxicilina + Clavulanato 250mg"
                          />
                        </div>
                        <div className="w-36">
                          <label className="block text-xs font-black text-slate-700 uppercase mb-1">Dose / Qtd</label>
                          <Input 
                            type="text" 
                            className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-amber-500 shadow-sm" 
                            value={item.dose} 
                            onChange={e => { const newI = [...prescriptionItems]; newI[idx].dose = e.target.value; setPrescriptionItems(newI); }} 
                            placeholder="1 comprimido"
                          />
                        </div>
                        <div className="w-48">
                          <label className="block text-xs font-black text-slate-700 uppercase mb-1">Frequência / Duração</label>
                          <Input 
                            type="text" 
                            className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-amber-500 shadow-sm" 
                            value={item.frequency} 
                            onChange={e => { const newI = [...prescriptionItems]; newI[idx].frequency = e.target.value; setPrescriptionItems(newI); }} 
                            placeholder="A cada 12h por 7 dias"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                    <Button onClick={handlePrintPrescription} className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-5 py-3 rounded-xl flex items-center gap-2 text-xs shadow-sm">
                      <FileText className="w-4 h-4 text-amber-600" /> Imprimir Receituário (PDF)
                    </Button>
                    <Button disabled={isSaving} onClick={handleSavePrescription} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      Salvar Receita
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeWidget === 'labs' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-emerald-50/30 flex justify-between items-center">
                  <h3 className="text-lg font-black text-emerald-900 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-emerald-600" /> Solicitação de Exames</h3>
                  <button 
                    onClick={() => {
                      const selected = labItems.filter(i => i.checked).map(i => i.name);
                      const examName = selected.length > 0 ? selected.join(", ") : "Hemograma Completo";
                      handleSimulateExamResult(examName);
                    }}
                    className="text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                  >
                    ⚡ Simular Laudo de Exame Concluído
                  </button>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {labItems.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition-colors shadow-sm">
                        <input type="checkbox" checked={item.checked} onChange={() => {
                          const newLabs = [...labItems];
                          newLabs[idx].checked = !newLabs[idx].checked;
                          setLabItems(newLabs);
                        }} className="w-5 h-5 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500" />
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <Button disabled={isSaving} onClick={handleSaveLabs} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Solicitar Exames
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET: VACINAS */}
            {activeWidget === 'vaccine' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-purple-50/30">
                  <h3 className="text-lg font-black text-purple-900 flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-purple-600" /> Aplicação e Controle de Vacinas
                  </h3>
                </div>
                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Vacina</label>
                      <select 
                        value={vaccineForm.vaccine}
                        onChange={e => setVaccineForm({ ...vaccineForm, vaccine: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-purple-600 shadow-sm"
                      >
                        <option value="V10 Déctupla Canina">V10 Déctupla Canina</option>
                        <option value="Antirrábica">Antirrábica</option>
                        <option value="Giardíase">Giardíase</option>
                        <option value="Gripe Canina / Tosse dos Canis">Gripe Canina / Tosse dos Canis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Lote</label>
                      <Input 
                        value={vaccineForm.batch}
                        onChange={e => setVaccineForm({ ...vaccineForm, batch: e.target.value })}
                        placeholder="Ex: LOT-2026-V10" 
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-purple-600 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Data da Aplicação</label>
                      <Input 
                        type="date" 
                        value={vaccineForm.applyDate}
                        onChange={e => setVaccineForm({ ...vaccineForm, applyDate: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-purple-600 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Próximo Reforço</label>
                      <Input 
                        type="date" 
                        value={vaccineForm.nextDate}
                        onChange={e => setVaccineForm({ ...vaccineForm, nextDate: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-purple-600 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveVaccine} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      <Save className="w-5 h-5" /> Registrar Vacina
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET: RETORNO */}
            {activeWidget === 'return' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-sky-50/30">
                  <h3 className="text-lg font-black text-sky-900 flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-sky-600" /> Agendamento de Retorno
                  </h3>
                </div>
                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Data do Retorno</label>
                      <Input 
                        type="date" 
                        value={returnForm.date}
                        onChange={e => setReturnForm({ ...returnForm, date: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-sky-600 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Horário</label>
                      <Input 
                        type="time" 
                        value={returnForm.time}
                        onChange={e => setReturnForm({ ...returnForm, time: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 focus:border-sky-600 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Motivo do Retorno</label>
                    <textarea 
                      value={returnForm.reason}
                      onChange={e => setReturnForm({ ...returnForm, reason: e.target.value })}
                      placeholder="Ex: Reavaliação de pós-operatório, checagem de ferida cirúrgica, reexame de sangue..." 
                      className="w-full h-24 border-2 border-slate-300 rounded-xl p-3 bg-white outline-none font-semibold text-slate-900 placeholder:text-slate-400 focus:border-sky-600 shadow-sm" 
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSaveReturn} className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
                      <Calendar className="w-5 h-5" /> Confirmar Retorno
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET: CALCULADORA */}
            {activeWidget === 'calc' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" /> Calculadora de Doses & Fluidoterapia
                  </h3>
                </div>
                <div className="p-8 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Peso do Animal (kg)</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={calcForm.weight} 
                        onChange={e => setCalcForm({ ...calcForm, weight: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Dose Recomendada (mg/kg)</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={calcForm.dose} 
                        onChange={e => setCalcForm({ ...calcForm, dose: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Concentração (mg/ml ou mg/comp)</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={calcForm.concentration} 
                        onChange={e => setCalcForm({ ...calcForm, concentration: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white outline-none font-bold text-slate-900 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex justify-between items-center">
                    <span className="font-extrabold text-indigo-900 text-sm">Volume / Dose Calculada:</span>
                    <span className="text-xl font-black text-indigo-700">
                      {(() => {
                        const w = parseFloat(calcForm.weight) || 0;
                        const d = parseFloat(calcForm.dose) || 0;
                        const c = parseFloat(calcForm.concentration) || 1;
                        if (c === 0) return '0,00 ml';
                        return ((w * d) / c).toFixed(2).replace('.', ',');
                      })()} ml (ou comp)
                    </span>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button 
                      onClick={() => {
                        const w = parseFloat(calcForm.weight) || 0;
                        const d = parseFloat(calcForm.dose) || 0;
                        const c = parseFloat(calcForm.concentration) || 1;
                        const res = c > 0 ? ((w * d) / c).toFixed(2).replace('.', ',') : '0';
                        setPrescriptionItems(prev => [
                          ...prev,
                          { name: 'Medicamento Calculado', dose: `${res} ml`, route: 'ORAL', frequency: 'A cada 12h' }
                        ]);
                        showToast(`Dose de ${res} ml inserida no Receituário!`, "success");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                    >
                      + Inserir Dose no Receituário
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET: TERMOS */}
            {activeWidget === 'docs' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" /> Termos de Consentimento & Documentos
                  </h3>
                </div>
                <div className="p-8 space-y-3">
                  {['Termo de Consentimento para Anestesia Geral e Cirurgia', 'Termo de Responsabilidade e Internação', 'Termo de Eutanásia e Destinação de Cadáver', 'Termo de Retirada sem Alta Médica'].map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-sm">
                      <span className="font-bold text-slate-800 text-sm">{doc}</span>
                      <Button onClick={() => handleDownloadDocument(doc)} className="bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs px-4 py-2 rounded-xl">
                        Imprimir / Assinar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WIDGET: ANEXOS */}
            {activeWidget === 'upload' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-600" /> Anexos, Imagens e PDFs
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleUploadFile} 
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-3xl p-10 hover:border-indigo-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center gap-3 cursor-pointer"
                  >
                    <UploadCloud className="w-10 h-10 text-indigo-500" />
                    <p className="font-bold text-slate-700 text-sm">Clique aqui ou arraste laudos e imagens do paciente</p>
                    <p className="text-xs text-slate-400 font-medium">Arquivos aceitos: PDF, JPG, PNG (máx. 25MB)</p>
                    <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md mt-2 pointer-events-none">
                      Selecionar Arquivo
                    </Button>
                  </div>

                  {/* Lista de Anexos */}
                  <div className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">Arquivos Anexados ({attachmentList.length})</h4>
                    <div className="space-y-2">
                      {attachmentList.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="font-bold text-sm text-slate-800">{att.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{att.size} · Anexado em {att.date}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDownloadDocument(att.name)}
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl text-xs font-bold"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" /> Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. FAR RIGHT SIDEBAR: FATURAMENTO / CARRINHO FIEL AO DESIGN DE REFERÊNCIA */}
      <div className="w-[440px] bg-slate-50 border-l border-slate-200 flex flex-col shadow-[-2px_0_15px_rgba(0,0,0,0.03)] z-10 shrink-0 h-full overflow-hidden">
        {/* TOP 4 SUMMARY CARDS (ATUAL, PGTO. PENDENTE, ORÇAMENTO, HISTÓRICO) */}
        <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-white border-b border-slate-200 shrink-0">
          {/* Card 1: Atual */}
          <button 
            onClick={() => {
              setCartTab('atual');
              setIsFullCartModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
              cartTab === 'atual'
                ? 'border-blue-500 bg-blue-50/50 shadow-sm text-blue-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Atual</span>
            </div>
            <span className="text-xs font-black text-blue-600 mt-1">
              {(cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0) + cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)).toFixed(2).replace('.', ',')}
            </span>
          </button>

          {/* Card 2: Pgto. Pendente */}
          <button 
            onClick={() => {
              setCartTab('pendente');
              setIsFullCartModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
              cartTab === 'pendente'
                ? 'border-red-400 bg-red-50/50 shadow-sm text-red-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
              <RotateCw className="w-3 h-3 text-rose-500" />
              <span className="truncate">Pgto. Pendente</span>
            </div>
            <span className="text-xs font-black text-rose-600 bg-red-50 px-2 py-0.5 rounded-full mt-1">
              130,00
            </span>
          </button>

          {/* Card 3: Orçamento */}
          <button 
            onClick={() => {
              setCartTab('orcamento');
              setIsFullCartModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
              cartTab === 'orcamento'
                ? 'border-amber-400 bg-amber-50/50 shadow-sm text-amber-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
              <DollarSign className="w-3 h-3 text-amber-500" />
              <span>Orçamento</span>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
              0,00
            </span>
          </button>

          {/* Card 4: Histórico */}
          <button 
            onClick={() => {
              setCartTab('historico');
              setIsFullCartModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
              cartTab === 'historico'
                ? 'border-slate-400 bg-slate-100 shadow-sm text-slate-800'
                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
              <History className="w-3 h-3 text-slate-500" />
              <span>Histórico</span>
            </div>
            <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
              1.466,39
            </span>
          </button>
        </div>

        {/* LISTA PRINCIPAL DO CARRINHO */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f8fafc]">
          
          {/* SEÇÃO 1: SERVIÇOS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header da Seção Serviços */}
            <div className="p-3 bg-white flex items-center justify-between border-b border-slate-100">
              <button 
                onClick={() => setServicesOpen(!servicesOpen)} 
                className="flex items-center gap-1.5 text-sky-700 font-extrabold text-sm hover:text-sky-800 transition-colors"
              >
                {servicesOpen ? <ChevronDown className="w-4 h-4 text-sky-600" /> : <ChevronUp className="w-4 h-4 text-sky-600" />}
                <span>Serviços</span>
              </button>

              <button 
                onClick={() => {
                  setCartTab('atual');
                  setIsFullCartModalOpen(true);
                }}
                className="bg-[#48a9a6] hover:bg-[#3b8f8d] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Incluir Serviço
              </button>
            </div>

            {/* Itens de Serviços */}
            {servicesOpen && (
              <div className="divide-y divide-slate-100">
                {cartServices.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400 font-medium">Nenhum serviço incluído</p>
                ) : (
                  cartServices.map((srv, idx) => (
                    <div key={srv.id} className="p-3.5 space-y-2 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-800 leading-snug">{srv.name}</h4>
                        <span className="text-xs font-bold text-sky-600">{srv.patientName || petData.name || 'Rock'}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="1"
                            value={srv.quantity}
                            onChange={(e) => {
                              const q = Math.max(1, parseInt(e.target.value) || 1);
                              const updated = [...cartServices];
                              updated[idx].quantity = q;
                              setCartServices(updated);
                            }}
                            className="w-12 h-7 border border-slate-300 rounded-md text-center text-xs font-bold text-slate-800 bg-white shadow-inner outline-none focus:border-sky-500"
                          />
                          <span className="text-xs font-bold text-slate-500">x {srv.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <span className="font-black text-sm text-slate-800">
                          R$ {(srv.price * srv.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Ações: User (comissão), Olho azul (editar), Lixeira vermelha */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setEditingCommissionModal({
                            open: true,
                            type: 'service',
                            id: srv.id,
                            name: srv.name,
                            vet: srv.vet || 'Dra. Jéssica',
                            commissionPercent: srv.commissionPercent || 20,
                            price: srv.price,
                            quantity: srv.quantity
                          })}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                          title="Visualizar / Alterar comissão e profissional responsável"
                        >
                          <User className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setEditingItemModal({
                            open: true,
                            type: 'service',
                            id: srv.id,
                            name: srv.name,
                            patientName: srv.patientName || petData.name || 'Rock',
                            quantity: srv.quantity,
                            price: srv.price
                          })}
                          className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Editar serviço (Animal, quantidade, valor)"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => {
                            setCartServices(cartServices.filter((_, i) => i !== idx));
                            showToast("Serviço removido");
                          }}
                          className="w-6 h-6 rounded bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Remover serviço"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Footer do item com Data e Profissional */}
                      <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 border-t border-slate-50">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{srv.date || '28/08 16:54'} · {srv.user || 'KEVIN'}</span>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          <span>{srv.vet || 'Dra. Jéssica'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SEÇÃO 2: PRODUTOS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header da Seção Produtos */}
            <div className="p-3 bg-white flex items-center justify-between border-b border-slate-100">
              <button 
                onClick={() => setProductsOpen(!productsOpen)} 
                className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-sm hover:text-emerald-800 transition-colors"
              >
                {productsOpen ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronUp className="w-4 h-4 text-emerald-600" />}
                <span>Produtos</span>
              </button>

              <button 
                onClick={() => {
                  setCartTab('atual');
                  setIsFullCartModalOpen(true);
                }}
                className="bg-[#2ca58d] hover:bg-[#238b76] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Incluir Produto
              </button>
            </div>

            {/* Itens de Produtos */}
            {productsOpen && (
              <div className="divide-y divide-slate-100">
                {cartProducts.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400 font-medium">Nenhum produto incluído</p>
                ) : (
                  cartProducts.map((prd, idx) => (
                    <div key={prd.id} className="p-3.5 space-y-2 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-800 leading-snug truncate max-w-[230px]">{prd.name}</h4>
                          {prd.isSupply && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                              Insumo
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{prd.patientName || petData.name || 'Rock'}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="1"
                            value={prd.quantity}
                            onChange={(e) => {
                              const q = Math.max(1, parseInt(e.target.value) || 1);
                              const updated = [...cartProducts];
                              updated[idx].quantity = q;
                              setCartProducts(updated);
                            }}
                            className="w-12 h-7 border border-slate-300 rounded-md text-center text-xs font-bold text-slate-800 bg-white shadow-inner outline-none focus:border-emerald-500"
                          />
                          <span className="text-xs font-bold text-slate-500">x {prd.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <span className="font-black text-sm text-slate-800">
                          R$ {(prd.price * prd.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Ações: User (comissão), Pin (insumo), Olho azul (editar), Lixeira vermelha */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setEditingCommissionModal({
                            open: true,
                            type: 'product',
                            id: prd.id,
                            name: prd.name,
                            vet: prd.vet || 'Dra. Jéssica',
                            commissionPercent: prd.commissionPercent || 15,
                            price: prd.price,
                            quantity: prd.quantity
                          })}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                          title="Visualizar / Alterar comissão e profissional responsável"
                        >
                          <User className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => toggleProductSupply(prd.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            prd.isSupply 
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={prd.isSupply ? 'Insumo / Uso Interno da Clínica (Clique para reverter)' : 'Transformar em Insumo / Uso Interno'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setEditingItemModal({
                            open: true,
                            type: 'product',
                            id: prd.id,
                            name: prd.name,
                            patientName: prd.patientName || petData.name || 'Rock',
                            quantity: prd.quantity,
                            price: prd.price
                          })}
                          className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Editar produto (Animal, quantidade, valor)"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => {
                            setCartProducts(cartProducts.filter((_, i) => i !== idx));
                            showToast("Produto removido");
                          }}
                          className="w-6 h-6 rounded bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Remover produto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Footer do item com Data e Profissional */}
                      <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 border-t border-slate-50">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{prd.date || '28/08 12:04'} · {prd.user || 'LETICIA'}</span>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          <span>{prd.vet || 'Dra. Jéssica'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* RODAPÉ DO CARRINHO / CHECKOUT CONTAINER (EXATAMENTE COMO NA IMAGEM) */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3 shadow-sm shrink-0">
          {/* Summary Pills: e.g. "1 Serviços: R$ 150,00" e "2 Produtos: R$ 220,00" */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-slate-200 rounded-full py-1.5 px-3 text-center text-xs font-bold text-slate-700 bg-white shadow-inner">
              {cartServices.reduce((acc, s) => acc + s.quantity, 0)} Serviços: R$ {cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0).toFixed(2).replace('.', ',')}
            </div>
            <div className="border border-slate-200 rounded-full py-1.5 px-3 text-center text-xs font-bold text-slate-700 bg-white shadow-inner">
              {cartProducts.reduce((acc, p) => acc + p.quantity, 0)} Produtos: R$ {cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* Total Row & Pagamento Button */}
          <div className="flex justify-between items-center pt-1">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block leading-tight">Total</span>
              <span className="text-2xl font-black text-slate-900 leading-tight">
                R$ {(cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0) + cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)).toFixed(2).replace('.', ',')}
              </span>
            </div>

            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black px-6 py-3 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
            >
              <CreditCard className="w-4 h-4" /> Pagamento
            </Button>
          </div>
        </div>
      </div>
      
      {/* ======================================================== */}
      {/* MODAL 1: EDITAR PET */}
      {/* ======================================================== */}
      {isEditPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Editar Cadastro do Pet</h3>
                  <p className="text-xs text-slate-400 font-medium">Atualize os dados e histórico de {petData.name}</p>
                </div>
              </div>
              <button onClick={() => setIsEditPetModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Nome do Pet</label>
                <Input 
                  value={petData.name} 
                  onChange={e => setPetData({...petData, name: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Espécie</label>
                  <Input 
                    value={petData.species} 
                    onChange={e => setPetData({...petData, species: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Raça</label>
                  <Input 
                    value={petData.breed} 
                    onChange={e => setPetData({...petData, breed: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Sexo</label>
                  <select 
                    value={petData.gender} 
                    onChange={e => setPetData({...petData, gender: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm cursor-pointer"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Fertilidade</label>
                  <select 
                    value={petData.fertility} 
                    onChange={e => setPetData({...petData, fertility: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm cursor-pointer"
                  >
                    <option value="Fértil">Fértil</option>
                    <option value="Castrado">Castrado</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Peso (kg)</label>
                  <Input 
                    value={petData.weight} 
                    onChange={e => setPetData({...petData, weight: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Idade</label>
                  <Input 
                    value={petData.age} 
                    onChange={e => setPetData({...petData, age: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                    placeholder="Ex: 3 anos e 4 meses"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Data de Nascimento</label>
                  <Input 
                    value={petData.birthDate} 
                    onChange={e => setPetData({...petData, birthDate: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                    placeholder="Ex: 12/04/2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Pelagem / Cor</label>
                  <Input 
                    value={petData.coatColor} 
                    onChange={e => setPetData({...petData, coatColor: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Microchip</label>
                  <Input 
                    value={petData.microchip} 
                    onChange={e => setPetData({...petData, microchip: e.target.value})} 
                    className="w-full font-mono font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Alergias & Alertas Clínicos</label>
                <Input 
                  value={petData.allergy} 
                  onChange={e => setPetData({...petData, allergy: e.target.value})} 
                  className="w-full font-bold text-red-700 bg-red-50 border-2 border-red-300 rounded-xl p-2.5 outline-none focus:border-red-500 shadow-sm" 
                  placeholder="Ex: Alérgico a Dipirona"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Tags do Pet</label>
                <Input 
                  value={petData.tags} 
                  onChange={e => setPetData({...petData, tags: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-indigo-600 shadow-sm" 
                  placeholder="Ex: Dócil, Não gosta de outros cães"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setIsEditPetModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setIsEditPetModalOpen(false);
                  showToast("Dados do pet atualizados com sucesso!", "success");
                }} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: NOVO PET (FICHA DE CADASTRO) */}
      {/* ======================================================== */}
      {isNewPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Cadastrar Novo Pet</h3>
                  <p className="text-xs text-slate-400 font-medium">Vinculado ao tutor: {tutorData.name}</p>
                </div>
              </div>
              <button onClick={() => setIsNewPetModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Nome do Pet *</label>
                <Input 
                  value={newPetForm.name} 
                  onChange={e => setNewPetForm({...newPetForm, name: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                  placeholder="Nome do animal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Espécie</label>
                  <select 
                    value={newPetForm.species} 
                    onChange={e => setNewPetForm({...newPetForm, species: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
                  >
                    <option value="Canina">Canina</option>
                    <option value="Felina">Felina</option>
                    <option value="Ave">Ave</option>
                    <option value="Silvestre">Silvestre</option>
                    <option value="Roedor">Roedor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Raça</label>
                  <Input 
                    value={newPetForm.breed} 
                    onChange={e => setNewPetForm({...newPetForm, breed: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                    placeholder="Ex: SRD, Poodle, Siamês"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Sexo</label>
                  <select 
                    value={newPetForm.gender} 
                    onChange={e => setNewPetForm({...newPetForm, gender: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Fertilidade</label>
                  <select 
                    value={newPetForm.fertility} 
                    onChange={e => setNewPetForm({...newPetForm, fertility: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
                  >
                    <option value="Fértil">Fértil</option>
                    <option value="Castrado">Castrado</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Peso (kg)</label>
                  <Input 
                    value={newPetForm.weight} 
                    onChange={e => setNewPetForm({...newPetForm, weight: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                    placeholder="Ex: 5,50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Idade Aproximada</label>
                  <Input 
                    value={newPetForm.age} 
                    onChange={e => setNewPetForm({...newPetForm, age: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                    placeholder="Ex: 2 anos"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Data Nasc (se souber)</label>
                  <Input 
                    value={newPetForm.birthDate} 
                    onChange={e => setNewPetForm({...newPetForm, birthDate: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Alergias / Cuidados Especiais</label>
                <Input 
                  value={newPetForm.allergy} 
                  onChange={e => setNewPetForm({...newPetForm, allergy: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                  placeholder="Ex: Nenhuma alergia conhecida"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setIsNewPetModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (!newPetForm.name) {
                    showToast("Informe o nome do pet", "error");
                    return;
                  }
                  const newCode = String(Math.floor(1000 + Math.random() * 9000));
                  setPetData({
                    code: newCode,
                    name: newPetForm.name,
                    weight: newPetForm.weight || '5,00',
                    gender: newPetForm.gender,
                    fertility: newPetForm.fertility,
                    species: newPetForm.species,
                    breed: newPetForm.breed || 'SRD',
                    birthDate: newPetForm.birthDate || 'Recém cadastrado',
                    age: newPetForm.age || '1 ano',
                    microchip: newPetForm.microchip || 'Pendente',
                    coatColor: newPetForm.coatColor || 'Padrão',
                    tags: 'Novo Paciente',
                    allergy: newPetForm.allergy
                  });
                  setIsNewPetModalOpen(false);
                  showToast(`Pet ${newPetForm.name} cadastrado e selecionado com sucesso!`, "success");
                }} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Cadastrar e Selecionar Pet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDITAR TUTOR (FICHA DE CADASTRO) */}
      {/* ======================================================== */}
      {isEditTutorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Ficha de Cadastro do Tutor</h3>
                  <p className="text-xs text-slate-400 font-medium">Dados cadastrais de {tutorData.name}</p>
                </div>
              </div>
              <button onClick={() => setIsEditTutorModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Nome Completo *</label>
                <Input 
                  value={tutorData.name} 
                  onChange={e => setTutorData({...tutorData, name: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Tipo de Pessoa</label>
                  <select 
                    value={tutorData.type} 
                    onChange={e => setTutorData({...tutorData, type: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm cursor-pointer"
                  >
                    <option value="Pessoa Física">Pessoa Física</option>
                    <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">CPF / CNPJ</label>
                  <Input 
                    value={tutorData.cpf} 
                    onChange={e => setTutorData({...tutorData, cpf: e.target.value})} 
                    className="w-full font-mono font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Telefone / WhatsApp *</label>
                  <Input 
                    value={tutorData.phone} 
                    onChange={e => setTutorData({...tutorData, phone: e.target.value})} 
                    className="w-full font-bold text-emerald-700 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Telefone Secundário</label>
                  <Input 
                    value={tutorData.secondaryPhone} 
                    onChange={e => setTutorData({...tutorData, secondaryPhone: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">E-mail</label>
                <Input 
                  value={tutorData.email} 
                  onChange={e => setTutorData({...tutorData, email: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Endereço Completo</label>
                <Input 
                  value={tutorData.address} 
                  onChange={e => setTutorData({...tutorData, address: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Bairro</label>
                  <Input 
                    value={tutorData.neighborhood} 
                    onChange={e => setTutorData({...tutorData, neighborhood: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Cidade</label>
                  <Input 
                    value={tutorData.city} 
                    onChange={e => setTutorData({...tutorData, city: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">UF</label>
                  <Input 
                    value={tutorData.state} 
                    onChange={e => setTutorData({...tutorData, state: e.target.value})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 text-center outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Tags / Observações</label>
                <Input 
                  value={tutorData.tags} 
                  onChange={e => setTutorData({...tutorData, tags: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  placeholder="Ex: Cliente VIP, Prefere contato via WhatsApp"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setIsEditTutorModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setIsEditTutorModalOpen(false);
                  showToast("Ficha do tutor atualizada com sucesso!", "success");
                }} 
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Salvar Dados do Tutor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: INCLUIR SERVIÇO */}
      {/* ======================================================== */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Incluir Serviço</h3>
                  <p className="text-xs text-slate-400 font-medium">Adicionar serviço ao carrinho da consulta</p>
                </div>
              </div>
              <button onClick={() => setIsAddServiceModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Selecione o Serviço</label>
                <select 
                  className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none text-slate-900 focus:border-sky-600 shadow-sm cursor-pointer"
                  onChange={e => {
                    const found = availableServices.find(s => s.name === e.target.value);
                    if (found) {
                      setServiceModalForm({ ...serviceModalForm, name: found.name, price: found.price });
                    } else if (e.target.value) {
                      setServiceModalForm({ ...serviceModalForm, name: e.target.value });
                    }
                  }}
                  defaultValue={serviceModalForm.name}
                >
                  {availableServices.map(srv => (
                    <option key={srv.id} value={srv.name}>
                      {srv.name} — R$ {srv.price.toFixed(2).replace('.', ',')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Nome Personalizado (opcional)</label>
                <Input 
                  value={serviceModalForm.name} 
                  onChange={e => setServiceModalForm({...serviceModalForm, name: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Valor Unitário (R$)</label>
                  <Input 
                    type="number"
                    value={serviceModalForm.price} 
                    onChange={e => setServiceModalForm({...serviceModalForm, price: parseFloat(e.target.value) || 0})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Quantidade</label>
                  <Input 
                    type="number"
                    min="1"
                    value={serviceModalForm.quantity} 
                    onChange={e => setServiceModalForm({...serviceModalForm, quantity: Math.max(1, parseInt(e.target.value) || 1)})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-sky-600 shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Profissional / Veterinário</label>
                <select 
                  value={serviceModalForm.vet} 
                  onChange={e => setServiceModalForm({...serviceModalForm, vet: e.target.value})} 
                  className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none text-slate-900 focus:border-sky-600 shadow-sm cursor-pointer"
                >
                  <option value="Dra. Jéssica">Dra. Jéssica</option>
                  <option value="Dr. Nogueira">Dr. Nogueira</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setIsAddServiceModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (!serviceModalForm.name) {
                    showToast("Informe o serviço", "error");
                    return;
                  }
                  const now = new Date();
                  const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  setCartServices(prev => [
                    ...prev,
                    {
                      id: `srv-${Date.now()}`,
                      name: serviceModalForm.name,
                      patientName: petData.name || 'Rock',
                      quantity: serviceModalForm.quantity,
                      price: serviceModalForm.price,
                      user: 'KEVIN',
                      date: timeStr,
                      vet: serviceModalForm.vet
                    }
                  ]);
                  setIsAddServiceModalOpen(false);
                  showToast(`Serviço "${serviceModalForm.name}" incluído!`, "success");
                }} 
                className="bg-[#48a9a6] hover:bg-[#3b8f8d] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Incluir Serviço
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: INCLUIR PRODUTO */}
      {/* ======================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Incluir Produto</h3>
                  <p className="text-xs text-slate-400 font-medium">Adicionar produto / medicamento ao carrinho</p>
                </div>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Selecione do Catálogo</label>
                <select 
                  className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none text-slate-900 focus:border-emerald-600 shadow-sm cursor-pointer"
                  onChange={e => {
                    const found = availableProducts.find(p => p.name === e.target.value);
                    if (found) {
                      setProductModalForm({ ...productModalForm, name: found.name, price: found.price });
                    } else if (e.target.value) {
                      setProductModalForm({ ...productModalForm, name: e.target.value });
                    }
                  }}
                  defaultValue={productModalForm.name}
                >
                  {availableProducts.map(prd => (
                    <option key={prd.id} value={prd.name}>
                      {prd.name} — R$ {prd.price.toFixed(2).replace('.', ',')} (Est: {prd.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Nome do Produto</label>
                <Input 
                  value={productModalForm.name} 
                  onChange={e => setProductModalForm({...productModalForm, name: e.target.value})} 
                  className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Valor Unitário (R$)</label>
                  <Input 
                    type="number"
                    value={productModalForm.price} 
                    onChange={e => setProductModalForm({...productModalForm, price: parseFloat(e.target.value) || 0})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Quantidade</label>
                  <Input 
                    type="number"
                    min="1"
                    value={productModalForm.quantity} 
                    onChange={e => setProductModalForm({...productModalForm, quantity: Math.max(1, parseInt(e.target.value) || 1)})} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-600 shadow-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Profissional / Responsável</label>
                <select 
                  value={productModalForm.vet} 
                  onChange={e => setProductModalForm({...productModalForm, vet: e.target.value})} 
                  className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none text-slate-900 focus:border-emerald-600 shadow-sm cursor-pointer"
                >
                  <option value="Dra. Jéssica">Dra. Jéssica</option>
                  <option value="Dr. Nogueira">Dr. Nogueira</option>
                  <option value="LETICIA">LETICIA</option>
                  <option value="KEVIN">KEVIN</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setIsAddProductModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (!productModalForm.name) {
                    showToast("Informe o produto", "error");
                    return;
                  }
                  const now = new Date();
                  const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  setCartProducts(prev => [
                    ...prev,
                    {
                      id: `prd-${Date.now()}`,
                      name: productModalForm.name,
                      patientName: petData.name || 'Rock',
                      quantity: productModalForm.quantity,
                      price: productModalForm.price,
                      user: 'LETICIA',
                      date: timeStr,
                      vet: productModalForm.vet,
                      pinned: true
                    }
                  ]);
                  setIsAddProductModalOpen(false);
                  showToast(`Produto "${productModalForm.name}" incluído!`, "success");
                }} 
                className="bg-[#2ca58d] hover:bg-[#238b76] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Incluir Produto
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL COMPLETO DO CARRINHO & BUSCA DE CATÁLOGO (D.VET - FOTOS 1, 2 E 3) */}
      {/* ======================================================== */}
      {isFullCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* STEPPER DE ETAPAS */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-lg text-slate-800">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Carrinho</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Carrinho</span>
                </div>
                <div className="w-10 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Checkout</span>
                </div>
                <div className="w-10 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">3</span>
                  <span>Pagamento</span>
                </div>
                <div className="w-10 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">4</span>
                  <span>Concluído</span>
                </div>
              </div>

              <button onClick={() => setIsFullCartModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AS 4 PÍLULAS SUPERIORES (ATUAL, PGTO. PENDENTE, ORÇAMENTO, HISTÓRICO) */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => setCartTab('atual')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  cartTab === 'atual' ? 'border-blue-500 bg-blue-50/60 text-blue-700 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <ShoppingCart className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold">Atual</span>
                <span className="text-sm font-black text-blue-700 mt-0.5">
                  {(cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0) + cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)).toFixed(2).replace('.', ',')}
                </span>
              </button>

              <button 
                onClick={() => setCartTab('pendente')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  cartTab === 'pendente' ? 'border-rose-500 bg-rose-50/60 text-rose-700 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <RotateCw className="w-5 h-5 text-rose-500 mb-1" />
                <span className="text-xs font-bold">Pgto. Pendente</span>
                <span className="text-sm font-black text-rose-700 mt-0.5">130,00</span>
              </button>

              <button 
                onClick={() => setCartTab('orcamento')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  cartTab === 'orcamento' ? 'border-amber-500 bg-amber-50/60 text-amber-700 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <DollarSign className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs font-bold">Orçamento</span>
                <span className="text-sm font-black text-amber-700 mt-0.5">0,00</span>
              </button>

              <button 
                onClick={() => setCartTab('historico')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  cartTab === 'historico' ? 'border-slate-500 bg-slate-100 text-slate-800 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <History className="w-5 h-5 text-slate-600 mb-1" />
                <span className="text-xs font-bold">Histórico</span>
                <span className="text-sm font-black text-slate-800 mt-0.5">1.466,39</span>
              </button>
            </div>

            {/* ABA 1: ATUAL (BUSCA E CATÁLOGO DE SERVIÇOS & PRODUTOS) */}
            {cartTab === 'atual' && (
              <div className="space-y-4">
                {/* BUSCA DE SERVIÇOS INLINE */}
                <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Incluir Serviço</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Quantidade</label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={serviceSearchQty}
                        onChange={e => setServiceSearchQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-900" 
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Descrição | Código Interno | Código de barras</label>
                      <Input 
                        value={serviceSearchTerm}
                        onChange={e => setServiceSearchTerm(e.target.value)}
                        placeholder="Digite para começar a buscar..." 
                        className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-900 focus:border-blue-600" 
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Centro de Custo</label>
                      <select value={costCenter} onChange={e => setCostCenter(e.target.value)} className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-800 outline-none cursor-pointer">
                        <option value="Atendimento">Atendimento</option>
                        <option value="Cirurgia">Cirurgia</option>
                        <option value="Internação">Internação</option>
                        <option value="Estética">Estética / Banho</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Subcentro</label>
                      <select value={subCenter} onChange={e => setSubCenter(e.target.value)} className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-800 outline-none cursor-pointer">
                        <option value="— sem subcentro —">— sem subcentro —</option>
                        <option value="Consultório 1">Consultório 1</option>
                        <option value="UTI">UTI</option>
                      </select>
                    </div>
                  </div>

                  {/* TABELA DE RESULTADOS DO CATÁLOGO DE SERVIÇOS */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                          <th className="p-2.5">Descrição</th>
                          <th className="p-2.5 w-28">Cód. Interno</th>
                          <th className="p-2.5 w-36">Valor</th>
                          <th className="p-2.5 w-20 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {availableServices
                          .filter(s => 
                            !serviceSearchTerm || 
                            s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) || 
                            (s.code && s.code.includes(serviceSearchTerm))
                          )
                          .map((srv) => (
                            <tr key={srv.id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="p-2.5 font-bold text-slate-800">{srv.name}</td>
                              <td className="p-2.5 font-mono text-slate-500">{srv.code || '1001'}</td>
                              <td className="p-2.5">
                                <Input 
                                  defaultValue={srv.price.toFixed(2).replace('.', ',')} 
                                  className="w-28 font-bold text-slate-900 border border-slate-300 rounded-lg p-1 text-xs" 
                                />
                              </td>
                              <td className="p-2.5 text-center">
                                <button 
                                  onClick={() => {
                                    const now = new Date();
                                    const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                    setCartServices(prev => [
                                      ...prev,
                                      {
                                        id: `srv-${Date.now()}`,
                                        name: srv.name,
                                        patientName: petData.name || 'Ringo',
                                        quantity: serviceSearchQty,
                                        price: srv.price,
                                        user: 'KEVIN',
                                        date: timeStr,
                                        vet: attendant || 'Dra. Jéssica'
                                      }
                                    ]);
                                    showToast(`Serviço "${srv.name}" adicionado ao carrinho!`, "success");
                                  }}
                                  className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center justify-center font-bold shadow-sm cursor-pointer"
                                  title="Adicionar ao Carrinho"
                                >
                                  ✓
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BUSCA DE PRODUTOS INLINE */}
                <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                      <PackagePlus className="w-4 h-4 text-emerald-600" />
                      <span>Produtos / Medicamentos</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Qtd</label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={productSearchQty}
                        onChange={e => setProductSearchQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-900" 
                      />
                    </div>
                    <div className="md:col-span-10">
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Buscar Produto / Código</label>
                      <Input 
                        value={productSearchTerm}
                        onChange={e => setProductSearchTerm(e.target.value)}
                        placeholder="Buscar produto por nome ou código..." 
                        className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2 text-slate-900 focus:border-emerald-600" 
                      />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                          <th className="p-2.5">Produto</th>
                          <th className="p-2.5 w-24">Estoque</th>
                          <th className="p-2.5 w-32">Valor</th>
                          <th className="p-2.5 w-20 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {availableProducts
                          .filter(p => 
                            !productSearchTerm || 
                            p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || 
                            (p.code && p.code.includes(productSearchTerm))
                          )
                          .map((prd) => (
                            <tr key={prd.id} className="hover:bg-emerald-50/50 transition-colors">
                              <td className="p-2.5 font-bold text-slate-800">{prd.name}</td>
                              <td className="p-2.5 font-bold text-slate-600">{prd.stock} un</td>
                              <td className="p-2.5">
                                <Input 
                                  defaultValue={prd.price.toFixed(2).replace('.', ',')} 
                                  className="w-24 font-bold text-slate-900 border border-slate-300 rounded-lg p-1 text-xs" 
                                />
                              </td>
                              <td className="p-2.5 text-center">
                                <button 
                                  onClick={() => {
                                    const now = new Date();
                                    const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                    setCartProducts(prev => [
                                      ...prev,
                                      {
                                        id: `prd-${Date.now()}`,
                                        name: prd.name,
                                        patientName: petData.name || 'Ringo',
                                        quantity: productSearchQty,
                                        price: prd.price,
                                        user: 'LETICIA',
                                        date: timeStr,
                                        vet: attendant || 'Dra. Jéssica'
                                      }
                                    ]);
                                    showToast(`Produto "${prd.name}" adicionado ao carrinho!`, "success");
                                  }}
                                  className="w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center justify-center font-bold shadow-sm cursor-pointer"
                                  title="Adicionar Produto"
                                >
                                  ✓
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: PGTO. PENDENTE */}
            {cartTab === 'pendente' && (
              <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-rose-600" /> Atendimentos e Contas Pendentes de Pagamento ({tutorData.name})
                </h4>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">Internação & Exames Sangue #4938</h5>
                    <p className="text-xs text-slate-400 font-medium">Paciente: Ringo · Data: 01/09/2026</p>
                    <p className="text-xs font-bold text-rose-600 mt-1">Valor Pendente: R$ 130,00</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsFullCartModalOpen(false);
                      setIsPaymentModalOpen(true);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    + Pagar / Unificar no Checkout
                  </Button>
                </div>
              </div>
            )}

            {/* ABA 3: ORÇAMENTO */}
            {cartTab === 'orcamento' && (
              <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" /> Orçamentos Gerados ({petData.name})
                </h4>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">Orçamento Cirúrgico #104</h5>
                    <p className="text-xs text-slate-400 font-medium">Cir. Correção de Hérnia + Anestesia Inalatória</p>
                    <p className="text-xs font-bold text-amber-600 mt-1">Valor Estimado: R$ 750,00</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setCartServices(prev => [
                        ...prev,
                        { id: `srv-orc-${Date.now()}`, name: 'Cir. Correção de hérnia', patientName: petData.name, quantity: 1, price: 750, user: 'KEVIN', date: 'Hoje', vet: 'Dr. Nogueira' }
                      ]);
                      showToast("Orçamento de R$ 750,00 adicionado ao atendimento!", "success");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    + Converter em Atendimento
                  </Button>
                </div>
              </div>
            )}

            {/* ABA 4: HISTÓRICO */}
            {cartTab === 'historico' && (
              <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" /> Histórico Financeiro Quitado (Total: R$ 1.466,39)
                </h4>

                <div className="space-y-2">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-800">Consulta de Rotina + Vacina V10</h5>
                      <p className="text-[11px] text-slate-400">Pago via PIX em 14/05/2026</p>
                    </div>
                    <span className="font-black text-xs text-slate-900">R$ 245,00</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-800">Cirurgia de Conchectomia Patológica</h5>
                      <p className="text-[11px] text-slate-400">Pago via Cartão Crédito 3x em 10/11/2025</p>
                    </div>
                    <span className="font-black text-xs text-slate-900">R$ 1.221,39</span>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER DO MODAL */}
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="border border-slate-300 rounded-full py-1 px-3 text-xs font-bold text-slate-700 bg-white">
                  {cartServices.reduce((acc, s) => acc + s.quantity, 0)} Serviços: R$ {cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0).toFixed(2).replace('.', ',')}
                </span>
                <span className="border border-slate-300 rounded-full py-1 px-3 text-xs font-bold text-slate-700 bg-white">
                  {cartProducts.reduce((acc, p) => acc + p.quantity, 0)} Produtos: R$ {cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                  <span className="text-xl font-black text-slate-900">
                    R$ {(cartServices.reduce((acc, s) => acc + (s.price * s.quantity), 0) + cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <Button 
                  onClick={() => {
                    setIsFullCartModalOpen(false);
                    setIsPaymentModalOpen(true);
                  }}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black px-6 py-3 rounded-xl shadow-md flex items-center gap-2 text-sm cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" /> Pagamento
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: CHECKOUT & PAGAMENTO (EXATAMENTE COMO NA IMAGEM 1) */}
      {/* ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* STEPPER DE ETAPAS (1 Carrinho -> 2 Checkout -> 3 Pagamento -> 4 Concluído) */}
            <div className="flex items-center justify-center gap-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5 text-blue-600">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                <span>Carrinho</span>
              </div>
              <div className="w-10 h-0.5 bg-blue-600"></div>
              <div className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                <span>Checkout</span>
              </div>
              <div className="w-10 h-0.5 bg-slate-200"></div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">3</span>
                <span>Pagamento</span>
              </div>
              <div className="w-10 h-0.5 bg-slate-200"></div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">4</span>
                <span>Concluído</span>
              </div>
            </div>

            {/* HEADER DO MODAL */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800">Finalizar atendimento</h3>
                  <p className="text-xs text-slate-400 font-medium">Atendimento #{attendanceNumber}</p>
                </div>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TABS DO CHECKOUT: PAGAMENTO, ITENS, REPASSES */}
            <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1 max-w-md">
              <button 
                onClick={() => setCheckoutTab('pagamento')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  checkoutTab === 'pagamento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Pagamento
              </button>
              <button 
                onClick={() => setCheckoutTab('itens')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  checkoutTab === 'itens' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Itens
              </button>
              <button 
                onClick={() => setCheckoutTab('repasses')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  checkoutTab === 'repasses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" /> Repasses
              </button>
            </div>

            {/* CONTEÚDO PRINCIPAL (SPLIT EM 2 COLUNAS IGUAL À REFERÊNCIA) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* COLUNA DA ESQUERDA (2/3): FORMAS DE PAGAMENTO, PARCIAL, DESCONTO */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* BLOC 1: FORMAS DE PAGAMENTO */}
                <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-700">Formas de pagamento</h4>
                  
                  {/* Linha 1 */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">FORMA DE PAGAMENTO</label>
                        <select className="w-full border-2 border-slate-300 rounded-xl p-2 bg-white font-bold text-xs text-slate-800 outline-none focus:border-blue-600">
                          <option>Débito</option>
                          <option>Crédito</option>
                          <option>PIX</option>
                          <option>Dinheiro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">PARCELAS</label>
                        <select className="w-full border-2 border-slate-300 rounded-xl p-2 bg-white font-bold text-xs text-slate-800 outline-none focus:border-blue-600">
                          <option>1x de 541,67</option>
                          <option>2x de 270,83</option>
                          <option>3x de 180,55</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">VALOR PAGO R$</label>
                        <Input defaultValue="541,67" className="w-full border-2 border-slate-300 rounded-xl p-2 font-bold text-xs text-slate-900 bg-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200">
                        Ativar integração
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase">Máquina</label>
                          <select className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-700 bg-white">
                            <option>Finpet [Integ.]</option>
                            <option>Stone</option>
                            <option>PagBank</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase">NSU</label>
                          <Input placeholder="Digitar NSU..." className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-bold bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linha 2 */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">FORMA DE PAGAMENTO</label>
                        <select defaultValue="Dinheiro" className="w-full border-2 border-slate-300 rounded-xl p-2 bg-white font-bold text-xs text-slate-800 outline-none focus:border-blue-600">
                          <option>Dinheiro</option>
                          <option>Débito</option>
                          <option>Crédito</option>
                          <option>PIX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">PARCELAS</label>
                        <select className="w-full border-2 border-slate-300 rounded-xl p-2 bg-white font-bold text-xs text-slate-800 outline-none focus:border-blue-600">
                          <option>1x de 541,67</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">VALOR A PAGAR R$</label>
                        <Input defaultValue="541,67" className="w-full border-2 border-slate-300 rounded-xl p-2 font-bold text-xs text-slate-900 bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Link para adicionar mais uma forma */}
                  <button 
                    onClick={() => showToast("Nova forma de pagamento adicionada ao split!", "info")}
                    className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wide pt-1"
                  >
                    + ADICIONAR MAIS UMA FORMA DE PAGAMENTO
                  </button>
                </div>

                {/* BLOC 2: PAGAMENTO PARCIAL */}
                <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-black text-slate-700 uppercase">Pagamento Parcial</label>
                  <select defaultValue="Sim" className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white font-bold text-xs text-slate-900 outline-none focus:border-blue-600">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>

                  <p className="text-xs text-slate-500 italic font-medium leading-relaxed bg-white p-3 rounded-2xl border border-slate-200">
                    Pagamento total bloqueado: você só pode quitar o atendimento quando o animal receber alta da internação.
                  </p>

                  <Button 
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      showToast("Redirecionando para internação do paciente Ringo...");
                    }}
                    className="w-full bg-[#1e50a2] hover:bg-[#163c7b] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" /> Ir para internação e finalizar: Ringo
                  </Button>
                </div>

                {/* BLOC 3: VALOR DE DESCONTO */}
                <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-black text-slate-700 uppercase">Valor de Desconto</label>
                  <div className="flex gap-2">
                    <select className="w-24 border-2 border-slate-300 rounded-xl p-2.5 bg-white font-bold text-xs text-slate-900 outline-none">
                      <option>R$</option>
                      <option>%</option>
                    </select>
                    <Input defaultValue="57,02" className="flex-1 border-2 border-slate-300 rounded-xl p-2.5 font-bold text-xs text-slate-900 bg-white" />
                    <Button onClick={() => showToast("Desconto de R$ 57,02 aplicado!")} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 rounded-xl text-lg shadow-sm">
                      +
                    </Button>
                  </div>
                </div>

              </div>

              {/* COLUNA DA DIREITA (1/3): CARD TUTOR, RESUMO FINANCEIRO, ATENDENTE, TERMINAL */}
              <div className="space-y-4">
                
                {/* TUTOR CARD */}
                <div className="p-4 bg-slate-50/80 rounded-3xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-200 text-sky-800 rounded-2xl flex items-center justify-center font-black text-sm shrink-0">
                    JR
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-sm text-slate-800 truncate">{tutorData.name}</h5>
                    <p className="text-[11px] text-slate-400 font-medium truncate">CPF/CNPJ {tutorData.cpf}</p>
                    <p className="text-[11px] font-bold text-slate-600 mt-0.5">Pgto Pendente: <span className="text-slate-800">R$ 0,00</span></p>
                  </div>
                </div>

                {/* VALORES BREAKDOWN */}
                <div className="p-5 bg-white rounded-3xl border-2 border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>TOTAL</span>
                    <span className="font-black text-slate-900">R$ 1.140,36</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>DESC. VENDA</span>
                    <span className="font-black text-slate-900">R$ 57,02</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>TROCO</span>
                    <span className="font-black text-slate-900">R$ 0,00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                    <span>VALOR A PAGAR</span>
                    <span>R$ 541,67</span>
                  </div>

                  <div className="bg-[#1d63b8] text-white p-3.5 rounded-2xl flex justify-between items-center shadow-sm mt-3">
                    <span className="font-black uppercase tracking-wider text-xs">FALTA PAGAR</span>
                    <span className="font-black text-lg">R$ 0,00</span>
                  </div>
                </div>

                {/* SELECTS DE ATENDENTE E TERMINAL */}
                <div className="p-4 bg-slate-50/70 rounded-3xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Atendente</label>
                    <select value={selectedAttendantCheckout} onChange={e => setSelectedAttendantCheckout(e.target.value)} className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white font-bold text-slate-800 outline-none">
                      <option value="Luiz">Luiz</option>
                      <option value="Dra. Jéssica">Dra. Jéssica</option>
                      <option value="Dr. Nogueira">Dr. Nogueira</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Terminal</label>
                    <select value={selectedTerminalCheckout} onChange={e => setSelectedTerminalCheckout(e.target.value)} className="w-full border-2 border-slate-300 rounded-xl p-2.5 bg-white font-bold text-slate-800 outline-none">
                      <option value="Terminal Todos">Terminal Todos</option>
                      <option value="Terminal Recepção 1">Terminal Recepção 1</option>
                      <option value="Terminal PDV 2">Terminal PDV 2</option>
                    </select>
                  </div>

                  <div className="text-center pt-1">
                    <button onClick={() => showToast("Comprovante impresso!")} className="text-xs font-bold text-blue-600 hover:underline">
                      (C) Comp.
                    </button>
                  </div>
                </div>

                {/* BOTÃO PRINCIPAL: REALIZAR PAGAMENTO */}
                <Button 
                  onClick={() => {
                    setAttendanceStatus('atendido_totalmente');
                    addToClinicalQueue([...cartServices, ...cartProducts]);
                    setIsPaymentModalOpen(false);
                    showToast("Pagamento de R$ 541,67 realizado com sucesso!", "success");
                  }} 
                  className="w-full bg-[#1d63b8] hover:bg-[#154b8d] text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> Realizar Pagamento <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: VISUALIZAR / ALTERAR COMISSÃO E PROFISSIONAL (PESSOINHA) */}
      {/* ======================================================== */}
      {editingCommissionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Comissão do Profissional</h3>
                  <p className="text-xs text-slate-400 font-medium truncate max-w-[260px]">{editingCommissionModal.name}</p>
                </div>
              </div>
              <button onClick={() => setEditingCommissionModal({ ...editingCommissionModal, open: false })} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Info do Item */}
              <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Item</span>
                  <span className="font-bold text-slate-900 text-xs">{editingCommissionModal.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Valor Total</span>
                  <span className="font-black text-slate-900 text-xs">
                    R$ {(editingCommissionModal.price * editingCommissionModal.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Profissional Responsável (Comissionado)</label>
                <select 
                  value={editingCommissionModal.vet} 
                  onChange={e => setEditingCommissionModal({ ...editingCommissionModal, vet: e.target.value })} 
                  className="w-full font-bold bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none text-slate-900 focus:border-emerald-600 shadow-sm cursor-pointer"
                >
                  <option value="Dra. Jéssica">🩺 Dra. Jéssica</option>
                  <option value="Dr. Nogueira">🩺 Dr. Nogueira</option>
                  <option value="KEVIN">👤 KEVIN</option>
                  <option value="LETICIA">👤 LETICIA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Porcentagem (%)</label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={editingCommissionModal.commissionPercent} 
                    onChange={e => setEditingCommissionModal({ ...editingCommissionModal, commissionPercent: parseFloat(e.target.value) || 0 })} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 text-center outline-none focus:border-emerald-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Valor Calculado</label>
                  <div className="w-full font-black text-emerald-800 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-2.5 text-center text-sm shadow-sm">
                    R$ {((editingCommissionModal.price * editingCommissionModal.quantity * editingCommissionModal.commissionPercent) / 100).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setEditingCommissionModal({ ...editingCommissionModal, open: false })} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveCommission} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Salvar Comissão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: EDITAR ITEM (ANIMAL, QUANTIDADE, VALOR) (OLHO) */}
      {/* ======================================================== */}
      {editingItemModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Editar Item do Atendimento</h3>
                  <p className="text-xs text-slate-400 font-medium truncate max-w-[260px]">{editingItemModal.name}</p>
                </div>
              </div>
              <button onClick={() => setEditingItemModal({ ...editingItemModal, open: false })} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Animal / Paciente</label>
                <Input 
                  value={editingItemModal.patientName} 
                  onChange={e => setEditingItemModal({ ...editingItemModal, patientName: e.target.value })} 
                  className="w-full font-bold text-sky-700 bg-white border-2 border-slate-300 rounded-xl p-2.5 outline-none focus:border-blue-600 shadow-sm" 
                  placeholder="Ex: Rock, Pretinho, Thor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Quantidade</label>
                  <Input 
                    type="number"
                    min="1"
                    value={editingItemModal.quantity} 
                    onChange={e => setEditingItemModal({ ...editingItemModal, quantity: Math.max(1, parseInt(e.target.value) || 1) })} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 text-center outline-none focus:border-blue-600 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[11px] mb-1">Valor Unitário (R$)</label>
                  <Input 
                    type="number"
                    value={editingItemModal.price} 
                    onChange={e => setEditingItemModal({ ...editingItemModal, price: parseFloat(e.target.value) || 0 })} 
                    className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-2.5 text-center outline-none focus:border-blue-600 shadow-sm" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Subtotal Atualizado:</span>
                <span className="text-base font-black text-slate-900">
                  R$ {(editingItemModal.price * editingItemModal.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button onClick={() => setEditingItemModal({ ...editingItemModal, open: false })} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEditItem} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 9: BUSCAR PET CADASTRADO */}
      {/* ======================================================== */}
      {isSearchPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-800">Buscar Paciente Cadastrado</h3>
                  <p className="text-xs text-slate-400 font-medium">Selecione um pet para carregar no atendimento</p>
                </div>
              </div>
              <button onClick={() => setIsSearchPetModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input de Busca */}
            <div className="shrink-0">
              <Input 
                value={petSearchQuery}
                onChange={e => setPetSearchQuery(e.target.value)}
                placeholder="Buscar por nome do pet, tutor ou código..."
                className="w-full font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl p-3 outline-none focus:border-indigo-600 shadow-sm text-xs"
              />
            </div>

            {/* Lista de Pets */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {mockPatientsList
                .filter(p => 
                  p.name.toLowerCase().includes(petSearchQuery.toLowerCase()) || 
                  p.tutor.toLowerCase().includes(petSearchQuery.toLowerCase()) ||
                  p.code.includes(petSearchQuery)
                )
                .map(p => (
                  <div 
                    key={p.code} 
                    onClick={() => handleSelectSearchedPet(p)}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30 cursor-pointer transition-all flex justify-between items-center shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">[{p.code}] {p.name}</span>
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{p.species} · {p.breed}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">Tutor: <strong className="text-slate-800">{p.tutor}</strong> ({p.phone})</p>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl px-3 py-1.5 shadow-sm">
                      Selecionar
                    </Button>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 shrink-0">
              <Button onClick={() => setIsSearchPetModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function WidgetBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0 ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      {icon} {label}
    </Button>
  );
}
