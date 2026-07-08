"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

type Item = { id: string; nome: string; dias_restantes: number; };
type Rotina = { id: string; nome: string; frequencia: number; dias_desde_ultima: number; };

function StatusEstoque({ dias }: { dias: number }) {
  if (dias <= 5) return <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Acabando em {dias} dias</span>;
  return <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">OK</span>;
}

function StatusRotina({ diasDesdeUltima, frequencia }: { diasDesdeUltima: number; frequencia: number }) {
  if (diasDesdeUltima >= frequencia) return <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Em atraso</span>;
  if (diasDesdeUltima >= frequencia - 1) return <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Amanha</span>;
  return <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Em dia</span>;
}

export default function Dashboard() {
  const [itens, setItens] = useState<Item[]>([]);
  const [rotinas, setRotinas] = useState<Rotina[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoItem, setNovoItem] = useState("");
  const [novaRotina, setNovaRotina] = useState("");
  const [adicionandoItem, setAdicionandoItem] = useState(false);
  const [adicionandoRotina, setAdicionandoRotina] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: itensData } = await supabase.from("itens").select("*");
    const { data: rotinasData } = await supabase.from("rotinas").select("*");
    setItens(itensData || []);
    setRotinas(rotinasData || []);
    setLoading(false);
  }

  async function salvarItem() {
    if (!novoItem.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("itens").insert({ nome: novoItem, dias_restantes: 30, user_id: user?.id });
    setNovoItem(""); setAdicionandoItem(false); carregarDados();
  }

  async function salvarRotina() {
    if (!novaRotina.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("rotinas").insert({ nome: novaRotina, frequencia: 7, dias_desde_ultima: 0, user_id: user?.id });
    setNovaRotina(""); setAdicionandoRotina(false); carregarDados();
  }

  if (loading) return <main className="min-h-screen bg-zinc-50 flex items-center justify-center"><p className="text-zinc-500 text-sm">Carregando sua casa...</p></main>;

  return (
    <main className="min-h-screen bg-zinc-50 p-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6 pt-4">
        <div>
          <h1 className="text-xl font-semibold">Sua casa</h1>
          <p className="text-sm text-zinc-500">{itens.length === 0 && rotinas.length === 0 ? "Adicione itens e rotinas para comecar" : `${itens.length} itens e ${rotinas.length} rotinas`}</p>
        </div>
        <div className="text-3xl">🏠</div>
      </div>
      <Card className="mb-4">
        <CardHeader className="pb-2"><CardTitle className="text-base">🛒 Itens essenciais</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {itens.length === 0 ? <p className="text-sm text-zinc-400">Nenhum item cadastrado ainda</p> : itens.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-sm">{item.nome}</span>
              <StatusEstoque dias={item.dias_restantes} />
            </div>
          ))}
          {adicionandoItem ? (
            <div className="flex gap-2">
              <Input placeholder="Nome do item" value={novoItem} onChange={(e) => setNovoItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && salvarItem()} autoFocus />
              <Button size="sm" onClick={salvarItem}>Salvar</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => setAdicionandoItem(true)}>+ Adicionar item</Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">🔄 Rotinas da casa</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rotinas.length === 0 ? <p className="text-sm text-zinc-400">Nenhuma rotina cadastrada ainda</p> : rotinas.map((rotina) => (
            <div key={rotina.id} className="flex items-center justify-between">
              <span className="text-sm">{rotina.nome}</span>
              <StatusRotina diasDesdeUltima={rotina.dias_desde_ultima} frequencia={rotina.frequencia} />
            </div>
          ))}
          {adicionandoRotina ? (
            <div className="flex gap-2">
              <Input placeholder="Nome da rotina" value={novaRotina} onChange={(e) => setNovaRotina(e.target.value)} onKeyDown={(e) => e.key === "Enter" && salvarRotina()} autoFocus />
              <Button size="sm" onClick={salvarRotina}>Salvar</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => setAdicionandoRotina(true)}>+ Adicionar rotina</Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
