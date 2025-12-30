import { getAppBySlug, getAllAppSlugs } from '@/apps';
import { AppLanding } from '@/components/app/app-landing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const slugs = getAllAppSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const app = getAppBySlug(params.slug);
  if (!app) return {};

  return {
    title: app.landing.metaTitle,
    description: app.landing.metaDescription,
    openGraph: {
      title: app.landing.metaTitle,
      description: app.landing.metaDescription,
    },
  };
}

export default function AppLandingPage({ params }: { params: { slug: string } }) {
  const app = getAppBySlug(params.slug);

  if (!app) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AppLanding app={app} />
      </main>
      <Footer />
    </div>
  );
}
