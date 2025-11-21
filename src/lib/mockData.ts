export const mockNetWorthData = [
  { date: "Jan", value: 1200000 },
  { date: "Feb", value: 1250000 },
  { date: "Mar", value: 1280000 },
  { date: "Apr", value: 1320000 },
  { date: "May", value: 1380000 },
  { date: "Jun", value: 1420000 },
  { date: "Jul", value: 1450000 },
  { date: "Aug", value: 1480000 },
  { date: "Sep", value: 1520000 },
  { date: "Oct", value: 1560000 },
  { date: "Nov", value: 1620000 },
  { date: "Dec", value: 1680000 },
];

export const mockAllocationByClass = [
  { name: "Stocks & ETFs", value: 580000, percentage: 35 },
  { name: "Funds", value: 420000, percentage: 25 },
  { name: "Cash", value: 330000, percentage: 20 },
  { name: "Crypto", value: 165000, percentage: 10 },
  { name: "Real Estate", value: 165000, percentage: 10 },
];

export const mockAllocationByProfile = [
  { name: "Personal", value: 920000, percentage: 55 },
  { name: "Company", value: 750000, percentage: 45 },
];

export const mockAssets = [
  {
    id: "1",
    type: "Stock",
    label: "LVMH",
    entity: "Personal",
    value: 125000,
    currency: "EUR",
    performance: "+12.5%",
    isPositive: true,
    allocation: 7.5,
    logo: "lvmh"
  },
  {
    id: "2",
    type: "Stock",
    label: "Apple",
    entity: "Personal",
    value: 180000,
    currency: "EUR",
    performance: "+22.8%",
    isPositive: true,
    allocation: 10.2,
    logo: "apple"
  },
  {
    id: "3",
    type: "Stock",
    label: "Google",
    entity: "Company",
    value: 210000,
    currency: "EUR",
    performance: "+28.5%",
    isPositive: true,
    allocation: 12.5,
    logo: "google"
  },
  {
    id: "4",
    type: "Stock",
    label: "Amazon",
    entity: "Company",
    value: 165000,
    currency: "EUR",
    performance: "+15.3%",
    isPositive: true,
    allocation: 9.8,
    logo: "amazon"
  },
  {
    id: "5",
    type: "Stock",
    label: "Microsoft",
    entity: "Personal",
    value: 195000,
    currency: "EUR",
    performance: "+19.7%",
    isPositive: true,
    allocation: 11.6,
    logo: "microsoft"
  },
  {
    id: "6",
    type: "Stock",
    label: "Meta",
    entity: "Company",
    value: 145000,
    currency: "EUR",
    performance: "+31.2%",
    isPositive: true,
    allocation: 8.6,
    logo: "meta"
  },
  {
    id: "7",
    type: "Stock",
    label: "Tesla",
    entity: "Personal",
    value: 155000,
    currency: "EUR",
    performance: "-5.8%",
    isPositive: false,
    allocation: 9.2,
    logo: "tesla"
  },
  {
    id: "8",
    type: "Fund",
    label: "BNP Tech Growth",
    entity: "Company",
    value: 280000,
    currency: "EUR",
    performance: "+18.2%",
    isPositive: true,
    allocation: 16.7,
    logo: "cash"
  },
  {
    id: "9",
    type: "Cash",
    label: "BNP Compte Courant",
    entity: "Personal",
    value: 85000,
    currency: "EUR",
    performance: "+1.5%",
    isPositive: true,
    allocation: 5.1,
    logo: "cash"
  },
  {
    id: "10",
    type: "Cash",
    label: "Livret A",
    entity: "Personal",
    value: 120000,
    currency: "EUR",
    performance: "+3.2%",
    isPositive: true,
    allocation: 7.1,
    logo: "cash"
  },
  {
    id: "11",
    type: "Crypto",
    label: "Bitcoin",
    entity: "Personal",
    value: 195000,
    currency: "EUR",
    performance: "+45.3%",
    isPositive: true,
    allocation: 11.6,
    logo: "bitcoin"
  },
  {
    id: "12",
    type: "Crypto",
    label: "Ethereum",
    entity: "Personal",
    value: 145000,
    currency: "EUR",
    performance: "+38.7%",
    isPositive: true,
    allocation: 8.6,
    logo: "ethereum"
  },
  {
    id: "13",
    type: "Crypto",
    label: "Solana",
    entity: "Personal",
    value: 85000,
    currency: "EUR",
    performance: "+92.5%",
    isPositive: true,
    allocation: 5.1,
    logo: "solana"
  },
  {
    id: "14",
    type: "Real Estate",
    label: "Appartement Paris 8ème",
    entity: "Holding",
    value: 950000,
    currency: "EUR",
    performance: "+5.2%",
    isPositive: true,
    allocation: 56.5,
    logo: "real-estate"
  },
  {
    id: "15",
    type: "Real Estate",
    label: "Bureau Lyon",
    entity: "Company",
    value: 620000,
    currency: "EUR",
    performance: "+4.8%",
    isPositive: true,
    allocation: 36.9,
    logo: "real-estate"
  },
];

export const mockDebts = [
  {
    id: "1",
    type: "Mortgage",
    lender: "BNP Paribas",
    balance: 450000,
    rate: "1.8%",
    maturity: "2038-06-15",
    entity: "Personal",
  },
  {
    id: "2",
    type: "Business Loan",
    lender: "BNP Paribas",
    balance: 180000,
    rate: "2.5%",
    maturity: "2029-03-20",
    entity: "Company",
  },
  {
    id: "3",
    type: "Credit Card",
    lender: "BNP Paribas Premier",
    balance: 8500,
    rate: "0%",
    maturity: "Revolving",
    entity: "Personal",
  },
];

export const mockProducts = [
  {
    id: "1",
    type: "Fund",
    name: "BNP Climate Transition",
    description: "Sustainable investment fund focused on energy transition and climate solutions",
    riskScore: 4,
    horizon: "5+ years",
    minTicket: 50000,
    theme: "Climate",
    performance: "+15.2% YTD",
  },
  {
    id: "2",
    type: "Structured Product",
    name: "Tech Leaders Autocall",
    description: "Capital-protected structured product with exposure to FANG+ index",
    riskScore: 3,
    horizon: "3-5 years",
    minTicket: 100000,
    theme: "Tech",
    performance: "+8.5% annualized",
  },
  {
    id: "3",
    type: "Private Equity",
    name: "European Growth Fund III",
    description: "Private equity fund investing in high-growth European tech companies",
    riskScore: 6,
    horizon: "7+ years",
    minTicket: 250000,
    theme: "Private Equity",
    performance: "+22.3% since inception",
  },
  {
    id: "4",
    type: "Cash",
    name: "BNP Cash Management",
    description: "High-yield savings account with daily liquidity and no minimum balance",
    riskScore: 1,
    horizon: "0-2 years",
    minTicket: 10000,
    theme: "Cash",
    performance: "+3.8% annual",
  },
  {
    id: "5",
    type: "Alternative",
    name: "Global Real Estate Income",
    description: "Diversified real estate fund with exposure to commercial and residential properties",
    riskScore: 4,
    horizon: "5+ years",
    minTicket: 150000,
    theme: "Real Estate",
    performance: "+9.2% YTD",
  },
];

export const formatCurrency = (value: number, currency: string = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number) => {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};
