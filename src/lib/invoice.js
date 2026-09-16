import { jsPDF } from 'jspdf';

function formatZAR(amount) {
  return `R${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function buildInvoicePdf(order, items) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  let y = 60;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('The Blend.Co', marginX, y);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice', 500, y, { align: 'right' });

  y += 30;
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.id}`, marginX, y);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-ZA')}`, 500, y, { align: 'right' });

  y += 16;
  doc.text(`Payment status: ${order.payment_status}`, marginX, y);

  const address = order.shipping_address || {};
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Billed to', marginX, y);
  doc.setFont('helvetica', 'normal');
  y += 14;
  doc.text(`${address.firstName || ''} ${address.lastName || ''}`.trim(), marginX, y);
  y += 14;
  if (address.address) {
    doc.text(address.address, marginX, y);
    y += 14;
  }
  const cityLine = [address.city, address.province, address.postalCode].filter(Boolean).join(', ');
  if (cityLine) {
    doc.text(cityLine, marginX, y);
    y += 14;
  }
  doc.text(order.email || '', marginX, y);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', marginX, y);
  doc.text('Qty', 340, y, { align: 'right' });
  doc.text('Unit Price', 430, y, { align: 'right' });
  doc.text('Total', 520, y, { align: 'right' });
  y += 8;
  doc.line(marginX, y, 520, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  items.forEach((item) => {
    const variantText = item.variant_attributes
      ? Object.entries(item.variant_attributes)
          .filter(([key]) => key !== '_storefrontId')
          .map(([, v]) => v)
          .join(' · ')
      : '';
    doc.text(item.product_name, marginX, y, { maxWidth: 260 });
    if (variantText) {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(variantText, marginX, y + 11);
      doc.setFontSize(10);
      doc.setTextColor(0);
    }
    doc.text(String(item.quantity), 340, y, { align: 'right' });
    doc.text(formatZAR(item.unit_price), 430, y, { align: 'right' });
    doc.text(formatZAR(item.unit_price * item.quantity), 520, y, { align: 'right' });
    y += variantText ? 28 : 20;
  });

  y += 10;
  doc.line(marginX, y, 520, y);
  y += 20;

  doc.text('Subtotal', 430, y, { align: 'right' });
  doc.text(formatZAR(order.subtotal), 520, y, { align: 'right' });
  y += 16;
  doc.text('Shipping', 430, y, { align: 'right' });
  doc.text(formatZAR(order.shipping_cost), 520, y, { align: 'right' });
  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.text('Total', 430, y, { align: 'right' });
  doc.text(formatZAR(order.total), 520, y, { align: 'right' });

  y += 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Thank you for shopping with The Blend.Co.', marginX, y);

  return doc;
}

export function downloadInvoicePdf(order, items) {
  const doc = buildInvoicePdf(order, items);
  doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
}
