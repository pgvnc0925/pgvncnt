export type BookLevel = 'base' | 'intermedio' | 'avanzato';

export interface Book {
    id: string;
    slug: string;
    title: string;
    author: string;
    level: BookLevel;
    rating: number;
    reviewCount: number;
    coverImage: string;
    description: string;
    readingTimeFull: string;
    readingTimeSystem: string;
    tags: string[];
}

export const books: Book[] = [
    {
        id: '1',
        slug: 'marketing-management',
        title: 'Marketing Management',
        author: 'Philip Kotler & Kevin Lane Keller',
        level: 'base',
        rating: 4.9,
        reviewCount: 2100,
        coverImage: '/images/books/marketing-management.jpg',
        description: 'La base: il sistema operativo mentale del marketing.',
        readingTimeFull: '16 ore',
        readingTimeSystem: '70 minuti',
        tags: ['Marketing', 'Strategia', 'Fundamentals']
    },
    {
        id: '2',
        slug: 'positioning',
        title: 'Positioning',
        author: 'Al Ries & Jack Trout',
        level: 'base',
        rating: 4.8,
        reviewCount: 1650,
        coverImage: '/images/books/positioning.jpg',
        description: 'Il modo corretto di vedere il mercato.',
        readingTimeFull: '6 ore',
        readingTimeSystem: '40 minuti',
        tags: ['Marketing', 'Strategia', 'Branding']
    },
    {
        id: '3',
        slug: 'le-22-leggi-del-marketing',
        title: 'Le 22 Immutabili Leggi del Marketing',
        author: 'Al Ries & Jack Trout',
        level: 'base',
        rating: 4.7,
        reviewCount: 980,
        coverImage: '/images/books/22-immutable-laws.jpg',
        description: 'La disciplina strategica fatta libro. Fornisce leggi, non consigli.',
        readingTimeFull: '5 ore',
        readingTimeSystem: '35 minuti',
        tags: ['Strategia', 'Leggi', 'Branding']
    },
    {
        id: '4',
        slug: 'how-brands-grow',
        title: 'How Brands Grow',
        author: 'Byron Sharp',
        level: 'base',
        rating: 4.6,
        reviewCount: 1120,
        coverImage: '/images/books/how-brands-grow.jpg',
        description: "L'unico libro di marketing basato su evidenze scientifiche solide.",
        readingTimeFull: '7 ore',
        readingTimeSystem: '45 minuti',
        tags: ['Marketing', 'Evidenze', 'Brand Growth']
    },
    {
        id: '5',
        slug: 'blue-ocean-strategy',
        title: 'Blue Ocean Strategy',
        author: 'W. Chan Kim & Renée Mauborgne',
        level: 'base',
        rating: 4.6,
        reviewCount: 1340,
        coverImage: '/images/books/blue-ocean-strategy.jpg',
        description: 'Il pensiero differenziale strutturato.',
        readingTimeFull: '8 ore',
        readingTimeSystem: '50 minuti',
        tags: ['Strategia', 'Innovazione', 'Differenziazione']
    },
    {
        id: '6',
        slug: 'one-page-marketing-plan',
        title: 'The 1-Page Marketing Plan',
        author: 'Allan Dib',
        level: 'base',
        rating: 4.5,
        reviewCount: 890,
        coverImage: '/images/books/one-page-marketing-plan.jpg',
        description: 'Ponte tra teoria e applicazione. Fa capire come la strategia diventa azione.',
        readingTimeFull: '6 ore',
        readingTimeSystem: '40 minuti',
        tags: ['Piano', 'Applicazione', 'Strategia']
    },
    {
        id: '7',
        slug: 'ogilvy-on-advertising',
        title: 'Ogilvy on Advertising',
        author: 'David Ogilvy',
        level: 'base',
        rating: 4.7,
        reviewCount: 760,
        coverImage: '/images/books/ogilvy-on-advertising.jpg',
        description: 'Il fondamento del copywriting e advertising che funziona. È pratico, non creativo per finta.',
        readingTimeFull: '7 ore',
        readingTimeSystem: '45 minuti',
        tags: ['Advertising', 'Copywriting', 'Pratico']
    },
    {
        id: '8',
        slug: 'influence',
        title: 'Influence',
        author: 'Robert Cialdini',
        level: 'base',
        rating: 4.9,
        reviewCount: 1240,
        coverImage: '/images/books/influence.jpg',
        description: 'Il cervello dell’acquirente, e perché dice “sì”.',
        readingTimeFull: '8 ore',
        readingTimeSystem: '45 minuti',
        tags: ['Psicologia', 'Persuasione', 'Decisioni']
    },
    {
        id: '9',
        slug: 'thinking-fast-and-slow',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        level: 'base',
        rating: 4.8,
        reviewCount: 980,
        coverImage: '/images/books/thinking-fast-and-slow.jpg',
        description: 'La mappa del sistema decisionale umano. Ostico ma necessario.',
        readingTimeFull: '12 ore',
        readingTimeSystem: '60 minuti',
        tags: ['Decision Making', 'Psicologia', 'Sistemi di pensiero']
    },
    {
        id: '10',
        slug: 'breakthrough-advertising',
        title: 'Breakthrough Advertising',
        author: 'Eugene Schwartz',
        level: 'base',
        rating: 4.9,
        reviewCount: 640,
        coverImage: '/images/books/breakthrough-advertising.jpg',
        description: 'Il libro più profondo sul desiderio e sulla consapevolezza del cliente.',
        readingTimeFull: '9 ore',
        readingTimeSystem: '55 minuti',
        tags: ['Advertising', 'Desiderio', 'Copywriting']
    },
    {
        id: '11',
        slug: 'innovators-dilemma',
        title: "The Innovator's Dilemma",
        author: 'Clayton Christensen',
        level: 'intermedio',
        rating: 4.6,
        reviewCount: 600,
        coverImage: '/images/books/innovators-dilemma.jpg',
        description: "Perché le grandi aziende falliscono e come l'innovazione disruptiva cambia i mercati.",
        readingTimeFull: '9 ore',
        readingTimeSystem: '50 minuti',
        tags: ['Business', 'Innovazione', 'Strategia']
    },
    {
        id: '12',
        slug: 'nudge',
        title: 'Nudge',
        author: 'Richard Thaler',
        level: 'intermedio',
        rating: 4.4,
        reviewCount: 550,
        coverImage: '/images/books/nudge.jpg',
        description: 'La spinta gentile. Come aiutare le persone a prendere decisioni migliori.',
        readingTimeFull: '7 ore',
        readingTimeSystem: '40 minuti',
        tags: ['Economia Comportamentale', 'Psicologia', 'Policy']
    },
    {
        id: '13',
        slug: 'thinking-in-systems',
        title: 'Thinking in Systems',
        author: 'Donella Meadows',
        level: 'avanzato',
        rating: 4.8,
        reviewCount: 400,
        coverImage: '/images/books/thinking-in-systems.jpg',
        description: 'Capire la complessità del mondo attraverso il pensiero sistemico.',
        readingTimeFull: '10 ore',
        readingTimeSystem: '55 minuti',
        tags: ['Sistemi', 'Logica', 'Problem Solving']
    }
];
