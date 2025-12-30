import { useState, useEffect } from 'react';

interface CreditInfo {
  available: number;
  used: number;
  limit: number;
  percentUsed: number;
}

export function useCredits(userId: string) {
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch crediti da Supabase
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        // Implementazione reale: fetch da Supabase
        // Per ora simuliamo
        const mockCredits: CreditInfo = {
          available: 100,
          used: 30,
          limit: 100,
          percentUsed: 30,
        };
        setCredits(mockCredits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCredits();
    }
  }, [userId]);

  // Verifica se utente ha abbastanza crediti
  const canAfford = (cost: number): boolean => {
    return credits ? credits.available >= cost : false;
  };

  // Usa crediti
  const useCredit = async (amount: number): Promise<boolean> => {
    if (!canAfford(amount)) return false;
    try {
      setCredits((prev) =>
        prev
          ? {
              ...prev,
              available: prev.available - amount,
              used: prev.used + amount,
              percentUsed: ((prev.used + amount) / prev.limit) * 100,
            }
          : null
      );
      // TODO: Sincronizza con Supabase
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use credit');
      return false;
    }
  };

  return {
    credits,
    loading,
    error,
    canAfford,
    useCredit,
  };
}
