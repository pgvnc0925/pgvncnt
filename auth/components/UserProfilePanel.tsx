"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function UserProfilePanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  // Supabase client not required here directly; profile is fetched via API route

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Profilo non disponibile');
      const data = await res.json();
      setProfile(data.profile);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setError(null);
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: profile.full_name, company_name: profile.company_name })});
    if (!res.ok) { setError('Errore salvataggio'); return; }
    await load();
  };

  const signOut = async () => {
    // fallback signout: call API route if present, otherwise just reload
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (e) {
      // ignore network errors in fallback
    }
    window.location.href = '/';
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Profilo Personale</h3>
        <p className="mt-1 text-sm text-gray-600">Gestisci le informazioni del tuo profilo personale</p>
      </div>
      <div className="p-6 space-y-6">
        {error && <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
        {loading ? (
          <div>Caricamento…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
              <input type="text" value={profile?.full_name || ''} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={profile?.email || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Azienda</label>
              <input type="text" value={profile?.company_name || ''} onChange={e => setProfile({ ...profile, company_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex items-end gap-3">
              <Button onClick={save}>Salva</Button>
              <Button variant="outline" onClick={signOut}>Esci</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
