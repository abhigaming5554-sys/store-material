import jsPDF
from "jspdf";

export default function
generateInvoice(

  order: any

) {

  const doc =
    new jsPDF();

  // Title
  doc.setFontSize(22);

  doc.text(

    "Store Material Invoice",

    20,

    20

  );

  // Divider
  doc.line(

    20,

    30,

    190,

    30

  );

  // Order Details
  doc.setFontSize(14);

  doc.text(

    `Product: ${order.title}`,

    20,

    50

  );

  doc.text(

    `Price: ₹${order.price}`,

    20,

    65

  );

  doc.text(

    `Payment ID: ${order.paymentId}`,

    20,

    80

  );

  doc.text(

    `Date: ${new Date(
      order.createdAt
    ).toLocaleString()}`,

    20,

    95

  );

  // Footer
  doc.setFontSize(12);

  doc.text(

    "Thank you for your purchase 😄",

    20,

    130

  );

  // Save PDF
  doc.save(

    `${order.title}-invoice.pdf`

  );

}