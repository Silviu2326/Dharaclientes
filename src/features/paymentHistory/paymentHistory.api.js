// Mock data para historial de pagos
const mockPayments = [
  {
    id: 'PAY-001',
    date: '2024-01-15',
    therapist: 'Dr. María García',
    concept: 'Sesión de terapia individual',
    amount: 75.00,
    status: 'Pagado',
    type: 'sesion',
    method: 'Tarjeta de crédito',
    transactionId: 'TXN-123456789',
    invoiceUrl: '/invoices/PAY-001.pdf',
    breakdown: {
      subtotal: 62.81,
      tax: 12.19,
      total: 75.00
    }
  },
  {
    id: 'PAY-002',
    date: '2024-01-08',
    therapist: 'Dr. Carlos López',
    concept: 'Pack 4 sesiones',
    amount: 280.00,
    status: 'Pagado',
    type: 'pack',
    method: 'PayPal',
    transactionId: 'TXN-987654321',
    invoiceUrl: '/invoices/PAY-002.pdf',
    breakdown: {
      subtotal: 234.45,
      tax: 45.55,
      total: 280.00
    }
  },
  {
    id: 'PAY-003',
    date: '2023-12-20',
    therapist: 'Dr. Ana Martínez',
    concept: 'Sesión de pareja',
    amount: 90.00,
    status: 'Reembolsado',
    type: 'sesion',
    method: 'Tarjeta de débito',
    transactionId: 'TXN-456789123',
    invoiceUrl: '/invoices/PAY-003.pdf',
    breakdown: {
      subtotal: 75.21,
      tax: 14.79,
      total: 90.00
    }
  },
  {
    id: 'PAY-004',
    date: '2023-11-30',
    therapist: 'Dr. Luis Rodríguez',
    concept: 'Evaluación psicológica',
    amount: 120.00,
    status: 'Pagado',
    type: 'otro',
    method: 'Transferencia',
    transactionId: 'TXN-789123456',
    invoiceUrl: '/invoices/PAY-004.pdf',
    breakdown: {
      subtotal: 100.84,
      tax: 19.16,
      total: 120.00
    }
  }
];

const mockStats = {
  totalThisYear: 565.00,
  lastInvoice: {
    amount: 75.00,
    date: '2024-01-15'
  },
  totalPayments: 4,
  averageAmount: 141.25
};

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPaymentHistory(filters = {}) {
  await delay(800);
  
  let filteredPayments = [...mockPayments];
  
  // Aplicar filtros
  if (filters.dateFrom) {
    filteredPayments = filteredPayments.filter(p => new Date(p.date) >= new Date(filters.dateFrom));
  }
  
  if (filters.dateTo) {
    filteredPayments = filteredPayments.filter(p => new Date(p.date) <= new Date(filters.dateTo));
  }
  
  if (filters.type && filters.type !== 'todos') {
    filteredPayments = filteredPayments.filter(p => p.type === filters.type);
  }
  
  if (filters.status && filters.status !== 'todos') {
    filteredPayments = filteredPayments.filter(p => p.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredPayments = filteredPayments.filter(p => 
      p.id.toLowerCase().includes(searchLower) ||
      p.therapist.toLowerCase().includes(searchLower) ||
      p.concept.toLowerCase().includes(searchLower)
    );
  }
  
  return {
    payments: filteredPayments,
    total: filteredPayments.length
  };
}

export async function getPaymentById(paymentId) {
  await delay(500);
  return mockPayments.find(p => p.id === paymentId) || null;
}

export async function getPaymentStats() {
  await delay(300);
  return mockStats;
}

export async function downloadInvoice(paymentId) {
  await delay(1000);
  const payment = mockPayments.find(p => p.id === paymentId);
  if (payment) {
    // Simular descarga
    const link = document.createElement('a');
    link.href = payment.invoiceUrl;
    link.download = `factura-${paymentId}.pdf`;
    link.click();
    return true;
  }
  return false;
}

export async function resendReceipt(paymentId, email) {
  await delay(1500);
  console.log(`Reenviando recibo de ${paymentId} a ${email}`);
  return true;
}

export async function exportPaymentsCSV(filters = {}) {
  await delay(2000);
  const { payments } = await getPaymentHistory(filters);
  
  const csvContent = [
    'ID,Fecha,Terapeuta,Concepto,Importe,Estado,Tipo,Método',
    ...payments.map(p => 
      `${p.id},${p.date},"${p.therapist}","${p.concept}",${p.amount},${p.status},${p.type},"${p.method}"`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `historial-pagos-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
  
  return true;
}

export async function exportAnnualPDF(year = new Date().getFullYear()) {
  await delay(3000);
  console.log(`Generando resumen PDF para el año ${year}`);
  
  // Simular generación de PDF
  const link = document.createElement('a');
  link.href = `/reports/resumen-anual-${year}.pdf`;
  link.download = `resumen-anual-${year}.pdf`;
  link.click();
  
  return true;
}

export async function getPaymentMethods() {
  await delay(600);
  return [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 'pm-2',
      type: 'paypal',
      email: 'usuario@email.com',
      isDefault: false
    }
  ];
}

export async function addPaymentMethod(paymentMethod) {
  await delay(1200);
  console.log('Agregando método de pago:', paymentMethod);
  return {
    id: `pm-${Date.now()}`,
    ...paymentMethod,
    isDefault: false
  };
}