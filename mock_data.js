// IFT Group Executive CEO Dashboard & CMS Dataset

window.IFT_DATA = {
  metadata: {
    asOfDate: "2026-05-14",
    currencyDefault: "IDR",
    fiscalYear: 2026,
    reportedGroupTarget: 67.00,
    ipoTargetYear: 2028,
    ipoTargetValuationIdr: 1500.00 // Rp 1.5 Trillion
  },

  // Authorised User Credentials & Roles
  users: [
    { username: "Admin_Sam", password: "Wiboons988*", role: "Admin", name: "Admin Sam (Admin)" },
    { username: "Admin_Arifa", password: "IFT_Arifa", role: "Executive", name: "Admin Arifa (Executive)" },
    { username: "Nisa", password: "Istar1234", role: "Analyst", name: "Nisa (Analyst)" }
  ],

  // Dynamic Strategic Levers List (Fully Addable / Editable / Deletable)
  levers: [
    { id: "lever_1", code: "Lever #1", name: "Lever #1: PO Execution Trap (PO Confirmed → Invoiced Conversion)" },
    { id: "lever_2", code: "Lever #2", name: "Lever #2: Subsidiary Performance & Concentration Risk" },
    { id: "lever_3", code: "Lever #3", name: "Lever #3: Days Sales Outstanding (DSO & Working Capital)" },
    { id: "lever_4", code: "Lever #4", name: "Lever #4: Recurring Revenue Ratio (ARR % vs One-Off)" }
  ],

  // Executive Management Directory (Fully Addable / Editable / Deletable)
  executives: [
    { id: "exec_cfo", name: "Hendra Wijaya", role: "CFO" },
    { id: "exec_coo", name: "Budi Santoso", role: "COO" },
    { id: "exec_cto", name: "Alvin Tan", role: "CTO" },
    { id: "exec_sales", name: "Maya Putri", role: "Sales Head" },
    { id: "exec_ceo", name: "CEO Office", role: "CEO" },
    { id: "exec_git", name: "Rudi Hartono", role: "MD GiT" },
    { id: "exec_sts", name: "Siti Rahma", role: "MD STS" },
    { id: "exec_dct", name: "Agus Pratama", role: "MD DCT" },
    { id: "exec_one", name: "Denny Setiawan", role: "MD ONE" }
  ],

  // Group Totals (Reconciled Target Sum = Rp 71.00B)
  groupTotals: {
    target: 71.00,
    poConfirmed: 66.44,
    closedWon: 4.11,
    totalAchieved: 70.55,
    achievementPct: 99.37,
    gap: 0.45,
    pipelineWeighted: 67.53,
    status: "NEAR TARGET"
  },

  // 5 Main Business Units (9 Total Legal Entities)
  subsidiaries: [
    {
      id: "IFT",
      code: "IFT",
      name: "PT Indonesia Futura Teknologi (Parent)",
      target: 3.00,
      poConfirmed: 0.41,
      closedWon: 0.00,
      totalAchieved: 0.41,
      achievementPct: 13.67,
      gap: -2.59,
      status: "BELOW TARGET",
      owner: "Hendra Wijaya (CFO)",
      deadline: "2026-06-30",
      subEntities: []
    },
    {
      id: "DCT",
      code: "DCT Group",
      name: "DCT Group (5 Consolidated Subsidiaries)",
      target: 19.00,
      poConfirmed: 4.60,
      closedWon: 0.00,
      totalAchieved: 4.60,
      achievementPct: 24.21,
      gap: -14.40,
      status: "BELOW TARGET",
      owner: "Agus Pratama (MD DCT)",
      deadline: "2026-07-15",
      subEntities: [
        { name: "DCT Sub-1 (Infrastructure)", poConfirmed: 1.20, closedWon: 0.00, totalAchieved: 1.20 },
        { name: "DCT Sub-2 (Hardware Solutions)", poConfirmed: 1.10, closedWon: 0.00, totalAchieved: 1.10 },
        { name: "DCT Sub-3 (Network Systems)", poConfirmed: 0.90, closedWon: 0.00, totalAchieved: 0.90 },
        { name: "DCT Sub-4 (Cloud Integrations)", poConfirmed: 0.80, closedWon: 0.00, totalAchieved: 0.80 },
        { name: "DCT Sub-5 (Managed Services)", poConfirmed: 0.60, closedWon: 0.00, totalAchieved: 0.60 }
      ]
    },
    {
      id: "GIT",
      code: "GiT",
      name: "PT Global Infotech Teknologi",
      target: 15.00,
      poConfirmed: 29.13,
      closedWon: 0.14,
      totalAchieved: 29.27,
      achievementPct: 195.13,
      gap: 14.27,
      status: "EXCEED TARGET",
      owner: "Rudi Hartono (MD GiT)",
      deadline: "2026-05-31",
      subEntities: []
    },
    {
      id: "STS",
      code: "STS",
      name: "Solusi Tiga Selaras",
      target: 19.00,
      poConfirmed: 27.88,
      closedWon: 1.24,
      totalAchieved: 29.12,
      achievementPct: 153.26,
      gap: 10.12,
      status: "EXCEED TARGET",
      owner: "Siti Rahma (MD STS)",
      deadline: "2026-06-15",
      subEntities: []
    },
    {
      id: "ONE",
      code: "ONE",
      name: "PT One Technology Indonesia",
      target: 15.00,
      poConfirmed: 4.42,
      closedWon: 2.73,
      totalAchieved: 7.15,
      achievementPct: 47.67,
      gap: -7.85,
      status: "BELOW TARGET",
      owner: "Denny Setiawan (MD ONE)",
      deadline: "2026-08-31",
      subEntities: []
    }
  ],

  // Strategic Executive Action Tasks & Levers with Owners & Deadlines
  tasks: [
    {
      id: "task_1",
      lever: "Lever #1: PO Execution Trap",
      title: "Form Weekly Delivery-to-Billing Taskforce",
      category: "Critical",
      owner: "Budi Santoso (COO)",
      deadline: "2026-05-25",
      status: "In Progress",
      impact: "Convert Rp 66.44B PO Confirmed into Closed Won Invoices"
    },
    {
      id: "task_2",
      lever: "Lever #1: PO Execution Trap",
      title: "Institute 5-Day Milestone Signoff SLA with Clients",
      category: "Critical",
      owner: "Hendra Wijaya (CFO)",
      deadline: "2026-06-10",
      status: "In Progress",
      impact: "Accelerate PSAK 72 revenue recognition"
    },
    {
      id: "task_3",
      lever: "Lever #1: PO Execution Trap",
      title: "Align PM Bonuses to Invoiced Cash Collection",
      category: "Critical",
      owner: "Budi Santoso (COO)",
      deadline: "2026-06-30",
      status: "Not Started",
      impact: "Ensure PMs prioritize client signoffs"
    },
    {
      id: "task_4",
      lever: "Lever #2: Subsidiary Performance",
      title: "Consolidate DCT Group 5 Sub-Entities into 2 Lines",
      category: "Critical",
      owner: "Agus Pratama (MD DCT)",
      deadline: "2026-07-31",
      status: "In Progress",
      impact: "Eliminate Rp 4.0B redundant overhead"
    },
    {
      id: "task_5",
      lever: "Lever #2: Subsidiary Performance",
      title: "Cross-Sell IFT Software into GiT & STS Telco Accounts",
      category: "Critical",
      owner: "Maya Putri (Sales Head)",
      deadline: "2026-06-20",
      status: "In Progress",
      impact: "Lift IFT Parent target achievement from 13.7% to 80%"
    },
    {
      id: "task_6",
      lever: "Lever #2: Subsidiary Performance",
      title: "Reassign Top Sales AEs from GiT to Turnaround ONE",
      category: "Critical",
      owner: "Maya Putri (Sales Head)",
      deadline: "2026-06-15",
      status: "Completed",
      impact: "Accelerate ONE cloud enterprise pipeline"
    },
    {
      id: "task_7",
      lever: "Lever #3: Working Capital & DSO",
      title: "Institute Mandatory 30% Upfront Contract Deposit",
      category: "High Priority",
      owner: "Hendra Wijaya (CFO)",
      deadline: "2026-06-01",
      status: "In Progress",
      impact: "Reduce DSO from 92 days to < 60 days"
    },
    {
      id: "task_8",
      lever: "Lever #3: Working Capital & DSO",
      title: "Automated AR Escalation Trigger (Day 15/30/45)",
      category: "High Priority",
      owner: "Hendra Wijaya (CFO)",
      deadline: "2026-05-30",
      status: "Completed",
      impact: "Prevent overdue receivables accumulation"
    },
    {
      id: "task_9",
      lever: "Lever #3: Working Capital & DSO",
      title: "Offer 2% Early Settlement Discount (2/15 Net 60)",
      category: "High Priority",
      owner: "Hendra Wijaya (CFO)",
      deadline: "2026-06-15",
      status: "Not Started",
      impact: "Incentivize enterprise cash settlement"
    },
    {
      id: "task_10",
      lever: "Lever #4: ARR Recurring Ratio",
      title: "Mandatory Managed Service Attach Rate (15-20% SLA)",
      category: "High Priority",
      owner: "Alvin Tan (CTO)",
      deadline: "2026-07-01",
      status: "In Progress",
      impact: "Increase ARR ratio from 38% to 60%"
    },
    {
      id: "task_11",
      lever: "Lever #4: ARR Recurring Ratio",
      title: "Productize Custom Backend Code into SaaS Modules",
      category: "High Priority",
      owner: "Alvin Tan (CTO)",
      deadline: "2026-08-15",
      status: "Not Started",
      impact: "Unlock 5x - 8x EV/Sales valuation multiple"
    }
  ],

  // Quarterly Reports Archive Vault
  quarterlyArchives: [
    {
      quarter: "Q1 FY26 (Audited)",
      asOf: "2026-03-31",
      target: 71.00,
      achieved: 64.20,
      closedWon: 2.80,
      healthIndex: 68,
      status: "COMPLETED",
      notes: "Initial quarter audit completed. Delivery bottlenecks identified in GiT."
    },
    {
      quarter: "Q2 FY26 (Current YTD)",
      asOf: "2026-05-14",
      target: 71.00,
      achieved: 70.55,
      closedWon: 4.11,
      healthIndex: 72,
      status: "ACTIVE",
      notes: "Top-line sales at 99.4%. Cash invoicing focus underway."
    },
    {
      quarter: "Q3 FY26 (Projected)",
      asOf: "2026-09-30",
      target: 75.00,
      achieved: 78.50,
      closedWon: 22.00,
      healthIndex: 85,
      status: "PROJECTED",
      notes: "Expected clearance of PO Confirmed into Closed Won Invoices."
    },
    {
      quarter: "Q4 FY26 (Projected)",
      asOf: "2026-12-31",
      target: 80.00,
      achieved: 85.00,
      closedWon: 45.00,
      healthIndex: 92,
      status: "PROJECTED",
      notes: "Pre-IPO audit readiness verification target."
    }
  ],

  // Uploaded Supporting Documents & Files Store
  uploadedFiles: [
    { name: "Q1_FY26_Financial_Audit_Report.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2026-04-10", uploader: "Hendra (CFO)" },
    { name: "IFT_Group_Subsidiaries_Revenue_May2026.xlsx", type: "Excel", size: "845 KB", uploadedAt: "2026-05-14", uploader: "Maya (Sales)" }
  ],

  // English & Bahasa Indonesia Dictionary
  i18n: {
    EN: {
      brandSubtitle: "CEO Command Center",
      navTopPanel: "CEO Top-Level Panel",
      navGroupOverview: "Group Performance Table",
      navSubsidiary: "Business Units (5)",
      navIpoSandbox: "3-Yr IPO Sandbox",
      navGovernance: "Governance & Audit",
      navCms: "Executive CMS & Governance",
      ipoHeader: "IDX IPO Horizon 2028",
      targetBaselineLabel: "Target Baseline:",
      reportedVsReconciled: "Reported (Rp 67B) vs Reconciled (Rp 71B)",
      summaryTitle: "CEO EXECUTIVE SUMMARY & DIAGNOSTIC RADAR",
      summarySub: "4 Critical Levers to Fix Before IPO Filing",
      summaryDesc: "While top-line sales reach 99.4% of target (Rp 70.55B), your company currently has 2 Critical Red Flags and 2 High Priority Levers that impact IPO valuation.",
      lever1Title: "PO Execution Trap (PO Confirmed → Invoiced Conversion)",
      currentValLabel: "Current Number",
      targetValLabel: "Required Target",
      lever1Impact: "⚠️ Why this breaks your IPO: Rp 66.44B (94.2%) is trapped in PO Confirmed stage. Un-invoiced revenue is excluded under PSAK 72 audit standards.",
      lever1StepsTitle: "🎯 EXACT STEPS TO IMPROVE THIS NUMBER (CEO DIRECTIVES):",
      lever1Step1: "Form Weekly Delivery-to-Billing Taskforce: Assign COO & CFO to clear milestone blockages in GiT and STS.",
      lever1Step2: "Institute 5-Day Milestone Signoff SLA: Enforce strict contractual SLAs with Enterprise clients.",
      lever1Step3: "Align PM Compensation: Tie Project Manager bonuses to Invoiced Cash Collection rather than contract signing.",
      lever2Title: "Subsidiary Performance & Concentration Risk",
      lever2Impact: "⚠️ Why this breaks your IPO: GiT (195.2%) and STS (153.3%) generate 83% of revenue, masking severe drops in IFT (13.7%), DCT (24.2%), and ONE (47.6%).",
      lever2Step1: "Consolidate DCT Group: Merge 5 mini-subsidiaries into 2 core business lines to reduce overhead.",
      lever2Step2: "Parent Cross-Selling: Bundle IFT software into GiT & STS enterprise IT infrastructure deals.",
      lever2Step3: "Reassign Sales Talent: Transfer top enterprise account executives from GiT to turnaround ONE.",
      lever3Title: "Days Sales Outstanding (DSO & Working Capital)",
      lever3Impact: "⚠️ Why this impacts valuation: 92-day payment cycles trap cash in accounts receivable, forcing high credit lines.",
      lever3Step1: "30% Upfront Contract Deposit Mandate: Mandatory advance payment on contracts > Rp 1.0B.",
      lever3Step2: "Automated AR Escalation Trigger: Day 15 reminder → Day 30 finance hold → Day 45 CEO call.",
      lever3Step3: "2% Early Settlement Discount: Offer 2/15 Net 60 terms to accelerate cash collection.",
      lever4Title: "Recurring Revenue Ratio (ARR % vs One-Off Implementation)",
      lever4Impact: "⚠️ Why this impacts valuation: One-off IT projects get valued at 1.5x - 2.5x EV/Sales. SaaS & Managed Services ARR get valued at 5x - 8x EV/Sales.",
      lever4Step1: "Mandatory Managed Service Attach Rate: Attach a 15-20% annual SLA maintenance contract to all project deliveries.",
      lever4Step2: "Productize Custom Code: Package reusable backend modules into multi-tenant SaaS products under IFT parent."
    },
    ID: {
      brandSubtitle: "Pusat Kendali CEO",
      navTopPanel: "Panel Utama Keputusan CEO",
      navGroupOverview: "Tabel Kinerja Grup",
      navSubsidiary: "Unit Bisnis (5)",
      navIpoSandbox: "Simulasi IPO 3 Tahun",
      navGovernance: "Tata Kelola & Audit",
      navCms: "CMS Eksekutif & Tata Kelola",
      ipoHeader: "Target IPO IDX 2028",
      targetBaselineLabel: "Basis Target:",
      reportedVsReconciled: "Dilaporkan (Rp 67B) vs Rekonsiliasi (Rp 71B)",
      summaryTitle: "RINGKASAN EKSEKUTIF CEO & RADAR DIAGNOSTIK",
      summarySub: "4 Tuas Kunci yang Harus Diperbaiki Sebelum Pendaftaran IPO",
      summaryDesc: "Meskipun penjualan mencapai 99,4% dari target (Rp 70,55B), perusahaan Anda saat ini memiliki 2 Peringatan Kritis dan 2 Prioritas Tinggi yang mempengaruhi valuasi IPO.",
      lever1Title: "Jebakan Eksekusi PO (Konversi PO Terkonfirmasi → Faktur Terbit)",
      currentValLabel: "Angka Saat Ini",
      targetValLabel: "Target Wajib",
      lever1Impact: "⚠️ Mengapa ini merusak IPO: Rp 66,44B (94,2%) tertahan di tahap PO Terkonfirmasi. Pendapatan tanpa faktur tidak diakui dalam standar audit PSAK 72.",
      lever1StepsTitle: "🎯 LANGKAH PASTI UNTUK MENINGKATKAN ANGKA INI (DIREKTIF CEO):",
      lever1Step1: "Bentuk Satgas Mingguan Pengiriman-ke-Penagihan: Tugaskan COO & CFO untuk menyelesaikan hambatan di GiT dan STS.",
      lever1Step2: "Terapkan SLA Penandatanganan Milestone 5 Hari: Tegakkan SLA kontrak ketat dengan klien Enterprise.",
      lever1Step3: "Diselaraskan Bonus PM dengan Penagihan Kas: Hubungkan bonus Project Manager dengan penagihan tunai faktur.",
      lever2Title: "Kinerja Anak Perusahaan & Risiko Konsentrasi",
      lever2Impact: "⚠️ Mengapa ini merusak IPO: GiT (195,2%) dan STS (153,3%) menyumbang 83% pendapatan, menutupi penurunan di IFT (13,7%), DCT (24,2%), dan ONE (47.6%).",
      lever2Step1: "Konsolidasi DCT Group: Gabungkan 5 anak perusahaan menjadi 2 lini bisnis utama untuk memotong biaya.",
      lever2Step2: "Penjualan Silang Induk: Paketkan perangkat lunak IFT ke dalam proyek infrastruktur IT GiT & STS.",
      lever2Step3: "Tugaskan Ulang Talenta Sales: Pindahkan account executive terbaik dari GiT untuk memulihkan ONE.",
      lever3Title: "Days Sales Outstanding (DSO & Modal Kerja)",
      lever3Impact: "⚠️ Mengapa ini mempengaruhi valuasi: Siklus pembayaran 92 hari menahan kas dalam piutang dagang.",
      lever3Step1: "Mandat Deposit Kontrak Muka 30%: Pembayaran dimuka wajib untuk kontrak > Rp 1,0B.",
      lever3Step2: "Pemicu Eskalasi AR Otomatis: Pengingat Hari ke-15 → Penahanan Keuangan Hari ke-30 → Telepon CEO Hari ke-45.",
      lever3Step3: "Diskon Pelunasan Awal 2%: Tawarkan syarat 2/15 Net 60 untuk mempercepat penagihan kas.",
      lever4Title: "Rasio Pendapatan Berulang (ARR % vs Proyek Sekali Jalan)",
      lever4Impact: "⚠️ Mengapa ini mempengaruhi valuasi: Proyek IT sekali jalan dinilai 1,5x - 2,5x EV/Sales. ARR Layanan Dikelola dinilai 5x - 8x EV/Sales.",
      lever4Step1: "Tingkat Lampiran Layanan Dikelola Wajib: Lampirkan kontrak pemeliharaan SLA tahunan 15-20% pada semua proyek.",
      lever4Step2: "Produkkan Kode Kustom: Paketkan modul backend yang dapat digunakan kembali menjadi produk SaaS di bawah induk IFT."
    }
  }
};
