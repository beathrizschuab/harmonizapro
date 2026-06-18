import { useState, useEffect, useRef, useMemo, useCallback, createElement, Fragment, Component } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SUPA_URL = "https://syxapyqgqrkqkensbbqj.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eGFweXFncXJrcWtlbnNiYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDAxMzEsImV4cCI6MjA5NTkxNjEzMX0.3ZBSQS1fvWZn-uXCgDkvn7xRgpEWJiAIb_gH7cmO34s";
const supabase = createClient(SUPA_URL, SUPA_KEY);
// ─── CONSTANTS & PALETTE ─────────────────────────────────────────────────────
const P={bg:"#160b0e",bg2:"#1c1012",bg3:"#221112",card:"#2a1518",card2:"#321a1d",border:"#472325",accent:"#9D7761",accent2:"#9F8475",accent3:"#E1D2C6",rose:"#5C1F32",rose2:"#7a2840",text:"#E1D2C6",text2:"#9F8475",text3:"#6b4d4a",green:"#7aad8a",red:"#c07070",yellow:"#c4a96a",gold:"#855954"};
const MONTH_NAMES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const APPT_STATUS=["Confirmado","Aguardando","Realizado","Cancelado","Faltou","Reagendado"];
const APPT_STATUS_CFG={Confirmado:{color:"#7aaed4",bg:"rgba(122,174,212,.14)"},Aguardando:{color:"#c4a96a",bg:"rgba(196,169,106,.14)"},Realizado:{color:"#7aad8a",bg:"rgba(122,173,138,.14)"},Cancelado:{color:"#c07070",bg:"rgba(192,112,112,.14)"},Faltou:{color:"#b07070",bg:"rgba(176,112,112,.12)"},Reagendado:{color:"#9b7aad",bg:"rgba(155,122,173,.13)"}};
const PAT_STATUS_CFG={vip:{label:"VIP ✦",color:"#c4a96a",bg:"rgba(196,169,106,.13)"},active:{label:"Ativa",color:"#7aad8a",bg:"rgba(122,173,138,.12)"},treatment:{label:"Em Tratamento",color:"#7aaed4",bg:"rgba(122,174,212,.12)"},return:{label:"Retorno Pendente",color:"#c4a96a",bg:"rgba(196,169,106,.12)"},inactive:{label:"Inativa",color:"#c07070",bg:"rgba(192,112,112,.12)"},new:{label:"Nova",color:"#9b7aad",bg:"rgba(155,122,173,.12)"}};
const BLOOD_TYPES=["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const SKIN_TYPES=["Normal","Seca","Oleosa","Mista","Sensível"];
const FITZPATRICK=["I","II","III","IV","V","VI"];
const MUSIC_STYLES=["Pop","Rock","Sertanejo","MPB","Eletrônico","Clássica","Jazz","Funk","Gospel","Outro"];
const INTERCORRENCIA_TYPES=["Edema","Hematoma","Assimetria","Dor","Infecção","Nódulo","Alergia","Necrose","Migração","Outro"];
const EXPENSE_CATS=["Aluguel","Marketing","Fornecedores","Produtos","Impostos","Equipamentos","Funcionários","Outros"];
const PAY_METHODS=["Pix","Cartão Crédito","Cartão Débito","Dinheiro","Transferência","Pendente"];
const FIN_STATUS=["Pago","Pendente","Parcial","Cancelado"];
const avColors=["linear-gradient(135deg,#5C1F32,#855954)","linear-gradient(135deg,#855954,#9D7761)","linear-gradient(135deg,#9D7761,#7a2840)","linear-gradient(135deg,#7a2840,#855954)","linear-gradient(135deg,#6b3a4a,#9F8475)"];
const ZONE_DEFS={
  botox:[
    {k:"frontal_c",label:"Frontal",cx:130,cy:56,r:22},{k:"sorrisoGeng_c",label:"Sorr. Gengival",cx:130,cy:73,r:10},{k:"glabela_c",label:"Glabela",cx:130,cy:95,r:14},
    {k:"orbicular_d",label:"Orbicular D",cx:88,cy:109,r:10},{k:"orbicular_e",label:"Orbicular E",cx:172,cy:109,r:10},
    {k:"peGalinha_d",label:"Pé Gal. D",cx:72,cy:120,r:12},{k:"peGalinha_e",label:"Pé Gal. E",cx:188,cy:120,r:12},
    {k:"malar_d",label:"Malar D",cx:80,cy:148,r:12},{k:"malar_e",label:"Malar E",cx:180,cy:148,r:12},
    {k:"buddyLine_d",label:"Buddy Line D",cx:88,cy:167,r:10},{k:"buddyLine_e",label:"Buddy Line E",cx:172,cy:167,r:10},
    {k:"sorrisoTriste_d",label:"Sorr. Triste D",cx:94,cy:185,r:10},{k:"sorrisoTriste_e",label:"Sorr. Triste E",cx:166,cy:185,r:10},
    {k:"masseteres_d",label:"Masseteres D",cx:74,cy:178,r:14},{k:"masseteres_e",label:"Masseteres E",cx:186,cy:178,r:14},
    {k:"mentual_c",label:"Mentual",cx:130,cy:210,r:12},{k:"platisma_d",label:"Platisma D",cx:100,cy:248,r:11},{k:"platisma_e",label:"Platisma E",cx:160,cy:248,r:11},
  ],
  filler:[
    {k:"tempora_d",label:"Têmpora D",cx:68,cy:78,r:13},{k:"tempora_e",label:"Têmpora E",cx:192,cy:78,r:13},
    {k:"olheira_d",label:"Olheira D",cx:94,cy:118,r:11},{k:"olheira_e",label:"Olheira E",cx:166,cy:118,r:11},
    {k:"malar_fill_d",label:"Malar D",cx:80,cy:140,r:14},{k:"malar_fill_e",label:"Malar E",cx:180,cy:140,r:14},
    {k:"sulco_d",label:"Sulco NL D",cx:100,cy:165,r:11},{k:"sulco_e",label:"Sulco NL E",cx:160,cy:165,r:11},
    {k:"bigodeCh_d",label:"Big. Chinês D",cx:106,cy:178,r:10},{k:"bigodeCh_e",label:"Big. Chinês E",cx:154,cy:178,r:10},
    {k:"marionete_d",label:"Marionete D",cx:96,cy:190,r:10},{k:"marionete_e",label:"Marionete E",cx:164,cy:190,r:10},
    {k:"labio_sup",label:"Lábio Sup",cx:130,cy:185,r:12},{k:"labio_inf",label:"Lábio Inf",cx:130,cy:200,r:10},
    {k:"queixo_c",label:"Queixo",cx:130,cy:216,r:12},{k:"mandibula_d",label:"Mandíbula D",cx:82,cy:200,r:12},{k:"mandibula_e",label:"Mandíbula E",cx:178,cy:200,r:12},
    {k:"jowls_d",label:"Jowls D",cx:80,cy:215,r:11},{k:"jowls_e",label:"Jowls E",cx:180,cy:215,r:11},
  ],
  thread:[
    {k:"glabela_thr_c",label:"Glabela",cx:130,cy:95,r:11},{k:"tempora_thr_d",label:"Temporal D",cx:68,cy:78,r:11},{k:"tempora_thr_e",label:"Temporal E",cx:192,cy:78,r:11},
    {k:"olheira_thr_d",label:"Olheira D",cx:94,cy:118,r:10},{k:"olheira_thr_e",label:"Olheira E",cx:166,cy:118,r:10},
    {k:"malar_thr_d",label:"Malar D",cx:78,cy:142,r:11},{k:"malar_thr_e",label:"Malar E",cx:182,cy:142,r:11},
    {k:"bigodeCh_thr_d",label:"Big. Chinês D",cx:104,cy:175,r:10},{k:"bigodeCh_thr_e",label:"Big. Chinês E",cx:156,cy:175,r:10},
    {k:"mandibula_thr_d",label:"Mandíbula D",cx:80,cy:200,r:12},{k:"mandibula_thr_e",label:"Mandíbula E",cx:180,cy:200,r:12},
    {k:"neck_d",label:"Pescoço D",cx:100,cy:248,r:11},{k:"neck_e",label:"Pescoço E",cx:160,cy:248,r:11},
  ]
};
// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_PROCEDURES=["Toxina Botulínica","Preenchimento Labial","Preenchimento Malar","Preenchimento Mandíbula","Preenchimento Têmpora","Preenchimento Jowls","Preenchimento Marionete","Preenchimento Olheira","Preenchimento Bigode Chinês","Preenchimento Queixo","Preenchimento Facial","Bioestimulador de Colágeno","Fio de PDO","Microagulhamento","Nano Hidrox","PDRN","Profhilo","Peeling Químico","Exossomos","Skinbooster","Avaliação Inicial","Harmonização Completa","Consultoria","Revisão / Retoque"];
const INIT_PRODUCTS=["Botox Allergan 100U","Dysport 500U","Xeomin 100U","Juvederm Ultra 1ml","Juvederm Volbella 1ml","Restylane 1ml","Sculptra 367mg","Radiesse 1,5ml","Profhilo 2ml","Ellansé M 1ml","Silhouette Soft 8 cones","Aptos Thread","Belotero 1ml"];
const INIT_LOCATIONS=["Barra Olímpica","Nova América"];
// Prazos padrão de retorno por procedimento (em dias)
const INIT_RETURN_RULES=[
  {id:1,procedure:"Toxina Botulínica",revisionDays:14,maintenanceDays:120,label:"Revisão 14d · Manutenção 4m"},
  {id:2,procedure:"Preenchimento Labial",revisionDays:21,maintenanceDays:180,label:"Revisão 21d · Manutenção 6m"},
  {id:3,procedure:"Preenchimento Malar",revisionDays:21,maintenanceDays:180,label:"Revisão 21d · Manutenção 6m"},
  {id:4,procedure:"Preenchimento Mandíbula",revisionDays:21,maintenanceDays:180,label:""},
  {id:5,procedure:"Preenchimento Têmpora",revisionDays:21,maintenanceDays:180,label:""},
  {id:6,procedure:"Preenchimento Jowls",revisionDays:21,maintenanceDays:180,label:""},
  {id:7,procedure:"Preenchimento Marionete",revisionDays:21,maintenanceDays:180,label:""},
  {id:8,procedure:"Preenchimento Olheira",revisionDays:21,maintenanceDays:180,label:""},
  {id:9,procedure:"Preenchimento Bigode Chinês",revisionDays:21,maintenanceDays:180,label:""},
  {id:10,procedure:"Preenchimento Queixo",revisionDays:21,maintenanceDays:180,label:""},
  {id:11,procedure:"Preenchimento Facial",revisionDays:21,maintenanceDays:180,label:""},
  {id:12,procedure:"Bioestimulador de Colágeno",revisionDays:30,maintenanceDays:180,label:""},
  {id:13,procedure:"Fio de PDO",revisionDays:30,maintenanceDays:365,label:""},
  {id:14,procedure:"Microagulhamento",revisionDays:30,maintenanceDays:90,label:""},
  {id:15,procedure:"Profhilo",revisionDays:30,maintenanceDays:180,label:""},
  {id:16,procedure:"Peeling Químico",revisionDays:21,maintenanceDays:90,label:""},
  {id:17,procedure:"Revisão / Retoque",revisionDays:0,maintenanceDays:90,label:""},
];
const INIT_PATIENTS=[
  {id:1,name:"Ana Beatriz Martins",age:32,birthDate:"1993-05-28",phone:"(11) 99234-5678",email:"ana@email.com",cpf:"123.456.789-00",bloodType:"O+",allergies:"Nenhuma",since:"03/11/2025",status:"vip",tags:["VIP","Alta frequência"],profilePhoto:null,lastVisit:"28/05/2026",nextReturn:"28/08/2026",complaints:["Linhas de expressão","Volume labial"],
   sessions:[{id:1,date:"28/05/2026",procedure:"Toxina Botulínica",doctor:"Dra. Sofia",product:"Botox Allergan 100U",dose:"40U",region:"Glabela + Testa",location:"Barra Olímpica",value:850,paid:true,finStatus:"Pago",payMethod:"Pix",notes:"40U total. Glabela (20U), frontal (12U), pé de galinha D/E.",evolution:"Retorno em 14 dias.",faceMap:{type:"botox",points:{glabela_c:20,frontal_c:12,peGalinha_d:8,peGalinha_e:6}},photos:[],docs:[],intercorrencias:[],returnReminderDays:90}],
   sessions_packages:[],intercorrencias:[],planejamento:[],
   anamnese:{healthHistory:"Sem doenças crônicas",medications:"Anticoncepcional",smoking:"Não",pregnancy:"Não",previousProcedures:"Nenhum",skinType:"Mista",fitzpatrick:"III",allergiesDetail:"Sem alergias conhecidas.",contraindications:"Nenhuma",musicStyle:"Pop",importantAlerts:[]}},
  {id:2,name:"Camila R. Souza",age:28,birthDate:"1997-06-15",phone:"(11) 98876-1234",email:"camila@email.com",cpf:"987.654.321-00",bloodType:"A+",allergies:"Dipirona",since:"10/01/2026",status:"active",tags:["Recorrente"],profilePhoto:null,lastVisit:"28/05/2026",nextReturn:"28/08/2026",complaints:["Volume labial"],
   sessions:[{id:1,date:"28/05/2026",procedure:"Preenchimento Labial",doctor:"Dra. Sofia",product:"Juvederm Volbella 1ml",dose:"1ml",region:"Lábio superior",location:"Barra Olímpica",value:1200,paid:true,finStatus:"Pago",payMethod:"Cartão",notes:"Técnica linear. Resultado harmonioso.",evolution:"",faceMap:null,photos:[],docs:[],intercorrencias:[],returnReminderDays:180}],
   sessions_packages:[],intercorrencias:[],planejamento:[],
   anamnese:{healthHistory:"Rinite alérgica",medications:"Loratadina ocasional",smoking:"Não",pregnancy:"Não",previousProcedures:"Preenchimento (2024)",skinType:"Seca",fitzpatrick:"II",allergiesDetail:"Alergia à dipirona — reação cutânea. Usar paracetamol.",contraindications:"Dipirona contraindicada",musicStyle:"Sertanejo",importantAlerts:["Alergia à Dipirona"]}},
  {id:3,name:"Fernanda Lopes",age:35,birthDate:"1990-09-03",phone:"(11) 97654-3210",email:"fernanda@email.com",cpf:"111.222.333-44",bloodType:"B+",allergies:"Nenhuma",since:"12/03/2026",status:"treatment",tags:["Em Tratamento"],profilePhoto:null,lastVisit:"12/05/2026",nextReturn:"28/05/2026",complaints:["Flacidez","Sulcos"],
   sessions:[{id:1,date:"12/05/2026",procedure:"Bioestimulador de Colágeno",doctor:"Dra. Sofia",product:"Sculptra 367mg",dose:"2 frascos",region:"Região malar",location:"Nova América",value:2400,paid:false,finStatus:"Pendente",payMethod:"Pendente",notes:"Primeira sessão de Sculptra.",evolution:"Aguardar 4-6 semanas.",faceMap:null,photos:[],docs:[],intercorrencias:[],returnReminderDays:60}],
   sessions_packages:[{id:1,name:"Sculptra 3 sessões",total:3,done:1,value:7200,active:true,expiry:"12/2026"}],intercorrencias:[],planejamento:[{id:1,title:"Protocolo Bioestimulação",steps:["Sculptra sessão 1 ✓","Sculptra sessão 2","Sculptra sessão 3","Manutenção 6 meses"],notes:"Plano aprovado em 12/03/2026",done:false}],
   anamnese:{healthHistory:"Hipotireoidismo controlado",medications:"Levotiroxina 50mcg",smoking:"Ex-fumante",pregnancy:"Não",previousProcedures:"Botox (2023)",skinType:"Normal",fitzpatrick:"III",allergiesDetail:"Sem alergias.",contraindications:"Nenhuma",musicStyle:"MPB",importantAlerts:["Hipotireoidismo"]}},
  {id:4,name:"Juliana Pereira",age:41,birthDate:"1985-05-28",phone:"(11) 96543-2109",email:"juliana@email.com",cpf:"555.666.777-88",bloodType:"AB+",allergies:"Penicilina",since:"03/05/2026",status:"return",tags:["Retorno Pendente"],profilePhoto:null,lastVisit:"03/05/2026",nextReturn:"28/05/2026",complaints:["Linhas severas","Papada"],
   sessions:[],sessions_packages:[],intercorrencias:[],planejamento:[],
   anamnese:{healthHistory:"Diabetes tipo 2 controlada",medications:"Metformina 850mg",smoking:"Não",pregnancy:"Não",previousProcedures:"Nenhum",skinType:"Oleosa",fitzpatrick:"IV",allergiesDetail:"Alergia à penicilina — confirmada por teste.",contraindications:"Penicilínicos contraindicados",musicStyle:"Eletrônico",importantAlerts:["Penicilina","Diabetes"]}},
];
const INIT_AGENDA=[
  {id:1,patientName:"Ana Beatriz Martins",date:"2026-05-28",time:"09:00",procedure:"Toxina Botulínica",location:"Barra Olímpica",duration:"1 hora",value:850,status:"Realizado",obs:""},
  {id:2,patientName:"Camila R. Souza",date:"2026-05-28",time:"10:30",procedure:"Preenchimento Labial",location:"Barra Olímpica",duration:"1 hora",value:1200,status:"Realizado",obs:""},
  {id:3,patientName:"Fernanda Lopes",date:"2026-05-28",time:"14:00",procedure:"Bioestimulador de Colágeno",location:"Nova América",duration:"1h30",value:2400,status:"Confirmado",obs:""},
  {id:4,patientName:"Juliana Pereira",date:"2026-05-28",time:"15:30",procedure:"Avaliação Inicial",location:"Barra Olímpica",duration:"45 min",value:0,status:"Aguardando",obs:""},
  {id:5,patientName:"Renata Ferreira",date:"2026-05-29",time:"09:00",procedure:"Microagulhamento",location:"Barra Olímpica",duration:"1 hora",value:600,status:"Confirmado",obs:""},
  {id:6,patientName:"Larissa Mendes",date:"2026-05-30",time:"11:00",procedure:"Profhilo",location:"Nova América",duration:"45 min",value:1500,status:"Aguardando",obs:""},
  {id:7,patientName:"Ana Beatriz Martins",date:"2026-06-05",time:"10:00",procedure:"Revisão / Retoque",location:"Barra Olímpica",duration:"30 min",value:0,status:"Confirmado",obs:"Retorno pós botox"},
];
const INIT_EXPENSES=[
  {id:1,desc:"Aluguel Barra Olímpica",date:"2026-05-05",cat:"Aluguel",value:4800,status:"Pago",notes:""},
  {id:2,desc:"Reposição Botox Allergan",date:"2026-05-20",cat:"Produtos",value:4200,status:"Pago",notes:""},
  {id:3,desc:"Marketing Digital",date:"2026-05-10",cat:"Marketing",value:1500,status:"Pago",notes:""},
  {id:4,desc:"Contador Mensal",date:"2026-05-01",cat:"Outros",value:620,status:"Pago",notes:""},
  {id:5,desc:"Materiais Descartáveis",date:"2026-05-15",cat:"Produtos",value:890,status:"Pago",notes:""},
];
// ─── HELPERS & BASE UI ────────────────────────────────────────────────────────
const initials=n=>n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const fmtCurr=v=>"R$"+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:0});
const parseDMY=s=>{if(!s)return null;const[d,m,y]=s.split("/");return new Date(`${y}-${m}-${d}`);};
const daysBetween=(a,b)=>Math.floor((b-a)/(1000*60*60*24));
const todayISO=()=>new Date().toISOString().slice(0,10);

// ─── HELPERS DE ESTOQUE POR LOTE ────────────────────────────────────────────
function getAvailableLotes(products, productName) {
  if (!productName) return [];
  const prod = (products||[]).find(p => (typeof p === "string" ? p : (p.name||p)) === productName);
  if (!prod || !Array.isArray(prod.lotes)) return [];
  return prod.lotes.filter(l => l.qtd > 0);
}
function debitarLote(setProducts, productName, loteId, qtdUsada) {
  if (!productName || !loteId || !(Number(qtdUsada) > 0)) return;
  setProducts(prev => prev.map(p => {
    const pname = typeof p === "string" ? p : (p.name||p);
    if (pname !== productName) return p;
    const lotes = (p.lotes || []).map(l => {
      if (String(l.id) !== String(loteId)) return l;
      return { ...l, qtd: Math.max(0, l.qtd - Number(qtdUsada)) };
    });
    const totalQty = lotes.reduce((a, l) => a + l.qtd, 0);
    const min = p.min || 0;
    const status = totalQty === 0 ? "critical" : totalQty < min ? "low" : "ok";
    const mov = { id: Date.now(), tipo: "saida", qtd: Number(qtdUsada), loteId: String(loteId), data: new Date().toLocaleDateString("pt-BR"), obs: "Uso em sessão" };
    return { ...p, lotes, qty: totalQty, status, movimentacoes: [...(p.movimentacoes || []), mov] };
  }));
}


// ─── DATA HOOKS — localStorage only ─────────────────────────────────────────
// Remove fotos base64 antes de salvar para não estourar a cota do localStorage
function stripPhotos(data) {
  if (!Array.isArray(data)) return data;
  return data.map(item => {
    if (!item || typeof item !== "object") return item;
    const out = { ...item };
    if (typeof out.profilePhoto === "string" && out.profilePhoto.startsWith("data:"))
      out.profilePhoto = null;
    if (Array.isArray(out.sessions))
      out.sessions = out.sessions.map(s => ({
        ...s,
        photos: Array.isArray(s.photos)
          ? s.photos.filter(p => !(typeof p === "string" && p.startsWith("data:")))
          : (s.photos || [])
      }));
    return out;
  });
}

function useSupaTable(key, initFallback = []) {
  const lsKey = "hapro2_" + key;

  const [data, setDataRaw] = useState(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const ok = Array.isArray(parsed) ? parsed.length > 0
          : (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0);
        if (ok) return parsed;
      }
    } catch {}
    return initFallback;
  });

  const setData = useCallback((valOrFn) => {
    setDataRaw(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      try {
        localStorage.setItem(lsKey, JSON.stringify(stripPhotos(next)));
      } catch {
        // Quota cheia: limpa outras chaves hapro e tenta de novo
        try {
          Object.keys(localStorage)
            .filter(k => k.startsWith("hapro2_") && k !== lsKey)
            .forEach(k => localStorage.removeItem(k));
          localStorage.setItem(lsKey, JSON.stringify(stripPhotos(next)));
        } catch {}
      }
      return next;
    });
  }, [lsKey]);

  return [data, setData, false];
}

// useSettings: usa o mesmo mecanismo JSON
function useSettings(defaults) {
  const [data, setData, loading] = useSupaTable("settings", defaults);
  // Garante que data seja sempre um objeto (não array)
  const safeData = (data && !Array.isArray(data) && typeof data === "object") ? data : defaults;
  return [safeData, setData, loading];
}

// Compatibilidade: manter useLocalStorage para dados locais temporários
function useLocalStorage(key,init){
  const[val,setVal]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  const set=useCallback(v=>{const nv=typeof v==="function"?v(val):v;setVal(nv);try{localStorage.setItem(key,JSON.stringify(nv));}catch{};},[key]);
  return[val,set];
}

// ─── ERROR BOUNDARY (mostra o erro real em vez de tela branca) ────────────────
class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ this.setState({ info }); console.error("ErrorBoundary capturou:", error, info); }
  render(){
    if (this.state.error) {
      const h = createElement;
      return h("div", { style: { padding: 24, color: P.text, fontFamily: "monospace", whiteSpace: "pre-wrap", background: P.bg, minHeight: "100%" } },
        h("div", { style: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: P.red, marginBottom: 12 } }, "Ocorreu um erro nesta página"),
        h("div", { style: { fontSize: 13, marginBottom: 10 } }, String(this.state.error && this.state.error.message || this.state.error)),
        h("div", { style: { fontSize: 11, color: P.text3, marginBottom: 14 } }, (this.state.error && this.state.error.stack) || ""),
        h("div", { style: { fontSize: 11, color: P.text3 } }, (this.state.info && this.state.info.componentStack) || ""),
        h("button", { onClick: () => this.setState({ error: null, info: null }), style: { marginTop: 14, padding: "8px 16px", borderRadius: 8, border: `1px solid ${P.border}`, background: P.card, color: P.text, cursor: "pointer" } }, "Tentar novamente")
      );
    }
    return this.props.children;
  }
}
// ─── TELA DE LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const h = createElement;

  async function handleLogin() {
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError("E-mail ou senha incorretos.");
    else onLogin();
  }

  return h(Fragment, null,
    h("style", null, `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{background:${P.bg};color:${P.text};font-family:'DM Sans',sans-serif;}`),
    h("div", {
      style: {
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `radial-gradient(ellipse at 50% 0%, rgba(92,31,50,.35) 0%, ${P.bg} 65%)`,
      }
    },
      h("div", { style: { width: 380, padding: "48px 40px", background: P.bg2, border: `1px solid ${P.border}`, borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,.6)" } },
        h("div", { style: { textAlign: "center", marginBottom: 36 } },
          h("div", { style: { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, color: P.accent3, letterSpacing: ".04em", lineHeight: 1.1 } }, "HarmonizaPro"),
          h("div", { style: { fontSize: 11, color: P.text3, letterSpacing: ".16em", textTransform: "uppercase", marginTop: 6 } }, "Gestão de Clínica")
        ),
        h("div", { style: { marginBottom: 16 } },
          h("label", { style: { display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: P.text3, marginBottom: 7, fontWeight: 500 } }, "E-mail"),
          h("input", {
            type: "email", value: email,
            onChange: e => setEmail(e.target.value),
            onKeyDown: e => e.key === "Enter" && handleLogin(),
            placeholder: "seu@email.com",
            style: { width: "100%", background: P.bg3, border: `1px solid ${P.border}`, borderRadius: 8, padding: "11px 14px", color: P.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }
          })
        ),
        h("div", { style: { marginBottom: 24 } },
          h("label", { style: { display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: P.text3, marginBottom: 7, fontWeight: 500 } }, "Senha"),
          h("input", {
            type: "password", value: password,
            onChange: e => setPassword(e.target.value),
            onKeyDown: e => e.key === "Enter" && handleLogin(),
            placeholder: "••••••••",
            style: { width: "100%", background: P.bg3, border: `1px solid ${P.border}`, borderRadius: 8, padding: "11px 14px", color: P.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none" }
          })
        ),
        error && h("div", { style: { marginBottom: 16, padding: "10px 14px", background: "rgba(192,112,112,.12)", border: "1px solid rgba(192,112,112,.3)", borderRadius: 8, fontSize: 13, color: P.red } }, error),
        h("button", {
          onClick: handleLogin, disabled: loading,
          style: { width: "100%", padding: "13px", background: `linear-gradient(135deg,${P.rose},${P.gold})`, color: P.accent3, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: loading ? .7 : 1, letterSpacing: ".04em" }
        }, loading ? "Entrando..." : "Entrar"),
        h("div", { style: { marginTop: 24, textAlign: "center", fontSize: 12, color: P.text3 } }, "Acesso restrito — somente usuários autorizados.")
      )
    )
  );
}

function Avatar({name,size=40,idx=0,src=null}){
  if(src)return createElement("img",{src,alt:name,style:{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`2px solid ${P.border}`}});
  return createElement("div",{style:{width:size,height:size,borderRadius:"50%",background:avColors[idx%avColors.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.32,fontWeight:700,color:P.text3,flexShrink:0,border:`1px solid ${P.border}`}},initials(name));
}
function Card({children,style:s,onClick}){return createElement("div",{onClick,style:{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:20,transition:"all .18s",cursor:onClick?"pointer":"default",...s}},children);}
function Modal({open,onClose,title,children,width=520}){
  if(!open)return null;
  return createElement("div",{onClick:e=>{if(e.target===e.currentTarget)onClose();},style:{position:"fixed",inset:0,background:"rgba(10,5,7,.9)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}},
    createElement("div",{style:{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:16,padding:28,width,maxWidth:"96vw",maxHeight:"92vh",overflowY:"auto"}},
      createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}},
        createElement("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.accent3}},title),
        createElement("button",{onClick:onClose,style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:22}},"\u00d7")
      ),children
    )
  );
}
const IS={width:"100%",background:P.bg3,border:`1px solid ${P.border}`,borderRadius:8,padding:"9px 12px",color:P.text,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"};
function Inp({value,onChange,placeholder,type="text",style:s}){return createElement("input",{value,onChange:e=>onChange(e.target.value),placeholder,type,style:{...IS,...s}});}
function Sel({value,onChange,options}){return createElement("select",{value,onChange:e=>onChange(e.target.value),style:IS},options.map(o=>createElement("option",{key:o,value:o},o)));}
function TA({value,onChange,placeholder,rows=3}){return createElement("textarea",{value,onChange:e=>onChange(e.target.value),placeholder,rows,style:{...IS,resize:"vertical"}});}
function Btn({children,onClick,variant="primary",style:s,disabled=false}){
  const vs={primary:{background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none"},ghost:{background:"transparent",color:P.text2,border:`1px solid ${P.border}`},danger:{background:"rgba(192,112,112,.1)",color:P.red,border:"1px solid rgba(192,112,112,.2)"},sm:{background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none",padding:"5px 10px",fontSize:11}};
  return createElement("button",{onClick,disabled,style:{padding:"9px 20px",borderRadius:8,fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s",opacity:disabled?.5:1,...vs[variant],...s}},children);
}
function Field({label,children,half,third}){
  return createElement("div",{style:{marginBottom:14,flex:third?"0 0 calc(33% - 8px)":half?"0 0 calc(50% - 6px)":"1 1 100%"}},
    createElement("label",{style:{display:"block",fontSize:10,textTransform:"uppercase",letterSpacing:".12em",color:P.text3,marginBottom:6,fontWeight:500}},label),children);
}
function TabBar({tabs,active,onChange}){
  return createElement("div",{style:{display:"flex",gap:2,marginBottom:20,background:P.bg2,padding:4,borderRadius:10,border:`1px solid ${P.border}`,width:"fit-content",flexWrap:"wrap"}},
    tabs.map(t=>createElement("button",{key:t.k,onClick:()=>onChange(t.k),style:{padding:"7px 14px",borderRadius:7,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:"none",transition:"all .15s",background:active===t.k?P.rose:"transparent",color:active===t.k?P.accent3:P.text3}},t.l)));
}
function SectionHeader({title,sub,action}){
  return createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}},
    createElement("div",null,createElement("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:P.text,letterSpacing:".02em",lineHeight:1.1}},title),sub&&createElement("div",{style:{fontSize:13,color:P.text3,marginTop:5}},sub)),action);
}
function StatusBadge({status,cfg=PAT_STATUS_CFG}){const c=cfg[status]||cfg.active;return createElement("span",{style:{display:"inline-block",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:500,color:c.color,background:c.bg}},c.label);}
function AlertBadge({text,color=P.red}){return createElement("span",{style:{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color,background:color+"18",border:`1px solid ${color}44`,marginRight:6,marginBottom:4}},`⚠ ${text}`);}
function UploadZone({onFiles,accept="image/*",label,multiple=true}){
  const ref=useRef();
  const[drag,setDrag]=useState(false);
  return createElement("div",{onDragOver:e=>{e.preventDefault();setDrag(true);},onDragLeave:()=>setDrag(false),onDrop:e=>{e.preventDefault();setDrag(false);onFiles([...e.dataTransfer.files]);},onClick:()=>ref.current.click(),style:{border:`2px dashed ${drag?P.accent:P.border}`,borderRadius:10,padding:"14px",textAlign:"center",cursor:"pointer",background:drag?"rgba(157,119,97,.06)":P.bg3}},
    createElement("div",{style:{fontSize:18,marginBottom:4}},"📎"),
    createElement("div",{style:{fontSize:12,color:P.text3}},label||"Clique ou arraste"),
    createElement("input",{ref,type:"file",accept,multiple,onChange:e=>onFiles([...e.target.files]),style:{display:"none"}}));
}
// ─── FACE MAP ─────────────────────────────────────────────────────────────────
function FaceMap({mapType="botox",points={},onChange,readOnly=false}){
  const[active,setActive]=useState(null);
  const[inp,setInp]=useState("");
  const zones=ZONE_DEFS[mapType]||ZONE_DEFS.botox;
  const unit=mapType==="botox"?"U":"ml";
  const zColor=mapType==="botox"?P.rose:mapType==="filler"?"#7a5590":P.gold;
  function click(k){if(readOnly)return;setActive(k);setInp(String(points[k]||""));}
  function confirm(){if(!active)return;onChange({...points,[active]:Number(inp)||0});setActive(null);}
  const h=createElement;
  return h("div",{style:{position:"relative",display:"inline-block",userSelect:"none"}},
    h("svg",{width:260,height:280,viewBox:"0 0 260 280"},
      h("path",{d:"M108 235 Q108 268 130 272 Q152 268 152 235",fill:P.bg3,stroke:P.border,strokeWidth:"1"}),
      h("ellipse",{cx:130,cy:148,rx:82,ry:110,fill:P.bg3,stroke:P.border,strokeWidth:"1.5"}),
      h("ellipse",{cx:130,cy:40,rx:82,ry:32,fill:P.card2,stroke:P.border,strokeWidth:"1"}),
      h("path",{d:"M95 100 Q105 95 118 98",fill:"none",stroke:P.text3,strokeWidth:"1.5",strokeLinecap:"round"}),
      h("path",{d:"M142 98 Q155 95 165 100",fill:"none",stroke:P.text3,strokeWidth:"1.5",strokeLinecap:"round"}),
      h("ellipse",{cx:107,cy:110,rx:13,ry:6,fill:"none",stroke:P.accent2,strokeWidth:"1.2"}),
      h("circle",{cx:107,cy:110,r:3.5,fill:P.border}),
      h("ellipse",{cx:153,cy:110,rx:13,ry:6,fill:"none",stroke:P.accent2,strokeWidth:"1.2"}),
      h("circle",{cx:153,cy:110,r:3.5,fill:P.border}),
      h("path",{d:"M122 128 L117 155 Q130 160 143 155 L138 128",fill:"none",stroke:P.text3,strokeWidth:"1"}),
      h("path",{d:"M112 182 Q122 177 130 178 Q138 177 148 182 Q138 190 130 190 Q122 190 112 182Z",fill:P.border,stroke:P.accent2,strokeWidth:"1"}),
      h("path",{d:"M112 182 Q130 186 148 182",fill:"none",stroke:P.accent2,strokeWidth:"1"}),
      h("path",{d:"M110 205 Q130 225 150 205",fill:"none",stroke:P.text3,strokeWidth:"1"}),
      h("g",null,zones.map(z=>{
        const val=points[z.k]||0,isSet=val>0,isAct=active===z.k;
        return h("g",{key:z.k,onClick:()=>click(z.k),style:{cursor:readOnly?"default":"pointer"}},
          h("circle",{cx:z.cx,cy:z.cy,r:z.r,fill:isAct?"rgba(92,31,50,.5)":isSet?(zColor+"22"):"rgba(255,255,255,.03)",stroke:isAct?zColor:isSet?(zColor+"99"):P.border,strokeWidth:isAct?2:1.5,strokeDasharray:isSet||isAct?"none":"3,2"}),
          isSet?h("text",{x:z.cx,y:z.cy+4,textAnchor:"middle",fill:P.accent3,fontSize:9,fontWeight:600},(val+unit)):h("text",{x:z.cx,y:z.cy+4,textAnchor:"middle",fill:P.text3,fontSize:11},"+")
        );
      }))
    ),
    h("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}},
      zones.map(z=>h("div",{key:z.k,style:{position:"absolute",left:z.cx<130?Math.max(0,z.cx-z.r-52):z.cx+z.r+4,top:z.cy-7,fontSize:8,color:P.text3,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}},z.label))
    ),
    active&&!readOnly&&h("div",{style:{position:"absolute",bottom:-58,left:"50%",transform:"translateX(-50%)",background:P.bg2,border:`1px solid ${P.border}`,borderRadius:10,padding:"8px 14px",display:"flex",gap:8,alignItems:"center",zIndex:10,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}},
      h("span",{style:{fontSize:11,color:P.accent}},zones.find(z=>z.k===active)?.label),
      h("input",{value:inp,onChange:e=>setInp(e.target.value),onKeyDown:e=>e.key==="Enter"&&confirm(),autoFocus:true,style:{width:52,background:P.bg3,border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 8px",color:P.text,fontSize:13,outline:"none",textAlign:"center"}}),
      h("span",{style:{fontSize:11,color:P.text3}},unit),
      h("button",{onClick:confirm,style:{background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:600,cursor:"pointer"}},"OK"),
      h("button",{onClick:()=>{onChange({...points,[active]:0});setActive(null);},style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:14}},"×")
    )
  );
}
function FaceMapEditor({sessionMap,onChange,readOnly=false}){
  const[mt,setMt]=useState(sessionMap?.type||"botox");
  const points=sessionMap?.points||{};
  const types=[{k:"botox",l:"💉 Toxina"},{k:"filler",l:"✨ Preenchimento"},{k:"thread",l:"🧵 Fios"}];
  const total=Object.values(points).reduce((a,v)=>a+v,0);
  const unit=mt==="botox"?"U":"ml";
  const h=createElement;
  return h("div",null,
    !readOnly&&h("div",{style:{display:"flex",gap:6,marginBottom:14}},types.map(t=>h("button",{key:t.k,onClick:()=>{setMt(t.k);onChange({type:t.k,points:{}});},style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:mt===t.k?P.rose:"transparent",border:`1px solid ${mt===t.k?P.rose:P.border}`,color:mt===t.k?P.accent3:P.text3}},t.l))),
    h("div",{style:{display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}},
      h("div",{style:{paddingBottom:readOnly?0:64}},h(FaceMap,{mapType:mt,points,onChange:p=>onChange({type:mt,points:p}),readOnly})),
      h("div",{style:{flex:1,minWidth:140}},
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}},"Resumo"),
        Object.entries(points).filter(([,v])=>v>0).length===0
          ?h("div",{style:{fontSize:13,color:P.text3}},readOnly?"Nenhum ponto.":"Clique nos círculos.")
          :Object.entries(points).filter(([,v])=>v>0).map(([k,v])=>h("div",{key:k,style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${P.border}`,fontSize:12.5}},h("span",{style:{color:P.text2}},k.replace(/_/g," ")),h("span",{style:{color:P.accent3,fontWeight:600}},`${v}${unit}`))),
        total>0&&h("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4}},h("span",{style:{fontSize:12,color:P.text3}},"Total"),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent}},`${total}${unit}`))
      )
    )
  );
}
// ─── PLAN ANNOTATOR ───────────────────────────────────────────────────────────
// Salva anotações como dados estruturados para reedição posterior
function PlanAnnotator({initial,onSave,onClose}){
  const canvasRef=useRef();
  const overlayRef=useRef(); // canvas de preview ao desenhar shapes
  const imgRef=useRef(null);
  const h=createElement;

  // Estado das ferramentas
  const[tool,setTool]=useState("pen");
  const[color,setColor]=useState("#E1594A");
  const[size,setSize]=useState(3);
  const[drawing,setDrawing]=useState(false);
  const[textInput,setTextInput]=useState("");
  const[textPos,setTextPos]=useState(null);
  const[showTextBox,setShowTextBox]=useState(false);

  // Dados estruturados das anotações
  const[strokes,setStrokes]=useState(initial?.strokes||[]); // [{points,color,size}]
  const[shapes,setShapes]=useState(initial?.shapes||[]);    // [{type,x1,y1,x2,y2,color,size}]
  const[texts,setTexts]=useState(initial?.texts||[]);       // [{x,y,text,color,size}]
  const[baseImage,setBaseImage]=useState(initial?.baseImage||null);
  const[canvasW,setCanvasW]=useState(initial?.canvasW||800);
  const[canvasH,setCanvasH]=useState(initial?.canvasH||600);

  // Estado para undo
  const[undoStack,setUndoStack]=useState([]);
  const startRef=useRef(null);
  const currentStrokeRef=useRef([]);
  const hasImage=!!baseImage;

  // Dimensionar canvas
  function getCanvasSize(img){
    const maxW=Math.min(window.innerWidth*0.80,900);
    const maxH=Math.min(window.innerHeight*0.65,680);
    const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);
    return{w:Math.round(img.naturalWidth*scale),h:Math.round(img.naturalHeight*scale)};
  }

  // Redraw completo da cena
  function redraw(canvas,bImg,sStrokes,sShapes,sTexts){
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(bImg){const scale=Math.min(canvas.width/bImg.naturalWidth,canvas.height/bImg.naturalHeight);const dw=bImg.naturalWidth*scale,dh=bImg.naturalHeight*scale;const dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;ctx.drawImage(bImg,dx,dy,dw,dh);}
    // Strokes
    sStrokes.forEach(stroke=>{
      if(!stroke.points||stroke.points.length<2)return;
      ctx.beginPath();ctx.lineWidth=stroke.size;ctx.lineCap="round";ctx.lineJoin="round";
      ctx.strokeStyle=stroke.color;ctx.globalCompositeOperation="source-over";
      ctx.moveTo(stroke.points[0].x,stroke.points[0].y);
      stroke.points.forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.stroke();
    });
    // Shapes
    sShapes.forEach(sh=>{
      ctx.lineWidth=sh.size;ctx.strokeStyle=sh.color;ctx.fillStyle=sh.color;
      ctx.globalCompositeOperation="source-over";
      if(sh.type==="arrow"){
        ctx.beginPath();ctx.moveTo(sh.x1,sh.y1);ctx.lineTo(sh.x2,sh.y2);ctx.stroke();
        const angle=Math.atan2(sh.y2-sh.y1,sh.x2-sh.x1);
        const hs=Math.max(sh.size*3,14);
        ctx.beginPath();ctx.moveTo(sh.x2,sh.y2);
        ctx.lineTo(sh.x2-hs*Math.cos(angle-0.45),sh.y2-hs*Math.sin(angle-0.45));
        ctx.lineTo(sh.x2-hs*Math.cos(angle+0.45),sh.y2-hs*Math.sin(angle+0.45));
        ctx.closePath();ctx.fill();
      } else if(sh.type==="circle"){
        const rx=Math.abs(sh.x2-sh.x1)/2,ry=Math.abs(sh.y2-sh.y1)/2;
        const cx=sh.x1+(sh.x2-sh.x1)/2,cy=sh.y1+(sh.y2-sh.y1)/2;
        ctx.beginPath();ctx.ellipse(cx,cy,Math.max(rx,1),Math.max(ry,1),0,0,Math.PI*2);ctx.stroke();
      } else if(sh.type==="rect"){
        ctx.beginPath();ctx.strokeRect(sh.x1,sh.y1,sh.x2-sh.x1,sh.y2-sh.y1);
      } else if(sh.type==="highlight"){
        ctx.globalAlpha=0.28;ctx.fillStyle=sh.color;
        ctx.fillRect(sh.x1,sh.y1,sh.x2-sh.x1,sh.y2-sh.y1);
        ctx.globalAlpha=1;
      }
    });
    // Texts
    sTexts.forEach(t=>{
      const fs=Math.max(t.size*5,15);
      ctx.font=`bold ${fs}px DM Sans,sans-serif`;ctx.fillStyle=t.color;
      ctx.globalCompositeOperation="source-over";
      ctx.shadowColor="rgba(0,0,0,.85)";ctx.shadowBlur=5;
      ctx.fillText(t.text,t.x,t.y);ctx.shadowBlur=0;
    });
  }

  // Redraw quando dados mudam
  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    canvas.width=canvasW;canvas.height=canvasH;
    redraw(canvas,imgRef.current,strokes,shapes,texts);
  },[strokes,shapes,texts,canvasW,canvasH,baseImage]);

  // Carregar imagem base
  useEffect(()=>{
    if(!baseImage)return;
    const img=new Image();
    img.onload=()=>{
      imgRef.current=img;
      if(!initial?.canvasW){
        const{w,h}=getCanvasSize(img);
        setCanvasW(w);setCanvasH(h);
      } else {
        const canvas=canvasRef.current;
        if(canvas)redraw(canvas,img,strokes,shapes,texts);
      }
    };
    img.src=baseImage;
  },[baseImage]);

  function handleFileUpload(file){
    const r=new FileReader();
    r.onload=e=>{
      setBaseImage(e.target.result);
      setStrokes([]);setShapes([]);setTexts([]);setUndoStack([]);
    };
    r.readAsDataURL(file);
  }

  function getPos(e){
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width;
    const scaleY=canvas.height/rect.height;
    const src=e.touches?e.touches[0]:e;
    return{x:(src.clientX-rect.left)*scaleX,y:(src.clientY-rect.top)*scaleY};
  }

  function pushUndo(){setUndoStack(u=>[...u.slice(-15),{strokes:[...strokes],shapes:[...shapes],texts:[...texts]}]);}

  function undo(){
    if(!undoStack.length)return;
    const prev=undoStack[undoStack.length-1];
    setUndoStack(u=>u.slice(0,-1));
    setStrokes(prev.strokes);setShapes(prev.shapes);setTexts(prev.texts);
  }

  function onMouseDown(e){
    e.preventDefault();
    if(!hasImage)return;
    const pos=getPos(e);
    if(tool==="text"){setTextPos(pos);setShowTextBox(true);return;}
    pushUndo();
    setDrawing(true);
    startRef.current=pos;
    currentStrokeRef.current=[pos];
  }

  function onMouseMove(e){
    e.preventDefault();
    if(!drawing||!hasImage)return;
    const pos=getPos(e);
    const canvas=canvasRef.current;
    const ov=overlayRef.current;

    if(tool==="pen"){
      // Desenha incrementalmente no canvas principal
      const ctx=canvas.getContext("2d");
      const pts=currentStrokeRef.current;
      if(pts.length>0){
        ctx.beginPath();ctx.lineWidth=size;ctx.lineCap="round";ctx.lineJoin="round";
        ctx.strokeStyle=color;ctx.globalCompositeOperation="source-over";
        ctx.moveTo(pts[pts.length-1].x,pts[pts.length-1].y);
        ctx.lineTo(pos.x,pos.y);ctx.stroke();
      }
      currentStrokeRef.current=[...currentStrokeRef.current,pos];
    } else if(ov){
      // Shapes: preview no overlay canvas
      const octx=ov.getContext("2d");
      octx.clearRect(0,0,ov.width,ov.height);
      const sx=startRef.current.x,sy=startRef.current.y;
      octx.lineWidth=size;octx.strokeStyle=color;octx.fillStyle=color;
      if(tool==="arrow"){
        octx.beginPath();octx.moveTo(sx,sy);octx.lineTo(pos.x,pos.y);octx.stroke();
        const angle=Math.atan2(pos.y-sy,pos.x-sx);
        const hs=Math.max(size*3,14);
        octx.beginPath();octx.moveTo(pos.x,pos.y);
        octx.lineTo(pos.x-hs*Math.cos(angle-0.45),pos.y-hs*Math.sin(angle-0.45));
        octx.lineTo(pos.x-hs*Math.cos(angle+0.45),pos.y-hs*Math.sin(angle+0.45));
        octx.closePath();octx.fill();
      } else if(tool==="circle"){
        const rx=Math.abs(pos.x-sx)/2,ry=Math.abs(pos.y-sy)/2;
        const cx=sx+(pos.x-sx)/2,cy=sy+(pos.y-sy)/2;
        octx.beginPath();octx.ellipse(cx,cy,Math.max(rx,1),Math.max(ry,1),0,0,Math.PI*2);octx.stroke();
      } else if(tool==="rect"){
        octx.beginPath();octx.strokeRect(sx,sy,pos.x-sx,pos.y-sy);
      } else if(tool==="highlight"){
        octx.globalAlpha=0.32;octx.fillStyle=color;
        octx.fillRect(sx,sy,pos.x-sx,pos.y-sy);octx.globalAlpha=1;
      }
    }
  }

  function onMouseUp(e){
    e.preventDefault();
    if(!drawing||!hasImage)return;
    const pos=getPos(e);
    const ov=overlayRef.current;
    if(ov){const ctx=ov.getContext("2d");ctx.clearRect(0,0,ov.width,ov.height);}

    if(tool==="pen"){
      const pts=[...currentStrokeRef.current,pos];
      if(pts.length>1)setStrokes(s=>[...s,{id:Date.now(),points:pts,color,size}]);
      currentStrokeRef.current=[];
    } else {
      const sx=startRef.current.x,sy=startRef.current.y;
      if(Math.abs(pos.x-sx)>3||Math.abs(pos.y-sy)>3)
        setShapes(s=>[...s,{id:Date.now(),type:tool,x1:sx,y1:sy,x2:pos.x,y2:pos.y,color,size}]);
    }
    setDrawing(false);
  }

  function placeText(){
    if(!textInput.trim()||!textPos)return;
    pushUndo();
    setTexts(t=>[...t,{id:Date.now(),x:textPos.x,y:textPos.y,text:textInput,color,size}]);
    setTextInput("");setShowTextBox(false);setTextPos(null);
  }

  function handleSave(titleArg,notesArg,stepsArg){
    // Gera thumbnail
    const canvas=canvasRef.current;
    let thumbnail=null;
    if(canvas&&baseImage){
      const th=document.createElement("canvas");
      th.width=320;th.height=Math.round(320*(canvas.height/canvas.width));
      const tc=th.getContext("2d");tc.drawImage(canvas,0,0,th.width,th.height);
      thumbnail=th.toDataURL("image/jpeg",0.75);
    }
    onSave({baseImage,strokes,shapes,texts,canvasW,canvasH,thumbnail});
  }

  const TOOLS=[
    {k:"pen",icon:"✏️",label:"Lápis livre"},
    {k:"arrow",icon:"➜",label:"Seta"},
    {k:"circle",icon:"○",label:"Círculo"},
    {k:"rect",icon:"□",label:"Retângulo"},
    {k:"highlight",icon:"▬",label:"Destacar área"},
    {k:"text",icon:"T",label:"Texto"},
  ];
  const COLORS=["#E1594A","#F5A623","#F8E71C","#7ED321","#4A90E2","#B07FE8","#ffffff","#111111"];
  const SIZES=[{v:2,l:"S"},{v:4,l:"M"},{v:8,l:"G"}];

  return h("div",{style:{position:"fixed",inset:0,background:"rgba(8,4,6,.97)",zIndex:3000,display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 16px",overflow:"auto",gap:10}},
    // Header
    h("div",{style:{width:"100%",maxWidth:980,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3}},initial?"✎ Editar Planejamento":"🎯 Novo Planejamento com Foto"),
      h("div",{style:{display:"flex",gap:8}},
        h("button",{onClick:undo,disabled:!undoStack.length,style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:undoStack.length?P.text2:P.text3,cursor:undoStack.length?"pointer":"default",fontSize:13}},"↩ Desfazer"),
        h("button",{onClick:()=>handleSave(),style:{padding:"7px 18px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,cursor:"pointer",fontSize:13,fontWeight:600}},"💾 Salvar"),
        h("button",{onClick:onClose,style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:13}},"✕")
      )
    ),
    // Toolbar (só aparece se tiver imagem)
    hasImage&&h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",justifyContent:"center",padding:"8px 14px",background:P.bg2,borderRadius:10,border:`1px solid ${P.border}`,flexShrink:0}},
      h("div",{style:{display:"flex",gap:3}},
        TOOLS.map(t=>h("button",{key:t.k,onClick:()=>setTool(t.k),title:t.label,style:{width:34,height:34,borderRadius:7,border:`1px solid ${tool===t.k?P.rose:P.border}`,background:tool===t.k?P.rose:"transparent",color:tool===t.k?P.accent3:P.text2,cursor:"pointer",fontSize:t.k==="arrow"?16:13,fontWeight:700,fontFamily:"monospace"}},t.icon))
      ),
      h("div",{style:{width:1,height:26,background:P.border,margin:"0 3px"}}),
      h("div",{style:{display:"flex",gap:3}},
        COLORS.map(c=>h("button",{key:c,onClick:()=>setColor(c),style:{width:20,height:20,borderRadius:"50%",background:c,border:`2px solid ${color===c?P.accent3:"rgba(255,255,255,.2)"}`,cursor:"pointer",transform:color===c?"scale(1.2)":"none",transition:"transform .1s"}}))
      ),
      h("div",{style:{width:1,height:26,background:P.border,margin:"0 3px"}}),
      h("div",{style:{display:"flex",gap:3}},
        SIZES.map(s=>h("button",{key:s.v,onClick:()=>setSize(s.v),style:{width:28,height:28,borderRadius:6,fontSize:11,border:`1px solid ${size===s.v?P.rose:P.border}`,background:size===s.v?P.rose:"transparent",color:size===s.v?P.accent3:P.text2,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700}},s.l))
      ),
      h("div",{style:{width:1,height:26,background:P.border,margin:"0 3px"}}),
      h("label",{style:{display:"flex",alignItems:"center",gap:6,fontSize:12,color:P.accent,border:`1px solid rgba(157,119,97,.4)`,borderRadius:7,padding:"4px 10px",cursor:"pointer",background:"rgba(157,119,97,.06)"}},
        "🔄 Trocar foto",
        h("input",{type:"file",accept:"image/*",style:{display:"none"},onChange:e=>{if(e.target.files[0])handleFileUpload(e.target.files[0]);}})
      )
    ),
    // Canvas area
    h("div",{style:{position:"relative",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",flex:1,minHeight:0}},
      !hasImage
        ? h("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,width:480,height:320,border:`2px dashed ${P.border}`,borderRadius:14,cursor:"pointer",background:P.bg3,color:P.text3}},
            h("div",{style:{fontSize:48}},"📷"),
            h("div",{style:{fontSize:16,color:P.accent3,fontFamily:"'Cormorant Garamond',serif"}},"Selecionar foto da paciente"),
            h("div",{style:{fontSize:12,color:P.text3}},"Clique para carregar uma imagem"),
            h("input",{type:"file",accept:"image/*",style:{display:"none"},onChange:e=>{if(e.target.files[0])handleFileUpload(e.target.files[0]);}})
          )
        : h(Fragment,null,
            h("canvas",{
              ref:canvasRef,
              onMouseDown,onMouseMove,onMouseUp,
              onMouseLeave:e=>{if(drawing){onMouseUp(e);}},
              onTouchStart:onMouseDown,onTouchMove:onMouseMove,onTouchEnd:onMouseUp,
              style:{display:"block",borderRadius:10,border:`1px solid ${P.border}`,cursor:tool==="text"?"text":"crosshair",touchAction:"none",maxWidth:"100%",maxHeight:"65vh"}
            }),
            h("canvas",{
              ref:overlayRef,
              width:canvasW,height:canvasH,
              style:{position:"absolute",top:0,left:0,borderRadius:10,pointerEvents:"none",maxWidth:"100%",maxHeight:"65vh"}
            }),
            h("div",{style:{position:"absolute",bottom:8,right:8,display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.5)",borderRadius:8,padding:"4px 10px"}},
              h("div",{style:{width:10,height:10,borderRadius:"50%",background:color,flexShrink:0}}),
              h("span",{style:{fontSize:10,color:"rgba(255,255,255,.6)"}},TOOLS.find(t=>t.k===tool)?.label)
            )
          )
    ),
    // Text input modal
    showTextBox&&h("div",{style:{position:"fixed",inset:0,zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.6)"},onClick:()=>{setShowTextBox(false);setTextPos(null);}},
      h("div",{onClick:e=>e.stopPropagation(),style:{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,padding:20,minWidth:320,display:"flex",flexDirection:"column",gap:10}},
        h("div",{style:{fontSize:13,color:P.accent3}},"✍️ Texto da anotação"),
        h("input",{autoFocus:true,value:textInput,onChange:e=>setTextInput(e.target.value),onKeyDown:e=>e.key==="Enter"&&placeText(),placeholder:"Ex: Tratar aqui · Simetria · Volume",style:{padding:"9px 12px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text,fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif"}}),
        h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"}},
          h("button",{onClick:()=>{setShowTextBox(false);setTextPos(null);},style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:13}},"Cancelar"),
          h("button",{onClick:placeText,style:{padding:"7px 16px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,cursor:"pointer",fontSize:13,fontWeight:600}},"Colocar ✓")
        )
      )
    )
  );
}

function PhotoAnnotator({photo,onSave,onClose}){
  const canvasRef=useRef();
  const[tool,setTool]=useState("pen");
  const[color,setColor]=useState("#E1594A");
  const[size,setSize]=useState(3);
  const[drawing,setDrawing]=useState(false);
  const[history,setHistory]=useState([]);
  const[textInput,setTextInput]=useState("");
  const[textPos,setTextPos]=useState(null);
  const[showTextInput,setShowTextInput]=useState(false);
  const startRef=useRef(null);
  const lastRef=useRef(null);
  const imgRef=useRef(null);
  const h=createElement;

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const img=new Image();
    img.onload=()=>{
      imgRef.current=img;
      // Fit canvas to modal (max 900x700)
      const maxW=Math.min(window.innerWidth*0.82,900);
      const maxH=Math.min(window.innerHeight*0.72,700);
      const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);
      canvas.width=Math.round(img.naturalWidth*scale);
      canvas.height=Math.round(img.naturalHeight*scale);
      const ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      saveSnap();
    };
    img.src=photo.url;
  },[]);

  function saveSnap(){
    const canvas=canvasRef.current;
    if(!canvas)return;
    setHistory(h=>[...h.slice(-20),canvas.toDataURL()]);
  }

  function undo(){
    if(history.length<2)return;
    const prev=history[history.length-2];
    setHistory(h=>h.slice(0,-1));
    const img=new Image();
    img.onload=()=>{
      const canvas=canvasRef.current;
      const ctx=canvas.getContext("2d");
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
    };
    img.src=prev;
  }

  function getPos(e){
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width;
    const scaleY=canvas.height/rect.height;
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    return{x:(clientX-rect.left)*scaleX,y:(clientY-rect.top)*scaleY};
  }

  function onMouseDown(e){
    e.preventDefault();
    const pos=getPos(e);
    if(tool==="text"){setTextPos(pos);setShowTextInput(true);return;}
    setDrawing(true);
    startRef.current=pos;
    lastRef.current=pos;
    if(tool==="pen"||tool==="eraser"){
      const canvas=canvasRef.current;
      const ctx=canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(pos.x,pos.y);
    }
  }

  function onMouseMove(e){
    e.preventDefault();
    if(!drawing)return;
    const pos=getPos(e);
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    if(tool==="pen"){
      ctx.lineWidth=size;
      ctx.lineCap="round";
      ctx.lineJoin="round";
      ctx.strokeStyle=color;
      ctx.globalCompositeOperation="source-over";
      ctx.lineTo(pos.x,pos.y);
      ctx.stroke();
      lastRef.current=pos;
    } else if(tool==="eraser"){
      ctx.lineWidth=size*5;
      ctx.lineCap="round";
      ctx.lineJoin="round";
      ctx.globalCompositeOperation="destination-out";
      ctx.lineTo(pos.x,pos.y);
      ctx.stroke();
      lastRef.current=pos;
    } else {
      // Shapes: redraw from last snapshot to show preview
      if(history.length===0)return;
      const snap=history[history.length-1];
      const img=new Image();
      img.onload=()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        ctx.globalCompositeOperation="source-over";
        ctx.lineWidth=size;
        ctx.strokeStyle=color;
        ctx.fillStyle=color;
        const sx=startRef.current.x,sy=startRef.current.y;
        if(tool==="arrow"){
          // Line
          ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(pos.x,pos.y);ctx.stroke();
          // Arrowhead
          const angle=Math.atan2(pos.y-sy,pos.x-sx);
          const hs=Math.max(size*3,12);
          ctx.beginPath();
          ctx.moveTo(pos.x,pos.y);
          ctx.lineTo(pos.x-hs*Math.cos(angle-0.45),pos.y-hs*Math.sin(angle-0.45));
          ctx.lineTo(pos.x-hs*Math.cos(angle+0.45),pos.y-hs*Math.sin(angle+0.45));
          ctx.closePath();ctx.fill();
        } else if(tool==="circle"){
          const rx=Math.abs(pos.x-sx)/2,ry=Math.abs(pos.y-sy)/2;
          const cx=sx+(pos.x-sx)/2,cy=sy+(pos.y-sy)/2;
          ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.stroke();
        } else if(tool==="rect"){
          ctx.beginPath();ctx.strokeRect(sx,sy,pos.x-sx,pos.y-sy);
        }
      };
      img.src=snap;
    }
  }

  function onMouseUp(e){
    e.preventDefault();
    if(!drawing)return;
    setDrawing(false);
    saveSnap();
  }

  function placeText(){
    if(!textInput.trim()||!textPos)return;
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    const fs=Math.max(size*5,16);
    ctx.font=`bold ${fs}px DM Sans, sans-serif`;
    ctx.fillStyle=color;
    ctx.globalCompositeOperation="source-over";
    // Shadow for readability
    ctx.shadowColor="rgba(0,0,0,0.8)";
    ctx.shadowBlur=4;
    ctx.fillText(textInput,textPos.x,textPos.y);
    ctx.shadowBlur=0;
    setTextInput("");setShowTextInput(false);setTextPos(null);
    saveSnap();
  }

  function handleSave(){
    const canvas=canvasRef.current;
    // Flatten: draw on white bg to avoid transparency issues
    const out=document.createElement("canvas");
    out.width=canvas.width;out.height=canvas.height;
    const octx=out.getContext("2d");
    if(imgRef.current)octx.drawImage(imgRef.current,0,0,out.width,out.height);
    octx.drawImage(canvas,0,0);
    const dataUrl=out.toDataURL("image/jpeg",0.92);
    onSave({id:Date.now()+Math.random(),name:(photo.name||"foto")+"_anotada.jpg",type:"image/jpeg",url:dataUrl,date:new Date().toLocaleDateString("pt-BR"),annotated:true});
  }

  const TOOLS=[
    {k:"pen",icon:"✏️",label:"Lápis"},
    {k:"arrow",icon:"➜",label:"Seta"},
    {k:"circle",icon:"○",label:"Círculo"},
    {k:"rect",icon:"□",label:"Retângulo"},
    {k:"text",icon:"T",label:"Texto"},
    {k:"eraser",icon:"⌫",label:"Borracha"},
  ];
  const COLORS=["#E1594A","#F5A623","#F8E71C","#7ED321","#4A90E2","#9B59B6","#ffffff","#000000"];
  const SIZES=[{v:2,l:"Fino"},{v:4,l:"Médio"},{v:8,l:"Grosso"}];

  return h("div",{onClick:e=>e.target===e.currentTarget&&onClose(),style:{position:"fixed",inset:0,background:"rgba(8,4,6,.97)",zIndex:3000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"16px",overflow:"auto"}},
    // Header
    h("div",{style:{width:"100%",maxWidth:960,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexShrink:0}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3}},"✎ Anotação de Foto"),
      h("div",{style:{display:"flex",gap:8}},
        h("button",{onClick:undo,title:"Desfazer (Ctrl+Z)",style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text2,cursor:"pointer",fontSize:13}},"↩ Desfazer"),
        h("button",{onClick:handleSave,style:{padding:"7px 18px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,cursor:"pointer",fontSize:13,fontWeight:600}},"💾 Salvar Anotação"),
        h("button",{onClick:onClose,style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:13}},"✕ Cancelar")
      )
    ),
    // Toolbar
    h("div",{style:{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center",justifyContent:"center",padding:"10px 16px",background:P.bg2,borderRadius:12,border:`1px solid ${P.border}`,flexShrink:0}},
      // Tools
      h("div",{style:{display:"flex",gap:4}},
        TOOLS.map(t=>h("button",{key:t.k,onClick:()=>setTool(t.k),title:t.label,style:{width:36,height:36,borderRadius:8,border:`1px solid ${tool===t.k?P.rose:P.border}`,background:tool===t.k?P.rose:"transparent",color:tool===t.k?P.accent3:P.text2,cursor:"pointer",fontSize:t.k==="arrow"?16:14,fontWeight:700,fontFamily:"monospace"}},t.icon))
      ),
      h("div",{style:{width:1,height:28,background:P.border,margin:"0 4px"}}),
      // Colors
      h("div",{style:{display:"flex",gap:4}},
        COLORS.map(c=>h("button",{key:c,onClick:()=>setColor(c),style:{width:22,height:22,borderRadius:"50%",background:c,border:`2px solid ${color===c?P.accent3:P.border}`,cursor:"pointer",transform:color===c?"scale(1.2)":"scale(1)",transition:"transform .1s"}}))
      ),
      h("div",{style:{width:1,height:28,background:P.border,margin:"0 4px"}}),
      // Size
      h("div",{style:{display:"flex",gap:4}},
        SIZES.map(s=>h("button",{key:s.v,onClick:()=>setSize(s.v),style:{padding:"4px 10px",borderRadius:8,fontSize:11,border:`1px solid ${size===s.v?P.rose:P.border}`,background:size===s.v?P.rose:"transparent",color:size===s.v?P.accent3:P.text2,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},s.l))
      )
    ),
    // Canvas
    h("div",{style:{position:"relative",flexShrink:0}},
      h("canvas",{
        ref:canvasRef,
        onMouseDown,onMouseMove,onMouseUp,
        onMouseLeave:e=>{if(drawing){setDrawing(false);saveSnap();}},
        onTouchStart:onMouseDown,onTouchMove:onMouseMove,onTouchEnd:onMouseUp,
        style:{display:"block",borderRadius:10,border:`1px solid ${P.border}`,cursor:tool==="eraser"?"cell":tool==="text"?"text":"crosshair",touchAction:"none",maxWidth:"100%"}
      }),
      // Cursor de cor atual
      h("div",{style:{position:"absolute",bottom:10,right:10,width:18,height:18,borderRadius:"50%",background:color,border:"2px solid rgba(255,255,255,.4)",pointerEvents:"none"}})
    ),
    // Text input overlay
    showTextInput&&h("div",{style:{position:"fixed",inset:0,zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.5)"},onClick:()=>{setShowTextInput(false);setTextPos(null);}},
      h("div",{onClick:e=>e.stopPropagation(),style:{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,padding:20,display:"flex",flexDirection:"column",gap:10,minWidth:300}},
        h("div",{style:{fontSize:13,color:P.accent3,marginBottom:4}},"Digite o texto da anotação"),
        h("input",{autoFocus:true,value:textInput,onChange:e=>setTextInput(e.target.value),onKeyDown:e=>e.key==="Enter"&&placeText(),placeholder:"Ex: Tratar aqui · Assimetria",style:{padding:"9px 12px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text,fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif"}}),
        h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"}},
          h("button",{onClick:()=>{setShowTextInput(false);setTextPos(null);},style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:13}},"Cancelar"),
          h("button",{onClick:placeText,style:{padding:"7px 16px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,cursor:"pointer",fontSize:13,fontWeight:600}},"Colocar")
        )
      )
    ),
    // Tool tip
    h("div",{style:{marginTop:10,fontSize:11,color:P.text3,textAlign:"center",flexShrink:0}},
      tool==="pen"?"✏️ Clique e arraste para desenhar livremente"
      :tool==="arrow"?"➜ Clique e arraste para criar uma seta"
      :tool==="circle"?"○ Clique e arraste para criar um círculo/elipse"
      :tool==="rect"?"□ Clique e arraste para criar um retângulo"
      :tool==="text"?"T Clique na foto para posicionar o texto"
      :"⌫ Arraste sobre as anotações para apagar"
    )
  );
}

// ─── MEDIA GALLERY ─────────────────────────────────────────────────────────────
function MediaGallery({items,onAdd,onRemove,label,docMode=false}){
  const[preview,setPreview]=useState(null);
  const h=createElement;
  function addFiles(files){
    const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({id:Date.now()+Math.random(),name:f.name,type:f.type,url:e.target.result,date:new Date().toLocaleDateString("pt-BR")});r.readAsDataURL(f);}));
    Promise.all(readers).then(items=>onAdd(items));
  }
  function openFile(item){
    try{
      // Converte Data URL (base64) em Blob URL — mais confiável para abrir em nova aba/baixar
      const arr=item.url.split(",");
      const mimeMatch=arr[0].match(/:(.*?);/);
      const mime=mimeMatch?mimeMatch[1]:(item.type||"application/octet-stream");
      const bstr=atob(arr[1]);
      let n=bstr.length;
      const u8=new Uint8Array(n);
      while(n--){u8[n]=bstr.charCodeAt(n);}
      const blob=new Blob([u8],{type:mime});
      const blobUrl=URL.createObjectURL(blob);
      const win=window.open(blobUrl,"_blank");
      if(!win){
        // Pop-up bloqueado pelo navegador: oferece download direto como alternativa
        const a=document.createElement("a");
        a.href=blobUrl;a.download=item.name||"arquivo";
        document.body.appendChild(a);a.click();document.body.removeChild(a);
      }
      setTimeout(()=>URL.revokeObjectURL(blobUrl),60000);
    }catch(err){
      console.error("Erro ao abrir arquivo:",err);
      alert("Não foi possível abrir o arquivo. Tente baixá-lo novamente.");
    }
  }
  return h("div",null,
    h("div",{style:{marginBottom:12}},h(UploadZone,{onFiles:addFiles,accept:docMode?"image/*,.pdf,.doc,.docx":"image/*",label})),
    items.length===0?h("div",{style:{textAlign:"center",padding:20,color:P.text3,fontSize:13}},"Nenhum arquivo.")
    :h("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}},
      items.map(item=>h("div",{key:item.id,style:{borderRadius:8,overflow:"hidden",border:`1px solid ${P.border}`,background:P.card2,position:"relative"}},
        h("div",{onClick:()=>setPreview(item),style:{cursor:"pointer"}},
          item.type?.startsWith("image")?h("img",{src:item.url,alt:item.name,style:{width:"100%",height:70,objectFit:"cover",display:"block"}}):h("div",{style:{width:"100%",height:70,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,background:P.card}},"📄"),
          h("div",{style:{padding:"5px 7px"}},h("div",{style:{fontSize:9.5,color:P.text2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},item.name))
        ),
        onRemove&&h("button",{onClick:()=>onRemove(item.id),style:{position:"absolute",top:3,right:3,width:17,height:17,borderRadius:"50%",background:"rgba(0,0,0,.7)",border:"none",color:"#fff",fontSize:10,cursor:"pointer"}},"×")
      ))
    ),
    preview&&h("div",{onClick:()=>setPreview(null),style:{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out"}},
      preview.type?.startsWith("image")?h("img",{src:preview.url,alt:preview.name,onClick:e=>e.stopPropagation(),style:{maxWidth:"90vw",maxHeight:"90vh",borderRadius:8,objectFit:"contain"}}):h("div",{onClick:e=>e.stopPropagation(),style:{color:P.text,textAlign:"center"}},h("div",{style:{fontSize:48,marginBottom:12}},"📄"),h("div",null,preview.name),h("button",{onClick:()=>openFile(preview),style:{color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,padding:"8px 16px",fontSize:14,marginTop:12,cursor:"pointer"}},"Abrir / Baixar ↗"))
    )
  );
}
// ─── GLOBAL SEARCH ────────────────────────────────────────────────────────────
function GlobalSearch({patients,agenda,onSelectPatient,onNav}){
  const[q,setQ]=useState("");
  const[open,setOpen]=useState(false);
  const h=createElement;
  const results=useMemo(()=>{
    if(q.trim().length<2)return[];
    const s=q.toLowerCase();
    const out=[];
    patients.forEach(p=>{
      if(p.name.toLowerCase().includes(s)||p.phone.includes(s)||p.cpf.includes(s)||p.email.toLowerCase().includes(s))out.push({type:"paciente",label:p.name,sub:p.phone,id:p.id,pat:p});
      p.sessions?.forEach(sess=>{
        if(sess.procedure.toLowerCase().includes(s)||sess.notes?.toLowerCase().includes(s)||sess.product?.toLowerCase().includes(s))out.push({type:"sessão",label:`${p.name} — ${sess.procedure}`,sub:sess.date,id:p.id,pat:p});
      });
    });
    agenda.forEach(a=>{if(a.patientName.toLowerCase().includes(s)||a.procedure.toLowerCase().includes(s))out.push({type:"agenda",label:`${a.patientName} — ${a.procedure}`,sub:`${a.date} ${a.time}`,id:a.id});});
    return out.slice(0,10);
  },[q,patients,agenda]);
  const typeColor={paciente:P.accent,sessão:P.gold,agenda:"#7aaed4"};
  return h("div",{style:{position:"relative",flex:1,maxWidth:340}},
    h("div",{style:{position:"relative"}},
      h("span",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:P.text3,pointerEvents:"none"}},"🔍"),
      h("input",{value:q,onChange:e=>{setQ(e.target.value);setOpen(true);},onFocus:()=>setOpen(true),placeholder:"Busca inteligente... paciente, CPF, procedimento",style:{...IS,paddingLeft:36,width:"100%"}})
    ),
    open&&results.length>0&&h("div",{style:{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,zIndex:500,boxShadow:"0 8px 32px rgba(0,0,0,.5)",overflow:"hidden"}},
      results.map((r,i)=>h("div",{key:i,onClick:()=>{setOpen(false);setQ("");if(r.pat){onSelectPatient(r.pat);onNav("prontuario");}else onNav("agenda");},style:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${P.border}`},onMouseEnter:e=>e.currentTarget.style.background=P.card,onMouseLeave:e=>e.currentTarget.style.background="transparent"},
        h("span",{style:{fontSize:10,padding:"2px 7px",borderRadius:10,background:typeColor[r.type]+"22",color:typeColor[r.type],fontWeight:600,minWidth:50,textAlign:"center"}},r.type),
        h("div",null,h("div",{style:{fontSize:13,color:P.text}},r.label),h("div",{style:{fontSize:11,color:P.text3}},r.sub))
      ))
    ),
    open&&q&&results.length===0&&h("div",{style:{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,zIndex:500,padding:"14px",textAlign:"center",color:P.text3,fontSize:13}},"Nenhum resultado encontrado.")
  );
}
// ─── RETORNOS PENDENTES ───────────────────────────────────────────────────────
function RetornosPendentes({patients,returnRules,onSelectPatient,onNav,mini=false}){
  const h=createElement;
  const today=new Date();
  const[filter,setFilter]=useState("todos"); // todos | urgente | proximo | ok

  // Para cada paciente, pega a sessão mais recente e calcula o retorno esperado
  const retornos=useMemo(()=>{
    const list=[];
    patients.forEach(p=>{
      const sessions=(p.sessions||[]);
      if(sessions.length===0)return;
      // Sessão mais recente
      const last=[...sessions].sort((a,b)=>{
        const da=parseDMY(a.date)||new Date(0);
        const db=parseDMY(b.date)||new Date(0);
        return db-da;
      })[0];
      const sessDate=parseDMY(last.date);
      if(!sessDate)return;
      const diasDesde=daysBetween(sessDate,today);
      const returnDays=Number(last.returnReminderDays)||0;
      if(!returnDays)return; // sem prazo configurado
      const diasRestantes=returnDays-diasDesde;
      const retornoData=new Date(sessDate);
      retornoData.setDate(retornoData.getDate()+returnDays);

      // urgência
      let urgencia,urgLabel,urgColor,urgBg;
      if(diasRestantes<0){
        urgencia=0;urgLabel="Atrasada";urgColor=P.red;urgBg="rgba(192,112,112,.10)";
      }else if(diasRestantes<=7){
        urgencia=1;urgLabel="Esta semana";urgColor="#c4a96a";urgBg="rgba(196,169,106,.10)";
      }else if(diasRestantes<=30){
        urgencia=2;urgLabel="Este mês";urgColor="#7aaed4";urgBg="rgba(122,174,212,.10)";
      }else{
        urgencia=3;urgLabel="Em dia";urgColor:P.green;urgBg="rgba(122,173,138,.08)";
      }

      list.push({patient:p,last,diasDesde,diasRestantes,retornoData,urgencia,urgLabel,urgColor,urgBg,returnDays});
    });
    return list.sort((a,b)=>a.diasRestantes-b.diasRestantes);
  },[patients,returnRules]);

  const countUrgente=retornos.filter(r=>r.urgencia===0).length;
  const countProximo=retornos.filter(r=>r.urgencia===1||r.urgencia===2).length;

  const filtered=filter==="urgente"?retornos.filter(r=>r.urgencia===0)
    :filter==="proximo"?retornos.filter(r=>r.urgencia===1||r.urgencia===2)
    :filter==="ok"?retornos.filter(r=>r.urgencia===3)
    :retornos;

  // MODO MINI: widget do Dashboard
  if(mini){
    const urgent=retornos.filter(r=>r.urgencia===0||r.urgencia===1);
    if(urgent.length===0)return null;
    return h("div",{style:{marginBottom:14,padding:"14px 18px",background:"rgba(192,112,112,.07)",border:"1px solid rgba(192,112,112,.22)",borderRadius:12}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}},
        h("div",{style:{display:"flex",alignItems:"center",gap:8}},
          h("span",{style:{fontSize:18}},"⏰"),
          h("div",null,
            h("div",{style:{fontSize:13,color:P.red,fontWeight:700}},"Retornos Pendentes"),
            h("div",{style:{fontSize:11,color:P.text3}},`${countUrgente} atrasada${countUrgente!==1?"s":""} · ${countProximo} próxima${countProximo!==1?"s":""}`)
          )
        ),
        h("button",{onClick:()=>onNav("retornos"),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.3)`,borderRadius:8,padding:"4px 12px",cursor:"pointer"}},"Ver todas →")
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
        urgent.slice(0,4).map(r=>{
          const phone=(r.patient.phone||"").replace(/\D/g,"");
          const waMsg=encodeURIComponent(`Olá ${r.patient.name.split(" ")[0]}! 🌸 Passando para lembrar que está na hora do seu retorno. Que tal marcarmos? 😊`);
          return h("div",{key:r.patient.id,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:r.urgBg,borderRadius:8,border:`1px solid ${r.urgColor}33`}},
            h("div",{onClick:()=>{onSelectPatient(r.patient);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer",minWidth:0}},
              h(Avatar,{name:r.patient.name,size:28,src:r.patient.profilePhoto}),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:12.5,color:P.text,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},r.patient.name),
                h("div",{style:{fontSize:11,color:r.urgColor}},
                  r.diasRestantes<0?`Atrasada ${Math.abs(r.diasRestantes)} dias · ${r.last.procedure}`:`Em ${r.diasRestantes}d · ${r.last.procedure}`)
              )
            ),
            phone&&h("a",{href:`https://wa.me/55${phone}?text=${waMsg}`,target:"_blank",rel:"noreferrer",style:{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"rgba(106,196,130,.13)",border:"1px solid rgba(106,196,130,.3)",borderRadius:7,color:"#7aad8a",fontSize:11,fontWeight:600,textDecoration:"none",flexShrink:0}},"💬")
          );
        })
      )
    );
  }

  // MODO COMPLETO: página dedicada
  return h("div",null,
    h(SectionHeader,{title:"Retornos Pendentes",sub:"Pacientes que precisam voltar para manutenção ou revisão"}),
    // Resumo em cards
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}},
      [{l:"Atrasadas",v:retornos.filter(r=>r.urgencia===0).length,c:P.red,icon:"🔴",f:"urgente"},
       {l:"Esta semana",v:retornos.filter(r=>r.urgencia===1).length,c:"#c4a96a",icon:"🟡",f:"proximo"},
       {l:"Este mês",v:retornos.filter(r=>r.urgencia===2).length,c:"#7aaed4",icon:"🔵",f:"proximo"},
       {l:"Em dia",v:retornos.filter(r=>r.urgencia===3).length,c:P.green,icon:"🟢",f:"ok"}
      ].map(k=>h(Card,{key:k.l,onClick:()=>setFilter(f=>f===k.f?"todos":k.f),style:{cursor:"pointer",border:`1px solid ${filter===k.f?k.c:P.border}`,transition:"all .15s"}},
        h("div",{style:{fontSize:22,marginBottom:6}},k.icon),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:34,color:k.c,lineHeight:1}},k.v),
        h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},k.l)
      ))
    ),
    // Filtros
    h("div",{style:{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}},
      [{k:"todos",l:"Todas ("+retornos.length+")"},{k:"urgente",l:"🔴 Atrasadas"},{k:"proximo",l:"⏳ Próximas"},{k:"ok",l:"🟢 Em dia"}].map(f=>
        h("button",{key:f.k,onClick:()=>setFilter(f.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===f.k?P.rose:"transparent",border:`1px solid ${filter===f.k?P.rose:P.border}`,color:filter===f.k?P.accent3:P.text2}},f.l)
      )
    ),
    // Lista
    retornos.length===0
      ?h(Card,{style:{textAlign:"center",padding:40}},h("div",{style:{fontSize:32,marginBottom:12}},"✅"),h("div",{style:{color:P.text3,fontSize:14}},"Nenhum retorno pendente no momento."))
      :filtered.length===0
        ?h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:24,marginBottom:8}},"🔍"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma paciente nesta categoria."))
        :h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          filtered.map(r=>{
            const phone=(r.patient.phone||"").replace(/\D/g,"");
            const waMsg=encodeURIComponent(`Olá ${r.patient.name.split(" ")[0]}! 🌸 Passando para lembrar que está na hora do seu retorno pós ${r.last.procedure}. Que tal marcarmos um horário? 😊`);
            const retornoFormatted=r.retornoData.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
            return h(Card,{key:r.patient.id,style:{border:`1px solid ${r.urgColor}33`,background:r.urgBg}},
              h("div",{style:{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}},
                // Avatar + info principal
                h("div",{onClick:()=>{onSelectPatient(r.patient);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:200,cursor:"pointer"}},
                  h("div",{style:{position:"relative"}},
                    h(Avatar,{name:r.patient.name,size:44,src:r.patient.profilePhoto}),
                    h("div",{style:{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:r.urgColor,border:`2px solid ${P.bg2}`}})
                  ),
                  h("div",null,
                    h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},r.patient.name),
                    h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},`Último: ${r.last.procedure} em ${r.last.date}`)
                  )
                ),
                // Badges de status
                h("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
                  h("span",{style:{fontSize:11,padding:"4px 10px",borderRadius:12,background:r.urgColor+"18",color:r.urgColor,fontWeight:600,border:`1px solid ${r.urgColor}44`}},
                    `${r.urgLabel}`
                  ),
                  h("div",{style:{textAlign:"center",minWidth:80}},
                    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:r.urgColor,lineHeight:1}},
                      r.diasRestantes<0?`+${Math.abs(r.diasRestantes)}d`:r.diasRestantes===0?"Hoje":`${r.diasRestantes}d`
                    ),
                    h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase",letterSpacing:".08em"}},r.diasRestantes<0?"de atraso":"para o retorno")
                  ),
                  h("div",{style:{fontSize:11,color:P.text3,minWidth:100,textAlign:"center"}},
                    h("div",{style:{color:P.text2}},`Retorno previsto`),
                    h("div",{style:{color:P.text,fontWeight:500,fontSize:12,marginTop:2}},retornoFormatted)
                  ),
                  // Ações
                  phone&&h("a",{href:`https://wa.me/55${phone}?text=${waMsg}`,target:"_blank",rel:"noreferrer",style:{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",background:"rgba(106,196,130,.13)",border:"1px solid rgba(106,196,130,.3)",borderRadius:8,color:"#7aad8a",fontSize:12,fontWeight:600,textDecoration:"none",cursor:"pointer",flexShrink:0}},"💬 WhatsApp"),
                  h("button",{onClick:()=>{onSelectPatient(r.patient);onNav("prontuario");},style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text2,fontSize:12,cursor:"pointer"}},"Ver Prontuário")
                )
              )
            );
          })
        )
  );
}
// ─── ANIVERSARIANTES ─────────────────────────────────────────────────────────
function Aniversariantes({patients,onSelectPatient,onNav}){
  const h=createElement;
  const today=new Date();
  const[filterMonth,setFilterMonth]=useState(today.getMonth());
  function parseBirth(bd){if(!bd)return null;const d=new Date(bd+"T12:00");return isNaN(d)?null:d;}
  function calcAge(bd){const d=parseBirth(bd);if(!d)return null;let a=today.getFullYear()-d.getFullYear();const m=today.getMonth()-d.getMonth();if(m<0||(m===0&&today.getDate()<d.getDate()))a--;return a;}
  function daysUntil(bd){const d=parseBirth(bd);if(!d)return null;const n=new Date(today.getFullYear(),d.getMonth(),d.getDate());if(n<today)n.setFullYear(today.getFullYear()+1);return Math.ceil((n-today)/(1000*60*60*24));}
  function isToday(bd){const d=parseBirth(bd);if(!d)return false;return d.getMonth()===today.getMonth()&&d.getDate()===today.getDate();}
  const withBday=useMemo(()=>patients.filter(p=>p.birthDate).map(p=>{const d=parseBirth(p.birthDate);return{...p,_age:calcAge(p.birthDate),_days:daysUntil(p.birthDate),_isToday:isToday(p.birthDate),_month:d?d.getMonth():0,_day:d?d.getDate():0};}).sort((a,b)=>a._days-b._days),[patients]);
  const todayList=withBday.filter(p=>p._isToday);
  const weekList=withBday.filter(p=>!p._isToday&&p._days<=7);
  const byMonth=withBday.filter(p=>p._month===filterMonth);
  const noBday=patients.filter(p=>!p.birthDate);
  function card(p,highlight){
    const phone=(p.phone||"").replace(/\D/g,"");
    const bd=parseBirth(p.birthDate);
    const bdFmt=bd?String(bd.getDate()).padStart(2,"0")+"/"+String(bd.getMonth()+1).padStart(2,"0")+"/"+bd.getFullYear():"";
    const waMsg=encodeURIComponent("Olá "+p.name.split(" ")[0]+"! 🎂✨ Feliz aniversário! Que este novo ano seja repleto de saúde e beleza. 🌸");
    return h(Card,{key:p.id,style:{background:highlight?"linear-gradient(135deg,rgba(196,169,106,.16),rgba(196,169,106,.06))":P.card,border:"1px solid "+(highlight?"rgba(196,169,106,.5)":P.border),marginBottom:8,padding:"14px 18px"}},
      h("div",{style:{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}},
        h("div",{style:{position:"relative",flexShrink:0}},
          h(Avatar,{name:p.name,size:46,src:p.profilePhoto,idx:patients.indexOf(p)}),
          highlight&&h("div",{style:{position:"absolute",top:-4,right:-4,fontSize:16}},"🎂")
        ),
        h("div",{onClick:()=>{onSelectPatient(p);onNav("prontuario");},style:{flex:1,minWidth:180,cursor:"pointer"}},
          h("div",{style:{fontSize:14.5,color:P.text,fontWeight:600}},p.name),
          h("div",{style:{display:"flex",alignItems:"baseline",gap:8,marginTop:4,flexWrap:"wrap"}},
            h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:P.gold,lineHeight:1}},p._age!==null?p._age:"?"),
            p._age!==null&&h("span",{style:{fontSize:12,color:P.text3}},"anos"),
            bdFmt&&h("span",{style:{fontSize:12,color:P.text3}},"· 🎂 "+bdFmt),
            p.status==="vip"&&h("span",{style:{fontSize:10,color:P.gold,background:"rgba(196,169,106,.15)",padding:"2px 7px",borderRadius:10,fontWeight:600,marginLeft:4}},"VIP ✦")
          ),
          p._isToday?h("div",{style:{fontSize:12,color:P.yellow,fontWeight:600,marginTop:3}},"🎉 Hoje é o aniversário dela!")
            :p._days<=7?h("div",{style:{fontSize:12,color:"#c4a96a",marginTop:3}},"Em "+p._days+" dia"+(p._days>1?"s":""))
            :h("div",{style:{fontSize:12,color:P.text3,marginTop:3}},"Em "+p._days+" dias")
        ),
        h("div",{style:{display:"flex",gap:8,alignItems:"center",flexShrink:0}},
          h(StatusBadge,{status:p.status}),
          phone&&h("a",{href:"https://wa.me/55"+phone+"?text="+waMsg,target:"_blank",rel:"noreferrer",style:{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",background:"rgba(106,196,130,.13)",border:"1px solid rgba(106,196,130,.3)",borderRadius:8,color:"#7aad8a",fontSize:12,fontWeight:600,textDecoration:"none"}},"💬 Parabenizar")
        )
      )
    );
  }
  return h("div",null,
    h(SectionHeader,{title:"Aniversariantes",sub:"Idades calculadas automaticamente pela data de nascimento"}),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}},
      [{icon:"🎂",label:"Hoje",value:todayList.length,color:P.yellow},{icon:"🗓️",label:"Esta semana",value:weekList.length,color:"#7aaed4"},{icon:"📅",label:"Este mês",value:withBday.filter(p=>p._month===today.getMonth()).length,color:P.green},{icon:"📊",label:"Com data cadastrada",value:withBday.length,color:P.accent}]
      .map(k=>h(Card,{key:k.label,style:{textAlign:"center"}},h("div",{style:{fontSize:24,marginBottom:6}},k.icon),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:k.color,lineHeight:1}},k.value),h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},k.label)))
    ),
    todayList.length>0&&h("div",{style:{marginBottom:24}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.yellow,marginBottom:12}},"🎂 Aniversariantes de Hoje"),
      todayList.map(p=>card(p,true))
    ),
    weekList.length>0&&h("div",{style:{marginBottom:24}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#7aaed4",marginBottom:12}},"🗓️ Próximos 7 dias"),
      weekList.map(p=>card(p,false))
    ),
    h("div",{style:{marginBottom:16}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text,marginBottom:12}},"📅 Ver por mês"),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}},
        MONTH_NAMES.map((m,i)=>{
          const cnt=withBday.filter(p=>p._month===i).length;
          const isCur=i===today.getMonth();
          return h("button",{key:i,onClick:()=>setFilterMonth(i),style:{padding:"6px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filterMonth===i?P.rose:"transparent",border:"1px solid "+(filterMonth===i?P.rose:isCur?"rgba(196,169,106,.4)":P.border),color:filterMonth===i?P.accent3:isCur?P.yellow:P.text2}},
            m,cnt>0&&h("span",{style:{marginLeft:5,fontSize:10,fontWeight:700,color:filterMonth===i?P.accent3:P.gold,background:filterMonth===i?"rgba(255,255,255,.15)":"rgba(196,169,106,.15)",padding:"1px 5px",borderRadius:10}},cnt)
          );
        })
      ),
      byMonth.length===0
        ?h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:28,marginBottom:8}},"🎈"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma paciente com aniversário em "+MONTH_NAMES[filterMonth]+"."))
        :h("div",null,
            h("div",{style:{fontSize:12,color:P.text3,marginBottom:12}},byMonth.length+" aniversariante"+(byMonth.length>1?"s":"")+" em "+MONTH_NAMES[filterMonth]),
            byMonth.sort((a,b)=>a._day-b._day).map(p=>card(p,p._isToday))
          )
    ),
    noBday.length>0&&h("div",{style:{marginTop:8}},
      h("div",{style:{fontSize:13,color:P.text3,marginBottom:10,display:"flex",alignItems:"center",gap:6}},
        h("span",{style:{fontSize:11,padding:"2px 8px",borderRadius:10,background:"rgba(192,112,112,.12)",color:P.red,fontWeight:600}},noBday.length),
        " paciente"+(noBday.length>1?"s sem":" sem")+" data de nascimento cadastrada"
      ),
      h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
        noBday.map(p=>h("div",{key:p.id,onClick:()=>{onSelectPatient(p);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:P.card,border:"1px solid "+P.border,borderRadius:20,cursor:"pointer",fontSize:12,color:P.text2},onMouseEnter:e=>e.currentTarget.style.borderColor=P.accent,onMouseLeave:e=>e.currentTarget.style.borderColor=P.border},
          h(Avatar,{name:p.name,size:20,src:p.profilePhoto,idx:patients.indexOf(p)}),
          p.name.split(" ").slice(0,2).join(" ")
        ))
      )
    )
  );
}
// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({patients,agenda,onNav,onSelectPatient,settings,returnRules,isMobile=false,isTablet=false}){
  const today=new Date();
  const todayStr=today.toISOString().slice(0,10);
  const todayBirthdays=patients.filter(p=>{if(!p.birthDate)return false;const bd=new Date(p.birthDate+"T12:00");return bd.getMonth()===today.getMonth()&&bd.getDate()===today.getDate();});
  const allS=patients.flatMap(p=>p.sessions||[]);
  const totalRec=allS.filter(s=>s.paid).reduce((a,s)=>a+s.value,0);
  const totalPend=allS.filter(s=>!s.paid).reduce((a,s)=>a+s.value,0);
  const todayAppts=agenda.filter(a=>a.date===todayStr).sort((a,b)=>a.time.localeCompare(b.time));
  const months=[{m:"Dez",v:52},{m:"Jan",v:39},{m:"Fev",v:63},{m:"Mar",v:70},{m:"Abr",v:58},{m:"Mai",v:95}];
  const h=createElement;
  return h("div",null,
    h(SectionHeader,{title:`Olá, ${settings.doctorName||"Dra. Sofia"} 👋`,sub:today.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),action:h(Btn,{onClick:()=>onNav("agenda")},"＋ Novo Agendamento")}),
    // Alerts
    todayBirthdays.length>0&&h("div",{style:{marginBottom:14,padding:"16px 20px",background:"linear-gradient(135deg,rgba(196,169,106,.13),rgba(196,169,106,.06))",border:"1px solid rgba(196,169,106,.4)",borderRadius:14,boxShadow:"0 2px 16px rgba(196,169,106,.08)"}},
      h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12}},
        h("span",{style:{fontSize:26}},"🎂"),
        h("div",null,
          h("div",{style:{fontSize:14,color:P.yellow,fontWeight:700,letterSpacing:".02em"}},"Aniversariante(s) de Hoje!"),
          h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`${todayBirthdays.length} paciente${todayBirthdays.length>1?"s":""} fazendo aniversário`)
        )
      ),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:10}},
        todayBirthdays.map(p=>{
          const bd_=new Date(p.birthDate+"T12:00");let age=new Date().getFullYear()-bd_.getFullYear();const m_=new Date().getMonth()-bd_.getMonth();if(m_<0||(m_===0&&new Date().getDate()<bd_.getDate()))age--;
          const phone=p.phone?p.phone.replace(/\D/g,""):"";
          const waMsg=encodeURIComponent(`Olá ${p.name.split(" ")[0]}! 🎂 Feliz aniversário! Que seu dia seja incrível! 🌸`);
          return h("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"rgba(196,169,106,.1)",border:"1px solid rgba(196,169,106,.3)",borderRadius:12,flex:"1 1 auto",minWidth:220}},
            h("div",{onClick:()=>{onSelectPatient(p);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flex:1}},
              h(Avatar,{name:p.name,size:36,src:p.profilePhoto}),
              h("div",null,
                h("div",{style:{fontSize:13.5,color:P.text,fontWeight:600}},p.name),
                h("div",{style:{fontSize:12,color:P.yellow,marginTop:1}},`🎉 ${age} anos hoje!`)
              )
            ),
            phone&&h("a",{href:`https://wa.me/55${phone}?text=${waMsg}`,target:"_blank",rel:"noreferrer",style:{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:"rgba(106,196,130,.15)",border:"1px solid rgba(106,196,130,.35)",borderRadius:8,color:"#7aad8a",fontSize:11,fontWeight:600,textDecoration:"none",flexShrink:0,cursor:"pointer"}},"💬 WhatsApp")
          );
        })
      )
    ),
    h(RetornosPendentes,{patients,returnRules,onSelectPatient,onNav,mini:true}),
    // KPIs
    h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:isMobile?10:14,marginBottom:22}},
      [{l:"Receita do Mês",v:`R$${(totalRec/1000||48.2).toFixed(1)}k`,sub:"Sessões pagas",c:P.accent},{l:"Consultas Hoje",v:todayAppts.length,sub:`${todayAppts.filter(a=>a.status==="Realizado").length} realizadas`,c:P.rose2},{l:"Pacientes Ativos",v:patients.length,sub:"cadastrados",c:P.gold},{l:"A Receber",v:fmtCurr(totalPend||6800),sub:"pendências",c:"#7aaed4"}].map(k=>h(Card,{key:k.l,style:{position:"relative",overflow:"hidden"}},
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:k.c,lineHeight:1}},k.v),
        h("div",{style:{fontSize:11,color:P.text3,marginTop:6}},k.sub),
        h("div",{style:{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:k.c,opacity:.05}})
      ))
    ),
    h("div",{className:"resp-grid-21",style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}},
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:16}},"Receita — Últimos 6 Meses"),
        h("div",{style:{display:"flex",alignItems:"flex-end",gap:8,height:96}},
          months.map(m=>h("div",{key:m.m,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}},
            h("div",{style:{flex:1,display:"flex",alignItems:"flex-end",width:"100%"}},h("div",{style:{width:"100%",height:`${m.v}%`,background:m.m==="Mai"?`linear-gradient(to top,${P.rose},${P.gold})`:`linear-gradient(to top,rgba(92,31,50,.5),rgba(133,89,84,.2))`,borderRadius:"4px 4px 0 0"}})),
            h("div",{style:{fontSize:9,color:m.m==="Mai"?P.accent:P.text3,textTransform:"uppercase"}},m.m)
          ))
        )
      ),
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:12}},"Status Agenda Hoje"),
        Object.entries(APPT_STATUS_CFG).map(([st,cfg])=>{const n=todayAppts.filter(a=>a.status===st).length;if(!n)return null;return h("div",{key:st,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${P.border}`}},h("span",{style:{fontSize:12,color:P.text2}},st),h("span",{style:{fontSize:16,fontFamily:"'Cormorant Garamond',serif",color:cfg.color}},n));})
      )
    ),
    h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Agenda de Hoje"),
          h("button",{onClick:()=>onNav("agenda"),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.25)`,borderRadius:6,padding:"3px 10px",cursor:"pointer"}},"Ver tudo")
        ),
        todayAppts.length===0?h("div",{style:{color:P.text3,fontSize:13,textAlign:"center",padding:20}},"Nenhuma consulta hoje.")
        :todayAppts.map((a,i)=>{const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;return h("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 11px",marginBottom:6,background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
          h("div",{style:{width:6,height:6,borderRadius:"50%",background:sc.color,flexShrink:0}}),
          h("div",{style:{fontSize:11,color:P.accent,fontWeight:700,minWidth:36}},a.time),
          h("div",{style:{flex:1}},h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},a.patientName),h("div",{style:{fontSize:11,color:P.text3}},`${a.procedure} · 📍 ${a.location}`)),
          h("span",{style:{fontSize:10,padding:"2px 7px",borderRadius:12,color:sc.color,background:sc.bg}},a.status)
        );})
      ),
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Pacientes — Atenção"),
        (()=>{
          const todayISO2=today.toISOString().slice(0,10);
          const computedGroups=patients.map(p=>{
            const d=parseDMY(p.lastVisit);
            const days=d?daysBetween(d,today):null;
            const hasUpcoming=agenda.some(a=>a.patientName===p.name&&a.date>=todayISO2&&a.date<=new Date(today.getTime()+30*864e5).toISOString().slice(0,10));
            const hadRecent=days!==null&&days<=60;
            const isInTreatment=hasUpcoming||hadRecent;
            return{...p,_days:days,_inTreatment:isInTreatment};
          });
          const groups=[
            {label:"Inativas +6 meses",patients:computedGroups.filter(p=>p._days!==null&&p._days>180&&p.status!=="vip"),color:P.red,icon:"🔴"},
            {label:"Retorno pendente +3m",patients:computedGroups.filter(p=>p._days!==null&&p._days>90&&p._days<=180&&p.status!=="vip"),color:P.yellow,icon:"🟡"},
            {label:"Em tratamento",patients:computedGroups.filter(p=>p._inTreatment&&p.status!=="vip"),color:"#7aaed4",icon:"🔵"},
            {label:"VIPs",patients:computedGroups.filter(p=>p.status==="vip"),color:P.gold,icon:"⭐"},
          ];
          return groups.map(r=>h("div",{key:r.label,style:{marginBottom:4}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`}},
              h("span",{style:{fontSize:12.5,color:P.text2}},`${r.icon} ${r.label}`),
              h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:r.color}},r.patients.length),
                r.patients.length>0&&h("button",{onClick:()=>onNav("pacientes"),style:{fontSize:10,color:r.color,background:r.color+"15",border:`1px solid ${r.color}33`,borderRadius:6,padding:"2px 8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"Ver todas →")
              )
            ),
            r.patients.length>0&&h("div",{style:{padding:"4px 0 8px"}},
              r.patients.slice(0,3).map(p=>{
                const d=parseDMY(p.lastVisit);const dias=d?daysBetween(d,today):null;
                return h("div",{key:p.id,onClick:()=>{onSelectPatient(p);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",cursor:"pointer",borderRadius:7,transition:"all .12s"},onMouseEnter:e=>e.currentTarget.style.background=P.bg3,onMouseLeave:e=>e.currentTarget.style.background="transparent"},
                  h(Avatar,{name:p.name,size:24,idx:patients.indexOf(p),src:p.profilePhoto}),
                  h("div",{style:{flex:1,minWidth:0}},
                    h("div",{style:{fontSize:12.5,color:P.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},p.name),
                    dias&&h("div",{style:{fontSize:10.5,color:r.color}},`há ${dias} dias`)
                  ),
                  h("span",{style:{fontSize:10,color:P.text3}},p.phone?.slice(0,9)||"")
                );
              }),
              r.patients.length>3&&h("div",{style:{fontSize:11,color:P.text3,padding:"4px 10px"}},`+ ${r.patients.length-3} mais...`)
            )
          ));
        })()
      )
    )
  );
}
// ─── PATIENT AUTOCOMPLETE ────────────────────────────────────────────────────
function PatientAutocomplete({value,onChange,patients}){
  const[open,setOpen]=useState(false);
  const[q,setQ]=useState(value||"");
  const ref=useRef();
  const h=createElement;
  const suggestions=useMemo(()=>{
    if(!q||q.length<1)return[];
    const s=q.toLowerCase();
    return patients.filter(p=>p.name.toLowerCase().includes(s)).slice(0,6);
  },[q,patients]);
  useEffect(()=>{setQ(value||"");},[value]);
  useEffect(()=>{
    function handleClick(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",handleClick);
    return()=>document.removeEventListener("mousedown",handleClick);
  },[]);
  return h("div",{ref,style:{position:"relative"}},
    h("input",{value:q,onChange:e=>{setQ(e.target.value);onChange(e.target.value,null);setOpen(true);},onFocus:()=>setOpen(true),placeholder:"Nome da paciente",style:{...{width:"100%",background:P.bg3,border:`1px solid ${P.border}`,borderRadius:8,padding:"9px 12px",color:P.text,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}}),
    open&&suggestions.length>0&&h("div",{style:{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:P.bg2,border:`1px solid ${P.border}`,borderRadius:10,zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,.5)",overflow:"hidden"}},
      suggestions.map(p=>h("div",{key:p.id,onMouseDown:e=>{e.preventDefault();setQ(p.name);onChange(p.name,p);setOpen(false);},style:{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",borderBottom:`1px solid ${P.border}`},onMouseEnter:e=>e.currentTarget.style.background=P.card,onMouseLeave:e=>e.currentTarget.style.background="transparent"},
        h(Avatar,{name:p.name,size:26,src:p.profilePhoto}),
        h("div",null,
          h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},p.name),
          h("div",{style:{fontSize:11,color:P.text3}},`${p.phone||""} · Última visita: ${p.lastVisit||"—"}`)
        ),
        p.status==="vip"&&h("span",{style:{marginLeft:"auto",fontSize:10,color:P.gold,background:"rgba(196,169,106,.15)",padding:"2px 7px",borderRadius:10}},"VIP ✦")
      ))
    )
  );
}

// ─── AGENDA ───────────────────────────────────────────────────────────────────
function Agenda({patients,agenda,setAgenda,procedures,proceduresFull,locations}){
  const[selDate,setSelDate]=useState(todayISO());
  const[viewMonth,setViewMonth]=useState({y:2026,m:4});
  const[viewMode,setViewMode]=useState("month");
  const[showNew,setShowNew]=useState(false);
  const[editItem,setEditItem]=useState(null);
  const blank={patientName:"",date:selDate,time:"09:00",procedure:procedures[0]||"",location:locations[0]||"",duration:"1 hora",value:"",status:"Confirmado",obs:""};
  const[form,setForm]=useState(blank);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const fvProcedure=v=>{
    const procObj=Array.isArray(proceduresFull)?proceduresFull.find(p=>(typeof p==="string"?p:(p.name||p))===v):null;
    const defVal=procObj&&typeof procObj==="object"&&procObj.defaultValue?procObj.defaultValue:"";
    setForm(p=>({...p,procedure:v,...(defVal&&!p.value?{value:String(defVal)}:{})}));
  };
  const h=createElement;
  const daysInMonth=new Date(viewMonth.y,viewMonth.m+1,0).getDate();
  const firstDow=new Date(viewMonth.y,viewMonth.m,1).getDay();
  const agendaDates=new Set(agenda.map(a=>a.date));
  function saveAppt(){
    if(editItem)setAgenda(prev=>prev.map(a=>a.id===editItem.id?{...a,...form,value:Number(form.value)||0}:a));
    else setAgenda(prev=>[...prev,{...form,id:Date.now(),value:Number(form.value)||0}]);
    setShowNew(false);setEditItem(null);
  }
  function delAppt(id){if(window.confirm("Excluir agendamento?"))setAgenda(prev=>prev.filter(a=>a.id!==id));}
  function cycleStatus(id){setAgenda(prev=>prev.map(a=>{if(a.id!==id)return a;const i=APPT_STATUS.indexOf(a.status);return{...a,status:APPT_STATUS[(i+1)%APPT_STATUS.length]};}));}
  function openEdit(a){setEditItem(a);setForm({...a,value:String(a.value)});setShowNew(true);}
  function prevMonth(){setViewMonth(v=>{const m=v.m-1<0?11:v.m-1,y=v.m-1<0?v.y-1:v.y;return{y,m};});}
  function nextMonth(){setViewMonth(v=>{const m=v.m+1>11?0:v.m+1,y=v.m+1>11?v.y+1:v.y;return{y,m};});}
  const dayAppts=agenda.filter(a=>a.date===selDate).sort((a,b)=>a.time.localeCompare(b.time));
  // Week view helpers
  const getWeekDays=(dateStr)=>{const d=new Date(dateStr+"T12:00");const dow=d.getDay();return Array.from({length:7},(_,i)=>{const nd=new Date(d);nd.setDate(d.getDate()-dow+i);return nd.toISOString().slice(0,10);});};
  const weekDays=getWeekDays(selDate);
  const HOURS=["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
  return h("div",null,
    h(SectionHeader,{title:"Agenda",sub:`${MONTH_NAMES[viewMonth.m]} ${viewMonth.y}`,action:h(Btn,{onClick:()=>{setEditItem(null);setForm({...blank,date:selDate});setShowNew(true);}},"＋ Novo")}),
    h("div",{style:{display:"flex",gap:8,marginBottom:16}},
      [{k:"month",l:"Mês"},{k:"week",l:"Semana"},{k:"day",l:"Dia"}].map(v=>h("button",{key:v.k,onClick:()=>setViewMode(v.k),style:{padding:"6px 16px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewMode===v.k?P.rose:"transparent",border:`1px solid ${viewMode===v.k?P.rose:P.border}`,color:viewMode===v.k?P.accent3:P.text2}},v.l))
    ),
    // ── VIEW DIA ──
    viewMode==="day"&&h("div",{style:{display:"grid",gridTemplateColumns:"60px 1fr",gap:0,background:P.bg2,borderRadius:12,border:`1px solid ${P.border}`,overflow:"hidden"}},
      h("div",{style:{borderRight:`1px solid ${P.border}`}},
        h("div",{style:{height:48,borderBottom:`1px solid ${P.border}`}},
          h("div",{style:{textAlign:"center",padding:"12px 4px",fontSize:11,color:P.text3}},new Date(selDate+"T12:00").toLocaleDateString("pt-BR",{weekday:"short",day:"numeric"}))
        ),
        HOURS.map(hr=>h("div",{key:hr,style:{height:64,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:6,fontSize:10,color:P.text3}},hr))
      ),
      h("div",null,
        h("div",{style:{height:48,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:8}},
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()-1);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:26,height:26,color:P.text2,cursor:"pointer",fontSize:13}},"‹"),
          h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,flex:1,textAlign:"center"}},new Date(selDate+"T12:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})),
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()+1);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:26,height:26,color:P.text2,cursor:"pointer",fontSize:13}},"›")
        ),
        h("div",{style:{position:"relative"}},
          HOURS.map(hr=>h("div",{key:hr,style:{height:64,borderBottom:`1px solid rgba(71,35,37,.2)`}})),
          agenda.filter(a=>a.date===selDate).map(a=>{
            const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
            const [hh]=a.time.split(":").map(Number);
            const top=(hh-7)*64+2;
            return h("div",{key:a.id,onClick:()=>openEdit(a),style:{position:"absolute",left:8,right:8,top,minHeight:58,background:`linear-gradient(135deg,${P.rose}22,${P.gold}11)`,border:`1px solid ${P.rose}66`,borderLeft:`3px solid ${sc.color}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",zIndex:2}},
              h("div",{style:{fontSize:12,color:P.accent,fontWeight:700}},a.time+" — "+a.patientName),
              h("div",{style:{fontSize:11,color:P.text2}},a.procedure),
              h("div",{style:{fontSize:10,color:P.text3}},"📍 "+a.location)
            );
          })
        )
      )
    ),
    // ── VIEW SEMANA ──
    viewMode==="week"&&h("div",{style:{background:P.bg2,borderRadius:12,border:`1px solid ${P.border}`,overflow:"hidden"}},
      h("div",{style:{display:"grid",gridTemplateColumns:"60px repeat(7,1fr)",borderBottom:`1px solid ${P.border}`}},
        h("div",{style:{padding:"12px 4px",display:"flex",alignItems:"center",justifyContent:"space-between",borderRight:`1px solid ${P.border}`,gap:2}},
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()-7);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:14,padding:0}},"‹"),
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()+7);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:14,padding:0}},"›")
        ),
        weekDays.map(ds=>{
          const isToday=ds===todayISO();const isSel=ds===selDate;
          const d=new Date(ds+"T12:00");
          return h("div",{key:ds,onClick:()=>setSelDate(ds),style:{padding:"10px 4px",textAlign:"center",borderRight:`1px solid ${P.border}`,cursor:"pointer",background:isSel?P.rose:isToday?"rgba(157,119,97,.1)":"transparent"}},
            h("div",{style:{fontSize:9.5,color:isSel?P.accent3:P.text3,textTransform:"uppercase",letterSpacing:".08em"}},["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:isSel?P.accent3:isToday?P.accent:P.text,marginTop:2}},d.getDate())
          );
        })
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"60px repeat(7,1fr)"}},
        h("div",{style:{borderRight:`1px solid ${P.border}`}},
          HOURS.map(hr=>h("div",{key:hr,style:{height:56,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:4,fontSize:9.5,color:P.text3}},hr))
        ),
        weekDays.map(ds=>h("div",{key:ds,style:{borderRight:`1px solid ${P.border}`,position:"relative"}},
          HOURS.map(hr=>h("div",{key:hr,style:{height:56,borderBottom:`1px solid rgba(71,35,37,.2)`}})),
          agenda.filter(a=>a.date===ds).map(a=>{
            const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
            const [hh]=a.time.split(":").map(Number);
            const top=(hh-7)*56+2;
            return h("div",{key:a.id,onClick:()=>openEdit(a),style:{position:"absolute",left:2,right:2,top,minHeight:50,background:`${P.rose}22`,border:`1px solid ${P.rose}55`,borderLeft:`2px solid ${sc.color}`,borderRadius:6,padding:"3px 5px",cursor:"pointer",zIndex:2,overflow:"hidden"}},
              h("div",{style:{fontSize:10,color:P.accent,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},a.time+" "+a.patientName),
              h("div",{style:{fontSize:9.5,color:P.text3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},a.procedure)
            );
          })
        ))
      )
    ),
    // ── VIEW MÊS ──
    viewMode==="month"&&h("div",{style:{display:"grid",gridTemplateColumns:"1fr 320px",gap:18}},
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},`${MONTH_NAMES[viewMonth.m]} ${viewMonth.y}`),
          h("div",{style:{display:"flex",gap:6}},
            h("button",{onClick:prevMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"‹"),
            h("button",{onClick:nextMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"›")
          )
        ),
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}},["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=>h("div",{key:d,style:{textAlign:"center",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",paddingBottom:6}},d))),
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}},
          [...Array(firstDow).fill(null).map((_,i)=>h("div",{key:"e"+i})),
          ...Array(daysInMonth).fill(null).map((_,i)=>{
            const d=i+1,ds=`${viewMonth.y}-${String(viewMonth.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const isSel=ds===selDate,hasApp=agendaDates.has(ds),isToday=ds===todayISO();
            const apptCount=agenda.filter(a=>a.date===ds).length;
            return h("div",{key:d,onClick:()=>setSelDate(ds),style:{textAlign:"center",padding:"9px 2px",borderRadius:8,cursor:"pointer",fontSize:13,position:"relative",color:isSel?"#160b0e":hasApp?P.text:P.text3,background:isSel?`linear-gradient(135deg,${P.rose},${P.gold})`:"transparent",border:`1px solid ${isToday&&!isSel?"rgba(157,119,97,.4)":"transparent"}`}},
              d,apptCount>0&&!isSel&&h("div",{style:{width:4,height:4,borderRadius:"50%",background:P.rose,position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)"}})
            );
          })]
        )
      ),
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},new Date(selDate+"T12:00").toLocaleDateString("pt-BR",{day:"numeric",month:"short"})),
          h("span",{style:{fontSize:12,color:P.text3}},`${dayAppts.length} consulta(s)`)
        ),
        dayAppts.length===0?h("div",{style:{color:P.text3,fontSize:13,textAlign:"center",padding:24}},"Nenhuma consulta.")
        :dayAppts.map(a=>{const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;return h("div",{key:a.id,style:{padding:"10px 12px",marginBottom:8,background:P.bg3,borderRadius:9,border:`1px solid ${P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6}},
            h("div",{style:{fontSize:11,color:P.accent,fontWeight:700,minWidth:36}},a.time),
            h("div",{style:{flex:1}},h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},a.patientName),h("div",{style:{fontSize:11,color:P.text3}},a.procedure),h("div",{style:{fontSize:10,color:P.text3}},"📍 "+a.location))
          ),
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("button",{onClick:()=>cycleStatus(a.id),style:{fontSize:10,padding:"3px 8px",borderRadius:12,color:sc.color,background:sc.bg,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"↻ "+a.status),
            h("div",{style:{display:"flex",gap:5}},
              h("button",{onClick:()=>openEdit(a),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
              h("button",{onClick:()=>{const novaData=window.prompt("Reagendar para qual data? (AAAA-MM-DD)",a.date);if(novaData&&novaData.match(/^\d{4}-\d{2}-\d{2}$/)){setAgenda(prev=>prev.map(ap=>ap.id===a.id?{...ap,date:novaData,status:"Reagendado"}:ap));setSelDate(novaData);}},style:{fontSize:11,color:"#9b7aad",background:"transparent",border:"1px solid rgba(155,122,173,.3)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"📅"),
              h("button",{onClick:()=>delAppt(a.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
            )
          )
        );}),
        h("button",{onClick:()=>{setEditItem(null);setForm({...blank,date:selDate});setShowNew(true);},style:{width:"100%",marginTop:6,padding:"8px",borderRadius:8,border:`1px dashed ${P.border}`,background:"transparent",color:P.text3,cursor:"pointer",fontSize:12}},"＋ Agendar neste dia")
      )
    ),
    h(Modal,{open:showNew,onClose:()=>{setShowNew(false);setEditItem(null);},title:editItem?"✎ Editar Agendamento":"✦ Novo Agendamento",width:540},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Paciente"},h(PatientAutocomplete,{value:form.patientName,onChange:(name,pat)=>{if(pat){setForm(p=>({...p,patientName:name,procedure:pat.sessions&&pat.sessions.length>0?pat.sessions[0].procedure:p.procedure,location:pat.sessions&&pat.sessions.length>0?pat.sessions[0].location:p.location}));}else{setForm(p=>({...p,patientName:name}));}},patients})),
        h(Field,{label:"Procedimento"},h(Sel,{value:form.procedure,onChange:fvProcedure,options:procedures})),
        h(Field,{label:"Data",half:true},h(Inp,{type:"date",value:form.date,onChange:fv("date")})),
        h(Field,{label:"Horário",half:true},h(Inp,{type:"time",value:form.time,onChange:fv("time")})),
        h(Field,{label:"Local",half:true},h(Sel,{value:form.location,onChange:fv("location"),options:locations})),
        h(Field,{label:"Duração",half:true},h(Sel,{value:form.duration,onChange:fv("duration"),options:["30 min","45 min","1 hora","1h30","2 horas"]})),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:form.value,onChange:fv("value"),placeholder:"0,00"})),
        h(Field,{label:"Status",half:true},h(Sel,{value:form.status,onChange:fv("status"),options:APPT_STATUS})),
        h(Field,{label:"Observações"},h(TA,{value:form.obs,onChange:fv("obs"),placeholder:"Anotações, avisos...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowNew(false);setEditItem(null);}},"Cancelar"),
        h(Btn,{onClick:saveAppt},editItem?"Salvar Alterações":"Confirmar")
      )
    )
  );
}
// ─── PATIENTS LIST ────────────────────────────────────────────────────────────
function Patients({patients,setPatients,onSelect,procedures,locations}){
  const[search,setSearch]=useState("");
  const[filter,setFilter]=useState("all");
  const[showNew,setShowNew]=useState(false);
  const blank={name:"",age:"",birthDate:"",phone:"",email:"",cpf:"",bloodType:"A+",allergies:"Nenhuma",complaints:"",skinType:"Normal",fitzpatrick:"II",healthHistory:"",medications:"",smoking:"Não",pregnancy:"Não",previousProcedures:"",allergiesDetail:"",contraindications:"",musicStyle:"Pop",status:"active",origem:"nova",indicadoPor:""};
  const[form,setForm]=useState(blank);
  function calcAgeFromBirth(dateStr){if(!dateStr)return"";const bd=new Date(dateStr+"T12:00");if(isNaN(bd))return"";const t=new Date();let age=t.getFullYear()-bd.getFullYear();const m=t.getMonth()-bd.getMonth();if(m<0||(m===0&&t.getDate()<bd.getDate()))age--;return age>=0?String(age):"";}
  function fvBirth(v){setForm(p=>({...p,birthDate:v,age:calcAgeFromBirth(v)}));}
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const[profPhoto,setProfPhoto]=useState(null);
  const today=new Date();
  const h=createElement;
  const filtersBtns=[{k:"all",l:"Todos"},{k:"vip",l:"VIP"},{k:"active",l:"Ativas"},{k:"treatment",l:"Tratamento"},{k:"return",l:"Retorno"},{k:"inactive",l:"Inativas"}];
  // Auto compute status based on activity
  const enhanced=patients.map(p=>{
    const d=parseDMY(p.lastVisit);const days=d?daysBetween(d,today):0;
    let autoStatus=p.status;
    if(d&&days>365&&p.status!=="vip")autoStatus="inactive";
    else if(d&&days>90&&p.status!=="vip"&&p.status!=="treatment")autoStatus="return";
    return{...p,_days:days,_autoStatus:autoStatus};
  });
  const visible=enhanced.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase())||p.phone.includes(search)||p.cpf?.includes(search);
    const mf=filter==="all"||(p._autoStatus||p.status)===filter;
    return ms&&mf;
  });
  function addPatient(){
    const np={id:Date.now(),...form,age:Number(form.age),profilePhoto:profPhoto,lastVisit:"—",nextReturn:"—",sessions:[],sessions_packages:[],intercorrencias:[],planejamento:[],
      complaints:form.complaints.split(",").map(s=>s.trim()).filter(Boolean),tags:[],
      anamnese:{healthHistory:form.healthHistory,medications:form.medications,smoking:form.smoking,pregnancy:form.pregnancy,previousProcedures:form.previousProcedures,skinType:form.skinType,fitzpatrick:form.fitzpatrick,allergiesDetail:form.allergiesDetail,contraindications:form.contraindications,musicStyle:form.musicStyle,importantAlerts:form.allergies&&form.allergies!=="Nenhuma"?[form.allergies]:[]}};
    setPatients(prev=>[...prev,{...np,origem:form.origem||"nova",indicadoPor:form.indicadoPor||""}]);setShowNew(false);setForm(blank);setProfPhoto(null);
  }
  return h("div",null,
    h(SectionHeader,{title:"Pacientes",sub:`${patients.length} pacientes cadastrados`,action:h(Btn,{onClick:()=>setShowNew(true)},"＋ Novo Paciente")}),
    h("div",{style:{display:"flex",gap:12,marginBottom:18,alignItems:"center",flexWrap:"wrap"}},
      h("input",{value:search,onChange:e=>setSearch(e.target.value),placeholder:"🔍 Buscar por nome, telefone, CPF...",style:{...IS,flex:1,minWidth:200,padding:"8px 14px"}}),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},filtersBtns.map(fi=>h("button",{key:fi.k,onClick:()=>setFilter(fi.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===fi.k?P.rose:"transparent",border:`1px solid ${filter===fi.k?P.rose:P.border}`,color:filter===fi.k?P.accent3:P.text2}},fi.l)))
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}},
      visible.map((p,i)=>{
        const bd_p=p.birthDate?new Date(p.birthDate+"T12:00"):null;
        let calcAge=p.age;if(bd_p&&!isNaN(bd_p)){let a=new Date().getFullYear()-bd_p.getFullYear();const m=new Date().getMonth()-bd_p.getMonth();if(m<0||(m===0&&new Date().getDate()<bd_p.getDate()))a--;calcAge=a;}
        const lastSess=(p.sessions||[]).length>0?[...(p.sessions||[])].sort((a,b)=>(parseDMY(b.date)||new Date(0))-(parseDMY(a.date)||new Date(0)))[0]:null;
        return h("div",{key:p.id,onClick:()=>onSelect(p),style:{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",background:P.card,border:`1px solid ${P.border}`,borderRadius:10,cursor:"pointer",transition:"all .18s"},onMouseEnter:e=>{e.currentTarget.style.borderColor=P.accent;e.currentTarget.style.transform="translateX(3px)";},onMouseLeave:e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.transform="";}},
          h(Avatar,{name:p.name,size:46,idx:i,src:p.profilePhoto}),
          h("div",{style:{flex:1,minWidth:0}},
            h("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:2}},
              h("div",{style:{fontSize:14,color:P.text,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},p.name),
              h(StatusBadge,{status:p._autoStatus||p.status})
            ),
            h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:3}},
              h("span",{style:{fontSize:12,color:P.text3}},(calcAge||p.age)+" anos"),
              bd_p&&!isNaN(bd_p)&&h("span",{style:{fontSize:12,color:P.text3}},"· 🎂 "+String(bd_p.getDate()).padStart(2,"0")+"/"+String(bd_p.getMonth()+1).padStart(2,"0")),
              p.phone&&h("span",{style:{fontSize:12,color:P.text3}},"· "+p.phone)
            ),
            h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:3}},
              h("span",{style:{fontSize:11.5,color:P.text2}},(p.sessions||[]).length+" sessão"+((p.sessions||[]).length!==1?"ões":"")),
              lastSess&&h("span",{style:{fontSize:11.5,color:P.text3}},"· "+lastSess.procedure),
              p.anamnese?.skinType&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"1px 6px",borderRadius:8}},p.anamnese.skinType)
            ),
            p._days>180?h("div",{style:{fontSize:11,color:P.red,marginTop:2}},`⚠ Inativa há ${p._days} dias`)
              :p._days>90?h("div",{style:{fontSize:11,color:P.yellow,marginTop:2}},`↩ Sem retorno há ${p._days} dias`)
              :lastSess?h("div",{style:{fontSize:11,color:P.text3,marginTop:1}},"Última visita: "+lastSess.date):null,
            p.allergies&&p.allergies!=="Nenhuma"&&h("div",{style:{fontSize:11,color:P.red,marginTop:2}},`⚠ Alergia: ${p.allergies}`)
          )
        );
      })
    ),
    h(Modal,{open:showNew,onClose:()=>setShowNew(false),title:"✦ Novo Paciente",width:620},
      h("div",{style:{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:14,background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},
        profPhoto?h("img",{src:profPhoto,alt:"foto",style:{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:`2px solid ${P.rose}`}}):h("div",{style:{width:64,height:64,borderRadius:"50%",background:P.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px dashed ${P.border}`}},"👤"),
        h(UploadZone,{onFiles:f=>f[0]&&setProfPhoto(URL.createObjectURL(f[0])),label:"Foto de perfil",multiple:false})
      ),
      h("div",{style:{fontSize:11,textTransform:"uppercase",letterSpacing:".12em",color:P.accent,borderBottom:`1px solid ${P.border}`,paddingBottom:8,marginBottom:14}},"Dados Pessoais"),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Nome Completo"},h(Inp,{value:form.name,onChange:fv("name"),placeholder:"Nome da paciente"})),
        h(Field,{label:"Idade",third:true},h(Inp,{value:form.age,onChange:fv("age"),placeholder:"32"})),
        h(Field,{label:"Data Nasc.",third:true},h(Inp,{type:"date",value:form.birthDate,onChange:fvBirth})),
        h(Field,{label:"Tipo Sang.",third:true},h(Sel,{value:form.bloodType,onChange:fv("bloodType"),options:BLOOD_TYPES})),
        h(Field,{label:"Telefone",half:true},h(Inp,{value:form.phone,onChange:fv("phone"),placeholder:"(11) 99999-9999"})),
        h(Field,{label:"E-mail",half:true},h(Inp,{value:form.email,onChange:fv("email"),placeholder:"email@email.com"})),
        h(Field,{label:"CPF"},h(Inp,{value:form.cpf,onChange:fv("cpf"),placeholder:"000.000.000-00"})),
        h(Field,{label:"Status"},h(Sel,{value:form.status,onChange:fv("status"),options:Object.keys(PAT_STATUS_CFG)})),
        h(Field,{label:"Alergias Conhecidas"},h(Inp,{value:form.allergies,onChange:fv("allergies"),placeholder:"Ex: Dipirona, Penicilina"})),
        h(Field,{label:"Detalhes das Alergias"},h(TA,{value:form.allergiesDetail,onChange:fv("allergiesDetail"),placeholder:"Tipo de reação...",rows:2})),
        h(Field,{label:"Contraindicações"},h(Inp,{value:form.contraindications,onChange:fv("contraindications"),placeholder:"Substâncias contraindicadas"})),
        h(Field,{label:"Tipo de Pele",half:true},h(Sel,{value:form.skinType,onChange:fv("skinType"),options:SKIN_TYPES})),
        h(Field,{label:"Fitzpatrick",half:true},h(Sel,{value:form.fitzpatrick,onChange:fv("fitzpatrick"),options:FITZPATRICK})),
        h(Field,{label:"Histórico de Saúde"},h(TA,{value:form.healthHistory,onChange:fv("healthHistory"),placeholder:"Doenças, cirurgias...",rows:2})),
        h(Field,{label:"Medicamentos"},h(Inp,{value:form.medications,onChange:fv("medications"),placeholder:"Medicamentos em uso"})),
        h(Field,{label:"Fumante",third:true},h(Sel,{value:form.smoking,onChange:fv("smoking"),options:["Não","Sim","Ex-fumante"]})),
        h(Field,{label:"Gestante",third:true},h(Sel,{value:form.pregnancy,onChange:fv("pregnancy"),options:["Não","Gestante","Lactante"]})),
        h(Field,{label:"🎵 Estilo Musical",third:true},h(Sel,{value:form.musicStyle,onChange:fv("musicStyle"),options:MUSIC_STYLES})),
        h(Field,{label:"Principais Queixas"},h(TA,{value:form.complaints,onChange:fv("complaints"),placeholder:"Separadas por vírgula",rows:2})),
        h(Field,{label:"Procedimentos Anteriores"},h(TA,{value:form.previousProcedures,onChange:fv("previousProcedures"),placeholder:"Histórico...",rows:2})),
        h(Field,{label:"Origem da Paciente"},h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},[{k:"nova",l:"🌟 Nova"},{k:"indicacao",l:"🤝 Indicação"},{k:"campanha",l:"📣 Campanha"},{k:"recorrente",l:"🔄 Recorrente"}].map(o=>h("button",{key:o.k,onClick:()=>setForm(p=>({...p,origem:o.k})),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:form.origem===o.k?P.rose:"transparent",border:`1px solid ${form.origem===o.k?P.rose:P.border}`,color:form.origem===o.k?P.accent3:P.text2}},o.l)))),
        form.origem==="indicacao"&&h(Field,{label:"Indicado(a) por"},h(Inp,{value:form.indicadoPor,onChange:fv("indicadoPor"),placeholder:"Nome de quem indicou"}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},
        h(Btn,{variant:"ghost",onClick:()=>setShowNew(false)},"Cancelar"),
        h(Btn,{onClick:addPatient},"Cadastrar Paciente")
      )
    )
  );
}
// ─── PATIENT DETAIL ───────────────────────────────────────────────────────────

// ─── SKINCARE TAB COMPONENT ──────────────────────────────────────────────────
function SkincareTab({patient,upd,skincareConfig}){
  const h=createElement;
  const sk=patient.skincare||{produtos:[],recomendacoes:"",adesao:"boa"};
  const [showSkForm,setShowSkForm]=useState(false);
  const [skForm,setSkForm]=useState({nome:"",frequencia:"Diário",periodo:"Manhã e Noite",obs:""});
  const [recText,setRecText]=useState(sk.recomendacoes||"");
  const FREQ=(skincareConfig&&skincareConfig.frequencias)||["Diário","Noturno","2x por semana","Semanal","Mensal","Conforme necessário"];
  const PERIODOS=["Manhã","Noite","Manhã e Noite","Conforme necessário"];
  const PRODS_SUGERIDOS=(skincareConfig&&skincareConfig.produtos)||["Vitamina C","Retinol","Ácido Glicólico","Ácido Hialurônico","Protetor Solar FPS 50+","Niacinamida","Peptídeos","Bakuchiol","AHA/BHA","Ceramidas","Água Micelar","Hidratante Facial"];
  const adesaoCor={ótima:P.green,boa:"#7aaed4",regular:P.yellow,baixa:P.red};
  function addProduto(){
    if(!skForm.nome)return;
    const novo={id:Date.now(),nome:skForm.nome,frequencia:skForm.frequencia,periodo:skForm.periodo,obs:skForm.obs,adesao:"regular",addedAt:new Date().toLocaleDateString("pt-BR")};
    upd(p=>({...p,skincare:{...(p.skincare||{}),produtos:[...(sk.produtos||[]),novo]}}));
    setSkForm({nome:"",frequencia:"Diário",periodo:"Manhã e Noite",obs:""});setShowSkForm(false);
  }
  function removeProduto(id){upd(p=>({...p,skincare:{...(p.skincare||{}),produtos:(sk.produtos||[]).filter(x=>x.id!==id)}}));}
  function toggleAdesao(id){
    const opts=["ótima","boa","regular","baixa"];
    upd(p=>({...p,skincare:{...(p.skincare||{}),produtos:(sk.produtos||[]).map(x=>{if(x.id!==id)return x;const i=opts.indexOf(x.adesao||"regular");return{...x,adesao:opts[(i+1)%opts.length]};})}}));
  }
  function saveRec(){upd(p=>({...p,skincare:{...(p.skincare||{}),recomendacoes:recText}}));}
  return h("div",null,
    h(SectionHeader,{title:"🧴 Skincare em Uso",sub:"Produtos domiciliares e adesão ao protocolo"}),
    h(Card,{style:{marginBottom:14}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Produtos em Uso"),
        h(Btn,{onClick:()=>setShowSkForm(v=>!v),style:{fontSize:12}},"＋ Adicionar Produto")
      ),
      showSkForm&&h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`,marginBottom:14}},
        h("div",{style:{marginBottom:10,fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text}},"Novo Produto"),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:10,marginBottom:10}},
          h("div",{style:{flex:"1 1 200px"}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:4}},"Produto"),
            h("input",{value:skForm.nome,onChange:e=>setSkForm(p=>({...p,nome:e.target.value})),list:"sk-sugestoes",placeholder:"Nome do produto...",style:{...IS,width:"100%"}}),
            h("datalist",{id:"sk-sugestoes"},PRODS_SUGERIDOS.map(s=>h("option",{key:s,value:s})))
          ),
          h("div",{style:{flex:"1 1 140px"}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:4}},"Frequência"),
            h("select",{value:skForm.frequencia,onChange:e=>setSkForm(p=>({...p,frequencia:e.target.value})),style:{...IS,width:"100%"}},FREQ.map(f=>h("option",{key:f,value:f},f)))
          ),
          h("div",{style:{flex:"1 1 160px"}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:4}},"Período"),
            h("select",{value:skForm.periodo,onChange:e=>setSkForm(p=>({...p,periodo:e.target.value})),style:{...IS,width:"100%"}},PERIODOS.map(p=>h("option",{key:p,value:p},p)))
          ),
          h("div",{style:{flex:"1 1 200px"}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:4}},"Observação"),
            h("input",{value:skForm.obs,onChange:e=>setSkForm(p=>({...p,obs:e.target.value})),placeholder:"Ex: aplicar após limpeza",style:{...IS,width:"100%"}})
          )
        ),
        h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"}},
          h(Btn,{variant:"ghost",onClick:()=>setShowSkForm(false),style:{fontSize:12}},"Cancelar"),
          h(Btn,{onClick:addProduto,style:{fontSize:12}},"Adicionar")
        )
      ),
      (sk.produtos||[]).length===0&&!showSkForm?h("div",{style:{textAlign:"center",padding:24,color:P.text3,fontSize:13}},"Nenhum produto cadastrado."):null,
      h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        (sk.produtos||[]).map(prod=>h("div",{key:prod.id,style:{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},
          h("div",{style:{fontSize:22,flexShrink:0}},"🧴"),
          h("div",{style:{flex:1}},
            h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},prod.nome),
            h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},prod.frequencia+" · "+prod.periodo+(prod.obs?" · "+prod.obs:"")),
            h("div",{style:{fontSize:11,color:P.text3,marginTop:1}},"Adicionado em "+prod.addedAt)
          ),
          h("button",{onClick:()=>toggleAdesao(prod.id),title:"Clique para alterar adesão",style:{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",background:"transparent",border:`1px solid ${adesaoCor[prod.adesao||"regular"]}44`,color:adesaoCor[prod.adesao||"regular"]}},"Adesão: "+(prod.adesao||"regular")),
          h("button",{onClick:()=>removeProduto(prod.id),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:16,padding:"4px"}},"×")
        ))
      )
    ),
    h(Card,null,
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:12}},"📝 Recomendações & Observações"),
      h("textarea",{value:recText,onChange:e=>setRecText(e.target.value),placeholder:"Ex: Introduzir retinol gradualmente, começar 2x/semana...",rows:5,style:{...IS,width:"100%",resize:"vertical"}}),
      h("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:8}},
        h(Btn,{onClick:saveRec,style:{fontSize:12}},"Salvar Recomendações")
      )
    )
  );
}

// ─── INDICAÇÕES TAB COMPONENT ────────────────────────────────────────────────
function IndicacoesTab({patient,patients,onSelectPatient,fmtCurr}){
  const h=createElement;
  const safePats=Array.isArray(patients)?patients:[];
  const indicados=safePats.filter(p=>p.id!==patient.id&&(p.indicadoPor||"").toLowerCase().trim()===(patient.name||"").toLowerCase().trim());
  const totalGerado=indicados.reduce((acc,p)=>acc+(p.sessions||[]).filter(s=>s.paid).reduce((a,s)=>a+s.value,0),0);
  const quemIndicou=safePats.find(p=>p.name&&patient.indicadoPor&&p.name.toLowerCase().trim()===patient.indicadoPor.toLowerCase().trim());
  return h("div",null,
    h(SectionHeader,{title:"🤝 Árvore de Indicações",sub:"Rastreio automático por nome do indicador"}),
    h(Card,{style:{marginBottom:14}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:12}},"Indicada por"),
      patient.indicadoPor
        ?h("div",{style:{display:"flex",alignItems:"center",gap:12}},
            h("div",{style:{fontSize:28}},"👤"),
            h("div",null,
              h("div",{style:{fontSize:15,color:P.text,fontWeight:600}},patient.indicadoPor),
              quemIndicou
                ?h("div",{onClick:()=>onSelectPatient&&onSelectPatient(quemIndicou),style:{fontSize:12,color:P.accent,marginTop:4,cursor:"pointer",textDecoration:"underline"}},"Ver prontuário →")
                :h("div",{style:{fontSize:12,color:P.text3,marginTop:4}},"Não cadastrada no sistema")
            )
          )
        :h("div",{style:{fontSize:13,color:P.text3}},"Nenhuma indicação registrada.")
    ),
    h(Card,{style:{marginBottom:14,border:`1px solid ${indicados.length>0?"rgba(122,174,212,.35)":P.border}`}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}},
        h("div",{style:{display:"flex",alignItems:"center",gap:10}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},patient.name.split(" ")[0]+" indicou"),
          indicados.length>0&&h("span",{style:{fontSize:12,fontWeight:700,color:"#7aaed4",background:"rgba(122,174,212,.15)",padding:"2px 10px",borderRadius:20}},indicados.length)
        ),
        indicados.length>0&&h("div",{style:{textAlign:"right"}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.green}},fmtCurr(totalGerado)),
          h("div",{style:{fontSize:11,color:P.text3}},"valor gerado")
        )
      ),
      indicados.length===0
        ?h("div",{style:{fontSize:13,color:P.text3}},`Nenhuma indicação registrada. Quando outra paciente cadastrar '${patient.name.split(" ")[0]}' como indicador, aparecerá aqui automaticamente.`)
        :h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          indicados.map((ind,i)=>{
            const val=(ind.sessions||[]).filter(s=>s.paid).reduce((a,s)=>a+s.value,0);
            const isLast=i===indicados.length-1;
            return h("div",{key:ind.id,style:{display:"flex",gap:12,paddingBottom:isLast?0:10,marginBottom:isLast?0:10,borderBottom:isLast?"none":`1px solid ${P.border}`}},
              h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:24,paddingTop:8}},
                h("div",{style:{fontSize:14,color:P.text3}},"├")
              ),
              h("div",{onClick:()=>onSelectPatient&&onSelectPatient(ind),style:{flex:1,display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:10,background:P.bg3,border:`1px solid ${P.border}`},onMouseEnter:e=>e.currentTarget.style.borderColor=P.accent,onMouseLeave:e=>e.currentTarget.style.borderColor=P.border},
                h(Avatar,{name:ind.name,size:36,src:ind.profilePhoto,idx:0}),
                h("div",{style:{flex:1}},
                  h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},ind.name),
                  h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},(ind.sessions||[]).length+" sessões · desde "+(ind.since||"—"))
                ),
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.green}},fmtCurr(val))
              )
            );
          })
        )
    ),
    indicados.length>0&&h(Card,{style:{background:"rgba(122,174,212,.05)",border:"1px solid rgba(122,174,212,.25)"}},
      h("div",{style:{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}},
        h("div",{style:{textAlign:"center"}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:"#7aaed4",lineHeight:1}},indicados.length),h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},"indicações")),
        h("div",{style:{textAlign:"center"}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:P.green,lineHeight:1}},fmtCurr(totalGerado)),h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},"valor gerado")),
        h("div",{style:{fontSize:13,color:P.text3,flex:1,fontStyle:"italic"}},"Excelente indicadora! Configure recompensas para incentivar ainda mais.")
      )
    )
  );
}

function PatientDetail({patient,patients,setPatients,onBack,procedures,proceduresFull,locations,products,setProducts,allProducts,returnRules,setIncomes,onSelectPatient,skincareConfig}){
  const[tab,setTab]=useState("prontuario");
  const[showNewS,setShowNewS]=useState(false);
  const[editSess,setEditSess]=useState(null);
  const[sessionFaceMap,setSessionFaceMap]=useState(null);
  const[editPat,setEditPat]=useState(false);
  const[showIntercorr,setShowIntercorr]=useState(null);
  const[showPlan,setShowPlan]=useState(false);
  const[planAnnotating,setPlanAnnotating]=useState(null); // null | "new" | planObj
  const[showNewPkg,setShowNewPkg]=useState(false);
  const[pkgForm,setPkgForm]=useState({name:"",procedure:"",total:4,price:"",notes:""});
  // ─ Orçamentos ─
  const[showOrc,setShowOrc]=useState(false);
  const[editOrc,setEditOrc]=useState(null);
  const blankOrc={title:"",items:[],value:"",status:"espera",obs:"",created:"",expiry:""};
  const[orcForm,setOrcForm]=useState(blankOrc);
  const[orcItemInput,setOrcItemInput]=useState("");
  const h=createElement;
  const today=new Date();
  const blankS={date:"",procedure:procedures[0]||"",product:products[0]||"",dose:"",region:"",location:locations[0]||"",value:"",payMethod:"Pix",parcelas:"1",finStatus:"Pendente",paid:false,notes:"",evolution:"",useFaceMap:false,returnReminderDays:14,loteId:"",qtdUsada:""};
  const[sForm,setSForm]=useState(blankS);
  const sfv=k=>v=>setSForm(p=>({...p,[k]:v}));
  // Auto-preenche prazo de retorno e valor ao trocar procedimento
  const sfvProcedure=v=>{
    const rule=(returnRules||[]).find(r=>r.procedure===v);
    const procObj=Array.isArray(proceduresFull)?proceduresFull.find(p=>(typeof p==="string"?p:(p.name||p))===v):null;
    const defVal=procObj&&typeof procObj==="object"&&procObj.defaultValue?procObj.defaultValue:"";
    setSForm(p=>({...p,procedure:v,returnReminderDays:rule?rule.revisionDays||rule.maintenanceDays:90,...(defVal?{value:String(defVal)}:{})}));
  };
  const[patForm,setPatForm]=useState({...patient,...patient.anamnese,complaints:(patient.complaints||[]).join(", ")});
  const pfv=k=>v=>setPatForm(p=>({...p,[k]:v}));
  const[icForm,setIcForm]=useState({type:"Edema",notes:"",conduct:"",date:""});
  const[planForm,setPlanForm]=useState({title:"",steps:"",notes:""});
  const totalSpent=(patient.sessions||[]).reduce((a,s)=>a+s.value,0);
  const tabs=[{k:"prontuario",l:"📋 Prontuário"},{k:"fichaRapida",l:"⚡ Ficha Rápida"},{k:"orcamentos",l:"💼 Orçamentos"},{k:"mapa",l:"🗺 Mapa"},{k:"intercorrencias",l:"⚠ Intercorr."},{k:"planejamento",l:"🎯 Planejamento"},{k:"anamnese",l:"📄 Anamnese"},{k:"galeria",l:"🖼 Fotos"},{k:"docs",l:"📎 Docs"},{k:"pacotes",l:"📦 Pacotes"},{k:"financeiro",l:"💰 Financeiro"},{k:"skincare",l:"🧴 Skincare"},{k:"indicacoes",l:"🤝 Indicações"}];
  function upd(fn){setPatients(prev=>prev.map(p=>p.id===patient.id?fn(p):p));}
  // Sincroniza sessão → incomes (fonte única de verdade)
  function syncIncome(sess,patName){
    if(!setIncomes)return;
    const sessKey="sess_"+sess.id;
    setIncomes(prev=>{
      const exists=prev.find(i=>i.sessRef===sessKey);
      if(sess.finStatus==="Cancelado"){
        // Remove income se existir
        return exists?prev.filter(i=>i.sessRef!==sessKey):prev;
      }
      const entry={
        id:exists?exists.id:Date.now(),
        sessRef:sessKey,
        desc:sess.procedure,
        patientName:patName||patient.name,
        date:sess.date,
        cat:"Sessão",
        value:Number(sess.value)||0,
        netValue:Number(sess.value)||0,
        payMethod:sess.payMethod||"Pendente",
        parcelas:sess.parcelas||1,
        status:sess.finStatus==="Pago"?"Pago":"Pendente",
        paid:sess.finStatus==="Pago",
        notes:sess.notes||"",
        auto:true,
      };
      return exists?prev.map(i=>i.sessRef===sessKey?entry:i):[...prev,entry];
    });
  }
  function savePat(){
    upd(p=>({...p,...patForm,age:Number(patForm.age),complaints:patForm.complaints.split(",").map(s=>s.trim()).filter(Boolean),
      anamnese:{...p.anamnese,healthHistory:patForm.healthHistory,medications:patForm.medications,smoking:patForm.smoking,pregnancy:patForm.pregnancy,previousProcedures:patForm.previousProcedures,skinType:patForm.skinType,fitzpatrick:patForm.fitzpatrick,allergiesDetail:patForm.allergiesDetail,contraindications:patForm.contraindications,musicStyle:patForm.musicStyle,importantAlerts:patForm.allergies&&patForm.allergies!=="Nenhuma"?[patForm.allergies]:[]}}));
    setEditPat(false);
  }
  function saveSession(){
    const _loteSel=(allProducts||[]).flatMap(p=>p.lotes||[]).find(l=>String(l.id)===String(sForm.loteId));
    const s={id:editSess?editSess.id:Date.now(),date:sForm.date||new Date().toLocaleDateString("pt-BR"),procedure:sForm.procedure,doctor:"Dra. Sofia",product:sForm.product,loteId:sForm.loteId||"",loteCodigo:_loteSel?.codigo||"",qtdUsada:sForm.qtdUsada||"",dose:sForm.dose,region:sForm.region,location:sForm.location,value:Number(sForm.value)||0,paid:sForm.finStatus==="Pago",finStatus:sForm.finStatus,payMethod:sForm.payMethod,parcelas:sForm.payMethod==="Cartão Crédito"?Number(sForm.parcelas)||1:1,notes:sForm.notes,evolution:sForm.evolution,faceMap:sForm.useFaceMap?sessionFaceMap:null,photos:editSess?editSess.photos:[],docs:editSess?editSess.docs:[],intercorrencias:editSess?editSess.intercorrencias:[],returnReminderDays:Number(sForm.returnReminderDays)||90};
    upd(p=>editSess?{...p,sessions:(p.sessions||[]).map(x=>x.id===s.id?s:x),lastVisit:s.date}:{...p,sessions:[s,...(p.sessions||[])],lastVisit:s.date});
    // Sincronizar com Financeiro automaticamente
    const patName=patient.name;
    if(s.finStatus!=="Cancelado"){
      setTimeout(()=>syncIncome(s,patName),0);
    }
    if(!editSess&&sForm.loteId&&Number(sForm.qtdUsada)>0){debitarLote(setProducts,sForm.product,sForm.loteId,sForm.qtdUsada);}
    setShowNewS(false);setEditSess(null);setSForm(blankS);setSessionFaceMap(null);
  }
  function toggleFinStatus(sessId,newSt){
    upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,finStatus:newSt,paid:newSt==="Pago"}:s)}));
    // Sincronizar com Financeiro
    const sess=(patient.sessions||[]).find(s=>s.id===sessId);
    if(sess)setTimeout(()=>syncIncome({...sess,finStatus:newSt,paid:newSt==="Pago"},patient.name),0);
  }
  function delSession(id){if(window.confirm("Excluir sessão?"))upd(p=>({...p,sessions:(p.sessions||[]).filter(s=>s.id!==id)}));}
  function addMedia(sessId,files,type){
    const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({id:Date.now()+Math.random(),name:f.name,type:f.type,url:e.target.result,date:new Date().toLocaleDateString("pt-BR")});r.readAsDataURL(f);}));
    Promise.all(readers).then(news=>{upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,[type]:[...(s[type]||[]),...news]}:s)}));});
  }
  function removeMedia(sessId,fid,type){upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,[type]:(s[type]||[]).filter(f=>f.id!==fid)}:s)}));}
  function saveIntercorrencia(sessId){
    const ic={id:Date.now(),...icForm,date:icForm.date||new Date().toLocaleDateString("pt-BR"),photos:[]};
    upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,intercorrencias:[...(s.intercorrencias||[]),ic]}:s),intercorrencias:[...(p.intercorrencias||[]),{...ic,sessId}]}));
    setShowIntercorr(null);setIcForm({type:"Edema",notes:"",conduct:"",date:""});
  }
  function addPlanejamento(){
    const pl={id:Date.now(),title:planForm.title,steps:planForm.steps.split("\n").filter(s=>s.trim()),notes:planForm.notes,done:false,created:new Date().toLocaleDateString("pt-BR"),annotation:null};
    upd(p=>({...p,planejamento:[...(p.planejamento||[]),pl]}));
    setShowPlan(false);setPlanForm({title:"",steps:"",notes:""});
  }
  function savePlanAnnotation(planId,annotData){
    upd(p=>({...p,planejamento:(p.planejamento||[]).map(pl=>pl.id===planId?{...pl,annotation:annotData,updatedAt:new Date().toLocaleDateString("pt-BR")}:pl)}));
    setPlanAnnotating(null);
  }
  function savePlanAnnotationNew(annotData){
    const pl={id:Date.now(),title:planForm.title||"Planejamento Visual",steps:planForm.steps.split("\n").filter(s=>s.trim()),notes:planForm.notes,done:false,created:new Date().toLocaleDateString("pt-BR"),annotation:annotData};
    upd(p=>({...p,planejamento:[...(p.planejamento||[]),pl]}));
    setPlanAnnotating(null);setShowPlan(false);setPlanForm({title:"",steps:"",notes:""});
  }
  function deletePlan(id){if(window.confirm("Excluir planejamento?"))upd(p=>({...p,planejamento:(p.planejamento||[]).filter(pl=>pl.id!==id)}));}

  function togglePlanStep(planId,stepIdx){
    upd(p=>({...p,planejamento:(p.planejamento||[]).map(pl=>{if(pl.id!==planId)return pl;const steps=[...pl.steps];steps[stepIdx]=steps[stepIdx].includes("✓")?steps[stepIdx].replace(" ✓",""):steps[stepIdx]+" ✓";return{...pl,steps};})}));
  }

  // ─── Orçamentos ───────────────────────────────────────────────────────────────
  function saveOrcamento(){
    const orc={id:editOrc?editOrc.id:Date.now(),title:orcForm.title,items:orcForm.items,value:Number(orcForm.value)||0,status:orcForm.status,obs:orcForm.obs,expiry:orcForm.expiry,created:editOrc?editOrc.created:new Date().toLocaleDateString("pt-BR"),convertedAt:editOrc?.convertedAt||null};
    upd(p=>({...p,orcamentos:editOrc?(p.orcamentos||[]).map(o=>o.id===orc.id?orc:o):[orc,...(p.orcamentos||[])]}));
    setShowOrc(false);setEditOrc(null);setOrcForm(blankOrc);setOrcItemInput("");
  }
  function deleteOrcamento(id){if(window.confirm("Excluir orçamento?"))upd(p=>({...p,orcamentos:(p.orcamentos||[]).filter(o=>o.id!==id)}));}
  function updateOrcStatus(id,status){upd(p=>({...p,orcamentos:(p.orcamentos||[]).map(o=>o.id===id?{...o,status}:o)}));}
  function converterEmTratamento(orc){
    const novasSessoes=(orc.items||[]).map((item,i)=>({id:Date.now()+i,date:new Date().toLocaleDateString("pt-BR"),procedure:item,doctor:"Dra. Sofia",product:"",dose:"",region:"",location:locations[0]||"",value:orc.items.length>0?Math.round(orc.value/orc.items.length):0,paid:false,finStatus:"Pendente",payMethod:"Pendente",parcelas:1,notes:"Gerado do orçamento: "+orc.title,evolution:"",faceMap:null,photos:[],docs:[],intercorrencias:[],returnReminderDays:90,lote:"",qtdUsada:""}));
    upd(p=>({...p,sessions:[...novasSessoes,...(p.sessions||[])],lastVisit:new Date().toLocaleDateString("pt-BR"),orcamentos:(p.orcamentos||[]).map(o=>o.id===orc.id?{...o,status:"aprovado",convertedAt:new Date().toLocaleDateString("pt-BR")}:o)}));
    // Criar lançamentos pendentes no Financeiro para cada sessão gerada
    setTimeout(()=>novasSessoes.forEach(s=>syncIncome(s,patient.name)),0);
    setTab("prontuario");
  }
  function addPackage(){
    if(!pkgForm.name||!pkgForm.procedure||!pkgForm.total)return;
    const pkg={id:Date.now(),name:pkgForm.name,procedure:pkgForm.procedure,total:Number(pkgForm.total),done:0,price:Number(pkgForm.price)||0,notes:pkgForm.notes,created:new Date().toLocaleDateString("pt-BR"),sessions:[]};
    upd(p=>({...p,sessions_packages:[...(p.sessions_packages||[]),pkg]}));
    setShowNewPkg(false);setPkgForm({name:"",procedure:"",total:4,price:"",notes:""});
  }
  function checkPackageSession(pkgId){
    upd(p=>({...p,sessions_packages:(p.sessions_packages||[]).map(pkg=>{if(pkg.id!==pkgId)return pkg;const done=Math.min(pkg.done+1,pkg.total);const session={id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),num:done};return{...pkg,done,sessions:[...(pkg.sessions||[]),session]};})}));
  }
  function uncheckPackageSession(pkgId){
    upd(p=>({...p,sessions_packages:(p.sessions_packages||[]).map(pkg=>{if(pkg.id!==pkgId||pkg.done<=0)return pkg;return{...pkg,done:pkg.done-1,sessions:(pkg.sessions||[]).slice(0,-1)};})}));
  }
  function deletePackage(pkgId){if(window.confirm("Excluir pacote?"))upd(p=>({...p,sessions_packages:(p.sessions_packages||[]).filter(pkg=>pkg.id!==pkgId)}));}
  const alertColors={alergia:P.red,hipertensão:"#c07070",diabetes:"#c4a96a",anticoagulante:"#9b7aad",gestante:"#d47090","lidocaína":P.red};
  function getAlertColor(txt){const t=txt.toLowerCase();for(const[k,v]of Object.entries(alertColors)){if(t.includes(k))return v;}return P.red;}
  return h("div",null,
    h("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:22}},
      h("button",{onClick:onBack,style:{background:`rgba(92,31,50,.12)`,border:`1px solid ${P.rose}`,borderRadius:8,padding:"7px 14px",color:P.accent,cursor:"pointer",fontSize:13}},"← Voltar"),
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.text}},"Ficha da Paciente"),
      h("div",{style:{marginLeft:"auto",display:"flex",gap:8}},
        h(Btn,{variant:"ghost",onClick:()=>setEditPat(true),style:{fontSize:12,padding:"6px 14px"}},"✎ Editar"),
        h(Btn,{variant:"danger",onClick:()=>{if(window.confirm("Excluir paciente?"))setPatients(prev=>prev.filter(p=>p.id!==patient.id));onBack();},style:{fontSize:12,padding:"6px 14px"}},"🗑 Excluir")
      )
    ),
    // Header card
    h(Card,{style:{marginBottom:18}},
      h("div",{style:{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}},
        h("div",{style:{position:"relative",flexShrink:0}},
          h(Avatar,{name:patient.name,size:70,idx:patient.id,src:patient.profilePhoto}),
          h("div",{onClick:()=>document.getElementById(`pp-${patient.id}`).click(),style:{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:P.rose,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,border:`2px solid ${P.bg2}`}},"✎"),
          h("input",{id:`pp-${patient.id}`,type:"file",accept:"image/*",style:{display:"none"},onChange:e=>{if(e.target.files[0])upd(p=>({...p,profilePhoto:URL.createObjectURL(e.target.files[0])}));}})
        ),
        h("div",{style:{flex:1,minWidth:200}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.text}},patient.name),
            h(StatusBadge,{status:patient.status})
          ),
          h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",marginBottom:6}},
            h("span",{style:{fontSize:13,color:P.text3}},(()=>{const bd=patient.birthDate?new Date(patient.birthDate+"T12:00"):null;let age=patient.age;if(bd&&!isNaN(bd)){let a=new Date().getFullYear()-bd.getFullYear();const m=new Date().getMonth()-bd.getMonth();if(m<0||(m===0&&new Date().getDate()<bd.getDate()))a--;age=a;}return age+" anos";})()),
            h("span",{style:{fontSize:13,color:P.text3}},"Tipo "+patient.bloodType),
            h("span",{style:{fontSize:13,color:P.text3}},"Fitzpatrick "+patient.anamnese?.fitzpatrick),
            patient.birthDate&&h("span",{style:{fontSize:13,color:P.text3}},"🎂 "+(()=>{const bd=new Date(patient.birthDate+"T12:00");return String(bd.getDate()).padStart(2,"0")+"/"+String(bd.getMonth()+1).padStart(2,"0")+"/"+bd.getFullYear();})()),
            patient.since&&h("span",{style:{fontSize:13,color:P.text3}},"Desde "+patient.since)
          ),
          h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",marginBottom:6}},
            patient.phone&&h("span",{style:{fontSize:12,color:P.text3}},"📞 "+patient.phone),
            patient.email&&h("span",{style:{fontSize:12,color:P.text3}},"✉ "+patient.email),
            patient.cpf&&h("span",{style:{fontSize:12,color:P.text3}},"CPF "+patient.cpf),
            patient.origem&&h("span",{style:{fontSize:11,padding:"2px 8px",borderRadius:10,background:"rgba(157,119,97,.12)",color:P.accent,border:"1px solid rgba(157,119,97,.2)"}},(()=>({nova:"🌟 Nova",indicacao:"🤝 Indicação",campanha:"📣 Campanha",recorrente:"🔄 Recorrente"})[patient.origem]||patient.origem)()),
            patient.indicadoPor&&h("span",{style:{fontSize:12,color:P.text3}},"Ind. por: "+patient.indicadoPor)
          ),
          patient.anamnese?.musicStyle&&h("div",{style:{fontSize:12,color:P.text3,marginBottom:6}},`🎵 ${patient.anamnese.musicStyle}`),
          h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},(patient.complaints||[]).map(c=>h("span",{key:c,style:{fontSize:11,padding:"3px 9px",borderRadius:20,background:`rgba(92,31,50,.12)`,color:P.accent,border:`1px solid rgba(92,31,50,.25)`}},c)))
        ),
        h("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
          [{l:"Sessões",v:(patient.sessions||[]).length,c:P.accent},{l:"Total Investido",v:fmtCurr(totalSpent),c:P.green},{l:"Próx. Retorno",v:patient.nextReturn,c:"#7aaed4"}].map(s=>h("div",{key:s.l,style:{background:P.bg3,borderRadius:10,padding:"10px 16px",border:`1px solid ${P.border}`,textAlign:"center"}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:s.c,whiteSpace:"nowrap"}},s.v),h("div",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:3}},s.l)))
        ),
        h(Btn,{onClick:()=>{setEditSess(null);setSForm(blankS);setShowNewS(true);}},"＋ Nova Sessão")
      ),
      // IMPORTANT ALERTS
      (patient.anamnese?.importantAlerts||[]).length>0&&h("div",{style:{marginTop:14,padding:"10px 14px",background:"rgba(192,112,112,.08)",borderRadius:8,border:"1px solid rgba(192,112,112,.2)"}},
        h("div",{style:{fontSize:11,color:P.red,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6,fontWeight:600}},"⚠ Alertas Importantes"),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},(patient.anamnese.importantAlerts||[]).map((a,i)=>h(AlertBadge,{key:i,text:a,color:getAlertColor(a)})))
      ),
      patient.allergies&&patient.allergies!=="Nenhuma"&&!(patient.anamnese?.importantAlerts||[]).includes(patient.allergies)&&h("div",{style:{marginTop:10,padding:"8px 14px",background:"rgba(192,112,112,.06)",borderRadius:8,border:"1px solid rgba(192,112,112,.18)",display:"flex",alignItems:"center",gap:8}},
        h("span",null,"⚠️"),h("span",{style:{fontSize:13,color:P.red}},`Alergia registrada: `,h("strong",null,patient.allergies))
      )
    ),
    h(TabBar,{tabs,active:tab,onChange:setTab}),
    // ─── FICHA RÁPIDA TAB ────────────────────────────────────────────────────────
    tab==="fichaRapida"&&(()=>{
      const _sorted=[...(patient.sessions||[])].sort((a,b)=>(parseDMY(b.date)||new Date(0))-(parseDMY(a.date)||new Date(0)));
      const _last=_sorted[0]||null;
      const _ret=(()=>{if(!_last||!Number(_last.returnReminderDays))return null;const sd=parseDMY(_last.date);if(!sd)return null;const rd=new Date(sd);rd.setDate(rd.getDate()+Number(_last.returnReminderDays));const dias=Math.ceil((rd-new Date())/(1000*60*60*24));return{date:rd.toLocaleDateString("pt-BR"),dias,procedure:_last.procedure};})();
      const _pkgs=(patient.sessions_packages||[]).filter(pkg=>pkg.active!==false&&pkg.done<pkg.total);
      const _vouchers=(patient.vouchers||[]).filter(v=>!v.used&&(!v.expiry||parseDMY(v.expiry)>=new Date()));
      const _pending=(patient.sessions||[]).filter(s=>!s.paid).reduce((a,s)=>a+s.value,0);
      return h("div",null,
        h(Card,{style:{marginBottom:14,border:"1px solid rgba(192,112,112,.35)",background:"rgba(192,112,112,.04)"}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:14}},"⚡ Ficha Rápida"),
          h("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}},
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:"1px solid rgba(192,112,112,.3)"}},h("div",{style:{fontSize:10,color:P.red,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"❤️ Alergias"),h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},patient.allergies||"Nenhuma"),patient.anamnese?.allergiesDetail&&h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},patient.anamnese.allergiesDetail)),
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"🚭 Tabagismo"),h("div",{style:{fontSize:14,color:patient.anamnese?.smoking==="Sim"?P.red:P.text}},patient.anamnese?.smoking||"Não informado"),patient.anamnese?.pregnancy&&patient.anamnese.pregnancy!=="Não"&&h("div",{style:{fontSize:12,color:P.yellow,marginTop:4}},"⚠️ "+patient.anamnese.pregnancy)),
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"💊 Medicações"),h("div",{style:{fontSize:13,color:P.text}},patient.anamnese?.medications||"Nenhuma")),
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:`1px solid ${patient.anamnese?.contraindications&&patient.anamnese.contraindications!=="Nenhuma"?"rgba(192,112,112,.4)":P.border}`}},h("div",{style:{fontSize:10,color:patient.anamnese?.contraindications&&patient.anamnese.contraindications!=="Nenhuma"?P.red:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"⚠️ Contraindicações"),h("div",{style:{fontSize:13,color:P.text}},patient.anamnese?.contraindications||"Nenhuma")),
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"📅 Último Procedimento"),_last?h("div",null,h("div",{style:{fontSize:14,color:P.accent3}},_last.procedure),h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},_last.date+" · "+fmtCurr(_last.value||0))):h("div",{style:{fontSize:13,color:P.text3}},"Sem sessões")),
            h("div",{style:{padding:"14px",background:P.bg3,borderRadius:10,border:"1px solid rgba(196,169,106,.3)"}},h("div",{style:{fontSize:10,color:P.yellow,textTransform:"uppercase",letterSpacing:".12em",marginBottom:6,fontWeight:600}},"💰 Saldo em Aberto"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:_pending>0?P.yellow:P.green}},fmtCurr(_pending)),h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},(patient.sessions||[]).filter(s=>!s.paid).length+" sessão(ões) pendente(s)"))
          )
        ),
        h(Card,{style:{marginBottom:14,border:`1px solid ${_ret?(_ret.dias<0?"rgba(192,112,112,.4)":_ret.dias<=7?"rgba(196,169,106,.4)":"rgba(122,174,212,.3)"):P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:_ret?14:0}},h("span",{style:{fontSize:20}},"⏰"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Próximo Retorno")),
          _ret?h("div",{style:{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}},
            h("div",null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:40,color:_ret.dias<0?P.red:_ret.dias<=7?P.yellow:"#7aaed4",lineHeight:1}},_ret.dias<0?"+"+Math.abs(_ret.dias)+"d":_ret.dias+"d"),h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},_ret.dias<0?"de atraso":_ret.dias===0?"Hoje":"para o retorno")),
            h("div",null,h("div",{style:{fontSize:12,color:P.text3}},"Previsto para"),h("div",{style:{fontSize:16,color:P.text,fontWeight:600,marginTop:2}},_ret.date),h("div",{style:{fontSize:13,color:P.accent,marginTop:4}},_ret.procedure)),
            _ret.dias<0&&h("div",{style:{padding:"8px 14px",background:"rgba(192,112,112,.1)",border:"1px solid rgba(192,112,112,.25)",borderRadius:8,fontSize:12,color:P.red,fontWeight:500}},"⚠ Retorno em atraso — entre em contato!")
          ):h("div",{style:{fontSize:13,color:P.text3}},"Nenhum retorno configurado.")
        ),
        h(Card,{style:{marginBottom:14,border:`1px solid ${_pkgs.length>0?"rgba(157,119,97,.35)":P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:_pkgs.length>0?14:0}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},h("span",{style:{fontSize:20}},"📦"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Pacotes Ativos"),_pkgs.length>0&&h("span",{style:{fontSize:11,fontWeight:700,color:P.accent3,background:P.rose,padding:"2px 8px",borderRadius:20}},_pkgs.length)),
            h("button",{onClick:()=>setTab("pacotes"),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.3)`,borderRadius:8,padding:"4px 12px",cursor:"pointer"}},"Ver todos →")
          ),
          _pkgs.length===0?h("div",{style:{fontSize:13,color:P.text3}},"Nenhum pacote ativo.")
          :h("div",{style:{display:"flex",flexDirection:"column",gap:8}},_pkgs.map(pkg=>{const pct=Math.round((pkg.done/pkg.total)*100);return h("div",{key:pkg.id,style:{padding:"12px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}},h("div",null,h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},pkg.name),h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},pkg.procedure)),h("div",{style:{textAlign:"right"}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent}},pkg.done+"/"+pkg.total),h("div",{style:{fontSize:10,color:P.text3}},"sessões"))),h("div",{style:{height:5,borderRadius:3,background:P.border,overflow:"hidden"}},h("div",{style:{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${P.rose},${P.gold})`,borderRadius:3}})),h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:5}},h("span",{style:{fontSize:10,color:P.text3}},(pkg.total-pkg.done)+" restante(s)"),pkg.price>0&&h("span",{style:{fontSize:10,color:P.accent}},fmtCurr(pkg.price))));})
          )
        ),
        h(Card,{style:{border:`1px solid ${_vouchers.length>0?"rgba(155,122,173,.4)":P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:_vouchers.length>0?14:0}},h("span",{style:{fontSize:20}},"🎟️"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Vouchers Ativos"),_vouchers.length>0&&h("span",{style:{fontSize:11,fontWeight:700,color:"#fff",background:"#9b7aad",padding:"2px 8px",borderRadius:20}},_vouchers.length)),
          _vouchers.length===0?h("div",{style:{fontSize:13,color:P.text3}},"Nenhum voucher ativo.")
          :h("div",{style:{display:"flex",flexDirection:"column",gap:8}},_vouchers.map((v,i)=>h("div",{key:i,style:{padding:"12px 14px",background:"rgba(155,122,173,.07)",borderRadius:10,border:"1px solid rgba(155,122,173,.25)"}},h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},h("div",null,h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},v.code||v.name||"Voucher"),v.desc&&h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},v.desc)),h("div",{style:{textAlign:"right"}},v.value&&h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#9b7aad"}},typeof v.value==="number"?fmtCurr(v.value):v.value),v.expiry&&h("div",{style:{fontSize:10,color:P.text3,marginTop:2}},"Válido até "+v.expiry))))))
        )
      );
    })(),
    // ─── ORÇAMENTOS TAB ──────────────────────────────────────────────────────────
    tab==="orcamentos"&&h("div",null,
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}},
        h("div",null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Orçamentos"),h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},(patient.orcamentos||[]).length+" orçamento(s) no histórico")),
        h(Btn,{onClick:()=>{setEditOrc(null);setOrcForm(blankOrc);setShowOrc(true);}},"＋ Novo Orçamento")
      ),
      (patient.orcamentos||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},h("div",{style:{fontSize:32,marginBottom:12}},"💼"),h("div",{style:{color:P.text3,fontSize:14}},"Nenhum orçamento criado."),h(Btn,{style:{marginTop:16},onClick:()=>{setEditOrc(null);setOrcForm(blankOrc);setShowOrc(true);}},"Criar Primeiro Orçamento")),
      h("div",{style:{display:"flex",flexDirection:"column",gap:12}},
        (patient.orcamentos||[]).map(orc=>{
          const sCfg={aprovado:{color:P.green,bg:"rgba(122,173,138,.12)",label:"🟢 Aprovado"},espera:{color:P.yellow,bg:"rgba(196,169,106,.12)",label:"🟡 Em Espera"},recusado:{color:P.red,bg:"rgba(192,112,112,.12)",label:"🔴 Recusado"},expirado:{color:P.text3,bg:"rgba(107,77,74,.1)",label:"⚪ Expirado"}};
          const sc=sCfg[orc.status]||sCfg.espera;
          return h(Card,{key:orc.id,style:{border:`1px solid ${orc.status==="aprovado"?"rgba(122,173,138,.35)":orc.status==="recusado"?"rgba(192,112,112,.25)":P.border}`}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}},
              h("div",{style:{flex:1}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:4}},orc.title),h("div",{style:{fontSize:11,color:P.text3}},"Criado em "+orc.created+(orc.expiry?" · Expira em "+orc.expiry:"")),orc.convertedAt&&h("div",{style:{fontSize:11,color:P.green,marginTop:2}},"✓ Convertido em tratamento em "+orc.convertedAt)),
              h("span",{style:{fontSize:11,padding:"4px 10px",borderRadius:12,color:sc.color,background:sc.bg,border:`1px solid ${sc.color}33`,flexShrink:0}},sc.label)
            ),
            (orc.items||[]).length>0&&h("div",{style:{marginBottom:12}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}},"Procedimentos"),h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},(orc.items||[]).map((item,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:5,fontSize:12,padding:"4px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text}},h("span",{style:{color:P.green}},"☑"),item)))),
            h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}},
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.green}},fmtCurr(orc.value)),
              h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
                orc.status!=="aprovado"&&orc.status!=="recusado"&&h(Btn,{variant:"ghost",onClick:()=>updateOrcStatus(orc.id,"aprovado"),style:{fontSize:11,padding:"5px 10px",color:P.green,border:`1px solid ${P.green}44`}},"🟢 Aprovar"),
                orc.status!=="recusado"&&h(Btn,{variant:"ghost",onClick:()=>updateOrcStatus(orc.id,"recusado"),style:{fontSize:11,padding:"5px 10px",color:P.red,border:`1px solid ${P.red}44`}},"🔴 Recusar"),
                orc.status==="aprovado"&&!orc.convertedAt&&h(Btn,{onClick:()=>converterEmTratamento(orc),style:{fontSize:11,padding:"5px 12px",background:`linear-gradient(135deg,${P.green},#5aad7a)`}},"⚡ Converter em Tratamento"),
                h(Btn,{variant:"ghost",onClick:()=>{setEditOrc(orc);setOrcForm({...orc,value:String(orc.value),items:[...orc.items]});setShowOrc(true);},style:{fontSize:11,padding:"5px 10px"}},"✎"),
                h(Btn,{variant:"danger",onClick:()=>deleteOrcamento(orc.id),style:{fontSize:11,padding:"5px 10px"}},"🗑")
              )
            ),
            orc.obs&&h("div",{style:{marginTop:10,padding:"8px 12px",background:P.bg3,borderRadius:8,fontSize:12,color:P.text3,borderLeft:`2px solid ${P.border}`}},'"'+orc.obs+'"')
          );
        })
      ),
      h(Modal,{open:showOrc,onClose:()=>{setShowOrc(false);setEditOrc(null);},title:editOrc?"✎ Editar Orçamento":"💼 Novo Orçamento",width:520},
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
          h(Field,{label:"Título do Orçamento"},h(Inp,{value:orcForm.title,onChange:v=>setOrcForm(p=>({...p,title:v})),placeholder:"Ex: Planejamento Facial Completo"})),
          h(Field,{label:"Valor Total (R$)"},h(Inp,{value:orcForm.value,onChange:v=>setOrcForm(p=>({...p,value:v})),placeholder:"0,00"})),
          h(Field,{label:"Validade"},h(Inp,{value:orcForm.expiry,onChange:v=>setOrcForm(p=>({...p,expiry:v})),placeholder:"Ex: 31/12/2026"})),
          h(Field,{label:"Status"},h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},[{k:"espera",l:"🟡 Em Espera"},{k:"aprovado",l:"🟢 Aprovado"},{k:"recusado",l:"🔴 Recusado"},{k:"expirado",l:"⚪ Expirado"}].map(s=>h("button",{key:s.k,onClick:()=>setOrcForm(p=>({...p,status:s.k})),style:{padding:"5px 12px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:orcForm.status===s.k?P.rose:"transparent",border:`1px solid ${orcForm.status===s.k?P.rose:P.border}`,color:orcForm.status===s.k?P.accent3:P.text2}},s.l)))),
          h(Field,{label:"Procedimentos Planejados"},h("div",null,h("div",{style:{display:"flex",gap:8,marginBottom:8}},h("select",{value:orcItemInput,onChange:e=>setOrcItemInput(e.target.value),style:{...IS,flex:1}},h("option",{value:""},"Selecionar procedimento..."),procedures.map(p=>h("option",{key:p,value:p},p))),h(Btn,{onClick:()=>{if(orcItemInput&&!orcForm.items.includes(orcItemInput)){setOrcForm(p=>({...p,items:[...p.items,orcItemInput]}));setOrcItemInput("");}},style:{flexShrink:0,padding:"9px 14px"}},"＋")),h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},(orcForm.items||[]).map((item,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:5,fontSize:12,padding:"4px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text}},h("span",{style:{color:P.green}},"☑"),item,h("button",{onClick:()=>setOrcForm(p=>({...p,items:p.items.filter((_,j)=>j!==i)})),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:12,marginLeft:2}},"×")))))),
          h(Field,{label:"Observações"},h(TA,{value:orcForm.obs,onChange:v=>setOrcForm(p=>({...p,obs:v})),placeholder:'Ex: "Paciente pretende iniciar após férias."',rows:2}))
        ),
        h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},h(Btn,{variant:"ghost",onClick:()=>{setShowOrc(false);setEditOrc(null);}},"Cancelar"),h(Btn,{onClick:saveOrcamento},editOrc?"Salvar":"Criar Orçamento"))
      )
    ),
    // ─── PRONTUÁRIO TAB
    tab==="prontuario"&&h("div",null,
      (patient.sessions||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},h("div",{style:{fontSize:32,marginBottom:12}},"📋"),h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma sessão."),h(Btn,{style:{marginTop:16},onClick:()=>setShowNewS(true)},"Registrar Primeira Sessão")),
      (patient.sessions||[]).map(s=>h(Card,{key:s.id,style:{marginBottom:14}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}},
          h("div",null,
            h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}},
              h("div",{style:{fontSize:13,fontWeight:700,color:P.accent3,background:"rgba(157,119,97,.12)",border:"1px solid rgba(157,119,97,.25)",borderRadius:8,padding:"3px 10px"}},"📅 "+s.date),
              s.location&&h("div",{style:{fontSize:12,color:P.text3}},"📍 "+s.location)
            ),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},s.procedure),
            h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},`${s.doctor} · ${s.product}${s.dose?" · "+s.dose:""}${s.loteCodigo?" · Lote "+s.loteCodigo:""}${s.qtdUsada?" · Usado: "+s.qtdUsada:""}`)
          ),
          h("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:s.finStatus==="Pago"?P.green:s.finStatus==="Pendente"?P.yellow:P.red}},fmtCurr(s.value)),
            s.payMethod==="Cartão Crédito"&&s.parcelas>1&&h("div",{style:{fontSize:11,color:P.accent,background:"rgba(157,119,97,.1)",borderRadius:8,padding:"2px 8px",fontWeight:600}},`${s.parcelas}x ${fmtCurr(s.value/s.parcelas)}`),
            h("select",{value:s.finStatus||"Pendente",onChange:e=>toggleFinStatus(s.id,e.target.value),style:{fontSize:11,padding:"3px 8px",borderRadius:12,color:s.finStatus==="Pago"?P.green:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},FIN_STATUS.map(st=>h("option",{key:st,value:st},st))),
            h("button",{onClick:()=>{setEditSess(s);setSForm({...s,value:String(s.value),useFaceMap:!!s.faceMap,finStatus:s.finStatus||"Pendente"});setSessionFaceMap(s.faceMap);setShowNewS(true);},style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer"}},"✎"),
            h("button",{onClick:()=>delSession(s.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 8px",cursor:"pointer"}},"🗑")
          )
        ),
        s.region&&h("div",{style:{fontSize:12,color:P.text2,marginBottom:8}},`🎯 Região: `,h("strong",{style:{color:P.text}},s.region)),
        s.notes&&h("div",{style:{background:P.bg3,borderRadius:8,padding:"10px 14px",marginBottom:8}},h("div",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"Notas"),h("div",{style:{fontSize:13,color:P.text2,lineHeight:1.6}},s.notes)),
        s.evolution&&h("div",{style:{background:`rgba(92,31,50,.06)`,borderRadius:8,padding:"10px 14px",border:`1px solid rgba(92,31,50,.15)`,marginBottom:8}},h("div",{style:{fontSize:9.5,color:P.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"Evolução / Retorno"),h("div",{style:{fontSize:13,color:P.text2,lineHeight:1.6}},s.evolution)),
        s.returnReminderDays&&h("div",{style:{fontSize:11,color:P.text3,marginBottom:8}},`⏰ Lembrete de retorno: ${s.returnReminderDays} dias após procedimento`),
        s.faceMap&&Object.values(s.faceMap.points||{}).some(v=>v>0)&&h("div",{style:{padding:"8px 12px",background:P.bg3,borderRadius:8,marginBottom:8}},h("div",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}},`Mapa · ${s.faceMap.type}`),h("div",{style:{display:"flex",gap:5,flexWrap:"wrap"}},Object.entries(s.faceMap.points||{}).filter(([,v])=>v>0).map(([k,v])=>h("span",{key:k,style:{fontSize:11,padding:"3px 9px",borderRadius:20,background:`rgba(92,31,50,.1)`,color:P.accent}},`${k.replace(/_/g," ")}: ${v}${s.faceMap.type==="botox"?"U":"ml"}`)))),
        (s.intercorrencias||[]).length>0&&h("div",{style:{marginBottom:8,padding:"8px 12px",background:"rgba(192,112,112,.06)",borderRadius:8,border:"1px solid rgba(192,112,112,.18)"}},h("div",{style:{fontSize:10,color:P.red,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"⚠ Intercorrências"),(s.intercorrencias||[]).map((ic,i)=>h("div",{key:i,style:{fontSize:12,color:P.text2}},`${ic.date} · ${ic.type}: ${ic.notes}`))),
        (s.photos||[]).length>0&&h("div",{style:{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}},(s.photos||[]).slice(0,4).map(ph=>h("img",{key:ph.id,src:ph.url,alt:ph.name,style:{width:58,height:58,objectFit:"cover",borderRadius:6,border:`1px solid ${P.border}`}})),(s.photos||[]).length>4&&h("div",{style:{width:58,height:58,borderRadius:6,background:P.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:P.text3}},`+${(s.photos||[]).length-4}`)),
        h("div",{style:{display:"flex",gap:8,marginTop:10}},
          h("label",{style:{fontSize:11,color:P.accent,border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"📷 Fotos",h("input",{type:"file",accept:"image/*",multiple:true,style:{display:"none"},onChange:e=>addMedia(s.id,[...e.target.files],"photos")})),
          h("label",{style:{fontSize:11,color:P.accent,border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"📎 Docs",h("input",{type:"file",multiple:true,style:{display:"none"},onChange:e=>addMedia(s.id,[...e.target.files],"docs")})),
          h("button",{onClick:()=>setShowIntercorr(s.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"⚠ Intercorrência")
        )
      ))
    ),
    // ─── MAPA TAB
    tab==="mapa"&&h("div",null,
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}},
        [{title:"💉 Toxina",type:"botox"},{title:"✨ Preenchimento",type:"filler"},{title:"🧵 Fios",type:"thread"}].map(mt=>{
          const sess=(patient.sessions||[]).find(s=>s.faceMap?.type===mt.type);
          return h(Card,{key:mt.type},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text,marginBottom:14}},mt.title),sess?h(FaceMapEditor,{sessionMap:sess.faceMap,onChange:()=>{},readOnly:true}):h("div",{style:{textAlign:"center",padding:"20px 0",color:P.text3,fontSize:13}},"Nenhuma sessão."),sess&&h("div",{style:{fontSize:11,color:P.text3,marginTop:8}},`Sessão: ${sess.date}`));
        })
      ),
      h(Card,{style:{marginTop:14}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Histórico de Mapas"),
        (patient.sessions||[]).filter(s=>s.faceMap&&Object.values(s.faceMap.points||{}).some(v=>v>0)).length===0?h("div",{style:{color:P.text3,fontSize:13}},"Nenhum mapa registrado.")
        :(patient.sessions||[]).filter(s=>s.faceMap&&Object.values(s.faceMap.points||{}).some(v=>v>0)).map((s,i)=>h("div",{key:i,style:{padding:"10px 0",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}},
          h("span",{style:{fontSize:13,color:P.text}},`${s.date} · ${s.procedure}`),
          h("div",{style:{display:"flex",gap:4,flexWrap:"wrap"}},Object.entries(s.faceMap.points||{}).filter(([,v])=>v>0).map(([k,v])=>h("span",{key:k,style:{fontSize:10,padding:"2px 8px",borderRadius:12,background:`rgba(92,31,50,.1)`,color:P.accent}},`${k.replace(/_/g," ")}: ${v}${s.faceMap.type==="botox"?"U":"ml"}`)))
        ))
      )
    ),
    // ─── INTERCORRÊNCIAS TAB
    tab==="intercorrencias"&&h("div",null,
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Intercorrências Registradas"),
        h(Btn,{onClick:()=>setShowIntercorr("global")},"＋ Registrar")
      ),
      (patient.intercorrencias||[]).length===0?h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:28,marginBottom:8}},"✅"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma intercorrência registrada.")):
      (patient.intercorrencias||[]).map((ic,i)=>h(Card,{key:i,style:{marginBottom:12,border:"1px solid rgba(192,112,112,.2)"}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
          h("div",null,h("div",{style:{fontSize:10,color:P.red,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},ic.date),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},ic.type),ic.notes&&h("div",{style:{fontSize:13,color:P.text2,marginTop:6}},ic.notes),ic.conduct&&h("div",{style:{fontSize:12,color:P.green,marginTop:4}},`✓ Conduta: ${ic.conduct}`))
        )
      ))
    ),
    // ─── PLANEJAMENTO TAB
    tab==="planejamento"&&h("div",null,
      // PlanAnnotator fullscreen (sobrepõe tudo)
      planAnnotating&&h(PlanAnnotator,{
        initial:planAnnotating==="new"?null:planAnnotating.annotation,
        onClose:()=>setPlanAnnotating(null),
        onSave:annotData=>{
          if(planAnnotating==="new") savePlanAnnotationNew(annotData);
          else savePlanAnnotation(planAnnotating.id,annotData);
        }
      }),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Planejamento Facial"),
        h("div",{style:{display:"flex",gap:8}},
          h(Btn,{variant:"ghost",onClick:()=>setShowPlan(true),style:{fontSize:12}},"＋ Plano de Texto"),
          h(Btn,{onClick:()=>{setPlanAnnotating("new");},style:{fontSize:12}},"🖼 Plano com Foto")
        )
      ),
      (patient.planejamento||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},
        h("div",{style:{fontSize:32,marginBottom:12}},"🎯"),
        h("div",{style:{color:P.text3,fontSize:14,marginBottom:16}},"Nenhum planejamento criado."),
        h("div",{style:{display:"flex",gap:10,justifyContent:"center"}},
          h(Btn,{variant:"ghost",onClick:()=>setShowPlan(true)},"＋ Plano de Texto"),
          h(Btn,{onClick:()=>setPlanAnnotating("new")},"🖼 Plano com Foto")
        )
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:14}},
        (patient.planejamento||[]).map(pl=>h(Card,{key:pl.id,style:{padding:0,overflow:"hidden"}},
          // Se tiver anotação visual, mostrar thumbnail à esquerda
          h("div",{style:{display:"flex",gap:0}},
            pl.annotation?.thumbnail&&h("div",{style:{width:180,flexShrink:0,position:"relative",cursor:"pointer"},onClick:()=>setPlanAnnotating(pl)},
              h("img",{src:pl.annotation.thumbnail,alt:"anotação",style:{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:130}}),
              h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,.0)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"},
                onMouseEnter:e=>e.currentTarget.style.opacity=1,onMouseLeave:e=>e.currentTarget.style.opacity=0},
                h("div",{style:{background:"rgba(0,0,0,.7)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600}},"✎ Editar")
              )
            ),
            h("div",{style:{flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
                h("div",null,
                  h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:2}},pl.title),
                  h("div",{style:{fontSize:11,color:P.text3}},
                    "Criado em "+pl.created,
                    pl.updatedAt&&h("span",{style:{marginLeft:8,color:P.accent}},"· Editado em "+pl.updatedAt),
                    pl.annotation&&h("span",{style:{marginLeft:8,fontSize:10,color:P.green,background:"rgba(122,173,138,.15)",padding:"1px 7px",borderRadius:10,border:"1px solid rgba(122,173,138,.3)"}},"📷 Com anotação visual")
                  )
                ),
                h("div",{style:{display:"flex",gap:5,flexShrink:0}},
                  h("button",{onClick:()=>setPlanAnnotating(pl),title:pl.annotation?"Editar anotação visual":"Adicionar foto",style:{padding:"5px 10px",borderRadius:7,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:11}},pl.annotation?"✎ Foto":"📷 Foto"),
                  h("button",{onClick:()=>deletePlan(pl.id),style:{padding:"5px 8px",borderRadius:7,background:"transparent",border:"1px solid rgba(192,112,112,.2)",color:P.red,cursor:"pointer",fontSize:11}},"🗑")
                )
              ),
              pl.notes&&h("div",{style:{fontSize:13,color:P.text3,fontStyle:"italic"}},pl.notes),
              (pl.steps||[]).length>0&&h("div",{style:{display:"flex",flexDirection:"column",gap:2}},
                (pl.steps||[]).map((step,si)=>h("div",{key:si,onClick:()=>togglePlanStep(pl.id,si),style:{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid rgba(71,35,37,.3)`,cursor:"pointer"}},
                  h("div",{style:{width:14,height:14,borderRadius:3,border:`2px solid ${step.includes("✓")?P.green:P.border}`,background:step.includes("✓")?P.green:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff"}},step.includes("✓")?"✓":""),
                  h("span",{style:{fontSize:12.5,color:step.includes("✓")?P.green:P.text,textDecoration:step.includes("✓")?"line-through":"none"}},step.replace(" ✓",""))
                ))
              )
            )
          )
        ))
      )
    ),
    // ─── ANAMNESE TAB
    tab==="anamnese"&&patient.anamnese&&h("div",null,
      (patient.anamnese.importantAlerts||[]).length>0&&h(Card,{style:{marginBottom:14,border:"1px solid rgba(192,112,112,.3)",background:"rgba(192,112,112,.05)"}},
        h("div",{style:{fontSize:11,color:P.red,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10,fontWeight:600}},"⚠ Alertas & Contraindicações"),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
          (patient.anamnese.importantAlerts||[]).map((a,i)=>h(AlertBadge,{key:i,text:a,color:getAlertColor(a)}))
        ),
        patient.anamnese.allergiesDetail&&h("div",{style:{fontSize:13,color:P.text2,marginTop:8}},patient.anamnese.allergiesDetail),
        patient.anamnese.contraindications&&patient.anamnese.contraindications!=="Nenhuma"&&h("div",{style:{fontSize:13,color:P.red,marginTop:6}},`Contraindicações: ${patient.anamnese.contraindications}`)
      ),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}},
        [{l:"Tipo de Pele",v:patient.anamnese.skinType},{l:"Fitzpatrick",v:patient.anamnese.fitzpatrick},{l:"Fumante",v:patient.anamnese.smoking},{l:"Gestante/Lactante",v:patient.anamnese.pregnancy},{l:"Histórico de Saúde",v:patient.anamnese.healthHistory},{l:"Medicamentos",v:patient.anamnese.medications},{l:"Procedimentos Anteriores",v:patient.anamnese.previousProcedures||"Nenhum"},{l:"🎵 Estilo Musical",v:patient.anamnese.musicStyle||"—"}].map(f=>h(Card,{key:f.l,style:{padding:"14px 16px"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}},f.l),h("div",{style:{fontSize:14,color:P.text}},f.v||"—")))
      )
    ),
    // ─── GALERIA TAB
    tab==="galeria"&&h(EvolucaoFotos,{patient,upd,addMedia,removeMedia}),
    // ─── DOCS TAB
    tab==="docs"&&h("div",null,(patient.sessions||[]).map(s=>h(Card,{key:s.id,style:{marginBottom:14}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text,marginBottom:12}},`${s.date} · ${s.procedure} `,h("span",{style:{fontSize:12,color:P.text3,fontFamily:"'DM Sans',sans-serif"}},`${(s.docs||[]).length} doc(s)`)),
      h(MediaGallery,{items:s.docs||[],onAdd:files=>addMedia(s.id,files,"docs"),onRemove:id=>removeMedia(s.id,id,"docs"),docMode:true,label:"Termos, anamnese, receitas..."})
    ))),
    // ─── FINANCEIRO TAB

    tab==="pacotes"&&h("div",null,
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Pacotes de Sessões"),
        h(Btn,{onClick:()=>setShowNewPkg(true)},"＋ Novo Pacote")
      ),
      (patient.sessions_packages||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},
        h("div",{style:{fontSize:32,marginBottom:12}},"📦"),
        h("div",{style:{color:P.text3,fontSize:14,marginBottom:16}},"Nenhum pacote cadastrado."),
        h(Btn,{onClick:()=>setShowNewPkg(true)},"Criar Primeiro Pacote")
      ),
      (patient.sessions_packages||[]).map(pkg=>{
        const pct=Math.round((pkg.done/pkg.total)*100);
        const done=pkg.done>=pkg.total;
        return h(Card,{key:pkg.id,style:{marginBottom:14,border:`1px solid ${done?"rgba(122,173,138,.35)":P.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}},
            h("div",null,
              h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4}},
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:done?P.green:P.text}},pkg.name),
                done&&h("span",{style:{fontSize:11,padding:"2px 8px",borderRadius:12,background:"rgba(122,173,138,.15)",color:P.green,border:"1px solid rgba(122,173,138,.3)"}},"✓ Concluído")
              ),
              h("div",{style:{fontSize:12,color:P.text3}},pkg.procedure+" · Criado em "+pkg.created),
              pkg.price>0&&h("div",{style:{fontSize:12,color:P.accent,marginTop:2}},"Valor do pacote: "+fmtCurr(pkg.price))
            ),
            h("div",{style:{display:"flex",gap:6,alignItems:"center"}},
              !done&&h("button",{onClick:()=>checkPackageSession(pkg.id),style:{padding:"6px 14px",borderRadius:8,background:P.rose,border:"none",color:P.accent3,cursor:"pointer",fontSize:12,fontWeight:500}},"✓ Dar Check"),
              pkg.done>0&&!done&&h("button",{onClick:()=>uncheckPackageSession(pkg.id),style:{padding:"6px 10px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:11}},"↩ Desfazer"),
              h("button",{onClick:()=>deletePackage(pkg.id),style:{padding:"6px 8px",borderRadius:8,background:"transparent",border:"1px solid rgba(192,112,112,.2)",color:P.red,cursor:"pointer",fontSize:11}},"🗑")
            )
          ),
          h("div",{style:{marginBottom:10}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
              h("span",{style:{fontSize:12,color:P.text3}},pkg.done+" de "+pkg.total+" sessões realizadas"),
              h("span",{style:{fontSize:12,color:done?P.green:P.accent,fontWeight:600}},pct+"%")
            ),
            h("div",{style:{height:10,borderRadius:5,background:P.bg3,overflow:"hidden"}},
              h("div",{style:{height:"100%",width:pct+"%",background:done?"linear-gradient(90deg,"+P.green+",#5aad7a)":"linear-gradient(90deg,"+P.rose+","+P.gold+")",borderRadius:5,transition:"width .5s ease"}})
            )
          ),
          h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
            Array.from({length:pkg.total},(_,i)=>{
              const checked=i<pkg.done;
              const sess=pkg.sessions&&(pkg.sessions.find(s=>s.num===i+1)||pkg.sessions[i]);
              return h("div",{key:i,title:sess?"Realizada em "+sess.date:"Pendente",style:{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,border:`2px solid ${checked?P.green:P.border}`,background:checked?"rgba(122,173,138,.15)":P.bg3,color:checked?P.green:P.text3,position:"relative",cursor:"default"}},
                checked?"✓":(i+1),
                checked&&sess&&h("div",{style:{position:"absolute",bottom:-18,left:"50%",transform:"translateX(-50%)",fontSize:9,color:P.text3,whiteSpace:"nowrap"}},sess.date.slice(0,5))
              );
            })
          ),
          pkg.notes&&h("div",{style:{marginTop:12,padding:"8px 12px",background:P.bg3,borderRadius:8,fontSize:12,color:P.text3}},pkg.notes)
        );
      }),
      h(Modal,{open:showNewPkg,onClose:()=>setShowNewPkg(false),title:"📦 Novo Pacote",width:480},
        h("div",{style:{display:"flex",flexDirection:"column",gap:12}},
          h(Field,{label:"Nome do Pacote"},h(Inp,{value:pkgForm.name,onChange:v=>setPkgForm(p=>({...p,name:v})),placeholder:"Ex: Pacote Microagulhamento"})),
          h(Field,{label:"Procedimento"},h(Sel,{value:pkgForm.procedure,onChange:v=>setPkgForm(p=>({...p,procedure:v})),options:procedures})),
          h("div",{style:{display:"flex",gap:12}},
            h(Field,{label:"Nº de Sessões",half:true},h(Sel,{value:String(pkgForm.total),onChange:v=>setPkgForm(p=>({...p,total:Number(v)})),options:["2","3","4","5","6","8","10","12"]})),
            h(Field,{label:"Valor do Pacote (R$)",half:true},h(Inp,{value:pkgForm.price,onChange:v=>setPkgForm(p=>({...p,price:v})),placeholder:"0,00",type:"number"}))
          ),
          h(Field,{label:"Observações (opcional)"},h(TA,{value:pkgForm.notes,onChange:v=>setPkgForm(p=>({...p,notes:v})),placeholder:"Detalhes, validade...",rows:2}))
        ),
        h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}},
          h(Btn,{variant:"ghost",onClick:()=>setShowNewPkg(false)},"Cancelar"),
          h(Btn,{onClick:addPackage},"Criar Pacote")
        )
      )
    ),
    tab==="financeiro"&&h("div",null,
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}},
        [{l:"Total Investido",v:fmtCurr(totalSpent),c:P.accent},{l:"Pago",v:fmtCurr((patient.sessions||[]).filter(s=>s.paid).reduce((a,s)=>a+s.value,0)),c:P.green},{l:"Pendente",v:fmtCurr((patient.sessions||[]).filter(s=>!s.paid).reduce((a,s)=>a+s.value,0)),c:P.yellow}].map(s=>h(Card,{key:s.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},s.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:s.c}},s.v)))
      ),
      h(Card,null,h("table",{style:{width:"100%",borderCollapse:"collapse"}},
        h("thead",null,h("tr",null,["Data","Procedimento","Local","Pag.","Status","Valor"].map(hd=>h("th",{key:hd,style:{textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:".1em",color:P.text3,padding:"0 0 12px",borderBottom:`1px solid ${P.border}`}},hd)))),
        h("tbody",null,(patient.sessions||[]).map((s,i)=>h("tr",{key:i},
          h("td",{style:{padding:"11px 0",fontSize:13,color:P.text2,borderBottom:`1px solid rgba(71,35,37,.4)`}},s.date),
          h("td",{style:{padding:"11px 0",fontSize:13,color:P.text,borderBottom:`1px solid rgba(71,35,37,.4)`}},s.procedure),
          h("td",{style:{padding:"11px 0",fontSize:12,color:P.text3,borderBottom:`1px solid rgba(71,35,37,.4)`}},s.location||"—"),
          h("td",{style:{padding:"11px 0",fontSize:12,color:P.text2,borderBottom:`1px solid rgba(71,35,37,.4)`}},s.payMethod),
          h("td",{style:{padding:"11px 0",borderBottom:`1px solid rgba(71,35,37,.4)`}},
            h("select",{value:s.finStatus||"Pendente",onChange:e=>toggleFinStatus(s.id,e.target.value),style:{fontSize:11,padding:"3px 8px",borderRadius:10,color:s.finStatus==="Pago"?P.green:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},FIN_STATUS.map(st=>h("option",{key:st,value:st},st)))
          ),
          h("td",{style:{padding:"11px 0",fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:s.paid?P.green:P.yellow,textAlign:"right",borderBottom:`1px solid rgba(71,35,37,.4)`}},fmtCurr(s.value))
        )))
      ))
    ),
    // ─── SKINCARE TAB
    tab==="skincare"&&h(SkincareTab,{patient,upd,skincareConfig}),
        // ─── INDICAÇÕES TAB
    tab==="indicacoes"&&h(IndicacoesTab,{patient,patients,onSelectPatient,fmtCurr}),
        // ─── MODALS
    h(Modal,{open:showNewS,onClose:()=>{setShowNewS(false);setEditSess(null);},title:editSess?"✎ Editar Sessão":"✦ Nova Sessão",width:620},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Data",half:true},h(Inp,{type:"date",value:sForm.date,onChange:sfv("date")})),
        h(Field,{label:"Procedimento",half:true},h(Sel,{value:sForm.procedure,onChange:sfvProcedure,options:procedures})),
        h(Field,{label:"Produto"},
          h("div",null,
            h(Sel,{value:sForm.product,onChange:v=>{setSForm(p=>({...p,product:v,loteId:"",qtdUsada:""}));},options:products}),
            getAvailableLotes(allProducts||[],sForm.product).length>0&&h("div",{style:{marginTop:5,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}},
              h("span",{style:{fontSize:10,color:P.text3}},"Lotes disponíveis:"),
              getAvailableLotes(allProducts||[],sForm.product).map(l=>h("span",{key:l.id,style:{fontSize:10,padding:"1px 8px",borderRadius:10,background:"rgba(122,173,138,.1)",color:P.green,border:"1px solid rgba(122,173,138,.25)"}},l.codigo+": "+l.qtd+(l.validade?" (val "+l.validade+")":"")))
            )
          )
        ),
        (()=>{const _lts=getAvailableLotes(allProducts||[],sForm.product);return _lts.length>0?h("div",{style:{display:"flex",gap:12,flexWrap:"wrap",width:"100%"}},
          h(Field,{label:"Lote Utilizado",half:true},
            h("select",{value:sForm.loteId||"",onChange:e=>sfv("loteId")(e.target.value),style:{width:"100%",background:P.bg3,border:"1px solid "+P.border,borderRadius:8,padding:"9px 12px",color:P.text,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}},
              h("option",{value:""},"Selecionar lote..."),
              _lts.map(l=>h("option",{key:l.id,value:String(l.id)},l.codigo+" — "+l.qtd+" disponível"+(l.validade?" · val "+l.validade:"")))
            )
          ),
          h(Field,{label:"Qtd. Usada",half:true},
            h("div",null,
              h(Inp,{type:"number",value:sForm.qtdUsada||"",onChange:sfv("qtdUsada"),placeholder:"Ex: 40"}),
              sForm.loteId&&sForm.qtdUsada&&(()=>{
                const _l=_lts.find(l=>String(l.id)===String(sForm.loteId));
                if(!_l)return null;
                const _saldo=_l.qtd-Number(sForm.qtdUsada||0);
                return h("div",{style:{fontSize:11,marginTop:5,padding:"5px 10px",borderRadius:7,background:_saldo>=0?"rgba(122,173,138,.1)":"rgba(192,112,112,.1)",color:_saldo>=0?P.green:P.red,fontWeight:600,border:"1px solid "+(_saldo>=0?"rgba(122,173,138,.25)":"rgba(192,112,112,.25)")}},_saldo>=0?"✓ Saldo após uso: "+_saldo:"⚠ Excede o disponível ("+_l.qtd+")");
              })()
            )
          )
        ):null;})(),
        h(Field,{label:"Dose",half:true},h(Inp,{value:sForm.dose,onChange:sfv("dose"),placeholder:"Ex: 40U, 1ml"})),
        h(Field,{label:"Região",half:true},h(Inp,{value:sForm.region,onChange:sfv("region"),placeholder:"Ex: Glabela + Testa"})),
        h(Field,{label:"Local",half:true},h(Sel,{value:sForm.location,onChange:sfv("location"),options:locations})),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:sForm.value,onChange:sfv("value"),placeholder:"0,00"})),
        h(Field,{label:"Forma de Pagamento",half:true},h(Sel,{value:sForm.payMethod,onChange:sfv("payMethod"),options:PAY_METHODS})),
        h(Field,{label:"Status Financeiro",half:true},h(Sel,{value:sForm.finStatus,onChange:sfv("finStatus"),options:FIN_STATUS})),
        sForm.payMethod==="Cartão Crédito"&&h(Field,{label:"Parcelas",half:true},h(Sel,{value:sForm.parcelas,onChange:sfv("parcelas"),options:["1","2","3","4","5","6","7","8","9","10","11","12"]})),
        sForm.payMethod==="Cartão Crédito"&&Number(sForm.parcelas)>1&&Number(sForm.value)>0&&h("div",{style:{width:"100%",padding:"10px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`,marginTop:-4}},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}},"Parcelamento"),
          h("div",{style:{display:"flex",gap:20}},
            h("div",null,h("div",{style:{fontSize:10,color:P.text3}},"Valor por parcela"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},fmtCurr(Number(sForm.value)/Number(sForm.parcelas)))),
            h("div",null,h("div",{style:{fontSize:10,color:P.text3}},"Total"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent}},fmtCurr(Number(sForm.value))))
          )
        ),
        h(Field,{label:"Retorno Automático (dias)",half:true},
          h("div",null,
            h(Inp,{value:sForm.returnReminderDays,onChange:sfv("returnReminderDays"),placeholder:"14",type:"number"}),
            (()=>{const rule=(returnRules||[]).find(r=>r.procedure===sForm.procedure);return rule?h("div",{style:{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}},
              rule.revisionDays>0&&h("button",{onClick:()=>sfv("returnReminderDays")(String(rule.revisionDays)),style:{fontSize:10,padding:"3px 8px",borderRadius:12,background:Number(sForm.returnReminderDays)===rule.revisionDays?"rgba(92,31,50,.25)":"transparent",border:`1px solid ${Number(sForm.returnReminderDays)===rule.revisionDays?P.rose:P.border}`,color:Number(sForm.returnReminderDays)===rule.revisionDays?P.accent3:P.text3,cursor:"pointer"}},"✏ Revisão "+rule.revisionDays+"d"),
              rule.maintenanceDays>0&&h("button",{onClick:()=>sfv("returnReminderDays")(String(rule.maintenanceDays)),style:{fontSize:10,padding:"3px 8px",borderRadius:12,background:Number(sForm.returnReminderDays)===rule.maintenanceDays?"rgba(92,31,50,.25)":"transparent",border:`1px solid ${Number(sForm.returnReminderDays)===rule.maintenanceDays?P.rose:P.border}`,color:Number(sForm.returnReminderDays)===rule.maintenanceDays?P.accent3:P.text3,cursor:"pointer"}},"🔄 Manutenção "+rule.maintenanceDays+"d"),
              h("button",{onClick:()=>sfv("returnReminderDays")("0"),style:{fontSize:10,padding:"3px 8px",borderRadius:12,background:Number(sForm.returnReminderDays)===0?"rgba(192,112,112,.15)":"transparent",border:`1px solid ${Number(sForm.returnReminderDays)===0?"rgba(192,112,112,.4)":P.border}`,color:Number(sForm.returnReminderDays)===0?P.red:P.text3,cursor:"pointer"}},"✕ Sem retorno")
            ):null;})()
          )
        ),
        h(Field,{label:"Notas"},h(TA,{value:sForm.notes,onChange:sfv("notes"),placeholder:"Detalhes técnicos...",rows:3})),
        h(Field,{label:"Evolução"},h(TA,{value:sForm.evolution,onChange:sfv("evolution"),placeholder:"Próximos passos...",rows:2})),
        h(Field,{label:"Mapa de Aplicação"},
          h("button",{onClick:()=>sfv("useFaceMap")(!sForm.useFaceMap),style:{padding:"7px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",background:sForm.useFaceMap?P.rose:"transparent",border:`1px solid ${sForm.useFaceMap?P.rose:P.border}`,color:sForm.useFaceMap?P.accent3:P.text3,marginBottom:sForm.useFaceMap?14:0}},sForm.useFaceMap?"✓ Incluindo Mapa":"＋ Incluir Mapa"),
          sForm.useFaceMap&&h("div",{style:{paddingBottom:64}},h(FaceMapEditor,{sessionMap:sessionFaceMap,onChange:setSessionFaceMap}))
        )
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12,flexWrap:"wrap"}},h(Btn,{variant:"ghost",onClick:()=>{setShowNewS(false);setEditSess(null);}},"Cancelar"),!editSess&&h("button",{onClick:()=>{saveSession();setTimeout(()=>{setPkgForm(p=>({...p,procedure:sForm.procedure}));setShowNewPkg(true);setTab("pacotes");},100);},style:{padding:"9px 16px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:"transparent",border:"1px solid "+P.gold,color:P.gold}},"📦 Salvar e Criar Pacote"),h(Btn,{onClick:saveSession},editSess?"Salvar":"Salvar Sessão"))
    ),
    showIntercorr&&h(Modal,{open:true,onClose:()=>setShowIntercorr(null),title:"⚠ Registrar Intercorrência",width:480},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Tipo"},h(Sel,{value:icForm.type,onChange:v=>setIcForm(p=>({...p,type:v})),options:INTERCORRENCIA_TYPES})),
        h(Field,{label:"Data"},h(Inp,{type:"date",value:icForm.date,onChange:v=>setIcForm(p=>({...p,date:v}))})),
        h(Field,{label:"Descrição"},h(TA,{value:icForm.notes,onChange:v=>setIcForm(p=>({...p,notes:v})),placeholder:"Descreva a intercorrência...",rows:3})),
        h(Field,{label:"Conduta Realizada"},h(TA,{value:icForm.conduct,onChange:v=>setIcForm(p=>({...p,conduct:v})),placeholder:"O que foi feito...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},h(Btn,{variant:"ghost",onClick:()=>setShowIntercorr(null)},"Cancelar"),h(Btn,{onClick:()=>saveIntercorrencia(showIntercorr==="global"?(patient.sessions||[])[0]?.id:showIntercorr)},"Registrar"))
    ),
    showPlan&&h(Modal,{open:true,onClose:()=>setShowPlan(false),title:"🎯 Novo Plano de Tratamento",width:480},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Título do Plano"},h(Inp,{value:planForm.title,onChange:v=>setPlanForm(p=>({...p,title:v})),placeholder:"Ex: Protocolo de Harmonização Completa"})),
        h(Field,{label:"Etapas (uma por linha)"},h(TA,{value:planForm.steps,onChange:v=>setPlanForm(p=>({...p,steps:v})),placeholder:"Toxina Botulínica\nPreenchimento Labial\nBioestimulador...",rows:4})),
        h(Field,{label:"Observações"},h(TA,{value:planForm.notes,onChange:v=>setPlanForm(p=>({...p,notes:v})),placeholder:"Metas, prazos, considerações...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12,flexWrap:"wrap"}},
        h(Btn,{variant:"ghost",onClick:()=>setShowPlan(false)},"Cancelar"),
        h("button",{onClick:()=>{if(!planForm.title.trim())return;setPlanAnnotating("new");},style:{padding:"9px 16px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:"transparent",border:`1px solid ${P.gold}`,color:P.gold}},"🖼 Salvar e Anotar Foto"),
        h(Btn,{onClick:addPlanejamento},"Criar Plano")
      )
    ),
    editPat&&h(Modal,{open:true,onClose:()=>setEditPat(false),title:"✎ Editar Dados da Paciente",width:620},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Nome"},h(Inp,{value:patForm.name,onChange:pfv("name")})),
        h(Field,{label:"Idade",third:true},h(Inp,{value:patForm.age,onChange:pfv("age")})),
        h(Field,{label:"Data Nasc.",third:true},h(Inp,{type:"date",value:patForm.birthDate,onChange:pfv("birthDate")})),
        h(Field,{label:"Status",third:true},h(Sel,{value:patForm.status,onChange:pfv("status"),options:Object.keys(PAT_STATUS_CFG)})),
        h(Field,{label:"Telefone",half:true},h(Inp,{value:patForm.phone,onChange:pfv("phone")})),
        h(Field,{label:"E-mail",half:true},h(Inp,{value:patForm.email,onChange:pfv("email")})),
        h(Field,{label:"Alergias"},h(Inp,{value:patForm.allergies,onChange:pfv("allergies")})),
        h(Field,{label:"Detalhes Alergias"},h(TA,{value:patForm.allergiesDetail||"",onChange:pfv("allergiesDetail"),rows:2})),
        h(Field,{label:"Contraindicações"},h(Inp,{value:patForm.contraindications||"",onChange:pfv("contraindications")})),
        h(Field,{label:"Alertas Importantes (separados por vírgula)"},h(Inp,{value:(patForm.importantAlerts||[]).join(", "),onChange:v=>pfv("importantAlerts")(v.split(",").map(s=>s.trim()).filter(Boolean))})),
        h(Field,{label:"Tipo de Pele",half:true},h(Sel,{value:patForm.skinType||"Normal",onChange:pfv("skinType"),options:SKIN_TYPES})),
        h(Field,{label:"Fitzpatrick",half:true},h(Sel,{value:patForm.fitzpatrick||"II",onChange:pfv("fitzpatrick"),options:FITZPATRICK})),
        h(Field,{label:"Histórico de Saúde"},h(TA,{value:patForm.healthHistory||"",onChange:pfv("healthHistory"),rows:2})),
        h(Field,{label:"Medicamentos"},h(Inp,{value:patForm.medications||"",onChange:pfv("medications")})),
        h(Field,{label:"Fumante",third:true},h(Sel,{value:patForm.smoking||"Não",onChange:pfv("smoking"),options:["Não","Sim","Ex-fumante"]})),
        h(Field,{label:"Gestante",third:true},h(Sel,{value:patForm.pregnancy||"Não",onChange:pfv("pregnancy"),options:["Não","Gestante","Lactante"]})),
        h(Field,{label:"🎵 Estilo Musical",third:true},h(Sel,{value:patForm.musicStyle||"Pop",onChange:pfv("musicStyle"),options:MUSIC_STYLES})),
        h(Field,{label:"Próx. Retorno"},h(Inp,{value:patForm.nextReturn||"",onChange:pfv("nextReturn"),placeholder:"DD/MM/AAAA"}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},h(Btn,{variant:"ghost",onClick:()=>setEditPat(false)},"Cancelar"),h(Btn,{onClick:savePat},"Salvar Alterações"))
    )
  );
}
// ─── ESTOQUE (com lotes) ──────────────────────────────────────────────────────
function Estoque({products,setProducts}){
  const[filter,setFilter]=useState("all");
  const[showNew,setShowNew]=useState(false);
  const[editItem,setEditItem]=useState(null);
  const[showLoteModal,setShowLoteModal]=useState(null); // id do produto
  const[expandedProduct,setExpandedProduct]=useState(null);
  const blank={name:"",cat:"Toxina Botulínica",qty:"",min:"",unit:"U",expiry:"",cost:"",emoji:"💉"};
  const blankLote={codigo:"",validade:"",qtd:"",obs:""};
  const[form,setForm]=useState(blank);
  const[loteForm,setLoteForm]=useState(blankLote);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const lfv=k=>v=>setLoteForm(p=>({...p,[k]:v}));
  const h=createElement;
  const cats=["Toxina Botulínica","Ácido Hialurônico","Bioestimulador","Fios de PDO","Anestésico","Skinbooster","Outros"];
  const stCfg={critical:{color:P.red,bg:"rgba(192,112,112,.12)",l:"⚠ Crítico"},low:{color:P.yellow,bg:"rgba(196,169,106,.12)",l:"⚡ Baixo"},ok:{color:P.green,bg:"rgba(122,173,138,.12)",l:"✓ OK"}};
  
  // Calcula status baseado nos lotes
  function calcStatus(lotes, min) {
    const total = (lotes||[]).reduce((a,l)=>a+l.qtd,0);
    return total === 0 ? "critical" : total < (min||0) ? "low" : "ok";
  }
  function getTotalQty(item) {
    if (item.lotes && item.lotes.length > 0) return item.lotes.reduce((a,l)=>a+l.qtd, 0);
    return item.qty || 0;
  }

  // Alerta de validade: retorna cor se lote vence em ≤ 60 dias
  function validadeAlerta(valStr) {
    if (!valStr) return null;
    try {
      const [m, y] = valStr.split("/");
      const dt = new Date(Number(y), Number(m)-1, 1);
      const hoje = new Date();
      const dias = Math.floor((dt - hoje) / 864e5);
      if (dias < 0) return { color: P.red, label: "Vencido!" };
      if (dias <= 30) return { color: P.red, label: `Vence em ${dias}d` };
      if (dias <= 60) return { color: P.yellow, label: `Vence em ${dias}d` };
      return null;
    } catch { return null; }
  }

  const visible=filter==="all"?products:products.filter(i=>{
    const st = i.lotes ? calcStatus(i.lotes, i.min) : i.status;
    return st === filter;
  });

  function save(){
    const qty=Number(form.qty), min=Number(form.min);
    const loteInicial = form.lote_codigo ? [{
      id: Date.now(),
      codigo: form.lote_codigo,
      validade: form.lote_validade || form.expiry,
      qtd: qty,
      qtdOriginal: qty,
      dtEntrada: new Date().toLocaleDateString("pt-BR"),
    }] : [];
    const status = loteInicial.length ? calcStatus(loteInicial, min) : (qty===0?"critical":qty<min?"low":"ok");
    if(editItem) {
      setProducts(prev=>prev.map(i=>i.id===editItem.id?{...i,...form,qty,min,cost:Number(form.cost),status}:i));
    } else {
      setProducts(prev=>[...prev,{
        id:Date.now(),...form,qty,min,cost:Number(form.cost),status,
        lotes: loteInicial,
        movimentacoes: loteInicial.length ? [{
          id:Date.now()+1, tipo:"entrada", qtd:qty, loteId:loteInicial[0]?.id,
          data:new Date().toLocaleDateString("pt-BR"), obs:"Entrada inicial"
        }] : []
      }]);
    }
    setShowNew(false);setEditItem(null);setForm(blank);
  }

  function saveLote() {
    if (!loteForm.codigo || !loteForm.qtd) return;
    const qtd = Number(loteForm.qtd);
    setProducts(prev => prev.map(p => {
      if (p.id !== showLoteModal) return p;
      const novoLote = {
        id: Date.now(),
        codigo: loteForm.codigo,
        validade: loteForm.validade,
        qtd,
        qtdOriginal: qtd,
        dtEntrada: new Date().toLocaleDateString("pt-BR"),
        obs: loteForm.obs,
      };
      const lotes = [...(p.lotes||[]), novoLote];
      const totalQty = lotes.reduce((a,l)=>a+l.qtd, 0);
      const status = calcStatus(lotes, p.min);
      const mov = { id: Date.now()+1, tipo:"entrada", qtd, loteId:novoLote.id, data:new Date().toLocaleDateString("pt-BR"), obs:`Lote ${loteForm.codigo}${loteForm.obs?" — "+loteForm.obs:""}` };
      return { ...p, lotes, qty: totalQty, status, movimentacoes:[...(p.movimentacoes||[]), mov] };
    }));
    setShowLoteModal(null);
    setLoteForm(blankLote);
  }

  function del(id){if(window.confirm("Excluir produto?"))setProducts(prev=>prev.filter(i=>i.id!==id));}
  function openEdit(item){setEditItem(item);setForm({...item,qty:String(getTotalQty(item)),min:String(item.min),cost:String(item.cost)});setShowNew(true);}

  const critical=products.filter(i=>{
    const st = i.lotes ? calcStatus(i.lotes, i.min) : i.status;
    return st==="critical";
  }).length;
  const totalVal=products.reduce((a,i)=>a+getTotalQty(i)*(i.cost||0),0);

  return h("div",null,
    h(SectionHeader,{title:"Estoque",sub:`${products.length} produtos · ${critical} críticos`,
      action:h("div",{style:{display:"flex",gap:8}},
        h(Btn,{onClick:()=>{setEditItem(null);setForm(blank);setShowNew(true);}},"＋ Novo Produto")
      )
    }),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
      [{l:"Nível Crítico",v:critical,c:P.red},{l:"Produtos",v:products.length,c:P.accent},{l:"Valor em Estoque",v:fmtCurr(totalVal),c:P.green}].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:k.c}},k.v)))
    ),
    h("div",{style:{display:"flex",gap:8,marginBottom:14}},[{k:"all",l:"Todos"},{k:"critical",l:"⚠ Crítico"},{k:"low",l:"⚡ Baixo"},{k:"ok",l:"✓ OK"}].map(f=>h("button",{key:f.k,onClick:()=>setFilter(f.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===f.k?P.rose:"transparent",border:`1px solid ${filter===f.k?P.rose:P.border}`,color:filter===f.k?P.accent3:P.text2}},f.l))),

    // ── Lista de produtos com expansão por lotes ──
    h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
      visible.map(item => {
        const totalQty = getTotalQty(item);
        const st = item.lotes ? calcStatus(item.lotes, item.min) : item.status;
        const sc = stCfg[st] || stCfg.ok;
        const pct = Math.min(100, (totalQty / Math.max((item.min||1)*1.5, 1))*100);
        const isExpanded = expandedProduct === item.id;
        const hasLotes = item.lotes && item.lotes.length > 0;
        // Alertas de validade
        const valAlerts = (item.lotes||[]).map(l => ({ ...l, alerta: validadeAlerta(l.validade) })).filter(l => l.alerta);

        return h("div",{key:item.id},
          // Linha principal
          h(Card,{style:{marginBottom:0,borderRadius:isExpanded?"12px 12px 0 0":12,border:`1px solid ${sc.color}33`}},
            h("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}},
              // Emoji + nome
              h("div",{style:{display:"flex",alignItems:"center",gap:10,flex:"1 1 200px",minWidth:0}},
                h("span",{style:{fontSize:22}},item.emoji||"📦"),
                h("div",null,
                  h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},item.name),
                  h("div",{style:{fontSize:11,color:P.text3,marginTop:1}},item.cat),
                  valAlerts.length > 0 && h("div",{style:{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}},
                    valAlerts.map((l,i) => h("span",{key:i,style:{fontSize:10,padding:"1px 7px",borderRadius:10,background:l.alerta.color+"18",color:l.alerta.color,border:`1px solid ${l.alerta.color}44`}},
                      `Lote ${l.codigo}: ${l.alerta.label}`
                    ))
                  )
                )
              ),
              // Saldo total
              h("div",{style:{textAlign:"center",minWidth:80}},
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:sc.color,lineHeight:1}},totalQty),
                h("div",{style:{fontSize:10,color:P.text3}},item.unit||"un"),
                h("div",{style:{height:3,borderRadius:2,background:P.bg3,width:60,marginTop:4,overflow:"hidden",margin:"4px auto 0"}},
                  h("div",{style:{height:"100%",width:pct+"%",background:sc.color,borderRadius:2}})
                )
              ),
              // Status badge
              h("span",{style:{fontSize:11,padding:"3px 10px",borderRadius:12,color:sc.color,background:sc.bg,flexShrink:0}},sc.l),
              // Ações
              h("div",{style:{display:"flex",gap:6,flexShrink:0}},
                h("button",{onClick:()=>setShowLoteModal(item.id),style:{padding:"6px 12px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none",cursor:"pointer",fontSize:12,fontWeight:600}},"＋ Entrada"),
                hasLotes && h("button",{onClick:()=>setExpandedProduct(isExpanded?null:item.id),style:{padding:"6px 10px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text2,cursor:"pointer",fontSize:12}},isExpanded?"▲ Lotes":"▼ Lotes"),
                h("button",{onClick:()=>openEdit(item),style:{width:28,height:28,borderRadius:6,border:`1px solid ${P.border}`,background:"transparent",color:P.accent,cursor:"pointer",fontSize:12}},"✎"),
                h("button",{onClick:()=>del(item.id),style:{width:28,height:28,borderRadius:6,border:"1px solid rgba(192,112,112,.2)",background:"transparent",color:P.red,cursor:"pointer",fontSize:12}},"🗑")
              )
            )
          ),
          // Expansão: lotes + movimentações
          isExpanded && h("div",{style:{background:P.card2,border:`1px solid ${sc.color}33`,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"0 16px 16px"}},
            // Lotes ativos
            h("div",{style:{marginTop:14}},
              h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10,fontWeight:600}},"Lotes em Estoque"),
              (item.lotes||[]).length === 0
                ? h("div",{style:{color:P.text3,fontSize:13,padding:"8px 0"}},"Nenhum lote cadastrado. Clique em ＋ Entrada.")
                : h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
                    [...(item.lotes||[])].sort((a,b) => {
                      // Ordena por validade (FEFO - First Expired First Out)
                      const parseVal = v => { try{ const[m,y]=v.split("/"); return new Date(y,m-1,1); }catch{ return new Date(9999,0); }};
                      return parseVal(a.validade) - parseVal(b.validade);
                    }).map(lote => {
                      const al = validadeAlerta(lote.validade);
                      const usoPct = lote.qtdOriginal > 0 ? Math.round(((lote.qtdOriginal - lote.qtd) / lote.qtdOriginal)*100) : 0;
                      return h("div",{key:lote.id,style:{padding:"10px 14px",background:lote.qtd===0?"rgba(192,112,112,.05)":P.bg3,borderRadius:10,border:`1px solid ${al?al.color+"44":P.border}`,opacity:lote.qtd===0?0.6:1}},
                        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}},
                          h("div",null,
                            h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                              h("span",{style:{fontSize:12,color:P.text3,fontWeight:500}},"Lote"),
                              h("span",{style:{fontSize:13,color:P.accent3,fontWeight:700,letterSpacing:".04em"}},lote.codigo),
                              lote.qtd === 0 && h("span",{style:{fontSize:10,padding:"1px 7px",borderRadius:10,background:"rgba(192,112,112,.15)",color:P.red}},"Esgotado")
                            ),
                            h("div",{style:{display:"flex",gap:12,marginTop:4,flexWrap:"wrap"}},
                              lote.validade && h("span",{style:{fontSize:11,color:al?al.color:P.text3}},`Val: ${lote.validade}${al?" · "+al.label:""}`),
                              h("span",{style:{fontSize:11,color:P.text3}},`Entrada: ${lote.dtEntrada}`)
                            )
                          ),
                          h("div",{style:{textAlign:"right"}},
                            h("div",{style:{display:"flex",alignItems:"baseline",gap:4}},
                              h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:lote.qtd===0?P.text3:P.green}},lote.qtd),
                              h("span",{style:{fontSize:11,color:P.text3}}," / "+lote.qtdOriginal+" "+item.unit)
                            ),
                            lote.qtdOriginal > 0 && h("div",{style:{marginTop:4}},
                              h("div",{style:{height:3,width:80,borderRadius:2,background:P.border,overflow:"hidden"}},
                                h("div",{style:{height:"100%",width:usoPct+"%",background:lote.qtd===0?P.red:P.rose,borderRadius:2}})
                              ),
                              h("div",{style:{fontSize:9,color:P.text3,marginTop:2}},usoPct+"% usado")
                            )
                          )
                        )
                      );
                    })
                  )
            ),
            // Últimas movimentações
            (item.movimentacoes||[]).length > 0 && h("div",{style:{marginTop:16}},
              h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",marginBottom:10,fontWeight:600}},"Últimas Movimentações"),
              h("div",{style:{display:"flex",flexDirection:"column",gap:4}},
                [...(item.movimentacoes||[])].reverse().slice(0,6).map((mov,i) =>
                  h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:P.bg,borderRadius:8,border:`1px solid ${P.border}`}},
                    h("div",null,
                      h("span",{style:{fontSize:11,fontWeight:600,color:mov.tipo==="entrada"?P.green:P.yellow}},mov.tipo==="entrada"?"↑ Entrada":"↓ Saída"),
                      h("span",{style:{fontSize:11,color:P.text3,marginLeft:8}},mov.obs||"")
                    ),
                    h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                      h("span",{style:{fontSize:11,color:P.text3}},mov.data),
                      h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:mov.tipo==="entrada"?P.green:P.yellow}},
                        (mov.tipo==="entrada"?"+":"-")+mov.qtd+" "+item.unit
                      )
                    )
                  )
                )
              )
            )
          )
        );
      })
    ),

    // ── Modal: Entrada por Lote ──
    h(Modal,{open:!!showLoteModal,onClose:()=>{setShowLoteModal(null);setLoteForm(blankLote);},title:"📦 Entrada de Estoque por Lote",width:480},
      (()=>{
        const prod = products.find(p=>p.id===showLoteModal);
        if(!prod) return null;
        return h("div",null,
          h("div",{style:{padding:"10px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`,marginBottom:16,display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:20}},prod.emoji||"📦"),
            h("div",null,
              h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},prod.name),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`Saldo atual: ${getTotalQty(prod)} ${prod.unit}`)
            )
          ),
          h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
            h(Field,{label:"Código do Lote"},h(Inp,{value:loteForm.codigo,onChange:lfv("codigo"),placeholder:"Ex: AB12345"})),
            h(Field,{label:"Validade",half:true},h(Inp,{value:loteForm.validade,onChange:lfv("validade"),placeholder:"MM/AAAA"})),
            h(Field,{label:`Quantidade (${prod.unit})`,half:true},h(Inp,{type:"number",value:loteForm.qtd,onChange:lfv("qtd"),placeholder:"0"})),
            h(Field,{label:"Observações (opcional)"},h(Inp,{value:loteForm.obs,onChange:lfv("obs"),placeholder:"Ex: Compra fornecedor X"}))
          ),
          loteForm.codigo && loteForm.qtd && h("div",{style:{marginTop:8,padding:"10px 14px",background:"rgba(122,173,138,.08)",border:"1px solid rgba(122,173,138,.25)",borderRadius:8,fontSize:12,color:P.green}},
            `✓ Novo saldo após entrada: ${getTotalQty(prod) + Number(loteForm.qtd||0)} ${prod.unit}`
          ),
          h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}},
            h(Btn,{variant:"ghost",onClick:()=>{setShowLoteModal(null);setLoteForm(blankLote);}},"Cancelar"),
            h(Btn,{onClick:saveLote,disabled:!loteForm.codigo||!loteForm.qtd},"Confirmar Entrada")
          )
        );
      })()
    ),

    // ── Modal: Novo/Editar Produto ──
    h(Modal,{open:showNew,onClose:()=>{setShowNew(false);setEditItem(null);},title:editItem?"✎ Editar Produto":"✦ Novo Produto",width:500},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Nome"},h(Inp,{value:form.name,onChange:fv("name"),placeholder:"Ex: Botox Allergan 100U"})),
        h(Field,{label:"Emoji",half:true},h(Inp,{value:form.emoji,onChange:fv("emoji"),placeholder:"💉"})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:form.cat||"Toxina Botulínica",onChange:fv("cat"),options:cats})),
        h(Field,{label:"Unidade",half:true},h(Sel,{value:form.unit||"U",onChange:fv("unit"),options:["U","ml","un","sir","fr","amp","cx","pct"]})),
        !editItem && h(Field,{label:"Quantidade Inicial",half:true},h(Inp,{type:"number",value:form.qty,onChange:fv("qty"),placeholder:"0"})),
        h(Field,{label:"Qtd. Mínima",half:true},h(Inp,{type:"number",value:form.min,onChange:fv("min"),placeholder:"5"})),
        !editItem && h(Field,{label:"Código do Lote Inicial",half:true},h(Inp,{value:form.lote_codigo||"",onChange:v=>setForm(p=>({...p,lote_codigo:v})),placeholder:"Ex: AB12345"})),
        !editItem && h(Field,{label:"Validade do Lote",half:true},h(Inp,{value:form.lote_validade||"",onChange:v=>setForm(p=>({...p,lote_validade:v})),placeholder:"MM/AAAA"})),
        h(Field,{label:"Custo Unit. (R$)",half:true},h(Inp,{type:"number",value:form.cost||"",onChange:fv("cost"),placeholder:"0,00"}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowNew(false);setEditItem(null);}},"Cancelar"),
        h(Btn,{onClick:save},editItem?"Salvar":"Adicionar")
      )
    )
  );
}

// ─── FINANCEIRO ───────────────────────────────────────────────────────────────
function Financeiro({patients,setPatients,expenses,setExpenses,incomes,setIncomes}){
  const[showNewExp,setShowNewExp]=useState(false);
  const[editExp,setEditExp]=useState(null);
  const[showNewInc,setShowNewInc]=useState(false);
  const[editInc,setEditInc]=useState(null);
  const[finTab,setFinTab]=useState("entradas");
  const blankExp={desc:"",date:"",cat:"Outros",value:"",status:"Pago",notes:"",parcelas:"",taxaMaq:""};
  const blankInc={desc:"",date:"",cat:"Sessão",value:"",payMethod:"Pix",status:"Pago",notes:"",parcelas:"1",taxaMaq:"",patientName:""};
  const[form,setForm]=useState(blankExp);
  const[incForm,setIncForm]=useState(blankInc);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const ifv=k=>v=>setIncForm(p=>({...p,[k]:v}));
  const h=createElement;
  const allS=patients.flatMap((p,i)=>(p.sessions||[]).map(s=>({...s,pname:p.name,pi:i,pid:p.id})));
  const sessionsRec=allS.filter(s=>s.paid).reduce((a,s)=>a+s.value,0);
  const incomesRec=incomes.filter(i=>!i.sessRef&&i.status==="Pago").reduce((a,i)=>a+Number(i.value||0),0);
  const received=sessionsRec+incomesRec;
  const pending=allS.filter(s=>!s.paid).reduce((a,s)=>a+s.value,0);
  const totalExp=expenses.reduce((a,e)=>a+Number(e.value||0),0);
  const months=[{m:"Jan",rec:38000,exp:14000},{m:"Fev",rec:41000,exp:13200},{m:"Mar",rec:44500,exp:15100},{m:"Abr",rec:42000,exp:14800},{m:"Mai",rec:received||48200,exp:totalExp}];
  function toggleFinStatus(pid,sid,newSt){setPatients(prev=>prev.map(p=>p.id!==pid?p:{...p,sessions:(p.sessions||[]).map(s=>s.id!==sid?s:{...s,finStatus:newSt,paid:newSt==="Pago"})}));}
  function saveExp(){
    if(editExp)setExpenses(prev=>prev.map(e=>e.id===editExp.id?{...e,...form,value:Number(form.value)||0}:e));
    else setExpenses(prev=>[...prev,{...form,id:Date.now(),value:Number(form.value)||0}]);
    setShowNewExp(false);setEditExp(null);setForm(blankExp);
  }
  function saveInc(){
    const tax=Number(incForm.taxaMaq)||0;
    const gross=Number(incForm.value)||0;
    const net=incForm.payMethod==="Cartão Crédito"?gross*(1-tax/100):gross;
    const entry={...incForm,id:Date.now(),value:gross,netValue:net,paid:incForm.status==="Pago"};
    if(editInc)setIncomes(prev=>prev.map(i=>i.id===editInc.id?entry:i));
    else setIncomes(prev=>[...prev,entry]);
    setShowNewInc(false);setEditInc(null);setIncForm(blankInc);
  }
  function delExp(id){if(window.confirm("Excluir despesa?"))setExpenses(prev=>prev.filter(e=>e.id!==id));}
  function delInc(id){if(window.confirm("Excluir entrada?"))setIncomes(prev=>prev.filter(i=>i.id!==id));}
  function openEditExp(e){setEditExp(e);setForm({...e,value:String(e.value)});setShowNewExp(true);}
  function openEditInc(i){setEditInc(i);setIncForm({...i,value:String(i.value)});setShowNewInc(true);}
  return h("div",null,
    h(SectionHeader,{title:"Fluxo de Caixa",sub:"Resumo financeiro completo"}),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Receita",v:fmtCurr(received||48200),c:P.accent},{l:"Despesas",v:fmtCurr(totalExp),c:P.red},{l:"Lucro Líquido",v:fmtCurr((received||48200)-totalExp),c:P.green},{l:"A Receber",v:fmtCurr(pending||6800),c:P.yellow}].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:k.c}},k.v)))
    ),
    h(Card,{style:{marginBottom:18}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Receita vs Despesas"),
      h("div",{style:{display:"flex",alignItems:"flex-end",gap:12,height:90}},
        months.map(m=>{const mx=55000;return h("div",{key:m.m,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}},
          h("div",{style:{flex:1,display:"flex",alignItems:"flex-end",gap:3,width:"100%"}},
            h("div",{style:{flex:1,height:`${(m.rec/mx)*100}%`,background:`linear-gradient(to top,${P.rose},${P.gold})`,borderRadius:"3px 3px 0 0"}}),
            h("div",{style:{flex:1,height:`${(m.exp/mx)*100}%`,background:`linear-gradient(to top,${P.red},rgba(192,112,112,.3))`,borderRadius:"3px 3px 0 0"}})
          ),
          h("div",{style:{fontSize:9,color:m.m==="Mai"?P.accent:P.text3,textTransform:"uppercase"}},m.m)
        );})
      )
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Entradas"),
          h(Btn,{onClick:()=>{setEditInc(null);setIncForm(blankInc);setShowNewInc(true);},style:{fontSize:12,padding:"6px 14px"}},"＋ Entrada Extra")
        ),
        h("div",{style:{marginBottom:10}},h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},h("div",null,h("div",{style:{fontSize:11,color:P.text3}},"🔄 Sessões auto-sincronizadas do prontuário"),h("div",{style:{fontSize:10,color:P.text3,marginTop:1}},allS.length+" total · "+allS.filter(s=>s.paid).length+" pagas")),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.green}},fmtCurr(sessionsRec)))),
        allS.sort((a,b)=>{try{const[da,ma,ya]=String(a.date||"").split("/");const[db,mb,yb]=String(b.date||"").split("/");return new Date(yb+"-"+mb+"-"+db)-new Date(ya+"-"+ma+"-"+da);}catch{return 0;}}).map((s,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`}},
          h("div",null,h("div",{style:{fontSize:13,color:P.text}},`${s.pname} — ${s.procedure}`),h("div",{style:{fontSize:11,color:P.text3}},`${s.date} · ${s.payMethod}${s.payMethod==="Cartão Crédito"&&s.parcelas>1?" · "+s.parcelas+"x de "+fmtCurr(s.value/s.parcelas):""}`)  ),
          h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{textAlign:"right"}},
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:s.paid?P.green:P.yellow}},fmtCurr(s.value)),
              s.payMethod==="Cartão Crédito"&&s.parcelas>1&&h("div",{style:{fontSize:10,color:P.accent,fontWeight:600}},`${s.parcelas}x ${fmtCurr(s.value/s.parcelas)}`)
            ),
            h("select",{value:s.finStatus||"Pendente",onChange:e=>toggleFinStatus(s.pid,s.id,e.target.value),style:{fontSize:10,padding:"3px 8px",borderRadius:10,color:s.paid?P.green:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},FIN_STATUS.map(st=>h("option",{key:st,value:st},st)))
          )
        )),
        incomes.filter(i=>!i.sessRef).length>0&&h("div",null,
          h("div",{style:{fontSize:11,color:P.text3,margin:"10px 0 6px"}},"＋ Entradas extras (não vinculadas a sessões):"),
          incomes.filter(i=>!i.sessRef).map((inc,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`}},
            h("div",null,h("div",{style:{fontSize:13,color:P.text}},inc.desc||inc.patientName||"Entrada"),h("div",{style:{fontSize:11,color:P.text3}},`${inc.date} · ${inc.payMethod}${inc.payMethod==="Cartão Crédito"&&inc.parcelas>1?" · "+inc.parcelas+"x":""}`)),
            h("div",{style:{display:"flex",alignItems:"center",gap:8}},
              h("div",null,
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:inc.status==="Pago"?P.green:P.yellow}},fmtCurr(inc.value)),
                inc.netValue&&inc.netValue!==inc.value&&h("div",{style:{fontSize:10,color:P.text3}},`Líq: ${fmtCurr(inc.netValue)}`)
              ),
              h("select",{value:inc.status,onChange:e=>setIncomes(prev=>prev.map(x=>x.id===inc.id?{...x,status:e.target.value,paid:e.target.value==="Pago"}:x)),style:{fontSize:10,padding:"3px 8px",borderRadius:10,color:inc.status==="Pago"?P.green:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},FIN_STATUS.map(st=>h("option",{key:st,value:st},st))),
              h("button",{onClick:()=>openEditInc(inc),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
              h("button",{onClick:()=>delInc(inc.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
            )
          ))
        )
      ),
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Despesas"),
          h(Btn,{onClick:()=>{setEditExp(null);setForm(blankExp);setShowNewExp(true);},style:{fontSize:12,padding:"6px 14px"}},"＋ Despesa")
        ),
        expenses.map((e,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${P.border}`}},
          h("div",null,h("div",{style:{fontSize:13,color:P.text}},e.desc),h("div",{style:{fontSize:11,color:P.text3}},`${e.date} · ${e.cat}`)),
          h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.red}},`− ${fmtCurr(e.value)}`),
            h("button",{onClick:()=>openEditExp(e),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
            h("button",{onClick:()=>delExp(e.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
          )
        )),
        h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px solid ${P.border}`}},h("span",{style:{fontSize:12,color:P.text3}},"Total Despesas"),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.red}},`− ${fmtCurr(totalExp)}`))
      )
    ),
    h(Modal,{open:showNewInc,onClose:()=>{setShowNewInc(false);setEditInc(null);},title:editInc?"✎ Editar Entrada":"＋ Nova Entrada Manual",width:520},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Descrição"},h(Inp,{value:incForm.desc,onChange:ifv("desc"),placeholder:"Ex: Consultoria avulsa, Venda produto..."})),
        h(Field,{label:"Paciente (opcional)",half:true},h(Inp,{value:incForm.patientName,onChange:ifv("patientName"),placeholder:"Nome da paciente"})),
        h(Field,{label:"Data",half:true},h(Inp,{type:"date",value:incForm.date,onChange:ifv("date")})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:incForm.cat,onChange:ifv("cat"),options:["Sessão","Produto","Consultoria","Evento","Outro"]})),
        h(Field,{label:"Forma de Pagamento",half:true},h(Sel,{value:incForm.payMethod,onChange:ifv("payMethod"),options:PAY_METHODS})),
        h(Field,{label:"Valor Bruto (R$)",half:true},h(Inp,{value:incForm.value,onChange:ifv("value"),placeholder:"0,00"})),
        h(Field,{label:"Status",half:true},h(Sel,{value:incForm.status,onChange:ifv("status"),options:FIN_STATUS})),
        incForm.payMethod==="Cartão Crédito"&&h(Field,{label:"Parcelas",half:true},h(Sel,{value:incForm.parcelas,onChange:ifv("parcelas"),options:["1","2","3","4","5","6","7","8","9","10","11","12"]})),
        incForm.payMethod==="Cartão Crédito"&&h(Field,{label:"Taxa Maquininha (%)",half:true},h(Inp,{value:incForm.taxaMaq,onChange:ifv("taxaMaq"),placeholder:"Ex: 2.5"})),
        incForm.payMethod==="Cartão Crédito"&&Number(incForm.taxaMaq)>0&&Number(incForm.value)>0&&h("div",{style:{width:"100%",padding:"10px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
          h("div",{style:{fontSize:11,color:P.text3,marginBottom:6}},"Simulação de Recebimento:"),
          h("div",{style:{display:"flex",gap:20}},
            h("div",null,h("div",{style:{fontSize:10,color:P.text3}},"Valor por parcela"),h("div",{style:{fontSize:15,color:P.text}},fmtCurr(Number(incForm.value)/Number(incForm.parcelas||1)))),
            h("div",null,h("div",{style:{fontSize:10,color:P.text3}},"Taxa"),h("div",{style:{fontSize:15,color:P.red}},`${incForm.taxaMaq}%`)),
            h("div",null,h("div",{style:{fontSize:10,color:P.text3}},"Valor Líquido"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.green}},fmtCurr(Number(incForm.value)*(1-Number(incForm.taxaMaq)/100))))
          )
        ),
        h(Field,{label:"Observações"},h(TA,{value:incForm.notes,onChange:ifv("notes"),placeholder:"Notas...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},h(Btn,{variant:"ghost",onClick:()=>{setShowNewInc(false);setEditInc(null);}},"Cancelar"),h(Btn,{onClick:saveInc},editInc?"Salvar":"Adicionar"))
    ),
    h(Modal,{open:showNewExp,onClose:()=>{setShowNewExp(false);setEditExp(null);},title:editExp?"✎ Editar Despesa":"＋ Nova Despesa",width:480},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Descrição"},h(Inp,{value:form.desc,onChange:fv("desc"),placeholder:"Ex: Aluguel Barra Olímpica"})),
        h(Field,{label:"Data",half:true},h(Inp,{type:"date",value:form.date,onChange:fv("date")})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:form.cat,onChange:fv("cat"),options:EXPENSE_CATS})),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:form.value,onChange:fv("value"),placeholder:"0,00"})),
        h(Field,{label:"Status",half:true},h(Sel,{value:form.status,onChange:fv("status"),options:["Pago","Pendente","Cancelado"]})),
        h(Field,{label:"Observações"},h(TA,{value:form.notes,onChange:fv("notes"),placeholder:"Notas...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},h(Btn,{variant:"ghost",onClick:()=>{setShowNewExp(false);setEditExp(null);}},"Cancelar"),h(Btn,{onClick:saveExp},editExp?"Salvar":"Adicionar"))
    )
  );
}
// ─── DONUT CHART ─────────────────────────────────────────────────────────────
const CAT_MAP_GLOBAL={"Toxina Botulínica":"Toxina","Dysport":"Toxina","Xeomin":"Toxina","Preenchimento Labial":"Preenchimento","Preenchimento Malar":"Preenchimento","Preenchimento Mandíbula":"Preenchimento","Preenchimento Têmpora":"Preenchimento","Preenchimento Jowls":"Preenchimento","Preenchimento Marionete":"Preenchimento","Preenchimento Olheira":"Preenchimento","Preenchimento Bigode Chinês":"Preenchimento","Preenchimento Queixo":"Preenchimento","Preenchimento Facial":"Preenchimento","Bioestimulador de Colágeno":"Bioestimuladores","Sculptra":"Bioestimuladores","Fio de PDO":"Fios / Lifting","Microagulhamento":"Skincare","Nano Hidrox":"Skincare","PDRN":"Skincare","Profhilo":"Skincare","Peeling Químico":"Skincare","Exossomos":"Skincare","Skinbooster":"Skincare"};
const CAT_COLORS_GLOBAL={"Toxina":P.rose,"Preenchimento":"#7aaed4","Bioestimuladores":P.gold,"Fios / Lifting":"#9b7aad","Skincare":P.accent,"Outros":P.text3};
function DonutChart({catList,totalCat}){
  const h=createElement;
  if(!catList||!catList.length||!totalCat)return h("div",{style:{textAlign:"center",color:P.text3,fontSize:12,padding:20}},"Sem dados");
  const R=52,cx=70,cy=70,stroke=22,circ=2*Math.PI*R;
  let offset=0;
  const slices=catList.map(([cat,val])=>{const dash=(val/Math.max(totalCat,1))*circ;const el=h("circle",{key:cat,cx,cy,r:R,fill:"none",stroke:CAT_COLORS_GLOBAL[cat]||P.text3,strokeWidth:stroke,strokeDasharray:`${dash} ${circ-dash}`,strokeDashoffset:-offset,style:{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}});offset+=dash;return el;});
  return h("svg",{width:140,height:140,viewBox:"0 0 140 140"},h("g",null,slices),h("text",{x:cx,y:cy-6,textAnchor:"middle",fill:P.accent3,fontSize:13,fontWeight:600},catList.length),h("text",{x:cx,y:cy+10,textAnchor:"middle",fill:P.text3,fontSize:9},"categorias"));
}
// ─── ANIVERSARIANTES DO MÊS ───────────────────────────────────────────────────
function OrigemFaturamento({patients,selMonth,selYear,parseDMY2}){
  const h=createElement;
  const safePats=Array.isArray(patients)?patients.filter(Boolean):[];
  const allS=safePats.flatMap(p=>(Array.isArray(p.sessions)?p.sessions:[]).filter(Boolean).map(s=>({...s,value:Number(s.value)||0,origem:p.origem||"nova",indicadoPor:p.indicadoPor||"",pname:p.name,pid:p.id,since:p.since})));
  const monthS=allS.filter(s=>{try{const d=parseDMY2(s.date);return d&&d.getMonth()===selMonth&&d.getFullYear()===selYear&&s.paid;}catch{return false;}});
  const total=monthS.reduce((a,s)=>a+s.value,0)||1;

  // Classifica sessão por origem da paciente + se é recorrente no mês
  const patSessionsThisMonth={};
  monthS.forEach(s=>{if(!patSessionsThisMonth[s.pid])patSessionsThisMonth[s.pid]=[];patSessionsThisMonth[s.pid].push(s);});

  const groups={nova:0,recorrente:0,indicacao:0,campanha:0};
  monthS.forEach(s=>{
    const orig=s.origem||"nova";
    if(orig==="indicacao")groups.indicacao+=s.value;
    else if(orig==="campanha")groups.campanha+=s.value;
    else if(patSessionsThisMonth[s.pid]&&allS.filter(x=>x.pid===s.pid&&x.paid).length>1)groups.recorrente+=s.value;
    else groups.nova+=s.value;
  });

  const cats=[
    {k:"nova",l:"Novas Pacientes",icon:"🌟",color:"#9b7aad",bg:"rgba(155,122,173,.12)"},
    {k:"recorrente",l:"Recorrentes",icon:"🔄",color:P.green,bg:"rgba(122,173,138,.12)"},
    {k:"indicacao",l:"Indicações",icon:"🤝",color:"#7aaed4",bg:"rgba(122,174,212,.12)"},
    {k:"campanha",l:"Campanhas",icon:"📣",color:P.yellow,bg:"rgba(196,169,106,.12)"},
  ];

  const indicacoes=safePats.filter(p=>p.origem==="indicacao"&&p.indicadoPor);

  if(monthS.length===0)return null;
  return h(Card,{style:{marginBottom:22,border:"1px solid rgba(157,119,97,.3)"}},
    h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:18}},
      h("span",{style:{fontSize:20}},"📊"),
      h("div",null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Origem do Faturamento"),
        h("div",{style:{fontSize:12,color:P.text3,marginTop:1}},"Distribuição por origem das pacientes")
      )
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}},
      cats.map(cat=>h("div",{key:cat.k,style:{padding:"14px",borderRadius:10,background:cat.bg,border:"1px solid "+cat.color+"33"}},
        h("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:8}},
          h("span",{style:{fontSize:18}},cat.icon),
          h("span",{style:{fontSize:12,color:P.text2,fontWeight:500}},cat.l)
        ),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:cat.color,lineHeight:1}},
          "R$"+(groups[cat.k]||0).toLocaleString("pt-BR")
        ),
        h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},
          Math.round(((groups[cat.k]||0)/total)*100)+"% do faturamento"
        ),
        h("div",{style:{height:4,borderRadius:2,background:"rgba(255,255,255,.08)",overflow:"hidden",marginTop:8}},
          h("div",{style:{height:"100%",width:Math.round(((groups[cat.k]||0)/total)*100)+"%",background:cat.color,borderRadius:2,transition:"width .4s"}})
        )
      ))
    ),
    indicacoes.length>0&&h("div",null,
      h("div",{style:{fontSize:11,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,fontWeight:600}},"🤝 Pacientes por Indicação"),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
        indicacoes.map(p=>h("div",{key:p.id,style:{fontSize:12,padding:"4px 10px",borderRadius:20,background:"rgba(122,174,212,.1)",border:"1px solid rgba(122,174,212,.2)",color:"#7aaed4"}},
          p.name.split(" ")[0]+" → ind. por "+p.indicadoPor
        ))
      )
    )
  );
}
// ─── PAGAMENTOS CARD (extraído para evitar IIFE no build) ────────────────────
function PagamentosCard({allS}){
  const h=createElement;
  const pmMap={};
  allS.filter(s=>s.paid).forEach(s=>{const pm=s.payMethod||"Outro";pmMap[pm]=(pmMap[pm]||0)+(Number(s.value)||0);});
  const pmTotal=Object.values(pmMap).reduce((a,v)=>a+v,0)||1;
  const pmColors={"Pix":P.green,"Cartão Crédito":"#7aaed4","Cartão Débito":"#5a8aad","Dinheiro":P.accent,"Transferência":P.rose2,"Pendente":P.yellow};
  const entries=Object.entries(pmMap).sort((a,b)=>b[1]-a[1]);
  return h(Card,null,
    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Formas de Pagamento"),
    entries.length===0
      ?h("div",{style:{fontSize:12,color:P.text3,textAlign:"center",padding:"16px 0"}},"Sem dados")
      :entries.map(([pm,val])=>{
        const pct=Math.round((val/pmTotal)*100);
        return h("div",{key:pm,style:{marginBottom:12}},
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,color:P.text2,marginBottom:5}},
            h("span",null,pm),
            h("span",{style:{color:pmColors[pm]||P.accent}},pct+"%")
          ),
          h("div",{style:{height:4,borderRadius:2,background:P.bg3,overflow:"hidden"}},
            h("div",{style:{height:"100%",width:pct+"%",background:pmColors[pm]||P.accent,borderRadius:2}})
          )
        );
      })
  );
}
// ─── RELATÓRIOS ───────────────────────────────────────────────────────────────
function Relatorios({patients = [], incomes = [], expenses = [], onSelectPatient, onNav, procedures = []}){
  const now=new Date();
  const[selMonth,setSelMonth]=useState(now.getMonth());
  const[selYear,setSelYear]=useState(now.getFullYear());
  const[chartMode,setChartMode]=useState("receita");
  const h=createElement;
  // SAFE: sempre array, nunca crasha
  const safePats=Array.isArray(patients)?patients.filter(Boolean):[];
  const parseDMY2=s=>{if(!s)return null;try{const[d,m,y]=String(s).split("/");const dt=new Date(y+"-"+m+"-"+d);return isNaN(dt)?null:dt;}catch{return null;}};
  const allS=safePats.flatMap(p=>((p&&Array.isArray(p.sessions)?p.sessions:[])).filter(Boolean).map(s=>({...s,pname:p.name||"",pid:p.id,value:Number(s.value)||0,procedure:typeof s.procedure==="string"?s.procedure:String(s.procedure||"")})));
  const monthSessions=allS.filter(s=>{try{const d=parseDMY2(s.date);return d&&d.getMonth()===selMonth&&d.getFullYear()===selYear;}catch{return false;}});
  const monthRevenue=monthSessions.filter(s=>s.paid).reduce((a,s)=>a+(Number(s.value)||0),0);
  // procedimentos
  const procMap={};
  monthSessions.forEach(s=>{if(!s.procedure)return;if(!procMap[s.procedure])procMap[s.procedure]={count:0,total:0,paid:0,pending:0};procMap[s.procedure].count++;procMap[s.procedure].total+=(Number(s.value)||0);if(s.paid)procMap[s.procedure].paid+=(Number(s.value)||0);else procMap[s.procedure].pending+=(Number(s.value)||0);});
  const procList=Object.entries(procMap).sort((a,b)=>b[1].total-a[1].total);
  const colors=[P.rose,P.gold,P.accent,"#7aaed4","#7aad8a","#9b7aad","#8a5c7a","#5a8a7a"];
  // donut categorias
  const catMap={};
  // Categoriza usando procedimentos cadastrados (dinâmico) ou fallback no CAT_MAP_GLOBAL
  const procCatLookup={};
  (procedures||[]).forEach(p=>{
    const name=typeof p==="string"?p:(p&&p.name)||"";
    const cat=typeof p==="object"&&p.categoria?p.categoria:CAT_MAP_GLOBAL[name]||"Outros";
    if(name)procCatLookup[name]=cat;
  });
  monthSessions.filter(s=>s.paid).forEach(s=>{const cat=procCatLookup[s.procedure]||CAT_MAP_GLOBAL[s.procedure]||"Outros";catMap[cat]=(catMap[cat]||0)+(Number(s.value)||0);});
  const catList=Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const totalCat=catList.reduce((a,[,v])=>a+v,0)||1;
  // evolução 6 meses
  const last6=Array.from({length:6},(_,i)=>{const d=new Date(selYear,selMonth-5+i,1);return{m:d.getMonth(),y:d.getFullYear(),label:MONTH_NAMES[d.getMonth()].slice(0,3)};});
  const monthlyData=last6.map(({m,y,label})=>{const ss=allS.filter(s=>{try{const d=parseDMY2(s.date);return d&&d.getMonth()===m&&d.getFullYear()===y;}catch{return false;}});return{label,rec:ss.filter(s=>s.paid).reduce((a,s)=>a+(Number(s.value)||0),0),count:ss.length};});
  const maxRec=monthlyData.reduce((a,d)=>d.rec>a?d.rec:a,1);
  // fidelização
  const totalPatsWithSessions=safePats.filter(p=>(p.sessions||[]).length>0).length;
  const returnedOnTime=safePats.filter(p=>{try{const s=[...(p.sessions||[])].sort((a,b)=>(parseDMY2(b.date)||new Date(0))-(parseDMY2(a.date)||new Date(0)));if(s.length<2)return false;const d1=parseDMY2(s[1].date),d2=parseDMY2(s[0].date);if(!d1||!d2)return false;return Math.floor((d2-d1)/864e5)<=(Number(s[1].returnReminderDays)||90)*1.2;}catch{return false;}}).length;
  const fidPct=totalPatsWithSessions>0?Math.round((returnedOnTime/totalPatsWithSessions)*100):0;
  // forecast
  const nextM=(selMonth+1)%12;
  const nextY=selMonth===11?selYear+1:selYear;
  const forecastRev=Math.round([0,1,2].map(i=>{const m=(selMonth-i+12)%12,y=selMonth-i<0?selYear-1:selYear;return allS.filter(s=>{try{const d=parseDMY2(s.date);return d&&d.getMonth()===m&&d.getFullYear()===y&&s.paid;}catch{return false;}}).reduce((a,s)=>a+(Number(s.value)||0),0);}).reduce((a,v)=>a+v,0)/3*1.05);
  // top combos
  const combos={};
  safePats.forEach(p=>{const ss=(Array.isArray(p.sessions)?p.sessions:[]).filter(Boolean);ss.forEach((a,i)=>ss.slice(i+1).forEach(b=>{try{const da=parseDMY2(a.date)||new Date(0),db=parseDMY2(b.date)||new Date(0);if(Math.abs(da-db)<7*864e5){const key=[a.procedure||"?",b.procedure||"?"].sort().join(" + ");combos[key]=(combos[key]||0)+1;}}catch{};}));});
  const comboList=Object.entries(combos).sort((a,b)=>b[1]-a[1]).slice(0,5);
  function prevMonth(){if(selMonth===0){setSelMonth(11);setSelYear(y=>y-1);}else setSelMonth(m=>m-1);}
  function nextMonth(){if(selMonth===11){setSelMonth(0);setSelYear(y=>y+1);}else setSelMonth(m=>m+1);}
  const maxBarVal=procList.length===0?1:chartMode==="receita"?procList.reduce((a,[,d])=>d.total>a?d.total:a,1):procList.reduce((a,[,d])=>d.count>a?d.count:a,1);
  return h("div",null,
    h(SectionHeader,{title:"Relatórios",sub:"Análise completa da clínica"}),
    h(OrigemFaturamento,{patients:safePats,selMonth,selYear,parseDMY2}),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Total Sessões",v:allS.length,c:P.gold},{l:"Procedimentos",v:[...new Set(allS.map(s=>s.procedure))].length,c:"#7aaed4"},{l:"Fidelização",v:fidPct+"%",c:P.green},{l:"Forecast "+MONTH_NAMES[nextM].slice(0,3),v:fmtCurr(forecastRev),c:P.accent}].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:k.c}},k.v)))
    ),
    h(Card,{style:{marginBottom:22,border:"1px solid rgba(92,31,50,.35)"}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
        h("div",null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Procedimentos Realizados"),h("div",{style:{fontSize:13,color:P.text3,marginTop:2}},"Volume e receita por procedimento")),
        h("div",{style:{display:"flex",alignItems:"center",gap:10}},
          h("button",{onClick:prevMonth,style:{background:"transparent",border:"1px solid "+P.border,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"‹"),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent3,minWidth:160,textAlign:"center"}},MONTH_NAMES[selMonth]+" "+selYear),
          h("button",{onClick:nextMonth,style:{background:"transparent",border:"1px solid "+P.border,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"›")
        ),
        h("div",{style:{display:"flex",gap:6}},["receita","volume"].map(m=>h("button",{key:m,onClick:()=>setChartMode(m),style:{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",border:"1px solid "+P.border,background:chartMode===m?P.rose:"transparent",color:chartMode===m?P.accent3:P.text2}},m==="receita"?"💰 Receita":"📊 Volume")))
      ),
      procList.length===0?h("div",{style:{textAlign:"center",padding:30,color:P.text3,fontSize:13}},"Nenhum procedimento registrado neste mês.")
      :h("div",{style:{display:"grid",gridTemplateColumns:"1fr 180px",gap:24,alignItems:"start"}},
        h("div",null,procList.map(([proc,data],i)=>{
          const val=chartMode==="receita"?data.total:data.count;
          const pct=Math.round((val/maxBarVal)*100);
          const ticket=data.count>0?Math.round(data.total/data.count):0;
          return h("div",{key:proc,style:{marginBottom:14}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8}},h("span",{style:{display:"inline-block",width:10,height:10,borderRadius:2,background:colors[i%colors.length],flexShrink:0}}),h("span",{style:{fontSize:13,color:P.text,fontWeight:500}},proc)),
              h("div",{style:{display:"flex",alignItems:"center",gap:16,flexShrink:0}},h("span",{style:{fontSize:11,color:P.text3}},data.count+"x · ticket "+fmtCurr(ticket)),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:colors[i%colors.length]}},chartMode==="receita"?fmtCurr(data.total):data.count))
            ),
            h("div",{style:{height:8,borderRadius:4,background:P.bg3,overflow:"hidden"}},h("div",{style:{height:"100%",width:pct+"%",background:colors[i%colors.length],borderRadius:4,transition:"width .4s ease"}})),
            h("div",{style:{display:"flex",gap:12,marginTop:4}},h("span",{style:{fontSize:10,color:P.green}},"✓ "+fmtCurr(data.paid)),data.pending>0&&h("span",{style:{fontSize:10,color:P.yellow}},"⏳ "+fmtCurr(data.pending)))
          );
        })),
        h("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:12}},
          h("div",{style:{fontSize:12,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}},"Receita por Categoria"),
          h(DonutChart,{catList,totalCat}),
          h("div",{style:{width:"100%"}},catList.map(([cat,val])=>h("div",{key:cat,style:{display:"flex",alignItems:"center",gap:6,marginBottom:5}},h("span",{style:{width:8,height:8,borderRadius:2,background:CAT_COLORS_GLOBAL[cat]||P.text3,flexShrink:0,display:"inline-block"}}),h("span",{style:{fontSize:11,color:P.text2,flex:1}},cat),h("span",{style:{fontSize:11,color:P.text3}},Math.round((val/totalCat)*100)+"%"))))
        )
      ),
      monthSessions.length>0&&h("div",{style:{marginTop:18,padding:"12px 16px",background:P.bg3,borderRadius:10,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}},
        [{l:"Total Sessões",v:monthSessions.length},{l:"Pagas",v:monthSessions.filter(s=>s.paid).length},{l:"Pendentes",v:monthSessions.filter(s=>!s.paid).length},{l:"Ticket Médio",v:fmtCurr(monthRevenue/Math.max(monthSessions.filter(s=>s.paid).length,1))},{l:"Receita",v:fmtCurr(monthRevenue)}].map(k=>h("div",{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3}},k.v)))
      )
    ),
    h(Card,{style:{marginBottom:22}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:16}},"Evolução dos Últimos 6 Meses"),
      h("div",{style:{display:"flex",alignItems:"flex-end",gap:10,height:110,marginBottom:8}},
        monthlyData.map((m,i)=>{
          const isSelected=i===5;
          const hPct=maxRec>0?Math.round((m.rec/maxRec)*90):0;
          return h("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},
            h("div",{style:{fontSize:10,color:P.text3,marginBottom:2}},m.rec>0?fmtCurr(m.rec):"—"),
            h("div",{style:{width:"100%",height:80,display:"flex",alignItems:"flex-end"}},h("div",{style:{flex:1,height:(hPct||4)+"%",background:isSelected?"linear-gradient(to top,"+P.rose+","+P.gold+")":" linear-gradient(to top,"+P.rose2+",rgba(92,31,50,.3))",borderRadius:"3px 3px 0 0",transition:"height .4s ease"}})),
            h("div",{style:{fontSize:10,color:isSelected?P.accent:P.text3,fontWeight:isSelected?600:400}},m.label)
          );
        })
      ),
      h("div",{style:{fontSize:11,color:P.text3}},"Mês atual destacado · Barras = receita recebida")
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18,marginBottom:22}},
      h(Card,null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"Forecast"),h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},`Projeção para ${MONTH_NAMES[nextM]} ${nextY}`),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:P.green,marginBottom:6}},fmtCurr(forecastRev)),h("div",{style:{fontSize:11,color:P.text3}},"Média dos últimos 3 meses + 5%")),
      h(Card,null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"Fidelização"),h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},"Retorno no prazo recomendado"),h("div",{style:{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:42,color:fidPct>=70?P.green:fidPct>=50?P.yellow:P.red}},fidPct+"%"),h("div",{style:{fontSize:12,color:P.text3}},returnedOnTime+" de "+totalPatsWithSessions+" pacientes")),h("div",{style:{height:6,borderRadius:3,background:P.bg3,overflow:"hidden",marginBottom:8}},h("div",{style:{height:"100%",width:fidPct+"%",background:fidPct>=70?P.green:fidPct>=50?P.yellow:P.red,borderRadius:3}})),h("div",{style:{fontSize:11,color:P.text3}},fidPct>=70?"✦ Ótima retenção":fidPct>=50?"⚡ Retenção moderada":"⚠ Retenção baixa")),
      h(Card,null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"Top Combos"),h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},"Procedimentos mais feitos juntos"),comboList.length===0?h("div",{style:{fontSize:12,color:P.text3,textAlign:"center",padding:"16px 0"}},"Dados insuficientes"):comboList.map(([combo,count],i)=>h("div",{key:combo,style:{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<comboList.length-1?"1px solid "+P.border:"none"}},h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:colors[i%colors.length],minWidth:22,textAlign:"center"}},(i+1)+"°"),h("span",{style:{fontSize:12,color:P.text,flex:1,lineHeight:1.3}},combo),h("span",{style:{fontSize:11,color:P.text3,flexShrink:0}},count+"x"))))
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Ranking de Pacientes"),[...safePats].sort((a,b)=>(b.sessions||[]).reduce((s,x)=>s+(Number(x.value)||0),0)-(a.sessions||[]).reduce((s,x)=>s+(Number(x.value)||0),0)).slice(0,5).map((p,i)=>h("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid "+P.border}},h("div",{style:{fontSize:16,color:P.accent,fontFamily:"'Cormorant Garamond',serif",minWidth:22}},(i+1)+"°"),h(Avatar,{name:p.name,size:30,idx:i,src:p.profilePhoto}),h("div",{style:{flex:1}},h("div",{style:{fontSize:13,color:P.text}},p.name),h("div",{style:{fontSize:11,color:P.text3}},(p.sessions||[]).length+" sessões")),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.green}},fmtCurr((p.sessions||[]).reduce((a,s)=>a+(Number(s.value)||0),0)))))),
      h(PagamentosCard,{allS})
    )
  );
}

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const PROC_CATS=["Toxina Botulínica","Preenchimento","Bioestimuladores","Fios / Lifting","Skincare Clínico","Avaliação / Consultoria","Outros"];
const PROC_MAP_ICONS={"Toxina Botulínica":"💉","Preenchimento":"✨","Bioestimuladores":"🧬","Fios / Lifting":"🧵","Skincare Clínico":"🧴","Avaliação / Consultoria":"📋","Outros":"🩺"};
const PROC_CAT_COLORS={"Toxina Botulínica":P.rose,"Preenchimento":"#7aaed4","Bioestimuladores":P.gold,"Fios / Lifting":"#9b7aad","Skincare Clínico":P.accent,"Avaliação / Consultoria":P.green,"Outros":P.text3};

// ─── PROC FORM (standalone to respect React hook rules) ──────────────────────
function ProcForm({initial,onSave,onCancel,cats}){
  const h=createElement;
  const[form,setForm]=useState(initial||{name:"",categoria:"Outros",descricao:"",revisionDays:"",maintenanceDays:"",sessoesPadrao:"1",defaultValue:""});
  useEffect(()=>{if(initial)setForm(initial);},[initial?.id]);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const isNew=!initial?.id;
  return h("div",{style:{background:P.bg3,border:`1px solid ${P.rose}`,borderRadius:12,padding:20,marginBottom:16}},
    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent3,marginBottom:16}},isNew?"＋ Novo Procedimento":"✎ Editar: "+form.name),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}},
      h(Field,{label:"Nome do Procedimento"},h(Inp,{value:form.name,onChange:fv("name"),placeholder:"Ex: Preenchimento Labial"})),
      h(Field,{label:"Categoria"},
        h("select",{value:form.categoria||"Outros",onChange:e=>setForm(p=>({...p,categoria:e.target.value})),style:{...IS,width:"100%"}},
          (cats||[]).map(cat=>h("option",{key:cat,value:cat},(PROC_MAP_ICONS[cat]||"🩺")+" "+cat))
        )
      ),
      h(Field,{label:"Revisão após sessão (dias)"},h(Inp,{type:"number",value:form.revisionDays||"",onChange:fv("revisionDays"),placeholder:"Ex: 14"})),
      h(Field,{label:"Manutenção (dias)"},h(Inp,{type:"number",value:form.maintenanceDays||"",onChange:fv("maintenanceDays"),placeholder:"Ex: 120"})),
      h(Field,{label:"Sessões padrão no pacote"},h(Inp,{type:"number",value:form.sessoesPadrao||"1",onChange:fv("sessoesPadrao"),placeholder:"1"})),
      h(Field,{label:"Valor Padrão (R$)"},h(Inp,{type:"number",value:form.defaultValue||"",onChange:fv("defaultValue"),placeholder:"Ex: 850"})),
      h(Field,{label:"Descrição / Observações"},h(Inp,{value:form.descricao||"",onChange:fv("descricao"),placeholder:"Ex: Neuromodulador para relaxamento muscular"}))
    ),
    h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"}},
      h(Btn,{variant:"ghost",onClick:onCancel,style:{fontSize:12}},"Cancelar"),
      h(Btn,{onClick:()=>onSave({...form,name:form.name.trim()}),style:{fontSize:12}},"✓ Salvar Procedimento")
    )
  );
}


function Configuracoes({procedures,setProcedures,locations,setLocations,products,setProducts,settings,setSettings,returnRules,setReturnRules,skincareConfig,setSkincareConfig,procCats,setProcCats}){
  const h=createElement;
  const[tab,setTab]=useState("procedimentos");
  const[newLoc,setNewLoc]=useState("");
  const[newSkProd,setNewSkProd]=useState("");
  const[newSkFreq,setNewSkFreq]=useState("");
  const[newCat,setNewCat]=useState("");
  const[newCatIcon,setNewCatIcon]=useState("🩺");
  const cats=Array.isArray(procCats)&&procCats.length>0?procCats:["Toxina Botulínica","Preenchimento","Bioestimuladores","Fios / Lifting","Skincare Clínico","Avaliação / Consultoria","Outros"];
  function addCat(){const t=newCat.trim();if(t&&!cats.includes(t)){setProcCats([...cats,t]);setNewCat("");setNewCatIcon("🩺");}}
  function delCat(cat){
    if(procedures.map(p=>typeof p==="object"?p.categoria:"").includes(cat)){
      alert("Esta categoria está em uso por um ou mais procedimentos. Remova-os primeiro.");return;
    }
    if(window.confirm("Excluir categoria: "+cat+"?"))setProcCats(cats.filter(c=>c!==cat));
  }
  const[editingProc,setEditingProc]=useState(null); // proc object being edited
  const[showNewProc,setShowNewProc]=useState(false);
  const[newProcForm,setNewProcForm]=useState({name:"",categoria:"Outros",descricao:"",revisionDays:"",maintenanceDays:"",sessoesPadrao:"1",defaultValue:""});

  const getName=x=>typeof x==="string"?x:(x&&x.name)||"";
  const getProc=x=>typeof x==="string"?{id:"p_"+x,name:x,categoria:"Outros",descricao:"",revisionDays:0,maintenanceDays:0,sessoesPadrao:1,defaultValue:0}:{id:x.id||"",name:x.name||"",categoria:x.categoria||"Outros",descricao:x.descricao||"",revisionDays:x.revisionDays||0,maintenanceDays:x.maintenanceDays||0,sessoesPadrao:x.sessoesPadrao||1,defaultValue:x.defaultValue||0};
  const skProds=(skincareConfig&&skincareConfig.produtos)||[];
  const skFreqs=(skincareConfig&&skincareConfig.frequencias)||[];

  function saveProc(procObj){
    const exists=procedures.find(x=>getName(x)===procObj.name);
    if(exists){
      setProcedures(prev=>prev.map(p=>getName(p)===procObj.name?procObj:p));
    } else {
      setProcedures(prev=>[...prev,procObj]);
    }
    // Salva/atualiza regra de retorno também
    if(procObj.revisionDays||procObj.maintenanceDays){
      const hasRule=(returnRules||[]).find(r=>r.procedure===procObj.name);
      if(hasRule){
        setReturnRules(prev=>prev.map(r=>r.procedure===procObj.name?{...r,revisionDays:Number(procObj.revisionDays)||0,maintenanceDays:Number(procObj.maintenanceDays)||0}:r));
      } else {
        setReturnRules(prev=>[...prev,{id:Date.now(),procedure:procObj.name,revisionDays:Number(procObj.revisionDays)||0,maintenanceDays:Number(procObj.maintenanceDays)||0}]);
      }
    }
    setEditingProc(null);
    setShowNewProc(false);
  }

  function delProc(name){
    if(window.confirm("Excluir procedimento: "+name+"?")){
      setProcedures(prev=>prev.filter(x=>getName(x)!==name));
      setReturnRules(prev=>prev.filter(r=>r.procedure!==name));
    }
  }

  function addNewProc(formData){
    const name=(formData.name||"").trim();
    if(!name)return;
    const obj={id:"proc_"+Date.now(),name,categoria:formData.categoria||"Outros",descricao:formData.descricao||"",revisionDays:Number(formData.revisionDays)||0,maintenanceDays:Number(formData.maintenanceDays)||0,sessoesPadrao:Number(formData.sessoesPadrao)||1,defaultValue:Number(formData.defaultValue)||0};
    saveProc(obj);
  }

  function addLoc(){const t=newLoc.trim();if(t&&!locations.find(x=>getName(x)===t)){setLocations(prev=>[...prev,{id:"loc_"+Date.now(),name:t}]);setNewLoc("");}}
  function delLoc(l){if(window.confirm("Excluir: "+l))setLocations(prev=>prev.filter(x=>getName(x)!==l));}
  function addSkProd(){const t=newSkProd.trim();if(t&&!skProds.includes(t)){setSkincareConfig(s=>({...(s||{}),produtos:[...skProds,t],frequencias:skFreqs}));setNewSkProd("");}}
  function delSkProd(p){setSkincareConfig(s=>({...(s||{}),produtos:skProds.filter(x=>x!==p),frequencias:skFreqs}));}
  function addSkFreq(){const t=newSkFreq.trim();if(t&&!skFreqs.includes(t)){setSkincareConfig(s=>({...(s||{}),produtos:skProds,frequencias:[...skFreqs,t]}));setNewSkFreq("");}}
  function delSkFreq(f){setSkincareConfig(s=>({...(s||{}),produtos:skProds,frequencias:skFreqs.filter(x=>x!==f)}));}

  const TABS=[{k:"procedimentos",l:"🩺 Procedimentos"},{k:"locais",l:"📍 Locais"},{k:"skincare",l:"🧴 Skincare"},{k:"clinica",l:"👩‍⚕️ Clínica"}];

  // Formulário de procedimento (novo ou edição)
  return h("div",null,
    h(SectionHeader,{title:"Configurações",sub:"Gerencie procedimentos, locais e dados da clínica"}),
    // Tab bar
    h("div",{style:{display:"flex",gap:6,marginBottom:20,borderBottom:`1px solid ${P.border}`,paddingBottom:0}},
      TABS.map(t=>h("button",{key:t.k,onClick:()=>setTab(t.k),style:{padding:"9px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.k?P.rose:"transparent"}`,color:tab===t.k?P.accent3:P.text2,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===t.k?600:400,marginBottom:-1,transition:"all .15s"}},t.l))
    ),

    // ── ABA PROCEDIMENTOS ────────────────────────────────────────────────────
    tab==="procedimentos"&&h("div",null,
      !showNewProc&&!editingProc&&h("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:14}},
        h(Btn,{onClick:()=>setShowNewProc(true)},"＋ Novo Procedimento")
      ),
      showNewProc&&h(ProcForm,{onSave:addNewProc,onCancel:()=>setShowNewProc(false),cats}),
      editingProc&&h(ProcForm,{initial:editingProc,onSave:saveProc,onCancel:()=>setEditingProc(null),cats}),
      // Agrupado por categoria
      cats.map(cat=>{
        const catProcs=procedures.map(getProc).filter(p=>( p.categoria||"Outros")===cat);
        if(catProcs.length===0)return null;
        return h("div",{key:cat,style:{marginBottom:20}},
          h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},
            h("span",{style:{fontSize:18}},(PROC_MAP_ICONS[cat]||"🩺")),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:PROC_CAT_COLORS[cat]||P.text}},cat),
            h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},catProcs.length)
          ),
          h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
            catProcs.map(proc=>{
              const rule=(returnRules||[]).find(r=>r.procedure===proc.name);
              const rev=proc.revisionDays||rule?.revisionDays||0;
              const man=proc.maintenanceDays||rule?.maintenanceDays||0;
              return h(Card,{key:proc.name,style:{padding:"12px 16px"}},
                h("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}},
                  h("div",{style:{flex:1}},
                    h("div",{style:{fontSize:14,color:P.text,fontWeight:600,marginBottom:proc.descricao?4:0}},proc.name),
                    proc.descricao&&h("div",{style:{fontSize:12,color:P.text3,marginBottom:6}},proc.descricao),
                    h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
                      h("span",{style:{fontSize:11,color:PROC_CAT_COLORS[proc.categoria||"Outros"]||P.accent,background:(PROC_CAT_COLORS[proc.categoria||"Outros"]||P.accent)+"18",padding:"2px 8px",borderRadius:20}},(PROC_MAP_ICONS[proc.categoria]||"🩺")+" "+(proc.categoria||"Outros")),
                      rev>0&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"⏱ Revisão: "+rev+"d"),
                      man>0&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"🔄 Manutenção: "+man+"d"),
                      (proc.sessoesPadrao>1)&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"📦 "+proc.sessoesPadrao+" sessões"),
                      (proc.defaultValue>0)&&h("span",{style:{fontSize:11,color:P.green,background:"rgba(122,173,138,.1)",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(122,173,138,.25)"}},"💰 "+fmtCurr(proc.defaultValue))
                    )
                  ),
                  h("div",{style:{display:"flex",gap:6,flexShrink:0}},
                    h("button",{onClick:()=>setEditingProc({...proc,revisionDays:rev,maintenanceDays:man}),style:{padding:"6px 12px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:12}},"✎ Editar"),
                    h("button",{onClick:()=>delProc(proc.name),style:{padding:"6px 10px",borderRadius:8,background:"transparent",border:`1px solid rgba(192,112,112,.3)`,color:P.red,cursor:"pointer",fontSize:12}},"×")
                  )
                )
              );
            })
          )
        );
      }),
      // Gerenciar categorias
      h(Card,{style:{marginTop:8,border:`1px solid rgba(196,169,106,.2)`}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.yellow,marginBottom:12}},"🏷️ Gerenciar Categorias"),
        h("div",{style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}},
          h(Inp,{value:newCat,onChange:setNewCat,placeholder:"Nova categoria... ex: Laser, Drenagem",style:{flex:"1 1 200px"}}),
          h(Btn,{onClick:addCat,style:{flexShrink:0}},"＋ Adicionar")
        ),
        h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
          cats.map(cat=>h("div",{key:cat,style:{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:P.bg3,border:`1px solid ${(PROC_CAT_COLORS[cat]||P.border)}33`,borderRadius:20}},
            h("span",{style:{fontSize:13}},(PROC_MAP_ICONS[cat]||"🩺")),
            h("span",{style:{fontSize:12,color:PROC_CAT_COLORS[cat]||P.text2}},cat),
            h("button",{onClick:()=>delCat(cat),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:13,lineHeight:1,padding:"0 2px"}},"×")
          ))
        )
      )
    ),

    // ── ABA LOCAIS ───────────────────────────────────────────────────────────
    tab==="locais"&&h(Card,null,
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:16}},"📍 Locais de Atendimento"),
      h("div",{style:{display:"flex",gap:8,marginBottom:14}},
        h(Inp,{value:newLoc,onChange:setNewLoc,placeholder:"Nome do local..."}),
        h(Btn,{onClick:addLoc,style:{flexShrink:0,padding:"9px 14px"}},"＋")
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
        locations.map(l=>{const ln=getName(l);return h("div",{key:ln,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:18}},"📍"),
            h("span",{style:{fontSize:14,color:P.text}},ln)
          ),
          h("button",{onClick:()=>delLoc(ln),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:15}},locations.length>1?"×":"")
        );})
      )
    ),

    // ── ABA SKINCARE ─────────────────────────────────────────────────────────
    tab==="skincare"&&h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:16}},"🧴 Produtos Cadastrados"),
        h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h(Inp,{value:newSkProd,onChange:setNewSkProd,placeholder:"Ex: Ácido Mandélico 10%"}),
          h(Btn,{onClick:addSkProd,style:{flexShrink:0,padding:"9px 14px"}},"＋")
        ),
        h("div",{style:{display:"flex",flexDirection:"column",gap:5}},
          skProds.map(p=>h("div",{key:p,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
            h("span",{style:{fontSize:13,color:P.text}},"🧴 "+p),
            h("button",{onClick:()=>delSkProd(p),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:15}},"×")
          ))
        )
      ),
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:16}},"⏱ Frequências de Uso"),
        h("div",{style:{display:"flex",gap:8,marginBottom:12}},
          h(Inp,{value:newSkFreq,onChange:setNewSkFreq,placeholder:"Ex: 3x por semana"}),
          h(Btn,{onClick:addSkFreq,style:{flexShrink:0,padding:"9px 14px"}},"＋")
        ),
        h("div",{style:{display:"flex",flexDirection:"column",gap:5}},
          skFreqs.map(f=>h("div",{key:f,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
            h("span",{style:{fontSize:13,color:P.text}},"⏱ "+f),
            h("button",{onClick:()=>delSkFreq(f),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:15}},"×")
          ))
        )
      )
    ),

    // ── ABA CLÍNICA ──────────────────────────────────────────────────────────
    tab==="clinica"&&h(Card,{style:{maxWidth:480}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:16}},"👩‍⚕️ Dados da Clínica"),
      h(Field,{label:"Nome da Profissional"},h(Inp,{value:settings.doctorName||"",onChange:v=>setSettings(s=>({...s,doctorName:v})),placeholder:"Dra. Sofia"})),
      h(Field,{label:"Título / Profissão"},h(Inp,{value:settings.doctorTitle||"",onChange:v=>setSettings(s=>({...s,doctorTitle:v})),placeholder:"Médica Responsável"})),
      h(Field,{label:"Nome da Clínica"},h(Inp,{value:settings.clinicName||"",onChange:v=>setSettings(s=>({...s,clinicName:v})),placeholder:"HarmonizaPro"})),
      h("div",{style:{fontSize:12,color:P.green,marginTop:12}},"✓ Salvo automaticamente")
    )
  );
}


function EvolucaoFotos({patient,upd,addMedia,removeMedia}){
  const h=createElement;
  const [filterProc,setFilterProc]=useState("Todos");
  const [lightbox,setLightbox]=useState(null);
  const [annotating,setAnnotating]=useState(null); // {photo, sessId}
  // Todas as sessões, ordenadas por data mais antiga primeiro
  const allSessions=(patient.sessions||[]);
  const parseDt=s=>{try{const[d,m,y]=String(s||"").split("/");return new Date(y+"-"+m+"-"+d);}catch{return new Date(0);}};
  const sorted=[...allSessions].sort((a,b)=>parseDt(a.date)-parseDt(b.date));
  // Procedimentos únicos de todas as sessões (não só as com fotos)
  const allProcs=["Todos",...new Set(allSessions.map(s=>s.procedure).filter(Boolean))];
  const filtered=filterProc==="Todos"?sorted:sorted.filter(s=>s.procedure===filterProc);
  // Todas as fotos do filtro atual, em ordem cronológica
  const allPhotos=filtered.flatMap(s=>(s.photos||[]).map(p=>({...p,sessDate:s.date,sessProcedure:s.procedure,sessId:s.id})));
  const totalFotos=allSessions.reduce((a,s)=>a+(s.photos||[]).length,0);
  return h("div",null,
    // Cabeçalho + filtros
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
      h("div",null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Evolução Fotográfica"),
        h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},totalFotos+" foto(s) · "+allSessions.length+" sessão(ões)")
      ),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
        allProcs.map(proc=>h("button",{key:proc,onClick:()=>setFilterProc(proc),style:{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filterProc===proc?P.rose:"transparent",border:`1px solid ${filterProc===proc?P.rose:P.border}`,color:filterProc===proc?P.accent3:P.text2}},proc))
      )
    ),
    // Comparação antes/depois (só aparece se tiver 2+ fotos)
    allPhotos.length>=2&&h(Card,{style:{marginBottom:18,border:"1px solid rgba(92,31,50,.3)"}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"✦ Comparação Antes / Depois"),
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}},
        h("div",null,
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,textAlign:"center"}},"Antes — "+allPhotos[0].sessDate+" · "+allPhotos[0].sessProcedure),
          h("img",{src:allPhotos[0].url,alt:"antes",onClick:()=>setLightbox({photos:allPhotos,idx:0}),style:{width:"100%",borderRadius:10,border:`1px solid ${P.border}`,objectFit:"cover",maxHeight:240,cursor:"zoom-in"}})
        ),
        h("div",null,
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,textAlign:"center"}},"Depois — "+allPhotos[allPhotos.length-1].sessDate+" · "+allPhotos[allPhotos.length-1].sessProcedure),
          h("img",{src:allPhotos[allPhotos.length-1].url,alt:"depois",onClick:()=>setLightbox({photos:allPhotos,idx:allPhotos.length-1}),style:{width:"100%",borderRadius:10,border:`1px solid ${P.border}`,objectFit:"cover",maxHeight:240,cursor:"zoom-in"}})
        )
      )
    ),
    // Cards por sessão — TODAS as sessões aparecem para poder adicionar fotos
    filtered.length===0
      ?h(Card,{style:{textAlign:"center",padding:40}},
          h("div",{style:{fontSize:32,marginBottom:12}},"📷"),
          h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma sessão encontrada."))
      :h("div",{style:{display:"flex",flexDirection:"column",gap:14}},
        filtered.map(s=>{
          const fotos=s.photos||[];
          return h(Card,{key:s.id,style:{padding:0,overflow:"hidden"}},
            // Header da sessão
            h("div",{style:{padding:"12px 16px",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(92,31,50,.04)"}},
              h("div",null,
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text}},s.procedure),
                h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},s.date+(s.location?" · 📍"+s.location:"")+" · "+fotos.length+" foto(s)")
              ),
              h("label",{style:{display:"flex",alignItems:"center",gap:5,fontSize:12,color:P.accent,border:`1px solid rgba(157,119,97,.4)`,borderRadius:8,padding:"5px 12px",cursor:"pointer",background:"rgba(157,119,97,.06)"}},
                "📷 Adicionar",
                h("input",{type:"file",accept:"image/*",multiple:true,style:{display:"none"},onChange:e=>{if(e.target.files.length)addMedia(s.id,[...e.target.files],"photos");}})
              )
            ),
            // Grid de fotos ou estado vazio
            fotos.length===0
              ?h("div",{style:{padding:"20px",textAlign:"center",color:P.text3,fontSize:13}},"Nenhuma foto nesta sessão. Clique em 📷 Adicionar.")
              :h("div",{style:{padding:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}},
                fotos.map((ph,i)=>h("div",{key:ph.id,style:{position:"relative",aspectRatio:"1",cursor:"zoom-in"},
                  onClick:()=>setLightbox({photos:allPhotos,idx:allPhotos.findIndex(p=>p.id===ph.id)})},
                  h("img",{src:ph.url,alt:ph.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:8,border:`1px solid ${P.border}`,display:"block"}}),
                  h("div",{style:{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.55)",borderRadius:"0 0 8px 8px",padding:"3px 6px",fontSize:9,color:"rgba(255,255,255,.8)",textAlign:"center"}},ph.date||s.date),
                  h("button",{onClick:e=>{e.stopPropagation();removeMedia(s.id,ph.id,"photos");},style:{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.7)",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}},"×"),
                  h("button",{onClick:e=>{e.stopPropagation();setAnnotating({photo:ph,sessId:s.id});},title:"Anotar foto",style:{position:"absolute",top:4,right:28,width:20,height:20,borderRadius:"50%",background:"rgba(92,31,50,.85)",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}},"\u270f")
                ))
              )
          );
        })
      ),
    // Annotator modal
    annotating&&h(PhotoAnnotator,{
      photo:annotating.photo,
      onClose:()=>setAnnotating(null),
      onSave:newPhoto=>{
        upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===annotating.sessId?{...s,photos:[...(s.photos||[]),newPhoto]}:s)}));
        setAnnotating(null);
      }
    }),
    // Lightbox
    lightbox&&h("div",{onClick:()=>setLightbox(null),style:{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}},
      h("div",{style:{fontSize:12,color:"rgba(255,255,255,.5)"}},
        lightbox.photos[lightbox.idx]?.sessProcedure+" · "+lightbox.photos[lightbox.idx]?.sessDate,
        h("span",{style:{marginLeft:12}},`${lightbox.idx+1} / ${lightbox.photos.length}`)
      ),
      h("img",{src:lightbox.photos[lightbox.idx]?.url,onClick:e=>e.stopPropagation(),style:{maxWidth:"88vw",maxHeight:"78vh",borderRadius:10,objectFit:"contain",boxShadow:"0 8px 40px rgba(0,0,0,.8)"}}),
      h("div",{style:{display:"flex",gap:10,alignItems:"center"}},
        h("button",{onClick:e=>{e.stopPropagation();setLightbox(l=>({...l,idx:Math.max(0,l.idx-1)}));},disabled:lightbox.idx===0,style:{background:lightbox.idx===0?"rgba(255,255,255,.05)":"rgba(255,255,255,.15)",border:"none",color:"#fff",padding:"10px 20px",borderRadius:8,cursor:lightbox.idx===0?"default":"pointer",fontSize:18,opacity:lightbox.idx===0?.3:1}},"‹"),
        h("button",{onClick:e=>{e.stopPropagation();const ph=lightbox.photos[lightbox.idx];if(ph){setAnnotating({photo:ph,sessId:ph.sessId});setLightbox(null);}},style:{background:"rgba(92,31,50,.7)",border:"1px solid rgba(157,119,97,.4)",color:P.accent3,padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}},"✎ Anotar"),
        h("button",{onClick:e=>{e.stopPropagation();setLightbox(l=>({...l,idx:Math.min(l.photos.length-1,l.idx+1)}));},disabled:lightbox.idx===lightbox.photos.length-1,style:{background:lightbox.idx===lightbox.photos.length-1?"rgba(255,255,255,.05)":"rgba(255,255,255,.15)",border:"none",color:"#fff",padding:"10px 20px",borderRadius:8,cursor:lightbox.idx===lightbox.photos.length-1?"default":"pointer",fontSize:18,opacity:lightbox.idx===lightbox.photos.length-1?.3:1}},"›"),
        h("button",{onClick:()=>setLightbox(null),style:{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13}},"✕ Fechar")
      )
    )
  );
}

// ─── PACOTES GLOBAL (todos os pacotes de todas as pacientes) ──────────────────
function PacotesGlobal({patients,setPatients,onSelectPatient,onNav}){
  const h=createElement;
  const [filterStatus,setFilterStatus]=useState("todos");
  const [search,setSearch]=useState("");
  const allPkgs=patients.flatMap(p=>(p.sessions_packages||[]).map(pkg=>({...pkg,patientName:p.name,patientId:p.id,patient:p})));
  const filtered=allPkgs.filter(pkg=>{
    const matchS=filterStatus==="todos"||(filterStatus==="concluido"?pkg.done>=pkg.total:filterStatus==="andamento"?pkg.done>0&&pkg.done<pkg.total:pkg.done===0);
    const matchQ=!search||pkg.patientName.toLowerCase().includes(search.toLowerCase())||pkg.name.toLowerCase().includes(search.toLowerCase())||pkg.procedure.toLowerCase().includes(search.toLowerCase());
    return matchS&&matchQ;
  });
  const stats={total:allPkgs.length,andamento:allPkgs.filter(p=>p.done>0&&p.done<p.total).length,concluido:allPkgs.filter(p=>p.done>=p.total).length,novo:allPkgs.filter(p=>p.done===0).length};
  function checkPkg(patientId,pkgId){
    setPatients(prev=>prev.map(p=>{
      if(p.id!==patientId)return p;
      return{...p,sessions_packages:(p.sessions_packages||[]).map(pkg=>{
        if(pkg.id!==pkgId||pkg.done>=pkg.total)return pkg;
        const done=pkg.done+1;
        return{...pkg,done,sessions:[...(pkg.sessions||[]),{id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),num:done}]};
      })};
    }));
  }
  return h("div",null,
    h(SectionHeader,{title:"Pacotes",sub:"Todos os pacotes de sessões da clínica"}),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Total",v:stats.total,c:P.accent},{l:"Em Andamento",v:stats.andamento,c:P.gold},{l:"Concluídos",v:stats.concluido,c:P.green},{l:"Novos",v:stats.novo,c:"#7aaed4"}].map(s=>
        h(Card,{key:s.l,style:{textAlign:"center"}},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},s.l),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:s.c}},s.v)
        )
      )
    ),
    h("div",{style:{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}},
      h("input",{value:search,onChange:e=>setSearch(e.target.value),placeholder:"Buscar paciente ou procedimento...",style:{flex:1,minWidth:200,padding:"8px 14px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}),
      [{k:"todos",l:"Todos"},{k:"andamento",l:"Em Andamento"},{k:"concluido",l:"Concluídos"},{k:"novo",l:"Novos"}].map(f=>
        h("button",{key:f.k,onClick:()=>setFilterStatus(f.k),style:{padding:"7px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filterStatus===f.k?P.rose:"transparent",border:`1px solid ${filterStatus===f.k?P.rose:P.border}`,color:filterStatus===f.k?P.accent3:P.text2}},f.l)
      )
    ),
    filtered.length===0&&h(Card,{style:{textAlign:"center",padding:40}},
      h("div",{style:{fontSize:32,marginBottom:12}},"📦"),
      h("div",{style:{color:P.text3,fontSize:14}},allPkgs.length===0?"Nenhum pacote cadastrado ainda.":"Nenhum pacote encontrado.")
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}},
      filtered.map(pkg=>{
        const pct=Math.round((pkg.done/pkg.total)*100);
        const done=pkg.done>=pkg.total;
        return h(Card,{key:pkg.id+"-"+pkg.patientId,style:{border:`1px solid ${done?"rgba(122,173,138,.35)":P.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}},
            h("div",{style:{flex:1,cursor:"pointer"},onClick:()=>{onSelectPatient(pkg.patient);onNav("prontuario");}},
              h("div",{style:{fontSize:11,color:P.rose2,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}},pkg.patientName),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:done?P.green:P.text}},pkg.name),
              h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},pkg.procedure+" · "+pkg.done+"/"+pkg.total+" sessões")
            ),
            done
              ?h("span",{style:{fontSize:11,padding:"3px 9px",borderRadius:12,background:"rgba(122,173,138,.15)",color:P.green,border:"1px solid rgba(122,173,138,.3)",flexShrink:0}},"✓ Concluído")
              :h("button",{onClick:()=>checkPkg(pkg.patientId,pkg.id),style:{padding:"5px 12px",borderRadius:8,background:P.rose,border:"none",color:P.accent3,cursor:"pointer",fontSize:11,flexShrink:0}},"✓ Check")
          ),
          h("div",{style:{marginBottom:8}},
            h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:5}},
              h("span",{style:{fontSize:11,color:P.text3}},"Progresso"),
              h("span",{style:{fontSize:11,color:done?P.green:P.accent,fontWeight:600}},pct+"%")
            ),
            h("div",{style:{height:8,borderRadius:4,background:P.bg3,overflow:"hidden"}},
              h("div",{style:{height:"100%",width:pct+"%",background:done?"linear-gradient(90deg,"+P.green+",#5aad7a)":"linear-gradient(90deg,"+P.rose+","+P.gold+")",borderRadius:4,transition:"width .4s ease"}})
            )
          ),
          h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
            Array.from({length:pkg.total},(_,i)=>h("div",{key:i,style:{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,border:`2px solid ${i<pkg.done?P.green:P.border}`,background:i<pkg.done?"rgba(122,173,138,.15)":P.bg3,color:i<pkg.done?P.green:P.text3}},i<pkg.done?"✓":(i+1)))
          ),
          pkg.price>0&&h("div",{style:{marginTop:8,fontSize:12,color:P.accent}},"💰 "+fmtCurr(pkg.price)),
          h("div",{style:{marginTop:10,paddingTop:10,borderTop:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}},
            h("span",{style:{fontSize:11,color:P.text3}},"Criado em "+pkg.created),
            h("button",{onClick:()=>{onSelectPatient(pkg.patient);onNav("prontuario");},style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.3)`,borderRadius:6,padding:"3px 10px",cursor:"pointer"}},"Ver Prontuário →")
          )
        );
      })
    )
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
// ─── ROOT APP (com autenticação) ─────────────────────────────────────────────
function App(){
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s }, error }) => {
      if (error || !s) {
        // Token inválido ou expirado — limpa e vai para login
        supabase.auth.signOut().catch(() => {});
        setSession(null);
      } else {
        setSession(s);
      }
      setAuthLoading(false);
    }).catch(() => { setAuthLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        setSession(s);
      } else if (event === "SIGNED_OUT" || !s) {
        setSession(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) return createElement("div", {
    style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: P.bg, color: P.text3, fontSize: 14, fontFamily: "sans-serif" }
  }, "Carregando...");

  if (!session) return createElement(LoginScreen, { onLogin: () => supabase.auth.getSession().then(({data:{session:s}})=>setSession(s)) });

  return createElement(AppInner, { session, onLogout: () => supabase.auth.signOut() });
}

function AppInner({ session, onLogout }) {
  const[patients,setPatients,loadingPatients]=useSupaTable("patients",INIT_PATIENTS);
  const[agenda,setAgenda,loadingAgenda]=useSupaTable("agenda",INIT_AGENDA);
  const[expenses,setExpenses,loadingExpenses]=useSupaTable("expenses",INIT_EXPENSES);
  const[incomes,setIncomes,loadingIncomes]=useSupaTable("incomes",[]);
  const[products,setProducts,loadingProducts]=useSupaTable("products",[
    {id:"p1",name:"Botox Allergan 100U",cat:"Toxina Botulínica",qty:2,min:5,unit:"un",expiry:"12/2026",cost:800,emoji:"💉",status:"critical"},
    {id:"p2",name:"Juvederm Ultra 1ml",cat:"Ácido Hialurônico",qty:5,min:8,unit:"sir",expiry:"08/2026",cost:450,emoji:"✨",status:"low"},
    {id:"p3",name:"Sculptra 367mg",cat:"Bioestimulador",qty:7,min:4,unit:"fr",expiry:"09/2026",cost:950,emoji:"🧪",status:"ok"},
    {id:"p4",name:"Fio PDO 29G Mono",cat:"Fios de PDO",qty:48,min:20,unit:"un",expiry:"01/2028",cost:35,emoji:"🧵",status:"ok"},
    {id:"p5",name:"Profhilo 2ml",cat:"Skinbooster",qty:4,min:3,unit:"sir",expiry:"11/2026",cost:520,emoji:"💧",status:"ok"},
  ]);
  const[settingsData,setSettings,loadingSettings]=useSettings({doctorName:"Dra. Sofia",doctorTitle:"Médica Responsável",clinicName:"HarmonizaPro"});
  const[procedures,setProcedures,loadingProcedures]=useSupaTable("procedures",INIT_PROCEDURES.map((name,i)=>({id:"proc_"+i,name})));
  const[locations,setLocations,loadingLocations]=useSupaTable("locations",INIT_LOCATIONS.map((name,i)=>({id:"loc_"+i,name})));
  const[returnRules,setReturnRules,loadingRules]=useSupaTable("return_rules",INIT_RETURN_RULES);
  const[procCats,setProcCats]=useSupaTable("proc_cats",["Toxina Botulínica","Preenchimento","Bioestimuladores","Fios / Lifting","Skincare Clínico","Avaliação / Consultoria","Outros"]);
  const[skincareConfig,setSkincareConfig]=useSupaTable("skincare_config",{
    produtos:["Vitamina C","Retinol","Ácido Glicólico","Ácido Hialurônico","Protetor Solar FPS 50+","Niacinamida","Peptídeos","Bakuchiol","AHA/BHA","Ceramidas","Água Micelar","Hidratante Facial"],
    frequencias:["Diário","Noturno","2x por semana","Semanal","Mensal","Conforme necessário"]
  });
  // Todos os useState ANTES de qualquer return condicional (regra dos hooks)
  const[page,setPage]=useState("dashboard");
  const[selectedPatient,setSelectedPatient]=useState(null);

  // Dados carregam do localStorage — sem tela de loading
  const procedureNames=Array.isArray(procedures)?procedures.map(p=>typeof p==="string"?p:(p.name||p)).filter(Boolean):INIT_PROCEDURES;
  // Migração silenciosa: garantir que todos os procedimentos tenham categoria
  useEffect(()=>{
    if(!Array.isArray(procedures))return;
    const needsMigration=procedures.some(p=>typeof p==="string"||(typeof p==="object"&&!p.categoria));
    if(needsMigration){
      setProcedures(prev=>prev.map(p=>{
        if(typeof p==="string")return{id:"proc_"+Date.now()+Math.random(),name:p,categoria:"Outros",descricao:"",revisionDays:0,maintenanceDays:0,sessoesPadrao:1,defaultValue:0};
        if(!p.categoria)return{...p,categoria:"Outros",sessoesPadrao:p.sessoesPadrao||1,defaultValue:p.defaultValue||0};
        return p;
      }));
    }
  },[]);
  const locationNames=Array.isArray(locations)?locations.map(l=>typeof l==="string"?l:(l.name||l)).filter(Boolean):INIT_LOCATIONS;
  const h=createElement;
  const todayStr=new Date().toISOString().slice(0,10);
  const todayApptCount=agenda.filter(a=>a.date===todayStr).length;
  const criticalStock=products.filter(p=>p.status==="critical").length;

  // ── Responsive state ──────────────────────────────────────────────────────
  const[winW,setWinW]=useState(window.innerWidth);
  useEffect(()=>{
    const onResize=()=>setWinW(window.innerWidth);
    window.addEventListener("resize",onResize);
    return()=>window.removeEventListener("resize",onResize);
  },[]);
  const isMobile=winW<640;
  const isTablet=winW>=640&&winW<1024;
  const isDesktop=winW>=1024;

  // sidebarOpen: desktop=true por padrão, mobile/tablet=false
  const[sidebarOpen,setSidebarOpen]=useState(isDesktop);
  // collapsed (só ícones) — apenas desktop/tablet
  const[sidebarCollapsed,setSidebarCollapsed]=useState(false);

  // Fechar sidebar ao navegar no mobile
  function handleNav(k){
    setPage(k);
    if(k!=="prontuario")setSelectedPatient(null);
    if(isMobile)setSidebarOpen(false);
  }
  function handleSelectPatient(p){setSelectedPatient(p);setPage("prontuario");if(isMobile)setSidebarOpen(false);}
  const currentPatient=selectedPatient?patients.find(p=>p.id===selectedPatient.id):null;
  const pageTitles={dashboard:"Dashboard",aniversariantes:"Aniversariantes",retornos:"Retornos Pendentes",agenda:"Agenda",pacientes:"Pacientes",prontuario:currentPatient?currentPatient.name:"Prontuários",estoque:"Estoque",financeiro:"Fluxo de Caixa",pacotes_global:"Pacotes",relatorios:"Relatórios",config:"Configurações"};
  const settings = settingsData;

  const nav=[
    {k:"dashboard",l:"Dashboard",icon:"✦"},
    {k:"aniversariantes",l:"Aniversariantes",icon:"🎂",badge:(()=>{const t=new Date();return patients.filter(p=>{if(!p.birthDate)return false;const bd=new Date(p.birthDate+"T12:00");return bd.getMonth()===t.getMonth()&&bd.getDate()===t.getDate();}).length||null;})(),badgeColor:P.yellow},
    {k:"retornos",l:"Retornos",icon:"⏰",badge:(()=>{const today=new Date();return patients.filter(p=>{const s=(p.sessions||[]);if(!s.length)return false;const last=[...s].sort((a,b)=>(parseDMY(b.date)||new Date(0))-(parseDMY(a.date)||new Date(0)))[0];const d=parseDMY(last.date);if(!d)return false;return Number(last.returnReminderDays)>0&&daysBetween(d,today)>Number(last.returnReminderDays);}).length||null;})(),badgeColor:P.red},
    {k:"agenda",l:"Agenda",icon:"📅",badge:todayApptCount||null},
    {k:"pacientes",l:"Pacientes",icon:"👤"},
    {k:"prontuario",l:"Prontuários",icon:"📋"},
    {k:"estoque",l:"Estoque",icon:"🧴",badge:criticalStock||null,badgeColor:P.yellow},
    {k:"financeiro",l:"Financeiro",icon:"💰"},
    {k:"pacotes_global",l:"Pacotes",icon:"📦"},
    {k:"relatorios",l:"Relatórios",icon:"📊"},
    {k:"config",l:"Configurações",icon:"⚙️"},
  ];

  // largura real do sidebar conforme estado
  const sideW=sidebarCollapsed&&!isMobile?64:238;

  const sidebarContent=h("aside",{style:{
    width:sidebarOpen?(isMobile?"80vw":sideW):0,
    minWidth:sidebarOpen?(isMobile?"80vw":sideW):0,
    maxWidth:isMobile?"80vw":"none",
    background:P.bg2,
    borderRight:`1px solid ${P.border}`,
    display:"flex",flexDirection:"column",flexShrink:0,
    transition:"width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)",
    overflow:"hidden",
    position:isMobile?"fixed":"relative",
    top:isMobile?0:"auto",left:isMobile?0:"auto",
    height:isMobile?"100vh":"auto",
    zIndex:isMobile?200:1,
  }},
    // Header do sidebar
    h("div",{style:{padding:sidebarCollapsed&&!isMobile?"16px 0":"24px 20px 16px",borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",justifyContent:sidebarCollapsed&&!isMobile?"center":"space-between",flexShrink:0}},
      !sidebarCollapsed||isMobile
        ? h("div",null,
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3,letterSpacing:".04em",lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden"}},settings.clinicName||"HarmonizaPro"),
            h("div",{style:{fontSize:9,color:P.text3,letterSpacing:".14em",textTransform:"uppercase",marginTop:3}},"Gestão de Clínica")
          )
        : h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent3}},"✦"),
      // Botão colapsar (desktop/tablet)
      !isMobile&&h("button",{onClick:()=>setSidebarCollapsed(c=>!c),title:sidebarCollapsed?"Expandir menu":"Recolher menu",style:{background:"none",border:`1px solid ${P.border}`,borderRadius:6,color:P.text3,cursor:"pointer",padding:"4px 6px",fontSize:13,display:"flex",flexDirection:"column",gap:3,alignItems:"center",justifyContent:"center",flexShrink:0}},
        h("span",{style:{display:"block",width:14,height:1.5,background:P.text3,borderRadius:2}}),
        h("span",{style:{display:"block",width:14,height:1.5,background:P.text3,borderRadius:2}}),
        h("span",{style:{display:"block",width:14,height:1.5,background:P.text3,borderRadius:2}})
      ),
      // Botão fechar (mobile)
      isMobile&&h("button",{onClick:()=>setSidebarOpen(false),style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:20,padding:"4px",lineHeight:1}},"✕")
    ),
    // Nav items
    h("nav",{style:{flex:1,padding:sidebarCollapsed&&!isMobile?"10px 6px":"14px 10px",overflowY:"auto"}},
      nav.map(item=>h("div",{
        key:item.k,
        onClick:()=>handleNav(item.k),
        title:sidebarCollapsed&&!isMobile?item.l:undefined,
        style:{
          display:"flex",alignItems:"center",
          gap:sidebarCollapsed&&!isMobile?0:10,
          padding:sidebarCollapsed&&!isMobile?"10px 0":"9px 12px",
          justifyContent:sidebarCollapsed&&!isMobile?"center":"flex-start",
          borderRadius:8,cursor:"pointer",marginBottom:2,
          background:page===item.k?P.rose:"transparent",
          color:page===item.k?P.accent3:P.text2,
          border:`1px solid ${page===item.k?P.rose:"transparent"}`,
          transition:"all .15s",position:"relative"
        },
        onMouseEnter:e=>{if(page!==item.k){e.currentTarget.style.background=P.card;e.currentTarget.style.color=P.text;}},
        onMouseLeave:e=>{if(page!==item.k){e.currentTarget.style.background="transparent";e.currentTarget.style.color=P.text2;}}
      },
        h("span",{style:{fontSize:16,width:20,textAlign:"center",flexShrink:0}},item.icon),
        !sidebarCollapsed||isMobile
          ? h(Fragment,null,
              h("span",{style:{fontSize:13.5,whiteSpace:"nowrap"}},item.l),
              item.badge&&h("span",{style:{marginLeft:"auto",background:item.badgeColor||P.rose2,color:item.badgeColor===P.yellow?"#160b0e":P.accent3,fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:20,lineHeight:1.7}},item.badge)
            )
          : item.badge&&h("span",{style:{position:"absolute",top:4,right:4,background:item.badgeColor||P.rose2,color:item.badgeColor===P.yellow?"#160b0e":P.accent3,fontSize:9,fontWeight:700,padding:"1px 4px",borderRadius:10,lineHeight:1.5}},item.badge)
      ))
    ),
    // Footer do sidebar
    h("div",{style:{padding:sidebarCollapsed&&!isMobile?10:14,borderTop:`1px solid ${P.border}`,flexShrink:0}},
      sidebarCollapsed&&!isMobile
        ? h("div",{style:{display:"flex",justifyContent:"center"}},
            h("div",{style:{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${P.rose},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:P.accent3,cursor:"pointer"},title:settings.doctorName||"Dra. Sofia"},initials(settings.doctorName||"Dra Sofia"))
          )
        : h("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:P.card}},
            h("div",{style:{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${P.rose},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:P.accent3,flexShrink:0}},initials(settings.doctorName||"Dra Sofia")),
            h("div",{style:{flex:1,minWidth:0}},
              h("div",{style:{fontSize:12.5,fontWeight:500,color:P.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},settings.doctorName||"Dra. Sofia"),
              h("div",{style:{fontSize:10.5,color:P.text3}},settings.doctorTitle||"Médica Responsável")
            ),
            h("button",{onClick:onLogout,title:"Sair",style:{background:"none",border:"none",color:P.text3,cursor:"pointer",fontSize:16,padding:"4px",borderRadius:6,flexShrink:0}},"⏻")
          )
    )
  );

  return h(Fragment,null,
    h("style",null,`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:${P.bg};color:${P.text};font-family:'DM Sans',sans-serif;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:${P.border};border-radius:2px;}
      input,select,textarea{font-family:'DM Sans',sans-serif;color:${P.text};}
      select option{background:${P.bg2};}
      @media(max-width:639px){
        .resp-grid-4{grid-template-columns:repeat(2,1fr)!important;}
        .resp-grid-2{grid-template-columns:1fr!important;}
        .resp-grid-21{grid-template-columns:1fr!important;}
        .resp-pad{padding:12px!important;}
        .resp-hide{display:none!important;}
      }
      @media(min-width:640px) and (max-width:1023px){
        .resp-grid-4{grid-template-columns:repeat(2,1fr)!important;}
        .resp-grid-21{grid-template-columns:1fr!important;}
      }
    `),
    h("div",{style:{display:"flex",height:"100vh",overflow:"hidden",background:P.bg,position:"relative"}},
      // Overlay escuro para fechar sidebar no mobile
      isMobile&&sidebarOpen&&h("div",{
        onClick:()=>setSidebarOpen(false),
        style:{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:199,backdropFilter:"blur(2px)"}
      }),
      sidebarContent,
      h("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}},
        // Topbar
        h("div",{style:{height:56,background:P.bg2,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",padding:isMobile?"0 12px":"0 24px",gap:isMobile?10:14,flexShrink:0}},
          // Botão hambúrguer (mobile) ou toggle (tablet)
          (isMobile||isTablet)&&h("button",{
            onClick:()=>setSidebarOpen(o=>!o),
            style:{background:"none",border:`1px solid ${P.border}`,borderRadius:7,color:P.text2,cursor:"pointer",padding:"6px 8px",display:"flex",flexDirection:"column",gap:4,alignItems:"center",justifyContent:"center",flexShrink:0}
          },
            h("span",{style:{display:"block",width:16,height:1.5,background:P.text2,borderRadius:2}}),
            h("span",{style:{display:"block",width:16,height:1.5,background:P.text2,borderRadius:2}}),
            h("span",{style:{display:"block",width:16,height:1.5,background:P.text2,borderRadius:2}})
          ),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:isMobile?17:20,color:P.text,flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:isMobile?120:260}},pageTitles[page]),
          h(GlobalSearch,{patients,agenda,onSelectPatient:handleSelectPatient,onNav:handleNav})
        ),
        // Conteúdo principal
        h("div",{style:{flex:1,overflowY:"auto",padding:isMobile?12:24}},
          h(ErrorBoundary,{key:page},
            page==="dashboard"&&h(Dashboard,{patients,agenda,onNav:handleNav,onSelectPatient:handleSelectPatient,settings,returnRules,isMobile,isTablet}),
            page==="aniversariantes"&&h(Aniversariantes,{patients,onSelectPatient:handleSelectPatient,onNav:handleNav}),
            page==="retornos"&&h(RetornosPendentes,{patients,returnRules,onSelectPatient:handleSelectPatient,onNav:handleNav}),
            page==="agenda"&&h(Agenda,{patients,agenda,setAgenda,procedures:procedureNames,proceduresFull:procedures,locations:locationNames}),
            page==="pacientes"&&h(Patients,{patients,setPatients,onSelect:handleSelectPatient,procedures:procedureNames,locations:locationNames}),
            page==="prontuario"&&!currentPatient&&h(Patients,{patients,setPatients,onSelect:handleSelectPatient,procedures:procedureNames,locations:locationNames}),
            page==="prontuario"&&currentPatient&&h(PatientDetail,{patient:currentPatient,patients,setPatients,onBack:()=>setSelectedPatient(null),procedures:procedureNames,proceduresFull:procedures,locations:locationNames,products:products.map(p=>typeof p==="string"?p:(p.name||p)),setProducts,allProducts:products,returnRules,setIncomes,onSelectPatient:handleSelectPatient,skincareConfig}),
            page==="estoque"&&h(Estoque,{products,setProducts}),
            page==="financeiro"&&h(Financeiro,{patients,setPatients,expenses,setExpenses,incomes,setIncomes}),
            page==="pacotes_global"&&h(PacotesGlobal,{patients,setPatients,onSelectPatient:handleSelectPatient,onNav:handleNav}),
            page==="relatorios"&&h(Relatorios,{patients,incomes,expenses,onSelectPatient:handleSelectPatient,onNav:handleNav,procedures}),
            page==="config"&&h(Configuracoes,{procedures,setProcedures,locations:locationNames,setLocations,products,setProducts,settings,setSettings,returnRules,setReturnRules,skincareConfig,setSkincareConfig,procCats,setProcCats})
          )
        )
      )
    )
  );
}

export default App;
