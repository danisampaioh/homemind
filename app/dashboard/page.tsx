"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const itensEstoque = [
  { nome: "Arroz", status: "acabando", diasRestantes: 3 },
  { nome: "Detergente", status: "acabando", diasRestantes: 5 },
  { nome: "Papel higiênico", status: "ok", diasRestantes: 15 },
];

const rotinas = [
  { nome: "Trocar roupa de cama", diasDesdeUltima: 12, frequencia: 14 },
  { nome: "Limpeza do banheiro", diasDesdeUltima: 6, frequencia: 7 },
  { nome: "Limpeza da cozinha", diasDesdeUltima: 2, frequencia: 7 },
];

function StatusEstoque({ dias }: { dias: number }) {
  if (dias <= 5) {
    return (
      <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
        Acabando em {dias} dias
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
      OK
    </span>
  );
}

function StatusRotina({ diasDesdeUltima, frequencia }: { diasDesdeUltima: number; frequencia: number }) {
  const atrasada = diasDesdeUltima >= frequencia;
  const proximaDe = diasDesdeUltima >= frequencia - 1;

  if (atrasada) {
    return (
      <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
        Em atraso
      </span>
    );
  }
  if (proximaDe) {
    return (
      <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
        Amanhã
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
      Em dia
    </span>
  );
}

export default function Dashboard() {
  const itensAtencao = itensEstoque.filter((i) => i.diasRestantes <= 5);
  const rotinasAtencao = rotinas.filter((r) => r.diasDesdeUltima >= r.frequencia - 1);
  const totalAtencao = itensAtencao.length + rotinasAtencao.length;

  return (
    <main className="min-h-screen bg-zinc-50 p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <div>
          <h1 className="text-xl font-semibold">Olá, Daniela 👋</h1>
          <p className="text-sm text-zinc-500">
            {totalAtencao === 0
              ? "Sua casa está em dia!"
              : `${totalAtencao} itens precisam de atenção`}
          </p>
        </div>
        <div className="text-3xl">🏠</div>
      </div>

      {/* Card Estoque */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            🛒 Itens essenciais
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {itensEstoque.map((item) => (
            <div key={item.nome} className="flex items-center justify-between">
              <span className="text-sm">{item.nome}</span>
              <StatusEstoque dias={item.diasRestantes} />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-1">
            + Adicionar item
          </Button>
        </CardContent>
      </Card>

      {/* Card Rotinas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            🔄 Rotinas da casa
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rotinas.map((rotina) => (
            <div key={rotina.nome} className="flex items-center justify-between">
              <span className="text-sm">{rotina.nome}</span>
              <StatusRotina
                diasDesdeUltima={rotina.diasDesdeUltima}
                frequencia={rotina.frequencia}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-1">
            + Adicionar rotina
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}