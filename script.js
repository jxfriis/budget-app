// Nøgle til localStorage
const STORAGE_KEY = "budgetData_v1";

// Hent elementer
const monthInput = document.getElementById("monthInput");
const incomeForm = document.getElementById("incomeForm");
const incomeAmountInput = document.getElementById("incomeAmount");
const currentIncomeEl = document.getElementById("currentIncome");

const expenseForm = document.getElementById("expenseForm");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseTableBody = document.getElementById("expenseTableBody");

const totalExpensesEl = document.getElementById("totalExpenses");
const summaryIncomeEl = document.getElementById("summaryIncome");
const summaryExpensesEl = document.getElementById("summaryExpenses");
const summaryRemainingEl = document.getElementById("summaryRemaining");

let data = loadData();

// Sæt default måned til nu
function getCurrentMonthValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

monthInput.value = getCurrentMonthValue();

// Data struktur:
// {
//   "2025-11": {
//      income: 20000,
//      expenses: [{ category: "Mad", amount: 500 }, ...]
//   },
//   ...
// }

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Kunne ikke parse data", e);
    return {};
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getCurrentMonthData() {
  const monthKey = monthInput.value;
  if (!data[monthKey]) {
    data[monthKey] = { income: 0, expenses: [] };
  }
  return data[monthKey];
}

function render() {
  const monthData = getCurrentMonthData();

  // Løn
  currentIncomeEl.textContent = monthData.income.toFixed(2);
  incomeAmountInput.value = monthData.income ? monthData.income : "";

  // Udgifter tabel
  expenseTableBody.innerHTML = "";
  let totalExpenses = 0;

  monthData.expenses.forEach((exp) => {
    const tr = document.createElement("tr");

    const tdCat = document.createElement("td");
    tdCat.textContent = exp.category;

    const tdAmount = document.createElement("td");
    tdAmount.textContent = exp.amount.toFixed(2);

    tr.appendChild(tdCat);
    tr.appendChild(tdAmount);
    expenseTableBody.appendChild(tr);

    totalExpenses += exp.amount;
  });

  totalExpensesEl.textContent = totalExpenses.toFixed(2);

  // Summary
  summaryIncomeEl.textContent = monthData.income.toFixed(2);
  summaryExpensesEl.textContent = totalExpenses.toFixed(2);
  summaryRemainingEl.textContent = (monthData.income - totalExpenses).toFixed(2);
}

// Håndter ændring af måned
monthInput.addEventListener("change", () => {
  render();
});

// Håndter løn form
incomeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(incomeAmountInput.value);
  if (isNaN(amount) || amount < 0) {
    alert("Indtast en gyldig løn.");
    return;
  }
  const monthData = getCurrentMonthData();
  monthData.income = amount;
  saveData();
  render();
});

// Håndter udgift form
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = expenseCategoryInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (!category) {
    alert("Skriv en kategori.");
    return;
  }
  if (isNaN(amount) || amount < 0) {
    alert("Indtast et gyldigt beløb.");
    return;
  }

  const monthData = getCurrentMonthData();
  monthData.expenses.push({ category, amount });
  expenseCategoryInput.value = "";
  expenseAmountInput.value = "";

  saveData();
  render();
});

// Første render
render();
