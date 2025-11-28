export type LogoItem = {
  id: string;
  name: string;
  src: string;     // path locale o data URI
  href?: string;
  alt?: string;
  license?: string;
};

export const LOGOS: LogoItem[] = [
  {
    id: "nextjs",
    name: "Next.js",
    src: "/logos/nextjs.svg",
    href: "https://nextjs.org",
    alt: "Next.js logo",
    license: "Trademarked; use per brand guidelines.",
  },
  {
    id: "vercel",
    name: "Vercel",
    src: "/logos/vercel.svg",
    href: "https://vercel.com",
    alt: "Vercel logo",
    license: "Trademarked; use per brand guidelines.",
  },
  {
    id: "supabase",
    name: "Supabase",
    src: "/logos/supabase.svg",
    href: "https://supabase.com",
    alt: "Supabase logo",
    license: "Trademarked; use per brand guidelines.",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    src: "/logos/tailwindcss.svg",
    href: "https://tailwindcss.com",
    alt: "Tailwind CSS logo",
    license: "Trademarked; use per brand guidelines.",
  },
  {
    id: "stripe",
    name: "Stripe",
    src: "/logos/stripe.svg",
    href: "https://stripe.com",
    alt: "Stripe logo",
    license: "Trademarked; see Stripe brand guidelines.",
  },
];
