//UTILITIES

function generateCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  code += Math.floor(100 + Math.random() * 900);
  return code;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

//PAYMENT CALCULATION

function calculateAmount(paymentType, rate, duration) {
  if (paymentType === "HOURLY") return rate * duration;
  if (paymentType === "DAILY") return rate * duration;
  if (paymentType === "MONTHLY") return rate * duration;
  return 0;
}

//CREATE PURCHASE ORDER

function createPurchaseOrder(trainer, training, payment) {
  const totalAmount = calculateAmount(
    payment.type,
    payment.rate,
    payment.duration
  );

  return {
    poNumber: generateCode(),
    trainer,
    training,
    payment,
    totalAmount
  };
}


//GENERATE INVOICE (AFTER TRAINING END)

function generateInvoice(po) {
  const today = new Date();
  const trainingEnd = new Date(po.training.endDate);

  if (today < trainingEnd) {
    return { error: "Training not completed yet ❌" };
  }

  return {
    invoiceNumber: generateCode(),
    poNumber: po.poNumber,
    trainerName: po.trainer.name,
    courseName: po.training.course,
    totalAmount: po.totalAmount,
    invoiceDate: today,
    dueDate: addDays(today, 30),
    paymentStatus: "UNPAID"
  };
}

//OVERDUE CHECK + EMAIL ALERT

function checkOverdue(invoice) {
  const today = new Date();

  if (invoice.paymentStatus === "PAID") return;

  if (today > invoice.dueDate) {
    invoice.paymentStatus = "OVERDUE";
    sendEmailAlert(invoice);
  }
}

function sendEmailAlert(invoice) {
  console.log("📧 EMAIL SENT TO ACCOUNTS TEAM");
  console.log(
    `Invoice ${invoice.invoiceNumber} is OVERDUE for ₹${invoice.totalAmount}`
  );
}


// SAMPLE DATA
// Trainer Info
const trainer = {
  name: "Sharath Kumar",
  email: "sharath@gmail.com",
  experience: "6 Years"
};

// Training Info
const training = {
  course: "Java Full Stack",
  client: "ABC Corp",
  startDate: "2025-01-01",
  endDate: "2025-01-31"
};

// Payment Info (HOURLY / DAILY / MONTHLY)
const payment = {
  type: "DAILY",
  rate: 5000,
  duration: 20 // days
};

// STEP 1: Create PO
const po = createPurchaseOrder(trainer, training, payment);
console.log("📄 PURCHASE ORDER");
console.log(po);

// STEP 2: Generate Invoice
const invoice = generateInvoice(po);
console.log("\n🧾 INVOICE");
console.log(invoice);

// STEP 3: Overdue Check (simulate later date)
if (!invoice.error) {
  // simulate overdue
  invoice.dueDate = addDays(new Date(), -1);
  checkOverdue(invoice);
  console.log("\n💳 PAYMENT STATUS:", invoice.paymentStatus);
}
