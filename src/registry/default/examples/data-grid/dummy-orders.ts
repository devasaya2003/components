export type DummyOrderStatus = "open" | "in_progress" | "shipped" | "done";

export type DummyOrder = {
  id: string;
  orderNumber: string;
  company: string;
  assignee: string;
  status: DummyOrderStatus;
  amount: number;
  poDate: string;
  notes: string;
};

const COMPANIES = [
  "Northwind Traders",
  "Contoso Ltd",
  "Fabrikam",
  "Adventure Works",
  "Wide World Importers",
  "Litware Inc",
  "Alpine Ski House",
  "Blue Yonder",
];

const ASSIGNEES = [
  "Ava Patel",
  "Noah Kim",
  "Mia Chen",
  "Liam Shah",
  "Sofia Alvarez",
  "Ethan Rao",
];

const STATUSES: DummyOrderStatus[] = [
  "open",
  "in_progress",
  "shipped",
  "done",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export const DUMMY_ORDERS: DummyOrder[] = Array.from({ length: 40 }, (_, index) => {
  const n = index + 1;
  const month = (index % 12) + 1;
  const day = (index % 27) + 1;
  return {
    id: `ord-${n}`,
    orderNumber: `SO-${2026}${pad(n)}`,
    company: COMPANIES[index % COMPANIES.length] ?? "Northwind Traders",
    assignee: ASSIGNEES[index % ASSIGNEES.length] ?? "Ava Patel",
    status: STATUSES[index % STATUSES.length] ?? "open",
    amount: 1200 + index * 185,
    poDate: `2026-${pad(month)}-${pad(day)}`,
    notes: index % 5 === 0 ? "Rush delivery" : "Standard terms",
  };
});

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const STATUS_FILTER_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "done", label: "Done" },
];

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function fetchOrders(query: string) {
  await delay(200);
  const term = query.trim().toLowerCase();
  if (!term) {
    return DUMMY_ORDERS;
  }
  return DUMMY_ORDERS.filter((row) =>
    `${row.orderNumber} ${row.company} ${row.assignee} ${row.status}`
      .toLowerCase()
      .includes(term),
  );
}

export async function fetchCompanyFilterOptions(search: string) {
  await delay(200);
  const term = search.trim().toLowerCase();
  const unique = [...new Set(DUMMY_ORDERS.map((row) => row.company))];
  return unique
    .filter((company) => company.toLowerCase().includes(term))
    .map((company) => ({ value: company, label: company }));
}
