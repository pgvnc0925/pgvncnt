import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBookStats } from "@/lib/books";
import { getProgressStats } from "@/lib/user-progress";
import { BookOpen, Target, TrendingUp, Award, User } from "lucide-react";

export async function RealStatsDashboard() {
  // Get real book statistics
  const bookStats = getBookStats();

  // Get user progress
  const userProgress = await getProgressStats();

  // Calculate level goals (you can adjust these targets)
  const levelGoals = {
    base: 10,
    intermedio: 15,
    avanzato: 25,
  };

  const totalGoal = levelGoals.base + levelGoals.intermedio + levelGoals.avanzato;

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Stato della Libreria
        </h2>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Library Stats Card */}
        <Card className="glass-surface-strong border-2 border-white/60 shadow-[0_16px_60px_rgba(15,23,42,0.16)]">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Libreria Totale</p>
                  <h3 className="text-3xl font-bold">{bookStats.total} libri</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-600" />
                      <span className="font-medium">Base</span>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {bookStats.byLevel.base}/{levelGoals.base}
                    </span>
                  </div>
                  <Progress
                    value={(bookStats.byLevel.base / levelGoals.base) * 100}
                    className="h-2 bg-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Intermedio</span>
                    </div>
                    <span className="font-semibold text-amber-700">
                      {bookStats.byLevel.intermedio}/{levelGoals.intermedio}
                    </span>
                  </div>
                  <Progress
                    value={(bookStats.byLevel.intermedio / levelGoals.intermedio) * 100}
                    className="h-2 bg-amber-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium">Avanzato</span>
                    </div>
                    <span className="font-semibold text-primary">
                      {bookStats.byLevel.avanzato}/{levelGoals.avanzato}
                    </span>
                  </div>
                  <Progress
                    value={(bookStats.byLevel.avanzato / levelGoals.avanzato) * 100}
                    className="h-2 bg-primary/20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completamento Totale</span>
                  <span className="text-sm font-bold">
                    {Math.round((bookStats.total / totalGoal) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(bookStats.total / totalGoal) * 100}
                  className="h-2 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Progress Card */}
        <Card className="glass-surface-strong border-2 border-white/60 shadow-[0_16px_60px_rgba(15,23,42,0.16)]">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Il Tuo Progresso</p>
                  <h3 className="text-3xl font-bold text-secondary">
                    {userProgress.totalAccessed} {userProgress.totalAccessed === 1 ? 'libro' : 'libri'}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Riassunti Letti</p>
                      <p className="text-lg font-bold">{userProgress.viewedCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contenuti Sbloccati</p>
                      <p className="text-lg font-bold">{userProgress.unlockedCount}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/60 border border-slate-200">
                    <p className="text-xs text-muted-foreground mb-1">Quiz Completati</p>
                    <p className="text-xl font-bold text-purple-600">{userProgress.quizzesCompleted}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/60 border border-slate-200">
                    <p className="text-xs text-muted-foreground mb-1">Mappe Viste</p>
                    <p className="text-xl font-bold text-orange-600">{userProgress.mapsViewed}</p>
                  </div>
                </div>
              </div>

              {userProgress.totalAccessed > 0 && (
                <div className="pt-4 border-t border-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Avanzamento Libreria</span>
                    <span className="text-sm font-bold text-secondary">
                      {Math.round((userProgress.totalAccessed / bookStats.total) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(userProgress.totalAccessed / bookStats.total) * 100}
                    className="h-2 bg-secondary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {userProgress.totalAccessed} su {bookStats.total} libri esplorati
                  </p>
                </div>
              )}

              {userProgress.totalAccessed === 0 && (
                <div className="pt-4 border-t border-secondary/20">
                  <p className="text-sm text-muted-foreground text-center">
                    Inizia a leggere i riassunti per tracciare i tuoi progressi!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
