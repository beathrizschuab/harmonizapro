import { useState, useEffect, useRef, useMemo, useCallback, createElement, Fragment, Component } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SUPA_URL = "https://syxapyqgqrkqkensbbqj.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eGFweXFncXJrcWtlbnNiYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDAxMzEsImV4cCI6MjA5NTkxNjEzMX0.3ZBSQS1fvWZn-uXCgDkvn7xRgpEWJiAIb_gH7cmO34s";
const supabase = createClient(SUPA_URL, SUPA_KEY);
// ─── CONSTANTS & PALETTE ─────────────────────────────────────────────────────
const P={bg:"#FAF6F4",bg2:"#FFFFFF",bg3:"#F2EAE6",card:"#FFFFFF",card2:"#FBF0EC",border:"#E8DDD9",accent:"#9D6F56",accent2:"#8C6F61",accent3:"#FBF3EF",rose:"#7A2840",rose2:"#9F415C",text:"#2B1A1C",text2:"#6B5450",text3:"#9C8682",green:"#4F9C68",red:"#C2555F",yellow:"#D9A441",gold:"#B98B6A"};
const MONTH_NAMES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const APPT_STATUS=["Confirmado","Aguardando","Realizado","Cancelado","Faltou","Reagendado"];
const APPT_STATUS_CFG={Confirmado:{color:"#7aaed4",bg:"rgba(122,174,212,.14)"},Aguardando:{color:"#c4a96a",bg:"rgba(196,169,106,.14)"},Realizado:{color:"#7aad8a",bg:"rgba(122,173,138,.14)"},Cancelado:{color:"#c07070",bg:"rgba(192,112,112,.14)"},Faltou:{color:"#b07070",bg:"rgba(176,112,112,.12)"},Reagendado:{color:"#9b7aad",bg:"rgba(155,122,173,.13)"}};
const PAT_STATUS_CFG={vip:{label:"VIP ✦",color:"#c4a96a",bg:"rgba(196,169,106,.13)"},active:{label:"Ativa",color:"#7aad8a",bg:"rgba(122,173,138,.12)"},treatment:{label:"Em Tratamento",color:"#7aaed4",bg:"rgba(122,174,212,.12)"},return:{label:"Retorno Pendente",color:"#c4a96a",bg:"rgba(196,169,106,.12)"},inactive:{label:"Inativa",color:"#c07070",bg:"rgba(192,112,112,.12)"},new:{label:"Nova",color:"#9b7aad",bg:"rgba(155,122,173,.12)"}};
const BLOOD_TYPES=["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const SKIN_TYPES=["Normal","Seca","Oleosa","Mista","Sensível"];
const FITZPATRICK=["I","II","III","IV","V","VI"];
const MUSIC_STYLES=["Pop","Rock","Sertanejo","MPB","Eletrônico","Clássica","Jazz","Funk","Gospel","Outro"];
const INTERCORRENCIA_TYPES=["Edema","Hematoma","Assimetria","Dor","Infecção","Nódulo","Alergia","Necrose","Migração","Outro"];
const IC_SEVERITY=["Leve","Moderada","Grave","Emergencial"];
const IC_SEVERITY_CFG={Leve:{color:"#7aad8a",bg:"rgba(122,173,138,.14)"},Moderada:{color:"#c4a96a",bg:"rgba(196,169,106,.14)"},Grave:{color:"#c07070",bg:"rgba(192,112,112,.16)"},Emergencial:{color:"#ff6b6b",bg:"rgba(255,107,107,.18)"}};
const IC_STATUS_LIST=["Em Acompanhamento","Resolvida","Não Resolvida","Encaminhada"];
const IC_STATUS_CFG={"Em Acompanhamento":{color:"#7aaed4",bg:"rgba(122,174,212,.14)"},"Resolvida":{color:"#7aad8a",bg:"rgba(122,173,138,.14)"},"Não Resolvida":{color:"#c07070",bg:"rgba(192,112,112,.14)"},"Encaminhada":{color:"#9b7aad",bg:"rgba(155,122,173,.14)"}};
const icSeverityOf=ic=>ic.severity||"Leve";
const icStatusOf=ic=>ic.status||"Em Acompanhamento";
const icConductsOf=ic=>(ic.conducts&&ic.conducts.length)?ic.conducts:(ic.conduct?[{id:"legacy_c",date:ic.date,text:ic.conduct}]:[]);
const icEvolutionsOf=ic=>ic.evolutions||[];
const EXPENSE_CATS=["Aluguel","Marketing","Fornecedores","Produtos","Impostos","Equipamentos","Funcionários","Outros"];
// Paleta vibrante para cards de KPI com fundo colorido (vouchers, pacotes, estoque, aniversariantes, retornos, dashboard)
const KPI={
  purple:"#8B5CF6", blue:"#3B82F6", green:"#22C55E", red:"#EF4444", yellow:"#EAB308",
  orange:"#F97316", teal:"#14B8A6", pink:"#EC4899",
};
// Gera estilo de card com fundo colorido translúcido + borda na mesma cor
const kpiCardStyle=color=>({textAlign:"center",background:`${color}1A`,border:`1px solid ${color}40`});
const PAY_METHODS=["Pix","Cartão Crédito","Cartão Débito","Dinheiro","Transferência","Pendente"];
const FIN_STATUS=["Pago","Pendente","Parcial","Cancelado"];
const avColors=["linear-gradient(135deg,#5C1F32,#855954)","linear-gradient(135deg,#855954,#9D7761)","linear-gradient(135deg,#9D7761,#7a2840)","linear-gradient(135deg,#7a2840,#855954)","linear-gradient(135deg,#6b3a4a,#9F8475)"];
// ─── ÍCONES DO MENU (substituem emojis) ──────────────────────────────────────
function NavIcon({name,size=17}){
  const h=createElement;
  const c={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};
  const icons={
    dashboard:h("svg",c,h("path",{d:"M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8Z"})),
    aniversariantes:h("svg",c,
      h("rect",{x:4,y:13,width:16,height:7,rx:1}),
      h("path",{d:"M4 13c1.3-1.6 2.9-1.6 4.2 0c1.3 1.6 2.9 1.6 4.2 0c1.3-1.6 2.9-1.6 4.2 0c1.3 1.6 2.9 1.6 4.2 0"}),
      h("line",{x1:12,y1:9,x2:12,y2:5}),
      h("circle",{cx:12,cy:4,r:1.2,fill:"currentColor",stroke:"none"})
    ),
    retornos:h("svg",c,h("circle",{cx:12,cy:12,r:9}),h("line",{x1:12,y1:12,x2:12,y2:7}),h("line",{x1:12,y1:12,x2:16,y2:14})),
    agenda:h("svg",c,h("rect",{x:3,y:5,width:18,height:16,rx:2}),h("line",{x1:3,y1:10,x2:21,y2:10}),h("line",{x1:8,y1:3,x2:8,y2:7}),h("line",{x1:16,y1:3,x2:16,y2:7})),
    pacientes:h("svg",c,h("circle",{cx:12,cy:8,r:4}),h("path",{d:"M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"})),
    estoque:h("svg",c,h("path",{d:"M9 3h6v3l2 3v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3Z"}),h("line",{x1:7,y1:13,x2:17,y2:13})),
    financeiro:h("svg",c,h("rect",{x:2,y:6,width:20,height:12,rx:2}),h("circle",{cx:12,cy:12,r:3})),
    pacotes_global:h("svg",c,h("path",{d:"M21 8L12 3L3 8v8l9 5l9-5Z"}),h("path",{d:"M3 8l9 5l9-5"}),h("line",{x1:12,y1:13,x2:12,y2:21})),
    vouchers:h("svg",c,h("rect",{x:4,y:9,width:16,height:11,rx:1}),h("rect",{x:3,y:6,width:18,height:4,rx:1}),h("line",{x1:12,y1:6,x2:12,y2:20}),h("circle",{cx:9,cy:4.5,r:2}),h("circle",{cx:15,cy:4.5,r:2})),
    relatorios:h("svg",c,h("rect",{x:4,y:12,width:4,height:8,rx:1}),h("rect",{x:10,y:7,width:4,height:13,rx:1}),h("rect",{x:16,y:3,width:4,height:17,rx:1})),
    intercorrencias_global:h("svg",c,h("path",{d:"M12 3L22 20H2Z"}),h("line",{x1:12,y1:9,x2:12,y2:14}),h("circle",{cx:12,cy:17,r:0.9,fill:"currentColor",stroke:"none"})),
    config:h("svg",c,h("line",{x1:4,y1:6,x2:20,y2:6}),h("circle",{cx:14,cy:6,r:2}),h("line",{x1:4,y1:12,x2:20,y2:12}),h("circle",{cx:8,cy:12,r:2}),h("line",{x1:4,y1:18,x2:20,y2:18}),h("circle",{cx:16,cy:18,r:2})),
  };
  return icons[name]||null;
}
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
// Regras de despesas recorrentes (ex: aluguel, contador) — geram lançamentos automáticos todo mês
const INIT_RECURRING_EXPENSES=[];
// ─── HELPERS & BASE UI ────────────────────────────────────────────────────────
const initials=n=>n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const fmtCurr=v=>"R$"+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:0});
// Converte texto de duração ("1h30", "45 min", "2 horas"...) em minutos
const durationToMin=d=>{
  if(!d)return 60;
  const s=String(d).toLowerCase().trim();
  const hm=s.match(/^(\d+)h(\d+)?$/);
  if(hm)return Number(hm[1])*60+Number(hm[2]||0);
  const justH=s.match(/(\d+)\s*hora/);
  const justM=s.match(/(\d+)\s*min/);
  if(justH&&justM)return Number(justH[1])*60+Number(justM[1]);
  if(justH)return Number(justH[1])*60;
  if(justM)return Number(justM[1]);
  const num=s.match(/(\d+)/);
  return num?Number(num[1]):60;
};
// Soma minutos a um horário "HH:MM" e retorna "HH:MM" (limitado a 23:59)
const addMinToTime=(time,mins)=>{
  if(!time)return"";
  const[h,m]=time.split(":").map(Number);
  let total=(h*60+m)+(Number(mins)||0);
  total=Math.max(0,Math.min(23*60+59,total));
  const eh=Math.floor(total/60),em=total%60;
  return String(eh).padStart(2,"0")+":"+String(em).padStart(2,"0");
};
// Retorna a hora final de um agendamento dado time + duration
const apptEndTime=a=>a&&a.time?addMinToTime(a.time,durationToMin(a.duration)):"";
const parseDMY=s=>{if(!s)return null;const[d,m,y]=s.split("/");return new Date(`${y}-${m}-${d}`);};
const daysBetween=(a,b)=>Math.floor((b-a)/(1000*60*60*24));
const todayISO=()=>new Date().toISOString().slice(0,10);
const dmyToISO=s=>{const d=parseDMY(s);return d?d.toISOString().slice(0,10):"";};
const isoToBR=s=>{if(!s)return"";const[y,m,d]=s.split("-");return d&&m&&y?`${d}/${m}/${y}`:s;};
// Atualiza uma intercorrência (por id) tanto na lista global do paciente quanto na sessão de origem,
// mantendo as duas cópias sempre sincronizadas. Usado por PatientDetail e pelo painel global.
function updateIntercorrencia(setPatients,patientId,icId,updater){
  setPatients(prev=>prev.map(p=>{
    if(p.id!==patientId)return p;
    return{
      ...p,
      intercorrencias:(p.intercorrencias||[]).map(ic=>ic.id===icId?updater(ic):ic),
      sessions:(p.sessions||[]).map(s=>({...s,intercorrencias:(s.intercorrencias||[]).map(ic=>ic.id===icId?updater(ic):ic)}))
    };
  }));
}

// ─── FIDELIZAÇÃO ──────────────────────────────────────────────────────────────
// Critérios automáticos: valor gasto total + nº de sessões (frequência) + nº de indicações feitas
const LOYALTY_TIERS=[
  {k:"diamante",l:"Diamante",stars:4,color:"#9ec7e8",bg:"rgba(158,199,232,.14)",minScore:85},
  {k:"ouro",l:"Ouro",stars:3,color:"#c4a96a",bg:"rgba(196,169,106,.14)",minScore:55},
  {k:"prata",l:"Prata",stars:2,color:"#b9c0c9",bg:"rgba(185,192,201,.14)",minScore:28},
  {k:"bronze",l:"Bronze",stars:1,color:"#c08a5a",bg:"rgba(192,138,90,.14)",minScore:0},
];
// Pesos: valor gasto (até 50pts), frequência/sessões (até 30pts), indicações (até 20pts)
function calcLoyalty(patient,allPatients){
  const sessions=patient.sessions||[];
  const totalSpent=sessions.reduce((a,s)=>a+(s.paid?Number(s.value||0):0),0);
  const sessionCount=sessions.length;
  const referrals=(Array.isArray(allPatients)?allPatients:[]).filter(p=>p.indicadoPor&&p.indicadoPor.trim().toLowerCase()===patient.name.trim().toLowerCase()).length;

  // Normaliza cada critério numa escala de 0-100 e aplica peso
  const spentScore=Math.min(totalSpent/6000,1)*50;        // R$6.000+ = pontuação máxima
  const freqScore=Math.min(sessionCount/12,1)*30;          // 12+ sessões = pontuação máxima
  const referralScore=Math.min(referrals/5,1)*20;          // 5+ indicações = pontuação máxima
  const score=spentScore+freqScore+referralScore;

  const tier=LOYALTY_TIERS.find(t=>score>=t.minScore)||LOYALTY_TIERS[LOYALTY_TIERS.length-1];
  // Próximo nível e quanto falta
  const idx=LOYALTY_TIERS.findIndex(t=>t.k===tier.k);
  const next=idx>0?LOYALTY_TIERS[idx-1]:null;
  return {tier,score:Math.round(score),totalSpent,sessionCount,referrals,next,pointsToNext:next?Math.max(0,Math.ceil(next.minScore-score)):0};
}
function LoyaltyBadge({patient,allPatients,size="md"}){
  const h=createElement;
  const{tier}=calcLoyalty(patient,allPatients);
  const fs=size==="sm"?10:size==="lg"?13:11;
  const pad=size==="sm"?"1px 6px":size==="lg"?"3px 11px":"2px 8px";
  return h("span",{title:tier.l+" · "+"★".repeat(tier.stars),style:{fontSize:fs,padding:pad,borderRadius:20,background:tier.bg,color:tier.color,fontWeight:700,whiteSpace:"nowrap",letterSpacing:".02em"}},
    "★".repeat(tier.stars)+" "+tier.l
  );
}

// ─── DOSSIÊ COMPLETO DA PACIENTE (PDF) ────────────────────────────────────────
let _jsPDFLoadPromise=null;
function loadJsPDF(){
  if(window.jspdf?.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  if(_jsPDFLoadPromise)return _jsPDFLoadPromise;
  _jsPDFLoadPromise=new Promise((resolve,reject)=>{
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload=()=>resolve(window.jspdf.jsPDF);
    s.onerror=()=>reject(new Error("Não foi possível carregar o gerador de PDF. Verifique sua conexão."));
    document.head.appendChild(s);
  });
  return _jsPDFLoadPromise;
}

async function generatePatientDossier(patient,{products,settings}={}){
  const jsPDFCtor=await loadJsPDF();
  const doc=new jsPDFCtor({unit:"pt",format:"a4"});
  const PG_W=595.28, MARGIN=42, MAX_W=PG_W-MARGIN*2;
  let y=MARGIN;
  const COL={accent:[157,119,97],text:[35,28,30],text2:[90,80,82],text3:[140,130,132],line:[222,212,208],danger:[176,72,72]};

  function ensureSpace(h){ if(y+h>800){ doc.addPage(); y=MARGIN; drawPageHeader(); } }
  function drawPageHeader(){
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...COL.text3);
    doc.text((settings?.clinicName||"HarmonizaPro")+" · Dossiê Confidencial — "+patient.name,MARGIN,24);
    doc.setDrawColor(...COL.line); doc.line(MARGIN,30,PG_W-MARGIN,30);
    y=44;
  }
  function sectionTitle(txt,emoji){
    ensureSpace(34);
    doc.setFillColor(247,240,237); doc.rect(MARGIN,y,MAX_W,24,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(...COL.accent);
    doc.text((emoji?emoji+"  ":"")+txt,MARGIN+8,y+16);
    y+=34;
  }
  function kv(label,value,opts={}){
    if(value===undefined||value===null||value==="")value="—";
    ensureSpace(16);
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...COL.text2);
    doc.text(label+":",MARGIN+4,y);
    doc.setFont("helvetica","normal"); doc.setTextColor(...(opts.danger?COL.danger:COL.text));
    const lines=doc.splitTextToSize(String(value),MAX_W-150);
    doc.text(lines,MARGIN+150,y);
    y+=Math.max(16,lines.length*12);
  }
  function paragraph(text,opts={}){
    if(!text)return;
    ensureSpace(14);
    doc.setFont("helvetica",opts.bold?"bold":"normal"); doc.setFontSize(opts.size||9.5); doc.setTextColor(...(opts.color||COL.text));
    const lines=doc.splitTextToSize(String(text),MAX_W-8);
    lines.forEach(ln=>{ ensureSpace(13); doc.text(ln,MARGIN+4,y); y+=13; });
  }
  function divider(){ ensureSpace(10); doc.setDrawColor(...COL.line); doc.line(MARGIN,y,PG_W-MARGIN,y); y+=12; }
  function emptyMsg(txt){ doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.setTextColor(...COL.text3); ensureSpace(14); doc.text(txt,MARGIN+4,y); y+=16; }

  // ── CAPA ──────────────────────────────────────────────────────────────────
  doc.setFillColor(247,240,237); doc.rect(0,0,PG_W,841.89,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(22); doc.setTextColor(...COL.accent);
  doc.text(settings?.clinicName||"HarmonizaPro",PG_W/2,180,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...COL.text3);
  doc.text("DOSSIÊ CLÍNICO CONFIDENCIAL",PG_W/2,202,{align:"center"});
  doc.setDrawColor(...COL.accent); doc.line(PG_W/2-60,216,PG_W/2+60,216);
  doc.setFont("helvetica","bold"); doc.setFontSize(20); doc.setTextColor(...COL.text);
  doc.text(patient.name,PG_W/2,300,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...COL.text2);
  doc.text("Gerado em "+new Date().toLocaleDateString("pt-BR")+" às "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),PG_W/2,320,{align:"center"});
  doc.setFontSize(8); doc.setTextColor(...COL.text3);
  doc.text("Este documento contém informações médicas e pessoais sensíveis.\nDestinado exclusivamente para fins clínicos, sob sigilo profissional.",PG_W/2,700,{align:"center"});

  doc.addPage(); y=MARGIN; drawPageHeader();

  // ── DADOS PESSOAIS ────────────────────────────────────────────────────────
  sectionTitle("Dados Pessoais","👤");
  const bd=patient.birthDate?new Date(patient.birthDate+"T12:00"):null;
  kv("Nome completo",patient.name);
  kv("Idade",patient.age?patient.age+" anos":"—");
  kv("Data de nascimento",bd&&!isNaN(bd)?bd.toLocaleDateString("pt-BR"):"—");
  kv("Telefone",patient.phone);
  kv("E-mail",patient.email);
  kv("CPF",patient.cpf);
  kv("Tipo sanguíneo",patient.bloodType);
  kv("Cliente desde",patient.since);
  kv("Indicado por",patient.indicadoPor);
  y+=4;

  // ── ANAMNESE ──────────────────────────────────────────────────────────────
  sectionTitle("Anamnese","📋");
  const an=patient.anamnese||{};
  kv("Histórico de saúde",an.healthHistory);
  kv("Medicações em uso",an.medications);
  kv("Fumante",an.smoking);
  kv("Gestante/Amamentando",an.pregnancy);
  kv("Procedimentos anteriores",an.previousProcedures);
  kv("Tipo de pele",an.skinType);
  kv("Fototipo (Fitzpatrick)",an.fitzpatrick);
  kv("Alergias",an.allergiesDetail||patient.allergies,{danger:!!(an.allergiesDetail||(patient.allergies&&patient.allergies!=="Nenhuma"))});
  kv("Contraindicações",an.contraindications,{danger:!!an.contraindications&&an.contraindications!=="Nenhuma"});
  if((an.importantAlerts||[]).length>0)kv("Alertas importantes",an.importantAlerts.join(", "),{danger:true});
  y+=4;

  // ── EVOLUÇÃO / SESSÕES ────────────────────────────────────────────────────
  sectionTitle("Evolução — Histórico de Sessões","📈");
  const sessions=[...(patient.sessions||[])].sort((a,b)=>(parseDMY(a.date)||new Date(0))-(parseDMY(b.date)||new Date(0)));
  if(sessions.length===0)emptyMsg("Nenhuma sessão registrada.");
  sessions.forEach((s,i)=>{
    ensureSpace(20);
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...COL.accent);
    doc.text(`${i+1}. ${s.date} — ${s.procedure}`,MARGIN+4,y); y+=14;
    kv("  Produto / Dose",`${s.product||"—"} ${s.dose?"· "+s.dose:""}`);
    kv("  Região",s.region);
    kv("  Local",s.location);
    kv("  Profissional",s.doctor);
    kv("  Valor",fmtCurr(s.value||0)+" · "+(s.payMethod||"—")+" · "+(s.finStatus||(s.paid?"Pago":"Pendente")));
    if(s.notes)paragraph("Observações: "+s.notes,{size:9});
    if(s.evolution)paragraph("Evolução: "+s.evolution,{size:9});
    if((s.photos||[]).length>0)kv("  Fotos registradas",s.photos.length+" foto(s) (ver galeria do prontuário)");
    if((s.docs||[]).length>0)kv("  Documentos",s.docs.length+" documento(s) anexado(s)");
    divider();
  });

  // ── PRODUTOS E LOTES UTILIZADOS ───────────────────────────────────────────
  sectionTitle("Produtos e Lotes Utilizados","💉");
  const usedProducts=sessions.filter(s=>s.product);
  if(usedProducts.length===0)emptyMsg("Nenhum produto registrado nas sessões.");
  usedProducts.forEach(s=>{
    const prod=(Array.isArray(products)?products:[]).find(p=>(p.name||p)===s.product);
    const lote=s.faceMap?.lote||s.lote||null;
    ensureSpace(14);
    paragraph(`${s.date} — ${s.product}${s.dose?" ("+s.dose+")":""}${lote?" · Lote: "+lote:""}`,{size:9.5,bold:true,color:COL.text});
  });
  y+=6;

  // ── INTERCORRÊNCIAS ───────────────────────────────────────────────────────
  sectionTitle("Intercorrências","⚠");
  const interc=patient.intercorrencias||[];
  if(interc.length===0)emptyMsg("Nenhuma intercorrência registrada.");
  interc.forEach(it=>{
    ensureSpace(20);
    const dt=isoToBR(it.date)||it.date||"—";
    paragraph(`${dt} — ${it.type||"Intercorrência"} (${icSeverityOf(it)} · ${icStatusOf(it)})${it.region?" · "+it.region:""}`,{size:9.5,bold:true,color:COL.danger});
    if(it.notes)paragraph(it.notes,{size:9});
    const cds=icConductsOf(it);
    if(cds.length)paragraph(`Condutas: ${cds.map(c=>c.text).join("; ")}`,{size:8.5,color:COL.text2||COL.text});
  });
  y+=6;

  // ── PAGAMENTOS ─────────────────────────────────────────────────────────────
  sectionTitle("Pagamentos","💰");
  if(sessions.length===0)emptyMsg("Nenhum pagamento registrado.");
  let totalPago=0,totalPendente=0;
  sessions.forEach(s=>{ if(s.paid)totalPago+=Number(s.value||0); else totalPendente+=Number(s.value||0); });
  sessions.forEach(s=>{
    ensureSpace(14);
    paragraph(`${s.date} · ${s.procedure} · ${fmtCurr(s.value||0)} · ${s.payMethod||"—"} · ${s.finStatus||(s.paid?"Pago":"Pendente")}`,{size:9.5});
  });
  divider();
  kv("Total pago",fmtCurr(totalPago));
  kv("Total pendente",fmtCurr(totalPendente),{danger:totalPendente>0});

  // ── DOCUMENTOS E FOTOS (resumo) ───────────────────────────────────────────
  sectionTitle("Fotos e Documentos","📎");
  const totalPhotos=sessions.reduce((a,s)=>a+(s.photos||[]).length,0);
  const totalDocs=sessions.reduce((a,s)=>a+(s.docs||[]).length,0);
  kv("Total de fotos registradas",String(totalPhotos));
  kv("Total de documentos anexados",String(totalDocs));
  paragraph("Nota: imagens e arquivos originais permanecem armazenados no sistema. Este dossiê traz apenas a contagem e referência por sessão — consulte o prontuário digital para visualização completa.",{size:8.5,color:COL.text3});

  // Numeração de páginas
  const pageCount=doc.getNumberOfPages();
  for(let p=2;p<=pageCount;p++){
    doc.setPage(p);
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...COL.text3);
    doc.text(`Página ${p-1} de ${pageCount-1}`,PG_W-MARGIN,820,{align:"right"});
  }

  const fileName=`Dossie_${patient.name.replace(/[^a-zA-Z0-9]+/g,"_")}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(fileName);
}

// ─── HELPER COMPARTILHADO DE PDF (Financeiro / Relatórios) ───────────────────
// Reaproveita a mesma linguagem visual do dossiê da paciente, mas devolve
// funções reutilizáveis para montar tabelas, KPIs e seções em outros relatórios.
function createPdfHelpers(doc,{settings,headerLabel}={}){
  const PG_W=595.28, PG_H=841.89, MARGIN=42, MAX_W=PG_W-MARGIN*2;
  const COL={accent:[157,119,97],text:[35,28,30],text2:[90,80,82],text3:[140,130,132],line:[222,212,208],danger:[176,72,72],green:[122,173,138],yellow:[170,140,60]};
  const ctx={y:MARGIN};
  function drawPageHeader(){
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...COL.text3);
    doc.text((settings?.clinicName||"HarmonizaPro")+" · "+headerLabel,MARGIN,24);
    doc.setDrawColor(...COL.line); doc.line(MARGIN,30,PG_W-MARGIN,30);
    ctx.y=44;
  }
  function ensureSpace(h){ if(ctx.y+h>800){ doc.addPage(); ctx.y=MARGIN; drawPageHeader(); } }
  function sectionTitle(txt,emoji){
    ensureSpace(34);
    doc.setFillColor(247,240,237); doc.rect(MARGIN,ctx.y,MAX_W,24,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(...COL.accent);
    doc.text((emoji?emoji+"  ":"")+txt,MARGIN+8,ctx.y+16);
    ctx.y+=34;
  }
  function kv(label,value,opts={}){
    if(value===undefined||value===null||value==="")value="—";
    ensureSpace(16);
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...COL.text2);
    doc.text(label+":",MARGIN+4,ctx.y);
    doc.setFont("helvetica","normal"); doc.setTextColor(...(opts.danger?COL.danger:opts.success?COL.green:COL.text));
    const lines=doc.splitTextToSize(String(value),MAX_W-180);
    doc.text(lines,MARGIN+180,ctx.y);
    ctx.y+=Math.max(16,lines.length*12);
  }
  function paragraph(text,opts={}){
    if(!text)return;
    ensureSpace(14);
    doc.setFont("helvetica",opts.bold?"bold":"normal"); doc.setFontSize(opts.size||9.5); doc.setTextColor(...(opts.color||COL.text));
    const lines=doc.splitTextToSize(String(text),MAX_W-8);
    lines.forEach(ln=>{ ensureSpace(13); doc.text(ln,MARGIN+4,ctx.y); ctx.y+=13; });
  }
  function divider(){ ensureSpace(10); doc.setDrawColor(...COL.line); doc.line(MARGIN,ctx.y,PG_W-MARGIN,ctx.y); ctx.y+=12; }
  function emptyMsg(txt){ doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.setTextColor(...COL.text3); ensureSpace(14); doc.text(txt,MARGIN+4,ctx.y); ctx.y+=16; }
  // Cabeçalhos/linhas de tabela simples (colunas com largura fixa em pt)
  function tableHeader(cols){
    ensureSpace(18);
    doc.setFillColor(238,228,224); doc.rect(MARGIN,ctx.y,MAX_W,18,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...COL.text2);
    let x=MARGIN+6;
    cols.forEach(c=>{ doc.text(c.label,x,ctx.y+12,{align:c.align||"left"}); x+=c.width; });
    ctx.y+=18;
  }
  function tableRow(cols,opts={}){
    const wrapped=cols.map(c=>doc.splitTextToSize(String(c.text??"—"),c.width-4));
    const lineCount=Math.max(1,...wrapped.map(w=>w.length));
    const rowH=lineCount*11+3;
    ensureSpace(rowH);
    if(opts.zebra)doc.setFillColor(250,247,245),doc.rect(MARGIN,ctx.y-10,MAX_W,rowH,"F");
    let x=MARGIN+6;
    doc.setFont("helvetica",opts.bold?"bold":"normal"); doc.setFontSize(8.5);
    cols.forEach((c,ci)=>{
      doc.setTextColor(...(c.color||COL.text));
      wrapped[ci].forEach((ln,li)=>{
        doc.text(ln,c.align==="right"?x+c.width-4:x,ctx.y+li*11,{align:c.align||"left"});
      });
      x+=c.width;
    });
    ctx.y+=rowH;
  }
  // Grade de indicadores (estilo "cards" do dashboard) — até 4 por linha
  function statGrid(items){
    const n=items.length, gap=10;
    const boxW=(MAX_W-gap*(n-1))/n, boxH=48;
    ensureSpace(boxH+12);
    items.forEach((it,i)=>{
      const x=MARGIN+i*(boxW+gap);
      doc.setFillColor(247,240,237); doc.roundedRect(x,ctx.y,boxW,boxH,5,5,"F");
      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...COL.text3);
      doc.text(String(it.label).toUpperCase(),x+9,ctx.y+16,{maxWidth:boxW-18});
      doc.setFont("helvetica","bold"); doc.setFontSize(14.5); doc.setTextColor(...(it.color||COL.text));
      doc.text(String(it.value),x+9,ctx.y+37,{maxWidth:boxW-18});
    });
    ctx.y+=boxH+16;
  }
  function pageNumbers(){
    const pageCount=doc.getNumberOfPages();
    for(let p=2;p<=pageCount;p++){
      doc.setPage(p);
      doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...COL.text3);
      doc.text(`Página ${p-1} de ${pageCount-1}`,PG_W-MARGIN,820,{align:"right"});
    }
  }
  return {PG_W,PG_H,MARGIN,MAX_W,COL,ctx,drawPageHeader,ensureSpace,sectionTitle,kv,paragraph,divider,emptyMsg,tableHeader,tableRow,statGrid,pageNumbers,
    get y(){return ctx.y;}, set y(v){ctx.y=v;}
  };
}

// ─── EXPORTAÇÃO PDF — FINANCEIRO ──────────────────────────────────────────────
async function generateFinanceiroPDF(data,{settings}={}){
  const{selMonth,selYear,received,sessionsRec,incomesRec,totalExp,pending,months,monthSessions,monthIncomesExtra,monthExpenses,saldoInicial,saldoFinal,dailyFlow}=data;
  const jsPDFCtor=await loadJsPDF();
  const doc=new jsPDFCtor({unit:"pt",format:"a4"});
  const period=`${MONTH_NAMES[selMonth]} de ${selYear}`;
  const H=createPdfHelpers(doc,{settings,headerLabel:`Relatório Financeiro — ${period}`});
  H.drawPageHeader();

  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...H.COL.text);
  doc.text(settings?.clinicName||"HarmonizaPro",H.MARGIN,H.y+12);
  doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(...H.COL.accent);
  doc.text("Relatório Financeiro · "+period,H.MARGIN,H.y+30);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...H.COL.text3);
  doc.text("Gerado em "+new Date().toLocaleDateString("pt-BR")+" às "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),H.MARGIN,H.y+44);
  H.y+=58;

  // ── KPIs do mês ──────────────────────────────────────────────────────────
  H.statGrid([
    {label:"Receita do Mês",value:fmtCurr(received),color:H.COL.accent},
    {label:"Despesas do Mês",value:fmtCurr(totalExp),color:H.COL.danger},
    {label:"Lucro Líquido",value:fmtCurr(received-totalExp),color:H.COL.green},
    {label:"A Receber",value:fmtCurr(pending),color:H.COL.yellow},
  ]);

  // ── Histórico de 5 meses ─────────────────────────────────────────────────
  H.sectionTitle("Receita vs Despesas (últimos 5 meses)","📊");
  H.tableHeader([{label:"Mês",width:110},{label:"Receita",width:130},{label:"Despesas",width:130},{label:"Resultado",width:130}]);
  (months||[]).forEach((m,i)=>H.tableRow([
    {text:`${m.m} ${m.yy}`,width:110},
    {text:fmtCurr(m.rec),width:130,color:H.COL.green},
    {text:fmtCurr(m.exp),width:130,color:H.COL.danger},
    {text:fmtCurr(m.rec-m.exp),width:130,color:(m.rec-m.exp)>=0?H.COL.green:H.COL.danger},
  ],{zebra:i%2===1}));
  H.y+=10;

  // ── Entradas (sessões) ───────────────────────────────────────────────────
  H.sectionTitle("Entradas — Sessões do Prontuário","💉");
  if((monthSessions||[]).length===0)H.emptyMsg("Nenhuma sessão registrada neste mês.");
  else{
    H.tableHeader([{label:"Data",width:50},{label:"Paciente / Procedimento",width:200},{label:"Pagamento",width:90},{label:"Status",width:60},{label:"Valor",width:100,align:"right"}]);
    [...monthSessions].sort((a,b)=>(parseAnyDate(a.date)||0)-(parseAnyDate(b.date)||0)).forEach((s,i)=>H.tableRow([
      {text:s.date,width:50},
      {text:`${s.pname} — ${s.procedure}`,width:200},
      {text:s.payMethod||"—",width:90},
      {text:s.finStatus||(s.paid?"Pago":"Pendente"),width:60,color:s.paid?H.COL.green:H.COL.yellow},
      {text:fmtCurr(s.value||0),width:100,align:"right",color:s.paid?H.COL.green:H.COL.yellow},
    ],{zebra:i%2===1}));
  }
  H.y+=4;
  H.kv("Subtotal sessões",fmtCurr(sessionsRec));

  // ── Entradas extras ──────────────────────────────────────────────────────
  if((monthIncomesExtra||[]).length>0){
    H.y+=6;
    doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...H.COL.accent);
    H.ensureSpace(14); doc.text("Entradas extras (não vinculadas a sessões)",H.MARGIN+4,H.y); H.y+=16;
    H.tableHeader([{label:"Data",width:50},{label:"Descrição",width:200},{label:"Pagamento",width:90},{label:"Status",width:60},{label:"Valor",width:100,align:"right"}]);
    monthIncomesExtra.forEach((inc,i)=>H.tableRow([
      {text:inc.date,width:50},
      {text:inc.desc||inc.patientName||"Entrada",width:200},
      {text:inc.payMethod||"—",width:90},
      {text:inc.status,width:60,color:inc.status==="Pago"?H.COL.green:H.COL.yellow},
      {text:fmtCurr(inc.value||0),width:100,align:"right",color:inc.status==="Pago"?H.COL.green:H.COL.yellow},
    ],{zebra:i%2===1}));
    H.y+=4;
    H.kv("Subtotal entradas extras",fmtCurr(incomesRec));
  }
  H.divider();
  H.kv("Total recebido no mês",fmtCurr(received),{success:true});

  // ── Despesas ─────────────────────────────────────────────────────────────
  H.sectionTitle("Despesas","💸");
  if((monthExpenses||[]).length===0)H.emptyMsg("Nenhuma despesa registrada neste mês.");
  else{
    H.tableHeader([{label:"Data",width:50},{label:"Descrição",width:200},{label:"Categoria",width:110},{label:"Status",width:60},{label:"Valor",width:80,align:"right"}]);
    [...monthExpenses].sort((a,b)=>(parseAnyDate(a.date)||0)-(parseAnyDate(b.date)||0)).forEach((e,i)=>H.tableRow([
      {text:e.date,width:50},
      {text:e.desc,width:200},
      {text:e.cat,width:110},
      {text:e.status,width:60,color:e.status==="Cancelado"?H.COL.text3:H.COL.danger},
      {text:fmtCurr(e.value||0),width:80,align:"right",color:H.COL.danger},
    ],{zebra:i%2===1}));
  }
  H.y+=4;
  H.kv("Total de despesas",fmtCurr(totalExp),{danger:true});

  // ── Fluxo de caixa diário ────────────────────────────────────────────────
  H.sectionTitle("Fluxo de Caixa Diário","📅");
  H.kv("Saldo inicial do mês",fmtCurr(saldoInicial),{success:saldoInicial>=0,danger:saldoInicial<0});
  if((dailyFlow||[]).length===0)H.emptyMsg("Sem movimentações registradas neste mês.");
  else{
    H.tableHeader([{label:"Dia",width:50},{label:"Movimentações",width:300},{label:"Saldo do Dia",width:150,align:"right"}]);
    dailyFlow.forEach((df,i)=>{
      const movResumo=df.events.length===0?"—":df.events.map(ev=>(ev.type==="entrada"?"↑ ":"↓ ")+ev.desc).join("; ");
      H.tableRow([
        {text:"Dia "+String(df.day).padStart(2,"0"),width:50},
        {text:movResumo,width:300},
        {text:fmtCurr(df.saldo),width:150,align:"right",color:df.saldo>=0?H.COL.text:H.COL.danger},
      ],{zebra:i%2===1});
    });
  }
  H.divider();
  H.kv("Saldo final do mês",fmtCurr(saldoFinal),{success:saldoFinal>=0,danger:saldoFinal<0});

  H.pageNumbers();
  const fileName=`Financeiro_${MONTH_NAMES[selMonth]}_${selYear}.pdf`;
  doc.save(fileName);
}

// ─── EXPORTAÇÃO PDF — RELATÓRIOS ──────────────────────────────────────────────
async function generateRelatoriosPDF(data,{settings}={}){
  const{selMonth,selYear,allSCount,procCount,fidPct,forecastRev,nextM,procList,catList,totalCat,monthlyData,peakMonths,lowMonths,rankingPatients,paymentMethods}=data;
  const jsPDFCtor=await loadJsPDF();
  const doc=new jsPDFCtor({unit:"pt",format:"a4"});
  const period=`${MONTH_NAMES[selMonth]} de ${selYear}`;
  const H=createPdfHelpers(doc,{settings,headerLabel:`Relatório Gerencial — ${period}`});
  H.drawPageHeader();

  doc.setFont("helvetica","bold"); doc.setFontSize(19); doc.setTextColor(...H.COL.text);
  doc.text(settings?.clinicName||"HarmonizaPro",H.MARGIN,H.y+12);
  doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(...H.COL.accent);
  doc.text("Relatório Gerencial · "+period,H.MARGIN,H.y+30);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...H.COL.text3);
  doc.text("Gerado em "+new Date().toLocaleDateString("pt-BR")+" às "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),H.MARGIN,H.y+44);
  H.y+=58;

  // ── KPIs gerais ──────────────────────────────────────────────────────────
  H.statGrid([
    {label:"Total Sessões",value:String(allSCount),color:H.COL.accent},
    {label:"Procedimentos",value:String(procCount),color:[122,174,212]},
    {label:"Fidelização",value:fidPct+"%",color:H.COL.green},
    {label:"Forecast "+MONTH_NAMES[nextM].slice(0,3),value:fmtCurr(forecastRev),color:H.COL.accent},
  ]);

  // ── Procedimentos realizados ─────────────────────────────────────────────
  H.sectionTitle("Procedimentos Realizados no Mês","💉");
  if((procList||[]).length===0)H.emptyMsg("Nenhum procedimento registrado neste mês.");
  else{
    H.tableHeader([{label:"Procedimento",width:200},{label:"Qtd.",width:45},{label:"Total",width:105,align:"right"},{label:"Pago",width:85,align:"right"},{label:"Pendente",width:65,align:"right"}]);
    procList.forEach(([name,d],i)=>H.tableRow([
      {text:name,width:200},
      {text:String(d.count),width:45},
      {text:fmtCurr(d.total),width:105,align:"right"},
      {text:fmtCurr(d.paid),width:85,align:"right",color:H.COL.green},
      {text:fmtCurr(d.pending),width:65,align:"right",color:H.COL.yellow},
    ],{zebra:i%2===1}));
  }
  H.y+=8;

  // ── Faturamento por categoria ────────────────────────────────────────────
  H.sectionTitle("Faturamento por Categoria","🗂");
  if((catList||[]).length===0)H.emptyMsg("Sem dados de faturamento neste mês.");
  else{
    H.tableHeader([{label:"Categoria",width:260},{label:"Total",width:140,align:"right"},{label:"% do Mês",width:90,align:"right"}]);
    catList.forEach(([cat,val],i)=>H.tableRow([
      {text:cat,width:260},
      {text:fmtCurr(val),width:140,align:"right"},
      {text:Math.round((val/Math.max(totalCat,1))*100)+"%",width:90,align:"right",color:H.COL.accent},
    ],{zebra:i%2===1}));
  }
  H.y+=8;

  // ── Evolução mensal (6 meses) ────────────────────────────────────────────
  H.sectionTitle("Evolução de Receita (6 meses)","📈");
  H.tableHeader([{label:"Mês",width:150},{label:"Sessões",width:150},{label:"Receita",width:200,align:"right"}]);
  (monthlyData||[]).forEach((m,i)=>H.tableRow([
    {text:m.label,width:150},
    {text:String(m.count),width:150},
    {text:fmtCurr(m.rec),width:200,align:"right",color:H.COL.green},
  ],{zebra:i%2===1}));
  H.y+=8;

  // ── Sazonalidade ─────────────────────────────────────────────────────────
  H.sectionTitle("Sazonalidade — Picos e Baixas de Demanda","📅");
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...H.COL.green);
  H.ensureSpace(14); doc.text("Períodos de maior movimento:",H.MARGIN+4,H.y); H.y+=14;
  if((peakMonths||[]).length===0)H.emptyMsg("Sem picos significativos identificados ainda.");
  else peakMonths.forEach(pm=>H.paragraph(`${pm.label} — média de ${Math.round(pm.avgCount*10)/10} sessões/mês (+${pm.indexPct-100}% vs. média) · ${fmtCurr(pm.avgRev)}`,{size:9}));
  H.y+=4;
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(140,150,160);
  H.ensureSpace(14); doc.text("Períodos de menor movimento:",H.MARGIN+4,H.y); H.y+=14;
  if((lowMonths||[]).length===0)H.emptyMsg("Sem baixas significativas identificadas ainda.");
  else lowMonths.forEach(lm=>H.paragraph(`${lm.label} — média de ${Math.round(lm.avgCount*10)/10} sessões/mês (${lm.indexPct-100}% vs. média) · ${fmtCurr(lm.avgRev)}`,{size:9}));
  H.y+=8;

  // ── Ranking de pacientes ─────────────────────────────────────────────────
  H.sectionTitle("Ranking de Pacientes (Top 5)","🏆");
  if((rankingPatients||[]).length===0)H.emptyMsg("Sem pacientes com sessões registradas.");
  else{
    H.tableHeader([{label:"#",width:30},{label:"Paciente",width:260},{label:"Sessões",width:80},{label:"Total Gasto",width:130,align:"right"}]);
    rankingPatients.forEach((p,i)=>H.tableRow([
      {text:String(i+1),width:30},
      {text:p.name,width:260},
      {text:String(p.count),width:80},
      {text:fmtCurr(p.total),width:130,align:"right",color:H.COL.green},
    ],{zebra:i%2===1}));
  }
  H.y+=8;

  // ── Formas de pagamento ──────────────────────────────────────────────────
  H.sectionTitle("Formas de Pagamento","💳");
  if((paymentMethods||[]).length===0)H.emptyMsg("Sem dados de pagamento neste período.");
  else{
    const pmTotal=paymentMethods.reduce((a,[,v])=>a+v,0)||1;
    H.tableHeader([{label:"Forma de Pagamento",width:260},{label:"Total",width:140,align:"right"},{label:"%",width:90,align:"right"}]);
    paymentMethods.forEach(([pm,val],i)=>H.tableRow([
      {text:pm,width:260},
      {text:fmtCurr(val),width:140,align:"right"},
      {text:Math.round((val/pmTotal)*100)+"%",width:90,align:"right",color:H.COL.accent},
    ],{zebra:i%2===1}));
  }

  H.pageNumbers();
  const fileName=`Relatorio_Gerencial_${MONTH_NAMES[selMonth]}_${selYear}.pdf`;
  doc.save(fileName);
}

// ─── EVOLUÇÃO POR REGIÃO DA FACE ──────────────────────────────────────────────
// Regiões-mãe padronizadas com palavras-chave para agrupar o texto livre digitado em "region"
// e também as chaves usadas no FaceMapEditor (faceMap.points), ex: "glabela_c" → Testa/Glabela
const FACE_REGIONS=[
  {k:"testa",l:"Testa / Glabela",icon:"🟪",kw:["testa","glabela","frontal","ruga"],pointKw:["glabela","frontal"]},
  {k:"olheira",l:"Olheira / Periorbital",icon:"👁",kw:["olheira","periorbital","pé de galinha","olhos","região dos olhos"],pointKw:["olheira","pegalinha","periorbital"]},
  {k:"malar",l:"Malar / Maçãs do Rosto",icon:"🍑",kw:["malar","maçã","bochecha","zigomático"],pointKw:["malar","zigoma"]},
  {k:"nariz",l:"Nariz",icon:"👃",kw:["nariz","nasal","rinomodelação"],pointKw:["nariz","nasal"]},
  {k:"labios",l:"Lábios",icon:"💋",kw:["lábio","labial","boca"],pointKw:["labio","lip"]},
  {k:"sulco",l:"Sulco Nasolabial",icon:"〜",kw:["sulco","nasolabial","bigode chinês"],pointKw:["sulco","nasolabial"]},
  {k:"mento",l:"Mento / Queixo",icon:"🔻",kw:["mento","queixo"],pointKw:["mento","queixo"]},
  {k:"mandibula",l:"Mandíbula",icon:"📐",kw:["mandíbula","mandibula","jowls","contorno facial","ângulo da face"],pointKw:["mandibula","jowl"]},
  {k:"marionete",l:"Linhas de Marionete",icon:"⌒",kw:["marionete"],pointKw:["marionete"]},
  {k:"temporal",l:"Têmporas",icon:"⬭",kw:["têmpora","temporal"],pointKw:["tempora"]},
  {k:"pescoco",l:"Pescoço / Papada",icon:"⬇",kw:["pescoço","papada","cervical"],pointKw:["pescoco","papada"]},
  {k:"peGalinha",l:"Pés de Galinha",icon:"〈〉",kw:["pé de galinha","pe de galinha","periocular"],pointKw:["pegalinha"]},
];
function normalize(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
// Dado o texto livre de "region" ou as chaves do faceMap.points, retorna a(s) região(ões)-mãe correspondentes
function matchFaceRegions(text){
  const t=normalize(text);
  if(!t)return [];
  return FACE_REGIONS.filter(r=>r.kw.some(k=>t.includes(normalize(k))));
}
function matchFaceRegionsFromPointKey(key){
  const t=normalize(key);
  return FACE_REGIONS.filter(r=>r.pointKw.some(k=>t.includes(normalize(k))));
}
// Constrói, para uma paciente, o agrupamento completo por região: aplicações, produtos, fotos, datas, intercorrências
function buildRegionEvolution(patient){
  const sessions=patient.sessions||[];
  const byRegion={};
  FACE_REGIONS.forEach(r=>byRegion[r.k]={region:r,entries:[]});
  sessions.forEach(s=>{
    const matched=new Set();
    matchFaceRegions(s.region).forEach(r=>matched.add(r.k));
    matchFaceRegions(s.procedure).forEach(r=>matched.add(r.k));
    if(s.faceMap?.points)Object.keys(s.faceMap.points).forEach(pk=>{
      if(s.faceMap.points[pk]>0)matchFaceRegionsFromPointKey(pk).forEach(r=>matched.add(r.k));
    });
    if(matched.size===0)return;
    matched.forEach(rk=>{
      byRegion[rk].entries.push({
        date:s.date, procedure:s.procedure, product:s.product, dose:s.dose,
        value:s.value, paid:s.paid, photos:s.photos||[], notes:s.notes, evolution:s.evolution,
        intercorrencias:s.intercorrencias||[],
        points:s.faceMap?.points?Object.entries(s.faceMap.points).filter(([k,v])=>v>0&&matchFaceRegionsFromPointKey(k).some(r=>r.k===rk)):[],
        unit:s.faceMap?.type==="botox"?"U":"ml",
      });
    });
  });
  Object.values(byRegion).forEach(g=>g.entries.sort((a,b)=>(parseDMY(b.date)||new Date(0))-(parseDMY(a.date)||new Date(0))));
  return Object.values(byRegion).filter(g=>g.entries.length>0).sort((a,b)=>b.entries.length-a.entries.length);
}

// ─── HELPERS DE ESTOQUE POR LOTE ────────────────────────────────────────────
function getAvailableLotes(products, productName) {
  if (!productName) return [];
  const prod = (products||[]).find(p => (typeof p === "string" ? p : (p.name||p)) === productName);
  if (!prod || !Array.isArray(prod.lotes)) return [];
  return prod.lotes.filter(l => l.qtd > 0);
}
function debitarLote(setProducts, productName, loteId, qtdUsada, obs) {
  if (!productName || !(Number(qtdUsada) > 0)) return;
  setProducts(prev => prev.map(p => {
    const pname = typeof p === "string" ? p : (p.name||p);
    if (pname !== productName) return p;
    const min = p.min || 0;
    const mov = { id: Date.now()+Math.random(), tipo: "saida", qtd: Number(qtdUsada), loteId: loteId?String(loteId):undefined, data: new Date().toLocaleDateString("pt-BR"), obs: obs||"Uso em sessão" };
    // Insumo simples (sem lotes): debita direto do campo qty
    if (!Array.isArray(p.lotes) || p.lotes.length===0) {
      const totalQty = Math.max(0, (Number(p.qty)||0) - Number(qtdUsada));
      const status = totalQty === 0 ? "critical" : totalQty < min ? "low" : "ok";
      return { ...p, qty: totalQty, status, movimentacoes: [...(p.movimentacoes || []), mov] };
    }
    // Produto com lotes: debita do lote específico (comportamento original)
    if (!loteId) return p;
    const lotes = p.lotes.map(l => {
      if (String(l.id) !== String(loteId)) return l;
      return { ...l, qtd: Math.max(0, l.qtd - Number(qtdUsada)) };
    });
    const totalQty = lotes.reduce((a, l) => a + l.qtd, 0);
    const status = totalQty === 0 ? "critical" : totalQty < min ? "low" : "ok";
    return { ...p, lotes, qty: totalQty, status, movimentacoes: [...(p.movimentacoes || []), mov] };
  }));
}
// Estorna (devolve) ao lote uma quantidade debitada anteriormente — usado quando uma sessão/marcador
// já debitado é editado (troca de lote/quantidade) ou excluído, para nunca deixar o estoque desatualizado
// nem permitir débito duplicado: o caller sempre estorna o valor antigo antes de debitar o novo.
function estornarLote(setProducts, productName, loteId, qtdDevolver, obs) {
  if (!productName || !(Number(qtdDevolver) > 0)) return;
  setProducts(prev => prev.map(p => {
    const pname = typeof p === "string" ? p : (p.name||p);
    if (pname !== productName) return p;
    const min = p.min || 0;
    const mov = { id: Date.now()+Math.random(), tipo: "entrada", qtd: Number(qtdDevolver), loteId: loteId?String(loteId):undefined, data: new Date().toLocaleDateString("pt-BR"), obs: obs||"Estorno de ajuste" };
    // Insumo simples (sem lotes): devolve direto no campo qty
    if (!Array.isArray(p.lotes) || p.lotes.length===0) {
      const totalQty = (Number(p.qty)||0) + Number(qtdDevolver);
      const status = totalQty === 0 ? "critical" : totalQty < min ? "low" : "ok";
      return { ...p, qty: totalQty, status, movimentacoes: [...(p.movimentacoes || []), mov] };
    }
    if (!loteId) return p;
    const lotes = p.lotes.map(l => {
      if (String(l.id) !== String(loteId)) return l;
      return { ...l, qtd: l.qtd + Number(qtdDevolver) };
    });
    const totalQty = lotes.reduce((a, l) => a + l.qtd, 0);
    const status = totalQty === 0 ? "critical" : totalQty < min ? "low" : "ok";
    return { ...p, lotes, qty: totalQty, status, movimentacoes: [...(p.movimentacoes || []), mov] };
  }));
}
// Ajusta o débito de um item (sessão ou marcador) que pode já ter sido debitado antes.
// `prevDebit` = {product, loteId, qty} do que já foi debitado (ou null se nunca debitou).
// `nextDebit` = {product, loteId, qty} do que deveria estar debitado agora (ou null se não deve debitar).
// Só mexe no estoque se algo realmente mudou — evita estornar+debitar à toa quando nada foi alterado.
function ajustarDebitoLote(setProducts, prevDebit, nextDebit, obs) {
  const same = prevDebit && nextDebit
    && String(prevDebit.product)===String(nextDebit.product)
    && String(prevDebit.loteId)===String(nextDebit.loteId)
    && Number(prevDebit.qty)===Number(nextDebit.qty);
  if (same) return prevDebit; // nada mudou, não mexe no estoque, mantém o registro de débito atual
  if (prevDebit && Number(prevDebit.qty) > 0) {
    estornarLote(setProducts, prevDebit.product, prevDebit.loteId, prevDebit.qty, obs||"Estorno por edição");
  }
  if (nextDebit && nextDebit.product && nextDebit.loteId && Number(nextDebit.qty) > 0) {
    debitarLote(setProducts, nextDebit.product, nextDebit.loteId, nextDebit.qty, obs||"Uso em sessão");
    return { product: nextDebit.product, loteId: nextDebit.loteId, qty: Number(nextDebit.qty) };
  }
  return null;
}

// Escolhe automaticamente o(s) lote(s) de um produto pelo critério FEFO (primeiro a vencer, primeiro a sair).
// Retorna uma lista de {loteId, qtd} cobrindo o quanto for possível da quantidade pedida (pode ficar parcial se não houver saldo suficiente).
// Para produtos SEM controle de lote (ex: insumos/descartáveis), debita direto do saldo (qty) usando loteId=null.
function pickFefoLotes(products, productName, qtyNeeded) {
  const prod = (products||[]).find(p => (typeof p === "string" ? p : (p.name||p)) === productName);
  if (!prod) return [];
  const restanteTotal = Number(qtyNeeded)||0;
  if (!Array.isArray(prod.lotes) || !prod.lotes.length) {
    // Insumo simples: um único "lote virtual" representando o saldo direto do produto
    const disponivel = Number(prod.qty)||0;
    if (disponivel<=0||restanteTotal<=0) return [];
    return [{ loteId: null, qtd: Math.min(disponivel, restanteTotal) }];
  }
  const parseVal = v => { if(!v) return Infinity; const [m,y]=String(v).split("/"); const n=Number(y)*100+Number(m); return isNaN(n)?Infinity:n; };
  const ordered = prod.lotes.filter(l=>l.qtd>0).slice().sort((a,b)=>parseVal(a.validade)-parseVal(b.validade));
  let restante = restanteTotal;
  const picks = [];
  for (const l of ordered) {
    if (restante <= 0) break;
    const usa = Math.min(l.qtd, restante);
    picks.push({ loteId: l.id, qtd: usa });
    restante -= usa;
  }
  return picks;
}
// Debita automaticamente uma lista de insumos [{product, qty}] usando FEFO em cada produto.
// Recebe `currentProducts` (snapshot atual do estoque, fora do React state) para calcular o FEFO
// corretamente entre múltiplos insumos sem disparar escritas extras no Supabase.
// Retorna a lista de débitos efetivamente realizados: [{product, loteId, qty}, ...] (loteId é null para insumos
// simples sem controle de lote) e também a lista de itens que não puderam ser totalmente debitados (aviso ao usuário).
function debitarInsumosAuto(setProducts, currentProducts, insumosList, obs) {
  const realizados = [];
  const faltantes = [];
  let working = currentProducts; // snapshot local que vamos "simular" debitando, para o FEFO considerar débitos já feitos nesta mesma chamada
  (insumosList||[]).forEach(ins => {
    if (!ins.product || !(Number(ins.qty) > 0)) return;
    const picks = pickFefoLotes(working, ins.product, ins.qty);
    const totalPicked = picks.reduce((a,p)=>a+p.qtd,0);
    if (totalPicked < Number(ins.qty)) faltantes.push({ product: ins.product, faltam: Number(ins.qty)-totalPicked });
    picks.forEach(pk => {
      debitarLote(setProducts, ins.product, pk.loteId, pk.qtd, obs);
      realizados.push({ product: ins.product, loteId: pk.loteId, qty: pk.qtd });
    });
    // Atualiza o snapshot local para refletir o débito que acabou de ser simulado (sem novo round-trip pelo state)
    working = working.map(p => {
      const pname = typeof p === "string" ? p : (p.name||p);
      if (pname !== ins.product) return p;
      if (!Array.isArray(p.lotes) || !p.lotes.length) {
        // Insumo simples: debita direto do saldo (qty) no snapshot local
        const debitado = picks.reduce((a,pk)=>a+pk.qtd,0);
        return { ...p, qty: Math.max(0, (Number(p.qty)||0) - debitado) };
      }
      const lotes = p.lotes.map(l => {
        const pk = picks.find(x=>String(x.loteId)===String(l.id));
        return pk ? { ...l, qtd: Math.max(0, l.qtd - pk.qtd) } : l;
      });
      return { ...p, lotes };
    });
  });
  return { debits: realizados, faltantes };
}
// Estorna (devolve) uma lista de débitos previamente realizados via debitarInsumosAuto.
// loteId pode ser null (insumo simples sem controle de lote) — nesse caso devolve direto no saldo (qty).
function estornarInsumosAuto(setProducts, debitsList, obs) {
  (debitsList||[]).forEach(d => {
    if (d && d.product && Number(d.qty) > 0) {
      estornarLote(setProducts, d.product, d.loteId, d.qty, obs||"Estorno automático");
    }
  });
}
// Versão multi-insumo de ajustarDebitoLote: recebe os débitos anteriores (lista, já com loteId resolvido)
// e a lista de insumos desejada agora [{product, qty}] (sem loteId — escolhido automaticamente via FEFO).
// Estorna tudo que havia antes e debita de novo conforme a ficha técnica atual, evitando débito duplicado.
// `currentProducts` deve ser o snapshot do estoque ANTES do estorno (ex: vindo de allProducts no momento do save).
function ajustarDebitoInsumosAuto(setProducts, currentProducts, prevDebits, nextInsumos, obs) {
  if (prevDebits && prevDebits.length) {
    estornarInsumosAuto(setProducts, prevDebits, obs||"Estorno por edição");
  }
  if (nextInsumos && nextInsumos.length) {
    // Simula localmente o efeito do estorno acima sobre o snapshot, para o FEFO já considerar os lotes/saldo devolvidos
    let working = currentProducts;
    (prevDebits||[]).forEach(d=>{
      working = working.map(p=>{
        const pname = typeof p === "string" ? p : (p.name||p);
        if (pname !== d.product) return p;
        if (!Array.isArray(p.lotes) || !p.lotes.length) {
          return { ...p, qty: (Number(p.qty)||0) + Number(d.qty) };
        }
        const lotes = p.lotes.map(l => String(l.id)===String(d.loteId) ? { ...l, qtd: l.qtd + Number(d.qty) } : l);
        return { ...p, lotes };
      });
    });
    const { debits, faltantes } = debitarInsumosAuto(setProducts, working, nextInsumos, obs||"Uso automático em sessão");
    return { debits, faltantes };
  }
  return { debits: [], faltantes: [] };
}


function stripPhotos(data) {
  if (!Array.isArray(data)) return data;
  return data.map(item => {
    if (!item || typeof item !== "object") return item;
    const out = { ...item };
    if (typeof out.profilePhoto === "string" && out.profilePhoto.startsWith("data:")) out.profilePhoto = null;
    if (Array.isArray(out.sessions)) out.sessions = out.sessions.map(s => ({
      ...s, photos: Array.isArray(s.photos) ? s.photos.filter(p => !(typeof p==="string"&&p.startsWith("data:"))) : (s.photos||[])
    }));
    return out;
  });
}

// ─── SUPABASE SYNC ────────────────────────────────────────────────────────────
// TABELA NECESSÁRIA NO SUPABASE (rodar no SQL Editor):
//
//   create table if not exists app_data (
//     key text not null,
//     user_id uuid not null references auth.users(id) on delete cascade,
//     value jsonb not null default '[]',
//     updated_at timestamptz default now(),
//     primary key (key, user_id)
//   );
//   alter table app_data enable row level security;
//   create policy "users_own_data" on app_data
//     for all to authenticated
//     using (auth.uid() = user_id)
//     with check (auth.uid() = user_id);

let _supaOk = null;
const _supaListeners = new Set();
function _setSupaOk(v) { if(_supaOk===v)return; _supaOk=v; _supaListeners.forEach(fn=>fn(v)); }
function useSupaStatus() {
  const [s, set] = useState(_supaOk);
  useEffect(() => { set(_supaOk); _supaListeners.add(set); return () => _supaListeners.delete(set); }, []);
  return s;
}

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

async function supaRead(key) {
  const uid = await getUserId();
  if (!uid) { _setSupaOk(false); return null; }
  try {
    const { data, error } = await supabase
      .from("app_data").select("value").eq("key", key).eq("user_id", uid).maybeSingle();
    if (error) { _setSupaOk(false); console.warn("[sync] read error", key, error.message); return null; }
    _setSupaOk(true);
    let val = data?.value ?? null;
    // Supabase pode devolver o JSONB já como string (double-encoded) em vez de objeto/array
    if (typeof val === "string") {
      try { val = JSON.parse(val); } catch { /* mantém como string mesmo */ }
    }
    return val;
  } catch(e) { _setSupaOk(false); console.warn("[sync] read exception", key, e); return null; }
}

async function supaWrite(key, value) {
  const uid = await getUserId();
  if (!uid) { _setSupaOk(false); return false; }
  try {
    const clean = stripPhotos(value);
    const { error } = await supabase.from("app_data")
      .upsert({ key, user_id: uid, value: clean, updated_at: new Date().toISOString() }, { onConflict: "key,user_id" });
    if (error) { _setSupaOk(false); console.warn("[sync] write error", key, error.message); return false; }
    _setSupaOk(true);
    return true;
  } catch(e) { _setSupaOk(false); console.warn("[sync] write exception", key, e); return false; }
}

function useSupaTable(key, initFallback = []) {
  const lsKey = "hapro2_" + key;
  const [data, setDataRaw] = useState(initFallback);
  const [synced, setSynced] = useState(false);
  const wantArray = Array.isArray(initFallback);

  useEffect(() => {
    let cancelled = false;
    supaRead(key).then(remote => {
      if (cancelled) return;
      setSynced(true);
      if (remote !== null) {
        // Só aceita o dado remoto se o "shape" combinar com o esperado
        // (evita c.filter is not a function quando vem objeto/null no lugar de array)
        const remoteIsArray = Array.isArray(remote);
        const shapeOk = wantArray ? remoteIsArray : (!remoteIsArray && remote && typeof remote === "object");
        if (shapeOk) setDataRaw(remote);
        else console.warn("[sync] formato inesperado para", key, "— mantendo fallback", remote);
      }
    });
    return () => { cancelled = true; };
  }, [key]);

  const setData = useCallback((valOrFn) => {
    setDataRaw(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      supaWrite(key, next);
      try { localStorage.setItem(lsKey, JSON.stringify(stripPhotos(next))); } catch {}
      return next;
    });
  }, [key, lsKey]);

  return [data, setData, !synced];
}

function useSettings(defaults) {
  const [data, setData, loading] = useSupaTable("settings", defaults);
  const safeData = (data && !Array.isArray(data) && typeof data === "object") ? data : defaults;
  return [safeData, setData, loading];
}

function useGoals() {
  const [goals, setGoals, loading] = useSupaTable("goals", {});
  const safeGoals = (goals && !Array.isArray(goals) && typeof goals === "object") ? goals : {};
  return [safeGoals, setGoals, loading];
}

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => { try { const s=localStorage.getItem(key); return s?JSON.parse(s):init; } catch { return init; } });
  const set = useCallback(v => { const nv=typeof v==="function"?v(val):v; setVal(nv); try{localStorage.setItem(key,JSON.stringify(nv));}catch{}; }, [key]);
  return [val, set];
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
          h("div", { style: { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, color: P.rose, letterSpacing: ".04em", lineHeight: 1.1 } }, "HarmonizaPro"),
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
        createElement("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.rose}},title),
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
          :Object.entries(points).filter(([,v])=>v>0).map(([k,v])=>h("div",{key:k,style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${P.border}`,fontSize:12.5}},h("span",{style:{color:P.text2}},k.replace(/_/g," ")),h("span",{style:{color:P.rose,fontWeight:600}},`${v}${unit}`))),
        total>0&&h("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4}},h("span",{style:{fontSize:12,color:P.text3}},"Total"),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent}},`${total}${unit}`))
      )
    )
  );
}
// ─── MARKER PHOTO PLANNER ─────────────────────────────────────────────────────
// Planejamento com marcadores sobre a foto real da paciente: cada marcador tem
// produto+quantidade planejada e, depois, produto+quantidade realizada, com
// custo estimado x custo real calculados a partir do custo unitário cadastrado
// no Estoque (allProducts[].cost).
function guessMarkerUnit(productName){
  if(!productName)return "U";
  const n=String(productName).toLowerCase();
  if(n.includes("botox")||n.includes("toxina")||n.includes("dysport")||n.includes("xeomin")||n.includes("allergan"))return "U";
  return "ml";
}
function markerUnitCost(allProducts,productName){
  if(!productName)return 0;
  const p=(allProducts||[]).find(x=>(x.name||"").toLowerCase()===String(productName).toLowerCase());
  return p?Number(p.cost)||0:0;
}
function MarkerDot({m,idx,active,onClick}){
  const h=createElement;
  return h("div",{
    onClick,
    title:(m.plannedProduct||"Marcador "+(idx+1)),
    style:{
      position:"absolute",left:m.xPct+"%",top:m.yPct+"%",transform:"translate(-50%,-50%)",
      width:active?27:22,height:active?27:22,borderRadius:"50%",
      background:m.done?"rgba(122,173,138,.88)":"rgba(157,119,97,.88)",
      border:`2px solid ${active?"#fff":(m.done?P.green:P.accent3)}`,
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontSize:10.5,fontWeight:700,cursor:onClick?"pointer":"default",
      boxShadow:"0 2px 7px rgba(0,0,0,.55)",transition:"all .12s",fontFamily:"'DM Sans',sans-serif",
      zIndex:5
    }
  },idx+1);
}
function MarkerPhotoPlanner({initial,allProducts,setProducts,patientPhotos,onSave,onClose}){
  const h=createElement;
  const[baseImage,setBaseImage]=useState(initial?.baseImage||null);
  const[markers,setMarkers]=useState(initial?.markers||[]);
  const[shapes,setShapes]=useState(initial?.shapes||[]); // desenho livre: setas/círculos sobre a foto
  const[selectedId,setSelectedId]=useState(null);
  const[showPicker,setShowPicker]=useState(!initial?.baseImage);
  const[mode,setMode]=useState("marker"); // "marker" | "arrow" | "circle"
  const[drawColor,setDrawColor]=useState("#E1594A");
  const drawStartRef=useRef(null);
  const[drawingPreview,setDrawingPreview]=useState(null);
  const imgWrapRef=useRef();
  const DRAW_COLORS=["#E1594A","#F5A623","#4A90E2","#7ED321","#ffffff"];

  function handleFileUpload(file){
    const r=new FileReader();
    r.onload=e=>{setBaseImage(e.target.result);setMarkers([]);setShapes([]);setSelectedId(null);setShowPicker(false);};
    r.readAsDataURL(file);
  }
  function pickExisting(url){setBaseImage(url);setMarkers([]);setShapes([]);setSelectedId(null);setShowPicker(false);}

  function pctFromEvent(e){
    const rect=imgWrapRef.current.getBoundingClientRect();
    const xPct=((e.clientX-rect.left)/rect.width)*100;
    const yPct=((e.clientY-rect.top)/rect.height)*100;
    return{xPct:Math.max(0,Math.min(100,xPct)),yPct:Math.max(0,Math.min(100,yPct))};
  }

  function addMarkerAt(e){
    if(!imgWrapRef.current)return;
    if(mode!=="marker")return; // modos de desenho tratam o clique via mousedown/mouseup próprios
    const rect=imgWrapRef.current.getBoundingClientRect();
    const xPct=((e.clientX-rect.left)/rect.width)*100;
    const yPct=((e.clientY-rect.top)/rect.height)*100;
    const id=Date.now()+Math.random();
    const novo={id,xPct:Math.max(1.5,Math.min(98.5,xPct)),yPct:Math.max(1.5,Math.min(98.5,yPct)),
      plannedProduct:"",plannedQty:"",plannedUnit:"U",plannedLoteId:"",
      actualProduct:"",actualQty:"",actualUnit:"",actualLoteId:"",stockDebit:null,
      done:false,notes:""};
    setMarkers(m=>[...m,novo]);
    setSelectedId(id);
  }
  function updateMarker(id,patch){setMarkers(m=>m.map(mk=>mk.id===id?{...mk,...patch}:mk));}
  function removeMarker(id){
    const m=markers.find(mk=>mk.id===id);
    if(m?.stockDebit&&setProducts&&Number(m.stockDebit.qty)>0){
      estornarLote(setProducts,m.stockDebit.product,m.stockDebit.loteId,m.stockDebit.qty,"Estorno · marcador removido");
    }
    setMarkers(m=>m.filter(mk=>mk.id!==id));if(selectedId===id)setSelectedId(null);
  }
  function removeShape(id){setShapes(s=>s.filter(sh=>sh.id!==id));}

  // Marca/desmarca como realizado. O ajuste real do estoque (debitar, estornar ou corrigir
  // quantidade/lote) só acontece ao clicar em "Salvar" (handleSave), comparando o estado atual
  // de cada marcador com o que já estava debitado — por isso fechar sem salvar não afeta o estoque.
  function toggleDone(m){
    if(!m.done){
      updateMarker(m.id,{
        done:true,
        actualProduct:m.actualProduct||m.plannedProduct,
        actualQty:m.actualQty||m.plannedQty,
        actualUnit:m.actualUnit||m.plannedUnit,
        actualLoteId:m.actualLoteId||m.plannedLoteId
      });
    } else {
      // Desmarcar: ao salvar, ajustarDebitoLote vai notar que não há mais débito esperado
      // (done:false) e estornar automaticamente o que estava debitado para este marcador.
      updateMarker(m.id,{done:false});
    }
  }

  function handleSave(){
    // Para cada marcador, ajusta o débito de estoque conforme o estado atual:
    // - "done" com lote/qtd válidos → garante que o estoque reflita exatamente esse lote/qtd
    //   (debita se nunca debitou, ou estorna+redebita se mudou desde a última vez).
    // - não "done" (ou sem lote/qtd) → garante que nada fique debitado (estorna se havia débito).
    // ajustarDebitoLote só mexe no estoque quando algo de fato mudou, então salvar de novo sem
    // alterar nada não duplica nem estorna à toa.
    let finalMarkers=markers;
    if(setProducts){
      finalMarkers=markers.map(m=>{
        const nextDebit=(m.done&&m.actualLoteId&&Number(m.actualQty)>0)
          ?{product:m.actualProduct||m.plannedProduct,loteId:m.actualLoteId,qty:Number(m.actualQty)}
          :null;
        const stockDebit=ajustarDebitoLote(setProducts,m.stockDebit||null,nextDebit,"Mapa facial · marcador");
        return{...m,stockDebit};
      });
    }
    onSave({baseImage,markers:finalMarkers,shapes});
  }

  // ── Desenho livre (seta / círculo) ──
  function onWrapMouseDown(e){
    if(mode==="marker")return;
    e.preventDefault();
    drawStartRef.current=pctFromEvent(e);
  }
  function onWrapMouseMove(e){
    if(mode==="marker"||!drawStartRef.current)return;
    const pos=pctFromEvent(e);
    setDrawingPreview({...drawStartRef.current,x2:pos.xPct,y2:pos.yPct});
  }
  function onWrapMouseUp(e){
    if(mode==="marker"||!drawStartRef.current)return;
    const start=drawStartRef.current;
    const pos=pctFromEvent(e);
    drawStartRef.current=null;
    setDrawingPreview(null);
    if(Math.abs(pos.xPct-start.xPct)<1&&Math.abs(pos.yPct-start.yPct)<1)return; // clique sem arrastar, ignora
    setShapes(s=>[...s,{id:Date.now()+Math.random(),type:mode,x1:start.xPct,y1:start.yPct,x2:pos.xPct,y2:pos.yPct,color:drawColor}]);
  }
  function onWrapClick(e){
    if(mode==="marker")addMarkerAt(e);
  }

  const cu=name=>markerUnitCost(allProducts,name);
  const totalPlanned=markers.reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
  const doneMarkers=markers.filter(m=>m.done);
  const pendingMarkers=markers.filter(m=>!m.done);
  const totalActual=doneMarkers.reduce((a,m)=>a+(Number(m.actualQty)||0)*cu(m.actualProduct||m.plannedProduct),0);
  const totalActualPlannedPortion=doneMarkers.reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
  const totalPending=pendingMarkers.reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
  const diff=totalActual-totalActualPlannedPortion;
  const selected=markers.find(m=>m.id===selectedId);
  const prodOptions=["",...(allProducts||[]).map(p=>p.name)];
  const plannedLotes=selected?getAvailableLotes(allProducts||[],selected.plannedProduct):[];
  const actualLotes=selected?getAvailableLotes(allProducts||[],selected.actualProduct||selected.plannedProduct):[];

  const TOOLS=[
    {k:"marker",icon:"📍",label:"Marcador"},
    {k:"arrow",icon:"➜",label:"Seta"},
    {k:"circle",icon:"○",label:"Círculo / Área"},
  ];

  // Nota: o SVG usa coordenadas percentuais (viewBox 0..100) para acompanhar o redimensionamento responsivo da foto.
  // Em fotos com proporção muito diferente de 1:1, círculos podem ficar levemente ovalados — efeito sutil e aceitável
  // para anotação clínica; a espessura da linha permanece constante via vectorEffect="non-scaling-stroke".
  function renderShapeSvg(){
    return h("svg",{style:{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"},viewBox:"0 0 100 100",preserveAspectRatio:"none"},
      shapes.map(sh=>{
        if(sh.type==="arrow"){
          const angle=Math.atan2(sh.y2-sh.y1,sh.x2-sh.x1);
          const hs=2.6;
          return h("g",{key:sh.id},
            h("line",{x1:sh.x1,y1:sh.y1,x2:sh.x2,y2:sh.y2,stroke:sh.color,strokeWidth:0.5,vectorEffect:"non-scaling-stroke"}),
            h("polygon",{points:`${sh.x2},${sh.y2} ${sh.x2-hs*Math.cos(angle-0.45)},${sh.y2-hs*Math.sin(angle-0.45)} ${sh.x2-hs*Math.cos(angle+0.45)},${sh.y2-hs*Math.sin(angle+0.45)}`,fill:sh.color})
          );
        }
        if(sh.type==="circle"){
          const rx=Math.abs(sh.x2-sh.x1)/2,ry=Math.abs(sh.y2-sh.y1)/2;
          const cx=sh.x1+(sh.x2-sh.x1)/2,cy=sh.y1+(sh.y2-sh.y1)/2;
          return h("ellipse",{key:sh.id,cx,cy,rx:Math.max(rx,0.6),ry:Math.max(ry,0.6),fill:"none",stroke:sh.color,strokeWidth:0.5,vectorEffect:"non-scaling-stroke"});
        }
        return null;
      }),
      drawingPreview&&mode!=="marker"&&(()=>{
        const sh={x1:drawingPreview.xPct,y1:drawingPreview.yPct,x2:drawingPreview.x2,y2:drawingPreview.y2};
        if(mode==="arrow"){
          const angle=Math.atan2(sh.y2-sh.y1,sh.x2-sh.x1);
          const hs=2.6;
          return h("g",null,
            h("line",{x1:sh.x1,y1:sh.y1,x2:sh.x2,y2:sh.y2,stroke:drawColor,strokeWidth:0.5,strokeDasharray:"1.5,1",vectorEffect:"non-scaling-stroke"}),
            h("polygon",{points:`${sh.x2},${sh.y2} ${sh.x2-hs*Math.cos(angle-0.45)},${sh.y2-hs*Math.sin(angle-0.45)} ${sh.x2-hs*Math.cos(angle+0.45)},${sh.y2-hs*Math.sin(angle+0.45)}`,fill:drawColor,opacity:0.7})
          );
        }
        const rx=Math.abs(sh.x2-sh.x1)/2,ry=Math.abs(sh.y2-sh.y1)/2;
        const cx=sh.x1+(sh.x2-sh.x1)/2,cy=sh.y1+(sh.y2-sh.y1)/2;
        return h("ellipse",{cx,cy,rx:Math.max(rx,0.6),ry:Math.max(ry,0.6),fill:"none",stroke:drawColor,strokeWidth:0.5,strokeDasharray:"1.5,1",vectorEffect:"non-scaling-stroke"});
      })()
    );
  }

  if(showPicker||!baseImage){
    return h("div",{style:{position:"fixed",inset:0,background:"rgba(8,4,6,.97)",zIndex:3000,display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px",overflow:"auto",gap:16}},
      h("div",{style:{width:"100%",maxWidth:760,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3}},"📍 Escolha a foto da paciente"),
        h("button",{onClick:onClose,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text3,padding:"7px 14px",cursor:"pointer",fontSize:13}},"✕")
      ),
      (patientPhotos||[]).length>0&&h("div",{style:{width:"100%",maxWidth:760,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}},
        patientPhotos.map((ph,i)=>h("img",{key:i,src:ph.url,onClick:()=>pickExisting(ph.url),title:ph.label||"",style:{width:"100%",height:120,objectFit:"cover",borderRadius:10,border:`1px solid ${P.border}`,cursor:"pointer"}}))
      ),
      (patientPhotos||[]).length===0&&h("div",{style:{fontSize:12.5,color:P.text3}},"Nenhuma foto registrada ainda na ficha da paciente. Envie uma abaixo."),
      h("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,width:"100%",maxWidth:760,height:160,border:`2px dashed ${P.border}`,borderRadius:14,cursor:"pointer",background:P.bg3,color:P.text3,flexShrink:0}},
        h("div",{style:{fontSize:34}},"📷"),
        h("div",{style:{fontSize:14,color:P.accent3,fontFamily:"'Cormorant Garamond',serif"}},"Enviar foto"),
        h("div",{style:{fontSize:11.5,color:P.text3}},"Clique para selecionar uma imagem do dispositivo"),
        h("input",{type:"file",accept:"image/*",style:{display:"none"},onChange:e=>{if(e.target.files[0])handleFileUpload(e.target.files[0]);}})
      )
    );
  }

  return h("div",{style:{position:"fixed",inset:0,background:"rgba(8,4,6,.97)",zIndex:3000,display:"flex",flexDirection:"column",padding:"14px 16px",overflow:"auto",gap:12}},
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,flexShrink:0}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent3}},"📍 Mapa Facial · Foto da Paciente"),
      h("div",{style:{display:"flex",gap:8}},
        h("button",{onClick:()=>setShowPicker(true),style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text2,cursor:"pointer",fontSize:12.5}},"🔄 Trocar foto"),
        h("button",{onClick:handleSave,style:{padding:"7px 18px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,cursor:"pointer",fontSize:13,fontWeight:600}},"💾 Salvar"),
        h("button",{onClick:onClose,style:{padding:"7px 14px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text3,cursor:"pointer",fontSize:13}},"✕")
      )
    ),
    // Toolbar: modo (marcador/seta/círculo) + cor do desenho
    h("div",{style:{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",padding:"8px 12px",background:P.bg2,borderRadius:10,border:`1px solid ${P.border}`,flexShrink:0}},
      h("div",{style:{display:"flex",gap:4}},
        TOOLS.map(t=>h("button",{key:t.k,onClick:()=>setMode(t.k),title:t.label,style:{padding:"6px 12px",borderRadius:7,border:`1px solid ${mode===t.k?P.rose:P.border}`,background:mode===t.k?P.rose:"transparent",color:mode===t.k?P.accent3:P.text2,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}},t.icon,t.label))
      ),
      mode!=="marker"&&h(Fragment,null,
        h("div",{style:{width:1,height:22,background:P.border}}),
        h("div",{style:{display:"flex",gap:4,alignItems:"center"}},
          DRAW_COLORS.map(c=>h("button",{key:c,onClick:()=>setDrawColor(c),style:{width:18,height:18,borderRadius:"50%",background:c,border:`2px solid ${drawColor===c?P.accent3:"rgba(255,255,255,.2)"}`,cursor:"pointer",transform:drawColor===c?"scale(1.15)":"none"}}))
        )
      ),
      h("div",{style:{fontSize:11,color:P.text3,marginLeft:"auto"}},
        mode==="marker"?"Clique na foto para adicionar um marcador numerado.":"Clique e arraste sobre a foto para desenhar.")
    ),
    h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",flex:1,minHeight:0}},
      h("div",{style:{flex:"1 1 420px",minWidth:280,display:"flex",alignItems:"flex-start",justifyContent:"center"}},
        h("div",{
          ref:imgWrapRef,
          onClick:onWrapClick,
          onMouseDown:onWrapMouseDown,onMouseMove:onWrapMouseMove,onMouseUp:onWrapMouseUp,onMouseLeave:()=>{drawStartRef.current=null;setDrawingPreview(null);},
          style:{position:"relative",display:"inline-block",cursor:mode==="marker"?"crosshair":"crosshair",borderRadius:10,overflow:"hidden",border:`1px solid ${P.border}`,maxWidth:"100%",lineHeight:0}
        },
          h("img",{src:baseImage,draggable:false,style:{display:"block",maxWidth:"100%",maxHeight:"70vh",userSelect:"none"}}),
          renderShapeSvg(),
          markers.map((m,i)=>h(MarkerDot,{key:m.id,m,idx:i,active:selectedId===m.id,onClick:e=>{e.stopPropagation();setSelectedId(m.id);}}))
        )
      ),
      h("div",{style:{flex:"0 0 320px",minWidth:280,display:"flex",flexDirection:"column",gap:12,maxHeight:"78vh",overflowY:"auto"}},
        h("div",{style:{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:10,padding:14,flexShrink:0}},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}},"Resumo"),
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0"}},h("span",{style:{color:P.text2}},"Marcadores"),h("span",{style:{color:P.text}},doneMarkers.length+" / "+markers.length+" realizados")),
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0"}},h("span",{style:{color:P.text2}},"Custo planejado (total)"),h("span",{style:{color:P.rose,fontWeight:600}},fmtCurr(totalPlanned))),
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0"}},h("span",{style:{color:P.text2}},"Custo realizado"),h("span",{style:{color:P.green,fontWeight:600}},fmtCurr(totalActual))),
          h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0"}},h("span",{style:{color:P.text2}},"Restante a executar"),h("span",{style:{color:P.yellow,fontWeight:600}},fmtCurr(totalPending))),
          doneMarkers.length>0&&h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0",borderTop:`1px solid ${P.border}`,marginTop:6,paddingTop:8}},
            h("span",{style:{color:P.text2}},"Diferença (realizado − planejado)"),
            h("span",{style:{color:diff>0?P.red:(diff<0?P.green:P.text2),fontWeight:600}},(diff>0?"+":"")+fmtCurr(diff))
          )
        ),
        selected
          ? h("div",{style:{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:10,flexShrink:0}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("div",{style:{fontSize:13,color:P.rose,fontWeight:600}},"Marcador "+(markers.findIndex(m=>m.id===selected.id)+1)),
                h("button",{onClick:()=>removeMarker(selected.id),style:{background:"transparent",border:"1px solid rgba(192,112,112,.25)",color:P.red,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11}},"🗑 Remover")
              ),
              h("div",null,
                h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Produto previsto"),
                h(Sel,{value:selected.plannedProduct,onChange:v=>updateMarker(selected.id,{plannedProduct:v,plannedUnit:guessMarkerUnit(v),plannedLoteId:""}),options:prodOptions})
              ),
              h("div",{style:{display:"flex",gap:8}},
                h("div",{style:{flex:1}},
                  h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Qtd. planejada"),
                  h(Inp,{type:"number",value:selected.plannedQty,onChange:v=>updateMarker(selected.id,{plannedQty:v})})
                ),
                h("div",{style:{width:64}},
                  h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Un."),
                  h(Inp,{value:selected.plannedUnit,onChange:v=>updateMarker(selected.id,{plannedUnit:v})})
                )
              ),
              plannedLotes.length>0&&h("div",null,
                h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Lote previsto (reserva)"),
                h("select",{value:selected.plannedLoteId||"",onChange:e=>updateMarker(selected.id,{plannedLoteId:e.target.value}),style:IS},
                  h("option",{value:""},"Sem lote definido"),
                  plannedLotes.map(l=>h("option",{key:l.id,value:String(l.id)},l.codigo+" — "+l.qtd+" disponível"+(l.validade?" · val "+l.validade:"")))
                )
              ),
              selected.plannedProduct&&h("div",{style:{fontSize:11,color:P.text3}},"Custo estimado: "+fmtCurr((Number(selected.plannedQty)||0)*cu(selected.plannedProduct))),
              h("div",null,
                h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Observação"),
                h(TA,{value:selected.notes,onChange:v=>updateMarker(selected.id,{notes:v}),rows:2,placeholder:"Ex: técnica em leque, simetria, etc."})
              ),
              h("div",{style:{borderTop:`1px solid ${P.border}`,paddingTop:10,marginTop:2}},
                h("button",{onClick:()=>toggleDone(selected),style:{width:"100%",padding:"7px 0",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",background:selected.done?P.green:"transparent",border:`1px solid ${selected.done?P.green:P.border}`,color:selected.done?"#fff":P.text2,marginBottom:selected.done?10:0}},
                  selected.done?"✓ Marcado como Realizado":"＋ Marcar como Realizado"
                ),
                selected.done&&h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
                  h("div",null,
                    h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Produto realizado"),
                    h(Sel,{value:selected.actualProduct||selected.plannedProduct,onChange:v=>updateMarker(selected.id,{actualProduct:v,actualLoteId:""}),options:prodOptions})
                  ),
                  h("div",{style:{display:"flex",gap:8}},
                    h("div",{style:{flex:1}},
                      h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Qtd. realizada"),
                      h(Inp,{type:"number",value:selected.actualQty,onChange:v=>updateMarker(selected.id,{actualQty:v})})
                    ),
                    h("div",{style:{width:64}},
                      h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Un."),
                      h(Inp,{value:selected.actualUnit||selected.plannedUnit,onChange:v=>updateMarker(selected.id,{actualUnit:v})})
                    )
                  ),
                  actualLotes.length>0&&h("div",null,
                    h("label",{style:{display:"block",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}},"Lote utilizado"),
                    h("select",{value:selected.actualLoteId||"",onChange:e=>updateMarker(selected.id,{actualLoteId:e.target.value}),style:IS},
                      h("option",{value:""},"Selecionar lote..."),
                      actualLotes.map(l=>h("option",{key:l.id,value:String(l.id)},l.codigo+" — "+l.qtd+" disponível"+(l.validade?" · val "+l.validade:"")))
                    ),
                    selected.stockDebit&&h("div",{style:{fontSize:10,color:P.green,marginTop:4}},`✓ Estoque debitado: ${selected.stockDebit.qty}${selected.actualUnit||selected.plannedUnit||""} do lote selecionado`),
                    !selected.stockDebit&&selected.actualLoteId&&h("div",{style:{fontSize:10,color:P.yellow,marginTop:4}},"⚠ Salve para debitar do estoque"),
                    selected.stockDebit&&(String(selected.stockDebit.loteId)!==String(selected.actualLoteId)||Number(selected.stockDebit.qty)!==Number(selected.actualQty))&&h("div",{style:{fontSize:10,color:P.yellow,marginTop:4}},"⚠ Lote/quantidade alterados — salve para corrigir o estoque")
                  ),
                  h("div",{style:{fontSize:11,color:P.text3}},"Custo real: "+fmtCurr((Number(selected.actualQty)||0)*cu(selected.actualProduct||selected.plannedProduct)))
                )
              )
            )
          : h("div",{style:{background:P.bg3,border:`1px dashed ${P.border}`,borderRadius:10,padding:20,textAlign:"center",color:P.text3,fontSize:12.5,flexShrink:0}},
              markers.length===0?"Clique em qualquer ponto da foto para adicionar o primeiro marcador.":"Selecione um marcador na foto (ou na lista abaixo) para editar."
            ),
        shapes.length>0&&h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em"}},"Anotações desenhadas"),
          shapes.map((sh,i)=>h("div",{key:sh.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,fontSize:11.5}},
            h("span",{style:{color:P.text2,display:"flex",alignItems:"center",gap:6}},h("span",{style:{width:10,height:10,borderRadius:"50%",background:sh.color,display:"inline-block"}}),(sh.type==="arrow"?"➜ Seta":"○ Círculo")+" "+(i+1)),
            h("button",{onClick:()=>removeShape(sh.id),style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:13}},"✕")
          ))
        ),
        markers.length>0&&h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          markers.map((m,i)=>h("div",{key:m.id,onClick:()=>setSelectedId(m.id),style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:8,background:selectedId===m.id?P.card2:P.bg3,border:`1px solid ${selectedId===m.id?P.rose:P.border}`,cursor:"pointer",fontSize:11.5}},
            h("span",{style:{color:P.text2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},(i+1)+". "+(m.plannedProduct||"sem produto")+(m.plannedQty?(" · "+m.plannedQty+(m.plannedUnit||"")):"")),
            h("span",{style:{color:m.done?P.green:P.yellow,fontSize:10,flexShrink:0,marginLeft:8}},m.done?"✓ Realizado":"Planejado")
          ))
        )
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
// ─── SYNC INDICATOR ───────────────────────────────────────────────────────────
function SyncIndicator(){
  const h=createElement;
  const status=useSupaStatus();
  if(status===null)return null;
  const ok=status===true;
  return h("div",{
    style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:20,background:ok?"rgba(122,173,138,.10)":"rgba(192,112,112,.12)",border:`1px solid ${ok?"rgba(122,173,138,.25)":"rgba(192,112,112,.3)"}`,cursor:"default",flexShrink:0},
    title:ok?"Dados sincronizados — aparecem em todos os dispositivos":"Sem sincronizacao com servidor. Verifique a tabela app_data no Supabase."
  },
    h("div",{style:{width:7,height:7,borderRadius:"50%",background:ok?"#7aad8a":"#c07070"}}),
    h("span",{style:{fontSize:11,color:ok?"#7aad8a":"#c07070",fontWeight:500,whiteSpace:"nowrap"}},ok?"Nuvem 2713":"Sem sync")
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
function RetornosPendentes({patients,returnRules,onSelectPatient,onNav,onScheduleReturn,mini=false}){
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
        urgencia=3;urgLabel="Em dia";urgColor=P.green;urgBg="rgba(122,173,138,.08)";
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
            onScheduleReturn&&h("button",{onClick:()=>onScheduleReturn(r),title:"Agendar retorno agora",style:{display:"flex",alignItems:"center",gap:4,padding:"5px 9px",background:"rgba(157,119,97,.15)",border:"1px solid rgba(157,119,97,.35)",borderRadius:7,color:P.accent,fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"'DM Sans',sans-serif"}},"📅"),
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
      [{l:"Atrasadas",v:retornos.filter(r=>r.urgencia===0).length,c:KPI.red,icon:"🔴",f:"urgente"},
       {l:"Esta semana",v:retornos.filter(r=>r.urgencia===1).length,c:KPI.yellow,icon:"🟡",f:"proximo"},
       {l:"Este mês",v:retornos.filter(r=>r.urgencia===2).length,c:KPI.blue,icon:"🔵",f:"proximo"},
       {l:"Em dia",v:retornos.filter(r=>r.urgencia===3).length,c:KPI.green,icon:"🟢",f:"ok"}
      ].map(k=>h(Card,{key:k.l,onClick:()=>setFilter(f=>f===k.f?"todos":k.f),style:{cursor:"pointer",textAlign:"center",background:`${k.c}1A`,border:`1px solid ${filter===k.f?k.c:k.c+"40"}`,transition:"all .15s"}},
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
                  onScheduleReturn&&h("button",{onClick:()=>onScheduleReturn(r),style:{padding:"7px 14px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,border:"none",color:P.accent3,fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"'DM Sans',sans-serif"}},"📅 Agendar agora"),
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
      [{icon:"🎂",label:"Hoje",value:todayList.length,color:KPI.yellow},{icon:"🗓️",label:"Esta semana",value:weekList.length,color:KPI.blue},{icon:"📅",label:"Este mês",value:withBday.filter(p=>p._month===today.getMonth()).length,color:KPI.green},{icon:"📊",label:"Com data cadastrada",value:withBday.length,color:KPI.purple}]
      .map(k=>h(Card,{key:k.label,style:kpiCardStyle(k.color)},h("div",{style:{fontSize:24,marginBottom:6}},k.icon),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:k.color,lineHeight:1}},k.value),h("div",{style:{fontSize:11,color:P.text3,marginTop:4}},k.label)))
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
// ─── META DE FATURAMENTO ──────────────────────────────────────────────────────
function MetaFaturamento({received,selMonth,selYear,goals,setGoals,prevMonthReceived}){
  const h=createElement;
  const goalKey=`${selYear}-${String(selMonth+1).padStart(2,"0")}`;
  const meta=Number((goals||{})[goalKey]||0);
  const[editing,setEditing]=useState(false);
  const[inputVal,setInputVal]=useState("");

  const pct=meta>0?(received/meta)*100:0;
  const pctCapped=Math.min(pct,100);

  const barColor=pct>=100?P.green:pct>=75?P.accent:pct>=50?P.yellow:P.red;

  const now2=new Date();
  const isCurrentMonth=selMonth===now2.getMonth()&&selYear===now2.getFullYear();
  const daysInMonth=new Date(selYear,selMonth+1,0).getDate();
  const dayOfMonth=isCurrentMonth?now2.getDate():daysInMonth;
  const projection=dayOfMonth>0?Math.round((received/dayOfMonth)*daysInMonth):0;

  const diffPct=prevMonthReceived>0?Math.round(((received-prevMonthReceived)/prevMonthReceived)*100):null;
  const diffIsPositive=diffPct!==null&&diffPct>=0;

  const statusLabel=pct>=100?"🎯 Meta atingida!":pct>=75?"🔥 Quase lá!":pct>=50?"📈 Na metade do caminho":pct>0?"🚀 Aquecendo motores...":meta>0?"⏳ Sem receitas ainda":"Nenhuma meta definida";

  function openEdit(){setInputVal(meta>0?String(meta):"");setEditing(true);}
  function saveMeta(){
    const val=Number(String(inputVal).replace(/\D/g,""))||0;
    setGoals(prev=>({...(prev||{}),[goalKey]:val}));
    setEditing(false);
  }
  function handleKeyDown(e){if(e.key==="Enter")saveMeta();if(e.key==="Escape")setEditing(false);}

  return h("div",{style:{background:`linear-gradient(135deg,${P.card},${P.card2})`,border:`1px solid ${P.border}`,borderRadius:16,padding:"20px 24px",marginBottom:18,position:"relative",overflow:"hidden"}},
    h("div",{style:{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:barColor,opacity:.04,pointerEvents:"none"}}),
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}},
      h("div",null,
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"🎯 Meta de Faturamento"),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.text,lineHeight:1.1}},`${MONTH_NAMES[selMonth]} ${selYear}`)
      ),
      editing
        ?h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("span",{style:{fontSize:12,color:P.text3}},"R$"),
            h("input",{autoFocus:true,value:inputVal,onChange:e=>setInputVal(e.target.value.replace(/\D/g,"")),onKeyDown:handleKeyDown,placeholder:"ex: 30000",style:{width:110,background:P.bg3,border:`1px solid ${P.accent}`,borderRadius:8,padding:"6px 10px",color:P.text,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none"}}),
            h("button",{onClick:saveMeta,style:{background:P.rose,border:"none",borderRadius:8,color:P.accent3,cursor:"pointer",padding:"6px 14px",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}},"Salvar"),
            h("button",{onClick:()=>setEditing(false),style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text3,cursor:"pointer",padding:"6px 10px",fontSize:12,fontFamily:"'DM Sans',sans-serif"}},"✕")
          )
        :h("button",{onClick:openEdit,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.accent,cursor:"pointer",padding:"6px 14px",fontSize:11,fontFamily:"'DM Sans',sans-serif"}},meta>0?"✎ Editar meta":"＋ Definir meta")
    ),
    h("div",{style:{display:"flex",alignItems:"baseline",gap:10,marginBottom:14,flexWrap:"wrap"}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:barColor,lineHeight:1}},fmtCurr(received)),
      meta>0&&h("div",{style:{fontSize:14,color:P.text3}},`de ${fmtCurr(meta)}`),
      meta>0&&h("div",{style:{fontSize:12,fontWeight:700,padding:"2px 10px",borderRadius:20,background:pct>=100?"rgba(122,173,138,.15)":"rgba(157,119,97,.12)",color:barColor}},`${Math.round(pct)}%`)
    ),
    h("div",{style:{width:"100%",height:10,background:P.bg3,borderRadius:10,overflow:"hidden",marginBottom:14}},
      h("div",{style:{width:`${pctCapped}%`,height:"100%",background:`linear-gradient(90deg,${P.rose},${barColor})`,borderRadius:10,transition:"width .5s cubic-bezier(.4,0,.2,1)"}})
    ),
    h("div",{style:{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}},
      h("div",{style:{fontSize:12,color:P.text2}},statusLabel),
      meta>0&&isCurrentMonth&&h("div",{style:{display:"flex",alignItems:"center",gap:6,fontSize:12}},
        h("span",{style:{color:P.text3}},"Projeção:"),
        h("span",{style:{color:projection>=meta?P.green:P.yellow,fontWeight:600}},fmtCurr(projection)),
        projection>=meta
          ?h("span",{style:{fontSize:10,color:P.green}},"✓ vai bater")
          :h("span",{style:{fontSize:10,color:P.yellow}},`faltam ${fmtCurr(meta-projection)}`)
      ),
      diffPct!==null&&h("div",{style:{display:"flex",alignItems:"center",gap:4,fontSize:12}},
        h("span",{style:{color:P.text3}},"vs mês anterior:"),
        h("span",{style:{color:diffIsPositive?P.green:P.red,fontWeight:600}},`${diffIsPositive?"+":""}${diffPct}%`)
      )
    )
  );
}

// ─── META POR PROCEDIMENTO ────────────────────────────────────────────────────
// Metas de QUANTIDADE (nº de pacientes/atendimentos) por procedimento, por mês.
// Reaproveita a mesma tabela "goals" (key-value), usando chaves no formato
// "AAAA-MM::procQty::Nome".
const procGoalKey=(y,m,proc)=>`${y}-${String(m+1).padStart(2,"0")}::procQty::${proc}`;

function MetaPorProcedimento({procedures=[],patients=[],selMonth,selYear,goals,setGoals,compact=false,onNav}){
  const h=createElement;
  const prefix=procGoalKey(selYear,selMonth,"");
  const safeGoals=goals||{};

  const inMonth=d=>{const dt=parseAnyDate(d);return dt&&dt.getMonth()===selMonth&&dt.getFullYear()===selYear;};
  const countByProc=useMemo(()=>{
    const map={};
    patients.flatMap(p=>p.sessions||[]).filter(s=>inMonth(s.date)).forEach(s=>{
      const k=s.procedure||"Outro";
      map[k]=(map[k]||0)+1;
    });
    return map;
  },[patients,selMonth,selYear]);

  const definedProcs=Object.keys(safeGoals).filter(k=>k.startsWith(prefix)).map(k=>k.slice(prefix.length)).filter(Boolean);
  const rows=definedProcs.map(proc=>{
    const meta=Number(safeGoals[prefix+proc])||0;
    const received=countByProc[proc]||0;
    const pct=meta>0?(received/meta)*100:0;
    return{proc,meta,received,pct};
  }).sort((a,b)=>a.pct-b.pct);

  const availableProcs=procedures.filter(p=>!definedProcs.includes(p));

  const[editingProc,setEditingProc]=useState(null);
  const[inputVal,setInputVal]=useState("");
  const[addProc,setAddProc]=useState("");
  const[showAdd,setShowAdd]=useState(false);

  function openEdit(proc,curMeta){setEditingProc(proc);setInputVal(curMeta>0?String(curMeta):"");}
  function saveMeta(proc){
    const val=Number(String(inputVal).replace(/\D/g,""))||0;
    setGoals(prev=>{
      const next={...(prev||{})};
      if(val>0)next[prefix+proc]=val;else delete next[prefix+proc];
      return next;
    });
    setEditingProc(null);setInputVal("");
  }
  function removeMeta(proc){
    if(!window.confirm(`Remover a meta de "${proc}"?`))return;
    setGoals(prev=>{const next={...(prev||{})};delete next[prefix+proc];return next;});
  }
  function addMeta(){
    if(!addProc)return;
    setEditingProc(addProc);setInputVal("");setShowAdd(false);setAddProc("");
  }

  // ── Modo compacto (widget do Dashboard) ──
  if(compact){
    if(rows.length===0)return null;
    return h("div",{style:{marginBottom:14,padding:"14px 18px",background:P.card,border:`1px solid ${P.border}`,borderRadius:12}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}},
        h("div",null,
          h("div",{style:{fontSize:13,color:P.text,fontWeight:700}},"🎯 Meta por Procedimento"),
          h("div",{style:{fontSize:11,color:P.text3}},`${MONTH_NAMES[selMonth]} ${selYear}`)
        ),
        onNav&&h("button",{onClick:()=>onNav("financeiro"),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.3)`,borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"Ver tudo →")
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
        rows.slice(0,3).map(r=>{
          const barColor=r.pct>=100?P.green:r.pct>=75?P.accent:r.pct>=50?P.yellow:P.red;
          return h("div",{key:r.proc},
            h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,gap:8}},
              h("span",{style:{color:P.text2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},r.proc),
              h("span",{style:{color:barColor,fontWeight:600,flexShrink:0}},`${r.received}/${r.meta}`)
            ),
            h("div",{style:{width:"100%",height:6,background:P.bg3,borderRadius:10,overflow:"hidden"}},
              h("div",{style:{width:`${Math.min(r.pct,100)}%`,height:"100%",background:`linear-gradient(90deg,${P.rose},${barColor})`,borderRadius:10,transition:"width .5s cubic-bezier(.4,0,.2,1)"}})
            )
          );
        }),
        rows.length>3&&h("div",{style:{fontSize:10.5,color:P.text3}},`+ ${rows.length-3} procedimento${rows.length-3>1?"s":""} com meta`)
      )
    );
  }

  // ── Modo completo (Financeiro) ──
  return h(Card,{style:{marginBottom:18}},
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:8}},
      h("div",null,
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"🎯 Meta por Procedimento"),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},`${MONTH_NAMES[selMonth]} ${selYear}`)
      ),
      availableProcs.length>0&&!showAdd&&h("button",{onClick:()=>{setShowAdd(true);setAddProc(availableProcs[0]||"");},style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"＋ Adicionar")
    ),
    showAdd&&h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",margin:"10px 0",padding:10,background:P.bg3,borderRadius:8}},
      h("div",{style:{minWidth:220,flex:1}},h(Sel,{value:addProc,onChange:setAddProc,options:availableProcs})),
      h(Btn,{onClick:addMeta,disabled:!addProc},"Definir meta"),
      h(Btn,{variant:"ghost",onClick:()=>{setShowAdd(false);setAddProc("");}},"Cancelar")
    ),
    rows.length===0&&!editingProc&&h("div",{style:{fontSize:12.5,color:P.text3,padding:"14px 0"}},"Nenhuma meta por procedimento definida este mês. Use \"＋ Adicionar\" para começar."),
    h("div",{style:{display:"flex",flexDirection:"column",gap:14,marginTop:rows.length||editingProc?12:0}},
      // Linha de edição para um procedimento novo (ainda sem meta salva)
      editingProc&&!rows.some(r=>r.proc===editingProc)&&h("div",{key:"new_"+editingProc,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:P.bg3,borderRadius:8}},
        h("div",{style:{flex:1,fontSize:13,color:P.text}},editingProc),
        h("input",{autoFocus:true,value:inputVal,onChange:e=>setInputVal(e.target.value.replace(/\D/g,"")),onKeyDown:e=>{if(e.key==="Enter")saveMeta(editingProc);if(e.key==="Escape")setEditingProc(null);},placeholder:"ex: 10",style:{width:80,background:P.card,border:`1px solid ${P.accent}`,borderRadius:8,padding:"6px 10px",color:P.text,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",textAlign:"center"}}),
        h("span",{style:{fontSize:12,color:P.text3}},"pacientes/mês"),
        h("button",{onClick:()=>saveMeta(editingProc),style:{background:P.rose,border:"none",borderRadius:8,color:P.accent3,cursor:"pointer",padding:"6px 14px",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}},"Salvar"),
        h("button",{onClick:()=>setEditingProc(null),style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text3,cursor:"pointer",padding:"6px 10px",fontSize:12,fontFamily:"'DM Sans',sans-serif"}},"✕")
      ),
      rows.map(r=>{
        const barColor=r.pct>=100?P.green:r.pct>=75?P.accent:r.pct>=50?P.yellow:P.red;
        const isEditing=editingProc===r.proc;
        return h("div",{key:r.proc},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5,gap:8,flexWrap:"wrap"}},
            h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},r.proc),
            isEditing
              ?h("div",{style:{display:"flex",alignItems:"center",gap:6}},
                  h("input",{autoFocus:true,value:inputVal,onChange:e=>setInputVal(e.target.value.replace(/\D/g,"")),onKeyDown:e=>{if(e.key==="Enter")saveMeta(r.proc);if(e.key==="Escape")setEditingProc(null);},style:{width:64,background:P.bg3,border:`1px solid ${P.accent}`,borderRadius:8,padding:"5px 8px",color:P.text,fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none",textAlign:"center"}}),
                  h("span",{style:{fontSize:11,color:P.text3}},"pacientes/mês"),
                  h("button",{onClick:()=>saveMeta(r.proc),style:{background:P.rose,border:"none",borderRadius:6,color:P.accent3,cursor:"pointer",padding:"5px 10px",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}},"✓"),
                  h("button",{onClick:()=>setEditingProc(null),style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,color:P.text3,cursor:"pointer",padding:"5px 8px",fontSize:11,fontFamily:"'DM Sans',sans-serif"}},"✕")
                )
              :h("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}},
                  h("span",{style:{fontSize:12.5,color:barColor,fontWeight:600}},`${r.received} de ${r.meta} paciente${r.meta!==1?"s":""}`),
                  h("span",{style:{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:12,background:r.pct>=100?"rgba(122,173,138,.15)":"rgba(157,119,97,.12)",color:barColor}},`${Math.round(r.pct)}%`),
                  h("button",{onClick:()=>openEdit(r.proc,r.meta),title:"Editar meta",style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:13,padding:2}},"✎"),
                  h("button",{onClick:()=>removeMeta(r.proc),title:"Remover meta",style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:13,padding:2}},"🗑")
                )
          ),
          h("div",{style:{width:"100%",height:7,background:P.bg3,borderRadius:10,overflow:"hidden"}},
            h("div",{style:{width:`${Math.min(r.pct,100)}%`,height:"100%",background:`linear-gradient(90deg,${P.rose},${barColor})`,borderRadius:10,transition:"width .5s cubic-bezier(.4,0,.2,1)"}})
          )
        );
      })
    )
  );
}

// ─── GRÁFICO: EVOLUÇÃO FINANCEIRA (área suave) ───────────────────────────────
function _smoothPath(pts){
  if(pts.length<2)return "";
  let d=`M${pts[0].x},${pts[0].y}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(i-1,0)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(i+2,pts.length-1)];
    const cp1x=p1.x+(p2.x-p0.x)/6,cp1y=p1.y+(p2.y-p0.y)/6;
    const cp2x=p2.x-(p3.x-p1.x)/6,cp2y=p2.y-(p3.y-p1.y)/6;
    d+=` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}
function EvolucaoFinanceiraChart({data}){
  const h=createElement;
  const W=600,H=240,padX=14,padLeft=40,padTop=26,padBot=28;
  const rawMax=Math.max(...data.map(d=>d.value),1);
  // calcula um topo "redondo" para o eixo Y (ex: 20k, 40k, 60k...)
  const tickCount=4;
  const rawStep=rawMax/tickCount;
  const mag=Math.pow(10,Math.floor(Math.log10(Math.max(rawStep,1))));
  const norm=rawStep/mag;
  const niceNorm=norm<=1?1:norm<=2?2:norm<=2.5?2.5:norm<=5?5:10;
  const step=niceNorm*mag;
  const topVal=step*tickCount;
  const ticks=Array.from({length:tickCount+1},(_,i)=>step*i);
  const fmtTick=v=>v===0?"0":(v>=1000?(v/1000)+"k":String(Math.round(v)));
  const yOf=v=>H-padBot-(v/topVal)*(H-padTop-padBot);
  const stepX=data.length>1?(W-padLeft-padX*2)/(data.length-1):0;
  const pts=data.map((d,i)=>({x:padLeft+padX+i*stepX,y:yOf(d.value),v:d.value,label:d.label}));
  const linePath=_smoothPath(pts);
  const areaPath=`${linePath} L${pts[pts.length-1].x},${H-padBot} L${pts[0].x},${H-padBot} Z`;
  return h("svg",{viewBox:`0 0 ${W} ${H}`,style:{width:"100%",height:220,display:"block",overflow:"visible"}},
    h("defs",null,h("linearGradient",{id:"evolFinGrad",x1:"0",y1:"0",x2:"0",y2:"1"},
      h("stop",{offset:"0%",stopColor:P.rose,stopOpacity:.32}),
      h("stop",{offset:"100%",stopColor:P.rose,stopOpacity:0})
    )),
    // ── Linhas horizontais de grade + valores do eixo Y ──
    ticks.map((t,i)=>h(Fragment,{key:"grid"+i},
      h("line",{x1:padLeft,y1:yOf(t),x2:W-padX,y2:yOf(t),stroke:P.border,strokeWidth:1,strokeDasharray:t===0?"none":"3,4"}),
      h("text",{x:padLeft-8,y:yOf(t)+3.5,textAnchor:"end",fontSize:9.5,fill:P.text3},fmtTick(t))
    )),
    h("path",{d:areaPath,fill:"url(#evolFinGrad)",stroke:"none"}),
    h("path",{d:linePath,fill:"none",stroke:P.rose,strokeWidth:2.6,strokeLinecap:"round"}),
    pts.map((p,i)=>h(Fragment,{key:i},
      p.v>0&&h("text",{x:p.x,y:p.y-12,textAnchor:"middle",fontSize:10.5,fontWeight:600,fill:P.rose},fmtCurr(p.v).replace(",00","")),
      h("circle",{cx:p.x,cy:p.y,r:4.2,fill:P.bg2,stroke:P.rose,strokeWidth:2.4}),
      h("text",{x:p.x,y:H-8,textAnchor:"middle",fontSize:10,fill:P.text3},p.label)
    ))
  );
}

function Dashboard({patients,agenda,onNav,onSelectPatient,onScheduleReturn,procedures=[],settings,returnRules,isMobile=false,isTablet=false,goals={},setGoals,incomes=[],expenses=[]}){
  const today=new Date();
  const todayStr=today.toISOString().slice(0,10);
  const todayBirthdays=patients.filter(p=>{if(!p.birthDate)return false;const bd=new Date(p.birthDate+"T12:00");return bd.getMonth()===today.getMonth()&&bd.getDate()===today.getDate();});
  const allS=patients.flatMap(p=>p.sessions||[]);
  const totalRec=allS.filter(s=>s.paid).reduce((a,s)=>a+s.value,0);
  const totalPend=allS.filter(s=>!s.paid).reduce((a,s)=>a+s.value,0);
  const todayAppts=agenda.filter(a=>a.date===todayStr).sort((a,b)=>a.time.localeCompare(b.time));
  // ── Receita real do mês corrente (para a meta) ──
  const curM=today.getMonth(),curY=today.getFullYear();
  const months=[5,4,3,2,1,0].map(off=>{
    let mm=curM-off,yy=curY;while(mm<0){mm+=12;yy--;}
    const inM=d=>{const dt=parseAnyDate(d);return dt&&dt.getMonth()===mm&&dt.getFullYear()===yy;};
    const rec=allS.filter(s=>s.paid&&inM(s.date)).reduce((a,s)=>a+Number(s.value||0),0)
      +(Array.isArray(incomes)?incomes:[]).filter(i=>!i.sessRef&&i.status==="Pago"&&inM(i.date)).reduce((a,i)=>a+Number(i.value||0),0);
    return {label:MONTH_NAMES[mm].slice(0,3),value:rec};
  });
  const inCurMonth=d=>{const dt=parseAnyDate(d);return dt&&dt.getMonth()===curM&&dt.getFullYear()===curY;};
  const totalRecMonth=allS.filter(s=>s.paid&&inCurMonth(s.date)).reduce((a,s)=>a+Number(s.value||0),0)
    +(Array.isArray(incomes)?incomes:[]).filter(i=>!i.sessRef&&i.status==="Pago"&&inCurMonth(i.date)).reduce((a,i)=>a+Number(i.value||0),0);
  const prevMNum=curM===0?11:curM-1,prevMYear=curM===0?curY-1:curY;
  const prevMonthRecDash=allS.filter(s=>s.paid&&(()=>{const dt=parseAnyDate(s.date);return dt&&dt.getMonth()===prevMNum&&dt.getFullYear()===prevMYear;})()).reduce((a,s)=>a+Number(s.value||0),0)
    +(Array.isArray(incomes)?incomes:[]).filter(i=>!i.sessRef&&i.status==="Pago"&&(()=>{const dt=parseAnyDate(i.date);return dt&&dt.getMonth()===prevMNum&&dt.getFullYear()===prevMYear;})()).reduce((a,i)=>a+Number(i.value||0),0);
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
    (()=>{
      const icAcomp=patients.flatMap(p=>(p.intercorrencias||[]).map(ic=>({...ic,patient:p}))).filter(ic=>icStatusOf(ic)==="Em Acompanhamento").sort((a,b)=>(b.date||"").localeCompare(a.date||""));
      if(icAcomp.length===0)return null;
      return h("div",{style:{marginBottom:14,padding:"16px 20px",background:"linear-gradient(135deg,rgba(192,112,112,.13),rgba(192,112,112,.05))",border:"1px solid rgba(192,112,112,.4)",borderRadius:14,boxShadow:"0 2px 16px rgba(192,112,112,.08)"}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:26}},"⚠"),
            h("div",null,
              h("div",{style:{fontSize:14,color:P.red,fontWeight:700,letterSpacing:".02em"}},"Intercorrências em Acompanhamento"),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`${icAcomp.length} caso${icAcomp.length>1?"s":""} clínico${icAcomp.length>1?"s":""} requer${icAcomp.length>1?"em":""} atenção`)
            )
          ),
          h("button",{onClick:()=>onNav("intercorrencias_global"),style:{fontSize:11,color:P.red,background:"rgba(192,112,112,.1)",border:"1px solid rgba(192,112,112,.3)",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"Ver todas →")
        ),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:10}},
          icAcomp.slice(0,4).map(ic=>{
            const sevCfg=IC_SEVERITY_CFG[icSeverityOf(ic)]||IC_SEVERITY_CFG.Leve;
            return h("div",{key:ic.id,onClick:()=>{onSelectPatient(ic.patient);onNav("prontuario");},style:{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:"rgba(192,112,112,.08)",border:"1px solid rgba(192,112,112,.25)",borderRadius:12,cursor:"pointer",flex:"1 1 auto",minWidth:230}},
              h(Avatar,{name:ic.patient.name,size:32,src:ic.patient.profilePhoto}),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:13,color:P.text,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},ic.patient.name),
                h("div",{style:{fontSize:11,color:P.text3,marginTop:1}},`${ic.type} · ${isoToBR(ic.date)||ic.date}`)
              ),
              h("span",{style:{fontSize:9.5,padding:"2px 8px",borderRadius:10,background:sevCfg.bg,color:sevCfg.color,fontWeight:600,flexShrink:0}},icSeverityOf(ic))
            );
          })
        ),
        icAcomp.length>4&&h("div",{style:{fontSize:11,color:P.text3,marginTop:10}},`+ ${icAcomp.length-4} caso(s) adicional(is)...`)
      );
    })(),
    h(RetornosPendentes,{patients,returnRules,onSelectPatient,onNav,onScheduleReturn,mini:true}),
    // KPIs
    h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:isMobile?10:14,marginBottom:22}},
      [{l:"Receita do Mês",v:`R$${(totalRec/1000||48.2).toFixed(1)}k`,sub:"Sessões pagas",c:KPI.green},{l:"Consultas Hoje",v:todayAppts.length,sub:`${todayAppts.filter(a=>a.status==="Realizado").length} realizadas`,c:KPI.purple},{l:"Pacientes Ativos",v:patients.length,sub:"cadastrados",c:KPI.orange},{l:"A Receber",v:fmtCurr(totalPend||6800),sub:"pendências",c:KPI.blue}].map(k=>h(Card,{key:k.l,style:{position:"relative",overflow:"hidden",background:`${k.c}1A`,border:`1px solid ${k.c}40`}},
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:k.c,lineHeight:1}},k.v),
        h("div",{style:{fontSize:11,color:P.text3,marginTop:6}},k.sub),
        h("div",{style:{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:k.c,opacity:.12}})
      ))
    ),
    h("div",{className:"resp-grid-21",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18,alignItems:"start"}},
      setGoals&&h(MetaFaturamento,{received:totalRecMonth,selMonth:curM,selYear:curY,goals:goals||{},setGoals,prevMonthReceived:prevMonthRecDash}),
      setGoals&&h(MetaPorProcedimento,{procedures,patients,selMonth:curM,selYear:curY,goals:goals||{},setGoals,compact:true,onNav})
    ),
    h("div",{className:"resp-grid-21",style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}},
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:16}},"Evolução Financeira"),
        h(EvolucaoFinanceiraChart,{data:months})
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
          h("div",{style:{fontSize:11,color:P.accent,fontWeight:700,minWidth:74}},a.time+(a.duration?"–"+apptEndTime(a):"")),
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

// ─── AGENDA (VERSÃO APRIMORADA) ───────────────────────────────────────────────
// Funcionalidades adicionadas:
//   1. Arrastar agendamento para reagendar (Drag & Drop) nas views Semana e Dia
//   2. Bloqueio de horário — clique duplo em slot vazio (ou botão "Bloquear")
//   3. Clicar num slot vazio abre modal de novo agendamento com hora/data pré-preenchida
//   4. Histórico de reagendamentos registrado no próprio agendamento
//
// INSTRUÇÕES DE INTEGRAÇÃO:
//   • Substitua toda a função Agenda (linhas 1789–1955 do App original) por este código.
//   • Nenhuma outra parte do arquivo precisa ser alterada.
//   • O campo `agenda` agora pode ter itens com { blocked: true, blockReason: "..." }
//     para bloqueios de horário, e { rescheduleHistory: [{from, to, at}] } para histórico.

function Agenda({patients,agenda,setAgenda,procedures,proceduresFull,locations,prefill,onConsumePrefill}){
  const[selDate,setSelDate]=useState(todayISO());
  const[viewMonth,setViewMonth]=useState(()=>{const t=new Date();return{y:t.getFullYear(),m:t.getMonth()};});
  const[viewMode,setViewMode]=useState("month");
  const[showNew,setShowNew]=useState(false);
  const[editItem,setEditItem]=useState(null);
  const[showBlockModal,setShowBlockModal]=useState(false);
  const[blockForm,setBlockForm]=useState({date:"",time:"09:00",endTime:"10:00",reason:""});
  const[showHistoryModal,setShowHistoryModal]=useState(false);
  const[historyAppt,setHistoryAppt]=useState(null);
  // Drag state
  const[dragId,setDragId]=useState(null);
  const[dragOver,setDragOver]=useState(null); // {date, hour} ou null

  const blank={patientName:"",date:selDate,time:"09:00",procedure:procedures[0]||"",location:locations[0]||"",duration:"1 hora",value:"",status:"Confirmado",obs:""};
  const[form,setForm]=useState(blank);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const fvProcedure=v=>{
    const procObj=Array.isArray(proceduresFull)?proceduresFull.find(p=>(typeof p==="string"?p:(p.name||p))===v):null;
    const defVal=procObj&&typeof procObj==="object"&&procObj.defaultValue?procObj.defaultValue:"";
    const defDur=procObj&&typeof procObj==="object"&&procObj.duration?procObj.duration:"";
    setForm(p=>({...p,procedure:v,...(defVal&&!p.value?{value:String(defVal)}:{}),...(defDur?{duration:defDur}:{})}));
  };
  // ── Pré-preenchimento vindo de "Agendar agora" (Retornos Pendentes) ──
  useEffect(()=>{
    if(!prefill)return;
    setEditItem(null);
    setForm({...blank,...prefill});
    setShowNew(true);
    if(prefill.date){
      setSelDate(prefill.date);
      const dt=new Date(prefill.date+"T12:00");
      setViewMonth({y:dt.getFullYear(),m:dt.getMonth()});
    }
    onConsumePrefill&&onConsumePrefill();
  },[prefill]);
  const h=createElement;
  const daysInMonth=new Date(viewMonth.y,viewMonth.m+1,0).getDate();
  const firstDow=new Date(viewMonth.y,viewMonth.m,1).getDay();
  const agendaDates=new Set(agenda.map(a=>a.date));

  function saveAppt(){
    if(editItem)setAgenda(prev=>prev.map(a=>a.id===editItem.id?{...a,...form,value:Number(form.value)||0}:a));
    else setAgenda(prev=>[...prev,{...form,id:Date.now(),value:Number(form.value)||0,rescheduleHistory:[]}]);
    setShowNew(false);setEditItem(null);
  }
  function delAppt(id){if(window.confirm("Excluir este agendamento?"))setAgenda(prev=>prev.filter(a=>a.id!==id));}
  function cycleStatus(id){setAgenda(prev=>prev.map(a=>{if(a.id!==id)return a;const i=APPT_STATUS.indexOf(a.status);return{...a,status:APPT_STATUS[(i+1)%APPT_STATUS.length]};}));}
  function openEdit(a){setEditItem(a);setForm({...a,value:String(a.value||"")});setShowNew(true);}
  function prevMonth(){setViewMonth(v=>{const m=v.m-1<0?11:v.m-1,y=v.m-1<0?v.y-1:v.y;return{y,m};});}
  function nextMonth(){setViewMonth(v=>{const m=v.m+1>11?0:v.m+1,y=v.m+1>11?v.y+1:v.y;return{y,m};});}

  // ── Reagendamento manual (pelo botão 📅) ──
  function rescheduleAppt(a){
    const novaData=window.prompt("Reagendar para qual data? (AAAA-MM-DD)",a.date);
    if(!novaData||!novaData.match(/^\d{4}-\d{2}-\d{2}$/))return;
    const novaHora=window.prompt("Qual horário? (HH:MM)",a.time)||a.time;
    const entry={from:`${a.date} ${a.time}`,to:`${novaData} ${novaHora}`,at:new Date().toLocaleString("pt-BR")};
    setAgenda(prev=>prev.map(ap=>ap.id===a.id
      ?{...ap,date:novaData,time:novaHora,status:"Reagendado",rescheduleHistory:[...(ap.rescheduleHistory||[]),entry]}
      :ap
    ));
    setSelDate(novaData);
  }

  // ── Bloqueio de horário ──
  function saveBlock(){
    const b={id:Date.now(),blocked:true,date:blockForm.date||selDate,time:blockForm.time,endTime:blockForm.endTime,blockReason:blockForm.reason||"Horário bloqueado",patientName:"— Bloqueado —",procedure:"",status:"Cancelado",value:0,location:"",rescheduleHistory:[]};
    setAgenda(prev=>[...prev,b]);
    setShowBlockModal(false);setBlockForm({date:"",time:"09:00",endTime:"10:00",reason:""});
  }

  // ── Drag & Drop ──
  // Usa ref + dataTransfer para evitar closure stale com useState
  const dragIdRef=useRef(null);
  function onDragStart(e,id){
    dragIdRef.current=id;
    setDragId(id);
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text/plain",String(id));
  }
  function onDragEnd(){
    dragIdRef.current=null;
    setDragId(null);setDragOver(null);
  }

  // ── Versões com precisão de 5 minutos (usadas na view Dia) ──
  function minutesToHHMM(totalMin){
    const h=Math.floor(totalMin/60),m=totalMin%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }
  function onClickEmptySlotMin(date,totalMin){
    setEditItem(null);
    setForm({...blank,date,time:minutesToHHMM(totalMin)});
    setShowNew(true);
  }
  function onDblClickSlotMin(date,totalMin){
    setBlockForm({date,time:minutesToHHMM(totalMin),endTime:minutesToHHMM(totalMin+60),reason:""});
    setShowBlockModal(true);
  }
  function onDragOverSlotMin(e,date,totalMin){
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect="move";
    setDragOver({date,minute:totalMin});
  }
  function onDropSlotMin(e,date,totalMin){
    e.preventDefault();
    e.stopPropagation();
    const rawId=e.dataTransfer.getData("text/plain")||String(dragIdRef.current||"");
    const id=Number(rawId);
    if(!id)return;
    const newTime=minutesToHHMM(totalMin);
    setAgenda(prev=>prev.map(a=>{
      if(a.id!==id)return a;
      const entry={from:`${a.date} ${a.time}`,to:`${date} ${newTime}`,at:new Date().toLocaleString("pt-BR")};
      return{...a,date,time:newTime,status:"Reagendado",rescheduleHistory:[...(a.rescheduleHistory||[]),entry]};
    }));
    setSelDate(date);
    dragIdRef.current=null;
    setDragId(null);setDragOver(null);
  }

  const dayAppts=agenda.filter(a=>a.date===selDate).sort((a,b)=>a.time.localeCompare(b.time));
  const getWeekDays=(dateStr)=>{const d=new Date(dateStr+"T12:00");const dow=d.getDay();return Array.from({length:7},(_,i)=>{const nd=new Date(d);nd.setDate(d.getDate()-dow+i);return nd.toISOString().slice(0,10);});};
  const weekDays=getWeekDays(selDate);
  const HOURS=[7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  // ─── Estilos reutilizáveis ───
  const blockBtnStyle={padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:"transparent",border:`1px solid rgba(192,112,112,.35)`,color:P.red};

  // ─── CARD DE AGENDAMENTO (drag) ───
  function ApptCard({a,compact=false,big=false,fitHeight=false}){
    const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
    const isDragging=dragId===a.id;
    if(a.blocked){
      return h("div",{style:{padding:compact?"3px 6px":"6px 10px",background:"rgba(192,112,112,.08)",border:`1px dashed rgba(192,112,112,.4)`,borderRadius:6,opacity:isDragging?.4:1,height:fitHeight?"100%":"auto",overflow:"hidden",boxSizing:"border-box"}},
        h("div",{style:{fontSize:compact?9:11,color:P.red,fontWeight:600}},"🔒 "+(a.blockReason||"Bloqueado")),
        !compact&&h("div",{style:{fontSize:10,color:P.text3}},a.time+(a.endTime?" – "+a.endTime:""))
      );
    }
    const hasHistory=(a.rescheduleHistory||[]).length>0;
    // Duração curta (<45min): card fica baixo, escondemos linhas menos essenciais
    const durMin=durationToMin(a.duration);
    const isShort=fitHeight&&durMin<45;
    const isTiny=fitHeight&&durMin<25;
    return h("div",{
      draggable:true,
      onDragStart:e=>onDragStart(e,a.id),
      onDragEnd,
      onClick:()=>openEdit(a),
      title:"Arraste para reagendar · Clique para editar",
      style:{padding:compact?(big?"8px 11px":"3px 5px"):"6px 10px",background:sc.bg,border:`1px solid ${sc.color}66`,borderLeft:`3px solid ${sc.color}`,borderRadius:6,cursor:"grab",opacity:isDragging?.3:1,userSelect:"none",position:"relative",minHeight:fitHeight?"auto":(compact&&big?56:"auto"),height:fitHeight?"100%":"auto",overflow:"hidden",boxSizing:"border-box"}
    },
      compact
        ?(big
            ?h(Fragment,null,
                h("div",{style:{fontSize:isTiny?11:14,color:sc.color,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},a.time+" — "+a.patientName),
                !isTiny&&h("div",{style:{fontSize:12,color:P.text2,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},a.procedure),
                !isShort&&h("div",{style:{fontSize:10.5,color:P.text3,marginTop:1}},(a.duration?`🕐 ${a.time}–${apptEndTime(a)} · `:"")+"📍 "+a.location)
              )
            :h("div",{style:{fontSize:9,color:sc.color,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},a.time+" "+a.patientName)
          )
        :h(Fragment,null,
            h("div",{style:{fontSize:12,color:sc.color,fontWeight:700}},(a.duration?`${a.time}–${apptEndTime(a)}`:a.time)+" — "+a.patientName),
            h("div",{style:{fontSize:11,color:P.text2}},a.procedure),
            h("div",{style:{fontSize:10,color:P.text3}},"📍 "+a.location),
            hasHistory&&h("div",{style:{fontSize:9,color:"#9b7aad",marginTop:2}},"📅 Reagendado "+((a.rescheduleHistory||[]).length)+"x")
          )
    );
  }

  // ─── COLUNA DE HORAS (view dia/semana) ───
  function HourSlots({date,appts}){
    const STEP=30, STEPS_PH=60/STEP, STEP_PX_W=64/STEPS_PH;
    return h("div",{
      style:{position:"relative"},
      // onDragOver e onDrop no container pai também, para garantir que o drop funcione
      // mesmo quando o cursor passa sobre o card absoluto
      onDragOver:e=>{
        e.preventDefault();
        const rawMin=Math.round(e.nativeEvent.offsetY/STEP_PX_W)*STEP;
        const totalMin=Math.max(7*60,Math.min(20*60+59,7*60+rawMin));
        setDragOver({date,minute:totalMin});
      },
      onDrop:e=>{
        e.preventDefault();
        const rawMin=Math.round(e.nativeEvent.offsetY/STEP_PX_W)*STEP;
        const totalMin=Math.max(7*60,Math.min(20*60+59,7*60+rawMin));
        onDropSlotMin(e,date,totalMin);
      }
    },
      HOURS.map(hr=>
        Array.from({length:STEPS_PH},(_,i)=>{
          const totalMin=hr*60+i*STEP;
          const isOver=dragOver&&dragOver.date===date&&dragOver.minute===totalMin;
          const isHourLine=i===0;
          return h("div",{
            key:hr+"_"+i,
            style:{
              height:STEP_PX_W,
              borderBottom:isHourLine?`1px solid rgba(71,35,37,.2)`:`1px solid rgba(71,35,37,.08)`,
              cursor:"pointer",
              transition:"background .12s",
              background:isOver?"rgba(157,119,97,.18)":"transparent"
            },
            onClick:()=>{ if(!dragIdRef.current) onClickEmptySlotMin(date,totalMin); },
            onDoubleClick:()=>onDblClickSlotMin(date,totalMin),
          });
        })
      ),
      (()=>{
        const byTime={};
        appts.forEach(a=>{ const t=a.time||"09:00"; (byTime[t]=byTime[t]||[]).push(a); });
        return appts.map(a=>{
          const t=a.time||"09:00";
          const group=byTime[t];
          const idx=group.indexOf(a);
          const n=group.length;
          const widthPct=100/n;
          const leftPct=idx*widthPct;
          const [hh,mm]=t.split(":").map(Number);
          const top=(hh-7)*64+(mm/60)*64;
          // Altura proporcional à duração real (início → fim), 64px = 1 hora — sem folga, vai exatamente até o horário final
          const durMin=a.blocked
            ?(()=>{ if(!a.endTime)return 60; const[eh,em]=a.endTime.split(":").map(Number); return Math.max(15,(eh*60+em)-(hh*60+mm)); })()
            :durationToMin(a.duration);
          const height=Math.max(20,(durMin/60)*64);
          return h("div",{key:a.id,style:{position:"absolute",left:`calc(${leftPct}% + 2px)`,width:`calc(${widthPct}% - 4px)`,top,height,zIndex:2,pointerEvents:"none"}},
            h("div",{style:{pointerEvents:"auto",height:"100%"}},
              h(ApptCard,{a,compact:true,big:n===1,fitHeight:true})
            )
          );
        });
      })()
    );
  }

  // ─── COLUNA DE HORAS — VIEW DIA (precisão de 5 em 5 minutos) ───
  const MIN_STEP=5; // granularidade em minutos
  const STEPS_PER_HOUR=60/MIN_STEP; // 12
  const STEP_PX=64/STEPS_PER_HOUR; // px por bloco de 5min
  function HourSlotsDay({date,appts}){
    return h("div",{
      style:{position:"relative"},
      onDragOver:e=>{
        e.preventDefault();
        const rawMin=Math.round(e.nativeEvent.offsetY/STEP_PX)*MIN_STEP;
        const totalMin=Math.max(7*60,Math.min(20*60+59,7*60+rawMin));
        setDragOver({date,minute:totalMin});
      },
      onDrop:e=>{
        e.preventDefault();
        const rawMin=Math.round(e.nativeEvent.offsetY/STEP_PX)*MIN_STEP;
        const totalMin=Math.max(7*60,Math.min(20*60+59,7*60+rawMin));
        onDropSlotMin(e,date,totalMin);
      }
    },
      // Sub-faixas de 5 minutos por hora (12 por hora)
      HOURS.map(hr=>
        Array.from({length:STEPS_PER_HOUR},(_,i)=>{
          const totalMin=hr*60+i*MIN_STEP;
          const isOver=dragOver&&dragOver.date===date&&dragOver.minute===totalMin;
          const isHourLine=i===0;
          return h("div",{
            key:hr+"_"+i,
            style:{
              height:STEP_PX,
              borderBottom:isHourLine?`1px solid rgba(71,35,37,.2)`:`1px solid rgba(71,35,37,.05)`,
              cursor:"pointer",
              transition:"background .1s",
              background:isOver?"rgba(157,119,97,.18)":"transparent"
            },
            onClick:()=>{ if(!dragIdRef.current) onClickEmptySlotMin(date,totalMin); },
            onDoubleClick:()=>onDblClickSlotMin(date,totalMin),
          });
        })
      ),
      (()=>{
        const byTime={};
        appts.forEach(a=>{ const t=a.time||"09:00"; (byTime[t]=byTime[t]||[]).push(a); });
        return appts.map(a=>{
          const t=a.time||"09:00";
          const group=byTime[t];
          const idx=group.indexOf(a);
          const n=group.length;
          const widthPct=100/n;
          const leftPct=idx*widthPct;
          const [hh,mm]=t.split(":").map(Number);
          const top=(hh-7)*64+(mm/60)*64;
          const durMin=a.blocked
            ?(()=>{ if(!a.endTime)return 60; const[eh,em]=a.endTime.split(":").map(Number); return Math.max(15,(eh*60+em)-(hh*60+mm)); })()
            :durationToMin(a.duration);
          const height=Math.max(20,(durMin/60)*64);
          return h("div",{key:a.id,style:{position:"absolute",left:`calc(${leftPct}% + 2px)`,width:`calc(${widthPct}% - 4px)`,top,height,zIndex:2,pointerEvents:"none"}},
            h("div",{style:{pointerEvents:"auto",height:"100%"}},
              h(ApptCard,{a,compact:true,big:n===1,fitHeight:true})
            )
          );
        });
      })()
    );
  }

  return h("div",null,
    // ── Cabeçalho ──
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}},
      h("div",null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:P.text,letterSpacing:".02em",lineHeight:1.1}},"Agenda"),
        h("div",{style:{fontSize:13,color:P.text3,marginTop:5}},`${MONTH_NAMES[viewMonth.m]} ${viewMonth.y}`)
      ),
      h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
        h("button",{onClick:()=>setShowBlockModal(true),style:blockBtnStyle},"🔒 Bloquear Horário"),
        h("button",{onClick:()=>{setEditItem(null);setForm({...blank,date:selDate});setShowNew(true);},style:{padding:"9px 20px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s",background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none"}},"＋ Novo")
      )
    ),

    // ── Toggle de views ──
    h("div",{style:{display:"flex",gap:8,marginBottom:16}},
      [{k:"month",l:"Mês"},{k:"week",l:"Semana"},{k:"day",l:"Dia"}].map(v=>h("button",{key:v.k,onClick:()=>setViewMode(v.k),style:{padding:"6px 16px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewMode===v.k?P.rose:"transparent",border:`1px solid ${viewMode===v.k?P.rose:P.border}`,color:viewMode===v.k?P.accent3:P.text2}},v.l))
    ),

    // ─── VIEW DIA ───────────────────────────────────────────────────────────────
    viewMode==="day"&&h("div",{style:{display:"grid",gridTemplateColumns:"60px 1fr",gap:0,background:P.bg2,borderRadius:12,border:`1px solid ${P.border}`,overflow:"hidden"}},
      // Coluna de horas
      h("div",{style:{borderRight:`1px solid ${P.border}`}},
        h("div",{style:{height:48,borderBottom:`1px solid ${P.border}`}}),
        HOURS.map(hr=>h("div",{key:hr,style:{height:64,borderBottom:`1px solid ${P.border}`,position:"relative",fontSize:10,color:P.text3}},
          h("span",{style:{position:"absolute",top:-6,right:6,background:P.bg2,padding:"0 3px"}},`${String(hr).padStart(2,"0")}:00`),
          [15,30,45].map(m=>h("span",{key:m,style:{position:"absolute",top:(m/60)*64-5,right:6,fontSize:8.5,color:P.text3,opacity:.55}},`:${m}`))
        ))
      ),
      // Coluna do dia
      h("div",null,
        h("div",{style:{height:48,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:8}},
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()-1);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:26,height:26,color:P.text2,cursor:"pointer",fontSize:13}},"‹"),
          h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,flex:1,textAlign:"center"}},new Date(selDate+"T12:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})),
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()+1);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:26,height:26,color:P.text2,cursor:"pointer",fontSize:13}},"›")
        ),
        h(HourSlotsDay,{date:selDate,appts:agenda.filter(a=>a.date===selDate)})
      )
    ),

    // ─── VIEW SEMANA ────────────────────────────────────────────────────────────
    viewMode==="week"&&h("div",{style:{background:P.bg2,borderRadius:12,border:`1px solid ${P.border}`,overflow:"hidden"}},
      // Cabeçalho da semana
      h("div",{style:{display:"grid",gridTemplateColumns:"60px repeat(7,1fr)",borderBottom:`1px solid ${P.border}`}},
        h("div",{style:{padding:"12px 4px",display:"flex",alignItems:"center",justifyContent:"space-between",borderRight:`1px solid ${P.border}`,gap:2}},
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()-7);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:14,padding:0}},"‹"),
          h("button",{onClick:()=>{const d=new Date(selDate+"T12:00");d.setDate(d.getDate()+7);setSelDate(d.toISOString().slice(0,10));},style:{background:"transparent",border:"none",color:P.text3,cursor:"pointer",fontSize:14,padding:0}},"›")
        ),
        weekDays.map(ds=>{
          const isToday=ds===todayISO(),isSel=ds===selDate;
          const d=new Date(ds+"T12:00");
          return h("div",{key:ds,onClick:()=>setSelDate(ds),style:{padding:"10px 4px",textAlign:"center",borderRight:`1px solid ${P.border}`,cursor:"pointer",background:isSel?P.rose:isToday?"rgba(157,119,97,.1)":"transparent"}},
            h("div",{style:{fontSize:9.5,color:isSel?P.accent3:P.text3,textTransform:"uppercase",letterSpacing:".08em"}},["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:isSel?P.accent3:isToday?P.accent:P.text,marginTop:2}},d.getDate())
          );
        })
      ),
      // Grade de horas × dias
      h("div",{style:{display:"grid",gridTemplateColumns:"60px repeat(7,1fr)"}},
        // Coluna de horas
        h("div",{style:{borderRight:`1px solid ${P.border}`}},
          HOURS.map(hr=>h("div",{key:hr,style:{height:64,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:4,fontSize:9.5,color:P.text3}},`${String(hr).padStart(2,"0")}:00`))
        ),
        // Colunas dos dias
        weekDays.map(ds=>h("div",{key:ds,style:{borderRight:`1px solid ${P.border}`,position:"relative"}},
          h(HourSlots,{date:ds,appts:agenda.filter(a=>a.date===ds)})
        ))
      )
    ),

    // ─── VIEW MÊS ───────────────────────────────────────────────────────────────
    viewMode==="month"&&h("div",{style:{display:"grid",gridTemplateColumns:"1fr 320px",gap:18}},
      h("div",{style:{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:20}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},`${MONTH_NAMES[viewMonth.m]} ${viewMonth.y}`),
          h("div",{style:{display:"flex",gap:6}},
            h("button",{onClick:prevMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"‹"),
            h("button",{onClick:nextMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"›")
          )
        ),
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}},
          ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=>h("div",{key:d,style:{textAlign:"center",fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",paddingBottom:6}},d))
        ),
        h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}},
          [...Array(firstDow).fill(null).map((_,i)=>h("div",{key:"e"+i})),
          ...Array(daysInMonth).fill(null).map((_,i)=>{
            const d=i+1,ds=`${viewMonth.y}-${String(viewMonth.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const isSel=ds===selDate,hasApp=agendaDates.has(ds),isToday=ds===todayISO();
            const apptCount=agenda.filter(a=>a.date===ds&&!a.blocked).length;
            const blockCount=agenda.filter(a=>a.date===ds&&a.blocked).length;
            return h("div",{key:d,
              onClick:()=>setSelDate(ds),
              onDoubleClick:()=>{setSelDate(ds);setBlockForm({date:ds,time:"09:00",endTime:"10:00",reason:""});setShowBlockModal(true);},
              title:"Clique para ver · Duplo clique para bloquear",
              style:{textAlign:"center",padding:"9px 2px",borderRadius:8,cursor:"pointer",fontSize:13,position:"relative",color:isSel?P.accent3:hasApp?P.text:P.text3,background:isSel?`linear-gradient(135deg,${P.rose},${P.gold})`:"transparent",border:`1px solid ${isToday&&!isSel?"rgba(157,119,97,.4)":"transparent"}`}},
              d,
              apptCount>0&&!isSel&&h("div",{style:{width:4,height:4,borderRadius:"50%",background:P.rose,position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)"}}),
              blockCount>0&&h("div",{style:{width:4,height:4,borderRadius:"50%",background:P.red,position:"absolute",bottom:3,left:blockCount>0&&apptCount>0?"calc(50% + 4px)":"50%",transform:"translateX(-50%)"}})
            );
          })]
        )
      ),
      // Painel lateral do dia selecionado
      h("div",{style:{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:20}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},new Date(selDate+"T12:00").toLocaleDateString("pt-BR",{day:"numeric",month:"short"})),
          h("span",{style:{fontSize:12,color:P.text3}},`${dayAppts.filter(a=>!a.blocked).length} consulta(s)`)
        ),
        dayAppts.length===0
          ?h("div",{style:{color:P.text3,fontSize:13,textAlign:"center",padding:24}},"Nenhuma consulta.")
          :dayAppts.map(a=>{
            const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
            const hasHistory=(a.rescheduleHistory||[]).length>0;
            if(a.blocked){
              return h("div",{key:a.id,style:{padding:"10px 12px",marginBottom:8,background:"rgba(192,112,112,.06)",borderRadius:9,border:`1px dashed rgba(192,112,112,.3)`}},
                h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
                  h("div",null,
                    h("div",{style:{fontSize:12,color:P.red,fontWeight:600}},"🔒 "+a.time+(a.endTime?" – "+a.endTime:"")),
                    h("div",{style:{fontSize:11,color:P.text3}},a.blockReason||"Horário bloqueado")
                  ),
                  h("button",{onClick:()=>delAppt(a.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
                )
              );
            }
            return h("div",{key:a.id,style:{padding:"10px 12px",marginBottom:8,background:P.bg3,borderRadius:9,border:`1px solid ${P.border}`}},
              h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6}},
                h("div",{style:{fontSize:11,color:P.accent,fontWeight:700,minWidth:74}},a.time+(a.duration?" – "+apptEndTime(a):"")),
                h("div",{style:{flex:1}},
                  h("div",{style:{display:"flex",alignItems:"center",gap:6}},
                    h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},a.patientName),
                    hasHistory&&h("button",{
                      onClick:()=>{setHistoryAppt(a);setShowHistoryModal(true);},
                      title:"Ver histórico de reagendamentos",
                      style:{fontSize:9,color:"#9b7aad",background:"rgba(155,122,173,.12)",border:"1px solid rgba(155,122,173,.25)",borderRadius:10,padding:"1px 6px",cursor:"pointer"}
                    },"📅 "+((a.rescheduleHistory||[]).length)+"x")
                  ),
                  h("div",{style:{fontSize:11,color:P.text3}},a.procedure),
                  h("div",{style:{fontSize:10,color:P.text3}},"📍 "+a.location)
                )
              ),
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("button",{onClick:()=>cycleStatus(a.id),style:{fontSize:10,padding:"3px 8px",borderRadius:12,color:sc.color,background:sc.bg,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"↻ "+a.status),
                h("div",{style:{display:"flex",gap:5}},
                  h("button",{onClick:()=>openEdit(a),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
                  h("button",{onClick:()=>rescheduleAppt(a),title:"Reagendar",style:{fontSize:11,color:"#9b7aad",background:"transparent",border:"1px solid rgba(155,122,173,.3)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"📅"),
                  h("button",{onClick:()=>delAppt(a.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
                )
              )
            );
          }),
        h("button",{onClick:()=>{setEditItem(null);setForm({...blank,date:selDate});setShowNew(true);},style:{width:"100%",marginTop:6,padding:"8px",borderRadius:8,border:`1px dashed ${P.border}`,background:"transparent",color:P.text3,cursor:"pointer",fontSize:12}},"＋ Agendar neste dia")
      )
    ),

    // ─── MODAL: NOVO / EDITAR AGENDAMENTO ───────────────────────────────────────
    h(Modal,{open:showNew,onClose:()=>{setShowNew(false);setEditItem(null);},title:editItem?"✎ Editar Agendamento":"✦ Novo Agendamento",width:540},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Paciente"},h(PatientAutocomplete,{value:form.patientName,onChange:(name,pat)=>{if(pat){setForm(p=>({...p,patientName:name,procedure:pat.sessions&&pat.sessions.length>0?pat.sessions[0].procedure:p.procedure,location:pat.sessions&&pat.sessions.length>0?pat.sessions[0].location:p.location}));}else{setForm(p=>({...p,patientName:name}));}},patients})),
        h(Field,{label:"Procedimento"},h(Sel,{value:form.procedure,onChange:fvProcedure,options:procedures})),
        h(Field,{label:"Data",half:true},h(Inp,{type:"date",value:form.date,onChange:fv("date")})),
        h(Field,{label:"Horário",half:true},h(Inp,{type:"time",value:form.time,onChange:fv("time")})),
        h(Field,{label:"Local",half:true},h(Sel,{value:form.location,onChange:fv("location"),options:locations})),
        h(Field,{label:"Duração",half:true},h(Sel,{value:form.duration,onChange:fv("duration"),options:["15 min","30 min","45 min","1 hora","1h30","2 horas","2h30","3 horas"]})),
        h(Field,{label:"Horário Final"},h("div",{style:{...IS,display:"flex",alignItems:"center",background:P.bg3,color:P.text2,cursor:"default"}},
          form.time?`${form.time} — ${apptEndTime(form)}`:"—"
        )),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:form.value,onChange:fv("value"),placeholder:"0,00"})),
        h(Field,{label:"Status",half:true},h(Sel,{value:form.status,onChange:fv("status"),options:APPT_STATUS})),
        h(Field,{label:"Observações"},h(TA,{value:form.obs,onChange:fv("obs"),placeholder:"Anotações, avisos...",rows:2}))
      ),
      editItem&&(editItem.rescheduleHistory||[]).length>0&&h("div",{style:{marginTop:14,padding:"10px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},"Histórico de Reagendamentos"),
        (editItem.rescheduleHistory||[]).map((r,i)=>h("div",{key:i,style:{fontSize:11,color:P.text3,padding:"3px 0",borderBottom:`1px solid ${P.border}`}},
          `#${i+1} · De ${r.from} → Para ${r.to} · ${r.at}`
        ))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowNew(false);setEditItem(null);}},"Cancelar"),
        h(Btn,{onClick:saveAppt},editItem?"Salvar Alterações":"Confirmar")
      )
    ),

    // ─── MODAL: BLOQUEAR HORÁRIO ────────────────────────────────────────────────
    h(Modal,{open:showBlockModal,onClose:()=>setShowBlockModal(false),title:"🔒 Bloquear Horário",width:440},
      h("div",{style:{marginBottom:12,fontSize:13,color:P.text3}},"Bloqueios aparecem na agenda e impedem o agendamento visual neste intervalo."),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Data"},h(Inp,{type:"date",value:blockForm.date||selDate,onChange:v=>setBlockForm(p=>({...p,date:v}))})),
        h(Field,{label:"Das",half:true},h(Inp,{type:"time",value:blockForm.time,onChange:v=>setBlockForm(p=>({...p,time:v}))})),
        h(Field,{label:"Até",half:true},h(Inp,{type:"time",value:blockForm.endTime,onChange:v=>setBlockForm(p=>({...p,endTime:v}))})),
        h(Field,{label:"Motivo (opcional)"},h(Inp,{value:blockForm.reason,onChange:v=>setBlockForm(p=>({...p,reason:v})),placeholder:"Ex: Curso, Almoço, Reunião..."}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},
        h(Btn,{variant:"ghost",onClick:()=>setShowBlockModal(false)},"Cancelar"),
        h(Btn,{onClick:saveBlock},"Bloquear")
      )
    ),

    // ─── MODAL: HISTÓRICO DE REAGENDAMENTOS ─────────────────────────────────────
    h(Modal,{open:showHistoryModal,onClose:()=>setShowHistoryModal(false),title:"📅 Histórico de Reagendamentos",width:480},
      historyAppt&&h("div",null,
        h("div",{style:{marginBottom:14,padding:"10px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
          h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},historyAppt.patientName),
          h("div",{style:{fontSize:12,color:P.text3}},historyAppt.procedure)
        ),
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}},"Histórico completo"),
        (historyAppt.rescheduleHistory||[]).length===0
          ?h("div",{style:{fontSize:13,color:P.text3,textAlign:"center",padding:16}},"Nenhum reagendamento registrado.")
          :(historyAppt.rescheduleHistory||[]).map((r,i)=>h("div",{key:i,style:{padding:"10px 14px",marginBottom:8,background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
              h("div",{style:{fontSize:11,color:P.text3,marginBottom:4}},"Reagendamento #"+(i+1)+" · "+r.at),
              h("div",{style:{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}},
                h("span",{style:{fontSize:12,color:P.red,background:"rgba(192,112,112,.1)",padding:"2px 8px",borderRadius:6}},"De: "+r.from),
                h("span",{style:{fontSize:14,color:P.text3}},"→"),
                h("span",{style:{fontSize:12,color:P.green,background:"rgba(122,173,138,.1)",padding:"2px 8px",borderRadius:6}},"Para: "+r.to)
              )
            ))
      ),
      h("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:12}},
        h(Btn,{variant:"ghost",onClick:()=>setShowHistoryModal(false)},"Fechar")
      )
    )
  );
}
// ─── INTERCORRÊNCIA CARD (usado no prontuário do paciente e no painel global) ──
function IntercorrenciaCard({ic,patient,setPatients,showPatientName=false,onSelectPatient,onNav}){
  const h=createElement;
  const[showEvo,setShowEvo]=useState(false);
  const[evoText,setEvoText]=useState("");
  const[showCond,setShowCond]=useState(false);
  const[condText,setCondText]=useState("");
  const sevCfg=IC_SEVERITY_CFG[icSeverityOf(ic)]||IC_SEVERITY_CFG.Leve;
  const stCfg=IC_STATUS_CFG[icStatusOf(ic)]||IC_STATUS_CFG["Em Acompanhamento"];
  const evolutions=icEvolutionsOf(ic);
  const conducts=icConductsOf(ic);
  function addEvo(){
    if(!evoText.trim())return;
    updateIntercorrencia(setPatients,patient.id,ic.id,old=>({...old,evolutions:[...(old.evolutions||[]),{id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),text:evoText.trim()}]}));
    setEvoText("");setShowEvo(false);
  }
  function addCond(){
    if(!condText.trim())return;
    updateIntercorrencia(setPatients,patient.id,ic.id,old=>{
      const base=old.conducts&&old.conducts.length?old.conducts:(old.conduct?[{id:"legacy_c",date:old.date,text:old.conduct}]:[]);
      return{...old,conducts:[...base,{id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),text:condText.trim()}]};
    });
    setCondText("");setShowCond(false);
  }
  function changeStatus(v){updateIntercorrencia(setPatients,patient.id,ic.id,old=>({...old,status:v}));}
  function changeReaval(v){updateIntercorrencia(setPatients,patient.id,ic.id,old=>({...old,nextReavaliacao:v}));}
  function addPhotos(files){
    const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({id:Date.now()+Math.random(),name:f.name,url:e.target.result});r.readAsDataURL(f);}));
    Promise.all(readers).then(news=>{updateIntercorrencia(setPatients,patient.id,ic.id,old=>({...old,photos:[...(old.photos||[]),...news]}));});
  }
  function removePhoto(fid){updateIntercorrencia(setPatients,patient.id,ic.id,old=>({...old,photos:(old.photos||[]).filter(ph=>ph.id!==fid)}));}
  return h(Card,{style:{marginBottom:14,border:`1px solid ${sevCfg.color}33`}},
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:8}},
      h("div",null,
        showPatientName&&h("div",{onClick:()=>{onSelectPatient(patient);onNav("prontuario");},style:{fontSize:12.5,color:P.rose2,fontWeight:600,cursor:"pointer",marginBottom:3}},`👤 ${patient.name}`),
        h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}},isoToBR(ic.date)||ic.date),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},ic.type)
      ),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}},
        h("span",{style:{fontSize:10,padding:"3px 9px",borderRadius:12,background:sevCfg.bg,color:sevCfg.color,fontWeight:600}},icSeverityOf(ic)),
        h("select",{value:icStatusOf(ic),onChange:e=>changeStatus(e.target.value),style:{fontSize:10.5,padding:"3px 8px",borderRadius:12,background:stCfg.bg,color:stCfg.color,border:`1px solid ${stCfg.color}55`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},IC_STATUS_LIST.map(st=>h("option",{key:st,value:st},st)))
      )
    ),
    (ic.procedure||ic.product||ic.region)&&h("div",{style:{display:"flex",gap:14,flexWrap:"wrap",fontSize:12,color:P.text2,marginBottom:8,padding:"8px 12px",background:P.bg3,borderRadius:8}},
      ic.procedure&&h("span",null,"💉 ",h("strong",{style:{color:P.text}},ic.procedure)),
      ic.product&&h("span",null,"🧪 ",h("strong",{style:{color:P.text}},ic.product)),
      ic.region&&h("span",null,"🎯 ",h("strong",{style:{color:P.text}},ic.region)),
      ic.procedureDate&&h("span",null,"📅 Procedimento: ",h("strong",{style:{color:P.text}},isoToBR(ic.procedureDate)))
    ),
    ic.notes&&h("div",{style:{fontSize:13,color:P.text2,marginBottom:10,lineHeight:1.6}},ic.notes),
    // Fotos
    h("div",{style:{marginBottom:10}},
      h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6}},
        h("span",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em"}},"Fotos"),
        h("label",{style:{fontSize:10.5,color:P.accent,border:`1px solid ${P.border}`,borderRadius:6,padding:"2px 8px",cursor:"pointer"}},"📷 Adicionar",h("input",{type:"file",accept:"image/*",multiple:true,style:{display:"none"},onChange:e=>{addPhotos([...e.target.files]);e.target.value="";}}))
      ),
      (ic.photos||[]).length===0?h("div",{style:{fontSize:11.5,color:P.text3}},"Nenhuma foto anexada."):
      h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},(ic.photos||[]).map(ph=>h("div",{key:ph.id,style:{position:"relative"}},
        h("img",{src:ph.url,alt:ph.name,style:{width:58,height:58,objectFit:"cover",borderRadius:6,border:`1px solid ${P.border}`}}),
        h("button",{onClick:()=>removePhoto(ph.id),style:{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:P.red,color:"#fff",border:"none",fontSize:10,cursor:"pointer",lineHeight:"18px"}},"✕")
      )))
    ),
    // Histórico de evolução
    h("div",{style:{marginBottom:10,paddingTop:8,borderTop:`1px solid ${P.border}`}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
        h("span",{style:{fontSize:9.5,color:P.accent,textTransform:"uppercase",letterSpacing:".1em"}},"Histórico de Evolução"),
        h("button",{onClick:()=>setShowEvo(s=>!s),style:{fontSize:10.5,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"2px 8px",cursor:"pointer"}},showEvo?"✕":"＋ Evolução")
      ),
      showEvo&&h("div",{style:{display:"flex",gap:6,marginBottom:8}},
        h(TA,{value:evoText,onChange:setEvoText,placeholder:"Descreva a evolução do quadro...",rows:2}),
        h(Btn,{onClick:addEvo,style:{flexShrink:0,alignSelf:"flex-end"}},"Salvar")
      ),
      evolutions.length===0?h("div",{style:{fontSize:11.5,color:P.text3}},"Sem registros de evolução ainda."):
      h("div",{style:{display:"flex",flexDirection:"column",gap:6}},evolutions.map((e,i)=>h("div",{key:e.id||i,style:{background:P.bg3,borderRadius:8,padding:"7px 10px"}},
        h("div",{style:{fontSize:9.5,color:P.text3,marginBottom:2}},e.date),
        h("div",{style:{fontSize:12.5,color:P.text2}},e.text)
      )))
    ),
    // Histórico de condutas
    h("div",{style:{marginBottom:10,paddingTop:8,borderTop:`1px solid ${P.border}`}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
        h("span",{style:{fontSize:9.5,color:P.green,textTransform:"uppercase",letterSpacing:".1em"}},"Condutas Realizadas"),
        h("button",{onClick:()=>setShowCond(s=>!s),style:{fontSize:10.5,color:P.green,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"2px 8px",cursor:"pointer"}},showCond?"✕":"＋ Conduta")
      ),
      showCond&&h("div",{style:{display:"flex",gap:6,marginBottom:8}},
        h(TA,{value:condText,onChange:setCondText,placeholder:"O que foi feito...",rows:2}),
        h(Btn,{onClick:addCond,style:{flexShrink:0,alignSelf:"flex-end"}},"Salvar")
      ),
      conducts.length===0?h("div",{style:{fontSize:11.5,color:P.text3}},"Sem condutas registradas ainda."):
      h("div",{style:{display:"flex",flexDirection:"column",gap:6}},conducts.map((c,i)=>h("div",{key:c.id||i,style:{background:"rgba(122,173,138,.07)",border:"1px solid rgba(122,173,138,.18)",borderRadius:8,padding:"7px 10px"}},
        h("div",{style:{fontSize:9.5,color:P.text3,marginBottom:2}},c.date),
        h("div",{style:{fontSize:12.5,color:P.text2}},"✓ "+c.text)
      )))
    ),
    // Próxima reavaliação
    h("div",{style:{display:"flex",alignItems:"center",gap:8,paddingTop:8,borderTop:`1px solid ${P.border}`}},
      h("span",{style:{fontSize:11,color:P.text3,whiteSpace:"nowrap"}},"📆 Próxima reavaliação:"),
      h("input",{type:"date",value:ic.nextReavaliacao||"",onChange:e=>changeReaval(e.target.value),style:{fontSize:12,padding:"4px 8px",borderRadius:6,background:P.bg3,border:`1px solid ${P.border}`,color:P.text,fontFamily:"'DM Sans',sans-serif"}})
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
  }).sort((a,b)=>a.name.localeCompare(b.name,"pt-BR",{sensitivity:"base"}));
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
              h(StatusBadge,{status:p._autoStatus||p.status}),
              h(LoyaltyBadge,{patient:p,allPatients:patients,size:"sm"})
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
// ─── AGENDA APPT ROW (usado na aba Agenda do prontuário) ─────────────────────
function AgendaApptRow({a,setAgenda,patient,patients,setPatients,procedures,locations}){
  const h=createElement;
  const[open,setOpen]=useState(false);
  const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
  const hasHistory=(a.rescheduleHistory||[]).length>0;
  const apptDate=new Date((a.date||"")+"T"+(a.time||"00:00"));
  const isUpcoming=apptDate>=new Date();

  function cycleStatus(){
    if(!setAgenda)return;
    setAgenda(prev=>prev.map(ap=>{
      if(ap.id!==a.id)return ap;
      const i=APPT_STATUS.indexOf(ap.status);
      return{...ap,status:APPT_STATUS[(i+1)%APPT_STATUS.length]};
    }));
  }

  function reschedule(){
    const novaData=window.prompt("Reagendar para qual data? (AAAA-MM-DD)",a.date);
    if(!novaData||!novaData.match(/^\d{4}-\d{2}-\d{2}$/))return;
    const novaHora=window.prompt("Qual horário? (HH:MM)",a.time)||a.time;
    const entry={from:`${a.date} ${a.time}`,to:`${novaData} ${novaHora}`,at:new Date().toLocaleString("pt-BR")};
    if(setAgenda){
      setAgenda(prev=>prev.map(ap=>ap.id!==a.id?ap:{...ap,date:novaData,time:novaHora,status:"Reagendado",rescheduleHistory:[...(ap.rescheduleHistory||[]),entry]}));
    }
  }

  return h("div",{style:{marginBottom:10,background:P.bg3,border:`1px solid ${isUpcoming?"rgba(122,174,212,.3)":P.border}`,borderRadius:10,overflow:"hidden"}},
    // Linha principal
    h("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",flexWrap:"wrap"}},
      // Indicador de status
      h("div",{style:{width:4,alignSelf:"stretch",background:sc.color,borderRadius:2,flexShrink:0}}),
      // Data/hora
      h("div",{style:{minWidth:90,flexShrink:0}},
        h("div",{style:{fontSize:13,color:P.accent,fontWeight:700}},apptDate.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})),
        h("div",{style:{fontSize:11,color:P.text3}},a.duration?`${a.time} — ${apptEndTime(a)}`:a.time)
      ),
      // Procedimento e local
      h("div",{style:{flex:1,minWidth:120}},
        h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},a.procedure||"—"),
        a.location&&h("div",{style:{fontSize:11,color:P.text3}},"📍 "+a.location),
        a.obs&&h("div",{style:{fontSize:11,color:P.text3,fontStyle:"italic",marginTop:2}},a.obs)
      ),
      // Status badge
      h("button",{onClick:cycleStatus,title:"Clique para mudar status",style:{fontSize:10,padding:"3px 10px",borderRadius:12,color:sc.color,background:sc.bg,border:"none",cursor:setAgenda?"pointer":"default",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}},"↻ "+a.status),
      // Valor (se houver)
      a.value>0&&h("div",{style:{fontSize:13,color:P.text2,fontFamily:"'Cormorant Garamond',serif",whiteSpace:"nowrap"}},fmtCurr(a.value)),
      // Ações
      h("div",{style:{display:"flex",gap:5,flexShrink:0}},
        setAgenda&&h("button",{onClick:reschedule,title:"Reagendar",style:{fontSize:11,color:"#9b7aad",background:"transparent",border:"1px solid rgba(155,122,173,.3)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"📅"),
        hasHistory&&h("button",{onClick:()=>setOpen(v=>!v),style:{fontSize:11,color:"#9b7aad",background:"rgba(155,122,173,.08)",border:"1px solid rgba(155,122,173,.25)",borderRadius:6,padding:"3px 8px",cursor:"pointer"}},open?"▲ Histórico":"▼ Histórico ("+(a.rescheduleHistory||[]).length+"x)")
      )
    ),
    // Histórico de reagendamentos (expansível)
    open&&hasHistory&&h("div",{style:{borderTop:`1px solid ${P.border}`,padding:"10px 14px 12px 28px",background:"rgba(155,122,173,.04)"}},
      h("div",{style:{fontSize:9.5,color:"#9b7aad",textTransform:"uppercase",letterSpacing:".12em",fontWeight:600,marginBottom:8}},"Histórico de Reagendamentos"),
      (a.rescheduleHistory||[]).map((r,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"5px 0",borderBottom:`1px solid ${P.border}`}},
        h("span",{style:{fontSize:10,color:P.text3,minWidth:30}},"#"+(i+1)),
        h("span",{style:{fontSize:11,color:P.red,background:"rgba(192,112,112,.1)",padding:"2px 8px",borderRadius:6,whiteSpace:"nowrap"}},"De: "+r.from),
        h("span",{style:{fontSize:12,color:P.text3}},"→"),
        h("span",{style:{fontSize:11,color:P.green,background:"rgba(122,173,138,.1)",padding:"2px 8px",borderRadius:6,whiteSpace:"nowrap"}},"Para: "+r.to),
        h("span",{style:{fontSize:10,color:P.text3,marginLeft:"auto",whiteSpace:"nowrap"}},r.at)
      ))
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

// Reúne todas as fotos já disponíveis da paciente (perfil + fotos de sessões) para usar como base no Planejamento com Marcadores
function getPatientPhotoGallery(patient){
  const list=[];
  if(patient.profilePhoto)list.push({url:patient.profilePhoto,label:"Foto de perfil"});
  (patient.sessions||[]).forEach(s=>{
    (s.photos||[]).forEach(p=>{
      const url=typeof p==="string"?p:p.url;
      if(url)list.push({url,label:(s.date||"")+" · "+(s.procedure||"")});
    });
  });
  return list;
}
function PatientDetail({patient,patients,setPatients,onBack,procedures,proceduresFull,locations,products,setProducts,allProducts,returnRules,setIncomes,onSelectPatient,skincareConfig,vouchers,setVouchers,onNavVouchers,voucherTemplates,clinicSettings,agenda,setAgenda}){
  const _vTemplates=Array.isArray(voucherTemplates)&&voucherTemplates.length?voucherTemplates:DEFAULT_VOUCHER_TEMPLATES;
  const[tab,setTab]=useState("prontuario");
  const[showNewS,setShowNewS]=useState(false);
  const[pFilterProc,setPFilterProc]=useState("Todos");
  const[pFilterYear,setPFilterYear]=useState("Todos");
  const[pFilterMonth,setPFilterMonth]=useState("Todos");
  const[pFilterRegion,setPFilterRegion]=useState("Todas");
  const[icFilterSev,setIcFilterSev]=useState("Todas");
  const[icFilterStatus,setIcFilterStatus]=useState("Todos");
  const[icFilterProc,setIcFilterProc]=useState("Todos");
  const[icFilterProd,setIcFilterProd]=useState("Todos");
  const[editSess,setEditSess]=useState(null);
  const[markerPlanning,setMarkerPlanning]=useState(null); // null | "new" | planObj (planejamento com marcadores)
  const[markerPlanningForSession,setMarkerPlanningForSession]=useState(null); // sessId quando o markerPlanning "new" deve nascer já vinculado a uma sessão
  const patientPhotoGallery=useMemo(()=>getPatientPhotoGallery(patient),[patient.profilePhoto,patient.sessions]);
  const mapPlans=useMemo(()=>(patient.planejamento||[]).filter(pl=>pl.markerPlan),[patient.planejamento]);
  const mapPlanBySession=useMemo(()=>{
    const idx={};
    mapPlans.forEach(pl=>{ if(pl.sessionId) idx[pl.sessionId]=pl; });
    return idx;
  },[mapPlans]);
  // Abre o mapa com foto vinculado a uma sessão: se já existe, edita; senão, cria novo já amarrado a essa sessão.
  function openMapForSession(sess){
    const existing=mapPlanBySession[sess.id];
    if(existing){ setMarkerPlanning(existing); }
    else { setMarkerPlanningForSession(sess.id); setMarkerPlanning("new"); }
  }
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
  const[showQuickVoucher,setShowQuickVoucher]=useState(false);
  const[generatingDossie,setGeneratingDossie]=useState(false);
  async function handleGenerateDossie(){
    setGeneratingDossie(true);
    try{ await generatePatientDossier(patient,{products,settings:clinicSettings||{}}); }
    catch(e){ alert(e.message||"Erro ao gerar o dossiê. Tente novamente."); }
    finally{ setGeneratingDossie(false); }
  }
  const blankQV={template:"classico",fromName:"",message:"",validUntil:"",type:"valor",value:"",procedures:[],procInput:""};
  const[qvForm,setQvForm]=useState(blankQV);
  const qvfv=k=>v=>setQvForm(p=>({...p,[k]:v}));
  const h=createElement;
  const today=new Date();
  const blankS={date:"",procedure:procedures[0]||"",product:products[0]||"",dose:"",region:"",location:locations[0]||"",value:"",payMethod:"Pix",parcelas:"1",finStatus:"Pendente",paid:false,notes:"",evolution:"",returnReminderDays:14,loteId:"",qtdUsada:"",skipAutoInsumos:false};
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
  const blankIc={type:"Edema",severity:"Leve",status:"Em Acompanhamento",procedure:"",product:"",region:"",procedureDate:"",date:todayISO(),notes:"",conduct:"",nextReavaliacao:"",sessId:null,_photoFiles:[]};
  const[icForm,setIcForm]=useState(blankIc);
  const icfv=k=>v=>setIcForm(p=>({...p,[k]:v}));
  const[planForm,setPlanForm]=useState({title:"",steps:"",notes:""});
  const totalSpent=(patient.sessions||[]).reduce((a,s)=>a+s.value,0);
  const tabs=[{k:"prontuario",l:"📋 Prontuário"},{k:"fichaRapida",l:"⚡ Ficha Rápida"},{k:"agendaPaciente",l:"📅 Agenda"},{k:"orcamentos",l:"💼 Orçamentos"},{k:"mapa",l:"🗺 Mapa"},{k:"intercorrencias",l:"⚠ Intercorr."},{k:"planejamento",l:"🎯 Planejamento"},{k:"anamnese",l:"📄 Anamnese"},{k:"galeria",l:"🖼 Fotos"},{k:"docs",l:"📎 Docs"},{k:"pacotes",l:"📦 Pacotes"},{k:"financeiro",l:"💰 Financeiro"},{k:"skincare",l:"🧴 Skincare"},{k:"indicacoes",l:"🤝 Indicações"}];
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
    const s={id:editSess?editSess.id:Date.now(),date:sForm.date||new Date().toLocaleDateString("pt-BR"),procedure:sForm.procedure,doctor:"Dra. Sofia",product:sForm.product,loteId:sForm.loteId||"",loteCodigo:_loteSel?.codigo||"",qtdUsada:sForm.qtdUsada||"",dose:sForm.dose,region:sForm.region,location:sForm.location,value:Number(sForm.value)||0,paid:sForm.finStatus==="Pago",finStatus:sForm.finStatus,payMethod:sForm.payMethod,parcelas:sForm.payMethod==="Cartão Crédito"?Number(sForm.parcelas)||1:1,notes:sForm.notes,evolution:sForm.evolution,faceMap:editSess?editSess.faceMap:null,photos:editSess?editSess.photos:[],docs:editSess?editSess.docs:[],intercorrencias:editSess?editSess.intercorrencias:[],returnReminderDays:Number(sForm.returnReminderDays)||90,stockDebit:editSess?editSess.stockDebit:null,autoStockDebits:editSess?editSess.autoStockDebits:[]};
    // Ajusta o débito de estoque com base no que JÁ foi debitado para esta sessão (s.stockDebit) vs o que
    // deveria estar debitado agora (lote/produto/qtd do formulário). Cobre 3 casos sem nunca duplicar:
    // 1) sessão nova → debita 1x e grava o registro do débito na própria sessão.
    // 2) edição mudando lote/qtd → estorna o valor antigo e debita o novo (estoque sempre correto).
    // 3) clique duplicado no salvar → nada muda entre as duas chamadas, então ajustarDebitoLote não mexe no estoque de novo.
    const nextDebit=(sForm.loteId&&Number(sForm.qtdUsada)>0)?{product:sForm.product,loteId:sForm.loteId,qty:Number(sForm.qtdUsada)}:null;
    s.stockDebit=ajustarDebitoLote(setProducts,s.stockDebit,nextDebit,`Sessão ${s.procedure} · ${patient.name}`);
    // ── Débito automático de insumos via Ficha Técnica do procedimento (estoque mais completo) ──
    // Cada vez que o procedimento da sessão é definido/alterado, estorna os insumos da ficha antiga (se houver)
    // e debita os da ficha atual, escolhendo lote automaticamente por vencimento (FEFO). Não depende de
    // escolha manual de produto — roda em paralelo ao débito manual acima (que cobre o "produto principal").
    if(!sForm.skipAutoInsumos){
      const procObj=(proceduresFull||[]).find(p=>(typeof p==="string"?p:(p.name||p))===s.procedure);
      const fichaInsumos=(procObj&&typeof procObj==="object"&&Array.isArray(procObj.insumos))?procObj.insumos:[];
      const insumosQty=fichaInsumos.map(i=>({product:i.product,qty:Number(i.qty)||0})).filter(i=>i.product&&i.qty>0);
      const{debits,faltantes}=ajustarDebitoInsumosAuto(setProducts,allProducts||[],s.autoStockDebits||[],insumosQty,`Sessão ${s.procedure} · ${patient.name} (ficha técnica)`);
      s.autoStockDebits=debits;
      if(faltantes&&faltantes.length>0){
        setTimeout(()=>alert("⚠ Estoque insuficiente para: "+faltantes.map(f=>`${f.product} (faltam ${f.faltam})`).join(", ")+".\n\nA sessão foi salva normalmente, mas verifique o estoque."),50);
      }
    }
    upd(p=>editSess?{...p,sessions:(p.sessions||[]).map(x=>x.id===s.id?s:x),lastVisit:s.date}:{...p,sessions:[s,...(p.sessions||[])],lastVisit:s.date});
    // Sincronizar com Financeiro automaticamente
    const patName=patient.name;
    if(s.finStatus!=="Cancelado"){
      setTimeout(()=>syncIncome(s,patName),0);
    }
    setShowNewS(false);setEditSess(null);setSForm(blankS);
  }
  function toggleFinStatus(sessId,newSt){
    upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,finStatus:newSt,paid:newSt==="Pago"}:s)}));
    // Sincronizar com Financeiro
    const sess=(patient.sessions||[]).find(s=>s.id===sessId);
    if(sess)setTimeout(()=>syncIncome({...sess,finStatus:newSt,paid:newSt==="Pago"},patient.name),0);
  }
  function delSession(id){
    if(!window.confirm("Excluir sessão?"))return;
    const sess=(patient.sessions||[]).find(s=>s.id===id);
    if(sess?.stockDebit&&Number(sess.stockDebit.qty)>0){
      estornarLote(setProducts,sess.stockDebit.product,sess.stockDebit.loteId,sess.stockDebit.qty,`Estorno · sessão excluída (${patient.name})`);
    }
    if(sess?.autoStockDebits&&sess.autoStockDebits.length>0){
      estornarInsumosAuto(setProducts,sess.autoStockDebits,`Estorno · sessão excluída (${patient.name})`);
    }
    // Se havia um mapa com foto vinculado a esta sessão, ele não é apagado (preserva o registro clínico
    // e qualquer débito de estoque já feito pelos marcadores) — só perde o vínculo e passa a aparecer
    // como mapa avulso.
    upd(p=>({
      ...p,
      sessions:(p.sessions||[]).filter(s=>s.id!==id),
      planejamento:(p.planejamento||[]).map(pl=>pl.sessionId===id?{...pl,sessionId:null}:pl)
    }));
  }
  function addMedia(sessId,files,type){
    const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({id:Date.now()+Math.random(),name:f.name,type:f.type,url:e.target.result,date:new Date().toLocaleDateString("pt-BR")});r.readAsDataURL(f);}));
    Promise.all(readers).then(news=>{upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,[type]:[...(s[type]||[]),...news]}:s)}));});
  }
  function removeMedia(sessId,fid,type){upd(p=>({...p,sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,[type]:(s[type]||[]).filter(f=>f.id!==fid)}:s)}));}
  function openIntercorrFromSession(s){
    setIcForm({...blankIc,date:todayISO(),sessId:s.id,procedure:s.procedure||"",product:s.product||"",region:s.region||"",procedureDate:dmyToISO(s.date)});
    setShowIntercorr(s.id);
  }
  function applySessionToIcForm(sessId){
    const s=(patient.sessions||[]).find(x=>String(x.id)===String(sessId));
    if(!s){setIcForm(p=>({...p,sessId:null}));return;}
    setIcForm(p=>({...p,sessId:s.id,procedure:s.procedure||"",product:s.product||"",region:s.region||"",procedureDate:dmyToISO(s.date)}));
  }
  function saveIntercorrencia(){
    const sessId=showIntercorr==="global"?(icForm.sessId||null):showIntercorr;
    const photoFiles=icForm._photoFiles||[];
    const finish=photos=>{
      const ic={
        id:Date.now(),sessId,
        type:icForm.type,severity:icForm.severity,status:icForm.status,
        procedure:icForm.procedure,product:icForm.product,region:icForm.region,
        procedureDate:icForm.procedureDate,date:icForm.date||todayISO(),
        notes:icForm.notes,
        conducts:icForm.conduct.trim()?[{id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),text:icForm.conduct.trim()}]:[],
        evolutions:[],photos,
        nextReavaliacao:icForm.nextReavaliacao,
        createdAt:new Date().toISOString()
      };
      upd(p=>({
        ...p,
        sessions:(p.sessions||[]).map(s=>s.id===sessId?{...s,intercorrencias:[...(s.intercorrencias||[]),ic]}:s),
        intercorrencias:[...(p.intercorrencias||[]),ic]
      }));
      setShowIntercorr(null);setIcForm(blankIc);
    };
    if(photoFiles.length){
      Promise.all(photoFiles.map(f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({id:Date.now()+Math.random(),name:f.name,url:e.target.result});r.readAsDataURL(f);}))).then(finish);
    } else finish([]);
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
  function deletePlan(id){
    if(!window.confirm("Excluir planejamento?"))return;
    const pl=(patient.planejamento||[]).find(p=>p.id===id);
    const markers=pl?.markerPlan?.markers||[];
    markers.forEach(m=>{
      if(m.stockDebit&&Number(m.stockDebit.qty)>0){
        estornarLote(setProducts,m.stockDebit.product,m.stockDebit.loteId,m.stockDebit.qty,"Estorno · mapa excluído");
      }
    });
    upd(p=>({...p,planejamento:(p.planejamento||[]).filter(pl=>pl.id!==id)}));
  }
  function saveMarkerPlanNew(data){
    const pl={id:Date.now(),title:markerPlanningForSession?"Mapa Facial · Sessão":"Mapa Facial",steps:[],notes:"",done:false,created:new Date().toLocaleDateString("pt-BR"),markerPlan:data,sessionId:markerPlanningForSession||null};
    upd(p=>({...p,planejamento:[...(p.planejamento||[]),pl]}));
    setMarkerPlanning(null);setMarkerPlanningForSession(null);
  }
  function saveMarkerPlan(planId,data){
    upd(p=>({...p,planejamento:(p.planejamento||[]).map(pl=>pl.id===planId?{...pl,markerPlan:data,updatedAt:new Date().toLocaleDateString("pt-BR")}:pl)}));
    setMarkerPlanning(null);setMarkerPlanningForSession(null);
  }

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
        h(Btn,{variant:"ghost",onClick:handleGenerateDossie,disabled:generatingDossie,style:{fontSize:12,padding:"6px 14px"}},generatingDossie?"Gerando...":"📋 Gerar Dossiê"),
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
      const _allVouchers=(Array.isArray(vouchers)?vouchers:[]).filter(v=>v.toName&&v.toName.trim().toLowerCase()===patient.name.trim().toLowerCase()).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      const _vouchers=_allVouchers.filter(v=>{const st=voucherStatus(v);return st==="ativo"||st==="parcial";});
      const _usedVouchers=_allVouchers.filter(v=>{const st=voucherStatus(v);return st!=="ativo"&&st!=="parcial";});
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
        (()=>{
          const loy=calcLoyalty(patient,patients);
          const{tier,next,pointsToNext,totalSpent,sessionCount,referrals}=loy;
          const idx=LOYALTY_TIERS.findIndex(t=>t.k===tier.k);
          const prevMin=idx<LOYALTY_TIERS.length-1?LOYALTY_TIERS[idx].minScore:0;
          const nextMin=next?next.minScore:100;
          const pct=next?Math.min(100,Math.max(0,((loy.score-prevMin)/(nextMin-prevMin))*100)):100;
          return h(Card,{style:{marginBottom:14,border:`1px solid ${tier.color}55`}},
            h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}},
              h("div",{style:{display:"flex",alignItems:"center",gap:10}},h("span",{style:{fontSize:20}},"🏆"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Fidelização")),
              h(LoyaltyBadge,{patient,allPatients:patients,size:"lg"})
            ),
            h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}},
              h("div",{style:{textAlign:"center",padding:"8px 4px",background:P.bg3,borderRadius:8}},h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Total Gasto"),h("div",{style:{fontSize:15,color:P.text,marginTop:3}},fmtCurr(totalSpent))),
              h("div",{style:{textAlign:"center",padding:"8px 4px",background:P.bg3,borderRadius:8}},h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Sessões"),h("div",{style:{fontSize:15,color:P.text,marginTop:3}},sessionCount)),
              h("div",{style:{textAlign:"center",padding:"8px 4px",background:P.bg3,borderRadius:8}},h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Indicações"),h("div",{style:{fontSize:15,color:P.text,marginTop:3}},referrals))
            ),
            next?h("div",null,
              h("div",{style:{height:6,borderRadius:3,background:P.border,overflow:"hidden",marginBottom:6}},h("div",{style:{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${tier.color},${next.color})`,borderRadius:3}})),
              h("div",{style:{fontSize:11,color:P.text3}},`Faltam ${pointsToNext} pontos para o nível `,h("b",{style:{color:next.color}},"★".repeat(next.stars)+" "+next.l))
            ):h("div",{style:{fontSize:12,color:tier.color,fontWeight:600}},"🎉 Nível máximo de fidelidade atingido!")
          );
        })(),
        h(Card,{style:{marginBottom:14,border:`1px solid ${_pkgs.length>0?"rgba(157,119,97,.35)":P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:_pkgs.length>0?14:0}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},h("span",{style:{fontSize:20}},"📦"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Pacotes Ativos"),_pkgs.length>0&&h("span",{style:{fontSize:11,fontWeight:700,color:P.accent3,background:P.rose,padding:"2px 8px",borderRadius:20}},_pkgs.length)),
            h("button",{onClick:()=>setTab("pacotes"),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.3)`,borderRadius:8,padding:"4px 12px",cursor:"pointer"}},"Ver todos →")
          ),
          _pkgs.length===0?h("div",{style:{fontSize:13,color:P.text3}},"Nenhum pacote ativo.")
          :h("div",{style:{display:"flex",flexDirection:"column",gap:8}},_pkgs.map(pkg=>{const pct=Math.round((pkg.done/pkg.total)*100);return h("div",{key:pkg.id,style:{padding:"12px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}},h("div",null,h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},pkg.name),h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},pkg.procedure)),h("div",{style:{textAlign:"right"}},h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.accent}},pkg.done+"/"+pkg.total),h("div",{style:{fontSize:10,color:P.text3}},"sessões"))),h("div",{style:{height:5,borderRadius:3,background:P.border,overflow:"hidden"}},h("div",{style:{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${P.rose},${P.gold})`,borderRadius:3}})),h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:5}},h("span",{style:{fontSize:10,color:P.text3}},(pkg.total-pkg.done)+" restante(s)"),pkg.price>0&&h("span",{style:{fontSize:10,color:P.accent}},fmtCurr(pkg.price))));})
          )
        ),
        h(Card,{style:{border:`1px solid ${_allVouchers.length>0?"rgba(155,122,173,.4)":P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:_allVouchers.length>0?14:0,flexWrap:"wrap",gap:8}},
            h("div",{style:{display:"flex",alignItems:"center",gap:10}},h("span",{style:{fontSize:20}},"🎟️"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text}},"Vouchers"),_allVouchers.length>0&&h("span",{style:{fontSize:11,fontWeight:700,color:"#fff",background:"#9b7aad",padding:"2px 8px",borderRadius:20}},_allVouchers.length)),
            h("div",{style:{display:"flex",gap:6}},
              setVouchers&&h("button",{onClick:()=>setShowQuickVoucher(true),style:{fontSize:11,color:"#fff",background:"#9b7aad",border:"none",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:600}},"＋ Presentear"),
              onNavVouchers&&h("button",{onClick:onNavVouchers,style:{fontSize:11,color:"#9b7aad",background:"transparent",border:"1px solid rgba(155,122,173,.35)",borderRadius:8,padding:"4px 12px",cursor:"pointer"}},"Ver todos →")
            )
          ),
          _allVouchers.length===0?h("div",{style:{fontSize:13,color:P.text3}},"Nenhum voucher registrado para esta paciente."):h("div",null,
            _vouchers.length>0&&h("div",{style:{marginBottom:_usedVouchers.length>0?16:0}},
              h("div",{style:{fontSize:10,color:P.green,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,fontWeight:600}},"● Ativos"),
              h("div",{style:{display:"flex",flexDirection:"column",gap:8}},_vouchers.map((v,i)=>{
                const saldo=v.type==="valor"?Number(v.value)-Number(v.usedValue||0):null;
                return h("div",{key:i,style:{padding:"12px 14px",background:"rgba(155,122,173,.07)",borderRadius:10,border:"1px solid rgba(155,122,173,.25)"}},
                  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                    h("div",null,
                      h("div",{style:{fontSize:13,color:P.text,fontWeight:600,fontFamily:"monospace"}},v.code),
                      h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},v.type==="valor"?"De "+(v.fromName||"—"):"🎁 "+(v.procedures||[]).join(", "))
                    ),
                    h("div",{style:{textAlign:"right"}},
                      v.type==="valor"&&h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"#9b7aad"}},fmtCurr(saldo)),
                      v.validUntil&&h("div",{style:{fontSize:10,color:P.text3,marginTop:2}},"Válido até "+new Date(v.validUntil+"T12:00").toLocaleDateString("pt-BR"))
                    )
                  ),
                  onNavVouchers&&h("button",{onClick:onNavVouchers,style:{marginTop:8,fontSize:11,color:"#9b7aad",background:"rgba(155,122,173,.12)",border:"1px solid rgba(155,122,173,.3)",borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"Resgatar voucher →")
                );
              }))
            ),
            _usedVouchers.length>0&&h("div",null,
              h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,fontWeight:600}},"○ Histórico (resgatados / expirados / cancelados)"),
              h("div",{style:{display:"flex",flexDirection:"column",gap:8}},_usedVouchers.map((v,i)=>{
                const st=voucherStatus(v); const cfg=VOUCHER_STATUS_CFG[st];
                return h("div",{key:i,style:{padding:"12px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`,opacity:.8}},
                  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                    h("div",null,
                      h("div",{style:{fontSize:13,color:P.text2,fontWeight:600,fontFamily:"monospace"}},v.code),
                      h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},v.type==="valor"?"De "+(v.fromName||"—")+" · "+fmtCurr(v.value):"🎁 "+(v.procedures||[]).join(", "))
                    ),
                    h("span",{style:{fontSize:10,padding:"2px 9px",borderRadius:12,background:cfg.bg,color:cfg.color,fontWeight:600,whiteSpace:"nowrap"}},cfg.l)
                  ),
                  (v.redemptions||[]).length>0&&h("div",{style:{marginTop:6,paddingTop:6,borderTop:`1px solid ${P.border}`}},
                    v.redemptions.map((r,ri)=>h("div",{key:ri,style:{fontSize:11,color:P.text3}},"Usado em "+r.date+(r.value>0?" · "+fmtCurr(r.value):"")))
                  )
                );
              }))
            )
          )
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
    tab==="prontuario"&&(()=>{
      const allSess=patient.sessions||[];
      const sessProcs=["Todos",...new Set(allSess.map(s=>s.procedure).filter(Boolean))];
      const sessYears=["Todos",...new Set(allSess.map(s=>{const d=parseDMY(s.date);return d?String(d.getFullYear()):null;}).filter(Boolean))].sort((a,b)=>b==="Todos"?1:(a==="Todos"?-1:b-a));
      const regionsUsedP=FACE_REGIONS.filter(r=>allSess.some(s=>{
        if(matchFaceRegions(s.region).some(x=>x.k===r.k))return true;
        if(matchFaceRegions(s.procedure).some(x=>x.k===r.k))return true;
        if(s.faceMap?.points&&Object.keys(s.faceMap.points).some(pk=>s.faceMap.points[pk]>0&&matchFaceRegionsFromPointKey(pk).some(x=>x.k===r.k)))return true;
        return false;
      }));
      const filteredSess=allSess.filter(s=>{
        if(pFilterProc!=="Todos"&&s.procedure!==pFilterProc)return false;
        const d=parseDMY(s.date);
        if(pFilterYear!=="Todos"&&(!d||String(d.getFullYear())!==pFilterYear))return false;
        if(pFilterMonth!=="Todos"&&(!d||String(d.getMonth()+1)!==pFilterMonth))return false;
        if(pFilterRegion!=="Todas"){
          const matched=new Set();
          matchFaceRegions(s.region).forEach(r=>matched.add(r.k));
          matchFaceRegions(s.procedure).forEach(r=>matched.add(r.k));
          if(s.faceMap?.points)Object.keys(s.faceMap.points).forEach(pk=>{if(s.faceMap.points[pk]>0)matchFaceRegionsFromPointKey(pk).forEach(r=>matched.add(r.k));});
          if(!matched.has(pFilterRegion))return false;
        }
        return true;
      });
      const hasActiveFilter=pFilterProc!=="Todos"||pFilterYear!=="Todos"||pFilterMonth!=="Todos"||pFilterRegion!=="Todas";
      return h("div",null,
      allSess.length===0&&h(Card,{style:{textAlign:"center",padding:40}},h("div",{style:{fontSize:32,marginBottom:12}},"📋"),h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma sessão."),h(Btn,{style:{marginTop:16},onClick:()=>setShowNewS(true)},"Registrar Primeira Sessão")),
      allSess.length>0&&h(Card,{style:{marginBottom:16}},
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}},
          h("div",{style:{fontSize:11,color:P.text3,textTransform:"uppercase",letterSpacing:".08em"}},"🔍 Filtrar Sessões"),
          hasActiveFilter&&h("button",{onClick:()=>{setPFilterProc("Todos");setPFilterYear("Todos");setPFilterMonth("Todos");setPFilterRegion("Todas");},style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 9px",cursor:"pointer"}},"Limpar filtros")
        ),
        h("div",{style:{display:"flex",gap:10,flexWrap:"wrap"}},
          h("div",null,
            h("div",{style:{fontSize:10,color:P.text3,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}},"Procedimento"),
            h("select",{value:pFilterProc,onChange:e=>setPFilterProc(e.target.value),style:{...IS,width:"auto",minWidth:170}},sessProcs.map(p=>h("option",{key:p,value:p},p)))
          ),
          h("div",null,
            h("div",{style:{fontSize:10,color:P.text3,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}},"Ano"),
            h("select",{value:pFilterYear,onChange:e=>setPFilterYear(e.target.value),style:{...IS,width:"auto",minWidth:100}},sessYears.map(y=>h("option",{key:y,value:y},y)))
          ),
          h("div",null,
            h("div",{style:{fontSize:10,color:P.text3,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}},"Mês"),
            h("select",{value:pFilterMonth,onChange:e=>setPFilterMonth(e.target.value),style:{...IS,width:"auto",minWidth:130}},
              h("option",{value:"Todos"},"Todos"),
              MONTH_NAMES.map((m,i)=>h("option",{key:i,value:String(i+1)},m))
            )
          ),
          regionsUsedP.length>0&&h("div",null,
            h("div",{style:{fontSize:10,color:P.text3,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}},"Área / Região"),
            h("select",{value:pFilterRegion,onChange:e=>setPFilterRegion(e.target.value),style:{...IS,width:"auto",minWidth:180}},
              h("option",{value:"Todas"},"Todas"),
              regionsUsedP.map(r=>h("option",{key:r.k,value:r.k},r.icon+" "+r.l))
            )
          )
        ),
        hasActiveFilter&&h("div",{style:{fontSize:11.5,color:P.text3,marginTop:10}},filteredSess.length+" de "+allSess.length+" sessão(ões) encontrada(s).")
      ),
      allSess.length>0&&filteredSess.length===0&&h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:28,marginBottom:8}},"🔍"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma sessão encontrada com esses filtros.")),
      filteredSess.map(s=>h(Card,{key:s.id,style:{marginBottom:14}},
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
            h("button",{onClick:()=>openMapForSession(s),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer"}},mapPlanBySession[s.id]?"🗺 Editar Mapa":"🗺 Mapa"),
            h("button",{onClick:()=>{setEditSess(s);setSForm({...s,value:String(s.value),finStatus:s.finStatus||"Pendente"});setShowNewS(true);},style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer"}},"✎"),
            h("button",{onClick:()=>delSession(s.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 8px",cursor:"pointer"}},"🗑")
          )
        ),
        s.region&&h("div",{style:{fontSize:12,color:P.text2,marginBottom:8}},`🎯 Região: `,h("strong",{style:{color:P.text}},s.region)),
        s.notes&&h("div",{style:{background:P.bg3,borderRadius:8,padding:"10px 14px",marginBottom:8}},h("div",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"Notas"),h("div",{style:{fontSize:13,color:P.text2,lineHeight:1.6}},s.notes)),
        s.evolution&&h("div",{style:{background:`rgba(92,31,50,.06)`,borderRadius:8,padding:"10px 14px",border:`1px solid rgba(92,31,50,.15)`,marginBottom:8}},h("div",{style:{fontSize:9.5,color:P.accent,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"Evolução / Retorno"),h("div",{style:{fontSize:13,color:P.text2,lineHeight:1.6}},s.evolution)),
        s.returnReminderDays&&h("div",{style:{fontSize:11,color:P.text3,marginBottom:8}},`⏰ Lembrete de retorno: ${s.returnReminderDays} dias após procedimento`),
        (()=>{
          const mp=mapPlanBySession[s.id];
          if(mp&&mp.markerPlan?.baseImage){
            const mk=mp.markerPlan.markers||[];
            return h("div",{onClick:()=>openMapForSession(s),style:{display:"flex",gap:10,alignItems:"center",padding:"8px 10px",background:P.bg3,borderRadius:8,marginBottom:8,cursor:"pointer"},title:"Clique para editar o mapa"},
              h("div",{style:{width:46,height:46,borderRadius:6,overflow:"hidden",flexShrink:0,position:"relative",border:`1px solid ${P.border}`}},
                h("img",{src:mp.markerPlan.baseImage,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}})
              ),
              h("div",{style:{flex:1,minWidth:0}},
                h("div",{style:{fontSize:9.5,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}},"Mapa com Foto"),
                h("div",{style:{fontSize:11.5,color:P.text2}},`${mk.length} marcador${mk.length===1?"":"es"} · ${mk.filter(m=>m.done).length} realizado${mk.filter(m=>m.done).length===1?"":"s"}`)
              )
            );
          }
          return h("div",{onClick:()=>openMapForSession(s),style:{padding:"8px 12px",background:"transparent",border:`1px dashed ${P.border}`,borderRadius:8,marginBottom:8,cursor:"pointer",fontSize:11.5,color:P.text3,textAlign:"center"}},"🗺 Mapa facial (com foto) ainda não preenchido — clique para registrar");
        })(),
        (s.intercorrencias||[]).length>0&&h("div",{style:{marginBottom:8,padding:"8px 12px",background:"rgba(192,112,112,.06)",borderRadius:8,border:"1px solid rgba(192,112,112,.18)"}},h("div",{style:{fontSize:10,color:P.red,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},"⚠ Intercorrências"),(s.intercorrencias||[]).map((ic,i)=>h("div",{key:ic.id||i,style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",fontSize:12,color:P.text2,marginBottom:3}},
          h("span",{style:{fontSize:9,padding:"1px 7px",borderRadius:8,background:(IC_SEVERITY_CFG[icSeverityOf(ic)]||IC_SEVERITY_CFG.Leve).bg,color:(IC_SEVERITY_CFG[icSeverityOf(ic)]||IC_SEVERITY_CFG.Leve).color,fontWeight:600}},icSeverityOf(ic)),
          h("span",null,`${isoToBR(ic.date)||ic.date} · ${ic.type}: ${ic.notes}`),
          h("span",{style:{fontSize:9,padding:"1px 7px",borderRadius:8,background:(IC_STATUS_CFG[icStatusOf(ic)]||IC_STATUS_CFG["Em Acompanhamento"]).bg,color:(IC_STATUS_CFG[icStatusOf(ic)]||IC_STATUS_CFG["Em Acompanhamento"]).color}},icStatusOf(ic))
        ))),
        (s.photos||[]).length>0&&h("div",{style:{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}},(s.photos||[]).slice(0,4).map(ph=>h("img",{key:ph.id,src:ph.url,alt:ph.name,style:{width:58,height:58,objectFit:"cover",borderRadius:6,border:`1px solid ${P.border}`}})),(s.photos||[]).length>4&&h("div",{style:{width:58,height:58,borderRadius:6,background:P.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:P.text3}},`+${(s.photos||[]).length-4}`)),
        h("div",{style:{display:"flex",gap:8,marginTop:10}},
          h("label",{style:{fontSize:11,color:P.accent,border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"📷 Fotos",h("input",{type:"file",accept:"image/*",multiple:true,style:{display:"none"},onChange:e=>addMedia(s.id,[...e.target.files],"photos")})),
          h("label",{style:{fontSize:11,color:P.accent,border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"📎 Docs",h("input",{type:"file",multiple:true,style:{display:"none"},onChange:e=>addMedia(s.id,[...e.target.files],"docs")})),
          h("button",{onClick:()=>openIntercorrFromSession(s),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"4px 10px",cursor:"pointer"}},"⚠ Intercorrência")
        )
      )));
    })(),
    // ─── MAPA TAB (lista as sessões da paciente; cada sessão tem seu próprio mapa com foto real,
    // com marcadores de produto/lote/quantidade e custo planejado×realizado) ──────────────────
    tab==="mapa"&&h("div",null,
      // MarkerPhotoPlanner fullscreen — mesmo estado/handlers usados na tab Planejamento
      markerPlanning&&h(MarkerPhotoPlanner,{
        initial:markerPlanning==="new"?null:markerPlanning.markerPlan,
        allProducts,
        setProducts,
        patientPhotos:patientPhotoGallery,
        onClose:()=>{setMarkerPlanning(null);setMarkerPlanningForSession(null);},
        onSave:data=>{
          if(markerPlanning==="new") saveMarkerPlanNew(data);
          else saveMarkerPlan(markerPlanning.id,data);
        }
      }),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}},
        h("div",null,
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Mapa Facial"),
          h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},"Cada sessão pode ter seu próprio mapa, com marcadores direto na foto da paciente.")
        ),
        h(Btn,{onClick:()=>{setMarkerPlanningForSession(null);setMarkerPlanning("new");},style:{fontSize:12}},"📍 Mapa Avulso (sem sessão)")
      ),
      (patient.sessions||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},
        h("div",{style:{fontSize:32,marginBottom:12}},"📋"),
        h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma sessão registrada ainda. Cadastre uma sessão no Prontuário para poder anexar o mapa facial.")
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:14}},
        (patient.sessions||[]).map(s=>{
          const pl=mapPlanBySession[s.id];
          const mp=pl?.markerPlan;
          if(!mp||!mp.baseImage){
            // Sessão sem mapa com foto ainda — card compacto convidando a criar.
            return h(Card,{key:s.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}},
              h("div",null,
                h("div",{style:{fontSize:12.5,color:P.text3}},"📅 "+s.date),
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},s.procedure)
              ),
              h(Btn,{onClick:()=>openMapForSession(s),style:{fontSize:12}},"📍 Criar Mapa com Foto")
            );
          }
          const cu=name=>markerUnitCost(allProducts,name);
          const mpTotal=(mp.markers||[]).length;
          const mpDone=(mp.markers||[]).filter(m=>m.done).length;
          const mpPlanned=(mp.markers||[]).reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
          const doneList=(mp.markers||[]).filter(m=>m.done);
          const mpActual=doneList.reduce((a,m)=>a+(Number(m.actualQty)||0)*cu(m.actualProduct||m.plannedProduct),0);
          const doneListPlannedCost=doneList.reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
          const mpDiff=mpActual-doneListPlannedCost;
          return h(Card,{key:s.id,style:{padding:0,overflow:"hidden"}},
            h("div",{style:{display:"flex",gap:0,flexWrap:"wrap"}},
              h("div",{style:{width:200,flexShrink:0,position:"relative",cursor:"pointer",lineHeight:0},onClick:()=>setMarkerPlanning(pl)},
                h("img",{src:mp.baseImage,alt:"mapa facial",style:{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:160}}),
                (mp.markers||[]).map((m,mi)=>h("div",{key:mi,style:{position:"absolute",left:m.xPct+"%",top:m.yPct+"%",transform:"translate(-50%,-50%)",width:18,height:18,borderRadius:"50%",background:m.done?"rgba(122,173,138,.92)":"rgba(157,119,97,.92)",border:"1.5px solid rgba(255,255,255,.9)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700}},mi+1)),
                h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,.0)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"},
                  onMouseEnter:e=>e.currentTarget.style.opacity=1,onMouseLeave:e=>e.currentTarget.style.opacity=0},
                  h("div",{style:{background:"rgba(0,0,0,.7)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600}},"✎ Editar")
                )
              ),
              h("div",{style:{flex:1,minWidth:240,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}},
                  h("div",null,
                    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:2}},`📅 ${s.date} · ${s.procedure}`),
                    h("div",{style:{fontSize:11,color:P.text3}},
                      "Mapa criado em "+pl.created,
                      pl.updatedAt&&h("span",{style:{marginLeft:8,color:P.accent}},"· Editado em "+pl.updatedAt),
                      h("span",{style:{marginLeft:8,fontSize:10,color:P.accent,background:"rgba(157,119,97,.15)",padding:"1px 7px",borderRadius:10,border:"1px solid rgba(157,119,97,.3)"}},"📍 "+mpDone+"/"+mpTotal+" marcadores realizados")
                    )
                  ),
                  h("div",{style:{display:"flex",gap:5,flexShrink:0}},
                    h("button",{onClick:()=>setMarkerPlanning(pl),style:{padding:"5px 10px",borderRadius:7,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:11}},"✎ Editar Mapa"),
                    h("button",{onClick:()=>deletePlan(pl.id),style:{padding:"5px 8px",borderRadius:7,background:"transparent",border:"1px solid rgba(192,112,112,.2)",color:P.red,cursor:"pointer",fontSize:11}},"🗑")
                  )
                ),
                h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",padding:"8px 10px",background:P.bg3,borderRadius:8}},
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Custo planejado"),h("div",{style:{fontSize:14,color:P.rose}},fmtCurr(mpPlanned))),
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Custo realizado"),h("div",{style:{fontSize:14,color:P.green}},fmtCurr(mpActual))),
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Diferença"),h("div",{style:{fontSize:14,color:mpDiff>0?P.red:(mpDiff<0?P.green:P.text2)}},(mpDiff>0?"+":"")+fmtCurr(mpDiff)))
                ),
                (mp.markers||[]).length>0&&h("div",{style:{display:"flex",flexWrap:"wrap",gap:5}},
                  (mp.markers||[]).map((m,mi)=>h("span",{key:mi,style:{fontSize:10.5,padding:"3px 9px",borderRadius:20,background:m.done?"rgba(122,173,138,.12)":"rgba(157,119,97,.12)",color:m.done?P.green:P.accent}},
                    (mi+1)+". "+(m.plannedProduct||"sem produto")+(m.plannedQty?(" · "+m.plannedQty+(m.plannedUnit||"")):"")+(m.done?" ✓":"")
                  ))
                )
              )
            )
          );
        })
      ),
      // Mapas avulsos: criados sem vínculo a uma sessão específica (ex: planejamento inicial, antes de agendar).
      mapPlans.filter(pl=>!pl.sessionId).length>0&&h(Card,{style:{marginTop:14}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Mapas Avulsos (sem sessão vinculada)"),
        h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
          mapPlans.filter(pl=>!pl.sessionId).map(pl=>{
            const mp=pl.markerPlan;
            return h("div",{key:pl.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`,gap:8,flexWrap:"wrap"}},
              h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                mp.baseImage&&h("img",{src:mp.baseImage,style:{width:36,height:36,borderRadius:6,objectFit:"cover",border:`1px solid ${P.border}`}}),
                h("span",{style:{fontSize:13,color:P.text}},pl.title||"Mapa Facial")
              ),
              h("div",{style:{display:"flex",gap:5}},
                h("button",{onClick:()=>setMarkerPlanning(pl),style:{padding:"4px 10px",borderRadius:7,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:11}},"✎ Editar"),
                h("button",{onClick:()=>deletePlan(pl.id),style:{padding:"4px 8px",borderRadius:7,background:"transparent",border:"1px solid rgba(192,112,112,.2)",color:P.red,cursor:"pointer",fontSize:11}},"🗑")
              )
            );
          })
        )
      ),
      // Histórico legado: mapas simples (boneco genérico) preenchidos antes desta atualização.
      (patient.sessions||[]).filter(s=>s.faceMap&&Object.values(s.faceMap.points||{}).some(v=>v>0)).length>0&&h(Card,{style:{marginTop:14}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:6}},"Mapas Antigos (registro simplificado)"),
        h("div",{style:{fontSize:11.5,color:P.text3,marginBottom:14}},"Registrados antes da atualização para mapas com foto. Somente leitura."),
        (patient.sessions||[]).filter(s=>s.faceMap&&Object.values(s.faceMap.points||{}).some(v=>v>0)).map((s,i)=>h("div",{key:i,style:{padding:"10px 0",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}},
              h("span",{style:{fontSize:13,color:P.text}},`${s.date} · ${s.procedure}`),
              h("div",{style:{display:"flex",gap:4,flexWrap:"wrap"}},Object.entries(s.faceMap.points||{}).filter(([,v])=>v>0).map(([k,v])=>h("span",{key:k,style:{fontSize:10,padding:"2px 8px",borderRadius:12,background:`rgba(92,31,50,.1)`,color:P.accent}},`${k.replace(/_/g," ")}: ${v}${s.faceMap.type==="botox"?"U":"ml"}`)))
            ))
      )
    ),
    // ─── INTERCORRÊNCIAS TAB
    tab==="intercorrencias"&&h("div",null,
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Intercorrências Registradas"),
        h(Btn,{onClick:()=>{setIcForm(blankIc);setShowIntercorr("global");}},"＋ Registrar")
      ),
      (()=>{
        const all=patient.intercorrencias||[];
        if(all.length===0)return null;
        const stats={
          acomp:all.filter(ic=>icStatusOf(ic)==="Em Acompanhamento").length,
          resolv:all.filter(ic=>icStatusOf(ic)==="Resolvida").length,
          graves:all.filter(ic=>["Grave","Emergencial"].includes(icSeverityOf(ic))).length
        };
        return h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}},
          [{l:"Total",v:all.length,c:P.rose},{l:"Em Acompanhamento",v:stats.acomp,c:"#7aaed4"},{l:"Resolvidas",v:stats.resolv,c:P.green},{l:"Graves/Emergenciais",v:stats.graves,c:P.red}].map(s=>
            h("div",{key:s.l,style:{textAlign:"center",padding:14,borderRadius:12,background:s.c}},
              h("div",{style:{fontSize:9.5,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}},s.l),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#fff"}},s.v)
            )
          )
        );
      })(),
      (patient.intercorrencias||[]).length>0&&h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}},
        h("select",{value:icFilterSev,onChange:e=>setIcFilterSev(e.target.value),style:{fontSize:12,padding:"6px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,fontFamily:"'DM Sans',sans-serif"}},["Todas",...IC_SEVERITY].map(o=>h("option",{key:o,value:o},o))),
        h("select",{value:icFilterStatus,onChange:e=>setIcFilterStatus(e.target.value),style:{fontSize:12,padding:"6px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,fontFamily:"'DM Sans',sans-serif"}},["Todos",...IC_STATUS_LIST].map(o=>h("option",{key:o,value:o},o))),
        h("select",{value:icFilterProc,onChange:e=>setIcFilterProc(e.target.value),style:{fontSize:12,padding:"6px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,fontFamily:"'DM Sans',sans-serif"}},["Todos",...Array.from(new Set((patient.intercorrencias||[]).map(ic=>ic.procedure).filter(Boolean)))].map(o=>h("option",{key:o,value:o},o))),
        h("select",{value:icFilterProd,onChange:e=>setIcFilterProd(e.target.value),style:{fontSize:12,padding:"6px 10px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,fontFamily:"'DM Sans',sans-serif"}},["Todos",...Array.from(new Set((patient.intercorrencias||[]).map(ic=>ic.product).filter(Boolean)))].map(o=>h("option",{key:o,value:o},o)))
      ),
      (()=>{
        const filtered=(patient.intercorrencias||[]).filter(ic=>
          (icFilterSev==="Todas"||icSeverityOf(ic)===icFilterSev)&&
          (icFilterStatus==="Todos"||icStatusOf(ic)===icFilterStatus)&&
          (icFilterProc==="Todos"||ic.procedure===icFilterProc)&&
          (icFilterProd==="Todos"||ic.product===icFilterProd)
        ).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
        if((patient.intercorrencias||[]).length===0)return h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:28,marginBottom:8}},"✅"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma intercorrência registrada."));
        if(filtered.length===0)return h(Card,{style:{textAlign:"center",padding:32}},h("div",{style:{fontSize:28,marginBottom:8}},"🔍"),h("div",{style:{color:P.text3,fontSize:13}},"Nenhuma intercorrência encontrada para os filtros selecionados."));
        return filtered.map(ic=>h(IntercorrenciaCard,{key:ic.id,ic,patient,setPatients}));
      })()
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
      // MarkerPhotoPlanner fullscreen (sobrepõe tudo)
      markerPlanning&&h(MarkerPhotoPlanner,{
        initial:markerPlanning==="new"?null:markerPlanning.markerPlan,
        allProducts,
        setProducts,
        patientPhotos:patientPhotoGallery,
        onClose:()=>{setMarkerPlanning(null);setMarkerPlanningForSession(null);},
        onSave:data=>{
          if(markerPlanning==="new") saveMarkerPlanNew(data);
          else saveMarkerPlan(markerPlanning.id,data);
        }
      }),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8}},
        h("div",null,
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Planejamento Facial"),
          h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},"Mapas com marcadores criados aqui também aparecem na tab 🗺 Mapa.")
        ),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          h(Btn,{variant:"ghost",onClick:()=>setShowPlan(true),style:{fontSize:12}},"＋ Plano de Texto"),
          h(Btn,{variant:"ghost",onClick:()=>{setPlanAnnotating("new");},style:{fontSize:12}},"🖼 Plano com Foto"),
          h(Btn,{onClick:()=>{setMarkerPlanningForSession(null);setMarkerPlanning("new");},style:{fontSize:12}},"📍 Plano com Marcadores")
        )
      ),
      h("div",{style:{marginBottom:16}}),
      (patient.planejamento||[]).length===0&&h(Card,{style:{textAlign:"center",padding:40}},
        h("div",{style:{fontSize:32,marginBottom:12}},"🎯"),
        h("div",{style:{color:P.text3,fontSize:14,marginBottom:16}},"Nenhum planejamento criado."),
        h("div",{style:{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}},
          h(Btn,{variant:"ghost",onClick:()=>setShowPlan(true)},"＋ Plano de Texto"),
          h(Btn,{variant:"ghost",onClick:()=>setPlanAnnotating("new")},"🖼 Plano com Foto"),
          h(Btn,{onClick:()=>{setMarkerPlanningForSession(null);setMarkerPlanning("new");}},"📍 Plano com Marcadores")
        )
      ),
      h("div",{style:{display:"flex",flexDirection:"column",gap:14}},
        (patient.planejamento||[]).map(pl=>{
          // Totais do plano com marcadores (planejado x realizado), se houver
          const mp=pl.markerPlan;
          let mpPlanned=0,mpActual=0,mpDone=0,mpTotal=0,mpDiff=0;
          if(mp){
            const cu=name=>markerUnitCost(allProducts,name);
            mpTotal=(mp.markers||[]).length;
            mpDone=(mp.markers||[]).filter(m=>m.done).length;
            mpPlanned=(mp.markers||[]).reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
            const doneList=(mp.markers||[]).filter(m=>m.done);
            mpActual=doneList.reduce((a,m)=>a+(Number(m.actualQty)||0)*cu(m.actualProduct||m.plannedProduct),0);
            const doneListPlannedCost=doneList.reduce((a,m)=>a+(Number(m.plannedQty)||0)*cu(m.plannedProduct),0);
            mpDiff=mpActual-doneListPlannedCost;
          }
          return h(Card,{key:pl.id,style:{padding:0,overflow:"hidden"}},
            // Se tiver anotação visual ou marcadores, mostrar thumbnail à esquerda
            h("div",{style:{display:"flex",gap:0}},
              pl.annotation?.thumbnail&&h("div",{style:{width:180,flexShrink:0,position:"relative",cursor:"pointer"},onClick:()=>setPlanAnnotating(pl)},
                h("img",{src:pl.annotation.thumbnail,alt:"anotação",style:{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:130}}),
                h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,.0)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"},
                  onMouseEnter:e=>e.currentTarget.style.opacity=1,onMouseLeave:e=>e.currentTarget.style.opacity=0},
                  h("div",{style:{background:"rgba(0,0,0,.7)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600}},"✎ Editar")
                )
              ),
              mp?.baseImage&&h("div",{style:{width:180,flexShrink:0,position:"relative",cursor:"pointer",lineHeight:0},onClick:()=>setMarkerPlanning(pl)},
                h("img",{src:mp.baseImage,alt:"marcadores",style:{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:130}}),
                (mp.markers||[]).map((m,mi)=>h("div",{key:mi,style:{position:"absolute",left:m.xPct+"%",top:m.yPct+"%",transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:m.done?"rgba(122,173,138,.9)":"rgba(157,119,97,.9)",border:"1.5px solid rgba(255,255,255,.85)"}})),
                h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,.0)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"},
                  onMouseEnter:e=>e.currentTarget.style.opacity=1,onMouseLeave:e=>e.currentTarget.style.opacity=0},
                  h("div",{style:{background:"rgba(0,0,0,.7)",borderRadius:8,padding:"6px 12px",color:"#fff",fontSize:12,fontWeight:600}},"✎ Editar")
                )
              ),
              h("div",{style:{flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}},
                  h("div",null,
                    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:2}},pl.title),
                    h("div",{style:{fontSize:11,color:P.text3}},
                      "Criado em "+pl.created,
                      pl.updatedAt&&h("span",{style:{marginLeft:8,color:P.accent}},"· Editado em "+pl.updatedAt),
                      pl.annotation&&h("span",{style:{marginLeft:8,fontSize:10,color:P.green,background:"rgba(122,173,138,.15)",padding:"1px 7px",borderRadius:10,border:"1px solid rgba(122,173,138,.3)"}},"📷 Com anotação visual"),
                      mp&&h("span",{style:{marginLeft:8,fontSize:10,color:P.accent,background:"rgba(157,119,97,.15)",padding:"1px 7px",borderRadius:10,border:"1px solid rgba(157,119,97,.3)"}},"📍 "+mpDone+"/"+mpTotal+" marcadores realizados")
                    )
                  ),
                  h("div",{style:{display:"flex",gap:5,flexShrink:0}},
                    h("button",{onClick:()=>setPlanAnnotating(pl),title:pl.annotation?"Editar anotação visual":"Adicionar foto",style:{padding:"5px 10px",borderRadius:7,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:11}},pl.annotation?"✎ Foto":"📷 Foto"),
                    h("button",{onClick:()=>setMarkerPlanning(mp?pl:"new"),title:mp?"Editar marcadores":"Adicionar marcadores",style:{padding:"5px 10px",borderRadius:7,background:"transparent",border:`1px solid ${P.border}`,color:P.accent,cursor:"pointer",fontSize:11}},mp?"✎ Marcadores":"📍 Marcadores"),
                    h("button",{onClick:()=>deletePlan(pl.id),style:{padding:"5px 8px",borderRadius:7,background:"transparent",border:"1px solid rgba(192,112,112,.2)",color:P.red,cursor:"pointer",fontSize:11}},"🗑")
                  )
                ),
                pl.notes&&h("div",{style:{fontSize:13,color:P.text3,fontStyle:"italic"}},pl.notes),
                mp&&h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",padding:"8px 10px",background:P.bg3,borderRadius:8}},
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Custo planejado"),h("div",{style:{fontSize:14,color:P.rose}},fmtCurr(mpPlanned))),
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Custo realizado"),h("div",{style:{fontSize:14,color:P.green}},fmtCurr(mpActual))),
                  h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Diferença"),h("div",{style:{fontSize:14,color:mpDiff>0?P.red:(mpDiff<0?P.green:P.text2)}},(mpDiff>0?"+":"")+fmtCurr(mpDiff)))
                ),
                (pl.steps||[]).length>0&&h("div",{style:{display:"flex",flexDirection:"column",gap:2}},
                  (pl.steps||[]).map((step,si)=>h("div",{key:si,onClick:()=>togglePlanStep(pl.id,si),style:{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid rgba(71,35,37,.3)`,cursor:"pointer"}},
                    h("div",{style:{width:14,height:14,borderRadius:3,border:`2px solid ${step.includes("✓")?P.green:P.border}`,background:step.includes("✓")?P.green:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff"}},step.includes("✓")?"✓":""),
                    h("span",{style:{fontSize:12.5,color:step.includes("✓")?P.green:P.text,textDecoration:step.includes("✓")?"line-through":"none"}},step.replace(" ✓",""))
                  ))
                )
              )
            )
          );
        })
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
    tab==="galeria"&&h(EvolucaoFotos,{patient,upd,addMedia,removeMedia,clinicName:clinicSettings?.clinicName}),
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
    // ─── ABA AGENDA DA PACIENTE ───────────────────────────────────────────────
    tab==="agendaPaciente"&&(()=>{
      const patAppts=(agenda||[])
        .filter(a=>!a.blocked&&(a.patientName||"").trim().toLowerCase()===patient.name.trim().toLowerCase())
        .sort((a,b)=>{
          const da=new Date((a.date||"")+"T"+(a.time||"00:00"));
          const db=new Date((b.date||"")+"T"+(b.time||"00:00"));
          return db-da;
        });
      const now=new Date();
      const upcoming=patAppts.filter(a=>new Date(a.date+"T"+(a.time||"00:00"))>=now);
      const past=patAppts.filter(a=>new Date(a.date+"T"+(a.time||"00:00"))<now);
      const statusCount={};
      patAppts.forEach(a=>{statusCount[a.status]=(statusCount[a.status]||0)+1;});

      function ApptRow(a){
        const sc=APPT_STATUS_CFG[a.status]||APPT_STATUS_CFG.Aguardando;
        const hasHistory=(a.rescheduleHistory||[]).length>0;
        return h(AgendaApptRow,{key:a.id,a,setAgenda,patient,patients,setPatients,procedures,locations});
      }

      const statsStyle={background:P.bg3,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`,textAlign:"center",flex:"1 1 80px"};
      return h("div",null,
        // ── Sumário numérico ──
        h("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}},
          h("div",{style:{...statsStyle,borderColor:"rgba(122,174,212,.3)"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#7aaed4"}},upcoming.length),
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:2}},"Próximas")
          ),
          h("div",{style:{...statsStyle,borderColor:"rgba(122,173,138,.3)"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.green}},statusCount["Realizado"]||0),
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:2}},"Realizadas")
          ),
          h("div",{style:{...statsStyle,borderColor:"rgba(155,122,173,.3)"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#9b7aad"}},statusCount["Reagendado"]||0),
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:2}},"Reagendadas")
          ),
          h("div",{style:{...statsStyle,borderColor:"rgba(192,112,112,.3)"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.red}},(statusCount["Cancelado"]||0)+(statusCount["Faltou"]||0)),
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:2}},"Canceladas / Faltou")
          ),
          h("div",{style:{...statsStyle}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:P.accent}},patAppts.length),
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".08em",marginTop:2}},"Total")
          )
        ),
        // ── Próximas consultas ──
        upcoming.length>0&&h("div",{style:{marginBottom:20}},
          h("div",{style:{fontSize:10,color:"#7aaed4",textTransform:"uppercase",letterSpacing:".12em",fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{width:3,height:14,background:"#7aaed4",borderRadius:2}}),
            "Próximas Consultas"
          ),
          upcoming.map(a=>h(AgendaApptRow,{key:a.id,a,setAgenda,patient,patients,setPatients,procedures,locations}))
        ),
        // ── Histórico ──
        h("div",null,
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".12em",fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{width:3,height:14,background:P.border,borderRadius:2}}),
            "Histórico"
          ),
          past.length===0
            ?h("div",{style:{color:P.text3,fontSize:13,padding:"20px 0"}})
            :past.map(a=>h(AgendaApptRow,{key:a.id,a,setAgenda,patient,patients,setPatients,procedures,locations}))
        ),
        patAppts.length===0&&h(Card,{style:{textAlign:"center",padding:40}},
          h("div",{style:{fontSize:32,marginBottom:12}},"📅"),
          h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma consulta registrada na agenda para esta paciente.")
        )
      );
    })(),
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
        // ── Ficha de Insumos do procedimento: debitada automaticamente do estoque ao salvar ──
        (()=>{
          const procObj=(proceduresFull||[]).find(p=>(typeof p==="string"?p:(p.name||p))===sForm.procedure);
          const fichaInsumos=(procObj&&typeof procObj==="object"&&Array.isArray(procObj.insumos))?procObj.insumos:[];
          if(fichaInsumos.length===0)return null;
          return h("div",{style:{width:"100%",padding:"10px 14px",background:P.card2,borderRadius:8,border:`1px solid ${P.border}`}},
            h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
              h("div",{style:{fontSize:11,color:P.text3,textTransform:"uppercase",letterSpacing:".08em"}},"🧪 Insumos debitados automaticamente"),
              h("label",{style:{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:10.5,color:P.text3}},
                h("input",{type:"checkbox",checked:!!sForm.skipAutoInsumos,onChange:e=>sfv("skipAutoInsumos")(e.target.checked),style:{accentColor:P.rose,cursor:"pointer"}}),
                "não debitar"
              )
            ),
            !sForm.skipAutoInsumos&&h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
              fichaInsumos.map((ins,i)=>{
                const info=(allProducts||[]).find(p=>(typeof p==="string"?p:(p.name||p))===ins.product);
                const disponivel=info?getAvailableLotes(allProducts||[],ins.product).reduce((a,l)=>a+l.qtd,0):0;
                const ok=disponivel>=Number(ins.qty);
                return h("span",{key:i,style:{fontSize:11,padding:"2px 9px",borderRadius:12,background:ok?"rgba(122,173,138,.1)":"rgba(192,112,112,.12)",color:ok?P.green:P.red,border:`1px solid ${ok?"rgba(122,173,138,.25)":"rgba(192,112,112,.3)"}`}},
                  `${ins.product} · ${ins.qty}${info?.unit||""}`+(ok?"":` (saldo: ${disponivel})`)
                );
              })
            ),
            sForm.skipAutoInsumos&&h("div",{style:{fontSize:11,color:P.text3}},"Estoque não será movimentado para este procedimento.")
          );
        })(),
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
        editSess&&h(Field,{label:"Mapa de Aplicação"},
          h("div",{style:{fontSize:12,color:P.text3,padding:"10px 12px",background:P.bg3,borderRadius:8}},"O mapa facial (com foto da paciente) é registrado separadamente. Feche este formulário e clique em \"🗺 Mapa\" no card da sessão para preencher ou editar.")
        )
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12,flexWrap:"wrap"}},h(Btn,{variant:"ghost",onClick:()=>{setShowNewS(false);setEditSess(null);}},"Cancelar"),!editSess&&h("button",{onClick:()=>{saveSession();setTimeout(()=>{setPkgForm(p=>({...p,procedure:sForm.procedure}));setShowNewPkg(true);setTab("pacotes");},100);},style:{padding:"9px 16px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:"transparent",border:"1px solid "+P.gold,color:P.gold}},"📦 Salvar e Criar Pacote"),h(Btn,{onClick:saveSession},editSess?"Salvar":"Salvar Sessão"))
    ),
    showIntercorr&&h(Modal,{open:true,onClose:()=>{setShowIntercorr(null);setIcForm(blankIc);},title:"⚠ Registrar Intercorrência",width:560},
      showIntercorr==="global"&&(patient.sessions||[]).length>0&&h(Field,{label:"Vincular a um Procedimento Realizado (opcional)"},
        h("select",{value:icForm.sessId||"",onChange:e=>applySessionToIcForm(e.target.value),style:IS},
          h("option",{value:""},"— Nenhuma (intercorrência avulsa) —"),
          (patient.sessions||[]).map(s=>h("option",{key:s.id,value:s.id},`${s.date} · ${s.procedure}${s.product?" · "+s.product:""}`))
        )
      ),
      icForm.sessId&&h("div",{style:{fontSize:11.5,color:P.accent,background:"rgba(157,119,97,.08)",border:`1px solid ${P.border}`,borderRadius:8,padding:"6px 12px",marginBottom:12}},`🔗 Vinculado automaticamente: paciente, procedimento, produto e região do atendimento.`),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Tipo",third:true},h(Sel,{value:icForm.type,onChange:icfv("type"),options:INTERCORRENCIA_TYPES})),
        h(Field,{label:"Gravidade",third:true},h(Sel,{value:icForm.severity,onChange:icfv("severity"),options:IC_SEVERITY})),
        h(Field,{label:"Status",third:true},h(Sel,{value:icForm.status,onChange:icfv("status"),options:IC_STATUS_LIST})),
        h(Field,{label:"Procedimento Relacionado",half:true},h(Sel,{value:icForm.procedure,onChange:icfv("procedure"),options:["",...procedures]})),
        h(Field,{label:"Produto Utilizado",half:true},h(Sel,{value:icForm.product,onChange:icfv("product"),options:["",...products]})),
        h(Field,{label:"Região Afetada",half:true},h(Inp,{value:icForm.region,onChange:icfv("region"),placeholder:"Ex: Malar D, Glabela..."})),
        h(Field,{label:"Data do Procedimento",half:true},h(Inp,{type:"date",value:icForm.procedureDate,onChange:icfv("procedureDate")})),
        h(Field,{label:"Data da Intercorrência",half:true},h(Inp,{type:"date",value:icForm.date,onChange:icfv("date")})),
        h(Field,{label:"Próxima Reavaliação",half:true},h(Inp,{type:"date",value:icForm.nextReavaliacao,onChange:icfv("nextReavaliacao")})),
        h(Field,{label:"Descrição"},h(TA,{value:icForm.notes,onChange:icfv("notes"),placeholder:"Descreva a intercorrência...",rows:3})),
        h(Field,{label:"Conduta Inicial Realizada"},h(TA,{value:icForm.conduct,onChange:icfv("conduct"),placeholder:"O que foi feito de imediato (poderá adicionar mais condutas depois)...",rows:2})),
        h(Field,{label:"Fotos"},
          h("label",{style:{fontSize:12,color:P.accent,border:`1px solid ${P.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",display:"inline-block"}},"📷 Selecionar fotos",h("input",{type:"file",accept:"image/*",multiple:true,style:{display:"none"},onChange:e=>setIcForm(p=>({...p,_photoFiles:[...(p._photoFiles||[]),...[...e.target.files]]}))})),
          icForm._photoFiles?.length>0&&h("div",{style:{fontSize:11.5,color:P.text3,marginTop:6}},`${icForm._photoFiles.length} foto(s) selecionada(s)`)
        )
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:12}},h(Btn,{variant:"ghost",onClick:()=>{setShowIntercorr(null);setIcForm(blankIc);}},"Cancelar"),h(Btn,{onClick:saveIntercorrencia},"Registrar"))
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
    ),
    // ─── MODAL: PRESENTEAR COM VOUCHER (criação rápida a partir da ficha) ─────
    setVouchers&&h(Modal,{open:showQuickVoucher,onClose:()=>{setShowQuickVoucher(false);setQvForm(blankQV);},title:"🎁 Presentear "+patient.name,width:560},
      h("div",{style:{marginBottom:16}},
        h("div",{style:{fontSize:11,color:P.text3,marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}},"Escolha o template"),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          _vTemplates.map(t=>h("button",{key:t.k,onClick:()=>qvfv("template")(t.k),style:{padding:"8px 14px",borderRadius:10,fontSize:12,cursor:"pointer",border:`2px solid ${qvForm.template===t.k?P.accent:"transparent"}`,background:t.grad,color:"#fff",fontFamily:"'DM Sans',sans-serif"}},t.l))
        )
      ),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Para",half:true},h(Inp,{value:patient.name,onChange:()=>{},style:{opacity:.7}})),
        h(Field,{label:"De (presenteador)",half:true},h(Inp,{value:qvForm.fromName,onChange:qvfv("fromName"),placeholder:"Quem está presenteando"})),
        h(Field,{label:"Mensagem (opcional)"},h(TA,{value:qvForm.message,onChange:qvfv("message"),placeholder:"Uma mensagem especial...",rows:2})),
        h(Field,{label:"Validade",half:true},h(Inp,{type:"date",value:qvForm.validUntil,onChange:qvfv("validUntil")})),
        h(Field,{label:"Tipo de Voucher",half:true},h(Sel,{value:qvForm.type,onChange:qvfv("type"),options:["valor","procedimento"]})),
      ),
      qvForm.type==="valor"
        ? h(Field,{label:"Valor em Crédito (R$)"},h(Inp,{value:qvForm.value,onChange:qvfv("value"),placeholder:"Ex: 300"}))
        : h("div",{style:{marginTop:4}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}},"Procedimentos incluídos"),
            h("div",{style:{display:"flex",gap:8,marginBottom:8}},
              h(Inp,{value:qvForm.procInput,onChange:qvfv("procInput"),placeholder:"Ex: Toxina Botulínica"}),
              h(Btn,{variant:"ghost",onClick:()=>{if(qvForm.procInput.trim())setQvForm(p=>({...p,procedures:[...p.procedures,p.procInput.trim()],procInput:""}));},style:{flexShrink:0}},"+ Adicionar")
            ),
            h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
              qvForm.procedures.map((p,i)=>h("span",{key:i,style:{display:"flex",alignItems:"center",gap:6,fontSize:12,padding:"4px 10px",borderRadius:14,background:P.rose,color:P.accent3}},p,
                h("span",{onClick:()=>setQvForm(prev=>({...prev,procedures:prev.procedures.filter((_,idx)=>idx!==i)})),style:{cursor:"pointer",fontWeight:700}},"×")
              ))
            )
          ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowQuickVoucher(false);setQvForm(blankQV);}},"Cancelar"),
        h(Btn,{onClick:()=>{
          if(!qvForm.fromName){alert("Informe quem está presenteando.");return;}
          if(qvForm.type==="valor"&&(!qvForm.value||Number(qvForm.value)<=0)){alert("Informe o valor do voucher.");return;}
          if(qvForm.type==="procedimento"&&qvForm.procedures.length===0){alert("Adicione ao menos um procedimento.");return;}
          const nv={
            id:Date.now(), code:genVoucherCode(), createdAt:Date.now(),
            template:qvForm.template, toName:patient.name, fromName:qvForm.fromName,
            message:qvForm.message, validUntil:qvForm.validUntil,
            type:qvForm.type, value:qvForm.type==="valor"?Number(qvForm.value):0, usedValue:0,
            procedures:qvForm.type==="procedimento"?qvForm.procedures:[],
            used:false, status:"ativo", redemptions:[],
          };
          setVouchers(prev=>[...prev,nv]);
          setShowQuickVoucher(false); setQvForm(blankQV);
        }},"Gerar Voucher")
      )
    )
  );
}
// ─── ESTOQUE (com lotes) ──────────────────────────────────────────────────────
const INSUMO_CAT="Insumos/Descartáveis";
function Estoque({products,setProducts}){
  const[subTab,setSubTab]=useState("injetaveis"); // injetaveis | insumos
  const[filter,setFilter]=useState("all");
  const[showNew,setShowNew]=useState(false);
  const[editItem,setEditItem]=useState(null);
  const[showLoteModal,setShowLoteModal]=useState(null); // id do produto
  const[showEntradaInsumo,setShowEntradaInsumo]=useState(null); // id do insumo
  const[entradaQtd,setEntradaQtd]=useState("");
  const[expandedProduct,setExpandedProduct]=useState(null);
  const blank={name:"",cat:"Toxina Botulínica",qty:"",min:"",unit:"U",expiry:"",cost:"",emoji:"💉"};
  const blankInsumo={name:"",qty:"",min:"",unit:"un",cost:"",emoji:"🧰"};
  const blankLote={codigo:"",validade:"",qtd:"",obs:""};
  const[form,setForm]=useState(blank);
  const[insumoForm,setInsumoForm]=useState(blankInsumo);
  const[loteForm,setLoteForm]=useState(blankLote);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const ifv=k=>v=>setInsumoForm(p=>({...p,[k]:v}));
  const lfv=k=>v=>setLoteForm(p=>({...p,[k]:v}));
  const h=createElement;
  const cats=["Toxina Botulínica","Ácido Hialurônico","Bioestimulador","Fios de PDO","Anestésico","Skinbooster","Outros"];
  const stCfg={critical:{color:P.red,bg:"rgba(192,112,112,.12)",l:"⚠ Crítico"},low:{color:P.yellow,bg:"rgba(196,169,106,.12)",l:"⚡ Baixo"},ok:{color:P.green,bg:"rgba(122,173,138,.12)",l:"✓ OK"}};

  // ── Separação dos dois universos: Injetáveis (com lotes/validade) vs Insumos/Descartáveis (cadastro simples) ──
  const injetaveis=products.filter(p=>p.cat!==INSUMO_CAT);
  const insumos=products.filter(p=>p.cat===INSUMO_CAT);

  // Calcula status baseado nos lotes
  function calcStatus(lotes, min) {
    const total = (lotes||[]).reduce((a,l)=>a+l.qtd,0);
    return total === 0 ? "critical" : total < (min||0) ? "low" : "ok";
  }
  function getTotalQty(item) {
    if (item.lotes && item.lotes.length > 0) return item.lotes.reduce((a,l)=>a+l.qtd, 0);
    return item.qty || 0;
  }
  function simpleStatus(item){
    const q=Number(item.qty)||0, min=Number(item.min)||0;
    return q===0?"critical":q<min?"low":"ok";
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

  const visible=(filter==="all"?injetaveis:injetaveis.filter(i=>{
    const st = i.lotes ? calcStatus(i.lotes, i.min) : i.status;
    return st === filter;
  })).slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","pt-BR",{sensitivity:"base"}));

  const visibleInsumos=(filter==="all"?insumos:insumos.filter(i=>simpleStatus(i)===filter))
    .slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","pt-BR",{sensitivity:"base"}));

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

  // ── CRUD simplificado para Insumos/Descartáveis (sem lotes, sem validade obrigatória) ──
  function saveInsumo(){
    const qty=Number(insumoForm.qty)||0, min=Number(insumoForm.min)||0;
    const status=simpleStatus({qty,min});
    if(editItem){
      setProducts(prev=>prev.map(i=>i.id===editItem.id?{...i,...insumoForm,cat:INSUMO_CAT,qty,min,cost:Number(insumoForm.cost)||0,status}:i));
    }else{
      setProducts(prev=>[...prev,{
        id:Date.now(),...insumoForm,cat:INSUMO_CAT,qty,min,cost:Number(insumoForm.cost)||0,status,
        movimentacoes:[{id:Date.now()+1,tipo:"entrada",qtd:qty,data:new Date().toLocaleDateString("pt-BR"),obs:"Entrada inicial"}]
      }]);
    }
    setShowNew(false);setEditItem(null);setInsumoForm(blankInsumo);
  }
  function openEditInsumo(item){setEditItem(item);setInsumoForm({...item,qty:String(item.qty||0),min:String(item.min||0),cost:String(item.cost||0)});setShowNew(true);}
  function saveEntradaInsumo(){
    const qtd=Number(entradaQtd)||0;
    if(qtd<=0)return;
    setProducts(prev=>prev.map(p=>{
      if(p.id!==showEntradaInsumo)return p;
      const newQty=(Number(p.qty)||0)+qtd;
      const mov={id:Date.now(),tipo:"entrada",qtd,data:new Date().toLocaleDateString("pt-BR"),obs:"Reposição de estoque"};
      return {...p,qty:newQty,status:simpleStatus({qty:newQty,min:p.min}),movimentacoes:[...(p.movimentacoes||[]),mov]};
    }));
    setShowEntradaInsumo(null);setEntradaQtd("");
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

  const critical=injetaveis.filter(i=>{
    const st = i.lotes ? calcStatus(i.lotes, i.min) : i.status;
    return st==="critical";
  }).length;
  const totalVal=injetaveis.reduce((a,i)=>a+getTotalQty(i)*(i.cost||0),0);
  const criticalInsumos=insumos.filter(i=>simpleStatus(i)==="critical").length;
  const totalValInsumos=insumos.reduce((a,i)=>a+(Number(i.qty)||0)*(Number(i.cost)||0),0);

  const SUB_TABS=[
    {k:"injetaveis",l:"💉 Injetáveis",count:injetaveis.length},
    {k:"insumos",l:"🧰 Insumos / Descartáveis",count:insumos.length},
  ];

  return h("div",null,
    h(SectionHeader,{title:"Estoque",sub:subTab==="injetaveis"?`${injetaveis.length} produtos injetáveis · ${critical} críticos`:`${insumos.length} insumos · ${criticalInsumos} críticos`,
      action:h("div",{style:{display:"flex",gap:8}},
        subTab==="injetaveis"
          ?h(Btn,{onClick:()=>{setEditItem(null);setForm(blank);setShowNew(true);}},"＋ Novo Injetável")
          :h(Btn,{onClick:()=>{setEditItem(null);setInsumoForm(blankInsumo);setShowNew(true);}},"＋ Novo Insumo")
      )
    }),

    // ── Sub-abas: Injetáveis | Insumos/Descartáveis (cadastros e telas totalmente separados) ──
    h("div",{style:{display:"flex",gap:6,marginBottom:20,borderBottom:`1px solid ${P.border}`,paddingBottom:0}},
      SUB_TABS.map(t=>h("button",{key:t.k,onClick:()=>{setSubTab(t.k);setFilter("all");},style:{padding:"9px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${subTab===t.k?P.rose:"transparent"}`,color:subTab===t.k?P.rose:P.text2,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:subTab===t.k?600:400,marginBottom:-1,transition:"all .15s",display:"flex",alignItems:"center",gap:6}},
        t.l,h("span",{style:{fontSize:10,color:P.text3,background:P.bg3,padding:"1px 7px",borderRadius:20,border:`1px solid ${P.border}`}},t.count)
      ))
    ),

    subTab==="injetaveis"?h(Fragment,null,
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
        [{l:"Nível Crítico",v:critical,c:KPI.red},{l:"Produtos",v:injetaveis.length,c:KPI.blue},{l:"Valor em Estoque",v:fmtCurr(totalVal),c:KPI.green}].map(k=>h(Card,{key:k.l,style:kpiCardStyle(k.c)},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:k.c}},k.v)))
      ),
      h("div",{style:{display:"flex",gap:8,marginBottom:14}},[{k:"all",l:"Todos"},{k:"critical",l:"⚠ Crítico"},{k:"low",l:"⚡ Baixo"},{k:"ok",l:"✓ OK"}].map(f=>h("button",{key:f.k,onClick:()=>setFilter(f.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===f.k?P.rose:"transparent",border:`1px solid ${filter===f.k?P.rose:P.border}`,color:filter===f.k?P.accent3:P.text2}},f.l))),

      // ── Lista de produtos com expansão por lotes ──
      h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        visible.length===0&&h(Card,{style:{textAlign:"center",padding:30,color:P.text3,fontSize:13}},"Nenhum produto injetável cadastrado ainda."),
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
                                h("span",{style:{fontSize:13,color:P.rose,fontWeight:700,letterSpacing:".04em"}},lote.codigo),
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
      )
    ):h(Fragment,null,
      // ── SUB-ABA INSUMOS/DESCARTÁVEIS: cadastro simplificado, sem lotes/validade ──
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
        [{l:"Nível Crítico",v:criticalInsumos,c:KPI.red},{l:"Insumos",v:insumos.length,c:KPI.teal},{l:"Valor em Estoque",v:fmtCurr(totalValInsumos),c:KPI.green}].map(k=>h(Card,{key:k.l,style:kpiCardStyle(k.c)},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:k.c}},k.v)))
      ),
      h("div",{style:{display:"flex",gap:8,marginBottom:14}},[{k:"all",l:"Todos"},{k:"critical",l:"⚠ Crítico"},{k:"low",l:"⚡ Baixo"},{k:"ok",l:"✓ OK"}].map(f=>h("button",{key:f.k,onClick:()=>setFilter(f.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filter===f.k?P.rose:"transparent",border:`1px solid ${filter===f.k?P.rose:P.border}`,color:filter===f.k?P.accent3:P.text2}},f.l))),
      h("div",{style:{fontSize:11,color:P.text3,marginBottom:14}},"Itens de consumo (agulhas, luvas, gaze, anestésico tópico, etc). Cadastro simples — sem controle de lote ou validade."),

      h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        visibleInsumos.length===0&&h(Card,{style:{textAlign:"center",padding:30,color:P.text3,fontSize:13}},"Nenhum insumo cadastrado ainda. Clique em ＋ Novo Insumo."),
        visibleInsumos.map(item=>{
          const st=simpleStatus(item);
          const sc=stCfg[st]||stCfg.ok;
          const pct=Math.min(100,((Number(item.qty)||0)/Math.max((Number(item.min)||1)*1.5,1))*100);
          return h(Card,{key:item.id,style:{border:`1px solid ${sc.color}33`}},
            h("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}},
              h("div",{style:{display:"flex",alignItems:"center",gap:10,flex:"1 1 200px",minWidth:0}},
                h("span",{style:{fontSize:22}},item.emoji||"🧰"),
                h("div",null,
                  h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},item.name),
                  h("div",{style:{fontSize:11,color:P.text3,marginTop:1}},`Custo unit.: ${fmtCurr(item.cost||0)}`)
                )
              ),
              h("div",{style:{textAlign:"center",minWidth:80}},
                h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:sc.color,lineHeight:1}},item.qty||0),
                h("div",{style:{fontSize:10,color:P.text3}},item.unit||"un"),
                h("div",{style:{height:3,borderRadius:2,background:P.bg3,width:60,marginTop:4,overflow:"hidden",margin:"4px auto 0"}},
                  h("div",{style:{height:"100%",width:pct+"%",background:sc.color,borderRadius:2}})
                )
              ),
              h("span",{style:{fontSize:11,padding:"3px 10px",borderRadius:12,color:sc.color,background:sc.bg,flexShrink:0}},sc.l),
              h("div",{style:{display:"flex",gap:6,flexShrink:0}},
                h("button",{onClick:()=>{setShowEntradaInsumo(item.id);setEntradaQtd("");},style:{padding:"6px 12px",borderRadius:8,background:`linear-gradient(135deg,${P.rose},${P.gold})`,color:P.accent3,border:"none",cursor:"pointer",fontSize:12,fontWeight:600}},"＋ Entrada"),
                h("button",{onClick:()=>openEditInsumo(item),style:{width:28,height:28,borderRadius:6,border:`1px solid ${P.border}`,background:"transparent",color:P.accent,cursor:"pointer",fontSize:12}},"✎"),
                h("button",{onClick:()=>del(item.id),style:{width:28,height:28,borderRadius:6,border:"1px solid rgba(192,112,112,.2)",background:"transparent",color:P.red,cursor:"pointer",fontSize:12}},"🗑")
              )
            ),
            (item.movimentacoes||[]).length>0&&h("div",{style:{marginTop:10,paddingTop:10,borderTop:`1px solid ${P.border}`,display:"flex",flexDirection:"column",gap:4}},
              [...(item.movimentacoes||[])].reverse().slice(0,3).map((mov,i)=>
                h("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:11,color:P.text3}},
                  h("span",null,(mov.tipo==="entrada"?"↑ ":"↓ ")+(mov.obs||"")),
                  h("span",null,`${mov.tipo==="entrada"?"+":"-"}${mov.qtd} · ${mov.data}`)
                )
              )
            )
          );
        })
      )
    ),

    // ── Modal: Entrada por Lote (Injetáveis) ──
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

    // ── Modal: Entrada simples (Insumos/Descartáveis) ──
    h(Modal,{open:!!showEntradaInsumo,onClose:()=>{setShowEntradaInsumo(null);setEntradaQtd("");},title:"📦 Entrada de Estoque",width:420},
      (()=>{
        const item=products.find(p=>p.id===showEntradaInsumo);
        if(!item)return null;
        return h("div",null,
          h("div",{style:{padding:"10px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`,marginBottom:16,display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:20}},item.emoji||"🧰"),
            h("div",null,
              h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},item.name),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`Saldo atual: ${item.qty||0} ${item.unit}`)
            )
          ),
          h(Field,{label:`Quantidade a adicionar (${item.unit})`},h(Inp,{type:"number",value:entradaQtd,onChange:setEntradaQtd,placeholder:"0"})),
          entradaQtd&&Number(entradaQtd)>0&&h("div",{style:{marginTop:8,padding:"10px 14px",background:"rgba(122,173,138,.08)",border:"1px solid rgba(122,173,138,.25)",borderRadius:8,fontSize:12,color:P.green}},
            `✓ Novo saldo após entrada: ${(Number(item.qty)||0)+Number(entradaQtd)} ${item.unit}`
          ),
          h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}},
            h(Btn,{variant:"ghost",onClick:()=>{setShowEntradaInsumo(null);setEntradaQtd("");}},"Cancelar"),
            h(Btn,{onClick:saveEntradaInsumo,disabled:!entradaQtd||Number(entradaQtd)<=0},"Confirmar Entrada")
          )
        );
      })()
    ),

    // ── Modal: Novo/Editar Produto Injetável ──
    h(Modal,{open:showNew&&subTab==="injetaveis",onClose:()=>{setShowNew(false);setEditItem(null);},title:editItem?"✎ Editar Produto":"✦ Novo Produto Injetável",width:500},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Nome"},h(Inp,{value:form.name,onChange:fv("name"),placeholder:"Ex: Botox Allergan 100U"})),
        h(Field,{label:"Emoji",half:true},h(Inp,{value:form.emoji,onChange:fv("emoji"),placeholder:"💉"})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:form.cat||"Toxina Botulínica",onChange:fv("cat"),options:cats})),
        h(Field,{label:"Unidade",half:true},h(Sel,{value:form.unit||"U",onChange:fv("unit"),options:["U","ml","un","sir","fr","amp","cx","pct","par","rolo"]})),
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
    ),

    // ── Modal: Novo/Editar Insumo (cadastro simplificado) ──
    h(Modal,{open:showNew&&subTab==="insumos",onClose:()=>{setShowNew(false);setEditItem(null);},title:editItem?"✎ Editar Insumo":"✦ Novo Insumo / Descartável",width:460},
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Nome"},h(Inp,{value:insumoForm.name,onChange:ifv("name"),placeholder:"Ex: Agulha 30G"})),
        h(Field,{label:"Emoji",half:true},h(Inp,{value:insumoForm.emoji,onChange:ifv("emoji"),placeholder:"🧰"})),
        h(Field,{label:"Unidade",half:true},h(Sel,{value:insumoForm.unit||"un",onChange:ifv("unit"),options:["un","par","cx","rolo","pct","ml","fr"]})),
        h(Field,{label:editItem?"Quantidade em Estoque":"Quantidade Inicial",half:true},h(Inp,{type:"number",value:insumoForm.qty,onChange:ifv("qty"),placeholder:"0"})),
        h(Field,{label:"Qtd. Mínima",half:true},h(Inp,{type:"number",value:insumoForm.min,onChange:ifv("min"),placeholder:"10"})),
        h(Field,{label:"Custo Unit. (R$)",half:true},h(Inp,{type:"number",value:insumoForm.cost,onChange:ifv("cost"),placeholder:"0,00"}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowNew(false);setEditItem(null);}},"Cancelar"),
        h(Btn,{onClick:saveInsumo},editItem?"Salvar":"Adicionar")
      )
    )
  );
}

// ─── FINANCEIRO ───────────────────────────────────────────────────────────────
// Parser flexível: aceita DD/MM/YYYY ou YYYY-MM-DD
function parseAnyDate(s){
  if(!s)return null;
  if(s.includes("/")){const[d,m,y]=s.split("/");return new Date(`${y}-${m}-${d}T12:00:00`);}
  if(s.includes("-")){return new Date(s+"T12:00:00");}
  return null;
}
// Monta a data (YYYY-MM-DD) do lançamento de uma regra recorrente num mês/ano específico,
// respeitando o dia configurado e ajustando para o último dia do mês quando necessário (ex: dia 31 em fevereiro)
function recurringDateFor(rule,year,month){
  const lastDay=new Date(year,month+1,0).getDate();
  const day=Math.min(Number(rule.dayOfMonth)||1,lastDay);
  return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}
// Verifica se uma regra recorrente já deveria ter começado a gerar lançamentos no mês/ano informado
function recurringHasStartedBy(rule,year,month){
  if(!rule.startDate)return true;
  const start=parseAnyDate(rule.startDate);
  if(!start)return true;
  const refEnd=new Date(year,month+1,0,23,59,59);
  return start<=refEnd;
}
// A partir das regras recorrentes ativas, gera as despesas que ainda não existem para o mês/ano de referência.
// Retorna apenas os NOVOS lançamentos a serem adicionados (não duplica os que já existem, identificados por recurringId+mês+ano).
function generateRecurringExpenses(rules=[],existingExpenses=[],refDate=new Date()){
  const year=refDate.getFullYear(), month=refDate.getMonth();
  const novas=[];
  (rules||[]).filter(r=>r.active!==false).forEach(rule=>{
    if(!recurringHasStartedBy(rule,year,month))return;
    const jaExiste=existingExpenses.some(e=>e.recurringId===rule.id&&e.recurringMonth===month&&e.recurringYear===year);
    if(jaExiste)return;
    novas.push({
      id:Date.now()+Math.random(),
      desc:rule.desc,
      date:recurringDateFor(rule,year,month),
      cat:rule.cat,
      value:Number(rule.value)||0,
      status:"Pendente",
      notes:rule.notes||"",
      recurringId:rule.id,
      recurringMonth:month,
      recurringYear:year,
    });
  });
  return novas;
}

function Financeiro({patients,setPatients,expenses,setExpenses,recurringExpenses=[],setRecurringExpenses,incomes,setIncomes,settings,goals={},setGoals,procedures=[],proceduresFull=[],products=[]}){
  const[showNewExp,setShowNewExp]=useState(false);
  const[editExp,setEditExp]=useState(null);
  const[showNewInc,setShowNewInc]=useState(false);
  const[editInc,setEditInc]=useState(null);
  const[editRecurring,setEditRecurring]=useState(null);
  const[finTab,setFinTab]=useState("entradas");
  const[viewTab,setViewTab]=useState("resumo"); // resumo | fluxo
  const[exportingPdf,setExportingPdf]=useState(false);
  const now=new Date();
  const[selMonth,setSelMonth]=useState(now.getMonth());
  const[selYear,setSelYear]=useState(now.getFullYear());
  const blankExp={desc:"",date:"",cat:"Outros",value:"",status:"Pago",notes:"",parcelas:"",taxaMaq:"",isRecurring:false,dayOfMonth:String(now.getDate())};
  const blankInc={desc:"",date:"",cat:"Sessão",value:"",payMethod:"Pix",status:"Pago",notes:"",parcelas:"1",taxaMaq:"",patientName:""};
  const[form,setForm]=useState(blankExp);
  const[incForm,setIncForm]=useState(blankInc);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const ifv=k=>v=>setIncForm(p=>({...p,[k]:v}));
  const h=createElement;

  // ── Filtros de Entradas & Despesas ──────────────────────────────────────
  const[filterPeriod,setFilterPeriod]=useState("month"); // month | day | week | quarter | year | custom
  const[filterDateFrom,setFilterDateFrom]=useState("");
  const[filterDateTo,setFilterDateTo]=useState("");
  const[filterSearch,setFilterSearch]=useState("");
  const[filterCat,setFilterCat]=useState("");
  const[filterPayMethod,setFilterPayMethod]=useState("");
  const[filterStatus,setFilterStatus]=useState("");

  function prevMonth(){ if(selMonth===0){setSelMonth(11);setSelYear(y=>y-1);} else setSelMonth(m=>m-1); }
  function nextMonth(){ if(selMonth===11){setSelMonth(0);setSelYear(y=>y+1);} else setSelMonth(m=>m+1); }
  function goToday(){ setSelMonth(now.getMonth()); setSelYear(now.getFullYear()); }
  const isCurrentMonth=selMonth===now.getMonth()&&selYear===now.getFullYear();

  const allS=patients.flatMap((p,i)=>(p.sessions||[]).map(s=>({...s,pname:p.name,pi:i,pid:p.id})));

  // Filtra pelo mês selecionado (usado em resumos, gráficos, DRE, fluxo)
  const inMonth=d=>{ const dt=parseAnyDate(d); return dt&&dt.getMonth()===selMonth&&dt.getFullYear()===selYear; };
  const monthSessions=allS.filter(s=>inMonth(s.date));
  const monthIncomesExtra=incomes.filter(i=>!i.sessRef&&inMonth(i.date));
  const monthExpenses=expenses.filter(e=>inMonth(e.date));

  // ── Função de período para os filtros de lista ───────────────────────────
  function inFilterPeriod(dateStr){
    const dt=parseAnyDate(dateStr);
    if(!dt)return false;
    const today=new Date(); today.setHours(12,0,0,0);
    if(filterPeriod==="day"){
      return dt.toDateString()===today.toDateString();
    }
    if(filterPeriod==="week"){
      const dow=today.getDay();
      const mon=new Date(today); mon.setDate(today.getDate()-dow+1); mon.setHours(0,0,0,0);
      const sun=new Date(mon); sun.setDate(mon.getDate()+6); sun.setHours(23,59,59,999);
      return dt>=mon&&dt<=sun;
    }
    if(filterPeriod==="month") return dt.getMonth()===selMonth&&dt.getFullYear()===selYear;
    if(filterPeriod==="quarter"){
      const q=Math.floor(selMonth/3);
      return Math.floor(dt.getMonth()/3)===q&&dt.getFullYear()===selYear;
    }
    if(filterPeriod==="year") return dt.getFullYear()===selYear;
    if(filterPeriod==="custom"){
      const from=filterDateFrom?new Date(filterDateFrom+"T00:00:00"):null;
      const to=filterDateTo?new Date(filterDateTo+"T23:59:59"):null;
      return (!from||dt>=from)&&(!to||dt<=to);
    }
    return true;
  }

  // Listas filtradas para a aba "Entradas & Despesas"
  const filteredSessions=allS.filter(s=>{
    if(!inFilterPeriod(s.date))return false;
    if(filterSearch&&!(`${s.pname} ${s.procedure}`).toLowerCase().includes(filterSearch.toLowerCase()))return false;
    if(filterPayMethod&&s.payMethod!==filterPayMethod)return false;
    if(filterStatus){
      if(filterStatus==="Pago"&&!s.paid)return false;
      if(filterStatus==="Pendente"&&s.paid)return false;
      if(filterStatus==="Parcial"&&s.finStatus!=="Parcial")return false;
      if(filterStatus==="Cancelado"&&s.finStatus!=="Cancelado")return false;
    }
    return true;
  });
  const filteredIncomesExtra=incomes.filter(i=>{
    if(i.sessRef)return false;
    if(!inFilterPeriod(i.date))return false;
    if(filterSearch&&!(i.desc||i.patientName||"").toLowerCase().includes(filterSearch.toLowerCase()))return false;
    if(filterPayMethod&&i.payMethod!==filterPayMethod)return false;
    if(filterStatus&&i.status!==filterStatus)return false;
    return true;
  });
  const filteredExpenses=expenses.filter(e=>{
    if(!inFilterPeriod(e.date))return false;
    if(filterSearch&&!(e.desc||"").toLowerCase().includes(filterSearch.toLowerCase()))return false;
    if(filterCat&&e.cat!==filterCat)return false;
    if(filterStatus&&e.status!==filterStatus)return false;
    return true;
  });

  const activeFiltersCount=[
    filterPeriod!=="month"?1:0,
    filterSearch?1:0,
    filterCat?1:0,
    filterPayMethod?1:0,
    filterStatus?1:0,
  ].reduce((a,b)=>a+b,0);


  const sessionsRec=monthSessions.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0);
  const incomesRec=monthIncomesExtra.filter(i=>i.status==="Pago").reduce((a,i)=>a+Number(i.value||0),0);
  const received=sessionsRec+incomesRec;
  const pending=monthSessions.filter(s=>!s.paid).reduce((a,s)=>a+Number(s.value||0),0)
    + monthIncomesExtra.filter(i=>i.status!=="Pago").reduce((a,i)=>a+Number(i.value||0),0);
  const totalExp=monthExpenses.reduce((a,e)=>a+Number(e.value||0),0);

  // ── Receita do mês anterior (para % de variação na meta) ──
  const prevMNum=selMonth===0?11:selMonth-1;
  const prevMYear=selMonth===0?selYear-1:selYear;
  const prevMonthReceived=
    allS.filter(s=>s.paid&&(()=>{const dt=parseAnyDate(s.date);return dt&&dt.getMonth()===prevMNum&&dt.getFullYear()===prevMYear;})()).reduce((a,s)=>a+Number(s.value||0),0)
    +incomes.filter(i=>!i.sessRef&&i.status==="Pago"&&(()=>{const dt=parseAnyDate(i.date);return dt&&dt.getMonth()===prevMNum&&dt.getFullYear()===prevMYear;})()).reduce((a,i)=>a+Number(i.value||0),0);

  // Histórico de 5 meses terminando no mês selecionado, para o gráfico de barras
  const months=[];
  for(let k=4;k>=0;k--){
    let mm=selMonth-k, yy=selYear;
    while(mm<0){mm+=12;yy--;}
    const recM=allS.filter(s=>s.paid&&{m:1}&&(()=>{const dt=parseAnyDate(s.date);return dt&&dt.getMonth()===mm&&dt.getFullYear()===yy;})()).reduce((a,s)=>a+Number(s.value||0),0)
      + incomes.filter(i=>!i.sessRef&&i.status==="Pago"&&(()=>{const dt=parseAnyDate(i.date);return dt&&dt.getMonth()===mm&&dt.getFullYear()===yy;})()).reduce((a,i)=>a+Number(i.value||0),0);
    const expM=expenses.filter(e=>(()=>{const dt=parseAnyDate(e.date);return dt&&dt.getMonth()===mm&&dt.getFullYear()===yy;})()).reduce((a,e)=>a+Number(e.value||0),0);
    months.push({m:MONTH_NAMES[mm].slice(0,3),mm,yy,rec:recM,exp:expM,isSel:mm===selMonth&&yy===selYear});
  }

  // ── Fluxo de caixa: saldo acumulado dia a dia dentro do mês selecionado ──
  const daysInMonth=new Date(selYear,selMonth+1,0).getDate();
  const cashEvents=[
    ...monthSessions.filter(s=>s.paid).map(s=>({date:parseAnyDate(s.date),value:Number(s.value||0),type:"entrada",desc:`${s.pname} — ${s.procedure}`})),
    ...monthIncomesExtra.filter(i=>i.status==="Pago").map(i=>({date:parseAnyDate(i.date),value:Number(i.value||0),type:"entrada",desc:i.desc||i.patientName||"Entrada"})),
    ...monthExpenses.filter(e=>e.status!=="Cancelado").map(e=>({date:parseAnyDate(e.date),value:-Number(e.value||0),type:"saida",desc:e.desc})),
  ].filter(ev=>ev.date).sort((a,b)=>a.date-b.date);

  // Saldo inicial: soma de tudo ANTES do mês selecionado (todas as receitas pagas - despesas não canceladas)
  const startOfMonth=new Date(selYear,selMonth,1);
  const priorSessions=allS.filter(s=>s.paid&&parseAnyDate(s.date)&&parseAnyDate(s.date)<startOfMonth).reduce((a,s)=>a+Number(s.value||0),0);
  const priorIncomes=incomes.filter(i=>!i.sessRef&&i.status==="Pago"&&parseAnyDate(i.date)&&parseAnyDate(i.date)<startOfMonth).reduce((a,i)=>a+Number(i.value||0),0);
  const priorExpenses=expenses.filter(e=>e.status!=="Cancelado"&&parseAnyDate(e.date)&&parseAnyDate(e.date)<startOfMonth).reduce((a,e)=>a+Number(e.value||0),0);
  const saldoInicial=priorSessions+priorIncomes-priorExpenses;

  // Constrói linha do tempo diária com saldo acumulado
  let running=saldoInicial;
  const dailyFlow=[];
  for(let d=1;d<=daysInMonth;d++){
    const dayEvents=cashEvents.filter(ev=>ev.date.getDate()===d);
    const dayTotal=dayEvents.reduce((a,e)=>a+e.value,0);
    running+=dayTotal;
    if(dayEvents.length>0||d===daysInMonth)
      dailyFlow.push({day:d,events:dayEvents,dayTotal,saldo:running});
  }
  const saldoFinal=running;

  function toggleFinStatus(pid,sid,newSt){setPatients(prev=>prev.map(p=>p.id!==pid?p:{...p,sessions:(p.sessions||[]).map(s=>s.id!==sid?s:{...s,finStatus:newSt,paid:newSt==="Pago"})}));}
  function saveExp(){
    // Despesa marcada como recorrente: cria/atualiza a REGRA, e lança o mês corrente (se ainda não existir)
    if(form.isRecurring&&!editExp){
      const rule={
        id:Date.now(),
        desc:form.desc,
        cat:form.cat,
        value:Number(form.value)||0,
        dayOfMonth:Number(form.dayOfMonth)||1,
        notes:form.notes||"",
        active:true,
        startDate:form.date||new Date().toISOString().slice(0,10),
      };
      setRecurringExpenses(prev=>[...(Array.isArray(prev)?prev:[]),rule]);
      const novas=generateRecurringExpenses([rule],expenses,new Date());
      if(novas.length>0)setExpenses(prev=>[...prev,...novas]);
    }else if(editExp){
      setExpenses(prev=>prev.map(e=>e.id===editExp.id?{...e,...form,value:Number(form.value)||0}:e));
    }else{
      setExpenses(prev=>[...prev,{...form,id:Date.now(),value:Number(form.value)||0}]);
    }
    setShowNewExp(false);setEditExp(null);setForm(blankExp);
  }
  function toggleRecurringActive(id){setRecurringExpenses(prev=>prev.map(r=>r.id===id?{...r,active:r.active===false?true:false}:r));}
  function delRecurring(id){if(window.confirm("Excluir esta despesa recorrente? Lançamentos já gerados não serão apagados."))setRecurringExpenses(prev=>prev.filter(r=>r.id!==id));}
  function openEditRecurring(r){setEditRecurring(r);}
  function saveRecurringEdit(){
    setRecurringExpenses(prev=>prev.map(r=>r.id===editRecurring.id?{...editRecurring,value:Number(editRecurring.value)||0,dayOfMonth:Number(editRecurring.dayOfMonth)||1}:r));
    setEditRecurring(null);
  }
  const erv=k=>v=>setEditRecurring(p=>({...p,[k]:v}));
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
  function openEditExp(e){setEditExp(e);setForm({...e,value:String(e.value),isRecurring:false,dayOfMonth:String(now.getDate())});setShowNewExp(true);}
  function openEditInc(i){setEditInc(i);setIncForm({...i,value:String(i.value)});setShowNewInc(true);}
  async function handleExportPDF(){
    setExportingPdf(true);
    try{
      await generateFinanceiroPDF({selMonth,selYear,received,sessionsRec,incomesRec,totalExp,pending,months,monthSessions,monthIncomesExtra,monthExpenses,saldoInicial,saldoFinal,dailyFlow},{settings:settings||{}});
    }catch(e){ alert(e.message||"Erro ao gerar o PDF. Tente novamente."); }
    finally{ setExportingPdf(false); }
  }

  return h("div",null,
    h(SectionHeader,{title:"Fluxo de Caixa",sub:"Resumo financeiro completo",action:h(Btn,{variant:"ghost",onClick:handleExportPDF,disabled:exportingPdf,style:{fontSize:12,padding:"8px 16px"}},exportingPdf?"Gerando...":"📄 Exportar PDF")}),

    // ── Navegador de mês ──────────────────────────────────────────────────
    h("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:20,padding:"10px 16px",background:P.card,border:`1px solid ${P.border}`,borderRadius:12}},
      h("button",{onClick:prevMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text2,cursor:"pointer",padding:"6px 12px",fontSize:14}},"←"),
      h("div",{style:{minWidth:180,textAlign:"center"}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},`${MONTH_NAMES[selMonth]} ${selYear}`),
        !isCurrentMonth&&h("button",{onClick:goToday,style:{fontSize:10,color:P.accent,background:"transparent",border:"none",cursor:"pointer",textDecoration:"underline",marginTop:2}},"voltar para o mês atual")
      ),
      h("button",{onClick:nextMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text2,cursor:"pointer",padding:"6px 12px",fontSize:14}},"→")
    ),

    setGoals&&h(MetaFaturamento,{received,selMonth,selYear,goals:goals||{},setGoals,prevMonthReceived}),
    setGoals&&h(MetaPorProcedimento,{procedures,patients,selMonth,selYear,goals:goals||{},setGoals}),

    h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Receita do Mês",v:fmtCurr(received),c:P.accent},{l:"Despesas do Mês",v:fmtCurr(totalExp),c:P.red},{l:"Lucro Líquido",v:fmtCurr(received-totalExp),c:P.green},{l:"A Receber",v:fmtCurr(pending),c:P.yellow}].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:k.c}},k.v)))
    ),

    h(Card,{style:{marginBottom:18}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Receita vs Despesas (últimos 5 meses)"),
      h("div",{style:{display:"flex",alignItems:"flex-end",gap:12,height:90}},
        months.map(m=>{const mx=Math.max(...months.map(x=>Math.max(x.rec,x.exp)),1);return h("div",{key:m.m+m.yy,onClick:()=>{setSelMonth(m.mm);setSelYear(m.yy);},style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}},
          h("div",{style:{flex:1,display:"flex",alignItems:"flex-end",gap:3,width:"100%"}},
            h("div",{style:{flex:1,height:`${(m.rec/mx)*100}%`,background:`linear-gradient(to top,${P.rose},${P.gold})`,borderRadius:"3px 3px 0 0",opacity:m.isSel?1:.55}}),
            h("div",{style:{flex:1,height:`${(m.exp/mx)*100}%`,background:`linear-gradient(to top,${P.red},rgba(192,112,112,.3))`,borderRadius:"3px 3px 0 0",opacity:m.isSel?1:.55}})
          ),
          h("div",{style:{fontSize:9,color:m.isSel?P.accent:P.text3,textTransform:"uppercase",fontWeight:m.isSel?700:400}},m.m)
        );})
      )
    ),

    // ── Abas: Resumo / Fluxo / DRE / Inadimplência ──────────────────────────
    h("div",{style:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}},
      h("button",{onClick:()=>setViewTab("resumo"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="resumo"?P.rose:"transparent",border:`1px solid ${viewTab==="resumo"?P.rose:P.border}`,color:viewTab==="resumo"?P.accent3:P.text2}},"Entradas & Despesas"),
      h("button",{onClick:()=>setViewTab("fluxo"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="fluxo"?P.rose:"transparent",border:`1px solid ${viewTab==="fluxo"?P.rose:P.border}`,color:viewTab==="fluxo"?P.accent3:P.text2}},"💵 Fluxo de Caixa"),

      h("button",{onClick:()=>setViewTab("dre"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="dre"?P.rose:"transparent",border:`1px solid ${viewTab==="dre"?P.rose:P.border}`,color:viewTab==="dre"?P.accent3:P.text2}},"📊 DRE & Pagamentos"),
      h("button",{onClick:()=>setViewTab("inadimplencia"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="inadimplencia"?P.rose:"transparent",border:`1px solid ${viewTab==="inadimplencia"?P.rose:P.border}`,color:viewTab==="inadimplencia"?P.accent3:P.text2}},"⚠ Inadimplência"),
      h("button",{onClick:()=>setViewTab("recorrentes"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="recorrentes"?P.rose:"transparent",border:`1px solid ${viewTab==="recorrentes"?P.rose:P.border}`,color:viewTab==="recorrentes"?P.accent3:P.text2}},`🔁 Recorrentes${recurringExpenses.length?` (${recurringExpenses.length})`:""}`),
      h("button",{onClick:()=>setViewTab("margem"),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:viewTab==="margem"?P.rose:"transparent",border:`1px solid ${viewTab==="margem"?P.rose:P.border}`,color:viewTab==="margem"?P.accent3:P.text2}},"📐 Margem por Procedimento")
    ),

    viewTab==="fluxo"?h(Card,null,
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
        h("div",null,
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Fluxo de Caixa Diário"),
          h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},`Saldo inicial em ${MONTH_NAMES[selMonth]}: `,h("span",{style:{color:saldoInicial>=0?P.green:P.red,fontWeight:600}},fmtCurr(saldoInicial)))
        ),
        h("div",{style:{textAlign:"right"}},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase"}},"Saldo Final do Mês"),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:saldoFinal>=0?P.green:P.red}},fmtCurr(saldoFinal))
        )
      ),
      dailyFlow.length===0?h("div",{style:{textAlign:"center",color:P.text3,fontSize:13,padding:30}},"Sem movimentações neste mês"):
      h("div",{style:{maxHeight:480,overflowY:"auto"}},
        dailyFlow.map(df=>h("div",{key:df.day,style:{padding:"10px 0",borderBottom:`1px solid ${P.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:df.events.length?6:0}},
            h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},`Dia ${String(df.day).padStart(2,"0")}`),
            h("div",{style:{display:"flex",gap:14,alignItems:"baseline"}},
              df.dayTotal!==0&&h("span",{style:{fontSize:12,color:df.dayTotal>=0?P.green:P.red}},(df.dayTotal>=0?"+ ":"− ")+fmtCurr(Math.abs(df.dayTotal))),
              h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:df.saldo>=0?P.text:P.red}},"Saldo: "+fmtCurr(df.saldo))
            )
          ),
          df.events.map((ev,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:11.5,color:P.text3,padding:"2px 0 2px 10px"}},
            h("span",null,(ev.type==="entrada"?"↑ ":"↓ ")+ev.desc),
            h("span",{style:{color:ev.type==="entrada"?P.green:P.red}},(ev.value>=0?"+":"")+fmtCurr(ev.value))
          ))
        ))
      )
    ):
    // ── Barra de filtros ─────────────────────────────────────────────────────
    h("div",{style:{padding:"14px 16px",background:P.card,border:`1px solid ${P.border}`,borderRadius:12,marginBottom:16}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}},
        h("div",{style:{display:"flex",alignItems:"center",gap:8}},
          h("span",{style:{fontSize:13,color:P.text,fontWeight:600}},"Filtros"),
          activeFiltersCount>0&&h("span",{style:{fontSize:10,padding:"2px 8px",borderRadius:20,background:P.rose,color:P.accent3,fontWeight:700}},activeFiltersCount+" ativo"+(activeFiltersCount>1?"s":""))
        ),
        activeFiltersCount>0&&h("button",{onClick:()=>{setFilterPeriod("month");setFilterSearch("");setFilterCat("");setFilterPayMethod("");setFilterStatus("");setFilterDateFrom("");setFilterDateTo("");},style:{fontSize:11,color:P.text3,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 10px",cursor:"pointer"}},"✕ Limpar")
      ),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}},
        [["month","Mês atual"],["day","Hoje"],["week","Esta semana"],["quarter","Trimestre"],["year","Este ano"],["custom","Personalizado"]].map(([k,l])=>
          h("button",{key:k,onClick:()=>setFilterPeriod(k),style:{fontSize:11.5,padding:"5px 12px",borderRadius:20,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1px solid ${filterPeriod===k?P.rose:P.border}`,background:filterPeriod===k?P.rose:"transparent",color:filterPeriod===k?P.accent3:P.text2}},l)
        )
      ),
      filterPeriod==="custom"&&h("div",{style:{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}},
        h("div",{style:{display:"flex",alignItems:"center",gap:6}},
          h("span",{style:{fontSize:11,color:P.text3}},"De"),
          h("input",{type:"date",value:filterDateFrom,onChange:e=>setFilterDateFrom(e.target.value),style:{fontSize:12,padding:"5px 8px",borderRadius:8,border:`1px solid ${P.border}`,background:P.bg3,color:P.text,fontFamily:"'DM Sans',sans-serif"}})
        ),
        h("div",{style:{display:"flex",alignItems:"center",gap:6}},
          h("span",{style:{fontSize:11,color:P.text3}},"até"),
          h("input",{type:"date",value:filterDateTo,onChange:e=>setFilterDateTo(e.target.value),style:{fontSize:12,padding:"5px 8px",borderRadius:8,border:`1px solid ${P.border}`,background:P.bg3,color:P.text,fontFamily:"'DM Sans',sans-serif"}})
        )
      ),
      h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
        h("input",{type:"text",placeholder:"🔍 Buscar por descrição / paciente...",value:filterSearch,onChange:e=>setFilterSearch(e.target.value),style:{flex:"1 1 200px",fontSize:12,padding:"7px 12px",borderRadius:8,border:`1px solid ${filterSearch?P.rose:P.border}`,background:P.bg3,color:P.text,fontFamily:"'DM Sans',sans-serif",outline:"none"}}),
        h("select",{value:filterCat,onChange:e=>setFilterCat(e.target.value),style:{fontSize:12,padding:"7px 10px",borderRadius:8,border:`1px solid ${filterCat?P.rose:P.border}`,background:P.bg3,color:filterCat?P.text:P.text3,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}},
          h("option",{value:""},"Categoria"),
          EXPENSE_CATS.map(c=>h("option",{key:c,value:c},c))
        ),
        h("select",{value:filterPayMethod,onChange:e=>setFilterPayMethod(e.target.value),style:{fontSize:12,padding:"7px 10px",borderRadius:8,border:`1px solid ${filterPayMethod?P.rose:P.border}`,background:P.bg3,color:filterPayMethod?P.text:P.text3,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}},
          h("option",{value:""},"Pagamento"),
          PAY_METHODS.map(m=>h("option",{key:m,value:m},m))
        ),
        h("select",{value:filterStatus,onChange:e=>setFilterStatus(e.target.value),style:{fontSize:12,padding:"7px 10px",borderRadius:8,border:`1px solid ${filterStatus?P.rose:P.border}`,background:P.bg3,color:filterStatus?P.text:P.text3,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}},
          h("option",{value:""},"Status"),
          FIN_STATUS.map(s=>h("option",{key:s,value:s},s))
        )
      ),
      h("div",{style:{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}},
        h("span",{style:{fontSize:11,color:P.text3}},"Exibindo:"),
        h("span",{style:{fontSize:11,color:P.green,fontWeight:600}},`↑ ${fmtCurr(filteredSessions.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0)+filteredIncomesExtra.filter(i=>i.status==="Pago").reduce((a,i)=>a+Number(i.value||0),0))} recebido`),
        h("span",{style:{fontSize:11,color:P.red,fontWeight:600}},`↓ ${fmtCurr(filteredExpenses.reduce((a,e)=>a+Number(e.value||0),0))} em despesas`),
        h("span",{style:{fontSize:11,color:P.text3}},`${filteredSessions.length+filteredIncomesExtra.length} entrada(s) · ${filteredExpenses.length} despesa(s)`)
      )
    ),

    h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Entradas"),
          h(Btn,{onClick:()=>{setEditInc(null);setIncForm(blankInc);setShowNewInc(true);},style:{fontSize:12,padding:"6px 14px"}},"＋ Entrada Extra")
        ),
        h("div",{style:{marginBottom:10}},h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},h("div",null,h("div",{style:{fontSize:11,color:P.text3}},"🔄 Sessões auto-sincronizadas do prontuário"),h("div",{style:{fontSize:10,color:P.text3,marginTop:1}},filteredSessions.length+" resultado(s)")),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.green}},fmtCurr(filteredSessions.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0))))),
        filteredSessions.length===0&&h("div",{style:{textAlign:"center",color:P.text3,fontSize:12,padding:"10px 0"}},"Nenhuma sessão no período"),
        filteredSessions.slice().sort((a,b)=>(parseAnyDate(b.date)||0)-(parseAnyDate(a.date)||0)).map((s,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`}},
          h("div",null,h("div",{style:{fontSize:13,color:P.text}},`${s.pname} — ${s.procedure}`),h("div",{style:{fontSize:11,color:P.text3}},`${s.date} · ${s.payMethod}${s.payMethod==="Cartão Crédito"&&s.parcelas>1?" · "+s.parcelas+"x de "+fmtCurr(s.value/s.parcelas):""}`)  ),
          h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{textAlign:"right"}},
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:s.paid?P.green:P.yellow}},fmtCurr(s.value)),
              s.payMethod==="Cartão Crédito"&&s.parcelas>1&&h("div",{style:{fontSize:10,color:P.accent,fontWeight:600}},`${s.parcelas}x ${fmtCurr(s.value/s.parcelas)}`)
            ),
            h("select",{value:s.finStatus||"Pendente",onChange:e=>toggleFinStatus(s.pid,s.id,e.target.value),style:{fontSize:10,padding:"3px 8px",borderRadius:10,color:s.paid?P.green:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},FIN_STATUS.map(st=>h("option",{key:st,value:st},st)))
          )
        )),
        filteredIncomesExtra.length>0&&h("div",null,
          h("div",{style:{fontSize:11,color:P.text3,margin:"10px 0 6px"}},"＋ Entradas extras (não vinculadas a sessões):"),
          filteredIncomesExtra.map((inc,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}`}},
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
        filteredExpenses.length===0&&h("div",{style:{textAlign:"center",color:P.text3,fontSize:12,padding:"10px 0"}},"Nenhuma despesa no período"),
        filteredExpenses.slice().sort((a,b)=>(parseAnyDate(b.date)||0)-(parseAnyDate(a.date)||0)).map((e,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${P.border}`}},
          h("div",null,h("div",{style:{fontSize:13,color:P.text}},e.desc),h("div",{style:{fontSize:11,color:P.text3}},`${e.date} · ${e.cat}`)),
          h("div",{style:{display:"flex",alignItems:"center",gap:8}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.red}},`− ${fmtCurr(e.value)}`),
            h("button",{onClick:()=>openEditExp(e),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
            h("button",{onClick:()=>delExp(e.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
          )
        )),
        h("div",{style:{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px solid ${P.border}`}},h("span",{style:{fontSize:12,color:P.text3}},"Total no período"),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:P.red}},`− ${fmtCurr(filteredExpenses.reduce((a,e)=>a+Number(e.value||0),0))}`))
      )
    ),

    // ── ABA: DRE & Pagamentos ───────────────────────────────────────────────
    viewTab==="dre"&&(()=>{
      // ── DRE ──
      const recBruta=received; // receita bruta do mês (pagas)
      const pendencias=pending;
      const totalDescontos=monthSessions.filter(s=>s.paid&&s.payMethod==="Cartão Crédito"&&s.taxaMaq>0).reduce((a,s)=>a+(Number(s.value||0)*Number(s.taxaMaq||0)/100),0)
        + monthIncomesExtra.filter(i=>i.status==="Pago"&&i.payMethod==="Cartão Crédito"&&i.taxaMaq>0).reduce((a,i)=>a+(Number(i.value||0)*Number(i.taxaMaq||0)/100),0);
      const recLiquida=recBruta-totalDescontos;
      // Custo de produtos: despesas categoria Produtos do mês
      const custoProdutos=monthExpenses.filter(e=>e.cat==="Produtos"&&e.status!=="Cancelado").reduce((a,e)=>a+Number(e.value||0),0);
      const lucroBruto=recLiquida-custoProdutos;
      const margemBruta=recLiquida>0?Math.round((lucroBruto/recLiquida)*100):0;
      // Despesas operacionais (tudo exceto Produtos)
      const despOper=monthExpenses.filter(e=>e.cat!=="Produtos"&&e.status!=="Cancelado").reduce((a,e)=>a+Number(e.value||0),0);
      const ebitda=lucroBruto-despOper;
      const margemEbitda=recLiquida>0?Math.round((ebitda/recLiquida)*100):0;
      // Despesas por categoria
      const catExp={};
      monthExpenses.filter(e=>e.status!=="Cancelado").forEach(e=>{catExp[e.cat]=(catExp[e.cat]||0)+Number(e.value||0);});
      const catExpList=Object.entries(catExp).sort((a,b)=>b[1]-a[1]);
      const maxCatExp=catExpList[0]?.[1]||1;

      // ── Conciliação por forma de pagamento ──
      const pmData={};
      [...monthSessions.filter(s=>s.paid),...monthIncomesExtra.filter(i=>i.status==="Pago")].forEach(s=>{
        const pm=s.payMethod||"Outro";
        if(!pmData[pm])pmData[pm]={bruto:0,taxa:0,count:0};
        const bruto=Number(s.value||0);
        const taxa=s.payMethod==="Cartão Crédito"&&s.taxaMaq>0?bruto*Number(s.taxaMaq||0)/100:0;
        pmData[pm].bruto+=bruto; pmData[pm].taxa+=taxa; pmData[pm].count++;
      });
      const pmList=Object.entries(pmData).sort((a,b)=>b[1].bruto-a[1].bruto);
      const pmColors2={"Pix":P.green,"Cartão Crédito":"#7aaed4","Cartão Débito":"#5a8aad","Dinheiro":P.accent,"Transferência":P.rose2,"Pendente":P.yellow};

      // ── Pendências abertas por forma de pagamento ──
      const pmPending={};
      [...monthSessions.filter(s=>!s.paid),...monthIncomesExtra.filter(i=>i.status!=="Pago")].forEach(s=>{
        const pm=s.payMethod||"Pendente";
        if(!pmPending[pm])pmPending[pm]={valor:0,count:0};
        pmPending[pm].valor+=Number(s.value||0); pmPending[pm].count++;
      });
      const pmPendList=Object.entries(pmPending).sort((a,b)=>b[1].valor-a[1].valor);

      const DRERow=({label,value,indent,bold,divider,color,small})=>h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:divider?"8px 0":"5px 0",borderTop:divider?`1px solid ${P.border}`:"none",marginLeft:indent?16:0}},
        h("span",{style:{fontSize:small?11:13,color:bold?P.text:P.text2,fontWeight:bold?600:400}},label),
        h("span",{style:{fontSize:bold?16:13,fontFamily:bold?"'Cormorant Garamond',serif":"'DM Sans',sans-serif",color:color||(value>=0?P.text:P.red),fontWeight:bold?600:400}},
          value===null?"—":(value>=0?fmtCurr(value):`− ${fmtCurr(Math.abs(value))}`)
        )
      );

      return h("div",{style:{display:"flex",flexDirection:"column",gap:18}},
        // ── DRE ──
        h(Card,null,
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}},
            h("div",null,
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:P.text}},"DRE — Demonstrativo de Resultado"),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`${MONTH_NAMES[selMonth]} de ${selYear}`)
            ),
            h("div",{style:{display:"flex",gap:8}},
              h("span",{style:{padding:"4px 12px",borderRadius:20,fontSize:11,background:ebitda>=0?"rgba(122,173,138,.14)":"rgba(192,112,112,.14)",color:ebitda>=0?P.green:P.red,fontWeight:600}},ebitda>=0?"✓ Resultado positivo":"⚠ Resultado negativo")
            )
          ),
          h(DRERow,{label:"(+) Receita Bruta",value:recBruta,bold:true,color:P.green}),
          totalDescontos>0&&h(DRERow,{label:"(−) Taxas de cartão / máquina",value:-totalDescontos,indent:true,small:true}),
          h(DRERow,{label:"(=) Receita Líquida",value:recLiquida,bold:true,divider:true,color:P.accent}),
          h(DRERow,{label:"(−) Custo de Produtos (CMV)",value:-custoProdutos,indent:true}),
          h(DRERow,{label:"(=) Lucro Bruto",value:lucroBruto,bold:true,divider:true,color:lucroBruto>=0?P.green:P.red}),
          h("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:4}},
            h("span",{style:{fontSize:11,color:P.text3}},`Margem bruta: `,h("span",{style:{color:margemBruta>=40?P.green:margemBruta>=20?P.yellow:P.red,fontWeight:600}},margemBruta+"%"))
          ),
          h("div",{style:{fontSize:11,color:P.text3,marginBottom:8,marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}},"Despesas Operacionais"),
          catExpList.map(([cat,val])=>h(DRERow,{key:cat,label:`• ${cat}`,value:-val,indent:true,small:true})),
          h(DRERow,{label:"(−) Total Despesas Operacionais",value:-despOper,divider:true}),
          h(DRERow,{label:"(=) EBITDA / Resultado Operacional",value:ebitda,bold:true,divider:true,color:ebitda>=0?P.green:P.red}),
          h("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:2}},
            h("span",{style:{fontSize:11,color:P.text3}},`Margem EBITDA: `,h("span",{style:{color:margemEbitda>=30?P.green:margemEbitda>=10?P.yellow:P.red,fontWeight:600}},margemEbitda+"%"))
          ),
          pendencias>0&&h("div",{style:{marginTop:16,padding:"12px 14px",borderRadius:10,background:"rgba(196,169,106,.08)",border:`1px solid ${P.yellow}44`}},
            h("div",{style:{fontSize:11,color:P.yellow,fontWeight:600,marginBottom:2}},"⏳ Receita pendente de recebimento"),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.yellow}},fmtCurr(pendencias)),
            h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},"Se recebido, EBITDA seria "+fmtCurr(ebitda+pendencias))
          )
        ),

        // ── Conciliação por método de pagamento ──
        h(Card,null,
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.text,marginBottom:4}},"Conciliação por Forma de Pagamento"),
          h("div",{style:{fontSize:12,color:P.text3,marginBottom:16}},`Entradas recebidas em ${MONTH_NAMES[selMonth]}`),
          pmList.length===0
            ?h("div",{style:{textAlign:"center",color:P.text3,fontSize:12,padding:20}},"Sem recebimentos neste mês")
            :h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
              pmList.map(([pm,d])=>{
                const col=pmColors2[pm]||P.accent;
                const liquido=d.bruto-d.taxa;
                const pct=Math.round((d.bruto/received)*100);
                return h("div",{key:pm,style:{padding:"12px 14px",borderRadius:10,background:P.bg3,border:`1px solid ${P.border}`}},
                  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
                    h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                      h("div",{style:{width:10,height:10,borderRadius:"50%",background:col,flexShrink:0}}),
                      h("span",{style:{fontSize:13,color:P.text,fontWeight:500}},pm),
                      h("span",{style:{fontSize:11,color:P.text3}},d.count+" transação"+(d.count>1?"ões":""))
                    ),
                    h("div",{style:{textAlign:"right"}},
                      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:col}},fmtCurr(d.bruto)),
                      d.taxa>0&&h("div",{style:{fontSize:10,color:P.text3}},`Líq. após taxa: ${fmtCurr(liquido)}`)
                    )
                  ),
                  h("div",{style:{height:4,borderRadius:2,background:P.border,overflow:"hidden"}},
                    h("div",{style:{height:"100%",width:pct+"%",background:col,borderRadius:2,transition:"width .4s"}})
                  ),
                  h("div",{style:{fontSize:10,color:P.text3,marginTop:4,textAlign:"right"}},pct+"% do recebido")
                );
              }),
              totalDescontos>0&&h("div",{style:{marginTop:4,padding:"10px 14px",borderRadius:10,background:"rgba(192,112,112,.06)",border:`1px solid ${P.red}33`}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                  h("span",{style:{fontSize:12,color:P.text3}},"Total perdido em taxas de cartão"),
                  h("span",{style:{fontSize:14,color:P.red,fontWeight:600}},`− ${fmtCurr(totalDescontos)}`)
                )
              )
            ),
          pmPendList.length>0&&h("div",{style:{marginTop:16}},
            h("div",{style:{fontSize:11,color:P.yellow,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}},"⏳ Pendentes de recebimento"),
            h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
              pmPendList.map(([pm,d])=>h("div",{key:pm,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:8,background:"rgba(196,169,106,.06)",border:`1px solid ${P.yellow}22`}},
                h("span",{style:{fontSize:12,color:P.text2}},pm+" · "+d.count+" pendente"+(d.count>1?"s":"")),
                h("span",{style:{fontSize:13,color:P.yellow,fontWeight:600}},fmtCurr(d.valor))
              ))
            )
          )
        )
      );
    })(),

    // ── ABA: Inadimplência ─────────────────────────────────────────────────
    viewTab==="inadimplencia"&&(()=>{
      const today=new Date();
      // Coleta todas as sessões não pagas de todos os meses
      const allUnpaid=patients.flatMap(p=>(p.sessions||[])
        .filter(s=>!s.paid||(s.finStatus&&s.finStatus!=="Pago"&&s.finStatus!=="Cancelado"))
        .map(s=>({...s,pname:p.name,pid:p.id,pphone:p.phone,pemail:p.email,pstatus:p.status}))
      );
      // Agrupa por paciente
      const byPatient={};
      allUnpaid.forEach(s=>{
        if(!byPatient[s.pid])byPatient[s.pid]={pid:s.pid,pname:s.pname,pphone:s.pphone,pemail:s.pemail,pstatus:s.pstatus,sessions:[],total:0,oldest:null};
        byPatient[s.pid].sessions.push(s);
        byPatient[s.pid].total+=Number(s.value||0);
        const d=parseAnyDate(s.date);
        if(d&&(!byPatient[s.pid].oldest||d<byPatient[s.pid].oldest))byPatient[s.pid].oldest=d;
      });
      const inadList=Object.values(byPatient).sort((a,b)=>b.total-a.total);
      const totalInad=inadList.reduce((a,p)=>a+p.total,0);
      const avgDays=inadList.length>0?Math.round(inadList.filter(p=>p.oldest).reduce((a,p)=>a+Math.floor((today-p.oldest)/864e5),0)/Math.max(inadList.filter(p=>p.oldest).length,1)):0;

      // Sessões do mês atual pendentes
      const monthPend=monthSessions.filter(s=>!s.paid).length;

      function urgencia(oldest){
        if(!oldest)return{l:"Recente",c:P.yellow,bg:"rgba(196,169,106,.12)"};
        const dias=Math.floor((today-oldest)/864e5);
        if(dias>90)return{l:">90 dias",c:P.red,bg:"rgba(192,112,112,.14)"};
        if(dias>30)return{l:`${dias} dias`,c:P.yellow,bg:"rgba(196,169,106,.12)"};
        return{l:`${dias} dias`,c:P.accent,bg:`rgba(157,119,97,.1)`};
      }

      return h("div",null,
        // KPIs
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Devedoras",v:String(inadList.length)+" pacientes",c:P.red},
            {l:"Total em Aberto",v:fmtCurr(totalInad),c:P.yellow},
            {l:"Atraso médio",v:avgDays+" dias",c:avgDays>60?P.red:P.yellow}
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:k.c}},k.v)
          ))
        ),
        inadList.length===0
          ?h(Card,{style:{textAlign:"center",padding:40}},
              h("div",{style:{fontSize:32,marginBottom:12}},"✓"),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.green,marginBottom:6}},"Nenhuma inadimplência"),
              h("div",{style:{fontSize:13,color:P.text3}},"Todas as sessões registradas foram pagas.")
            )
          :h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
            inadList.map(p=>{
              const urg=urgencia(p.oldest);
              return h(Card,{key:p.pid,style:{border:`1px solid ${urg.c}33`}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}},
                  h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                    h("div",{style:{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${P.rose},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:P.accent3,flexShrink:0}},
                      p.pname.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()
                    ),
                    h("div",null,
                      h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},p.pname),
                      p.pphone&&h("div",{style:{fontSize:11,color:P.text3}},p.pphone)
                    )
                  ),
                  h("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}},
                    h("span",{style:{fontSize:11,padding:"3px 10px",borderRadius:20,background:urg.bg,color:urg.c,fontWeight:600}},urg.l),
                    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.red}},fmtCurr(p.total))
                  )
                ),
                h("div",{style:{display:"flex",flexDirection:"column",gap:4}},
                  p.sessions.map((s,i)=>h("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:12,color:P.text2,padding:"5px 10px",borderRadius:7,background:P.bg3}},
                    h("span",null,`${s.date} — ${s.procedure}`),
                    h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                      h("span",{style:{color:P.yellow}},fmtCurr(s.value)),
                      h("select",{value:s.finStatus||"Pendente",onChange:e=>{const newSt=e.target.value;setPatients(prev=>prev.map(pat=>pat.id!==p.pid?pat:{...pat,sessions:(pat.sessions||[]).map(ses=>ses.id!==s.id?ses:{...ses,finStatus:newSt,paid:newSt==="Pago"})}));},style:{fontSize:10,padding:"2px 6px",borderRadius:8,color:P.yellow,background:P.bg3,border:`1px solid ${P.border}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},
                        FIN_STATUS.map(st=>h("option",{key:st,value:st},st))
                      )
                    )
                  ))
                ),
                h("div",{style:{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}},
                  p.pphone&&h("a",{href:`https://wa.me/55${p.pphone.replace(/\D/g,"")}?text=Olá ${p.pname.split(" ")[0]}, tudo bem? Passando para lembrar sobre o pagamento pendente de ${fmtCurr(p.total)} referente à(s) sua(s) sessão(ões). Ficamos à disposição!`,target:"_blank",rel:"noopener noreferrer",style:{fontSize:12,padding:"6px 14px",borderRadius:8,background:"rgba(122,173,138,.15)",border:"1px solid rgba(122,173,138,.3)",color:P.green,textDecoration:"none",cursor:"pointer"}},"💬 WhatsApp"),
                  p.pemail&&h("a",{href:`mailto:${p.pemail}?subject=Lembrete de pagamento&body=Olá ${p.pname.split(" ")[0]}, tudo bem?%0A%0APassando para lembrar sobre o pagamento pendente de ${fmtCurr(p.total)}.%0A%0AAbraços!`,style:{fontSize:12,padding:"6px 14px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,textDecoration:"none"}},"✉ E-mail")
                )
              );
            })
          )
      );
    })(),

    viewTab==="recorrentes"&&(()=>{
      const ativas=recurringExpenses.filter(r=>r.active!==false);
      const pausadas=recurringExpenses.filter(r=>r.active===false);
      const totalMensal=ativas.reduce((a,r)=>a+Number(r.value||0),0);
      function RecurringRow(r){
        const isPaused=r.active===false;
        return h(Card,{key:r.id,style:{opacity:isPaused?.6:1}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}},
            h("div",null,
              h("div",{style:{display:"flex",alignItems:"center",gap:8}},
                h("span",{style:{fontSize:14,color:P.text,fontWeight:600}},r.desc),
                isPaused&&h("span",{style:{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(192,112,112,.12)",color:P.red}},"Pausada")
              ),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:3}},`${r.cat} · todo dia ${r.dayOfMonth} · desde ${r.startDate||"—"}`),
              r.notes&&h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},r.notes)
            ),
            h("div",{style:{display:"flex",alignItems:"center",gap:8}},
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.red}},fmtCurr(r.value)),
              h("button",{onClick:()=>toggleRecurringActive(r.id),title:isPaused?"Reativar":"Pausar",style:{fontSize:11,color:isPaused?P.green:P.yellow,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},isPaused?"▶":"⏸"),
              h("button",{onClick:()=>openEditRecurring(r),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"✎"),
              h("button",{onClick:()=>delRecurring(r.id),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.2)",borderRadius:6,padding:"3px 7px",cursor:"pointer"}},"🗑")
            )
          )
        );
      }
      return h("div",null,
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Recorrências Ativas",v:String(ativas.length),c:P.text},
            {l:"Comprometido por mês",v:fmtCurr(totalMensal),c:P.red},
            {l:"Pausadas",v:String(pausadas.length),c:P.yellow}
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:k.c}},k.v)
          ))
        ),
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
          h("div",{style:{fontSize:12,color:P.text3}},"Despesas fixas (aluguel, contador, etc.) lançadas automaticamente todo mês como Pendente."),
          h(Btn,{onClick:()=>{setEditExp(null);setForm({...blankExp,isRecurring:true});setShowNewExp(true);},style:{fontSize:12,padding:"6px 14px",flexShrink:0}},"＋ Recorrente")
        ),
        recurringExpenses.length===0
          ?h(Card,{style:{textAlign:"center",padding:40}},
              h("div",{style:{fontSize:32,marginBottom:12}},"🔁"),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text,marginBottom:6}},"Nenhuma despesa recorrente"),
              h("div",{style:{fontSize:13,color:P.text3}},"Cadastre aluguel, contador e outras contas fixas para que sejam lançadas automaticamente todo mês.")
            )
          :h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
              ativas.map(RecurringRow),
              pausadas.map(RecurringRow)
            )
      );
    })(),

    viewTab==="margem"&&(()=>{
      // Junta sessões realizadas/pagas do mês selecionado com a Ficha de Insumos de cada procedimento
      // para calcular: Receita, Custo de Insumos, Margem (R$ e %) por procedimento.
      const getProdInfo=name=>(products||[]).find(p=>(typeof p==="string"?p:(p.name||p))===name);
      const getInsumos=procName=>{
        const procObj=(proceduresFull||[]).find(p=>(typeof p==="string"?p:(p.name||p))===procName);
        return (procObj&&typeof procObj==="object"&&Array.isArray(procObj.insumos))?procObj.insumos:[];
      };
      const custoInsumosPorSessao=procName=>getInsumos(procName).reduce((a,i)=>{
        const info=getProdInfo(i.product);
        return a+(Number(info?.cost)||0)*(Number(i.qty)||0);
      },0);
      // Considera sessões pagas no mês selecionado (mesmo critério de receita usado no resto do Financeiro)
      const sessoesValidas=monthSessions.filter(s=>s.paid&&s.finStatus!=="Cancelado");
      const porProc={};
      sessoesValidas.forEach(s=>{
        const key=s.procedure||"Sem procedimento";
        if(!porProc[key])porProc[key]={procedure:key,qtd:0,receita:0,custoInsumos:0,temFicha:getInsumos(key).length>0};
        porProc[key].qtd+=1;
        porProc[key].receita+=Number(s.value||0);
        porProc[key].custoInsumos+=custoInsumosPorSessao(key);
      });
      const ranking=Object.values(porProc).map(r=>({
        ...r,
        margem:r.receita-r.custoInsumos,
        margemPct:r.receita>0?((r.receita-r.custoInsumos)/r.receita*100):0,
      })).sort((a,b)=>b.receita-a.receita);
      const totalReceita=ranking.reduce((a,r)=>a+r.receita,0);
      const totalCusto=ranking.reduce((a,r)=>a+r.custoInsumos,0);
      const totalMargem=totalReceita-totalCusto;
      const totalMargemPct=totalReceita>0?(totalMargem/totalReceita*100):0;
      const semFicha=ranking.filter(r=>!r.temFicha&&r.qtd>0);

      function corMargem(pct){ return pct>=60?P.green:pct>=35?P.yellow:P.red; }

      return h("div",null,
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Receita do Período",v:fmtCurr(totalReceita),c:P.text},
            {l:"Custo de Insumos",v:fmtCurr(totalCusto),c:P.red},
            {l:"Margem Real",v:fmtCurr(totalMargem)+`  (${totalMargemPct.toFixed(0)}%)`,c:corMargem(totalMargemPct)}
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:k.c}},k.v)
          ))
        ),
        semFicha.length>0&&h("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(196,169,106,.1)",border:"1px solid rgba(196,169,106,.3)",borderRadius:10,marginBottom:16,fontSize:12,color:P.yellow}},
          "⚠ Sem ficha de insumos cadastrada (margem mostrada considera custo R$0): "+semFicha.map(r=>r.procedure).join(", ")+". Cadastre em Configurações → Procedimentos."
        ),
        ranking.length===0
          ?h(Card,{style:{textAlign:"center",padding:40}},
              h("div",{style:{fontSize:32,marginBottom:12}},"📐"),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text,marginBottom:6}},"Nenhuma sessão paga neste período"),
              h("div",{style:{fontSize:13,color:P.text3}},"A margem é calculada a partir das sessões pagas no mês selecionado.")
            )
          :h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
              ranking.map(r=>{
                const mc=corMargem(r.margemPct);
                const barPct=Math.max(0,Math.min(100,r.margemPct));
                return h(Card,{key:r.procedure},
                  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}},
                    h("div",null,
                      h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},r.procedure),
                      h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},`${r.qtd} sessão${r.qtd>1?"ões":""} paga${r.qtd>1?"s":""}`+(r.temFicha?"":" · sem ficha de insumos"))
                    ),
                    h("div",{style:{textAlign:"right"}},
                      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:mc}},fmtCurr(r.margem)),
                      h("div",{style:{fontSize:11,color:mc,fontWeight:600}},r.margemPct.toFixed(0)+"% de margem")
                    )
                  ),
                  h("div",{style:{display:"flex",gap:16,flexWrap:"wrap",marginBottom:8,fontSize:12,color:P.text2}},
                    h("span",null,"Receita: ",h("strong",{style:{color:P.text}},fmtCurr(r.receita))),
                    h("span",null,"Custo insumos: ",h("strong",{style:{color:P.red}},fmtCurr(r.custoInsumos))),
                    h("span",null,"Custo/sessão: ",h("strong",{style:{color:P.text}},fmtCurr(r.qtd?r.custoInsumos/r.qtd:0)))
                  ),
                  h("div",{style:{height:6,borderRadius:3,background:P.bg3,overflow:"hidden"}},
                    h("div",{style:{height:"100%",width:barPct+"%",background:mc,borderRadius:3,transition:"width .2s"}})
                  )
                );
              })
            )
      );
    })(),

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
        h(Field,{label:form.isRecurring?"A partir de":"Data",half:true},h(Inp,{type:"date",value:form.date,onChange:fv("date")})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:form.cat,onChange:fv("cat"),options:EXPENSE_CATS})),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:form.value,onChange:fv("value"),placeholder:"0,00"})),
        !form.isRecurring&&h(Field,{label:"Status",half:true},h(Sel,{value:form.status,onChange:fv("status"),options:["Pago","Pendente","Cancelado"]})),
        !editExp&&h(Field,null,
          h("label",{style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"9px 12px",background:form.isRecurring?P.card2:P.bg3,border:`1px solid ${form.isRecurring?P.accent:P.border}`,borderRadius:8}},
            h("input",{type:"checkbox",checked:!!form.isRecurring,onChange:e=>setForm(p=>({...p,isRecurring:e.target.checked})),style:{width:15,height:15,accentColor:P.rose,cursor:"pointer"}}),
            h("span",{style:{fontSize:12.5,color:P.text}},"🔁 Despesa recorrente (lança automaticamente todo mês)")
          )
        ),
        form.isRecurring&&!editExp&&h(Field,{label:"Dia do lançamento",half:true},h(Inp,{value:form.dayOfMonth,onChange:fv("dayOfMonth"),placeholder:"Ex: 5"})),
        form.isRecurring&&!editExp&&h("div",{style:{flex:"1 1 100%",fontSize:11,color:P.text3,marginTop:-6,marginBottom:4}},"A despesa deste mês será lançada agora como Pendente. Nos meses seguintes, ela será lançada automaticamente todo dia escolhido."),
        h(Field,{label:"Observações"},h(TA,{value:form.notes,onChange:fv("notes"),placeholder:"Notas...",rows:2}))
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},h(Btn,{variant:"ghost",onClick:()=>{setShowNewExp(false);setEditExp(null);}},"Cancelar"),h(Btn,{onClick:saveExp},editExp?"Salvar":"Adicionar"))
    ),
    h(Modal,{open:!!editRecurring,onClose:()=>setEditRecurring(null),title:"✎ Editar Despesa Recorrente",width:480},
      editRecurring&&h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Descrição"},h(Inp,{value:editRecurring.desc,onChange:erv("desc"),placeholder:"Ex: Aluguel Barra Olímpica"})),
        h(Field,{label:"Dia do lançamento",half:true},h(Inp,{value:String(editRecurring.dayOfMonth||""),onChange:erv("dayOfMonth"),placeholder:"Ex: 5"})),
        h(Field,{label:"Categoria",half:true},h(Sel,{value:editRecurring.cat,onChange:erv("cat"),options:EXPENSE_CATS})),
        h(Field,{label:"Valor (R$)",half:true},h(Inp,{value:String(editRecurring.value||""),onChange:v=>setEditRecurring(p=>({...p,value:v})),placeholder:"0,00"})),
        h(Field,{label:"Ativa",half:true},h(Sel,{value:editRecurring.active===false?"Pausada":"Ativa",onChange:v=>setEditRecurring(p=>({...p,active:v==="Ativa"})),options:["Ativa","Pausada"]})),
        h(Field,{label:"Observações"},h(TA,{value:editRecurring.notes||"",onChange:erv("notes"),placeholder:"Notas...",rows:2})),
        h("div",{style:{flex:"1 1 100%",fontSize:11,color:P.text3}},"Alterações aqui valem para os próximos lançamentos. Lançamentos já gerados em meses anteriores não são alterados.")
      ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}},h(Btn,{variant:"ghost",onClick:()=>setEditRecurring(null)},"Cancelar"),h(Btn,{onClick:saveRecurringEdit},"Salvar"))
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
function Relatorios({patients = [], incomes = [], expenses = [], onSelectPatient, onNav, procedures = [], settings, agenda = []}){
  const now=new Date();
  const[selMonth,setSelMonth]=useState(now.getMonth());
  const[selYear,setSelYear]=useState(now.getFullYear());
  const[chartMode,setChartMode]=useState("receita");
  const[exportingPdf,setExportingPdf]=useState(false);
  const[relTab,setRelTab]=useState("geral");
  const[hmPeriod,setHmPeriod]=useState("6m");
  const[hmMetric,setHmMetric]=useState("atend");
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
  // ── PREVISÃO DE DEMANDA (sazonalidade por mês do calendário) ───────────────
  // Agrupa todo o histórico por mês-do-ano (Jan, Fev, ... Dez), somando todos os anos disponíveis
  const seasonality=Array.from({length:12},(_,m)=>{
    const sInMonth=allS.filter(s=>{const d=parseDMY2(s.date);return d&&d.getMonth()===m;});
    const yearsWithData=new Set(sInMonth.map(s=>parseDMY2(s.date).getFullYear()));
    const totalRev=sInMonth.filter(s=>s.paid).reduce((a,s)=>a+(Number(s.value)||0),0);
    const totalCount=sInMonth.length;
    const numYears=Math.max(yearsWithData.size,1);
    return{
      m, label:MONTH_NAMES[m],
      avgCount:totalCount/numYears, avgRev:totalRev/numYears,
      totalCount, totalRev, years:[...yearsWithData].sort()
    };
  });
  const hasHistory=seasonality.some(s=>s.totalCount>0);
  const avgCountAll=seasonality.reduce((a,s)=>a+s.avgCount,0)/12||1;
  const maxAvgCount=Math.max(...seasonality.map(s=>s.avgCount),1);
  const seasonalityRanked=seasonality.map(s=>({...s,indexPct:avgCountAll>0?Math.round((s.avgCount/avgCountAll)*100):100}))
    .sort((a,b)=>b.avgCount-a.avgCount);
  const peakMonths=seasonalityRanked.filter(s=>s.indexPct>=120&&s.totalCount>0).slice(0,3);
  const lowMonths=seasonalityRanked.filter(s=>s.indexPct<=70&&s.totalCount>0).slice(-3).reverse();
  const SEASONAL_NOTES={0:"Verão · Volta às aulas",1:"Pré-Carnaval / Carnaval",2:"Dia da Mulher (08/03)",3:"Outono",4:"Dia das Mães (2º dom.)",5:"Festas juninas",6:"Férias de inverno",7:"Dia dos Pais (2º dom. ago)",8:"Outubro Rosa (preparação)",9:"Outubro Rosa · Primavera",10:"Black Friday",11:"Natal / Réveillon · Pico de procura por estética"};
  const next3Calendar=Array.from({length:3},(_,i)=>(now.getMonth()+1+i)%12);

  function prevMonth(){if(selMonth===0){setSelMonth(11);setSelYear(y=>y-1);}else setSelMonth(m=>m-1);}
  function nextMonth(){if(selMonth===11){setSelMonth(0);setSelYear(y=>y+1);}else setSelMonth(m=>m+1);}
  const maxBarVal=procList.length===0?1:chartMode==="receita"?procList.reduce((a,[,d])=>d.total>a?d.total:a,1):procList.reduce((a,[,d])=>d.count>a?d.count:a,1);
  // ── Dados para exportação em PDF (ranking de pacientes e formas de pagamento) ──
  const rankingPatients=[...safePats]
    .map(p=>({name:p.name,count:(p.sessions||[]).length,total:(p.sessions||[]).reduce((a,s)=>a+(Number(s.value)||0),0)}))
    .sort((a,b)=>b.total-a.total).slice(0,5);
  const pmMap={};
  allS.filter(s=>s.paid).forEach(s=>{const pm=s.payMethod||"Outro";pmMap[pm]=(pmMap[pm]||0)+(Number(s.value)||0);});
  const paymentMethods=Object.entries(pmMap).sort((a,b)=>b[1]-a[1]);
  async function handleExportPDF(){
    setExportingPdf(true);
    try{
      await generateRelatoriosPDF({selMonth,selYear,allSCount:allS.length,procCount:[...new Set(allS.map(s=>s.procedure))].length,fidPct,forecastRev,nextM,procList,catList,totalCat,monthlyData,peakMonths,lowMonths,rankingPatients,paymentMethods},{settings:settings||{}});
    }catch(e){ alert(e.message||"Erro ao gerar o PDF. Tente novamente."); }
    finally{ setExportingPdf(false); }
  }
  return h("div",null,
    h(SectionHeader,{title:"Relatórios",sub:"Análise completa da clínica",action:h(Btn,{variant:"ghost",onClick:handleExportPDF,disabled:exportingPdf,style:{fontSize:12,padding:"8px 16px"}},exportingPdf?"Gerando...":"📄 Exportar PDF")}),

    // ── Abas de relatório ──────────────────────────────────────────────────
    h("div",{style:{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}},
      [
        {k:"geral",l:"📊 Geral"},
        {k:"horarios",l:"🗓️ Horários"},
        {k:"ltv",l:"💎 LTV Pacientes"},
        {k:"churn",l:"📉 Churn & Retenção"},
        {k:"unidades",l:"🏢 Por Unidade"},
      ].map(t=>h("button",{key:t.k,onClick:()=>setRelTab(t.k),style:{padding:"7px 16px",borderRadius:20,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:relTab===t.k?P.rose:"transparent",border:`1px solid ${relTab===t.k?P.rose:P.border}`,color:relTab===t.k?P.accent3:P.text2}},t.l))
    ),

    // ── ABA GERAL (conteúdo original) ─────────────────────────────────────
    relTab==="geral"&&h("div",null,
    h(OrigemFaturamento,{patients:safePats,selMonth,selYear,parseDMY2}),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Total Sessões",v:allS.length,c:P.gold},{l:"Procedimentos",v:[...new Set(allS.map(s=>s.procedure))].length,c:"#7aaed4"},{l:"Fidelização",v:fidPct+"%",c:P.green},{l:"Forecast "+MONTH_NAMES[nextM].slice(0,3),v:fmtCurr(forecastRev),c:P.accent}].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:k.c}},k.v)))
    ),
    h(Card,{style:{marginBottom:22,border:"1px solid rgba(92,31,50,.35)"}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
        h("div",null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Procedimentos Realizados"),h("div",{style:{fontSize:13,color:P.text3,marginTop:2}},"Volume e receita por procedimento")),
        h("div",{style:{display:"flex",alignItems:"center",gap:10}},
          h("button",{onClick:prevMonth,style:{background:"transparent",border:"1px solid "+P.border,borderRadius:6,width:28,height:28,color:P.text2,cursor:"pointer",fontSize:14}},"‹"),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.rose,minWidth:160,textAlign:"center"}},MONTH_NAMES[selMonth]+" "+selYear),
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
        [{l:"Total Sessões",v:monthSessions.length},{l:"Pagas",v:monthSessions.filter(s=>s.paid).length},{l:"Pendentes",v:monthSessions.filter(s=>!s.paid).length},{l:"Ticket Médio",v:fmtCurr(monthRevenue/Math.max(monthSessions.filter(s=>s.paid).length,1))},{l:"Receita",v:fmtCurr(monthRevenue)}].map(k=>h("div",{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.rose}},k.v)))
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
    // ── PREVISÃO DE DEMANDA ────────────────────────────────────────────────
    h(Card,{style:{marginBottom:22,border:"1px solid rgba(196,169,106,.3)"}},
      h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:6}},
        h("span",{style:{fontSize:20}},"📈"),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:P.text}},"Previsão de Demanda")
      ),
      h("div",{style:{fontSize:12,color:P.text3,marginBottom:18}},"Sazonalidade baseada no histórico de todos os anos registrados — ajuda a planejar estoque, agenda e campanhas."),
      !hasHistory?h("div",{style:{textAlign:"center",padding:30,color:P.text3,fontSize:13}},"Ainda não há histórico suficiente. À medida que sessões forem registradas ao longo dos meses, a previsão de sazonalidade aparecerá aqui automaticamente."):
      h("div",null,
        // Gráfico de 12 meses
        h("div",{style:{display:"flex",alignItems:"flex-end",gap:6,height:120,marginBottom:10}},
          seasonality.map((s,i)=>{
            const hPct=maxAvgCount>0?Math.max((s.avgCount/maxAvgCount)*100,s.totalCount>0?6:0):0;
            const isPeak=peakMonths.some(p=>p.m===i);
            const isLow=lowMonths.some(p=>p.m===i);
            const isCurrent=i===now.getMonth();
            return h("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},
              h("div",{style:{fontSize:9,color:isPeak?P.gold:P.text3,fontWeight:isPeak?700:400}},s.totalCount>0?Math.round(s.avgCount*10)/10:"—"),
              h("div",{style:{width:"100%",height:88,display:"flex",alignItems:"flex-end"}},
                h("div",{style:{width:"100%",height:hPct+"%",borderRadius:"3px 3px 0 0",background:isPeak?`linear-gradient(to top,${P.gold},#f0d9a0)`:isLow?"linear-gradient(to top,#7a8a9a,rgba(122,138,154,.3))":`linear-gradient(to top,${P.rose},rgba(92,31,50,.3))`,border:isCurrent?`1px solid ${P.accent}`:"none",transition:"height .4s ease"}})
              ),
              h("div",{style:{fontSize:9.5,color:isCurrent?P.accent:P.text3,fontWeight:isCurrent?700:400}},s.label.slice(0,3))
            );
          })
        ),
        h("div",{style:{display:"flex",gap:16,fontSize:10,color:P.text3,marginBottom:20,flexWrap:"wrap"}},
          h("div",{style:{display:"flex",alignItems:"center",gap:5}},h("span",{style:{width:9,height:9,borderRadius:2,background:P.gold,display:"inline-block"}}),"Pico de demanda"),
          h("div",{style:{display:"flex",alignItems:"center",gap:5}},h("span",{style:{width:9,height:9,borderRadius:2,background:"#7a8a9a",display:"inline-block"}}),"Baixa demanda"),
          h("div",{style:{display:"flex",alignItems:"center",gap:5}},h("span",{style:{width:9,height:9,borderRadius:2,border:`1px solid ${P.accent}`,display:"inline-block"}}),"Mês atual"),
          h("div",{style:{marginLeft:"auto",fontStyle:"italic"}},"Números = média de sessões/mês nos anos com dados")
        ),
        h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
          h("div",null,
            h("div",{style:{fontSize:11,color:P.gold,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600,marginBottom:10}},"🔥 Períodos de Maior Movimento"),
            peakMonths.length===0?h("div",{style:{fontSize:12,color:P.text3}},"Sem picos significativos identificados ainda."):
            peakMonths.map(pm=>h("div",{key:pm.m,style:{padding:"10px 12px",background:"rgba(196,169,106,.08)",border:"1px solid rgba(196,169,106,.25)",borderRadius:10,marginBottom:8}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline"}},
                h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},pm.label),
                h("div",{style:{fontSize:12,color:P.gold,fontWeight:700}},"+"+(pm.indexPct-100)+"% vs. média")
              ),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:3}},SEASONAL_NOTES[pm.m]),
              h("div",{style:{fontSize:10,color:P.text3,marginTop:2}},`Média de ${Math.round(pm.avgCount*10)/10} sessões/mês · ${fmtCurr(pm.avgRev)} · baseado em ${pm.years.length} ano(s): ${pm.years.join(", ")}`)
            ))
          ),
          h("div",null,
            h("div",{style:{fontSize:11,color:"#8a99a8",textTransform:"uppercase",letterSpacing:".08em",fontWeight:600,marginBottom:10}},"📉 Períodos de Menor Movimento"),
            lowMonths.length===0?h("div",{style:{fontSize:12,color:P.text3}},"Sem baixas significativas identificadas ainda."):
            lowMonths.map(lm=>h("div",{key:lm.m,style:{padding:"10px 12px",background:"rgba(122,138,154,.07)",border:"1px solid rgba(122,138,154,.2)",borderRadius:10,marginBottom:8}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline"}},
                h("div",{style:{fontSize:14,color:P.text,fontWeight:600}},lm.label),
                h("div",{style:{fontSize:12,color:"#8a99a8",fontWeight:700}},lm.indexPct-100+"% vs. média")
              ),
              h("div",{style:{fontSize:11,color:P.text3,marginTop:3}},SEASONAL_NOTES[lm.m]),
              h("div",{style:{fontSize:10,color:P.text3,marginTop:2}},`Média de ${Math.round(lm.avgCount*10)/10} sessões/mês · ${fmtCurr(lm.avgRev)} · baseado em ${lm.years.length} ano(s): ${lm.years.join(", ")}`)
            ))
          )
        ),
        h("div",{style:{marginTop:18,paddingTop:16,borderTop:`1px solid ${P.border}`}},
          h("div",{style:{fontSize:11,color:P.accent,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600,marginBottom:10}},"📅 Próximos 3 meses — o que esperar"),
          h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}},
            next3Calendar.map(m=>{
              const s=seasonality[m];
              const pct=avgCountAll>0?Math.round((s.avgCount/avgCountAll)*100):100;
              const tag=pct>=120?{l:"Alta",c:P.gold}:pct<=70?{l:"Baixa",c:"#8a99a8"}:{l:"Normal",c:P.text3};
              return h("div",{key:m,style:{padding:"12px 14px",background:P.bg3,borderRadius:10,border:`1px solid ${P.border}`}},
                h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}},
                  h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},MONTH_NAMES[m]),
                  h("span",{style:{fontSize:10,padding:"1px 8px",borderRadius:10,background:tag.c+"22",color:tag.c,fontWeight:700}},tag.l)
                ),
                h("div",{style:{fontSize:10,color:P.text3}},SEASONAL_NOTES[m]),
                s.totalCount>0&&h("div",{style:{fontSize:10,color:P.text3,marginTop:4}},`~${Math.round(s.avgCount*10)/10} sessões esperadas`)
              );
            })
          )
        )
      )
    ),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
      h(Card,null,h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Ranking de Pacientes"),[...safePats].sort((a,b)=>(b.sessions||[]).reduce((s,x)=>s+(Number(x.value)||0),0)-(a.sessions||[]).reduce((s,x)=>s+(Number(x.value)||0),0)).slice(0,5).map((p,i)=>h("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid "+P.border}},h("div",{style:{fontSize:16,color:P.accent,fontFamily:"'Cormorant Garamond',serif",minWidth:22}},(i+1)+"°"),h(Avatar,{name:p.name,size:30,idx:i,src:p.profilePhoto}),h("div",{style:{flex:1}},h("div",{style:{fontSize:13,color:P.text}},p.name),h("div",{style:{fontSize:11,color:P.text3}},(p.sessions||[]).length+" sessões")),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.green}},fmtCurr((p.sessions||[]).reduce((a,s)=>a+(Number(s.value)||0),0)))))),
      h(PagamentosCard,{allS})
    )
    ), // fim relTab==="geral"

    // ── ABA HORÁRIOS (Mapa de Horários Mais Produtivos) ─────────────────────
    relTab==="horarios"&&(()=>{
      const safeAgenda=Array.isArray(agenda)?agenda.filter(Boolean):[];
      const HM_PERIODS=[{k:"3m",l:"3 meses",days:90},{k:"6m",l:"6 meses",days:180},{k:"12m",l:"12 meses",days:365},{k:"all",l:"Todo período",days:null}];
      const DOW_LABELS=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
      const HM_HOURS=[7,8,9,10,11,12,13,14,15,16,17,18,19,20];

      const period=HM_PERIODS.find(p=>p.k===hmPeriod)||HM_PERIODS[1];
      const cutoff=period.days?(()=>{const d=new Date();d.setDate(d.getDate()-period.days);return d;})():null;

      const hmAppts=safeAgenda.filter(a=>{
        if(!a||a.blocked||!a.date||!a.time)return false;
        if(a.status==="Cancelado")return false;
        if(cutoff){try{const d=new Date(a.date+"T12:00");if(isNaN(d)||d<cutoff)return false;}catch{return false;}}
        return true;
      });

      // matriz dia da semana (0=Dom..6=Sáb) x hora
      const matrix={};
      DOW_LABELS.forEach((_,dow)=>{matrix[dow]={};HM_HOURS.forEach(hr=>{matrix[dow][hr]={count:0,revenue:0};});});
      hmAppts.forEach(a=>{
        try{
          const d=new Date(a.date+"T12:00");
          if(isNaN(d))return;
          const dow=d.getDay();
          const hr=parseInt(String(a.time).split(":")[0],10);
          if(isNaN(hr)||!matrix[dow][hr])return;
          matrix[dow][hr].count+=1;
          if(a.status==="Realizado")matrix[dow][hr].revenue+=(Number(a.value)||0);
        }catch{}
      });

      let maxCount=0,maxRevenue=0;
      DOW_LABELS.forEach((_,dow)=>HM_HOURS.forEach(hr=>{const c=matrix[dow][hr];if(c.count>maxCount)maxCount=c.count;if(c.revenue>maxRevenue)maxRevenue=c.revenue;}));

      const dowAgg=DOW_LABELS.map((label,dow)=>{
        let count=0,revenue=0;
        HM_HOURS.forEach(hr=>{count+=matrix[dow][hr].count;revenue+=matrix[dow][hr].revenue;});
        return{dow,label,count,revenue};
      });
      const hourAgg=HM_HOURS.map(hr=>{
        let count=0,revenue=0;
        DOW_LABELS.forEach((_,dow)=>{count+=matrix[dow][hr].count;revenue+=matrix[dow][hr].revenue;});
        return{hr,count,revenue};
      });
      const bestDow=[...dowAgg].sort((a,b)=>b.count-a.count)[0];
      const bestHour=[...hourAgg].sort((a,b)=>b.count-a.count)[0];

      const hmFlat=[];
      DOW_LABELS.forEach((label,dow)=>HM_HOURS.forEach(hr=>{const c=matrix[dow][hr];if(c.count>0)hmFlat.push({dow,label,hr,count:c.count,revenue:c.revenue});}));
      const weakSlots=[...hmFlat].sort((a,b)=>a.count-b.count).slice(0,5);
      const topSlots=[...hmFlat].sort((a,b)=>hmMetric==="receita"?b.revenue-a.revenue:b.count-a.count).slice(0,5);

      const totalCount=hmAppts.length;
      const totalRevenue=hmAppts.filter(a=>a.status==="Realizado").reduce((a,x)=>a+(Number(x.value)||0),0);

      return h("div",null,
        h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:12}},
          h("div",null,
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:P.text}},"Mapa de Horários Mais Produtivos"),
            h("div",{style:{fontSize:12,color:P.text3,marginTop:2,maxWidth:480}},"Atendimentos e receita por dia da semana e horário — use para decidir quando abrir mais vagas na agenda ou fazer promoções nos horários mais vazios.")
          ),
          h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
            h("div",{style:{display:"flex",gap:6}},HM_PERIODS.map(p=>h("button",{key:p.k,onClick:()=>setHmPeriod(p.k),style:{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1px solid ${hmPeriod===p.k?P.rose:P.border}`,background:hmPeriod===p.k?P.rose:"transparent",color:hmPeriod===p.k?P.accent3:P.text2}},p.l))),
            h("div",{style:{display:"flex",gap:6}},[{k:"atend",l:"📅 Atendimentos"},{k:"receita",l:"💰 Receita"}].map(m=>h("button",{key:m.k,onClick:()=>setHmMetric(m.k),style:{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:hmMetric===m.k?600:400,border:`1px solid ${hmMetric===m.k?P.gold:P.border}`,background:hmMetric===m.k?P.gold:"transparent",color:hmMetric===m.k?P.bg:P.text2}},m.l)))
          )
        ),
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Atendimentos no período",v:String(totalCount),c:P.accent},
            {l:"Receita realizada",v:fmtCurr(totalRevenue),c:P.green},
            {l:"Dia mais procurado",v:bestDow&&bestDow.count>0?bestDow.label:"—",c:P.gold},
            {l:"Horário mais procurado",v:bestHour&&bestHour.count>0?bestHour.hr+"h":"—",c:"#7aaed4"},
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:k.c}},k.v)))
        ),
        hmFlat.length===0?h(Card,{style:{textAlign:"center",padding:40,marginBottom:22}},
          h("div",{style:{fontSize:32,marginBottom:12}},"🗓️"),
          h("div",{style:{color:P.text3,fontSize:14}},"Nenhum agendamento registrado no período selecionado.")
        ):
        h(Card,{style:{marginBottom:22,overflowX:"auto"}},
          h("div",{style:{minWidth:760}},
            h("div",{style:{display:"grid",gridTemplateColumns:`56px repeat(${HM_HOURS.length},1fr)`,gap:3,marginBottom:4}},
              h("div",null),
              HM_HOURS.map(hr=>h("div",{key:hr,style:{textAlign:"center",fontSize:10,color:P.text3}},hr+"h"))
            ),
            DOW_LABELS.map((label,dow)=>h("div",{key:dow,style:{display:"grid",gridTemplateColumns:`56px repeat(${HM_HOURS.length},1fr)`,gap:3,marginBottom:3}},
              h("div",{style:{fontSize:11,color:P.text2,display:"flex",alignItems:"center",fontWeight:500}},label),
              HM_HOURS.map(hr=>{
                const cell=matrix[dow][hr];
                const max=hmMetric==="receita"?maxRevenue:maxCount;
                const val=hmMetric==="receita"?cell.revenue:cell.count;
                const intensity=max>0?val/max:0;
                const baseColor=hmMetric==="receita"?"196,169,106":"92,31,50";
                const bg=val>0?`rgba(${baseColor},${(0.12+intensity*0.78).toFixed(2)})`:P.bg3;
                const isBest=max>0&&val===max&&val>0;
                return h("div",{key:hr,title:`${label} ${hr}h — ${cell.count} atendimento(s) · ${fmtCurr(cell.revenue)}`,style:{height:30,borderRadius:5,background:bg,border:isBest?`1px solid ${P.accent3}`:"1px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,color:intensity>0.45?P.bg:P.text3,fontWeight:intensity>0.45?700:400}},
                  val>0?(hmMetric==="receita"?(val>=1000?Math.round(val/1000)+"k":String(Math.round(val))):String(val)):""
                );
              })
            )),
            h("div",{style:{display:"flex",alignItems:"center",gap:10,marginTop:14,fontSize:10,color:P.text3,flexWrap:"wrap"}},
              h("span",null,"Menos"),
              h("div",{style:{display:"flex",gap:2}},[0.12,0.3,0.5,0.7,0.9].map((op,i)=>h("span",{key:i,style:{width:16,height:10,borderRadius:2,display:"inline-block",background:`rgba(${hmMetric==="receita"?"196,169,106":"92,31,50"},${op})`}}))),
              h("span",null,"Mais"),
              h("span",{style:{marginLeft:"auto",fontStyle:"italic"}},hmMetric==="receita"?"Receita considera apenas atendimentos com status Realizado":"Atendimentos = agendamentos não cancelados no período")
            )
          )
        ),
        h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}},
          h(Card,null,
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"🔥 Top 5 Horários"),
            h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},hmMetric==="receita"?"Maior receita realizada por dia/horário":"Maior volume de atendimentos por dia/horário"),
            topSlots.length===0?h("div",{style:{fontSize:12,color:P.text3,textAlign:"center",padding:"16px 0"}},"Sem dados suficientes."):
            topSlots.map((s,i)=>h("div",{key:s.dow+"_"+s.hr,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<topSlots.length-1?"1px solid "+P.border:"none"}},
              h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.gold,minWidth:22,textAlign:"center"}},(i+1)+"°"),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:13,color:P.text}},s.label+" · "+s.hr+"h"),
                h("div",{style:{fontSize:10,color:P.text3}},s.count+" atendimento(s)")
              ),
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.green}},fmtCurr(s.revenue))
            ))
          ),
          h(Card,null,
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"💡 Oportunidades de Promoção"),
            h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},"Horários com pouco movimento — bons candidatos a descontos ou campanhas para preencher a agenda"),
            weakSlots.length===0?h("div",{style:{fontSize:12,color:P.text3,textAlign:"center",padding:"16px 0"}},"Sem dados suficientes."):
            weakSlots.map((s,i)=>h("div",{key:s.dow+"_"+s.hr,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<weakSlots.length-1?"1px solid "+P.border:"none"}},
              h("span",{style:{fontSize:16}},"🪙"),
              h("div",{style:{flex:1}},
                h("div",{style:{fontSize:13,color:P.text}},s.label+" · "+s.hr+"h"),
                h("div",{style:{fontSize:10,color:P.text3}},"apenas "+s.count+" atendimento(s) no período")
              )
            ))
          )
        )
      );
    })(),

    // ── ABA LTV ───────────────────────────────────────────────────────────
    relTab==="ltv"&&(()=>{
      const ltvData=safePats.map(p=>{
        const sess=p.sessions||[];
        const totalGasto=sess.reduce((a,s)=>a+(Number(s.value)||0),0);
        const totalPago=sess.filter(s=>s.paid).reduce((a,s)=>a+(Number(s.value)||0),0);
        const ticketMedio=sess.length>0?Math.round(totalPago/Math.max(sess.filter(s=>s.paid).length,1)):0;
        const datas=sess.map(s=>{const d=parseDMY2(s.date);return d;}).filter(Boolean).sort((a,b)=>a-b);
        const primeiraSessao=datas[0]||null;
        const ultimaSessao=datas[datas.length-1]||null;
        const diasAtivo=primeiraSessao&&ultimaSessao?Math.floor((ultimaSessao-primeiraSessao)/864e5):0;
        const mesesAtivo=Math.max(diasAtivo/30,1);
        const freqMensal=sess.length>0?Math.round((sess.length/mesesAtivo)*10)/10:0;
        // LTV projetado: ticket médio × frequência mensal × 12 meses
        const ltvProjetado=Math.round(ticketMedio*freqMensal*12);
        const {tier}=calcLoyalty(p,safePats);
        return{...p,totalGasto,totalPago,ticketMedio,freqMensal,ltvProjetado,primeiraSessao,ultimaSessao,nSessoes:sess.length,tier};
      }).filter(p=>p.nSessoes>0).sort((a,b)=>b.ltvProjetado-a.ltvProjetado);

      const totalLTV=ltvData.reduce((a,p)=>a+p.ltvProjetado,0);
      const avgLTV=ltvData.length>0?Math.round(totalLTV/ltvData.length):0;
      const topLTV=ltvData[0]?.ltvProjetado||0;
      const ltvTiers=[
        {l:"Alto Valor",min:topLTV*0.6,c:"#c4a96a",bg:"rgba(196,169,106,.13)"},
        {l:"Médio Valor",min:topLTV*0.3,c:"#7aaed4",bg:"rgba(122,174,212,.13)"},
        {l:"Baixo Valor",min:0,c:P.text3,bg:"rgba(107,77,74,.1)"},
      ];

      return h("div",null,
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Pacientes com histórico",v:String(ltvData.length),c:P.accent},
            {l:"LTV médio projetado / ano",v:fmtCurr(avgLTV),c:P.gold},
            {l:"Maior LTV individual",v:fmtCurr(topLTV),c:P.green},
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:k.c}},k.v)
          ))
        ),
        h("div",{style:{fontSize:11,color:P.text3,marginBottom:14,padding:"10px 14px",background:P.bg3,borderRadius:8,border:`1px solid ${P.border}`}},
          "💡 LTV projetado = ticket médio × frequência mensal × 12. Indica o valor anual esperado de cada paciente com base no comportamento atual."
        ),
        h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          ltvData.map((p,i)=>{
            const tier=ltvTiers.find(t=>p.ltvProjetado>=t.min)||ltvTiers[2];
            const pct=topLTV>0?Math.round((p.ltvProjetado/topLTV)*100):0;
            const ltvMes=Math.round(p.ltvProjetado/12);
            return h(Card,{key:p.id,style:{border:`1px solid ${tier.c}33`}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}},
                h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                  h("div",{style:{fontSize:15,color:P.accent,fontFamily:"'Cormorant Garamond',serif",minWidth:24,fontWeight:600}},(i+1)+"°"),
                  h("div",{style:{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${P.rose},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:P.accent3,flexShrink:0}},
                    p.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()
                  ),
                  h("div",null,
                    h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},p.name),
                    h("div",{style:{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}},
                      h("span",{style:{fontSize:10,padding:"1px 8px",borderRadius:10,background:p.tier.bg,color:p.tier.color,fontWeight:600}},p.tier.l),
                      h("span",{style:{fontSize:10,padding:"1px 8px",borderRadius:10,background:tier.bg,color:tier.c,fontWeight:600}},tier.l)
                    )
                  )
                ),
                h("div",{style:{textAlign:"right"}},
                  h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:tier.c}},fmtCurr(p.ltvProjetado)),
                  h("div",{style:{fontSize:10,color:P.text3,marginTop:2}},"~"+fmtCurr(ltvMes)+"/mês esperado")
                )
              ),
              h("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}},
                [
                  {l:"Total gasto",v:fmtCurr(p.totalPago)},
                  {l:"Sessões",v:String(p.nSessoes)},
                  {l:"Ticket médio",v:fmtCurr(p.ticketMedio)},
                  {l:"Freq. mensal",v:p.freqMensal+"×"},
                ].map(k=>h("div",{key:k.l,style:{textAlign:"center",padding:"6px 8px",background:P.bg3,borderRadius:7}},
                  h("div",{style:{fontSize:9,color:P.text3,marginBottom:2,textTransform:"uppercase",letterSpacing:".06em"}},k.l),
                  h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},k.v)
                ))
              ),
              h("div",{style:{height:4,borderRadius:2,background:P.border,overflow:"hidden"}},
                h("div",{style:{height:"100%",width:pct+"%",background:tier.c,borderRadius:2,transition:"width .4s"}})
              ),
              onSelectPatient&&h("div",{style:{textAlign:"right",marginTop:8}},
                h("button",{onClick:()=>{onSelectPatient(p);onNav&&onNav("prontuario");},style:{fontSize:11,padding:"4px 12px",borderRadius:8,background:"transparent",border:`1px solid ${P.border}`,color:P.text2,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}},"Ver prontuário →")
              )
            );
          })
        )
      );
    })(),

    // ── ABA CHURN & RETENÇÃO ──────────────────────────────────────────────
    relTab==="churn"&&(()=>{
      const today=new Date();
      // Classifica cada paciente
      const CHURN_DIAS=120; // inativa após 4 meses sem sessão
      const patsComSess=safePats.filter(p=>(p.sessions||[]).length>0);
      const churnData=patsComSess.map(p=>{
        const sess=[...(p.sessions||[])].sort((a,b)=>(parseDMY2(b.date)||new Date(0))-(parseDMY2(a.date)||new Date(0)));
        const ultima=parseDMY2(sess[0]?.date)||null;
        const diasSemVir=ultima?Math.floor((today-ultima)/864e5):999;
        const status=diasSemVir>CHURN_DIAS?"churned":diasSemVir>60?"risco":"ativa";
        const totalPago=sess.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0);
        return{...p,ultima,diasSemVir,status,totalPago,nSessoes:sess.length};
      });
      const ativas=churnData.filter(p=>p.status==="ativa");
      const risco=churnData.filter(p=>p.status==="risco");
      const churned=churnData.filter(p=>p.status==="churned");
      const taxaChurn=patsComSess.length>0?Math.round((churned.length/patsComSess.length)*100):0;
      const taxaRetencao=100-taxaChurn;
      // Novas por mês (últimos 6 meses)
      const last6m=Array.from({length:6},(_,i)=>{
        const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);
        return{m:d.getMonth(),y:d.getFullYear(),label:MONTH_NAMES[d.getMonth()].slice(0,3)};
      });
      const newPerMonth=last6m.map(({m,y,label})=>{
        const novas=safePats.filter(p=>{const d=parseDMY2(p.since);return d&&d.getMonth()===m&&d.getFullYear()===y;}).length;
        return{label,novas};
      });
      const maxNovas=Math.max(...newPerMonth.map(x=>x.novas),1);

      const StatusBadge=({status})=>{
        const cfg={ativa:{l:"Ativa",c:P.green,bg:"rgba(122,173,138,.13)"},risco:{l:"Em risco",c:P.yellow,bg:"rgba(196,169,106,.13)"},churned:{l:"Inativa",c:P.red,bg:"rgba(192,112,112,.14)"}};
        const s=cfg[status];
        return h("span",{style:{fontSize:10,padding:"2px 9px",borderRadius:12,background:s.bg,color:s.c,fontWeight:600}},s.l);
      };

      return h("div",null,
        // KPIs
        h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}},
          [
            {l:"Ativas",v:String(ativas.length),c:P.green},
            {l:"Em risco (>60d)",v:String(risco.length),c:P.yellow},
            {l:"Churned (>120d)",v:String(churned.length),c:P.red},
            {l:"Taxa de retenção",v:taxaRetencao+"%",c:taxaRetencao>=70?P.green:taxaRetencao>=50?P.yellow:P.red},
          ].map(k=>h(Card,{key:k.l,style:{textAlign:"center"}},
            h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:k.c}},k.v)
          ))
        ),
        // Gráfico de novas por mês
        h(Card,{style:{marginBottom:18}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:14}},"Novas Pacientes — Últimos 6 Meses"),
          h("div",{style:{display:"flex",alignItems:"flex-end",gap:10,height:80,marginBottom:8}},
            newPerMonth.map((m,i)=>{
              const h2=maxNovas>0?Math.max((m.novas/maxNovas)*100,m.novas>0?10:0):0;
              return h("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},
                h("div",{style:{fontSize:10,color:P.text3}},m.novas>0?m.novas:"—"),
                h("div",{style:{width:"100%",height:66,display:"flex",alignItems:"flex-end"}},
                  h("div",{style:{flex:1,height:h2+"%",background:`linear-gradient(to top,${P.rose2},rgba(92,31,50,.3))`,borderRadius:"3px 3px 0 0"}})
                ),
                h("div",{style:{fontSize:9,color:P.text3}},m.label)
              );
            })
          )
        ),
        // Pacientes em risco — ação prioritária
        risco.length>0&&h(Card,{style:{marginBottom:18,border:`1px solid ${P.yellow}44`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
            h("div",null,
              h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"⚠ Pacientes em Risco de Churn"),
              h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},"Sem visita entre 60 e 120 dias — reativar agora")
            )
          ),
          h("div",{style:{display:"flex",flexDirection:"column",gap:8}},
            risco.sort((a,b)=>b.diasSemVir-a.diasSemVir).map(p=>h("div",{key:p.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:9,background:P.bg3,border:`1px solid ${P.border}`}},
              h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                h("div",{style:{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${P.rose},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:P.accent3}},
                  p.name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()
                ),
                h("div",null,
                  h("div",{style:{fontSize:13,color:P.text,fontWeight:500}},p.name),
                  h("div",{style:{fontSize:11,color:P.text3}},`Última visita: ${p.ultima?p.ultima.toLocaleDateString("pt-BR"):"—"} · ${p.nSessoes} sessões · ${fmtCurr(p.totalPago)} gasto`)
                )
              ),
              h("div",{style:{display:"flex",alignItems:"center",gap:10}},
                h("span",{style:{fontSize:11,color:P.yellow,fontWeight:600}},p.diasSemVir+"d sem vir"),
                p.pphone&&h("a",{href:`https://wa.me/55${(p.phone||"").replace(/\D/g,"")}?text=Olá ${p.name.split(" ")[0]}! Sentimos sua falta. Que tal agendar um retorno? 🌸`,target:"_blank",rel:"noopener noreferrer",style:{fontSize:11,padding:"5px 12px",borderRadius:8,background:"rgba(122,173,138,.15)",border:"1px solid rgba(122,173,138,.3)",color:P.green,textDecoration:"none",cursor:"pointer"}},"💬 Reativar")
              )
            ))
          )
        ),
        // Churned
        churned.length>0&&h(Card,{style:{border:`1px solid ${P.red}33`}},
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text,marginBottom:4}},"Pacientes Inativas (>120 dias)"),
          h("div",{style:{fontSize:12,color:P.text3,marginBottom:14}},`${churned.length} pacientes · ${fmtCurr(churned.reduce((a,p)=>a+p.totalPago,0))} em LTV histórico`),
          h("div",{style:{display:"flex",flexDirection:"column",gap:6}},
            churned.sort((a,b)=>b.totalPago-a.totalPago).slice(0,8).map(p=>h("div",{key:p.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:8,background:P.bg3}},
              h("div",null,
                h("div",{style:{fontSize:12,color:P.text}},p.name),
                h("div",{style:{fontSize:10,color:P.text3}},`${p.diasSemVir}d ausente · ${fmtCurr(p.totalPago)} histórico`)
              ),
              h("div",{style:{display:"flex",gap:6,alignItems:"center"}},
                h(StatusBadge,{status:"churned"}),
                p.phone&&h("a",{href:`https://wa.me/55${(p.phone||"").replace(/\D/g,"")}?text=Olá ${p.name.split(" ")[0]}! 🌸 Faz um tempinho que não nos vemos. Temos novidades incríveis — que tal marcarmos uma avaliação?`,target:"_blank",rel:"noopener noreferrer",style:{fontSize:11,padding:"4px 10px",borderRadius:7,background:"rgba(122,173,138,.12)",border:"1px solid rgba(122,173,138,.25)",color:P.green,textDecoration:"none"}},"💬 Reconquistar")
              )
            ))
          ),
          churned.length>8&&h("div",{style:{textAlign:"center",marginTop:10,fontSize:12,color:P.text3}},`... e mais ${churned.length-8} pacientes inativas`)
        )
      );
    })(),

    // ── ABA POR UNIDADE ───────────────────────────────────────────────────
    relTab==="unidades"&&(()=>{
      const locationNames=[...new Set(allS.map(s=>s.location).filter(Boolean))];
      if(locationNames.length===0)return h(Card,{style:{textAlign:"center",padding:40}},
        h("div",{style:{fontSize:32,marginBottom:12}},"🏢"),
        h("div",{style:{color:P.text3,fontSize:14}},"Nenhuma unidade registrada nas sessões.")
      );
      const unitData=locationNames.map(loc=>{
        const sess=allS.filter(s=>s.location===loc);
        const sessMonth=sess.filter(s=>{const d=parseDMY2(s.date);return d&&d.getMonth()===selMonth&&d.getFullYear()===selYear;});
        const recTotal=sess.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0);
        const recMes=sessMonth.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0);
        const patsUnicas=new Set(sess.map(s=>s.pid)).size;
        const patsUnicasMes=new Set(sessMonth.map(s=>s.pid)).size;
        const ticketMedio=sessMonth.filter(s=>s.paid).length>0?Math.round(recMes/sessMonth.filter(s=>s.paid).length):0;
        // procedimentos mais realizados nesta unidade no mês
        const procMap2={};
        sessMonth.forEach(s=>{if(s.procedure)procMap2[s.procedure]=(procMap2[s.procedure]||0)+1;});
        const topProcs=Object.entries(procMap2).sort((a,b)=>b[1]-a[1]).slice(0,3);
        // evolução 6 meses
        const evo=last6.map(({m,y,label})=>{
          const ss=sess.filter(s=>{const d=parseDMY2(s.date);return d&&d.getMonth()===m&&d.getFullYear()===y;});
          return{label,rec:ss.filter(s=>s.paid).reduce((a,s)=>a+Number(s.value||0),0),count:ss.length};
        });
        return{loc,sess,sessMonth,recTotal,recMes,patsUnicas,patsUnicasMes,ticketMedio,topProcs,evo};
      });
      const totalRecMes=unitData.reduce((a,u)=>a+u.recMes,0)||1;
      const maxEvo=Math.max(...unitData.flatMap(u=>u.evo.map(e=>e.rec)),1);
      const uColors=["#7aaed4","#9b7aad","#7aad8a","#c4a96a",P.rose];

      return h("div",null,
        // Seletor de mês
        h("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:20,padding:"10px 16px",background:P.card,border:`1px solid ${P.border}`,borderRadius:12}},
          h("button",{onClick:prevMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text2,cursor:"pointer",padding:"6px 12px",fontSize:14}},"←"),
          h("div",{style:{minWidth:180,textAlign:"center"}},
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},`${MONTH_NAMES[selMonth]} ${selYear}`)
          ),
          h("button",{onClick:nextMonth,style:{background:"transparent",border:`1px solid ${P.border}`,borderRadius:8,color:P.text2,cursor:"pointer",padding:"6px 12px",fontSize:14}},"→")
        ),
        // Comparativo lado a lado
        h("div",{style:{display:"grid",gridTemplateColumns:`repeat(${Math.min(unitData.length,2)},1fr)`,gap:18,marginBottom:18}},
          unitData.map((u,ui)=>{
            const col=uColors[ui%uColors.length];
            const share=Math.round((u.recMes/totalRecMes)*100);
            const maxUEvo=Math.max(...u.evo.map(e=>e.rec),1);
            return h(Card,{key:u.loc,style:{border:`1px solid ${col}44`}},
              h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
                h("div",null,
                  h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:col}},u.loc),
                  h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},MONTH_NAMES[selMonth]+" "+selYear)
                ),
                h("div",{style:{textAlign:"right"}},
                  h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:col}},fmtCurr(u.recMes)),
                  h("div",{style:{fontSize:11,color:P.text3}},share+"% do faturamento total")
                )
              ),
              // barra de share
              h("div",{style:{height:4,borderRadius:2,background:P.border,overflow:"hidden",marginBottom:14}},
                h("div",{style:{height:"100%",width:share+"%",background:col,borderRadius:2,transition:"width .4s"}})
              ),
              // métricas
              h("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}},
                [
                  {l:"Sessões",v:String(u.sessMonth.length)},
                  {l:"Pacientes",v:String(u.patsUnicasMes)},
                  {l:"Ticket médio",v:fmtCurr(u.ticketMedio)},
                ].map(k=>h("div",{key:k.l,style:{textAlign:"center",padding:"8px",background:P.bg3,borderRadius:8}},
                  h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}},k.l),
                  h("div",{style:{fontSize:14,color:P.text,fontWeight:500}},k.v)
                ))
              ),
              // mini gráfico evo
              h("div",{style:{marginBottom:12}},
                h("div",{style:{fontSize:10,color:P.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}},"Últimos 6 meses"),
                h("div",{style:{display:"flex",alignItems:"flex-end",gap:4,height:48}},
                  u.evo.map((e,i)=>{
                    const hPct=maxUEvo>0?Math.max((e.rec/maxUEvo)*100,e.count>0?8:0):0;
                    const isLast=i===u.evo.length-1;
                    return h("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}},
                      h("div",{style:{width:"100%",height:38,display:"flex",alignItems:"flex-end"}},
                        h("div",{style:{flex:1,height:hPct+"%",background:isLast?col:`${col}55`,borderRadius:"2px 2px 0 0"}})
                      ),
                      h("div",{style:{fontSize:8,color:P.text3}},e.label)
                    );
                  })
                )
              ),
              // top procedimentos
              u.topProcs.length>0&&h("div",null,
                h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}},"Top procedimentos"),
                u.topProcs.map(([proc,cnt],i)=>h("div",{key:proc,style:{display:"flex",justifyContent:"space-between",fontSize:12,color:P.text2,padding:"3px 0"}},
                  h("span",null,proc),
                  h("span",{style:{color:col,fontWeight:600}},cnt+"x")
                ))
              ),
              // total histórico
              h("div",{style:{marginTop:12,paddingTop:10,borderTop:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}},
                h("span",{style:{fontSize:11,color:P.text3}},"Total histórico · "+u.patsUnicas+" pacientes distintas"),
                h("span",{style:{fontSize:13,color:P.text,fontWeight:500}},fmtCurr(u.recTotal))
              )
            );
          })
        )
      );
    })()
  );
}

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const PROC_CATS=["Toxina Botulínica","Preenchimento","Bioestimuladores","Fios / Lifting","Skincare Clínico","Avaliação / Consultoria","Outros"];
const PROC_MAP_ICONS={"Toxina Botulínica":"💉","Preenchimento":"✨","Bioestimuladores":"🧬","Fios / Lifting":"🧵","Skincare Clínico":"🧴","Avaliação / Consultoria":"📋","Outros":"🩺"};
const PROC_CAT_COLORS={"Toxina Botulínica":P.rose,"Preenchimento":"#7aaed4","Bioestimuladores":P.gold,"Fios / Lifting":"#9b7aad","Skincare Clínico":P.accent,"Avaliação / Consultoria":P.green,"Outros":P.text3};

// ─── PROC FORM (standalone to respect React hook rules) ──────────────────────
function ProcForm({initial,onSave,onCancel,cats,products=[]}){
  const h=createElement;
  const[form,setForm]=useState(initial||{name:"",categoria:"Outros",descricao:"",revisionDays:"",maintenanceDays:"",sessoesPadrao:"1",defaultValue:"",duration:"1 hora",insumos:[]});
  useEffect(()=>{if(initial)setForm({duration:"1 hora",insumos:[],...initial});},[initial?.id]);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const isNew=!initial?.id;
  const insumos=form.insumos||[];
  const prodNames=(products||[]).map(p=>typeof p==="string"?p:(p.name||p)).sort((a,b)=>a.localeCompare(b,"pt-BR",{sensitivity:"base"}));
  function getProdInfo(name){return (products||[]).find(p=>(typeof p==="string"?p:(p.name||p))===name);}
  function addInsumo(){
    if(prodNames.length===0)return;
    setForm(p=>({...p,insumos:[...(p.insumos||[]),{id:Date.now()+Math.random(),product:prodNames[0],qty:1}]}));
  }
  function updInsumo(id,key,val){setForm(p=>({...p,insumos:(p.insumos||[]).map(i=>i.id===id?{...i,[key]:val}:i)}));}
  function delInsumo(id){setForm(p=>({...p,insumos:(p.insumos||[]).filter(i=>i.id!==id)}));}
  const custoTotalInsumos=insumos.reduce((a,i)=>{const info=getProdInfo(i.product);return a+(Number(info?.cost)||0)*(Number(i.qty)||0);},0);
  return h("div",{style:{background:P.bg3,border:`1px solid ${P.rose}`,borderRadius:12,padding:20,marginBottom:16}},
    h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.accent3,marginBottom:16}},isNew?"＋ Novo Procedimento":"✎ Editar: "+form.name),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}},
      h(Field,{label:"Nome do Procedimento"},h(Inp,{value:form.name,onChange:fv("name"),placeholder:"Ex: Preenchimento Labial"})),
      h(Field,{label:"Categoria"},
        h("select",{value:form.categoria||"Outros",onChange:e=>setForm(p=>({...p,categoria:e.target.value})),style:{...IS,width:"100%"}},
          (cats||[]).map(cat=>h("option",{key:cat,value:cat},(PROC_MAP_ICONS[cat]||"🩺")+" "+cat))
        )
      ),
      h(Field,{label:"Duração Padrão"},h(Sel,{value:form.duration||"1 hora",onChange:fv("duration"),options:["15 min","30 min","45 min","1 hora","1h30","2 horas","2h30","3 horas"]})),
      h(Field,{label:"Revisão após sessão (dias)"},h(Inp,{type:"number",value:form.revisionDays||"",onChange:fv("revisionDays"),placeholder:"Ex: 14"})),
      h(Field,{label:"Manutenção (dias)"},h(Inp,{type:"number",value:form.maintenanceDays||"",onChange:fv("maintenanceDays"),placeholder:"Ex: 120"})),
      h(Field,{label:"Sessões padrão no pacote"},h(Inp,{type:"number",value:form.sessoesPadrao||"1",onChange:fv("sessoesPadrao"),placeholder:"1"})),
      h(Field,{label:"Valor Padrão (R$)"},h(Inp,{type:"number",value:form.defaultValue||"",onChange:fv("defaultValue"),placeholder:"Ex: 850"})),
      h(Field,{label:"Descrição / Observações"},h(Inp,{value:form.descricao||"",onChange:fv("descricao"),placeholder:"Ex: Neuromodulador para relaxamento muscular"}))
    ),
    // ── Ficha de Insumos (BOM) — usados para débito automático de estoque e cálculo de margem ──
    h("div",{style:{background:P.card,border:`1px solid ${P.border}`,borderRadius:10,padding:14,marginBottom:14}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}},
        h("div",null,
          h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},"🧪 Ficha de Insumos"),
          h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},"O que esse procedimento consome do estoque. Debitado automaticamente ao lançar a sessão.")
        ),
        h(Btn,{variant:"ghost",onClick:addInsumo,disabled:prodNames.length===0,style:{fontSize:11,padding:"5px 12px"}},"＋ Insumo")
      ),
      prodNames.length===0&&h("div",{style:{fontSize:11,color:P.text3}},"Cadastre produtos no Estoque para vinculá-los aqui."),
      insumos.length===0&&prodNames.length>0&&h("div",{style:{fontSize:11,color:P.text3,padding:"6px 0"}},"Nenhum insumo vinculado ainda."),
      insumos.length>0&&h("div",{style:{display:"flex",flexDirection:"column",gap:6,marginBottom:insumos.length?8:0}},
        insumos.map(ins=>{
          const info=getProdInfo(ins.product);
          const lineCost=(Number(info?.cost)||0)*(Number(ins.qty)||0);
          return h("div",{key:ins.id,style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
            h("select",{value:ins.product,onChange:e=>updInsumo(ins.id,"product",e.target.value),style:{...IS,flex:"1 1 200px"}},
              prodNames.map(n=>h("option",{key:n,value:n},n))
            ),
            h("input",{type:"number",value:ins.qty,onChange:e=>updInsumo(ins.id,"qty",e.target.value),style:{...IS,width:80,flexShrink:0},placeholder:"Qtd",min:"0",step:"0.1"}),
            h("span",{style:{fontSize:10,color:P.text3,flexShrink:0,minWidth:60}},info?.unit||""),
            h("span",{style:{fontSize:11,color:P.text2,flexShrink:0,minWidth:70,textAlign:"right"}},fmtCurr(lineCost)),
            h("button",{onClick:()=>delInsumo(ins.id),style:{background:"transparent",border:"none",color:P.red,cursor:"pointer",fontSize:14,flexShrink:0}},"×")
          );
        })
      ),
      insumos.length>0&&h("div",{style:{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${P.border}`}},
        h("span",{style:{fontSize:11,color:P.text3}},"Custo total de insumos por sessão"),
        h("span",{style:{fontSize:14,color:P.rose,fontWeight:600}},fmtCurr(custoTotalInsumos))
      )
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
  const getProc=x=>typeof x==="string"?{id:"p_"+x,name:x,categoria:"Outros",descricao:"",revisionDays:0,maintenanceDays:0,sessoesPadrao:1,defaultValue:0,duration:"1 hora",insumos:[]}:{id:x.id||"",name:x.name||"",categoria:x.categoria||"Outros",descricao:x.descricao||"",revisionDays:x.revisionDays||0,maintenanceDays:x.maintenanceDays||0,sessoesPadrao:x.sessoesPadrao||1,defaultValue:x.defaultValue||0,duration:x.duration||"1 hora",insumos:x.insumos||[]};
  const skProds=(skincareConfig&&skincareConfig.produtos)||[];
  const skFreqs=(skincareConfig&&skincareConfig.frequencias)||[];

  function saveProc(procObjRaw){
    const procObj={...procObjRaw,insumos:(procObjRaw.insumos||[]).map(i=>({id:i.id,product:i.product,qty:Number(i.qty)||0})).filter(i=>i.product&&i.qty>0)};
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
    const obj={id:"proc_"+Date.now(),name,categoria:formData.categoria||"Outros",descricao:formData.descricao||"",revisionDays:Number(formData.revisionDays)||0,maintenanceDays:Number(formData.maintenanceDays)||0,sessoesPadrao:Number(formData.sessoesPadrao)||1,defaultValue:Number(formData.defaultValue)||0,duration:formData.duration||"1 hora",insumos:(formData.insumos||[]).map(i=>({id:i.id,product:i.product,qty:Number(i.qty)||0})).filter(i=>i.product&&i.qty>0)};
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
      TABS.map(t=>h("button",{key:t.k,onClick:()=>setTab(t.k),style:{padding:"9px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.k?P.rose:"transparent"}`,color:tab===t.k?P.rose:P.text2,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===t.k?600:400,marginBottom:-1,transition:"all .15s"}},t.l))
    ),

    // ── ABA PROCEDIMENTOS ────────────────────────────────────────────────────
    tab==="procedimentos"&&h("div",null,
      !showNewProc&&!editingProc&&h("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:14}},
        h(Btn,{onClick:()=>setShowNewProc(true)},"＋ Novo Procedimento")
      ),
      showNewProc&&h(ProcForm,{onSave:addNewProc,onCancel:()=>setShowNewProc(false),cats,products}),
      editingProc&&h(ProcForm,{initial:editingProc,onSave:saveProc,onCancel:()=>setEditingProc(null),cats,products}),
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
                      h("span",{style:{fontSize:11,color:"#7aaed4",background:"rgba(122,174,212,.12)",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(122,174,212,.25)"}},"🕐 "+(proc.duration||"1 hora")),
                      rev>0&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"⏱ Revisão: "+rev+"d"),
                      man>0&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"🔄 Manutenção: "+man+"d"),
                      (proc.sessoesPadrao>1)&&h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"📦 "+proc.sessoesPadrao+" sessões"),
                      (proc.defaultValue>0)&&h("span",{style:{fontSize:11,color:P.green,background:"rgba(122,173,138,.1)",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(122,173,138,.25)"}},"💰 "+fmtCurr(proc.defaultValue)),
                      (proc.insumos&&proc.insumos.length>0)?h("span",{style:{fontSize:11,color:P.rose,background:"rgba(122,40,64,.08)",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(122,40,64,.2)"}},"🧪 "+proc.insumos.length+" insumo"+(proc.insumos.length>1?"s":"")+" · custo "+fmtCurr(proc.insumos.reduce((a,i)=>{const info=products.find(p=>(typeof p==="string"?p:(p.name||p))===i.product);return a+(Number(info?.cost)||0)*(Number(i.qty)||0);},0)))
                        :h("span",{style:{fontSize:11,color:P.text3,background:P.bg3,padding:"2px 8px",borderRadius:20,border:`1px solid ${P.border}`}},"🧪 sem ficha de insumos")
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


// ─── ANTES & DEPOIS: helpers de geração de imagem ──────────────────────────────
function fmtSubLegenda(item){
  return (item.sessDate||"")+(item.sessProcedure?" · "+item.sessProcedure:"");
}
function loadImageEl(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.crossOrigin="anonymous";
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error("Falha ao carregar imagem"));
    img.src=src;
  });
}
function drawCoverImg(ctx,img,x,y,w,h){
  const ir=img.naturalWidth/img.naturalHeight, tr=w/h;
  let sx,sy,sw,sh;
  if(ir>tr){sh=img.naturalHeight;sw=sh*tr;sx=(img.naturalWidth-sw)/2;sy=0;}
  else{sw=img.naturalWidth;sh=sw/tr;sx=0;sy=(img.naturalHeight-sh)/2;}
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}
function drawContainImg(ctx,img,x,y,w,h){
  // Encaixa a foto inteira na área (sem cortar), centralizada, com fundo preenchido
  const ir=img.naturalWidth/img.naturalHeight, tr=w/h;
  let dw,dh,dx,dy;
  if(ir>tr){dw=w;dh=w/ir;dx=x;dy=y+(h-dh)/2;}
  else{dh=h;dw=h*ir;dx=x+(w-dw)/2;dy=y;}
  ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,dx,dy,dw,dh);
}
function drawCaptionBar(ctx,x,w,h,label,sub){
  const barH=92;
  ctx.fillStyle="rgba(10,5,6,.66)";
  ctx.fillRect(x,h-barH,w,barH);
  ctx.fillStyle="#E1D2C6";
  ctx.font="bold 28px 'DM Sans',sans-serif";
  ctx.textAlign="center";
  ctx.fillText(label,x+w/2,h-barH+38);
  ctx.font="15px 'DM Sans',sans-serif";
  ctx.fillStyle="rgba(225,210,198,.88)";
  ctx.fillText(sub,x+w/2,h-barH+64);
}
async function buildComparisonCanvas(antes,depois,clinicName){
  const[imgA,imgB]=await Promise.all([loadImageEl(antes.url),loadImageEl(depois.url)]);
  const halfW=640,H=820;
  const canvas=document.createElement("canvas");
  canvas.width=halfW*2;canvas.height=H;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#160b0e";ctx.fillRect(0,0,canvas.width,canvas.height);
  drawContainImg(ctx,imgA,0,0,halfW,H);
  drawContainImg(ctx,imgB,halfW,0,halfW,H);
  ctx.fillStyle="#E1D2C6";ctx.fillRect(halfW-2,0,4,H);
  drawCaptionBar(ctx,0,halfW,H,"ANTES",fmtSubLegenda(antes));
  drawCaptionBar(ctx,halfW,halfW,H,"DEPOIS",fmtSubLegenda(depois));
  if(clinicName){
    ctx.font="13px 'DM Sans',sans-serif";
    ctx.fillStyle="rgba(225,210,198,.55)";
    ctx.textAlign="right";
    ctx.fillText(clinicName,canvas.width-14,22);
  }
  return canvas;
}

// ─── ANTES & DEPOIS: slider de comparação por arraste ─────────────────────────
function BeforeAfterSlider({beforeUrl,afterUrl,beforeLabel,afterLabel,beforeSub,afterSub,height}){
  const h=createElement;
  const containerRef=useRef(null);
  const draggingRef=useRef(false);
  const[pos,setPos]=useState(50);

  const updatePos=useCallback(clientX=>{
    const el=containerRef.current;
    if(!el)return;
    const rect=el.getBoundingClientRect();
    let pct=((clientX-rect.left)/rect.width)*100;
    pct=Math.max(0,Math.min(100,pct));
    setPos(pct);
  },[]);

  useEffect(()=>{
    const move=e=>{
      if(!draggingRef.current)return;
      const x=e.touches?e.touches[0].clientX:e.clientX;
      updatePos(x);
      if(e.cancelable)e.preventDefault();
    };
    const up=()=>{draggingRef.current=false;};
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false});
    window.addEventListener("touchend",up);
    return()=>{
      window.removeEventListener("mousemove",move);
      window.removeEventListener("mouseup",up);
      window.removeEventListener("touchmove",move);
      window.removeEventListener("touchend",up);
    };
  },[updatePos]);

  function onDown(e){
    draggingRef.current=true;
    const x=e.touches?e.touches[0].clientX:e.clientX;
    updatePos(x);
  }

  const badgeStyle={position:"absolute",padding:"4px 10px",borderRadius:6,fontSize:10.5,fontWeight:600,letterSpacing:".06em",color:"#E1D2C6",background:"rgba(10,5,6,.6)",pointerEvents:"none"};
  const subStyle={position:"absolute",bottom:10,fontSize:10.5,color:"rgba(225,210,198,.85)",background:"rgba(10,5,6,.55)",padding:"3px 9px",borderRadius:6,pointerEvents:"none",maxWidth:"46%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"};

  return h("div",{
    ref:containerRef,
    onMouseDown:onDown,
    onTouchStart:onDown,
    style:{position:"relative",width:"100%",height:height||340,borderRadius:12,overflow:"hidden",border:`1px solid ${P.border}`,cursor:"ew-resize",userSelect:"none",background:"#000",touchAction:"none"}
  },
    h("img",{src:afterUrl,draggable:false,alt:"depois",style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",background:"#000",display:"block",pointerEvents:"none"}}),
    h("img",{src:beforeUrl,draggable:false,alt:"antes",style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",background:"#000",display:"block",pointerEvents:"none",clipPath:`inset(0 ${100-pos}% 0 0)`}}),
    h("div",{style:{position:"absolute",top:0,bottom:0,left:pos+"%",width:2,background:"#fff",transform:"translateX(-1px)",boxShadow:"0 0 8px rgba(0,0,0,.6)",pointerEvents:"none"}}),
    h("div",{style:{position:"absolute",top:"50%",left:pos+"%",width:38,height:38,borderRadius:"50%",background:"#fff",transform:"translate(-50%,-50%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,.45)",pointerEvents:"none",color:"#3a2a2a",fontSize:15,fontWeight:700}},"↔"),
    h("div",{style:{...badgeStyle,top:10,left:10}},beforeLabel||"ANTES"),
    h("div",{style:{...badgeStyle,top:10,right:10}},afterLabel||"DEPOIS"),
    beforeSub&&h("div",{style:{...subStyle,left:10}},beforeSub),
    afterSub&&h("div",{style:{...subStyle,right:10,textAlign:"right"}},afterSub)
  );
}

// ─── ANTES & DEPOIS: modal de resultado pronto (com download) ─────────────────
function ComparacaoModal({pair,clinicName,onClose}){
  const h=createElement;
  const[downloading,setDownloading]=useState(false);
  const[a,b]=pair;
  async function handleDownload(){
    setDownloading(true);
    try{
      const canvas=await buildComparisonCanvas(a,b,clinicName);
      canvas.toBlob(blob=>{
        const url=URL.createObjectURL(blob);
        const link=document.createElement("a");
        link.href=url;
        link.download="antes-depois-"+(a.sessProcedure||"comparacao").replace(/\s+/g,"_")+".png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),4000);
        setDownloading(false);
      },"image/png");
    }catch(err){
      setDownloading(false);
      alert("Não foi possível gerar o arquivo para download (restrição de origem da imagem). A comparação ainda pode ser visualizada e arrastada normalmente na tela.");
    }
  }
  return h("div",{onClick:onClose,style:{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:2100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},
    h("div",{onClick:e=>e.stopPropagation(),style:{background:P.bg2,borderRadius:14,padding:20,maxWidth:640,width:"100%",border:`1px solid ${P.border}`,maxHeight:"92vh",overflowY:"auto"}},
      h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:P.text,marginBottom:4}},"✦ Comparação Antes / Depois"),
      h("div",{style:{fontSize:11.5,color:P.text3,marginBottom:14}},"Arraste a linha sobre a foto para revelar o antes e o depois."),
      h(BeforeAfterSlider,{
        beforeUrl:a.url,afterUrl:b.url,
        beforeLabel:"ANTES",afterLabel:"DEPOIS",
        beforeSub:fmtSubLegenda(a),afterSub:fmtSubLegenda(b),
        height:380
      }),
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,gap:10,flexWrap:"wrap"}},
        h("div",{style:{fontSize:11.5,color:P.text3,lineHeight:1.5}},
          h("div",null,"Antes: "+(a.sessDate||"—")+(a.sessProcedure?" · "+a.sessProcedure:"")),
          h("div",null,"Depois: "+(b.sessDate||"—")+(b.sessProcedure?" · "+b.sessProcedure:""))
        ),
        h("div",{style:{display:"flex",gap:8}},
          h("button",{onClick:handleDownload,disabled:downloading,style:{background:P.rose,border:"none",color:P.accent3,padding:"9px 16px",borderRadius:8,cursor:downloading?"default":"pointer",fontSize:12.5,opacity:downloading?.6:1,whiteSpace:"nowrap"}},downloading?"Gerando...":"⬇ Baixar Imagem"),
          h("button",{onClick:onClose,style:{background:"transparent",border:`1px solid ${P.border}`,color:P.text2,padding:"9px 16px",borderRadius:8,cursor:"pointer",fontSize:12.5}},"Fechar")
        )
      )
    )
  );
}

function EvolucaoFotos({patient,upd,addMedia,removeMedia,clinicName}){
  const h=createElement;
  const [filterProc,setFilterProc]=useState("Todos");
  const [lightbox,setLightbox]=useState(null);
  const [annotating,setAnnotating]=useState(null); // {photo, sessId}
  const [selMode,setSelMode]=useState(false);
  const [selected,setSelected]=useState([]); // até 2 fotos {id,...}
  const [comparePair,setComparePair]=useState(null); // [antes,depois] prontos para o modal
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

  function togglePhotoSelection(ph){
    setSelected(cur=>{
      const exists=cur.find(p=>p.id===ph.id);
      if(exists)return cur.filter(p=>p.id!==ph.id);
      if(cur.length<2)return[...cur,ph];
      return[cur[1],ph]; // troca a mais antiga selecionada pela nova
    });
  }
  function handlePhotoClick(ph){
    if(selMode){togglePhotoSelection(ph);return;}
    setLightbox({photos:allPhotos,idx:allPhotos.findIndex(p=>p.id===ph.id)});
  }
  function gerarComparacaoManual(){
    if(selected.length!==2)return;
    const ordered=[...selected].sort((a,b)=>parseDt(a.sessDate)-parseDt(b.sessDate));
    setComparePair(ordered);
    setSelected([]);
    setSelMode(false);
  }
  return h("div",null,
    // Cabeçalho + filtros
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
      h("div",null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.text}},"Evolução Fotográfica"),
        h("div",{style:{fontSize:12,color:P.text3,marginTop:2}},totalFotos+" foto(s) · "+allSessions.length+" sessão(ões)")
      ),
      h("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}},
        h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
          allProcs.map(proc=>h("button",{key:proc,onClick:()=>setFilterProc(proc),style:{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filterProc===proc?P.rose:"transparent",border:`1px solid ${filterProc===proc?P.rose:P.border}`,color:filterProc===proc?P.accent3:P.text2}},proc))
        ),
        allPhotos.length>=2&&h("button",{
          onClick:()=>{setSelMode(m=>!m);setSelected([]);},
          style:{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:20,fontSize:11.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:selMode?P.rose:"rgba(157,119,97,.08)",border:`1px solid ${selMode?P.rose:"rgba(157,119,97,.4)"}`,color:selMode?P.accent3:P.accent,whiteSpace:"nowrap"}
        },selMode?"✕ Cancelar seleção":"🖐 Selecionar 2 fotos")
      )
    ),
    // Barra flutuante de seleção
    selMode&&h(Card,{style:{marginBottom:16,border:`1px solid ${selected.length===2?P.rose:P.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}},
      h("div",{style:{fontSize:12.5,color:P.text2}},
        selected.length===0?"Toque em 2 fotos abaixo para montar a comparação.":
        selected.length===1?"1 de 2 fotos selecionadas — escolha mais uma.":
        "2 fotos selecionadas — pronto para gerar."
      ),
      h("div",{style:{display:"flex",gap:8}},
        selected.length>0&&h("button",{onClick:()=>setSelected([]),style:{background:"transparent",border:`1px solid ${P.border}`,color:P.text2,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12}},"Limpar"),
        h("button",{onClick:gerarComparacaoManual,disabled:selected.length!==2,style:{background:selected.length===2?P.rose:"rgba(157,119,97,.15)",border:"none",color:selected.length===2?P.accent3:P.text3,padding:"7px 16px",borderRadius:8,cursor:selected.length===2?"pointer":"default",fontSize:12,fontWeight:500}},"✦ Gerar Comparação")
      )
    ),
    // Comparação automática (mais antiga × mais recente) — só some quando o modo de seleção está ativo
    !selMode&&allPhotos.length>=2&&h(Card,{style:{marginBottom:18,border:"1px solid rgba(92,31,50,.3)"}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}},
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"✦ Comparação Antes / Depois"),
        h("button",{onClick:()=>setComparePair([allPhotos[0],allPhotos[allPhotos.length-1]]),style:{fontSize:11,color:P.accent,background:"transparent",border:`1px solid rgba(157,119,97,.4)`,borderRadius:7,padding:"5px 11px",cursor:"pointer"}},"⛶ Ampliar / Baixar")
      ),
      h(BeforeAfterSlider,{
        beforeUrl:allPhotos[0].url,afterUrl:allPhotos[allPhotos.length-1].url,
        beforeLabel:"ANTES",afterLabel:"DEPOIS",
        beforeSub:fmtSubLegenda(allPhotos[0]),afterSub:fmtSubLegenda(allPhotos[allPhotos.length-1]),
        height:300
      }),
      h("div",{style:{fontSize:11,color:P.text3,marginTop:10,textAlign:"center"}},"Mostrando a foto mais antiga × a mais recente. Use \"Selecionar 2 fotos\" acima para comparar sessões específicas.")
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
                fotos.map((ph,i)=>{
                  const isSel=selected.some(p=>p.id===ph.id);
                  const phFull={...ph,sessDate:s.date,sessProcedure:s.procedure,sessId:s.id};
                  return h("div",{key:ph.id,style:{position:"relative",aspectRatio:"1",cursor:selMode?"pointer":"zoom-in"},
                    onClick:()=>handlePhotoClick(phFull)},
                    h("img",{src:ph.url,alt:ph.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:8,border:isSel?`2px solid ${P.rose2}`:`1px solid ${P.border}`,display:"block",opacity:selMode&&!isSel?.6:1}}),
                    h("div",{style:{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.55)",borderRadius:"0 0 8px 8px",padding:"3px 6px",fontSize:9,color:"rgba(255,255,255,.8)",textAlign:"center"}},ph.date||s.date),
                    selMode
                      ?h("div",{style:{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:isSel?P.rose2:"rgba(0,0,0,.45)",border:isSel?"none":"1.5px solid rgba(255,255,255,.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}},isSel?"✓":"")
                      :h(Fragment,null,
                        h("button",{onClick:e=>{e.stopPropagation();removeMedia(s.id,ph.id,"photos");},style:{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.7)",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}},"×"),
                        h("button",{onClick:e=>{e.stopPropagation();setAnnotating({photo:ph,sessId:s.id});},title:"Anotar foto",style:{position:"absolute",top:4,right:28,width:20,height:20,borderRadius:"50%",background:"rgba(92,31,50,.85)",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}},"\u270f")
                      )
                  );
                })
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
    // Modal de comparação Antes/Depois pronta (gerada manualmente ou automática)
    comparePair&&h(ComparacaoModal,{pair:comparePair,clinicName,onClose:()=>setComparePair(null)}),
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
      [{l:"Total",v:stats.total,c:KPI.purple},{l:"Em Andamento",v:stats.andamento,c:KPI.orange},{l:"Concluídos",v:stats.concluido,c:KPI.green},{l:"Novos",v:stats.novo,c:KPI.blue}].map(s=>
        h(Card,{key:s.l,style:kpiCardStyle(s.c)},
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

// ─── INTERCORRÊNCIAS — PAINEL GLOBAL ───────────────────────────────────────────
function IntercorrenciasGlobal({patients,setPatients,onSelectPatient,onNav,procedures=[],products=[]}){
  const h=createElement;
  const[fPaciente,setFPaciente]=useState("");
  const[fProc,setFProc]=useState("Todos");
  const[fProd,setFProd]=useState("Todos");
  const[fSev,setFSev]=useState("Todas");
  const[fStatus,setFStatus]=useState("Todos");
  const all=patients.flatMap(p=>(p.intercorrencias||[]).map(ic=>({...ic,patient:p})));
  const procOptions=["Todos",...Array.from(new Set(all.map(ic=>ic.procedure).filter(Boolean)))];
  const prodOptions=["Todos",...Array.from(new Set(all.map(ic=>ic.product).filter(Boolean)))];
  const filtered=all.filter(ic=>
    (!fPaciente||ic.patient.name.toLowerCase().includes(fPaciente.toLowerCase()))&&
    (fProc==="Todos"||ic.procedure===fProc)&&
    (fProd==="Todos"||ic.product===fProd)&&
    (fSev==="Todas"||icSeverityOf(ic)===fSev)&&
    (fStatus==="Todos"||icStatusOf(ic)===fStatus)
  ).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const stats={
    total:all.length,
    acomp:all.filter(ic=>icStatusOf(ic)==="Em Acompanhamento").length,
    resolv:all.filter(ic=>icStatusOf(ic)==="Resolvida").length,
    graves:all.filter(ic=>["Grave","Emergencial"].includes(icSeverityOf(ic))).length,
  };
  const selStyle={padding:"8px 12px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text2,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"};
  return h("div",null,
    h(SectionHeader,{title:"Intercorrências",sub:"Painel clínico de intercorrências da clínica"}),
    h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}},
      [{l:"Total Registradas",v:stats.total,c:P.rose},{l:"Em Acompanhamento",v:stats.acomp,c:"#7aaed4"},{l:"Resolvidas",v:stats.resolv,c:P.green},{l:"Graves / Emergenciais",v:stats.graves,c:P.red}].map(s=>
        h("div",{key:s.l,style:{textAlign:"center",padding:20,borderRadius:12,background:s.c}},
          h("div",{style:{fontSize:10,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},s.l),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:"#fff"}},s.v)
        )
      )
    ),
    h("div",{className:"resp-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}},
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text,marginBottom:10}},"Por Gravidade"),
        IC_SEVERITY.map(sv=>{const n=all.filter(ic=>icSeverityOf(ic)===sv).length;const cfg=IC_SEVERITY_CFG[sv];return h("div",{key:sv,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${P.border}`}},h("span",{style:{fontSize:12,color:cfg.color}},sv),h("span",{style:{fontSize:15,fontFamily:"'Cormorant Garamond',serif",color:P.text}},n));})
      ),
      h(Card,null,
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:P.text,marginBottom:10}},"Por Status"),
        IC_STATUS_LIST.map(st=>{const n=all.filter(ic=>icStatusOf(ic)===st).length;const cfg=IC_STATUS_CFG[st];return h("div",{key:st,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${P.border}`}},h("span",{style:{fontSize:12,color:cfg.color}},st),h("span",{style:{fontSize:15,fontFamily:"'Cormorant Garamond',serif",color:P.text}},n));})
      )
    ),
    h("div",{style:{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}},
      h("input",{value:fPaciente,onChange:e=>setFPaciente(e.target.value),placeholder:"Buscar paciente...",style:{flex:"1 1 200px",padding:"8px 14px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`,color:P.text,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}),
      h("select",{value:fProc,onChange:e=>setFProc(e.target.value),style:selStyle},procOptions.map(o=>h("option",{key:o,value:o},o))),
      h("select",{value:fProd,onChange:e=>setFProd(e.target.value),style:selStyle},prodOptions.map(o=>h("option",{key:o,value:o},o))),
      h("select",{value:fSev,onChange:e=>setFSev(e.target.value),style:selStyle},["Todas",...IC_SEVERITY].map(o=>h("option",{key:o,value:o},o))),
      h("select",{value:fStatus,onChange:e=>setFStatus(e.target.value),style:selStyle},["Todos",...IC_STATUS_LIST].map(o=>h("option",{key:o,value:o},o)))
    ),
    filtered.length===0
      ?h(Card,{style:{textAlign:"center",padding:40}},
          h("div",{style:{fontSize:32,marginBottom:12}},all.length===0?"✅":"🔍"),
          h("div",{style:{color:P.text3,fontSize:14}},all.length===0?"Nenhuma intercorrência registrada na clínica ainda.":"Nenhuma intercorrência encontrada para os filtros selecionados.")
        )
      :filtered.map(ic=>h(IntercorrenciaCard,{key:ic.id,ic,patient:ic.patient,setPatients,showPatientName:true,onSelectPatient,onNav}))
  );
}

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

// ─── VOUCHER / GIFT CARD ──────────────────────────────────────────────────────
const DEFAULT_VOUCHER_TEMPLATES=[
  {k:"aniversario",l:"🎂 Aniversário",grad:"linear-gradient(135deg,#d88aa8,#f0c987)"},
  {k:"namorados",l:"💕 Dia dos Namorados",grad:"linear-gradient(135deg,#c0617e,#e0937a)"},
  {k:"natal",l:"🎄 Natal",grad:"linear-gradient(135deg,#3f7a5e,#c0617e)"},
  {k:"maes",l:"💐 Dia das Mães",grad:"linear-gradient(135deg,#d49bc4,#f3d39e)"},
  {k:"indicacao",l:"🤝 Indicação",grad:"linear-gradient(135deg,#7aaed4,#9b7aad)"},
  {k:"classico",l:"✦ Clássico HarmonizaPro",grad:`linear-gradient(135deg,${P.rose},${P.gold})`},
];
function genVoucherCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s="";for(let i=0;i<8;i++)s+=chars[Math.floor(Math.random()*chars.length)];
  return "HP-"+s.slice(0,4)+"-"+s.slice(4);
}
function voucherStatus(v){
  if(v.status==="cancelado")return "cancelado";
  const exp=v.validUntil?new Date(v.validUntil+"T23:59:59"):null;
  const expired=exp&&exp<new Date();
  if(v.type==="valor"){
    const saldo=Number(v.value)-Number(v.usedValue||0);
    if(saldo<=0)return "usado";
    if(expired)return "expirado";
    return saldo<Number(v.value)?"parcial":"ativo";
  } else {
    if(v.used)return "usado";
    if(expired)return "expirado";
    return "ativo";
  }
}
const VOUCHER_STATUS_CFG={
  ativo:{l:"Ativo",color:P.green,bg:"rgba(122,173,138,.13)"},
  parcial:{l:"Parcialmente Usado",color:P.yellow,bg:"rgba(196,169,106,.13)"},
  usado:{l:"Utilizado",color:P.text3,bg:"rgba(255,255,255,.05)"},
  expirado:{l:"Expirado",color:P.red,bg:"rgba(192,112,112,.13)"},
  cancelado:{l:"Cancelado",color:P.red,bg:"rgba(192,112,112,.08)"},
};

function VoucherCard({v,onClick,templates}){
  const h=createElement;
  const st=voucherStatus(v);
  const cfg=VOUCHER_STATUS_CFG[st];
  const tplList=Array.isArray(templates)&&templates.length?templates:DEFAULT_VOUCHER_TEMPLATES;
  const tpl=tplList.find(t=>t.k===v.template)||tplList[tplList.length-1];
  const saldo=v.type==="valor"?Number(v.value)-Number(v.usedValue||0):null;
  return h(Card,{onClick,style:{cursor:"pointer",padding:0,overflow:"hidden",opacity:(st==="usado"||st==="cancelado")?.65:1}},
    h("div",{style:{background:tpl.grad,padding:"14px 16px",color:"#fff"}},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
        h("div",null,
          h("div",{style:{fontSize:10,letterSpacing:".1em",textTransform:"uppercase",opacity:.85}},tpl.l),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,marginTop:2}},v.toName)
        ),
        h("span",{style:{fontSize:10,padding:"3px 9px",borderRadius:12,background:"rgba(255,255,255,.22)",fontWeight:600,whiteSpace:"nowrap"}},cfg.l)
      )
    ),
    h("div",{style:{padding:"12px 16px"}},
      h("div",{style:{fontSize:11,color:P.text3,marginBottom:6}},"De: "+(v.fromName||"—")),
      v.type==="valor"
        ?h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}},
            h("div",null,h("div",{style:{fontSize:9,color:P.text3,textTransform:"uppercase"}},"Saldo disponível"),h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:saldo>0?P.green:P.text3}},fmtCurr(saldo))),
            Number(v.usedValue)>0&&h("div",{style:{textAlign:"right"}},h("div",{style:{fontSize:9,color:P.text3}},"de "+fmtCurr(v.value)))
          )
        :h("div",{style:{fontSize:13,color:P.text,marginBottom:6}},"🎁 "+(v.procedures||[]).join(", ")),
      h("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:P.text3,paddingTop:8,borderTop:`1px solid ${P.border}`}},
        h("span",null,"Código: ",h("b",{style:{color:P.accent,fontFamily:"monospace"}},v.code)),
        v.validUntil&&h("span",null,"Val: "+new Date(v.validUntil+"T12:00").toLocaleDateString("pt-BR"))
      )
    )
  );
}

function Vouchers({patients,vouchers,setVouchers,onSelectPatient,onNav,voucherTemplates,setVoucherTemplates}){
  const templates=Array.isArray(voucherTemplates)&&voucherTemplates.length?voucherTemplates:DEFAULT_VOUCHER_TEMPLATES;
  const h=createElement;
  const[showNew,setShowNew]=useState(false);
  const[viewing,setViewing]=useState(null);
  const[redeemSearch,setRedeemSearch]=useState("");
  const[redeemTarget,setRedeemTarget]=useState(null);
  const[redeemValue,setRedeemValue]=useState("");
  const[filterStatus,setFilterStatus]=useState("todos");
  const[search,setSearch]=useState("");
  const[showTplMgr,setShowTplMgr]=useState(false);
  const TPL_COLORS=[
    "linear-gradient(135deg,#7aaed4,#9b7aad)","linear-gradient(135deg,#d88aa8,#f0c987)",
    "linear-gradient(135deg,#c0617e,#e0937a)","linear-gradient(135deg,#3f7a5e,#c0617e)",
    "linear-gradient(135deg,#d49bc4,#f3d39e)","linear-gradient(135deg,#7aad8a,#c4a96a)",
    `linear-gradient(135deg,${P.rose},${P.gold})`,"linear-gradient(135deg,#9b7aad,#d88aa8)",
  ];
  const blankTpl={emoji:"🎁",label:"",grad:TPL_COLORS[0]};
  const[tplForm,setTplForm]=useState(blankTpl);
  const tplfv=k=>v=>setTplForm(p=>({...p,[k]:v}));
  function addTemplate(){
    if(!tplForm.label.trim()){alert("Dê um nome para o tipo de voucher.");return;}
    const k=tplForm.label.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")||("tipo_"+Date.now());
    if(templates.some(t=>t.k===k)){alert("Já existe um tipo com esse nome.");return;}
    const nt={k,l:(tplForm.emoji?tplForm.emoji+" ":"")+tplForm.label.trim(),grad:tplForm.grad};
    setVoucherTemplates(prev=>[...(Array.isArray(prev)&&prev.length?prev:DEFAULT_VOUCHER_TEMPLATES),nt]);
    setTplForm(blankTpl);
  }
  function removeTemplate(k){
    if(templates.length<=1){alert("É preciso manter ao menos um tipo de voucher.");return;}
    if(!window.confirm("Remover este tipo de voucher? Vouchers já criados com ele continuarão existindo."))return;
    setVoucherTemplates(prev=>(Array.isArray(prev)&&prev.length?prev:DEFAULT_VOUCHER_TEMPLATES).filter(t=>t.k!==k));
  }

  const blank={template:"classico",toName:"",fromName:"",message:"",validUntil:"",type:"valor",value:"",procedures:[],procInput:""};
  const[form,setForm]=useState(blank);
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));

  const vouchersArr=Array.isArray(vouchers)?vouchers:[];
  const enriched=vouchersArr.map(v=>({...v,_status:voucherStatus(v)}));
  const stats={
    total:enriched.length,
    ativos:enriched.filter(v=>v._status==="ativo"||v._status==="parcial").length,
    usados:enriched.filter(v=>v._status==="usado").length,
    valorEmCirculacao:enriched.filter(v=>v.type==="valor"&&(v._status==="ativo"||v._status==="parcial")).reduce((a,v)=>a+(Number(v.value)-Number(v.usedValue||0)),0),
  };
  const filtered=enriched.filter(v=>{
    const mf=filterStatus==="todos"||v._status===filterStatus;
    const ms=!search||v.toName.toLowerCase().includes(search.toLowerCase())||v.fromName.toLowerCase().includes(search.toLowerCase())||v.code.toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  }).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));

  function createVoucher(){
    if(!form.toName||!form.fromName){alert("Preencha o nome de quem recebe e quem está presenteando.");return;}
    if(form.type==="valor"&&(!form.value||Number(form.value)<=0)){alert("Informe o valor do voucher.");return;}
    if(form.type==="procedimento"&&form.procedures.length===0){alert("Adicione ao menos um procedimento.");return;}
    const nv={
      id:Date.now(), code:genVoucherCode(), createdAt:Date.now(),
      template:form.template, toName:form.toName, fromName:form.fromName,
      message:form.message, validUntil:form.validUntil,
      type:form.type, value:form.type==="valor"?Number(form.value):0, usedValue:0,
      procedures:form.type==="procedimento"?form.procedures:[],
      used:false, status:"ativo",
      redemptions:[],
    };
    setVouchers(prev=>[...prev,nv]);
    setShowNew(false); setForm(blank); setViewing(nv);
  }

  function addProcTag(){
    if(!form.procInput.trim())return;
    setForm(p=>({...p,procedures:[...p.procedures,p.procInput.trim()],procInput:""}));
  }
  function removeProcTag(i){ setForm(p=>({...p,procedures:p.procedures.filter((_,idx)=>idx!==i)})); }

  function cancelVoucher(id){
    if(!window.confirm("Cancelar este voucher? Essa ação não poderá ser desfeita."))return;
    setVouchers(prev=>prev.map(v=>v.id===id?{...v,status:"cancelado"}:v));
    setViewing(null);
  }

  // ── Resgate ──────────────────────────────────────────────────────────────
  const redeemMatches=redeemSearch.trim().length<2?[]:enriched.filter(v=>{
    const st=v._status;
    if(st!=="ativo"&&st!=="parcial")return false;
    return v.code.toLowerCase().includes(redeemSearch.toLowerCase())||v.toName.toLowerCase().includes(redeemSearch.toLowerCase());
  });

  function openRedeem(v){ setRedeemTarget(v); setRedeemValue(v.type==="valor"?String(Number(v.value)-Number(v.usedValue||0)):""); }

  function confirmRedeem(){
    if(!redeemTarget)return;
    const v=redeemTarget;
    if(v.type==="valor"){
      const useVal=Number(redeemValue);
      const saldo=Number(v.value)-Number(v.usedValue||0);
      if(!useVal||useVal<=0||useVal>saldo){alert("Valor inválido. Saldo disponível: "+fmtCurr(saldo));return;}
      setVouchers(prev=>prev.map(x=>x.id!==v.id?x:{
        ...x, usedValue:Number(x.usedValue||0)+useVal,
        redemptions:[...(x.redemptions||[]),{date:new Date().toLocaleDateString("pt-BR"),value:useVal}]
      }));
    } else {
      setVouchers(prev=>prev.map(x=>x.id!==v.id?x:{
        ...x, used:true,
        redemptions:[...(x.redemptions||[]),{date:new Date().toLocaleDateString("pt-BR"),value:0,procedures:x.procedures}]
      }));
    }
    setRedeemTarget(null); setRedeemValue(""); setRedeemSearch("");
  }

  const filterBtns=[{k:"todos",l:"Todos"},{k:"ativo",l:"Ativos"},{k:"parcial",l:"Parciais"},{k:"usado",l:"Utilizados"},{k:"expirado",l:"Expirados"},{k:"cancelado",l:"Cancelados"}];

  return h("div",null,
    h(SectionHeader,{title:"Vouchers / Gift Cards",sub:`${stats.total} vouchers criados`,action:h("div",{style:{display:"flex",gap:8}},
      h(Btn,{variant:"ghost",onClick:()=>setShowTplMgr(true)},"🎨 Tipos de Voucher"),
      h(Btn,{onClick:()=>setShowNew(true)},"🎁 Novo Voucher")
    )}),

    h("div",{className:"resp-grid-4",style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}},
      [{l:"Total Emitidos",v:stats.total,c:KPI.purple},{l:"Ativos",v:stats.ativos,c:KPI.green},{l:"Utilizados",v:stats.usados,c:KPI.blue},{l:"Em Circulação",v:fmtCurr(stats.valorEmCirculacao),c:KPI.yellow}].map(k=>
        h(Card,{key:k.l,style:kpiCardStyle(k.c)},
          h("div",{style:{fontSize:10,color:P.text3,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}},k.l),
          h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:k.c}},k.v)
        )
      )
    ),

    // ── Caixa de resgate rápido ────────────────────────────────────────────
    h(Card,{style:{marginBottom:22,border:`1px solid rgba(196,169,106,.3)`}},
      h("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        h("span",{style:{fontSize:18}},"🔎"),
        h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:P.text}},"Resgatar Voucher"),
      ),
      h("input",{value:redeemSearch,onChange:e=>setRedeemSearch(e.target.value),placeholder:"Buscar por código (ex: HP-AB12-CD34) ou nome do presenteado...",style:{...IS,width:"100%",padding:"10px 14px"}}),
      redeemSearch.trim().length>=2&&h("div",{style:{marginTop:10}},
        redeemMatches.length===0
          ? h("div",{style:{fontSize:12,color:P.text3,padding:"8px 0"}},"Nenhum voucher ativo encontrado com esse termo.")
          : redeemMatches.map(v=>h("div",{key:v.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:P.bg3,borderRadius:8,marginBottom:6,border:`1px solid ${P.border}`}},
              h("div",null,
                h("div",{style:{fontSize:13,color:P.text,fontWeight:600}},v.toName+" · "+h("span",{style:{fontFamily:"monospace",color:P.accent}},v.code)),
                h("div",{style:{fontSize:11,color:P.text3,marginTop:2}},v.type==="valor"?("Saldo: "+fmtCurr(Number(v.value)-Number(v.usedValue||0))):("🎁 "+(v.procedures||[]).join(", ")))
              ),
              h(Btn,{onClick:()=>openRedeem(v),style:{fontSize:12,padding:"6px 14px"}},"Resgatar")
            ))
      )
    ),

    h("div",{style:{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}},
      h("input",{value:search,onChange:e=>setSearch(e.target.value),placeholder:"🔍 Buscar por nome ou código...",style:{...IS,flex:1,minWidth:200,padding:"8px 14px"}}),
      h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},filterBtns.map(f=>
        h("button",{key:f.k,onClick:()=>setFilterStatus(f.k),style:{padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:filterStatus===f.k?P.rose:"transparent",border:`1px solid ${filterStatus===f.k?P.rose:P.border}`,color:filterStatus===f.k?P.accent3:P.text2}},f.l)
      ))
    ),

    filtered.length===0&&h(Card,{style:{textAlign:"center",padding:40}},
      h("div",{style:{fontSize:32,marginBottom:12}},"🎁"),
      h("div",{style:{color:P.text3,fontSize:14}},enriched.length===0?"Nenhum voucher criado ainda. Que tal presentear alguém especial?":"Nenhum voucher encontrado com esse filtro.")
    ),

    h("div",{className:"resp-grid-vouchers",style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}},
      filtered.map(v=>h(VoucherCard,{key:v.id,v,onClick:()=>setViewing(v)}))
    ),

    // ── Modal: Novo Voucher ─────────────────────────────────────────────────
    h(Modal,{open:showNew,onClose:()=>{setShowNew(false);setForm(blank);},title:"🎁 Novo Voucher / Gift Card",width:560},
      h("div",{style:{marginBottom:16}},
        h("div",{style:{fontSize:11,color:P.text3,marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}},"Escolha o template"),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          templates.map(t=>h("button",{key:t.k,onClick:()=>fv("template")(t.k),style:{padding:"8px 14px",borderRadius:10,fontSize:12,cursor:"pointer",border:`2px solid ${form.template===t.k?P.accent:"transparent"}`,background:t.grad,color:"#fff",fontFamily:"'DM Sans',sans-serif"}},t.l))
        )
      ),
      h("div",{style:{display:"flex",flexWrap:"wrap",gap:12}},
        h(Field,{label:"Para quem (presenteado)",half:true},
          h("div",null,
            createElement("input",{value:form.toName,onChange:e=>fv("toName")(e.target.value),placeholder:"Nome de quem vai receber",list:"voucher-patients-list",style:IS}),
            h("datalist",{id:"voucher-patients-list"},(Array.isArray(patients)?patients:[]).map(p=>h("option",{key:p.id,value:p.name})))
          )
        ),
        h(Field,{label:"De (presenteador)",half:true},h(Inp,{value:form.fromName,onChange:fv("fromName"),placeholder:"Nome de quem está presenteando"})),
        h(Field,{label:"Mensagem (opcional)"},h(TA,{value:form.message,onChange:fv("message"),placeholder:"Uma mensagem especial para acompanhar o presente...",rows:2})),
        h(Field,{label:"Validade",half:true},h(Inp,{type:"date",value:form.validUntil,onChange:fv("validUntil")})),
        h(Field,{label:"Tipo de Voucher",half:true},h(Sel,{value:form.type,onChange:fv("type"),options:["valor","procedimento"]})),
      ),
      form.type==="valor"
        ? h(Field,{label:"Valor em Crédito (R$)"},h(Inp,{value:form.value,onChange:fv("value"),placeholder:"Ex: 300"}))
        : h("div",{style:{marginTop:4}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}},"Procedimentos incluídos"),
            h("div",{style:{display:"flex",gap:8,marginBottom:8}},
              h(Inp,{value:form.procInput,onChange:fv("procInput"),placeholder:"Ex: Toxina Botulínica"}),
              h(Btn,{variant:"ghost",onClick:addProcTag,style:{flexShrink:0}},"+ Adicionar")
            ),
            h("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
              form.procedures.map((p,i)=>h("span",{key:i,style:{display:"flex",alignItems:"center",gap:6,fontSize:12,padding:"4px 10px",borderRadius:14,background:P.rose,color:P.accent3}},p,
                h("span",{onClick:()=>removeProcTag(i),style:{cursor:"pointer",fontWeight:700}},"×")
              ))
            )
          ),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}},
        h(Btn,{variant:"ghost",onClick:()=>{setShowNew(false);setForm(blank);}},"Cancelar"),
        h(Btn,{onClick:createVoucher},"Gerar Voucher")
      )
    ),

    // ── Modal: Visualizar Voucher ───────────────────────────────────────────
    viewing&&h(Modal,{open:!!viewing,onClose:()=>setViewing(null),title:"Detalhes do Voucher",width:480},
      (()=>{
        const v=enriched.find(x=>x.id===viewing.id)||viewing;
        const tpl=templates.find(t=>t.k===v.template)||templates[templates.length-1];
        const st=voucherStatus(v); const cfg=VOUCHER_STATUS_CFG[st];
        return h("div",null,
          h("div",{style:{background:tpl.grad,borderRadius:12,padding:20,color:"#fff",marginBottom:16,textAlign:"center"}},
            h("div",{style:{fontSize:11,letterSpacing:".12em",textTransform:"uppercase",opacity:.85,marginBottom:6}},tpl.l),
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:26,marginBottom:4}},"Para "+v.toName),
            h("div",{style:{fontSize:13,opacity:.9}},"Com carinho, "+v.fromName),
            v.message&&h("div",{style:{fontSize:13,fontStyle:"italic",marginTop:12,opacity:.95,padding:"0 10px"}},"“"+v.message+"”"),
            h("div",{style:{marginTop:16,fontFamily:"monospace",fontSize:18,letterSpacing:".06em",background:"rgba(255,255,255,.2)",borderRadius:8,padding:"6px 14px",display:"inline-block"}},v.code)
          ),
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:10}},
            h("span",{style:{fontSize:12,color:P.text3}},"Status"),
            h("span",{style:{fontSize:12,padding:"2px 10px",borderRadius:12,background:cfg.bg,color:cfg.color,fontWeight:600}},cfg.l)
          ),
          v.type==="valor"
            ?h("div",{style:{marginBottom:10}},
                h("div",{style:{display:"flex",justifyContent:"space-between"}},h("span",{style:{fontSize:12,color:P.text3}},"Valor total"),h("span",{style:{fontSize:13,color:P.text}},fmtCurr(v.value))),
                h("div",{style:{display:"flex",justifyContent:"space-between"}},h("span",{style:{fontSize:12,color:P.text3}},"Já utilizado"),h("span",{style:{fontSize:13,color:P.yellow}},fmtCurr(v.usedValue||0))),
                h("div",{style:{display:"flex",justifyContent:"space-between"}},h("span",{style:{fontSize:12,color:P.text3,fontWeight:600}},"Saldo disponível"),h("span",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.green}},fmtCurr(Number(v.value)-Number(v.usedValue||0))))
              )
            :h("div",{style:{marginBottom:10}},
                h("div",{style:{fontSize:12,color:P.text3,marginBottom:4}},"Procedimentos incluídos:"),
                h("div",{style:{fontSize:13,color:P.text}},(v.procedures||[]).join(", ")),
                h("div",{style:{fontSize:12,color:v.used?P.text3:P.green,marginTop:6}},v.used?"✓ Já utilizado":"Disponível para uso")
              ),
          v.validUntil&&h("div",{style:{fontSize:12,color:P.text3,marginBottom:10}},"Validade: "+new Date(v.validUntil+"T12:00").toLocaleDateString("pt-BR")),
          (v.redemptions||[]).length>0&&h("div",{style:{marginTop:12,paddingTop:12,borderTop:`1px solid ${P.border}`}},
            h("div",{style:{fontSize:11,color:P.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}},"Histórico de uso"),
            v.redemptions.map((r,i)=>h("div",{key:i,style:{fontSize:12,color:P.text2,padding:"4px 0"}},r.date+" — "+(r.value>0?fmtCurr(r.value):(r.procedures||[]).join(", "))))
          ),
          h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}},
            (st==="ativo"||st==="parcial")&&h(Btn,{variant:"ghost",onClick:()=>cancelVoucher(v.id),style:{color:P.red}},"Cancelar Voucher"),
            (st==="ativo"||st==="parcial")&&h(Btn,{onClick:()=>{setViewing(null);openRedeem(v);}},"Resgatar Agora")
          )
        );
      })()
    ),

    // ── Modal: Confirmar Resgate ────────────────────────────────────────────
    redeemTarget&&h(Modal,{open:!!redeemTarget,onClose:()=>setRedeemTarget(null),title:"Confirmar Resgate",width:420},
      h("div",{style:{marginBottom:14}},
        h("div",{style:{fontSize:13,color:P.text,marginBottom:4}},redeemTarget.toName+" · "+h("span",{style:{fontFamily:"monospace",color:P.accent}},redeemTarget.code)),
        redeemTarget.type==="valor"
          ?h("div",{style:{fontSize:12,color:P.text3}},"Saldo disponível: "+fmtCurr(Number(redeemTarget.value)-Number(redeemTarget.usedValue||0)))
          :h("div",{style:{fontSize:12,color:P.text3}},"Procedimentos: "+(redeemTarget.procedures||[]).join(", "))
      ),
      redeemTarget.type==="valor"&&h(Field,{label:"Valor a utilizar agora (R$)"},h(Inp,{value:redeemValue,onChange:setRedeemValue,placeholder:"0,00"})),
      redeemTarget.type==="procedimento"&&h("div",{style:{fontSize:12,color:P.text2,padding:"10px 0"}},"Ao confirmar, este voucher será marcado como totalmente utilizado."),
      h("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}},
        h(Btn,{variant:"ghost",onClick:()=>setRedeemTarget(null)},"Cancelar"),
        h(Btn,{onClick:confirmRedeem},"Confirmar Resgate")
      )
    ),

    // ── Modal: Gerenciar Tipos de Voucher ───────────────────────────────────
    setVoucherTemplates&&h(Modal,{open:showTplMgr,onClose:()=>setShowTplMgr(false),title:"🎨 Tipos de Voucher",width:520},
      h("div",{style:{fontSize:12,color:P.text3,marginBottom:16}},"Crie novos tipos de voucher (ex: Indicação, Black Friday, Boas-vindas) além dos modelos padrão."),
      h("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:20,maxHeight:240,overflowY:"auto"}},
        templates.map(t=>h("div",{key:t.k,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,background:P.bg3,border:`1px solid ${P.border}`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10}},
            h("div",{style:{width:28,height:28,borderRadius:6,background:t.grad,flexShrink:0}}),
            h("span",{style:{fontSize:13,color:P.text}},t.l)
          ),
          h("button",{onClick:()=>removeTemplate(t.k),style:{fontSize:11,color:P.red,background:"transparent",border:"1px solid rgba(192,112,112,.25)",borderRadius:6,padding:"3px 9px",cursor:"pointer"}},"Remover")
        ))
      ),
      h("div",{style:{paddingTop:14,borderTop:`1px solid ${P.border}`}},
        h("div",{style:{fontSize:11,color:P.text3,marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}},"Novo tipo"),
        h("div",{style:{display:"flex",gap:8,marginBottom:10}},
          h("div",{style:{width:60,flexShrink:0}},h(Inp,{value:tplForm.emoji,onChange:tplfv("emoji"),placeholder:"🎁"})),
          h("div",{style:{flex:1}},h(Inp,{value:tplForm.label,onChange:tplfv("label"),placeholder:"Ex: Indicação, Black Friday, Boas-vindas..."}))
        ),
        h("div",{style:{fontSize:11,color:P.text3,marginBottom:6}},"Cor do template"),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}},
          TPL_COLORS.map((g,i)=>h("button",{key:i,onClick:()=>tplfv("grad")(g),style:{width:32,height:32,borderRadius:8,background:g,border:`2px solid ${tplForm.grad===g?P.accent:"transparent"}`,cursor:"pointer"}}))
        ),
        h("div",{style:{display:"flex",justifyContent:"flex-end"}},h(Btn,{onClick:addTemplate},"＋ Adicionar Tipo"))
      ),
      h("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:18}},h(Btn,{variant:"ghost",onClick:()=>setShowTplMgr(false)},"Fechar"))
    )
  );
}

function AppInner({ session, onLogout }) {
  const[patientsRaw,setPatients,loadingPatients]=useSupaTable("patients",INIT_PATIENTS);
  const[agendaRaw,setAgenda,loadingAgenda]=useSupaTable("agenda",INIT_AGENDA);
  const[expensesRaw,setExpenses,loadingExpenses]=useSupaTable("expenses",INIT_EXPENSES);
  const[recurringExpensesRaw,setRecurringExpenses,loadingRecurringExpenses]=useSupaTable("recurring_expenses",INIT_RECURRING_EXPENSES);
  const[incomesRaw,setIncomes,loadingIncomes]=useSupaTable("incomes",[]);
  const[productsRaw,setProducts,loadingProducts]=useSupaTable("products",[
    {id:"p1",name:"Botox Allergan 100U",cat:"Toxina Botulínica",qty:2,min:5,unit:"un",expiry:"12/2026",cost:800,emoji:"💉",status:"critical"},
    {id:"p2",name:"Juvederm Ultra 1ml",cat:"Ácido Hialurônico",qty:5,min:8,unit:"sir",expiry:"08/2026",cost:450,emoji:"✨",status:"low"},
    {id:"p3",name:"Sculptra 367mg",cat:"Bioestimulador",qty:7,min:4,unit:"fr",expiry:"09/2026",cost:950,emoji:"🧪",status:"ok"},
    {id:"p4",name:"Fio PDO 29G Mono",cat:"Fios de PDO",qty:48,min:20,unit:"un",expiry:"01/2028",cost:35,emoji:"🧵",status:"ok"},
    {id:"p5",name:"Profhilo 2ml",cat:"Skinbooster",qty:4,min:3,unit:"sir",expiry:"11/2026",cost:520,emoji:"💧",status:"ok"},
    {id:"p6",name:"Agulha 30G",cat:"Insumos/Descartáveis",qty:200,min:50,unit:"un",expiry:"06/2028",cost:1.2,emoji:"📍",status:"ok"},
    {id:"p7",name:"Seringa 1ml",cat:"Insumos/Descartáveis",qty:150,min:40,unit:"un",expiry:"06/2028",cost:1.8,emoji:"💉",status:"ok"},
    {id:"p8",name:"Luva de Procedimento (par)",cat:"Insumos/Descartáveis",qty:300,min:60,unit:"par",expiry:"",cost:0.9,emoji:"🧤",status:"ok"},
    {id:"p9",name:"Gaze Estéril",cat:"Insumos/Descartáveis",qty:100,min:30,unit:"un",expiry:"",cost:0.5,emoji:"🩹",status:"ok"},
    {id:"p10",name:"Anestésico Tópico (pomada)",cat:"Insumos/Descartáveis",qty:8,min:3,unit:"un",expiry:"03/2027",cost:65,emoji:"🧴",status:"ok"},
    {id:"p11",name:"Álcool 70% (frasco)",cat:"Insumos/Descartáveis",qty:12,min:4,unit:"un",expiry:"",cost:12,emoji:"🧪",status:"ok"},
    {id:"p12",name:"Micropore",cat:"Insumos/Descartáveis",qty:20,min:8,unit:"rolo",expiry:"",cost:4.5,emoji:"🩹",status:"ok"},
  ]);
  const[settingsData,setSettings,loadingSettings]=useSettings({doctorName:"Dra. Sofia",doctorTitle:"Médica Responsável",clinicName:"HarmonizaPro"});
  const[goalsData,setGoals]=useGoals();
  const[proceduresRaw,setProcedures,loadingProcedures]=useSupaTable("procedures",INIT_PROCEDURES.map((name,i)=>({id:"proc_"+i,name})));
  const[locationsRaw,setLocations,loadingLocations]=useSupaTable("locations",INIT_LOCATIONS.map((name,i)=>({id:"loc_"+i,name})));
  const[returnRulesRaw,setReturnRules,loadingRules]=useSupaTable("return_rules",INIT_RETURN_RULES);
  const[procCatsRaw,setProcCats]=useSupaTable("proc_cats",["Toxina Botulínica","Preenchimento","Bioestimuladores","Fios / Lifting","Skincare Clínico","Avaliação / Consultoria","Outros"]);
  const[skincareConfig,setSkincareConfig]=useSupaTable("skincare_config",{
    produtos:["Vitamina C","Retinol","Ácido Glicólico","Ácido Hialurônico","Protetor Solar FPS 50+","Niacinamida","Peptídeos","Bakuchiol","AHA/BHA","Ceramidas","Água Micelar","Hidratante Facial"],
    frequencias:["Diário","Noturno","2x por semana","Semanal","Mensal","Conforme necessário"]
  });
  const[vouchersRaw,setVouchers,loadingVouchers]=useSupaTable("vouchers",[]);
  const[voucherTemplatesRaw,setVoucherTemplates,loadingVTpl]=useSupaTable("voucher_templates",DEFAULT_VOUCHER_TEMPLATES);


  // ── Blindagem extra: garante que dados que devem ser array nunca virem outra coisa ──
  // (proteção redundante caso algum dado venha corrompido do Supabase)
  // Sobrescreve as variáveis originais — todo código abaixo já fica protegido
  const patients=Array.isArray(patientsRaw)?patientsRaw:[];
  const agenda=Array.isArray(agendaRaw)?agendaRaw:[];
  const expenses=Array.isArray(expensesRaw)?expensesRaw:[];
  const recurringExpenses=Array.isArray(recurringExpensesRaw)?recurringExpensesRaw:[];
  const incomes=Array.isArray(incomesRaw)?incomesRaw:[];
  const products=Array.isArray(productsRaw)?productsRaw:[];
  const procedures=Array.isArray(proceduresRaw)?proceduresRaw:[];
  const locations=Array.isArray(locationsRaw)?locationsRaw:[];
  const returnRules=Array.isArray(returnRulesRaw)?returnRulesRaw:[];
  const procCats=Array.isArray(procCatsRaw)?procCatsRaw:[];
  const vouchers=Array.isArray(vouchersRaw)?vouchersRaw:[];
  const voucherTemplates=(Array.isArray(voucherTemplatesRaw)&&voucherTemplatesRaw.length)?voucherTemplatesRaw:DEFAULT_VOUCHER_TEMPLATES;

  // Todos os useState ANTES de qualquer return condicional (regra dos hooks)
  const[page,setPage]=useState("dashboard");
  const[selectedPatient,setSelectedPatient]=useState(null);
  const[apptPrefill,setApptPrefill]=useState(null);

  // ── Lançamento automático de despesas recorrentes do mês atual ────────────
  // Sempre que houver regras recorrentes ativas e os dados já tiverem sincronizado,
  // gera (uma única vez por mês) a despesa correspondente com status "Pendente".
  useEffect(()=>{
    if(loadingExpenses||loadingRecurringExpenses)return;
    if(!recurringExpenses.length)return;
    const novas=generateRecurringExpenses(recurringExpenses,expenses,new Date());
    if(novas.length>0){
      setExpenses(prev=>[...(Array.isArray(prev)?prev:[]),...novas]);
    }
  },[loadingExpenses,loadingRecurringExpenses,recurringExpenses,expenses,setExpenses]);

  // ── Migração inicial: sobe dados do localStorage para o Supabase ──────────
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const uid=await getUserId();
      if(!uid||cancelled)return;
      const migKey="hapro2_migrated_v1_"+uid;
      if(localStorage.getItem(migKey))return;
      const keys=["patients","agenda","expenses","recurring_expenses","incomes","products","settings","procedures","locations","return_rules","proc_cats","skincare_config"];
      await Promise.all(keys.map(async k=>{
        const raw=localStorage.getItem("hapro2_"+k);
        if(!raw)return;
        try{
          const parsed=JSON.parse(raw);
          const hasData=Array.isArray(parsed)?parsed.length>0:(parsed&&typeof parsed==="object"&&Object.keys(parsed).length>0);
          if(!hasData)return;
          const remote=await supaRead(k);
          const remoteEmpty=remote===null||(Array.isArray(remote)&&remote.length===0);
          if(remoteEmpty)await supaWrite(k,parsed);
        }catch{}
      }));
      if(!cancelled)localStorage.setItem(migKey,"1");
    })();
    return()=>{cancelled=true;};
  },[]);

  // Dados: cache local imediato + sincronização Supabase em background
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
  // ── "Agendar agora" (Retornos Pendentes → Agenda) ──
  function handleScheduleReturn(r){
    const d=r.retornoData;
    const sugDateISO=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const todayStr=todayISO();
    const dateISO=sugDateISO<todayStr?todayStr:sugDateISO; // nunca sugere data passada
    setApptPrefill({
      patientName:r.patient.name,
      procedure:r.last.procedure,
      date:dateISO,
      location:r.last.location||locationNames[0]||"",
      value:String(r.last.value||""),
      status:"Confirmado",
      obs:`Retorno de manutenção · Sessão anterior: ${r.last.procedure} em ${r.last.date}`
    });
    handleNav("agenda");
  }
  const currentPatient=selectedPatient?patients.find(p=>p.id===selectedPatient.id):null;
  const pageTitles={dashboard:"Dashboard",aniversariantes:"Aniversariantes",retornos:"Retornos Pendentes",agenda:"Agenda",pacientes:"Pacientes",prontuario:currentPatient?currentPatient.name:"Prontuários",estoque:"Estoque",financeiro:"Fluxo de Caixa",pacotes_global:"Pacotes",vouchers:"Vouchers / Gift Cards",relatorios:"Relatórios",intercorrencias_global:"Intercorrências",config:"Configurações"};
  const settings = settingsData;

  const nav=[
    {k:"dashboard",l:"Dashboard",icon:"✦"},
    {k:"aniversariantes",l:"Aniversariantes",icon:"🎂",badge:(()=>{const t=new Date();return patients.filter(p=>{if(!p.birthDate)return false;const bd=new Date(p.birthDate+"T12:00");return bd.getMonth()===t.getMonth()&&bd.getDate()===t.getDate();}).length||null;})(),badgeColor:P.yellow},
    {k:"retornos",l:"Retornos",icon:"⏰",badge:(()=>{const today=new Date();return patients.filter(p=>{const s=(p.sessions||[]);if(!s.length)return false;const last=[...s].sort((a,b)=>(parseDMY(b.date)||new Date(0))-(parseDMY(a.date)||new Date(0)))[0];const d=parseDMY(last.date);if(!d)return false;return Number(last.returnReminderDays)>0&&daysBetween(d,today)>Number(last.returnReminderDays);}).length||null;})(),badgeColor:P.red},
    {k:"agenda",l:"Agenda",icon:"📅",badge:todayApptCount||null},
    {k:"pacientes",l:"Pacientes",icon:"👤"},
    {k:"estoque",l:"Estoque",icon:"🧴",badge:criticalStock||null,badgeColor:P.yellow},
    {k:"financeiro",l:"Financeiro",icon:"💰"},
    {k:"pacotes_global",l:"Pacotes",icon:"📦"},
    {k:"vouchers",l:"Vouchers",icon:"🎁"},
    {k:"relatorios",l:"Relatórios",icon:"📊"},
    {k:"intercorrencias_global",l:"Intercorrências",icon:"⚠",badge:patients.flatMap(p=>p.intercorrencias||[]).filter(ic=>icStatusOf(ic)==="Em Acompanhamento").length||null,badgeColor:P.red},
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
            h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:P.rose,letterSpacing:".04em",lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden"}},settings.clinicName||"HarmonizaPro"),
            h("div",{style:{fontSize:9,color:P.text3,letterSpacing:".14em",textTransform:"uppercase",marginTop:3}},"Gestão de Clínica")
          )
        : h("div",{style:{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:P.rose}},"✦"),
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
      nav.map(item=>{
        const isActive=page===item.k||(item.k==="pacientes"&&page==="prontuario");
        return h("div",{
        key:item.k,
        onClick:()=>handleNav(item.k),
        title:sidebarCollapsed&&!isMobile?item.l:undefined,
        style:{
          display:"flex",alignItems:"center",
          gap:sidebarCollapsed&&!isMobile?0:10,
          padding:sidebarCollapsed&&!isMobile?"10px 0":"9px 12px",
          justifyContent:sidebarCollapsed&&!isMobile?"center":"flex-start",
          borderRadius:8,cursor:"pointer",marginBottom:2,
          background:isActive?P.rose:"transparent",
          color:isActive?P.accent3:P.text2,
          border:`1px solid ${isActive?P.rose:"transparent"}`,
          transition:"all .15s",position:"relative"
        },
        onMouseEnter:e=>{if(!isActive){e.currentTarget.style.background=P.card;e.currentTarget.style.color=P.text;}},
        onMouseLeave:e=>{if(!isActive){e.currentTarget.style.background="transparent";e.currentTarget.style.color=P.text2;}}
      },
        h("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,flexShrink:0}},h(NavIcon,{name:item.k,size:17})),
        !sidebarCollapsed||isMobile
          ? h(Fragment,null,
              h("span",{style:{fontSize:13.5,whiteSpace:"nowrap"}},item.l),
              item.badge&&h("span",{style:{marginLeft:"auto",background:item.badgeColor||P.rose2,color:item.badgeColor===P.yellow?"#160b0e":P.accent3,fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:20,lineHeight:1.7}},item.badge)
            )
          : item.badge&&h("span",{style:{position:"absolute",top:4,right:4,background:item.badgeColor||P.rose2,color:item.badgeColor===P.yellow?"#160b0e":P.accent3,fontSize:9,fontWeight:700,padding:"1px 4px",borderRadius:10,lineHeight:1.5}},item.badge)
      );})
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
          h(GlobalSearch,{patients,agenda,onSelectPatient:handleSelectPatient,onNav:handleNav}),
          h(SyncIndicator,null)
        ),
        // Conteúdo principal
        h("div",{style:{flex:1,overflowY:"auto",padding:isMobile?12:24}},
          h(ErrorBoundary,{key:page},
            page==="dashboard"&&h(Dashboard,{patients,agenda,onNav:handleNav,onSelectPatient:handleSelectPatient,onScheduleReturn:handleScheduleReturn,procedures:procedureNames,settings,returnRules,isMobile,isTablet,goals:goalsData,setGoals,incomes,expenses}),
            page==="aniversariantes"&&h(Aniversariantes,{patients,onSelectPatient:handleSelectPatient,onNav:handleNav}),
            page==="retornos"&&h(RetornosPendentes,{patients,returnRules,onSelectPatient:handleSelectPatient,onNav:handleNav,onScheduleReturn:handleScheduleReturn}),
            page==="agenda"&&h(Agenda,{patients,agenda,setAgenda,procedures:procedureNames,proceduresFull:procedures,locations:locationNames,prefill:apptPrefill,onConsumePrefill:()=>setApptPrefill(null)}),
            page==="pacientes"&&h(Patients,{patients,setPatients,onSelect:handleSelectPatient,procedures:procedureNames,locations:locationNames}),
            page==="prontuario"&&!currentPatient&&h(Patients,{patients,setPatients,onSelect:handleSelectPatient,procedures:procedureNames,locations:locationNames}),
            page==="prontuario"&&currentPatient&&h(PatientDetail,{patient:currentPatient,patients,setPatients,onBack:()=>setSelectedPatient(null),procedures:procedureNames,proceduresFull:procedures,locations:locationNames,products:products.map(p=>typeof p==="string"?p:(p.name||p)),setProducts,allProducts:products,returnRules,setIncomes,onSelectPatient:handleSelectPatient,skincareConfig,vouchers,setVouchers,onNavVouchers:()=>handleNav("vouchers"),voucherTemplates,clinicSettings:settingsData,agenda,setAgenda}),
            page==="estoque"&&h(Estoque,{products,setProducts}),
            page==="financeiro"&&h(Financeiro,{patients,setPatients,expenses,setExpenses,recurringExpenses,setRecurringExpenses,incomes,setIncomes,settings,goals:goalsData,setGoals,procedures:procedureNames,proceduresFull:procedures,products}),
            page==="pacotes_global"&&h(PacotesGlobal,{patients,setPatients,onSelectPatient:handleSelectPatient,onNav:handleNav}),
            page==="vouchers"&&h(Vouchers,{patients,vouchers,setVouchers,onSelectPatient:handleSelectPatient,onNav:handleNav,voucherTemplates,setVoucherTemplates}),
            page==="relatorios"&&h(Relatorios,{patients,incomes,expenses,onSelectPatient:handleSelectPatient,onNav:handleNav,procedures,settings,agenda}),
            page==="intercorrencias_global"&&h(IntercorrenciasGlobal,{patients,setPatients,onSelectPatient:handleSelectPatient,onNav:handleNav,procedures:procedureNames,products:products.map(p=>typeof p==="string"?p:(p.name||p))}),
            page==="config"&&h(Configuracoes,{procedures,setProcedures,locations:locationNames,setLocations,products,setProducts,settings,setSettings,returnRules,setReturnRules,skincareConfig,setSkincareConfig,procCats,setProcCats})
          )
        )
      )
    )
  );
}

export default App;
