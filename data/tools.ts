export interface Tool {
  slug: string
  name: string
  description: string
  category: string
  bookCount: number
  relatedBooks: string[]
}

export const tools: Tool[] = [
  {
    slug: "decision-validator",
    name: "Decision Validator",
    description: "Valida decisioni importanti usando 5 framework celebri",
    category: "decision-making",
    bookCount: 5,
    relatedBooks: ["principles-dalio", "thinking-fast-slow", "good-strategy-bad-strategy"]
  },
  {
    slug: "marketing-campaign-architect",
    name: "Marketing Campaign Architect",
    description: "Progetta campagne marketing con framework testati",
    category: "marketing",
    bookCount: 4,
    relatedBooks: ["traction", "positioning", "influence"]
  },
  {
    slug: "strategy-canvas",
    name: "Strategy Canvas",
    description: "Crea la tua strategia business con il Blue Ocean framework",
    category: "strategy",
    bookCount: 3,
    relatedBooks: ["blue-ocean-strategy", "playing-to-win"]
  },
  {
    slug: "okr-builder",
    name: "OKR Builder",
    description: "Definisci Objectives e Key Results efficaci",
    category: "execution",
    bookCount: 2,
    relatedBooks: ["measure-what-matters", "high-output-management"]
  },
  {
    slug: "customer-persona-generator",
    name: "Customer Persona Generator",
    description: "Crea personas dettagliate usando il Jobs-to-be-Done framework",
    category: "product",
    bookCount: 3,
    relatedBooks: ["competing-against-luck", "mom-test"]
  },
  {
    slug: "value-proposition-designer",
    name: "Value Proposition Designer",
    description: "Progetta value proposition che convertono",
    category: "product",
    bookCount: 2,
    relatedBooks: ["value-proposition-design", "lean-startup"]
  }
]