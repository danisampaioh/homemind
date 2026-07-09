"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const perguntas = [
  {
    id: "moradores",
    pergunta: "Quantas pessoas moram na sua casa?",
    opcoes: ["Só eu", "2 pessoas", "3 pessoas", "4 ou mais"],
  },
  {
    id: "refeicoes",
    pergunta: "Você costuma cozinhar em casa?",
    opcoes: ["Sim, todo dia", "Às vezes", "Raramente", "Nunca"],
  },
  {
    id: "rotina",
    pergunta: "Como é sua rotina na semana?",
    opcoes: ["Trabalho fora", "Trabalho em casa", "Varia muito", "Não trabalho"],
  },
];

export default function Onboarding() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [concluido, setConcluido] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const perguntaAtual = perguntas[etapa];

  async function responder(opcao: string) {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opcao };
    setRespostas(novasRespostas);

    if (etapa + 1 < perguntas.length) {
      setEtapa(etapa + 1);
    } else {
      await salvarPerfil(novasRespostas);
    }
  }

  async function salvarPerfil(respostasFinais: Record<string, string>) {
    setSalvando(true);
    setErro(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErro("Não encontramos seu usuário. Tente fazer login novamente.");
      setSalvando(false);
      return;
    }

    const { error } = await supabase.from("perfil_casa").upsert({
      user_id: user.id,
      quantas_pessoas: respostasFinais.moradores,
      frequencia_cozinha: respostasFinais.refeicoes,
      rotina_semana: respostasFinais.rotina,
      updated_at: new Date().toISOString(),
    });

    setSalvando(false);

    if (error) {
      setErro("Não conseguimos salvar suas respostas. Tente novamente.");
      return;
    }

    setConcluido(true);
  }

  if (erro) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <div className="text-4xl mb-2">⚠️</div>
            <CardTitle>Ops!</CardTitle>
            <CardDescription>{erro}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" onClick={() => setErro(null)}>
              Tentar de novo
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (concluido) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <div className="text-4xl mb-2">✅</div>
            <CardTitle>Tudo certo!</CardTitle>
            <CardDescription>
              Já sei o suficiente para começar a cuidar da sua casa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              Ver minha casa
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <p className="text-xs text-zinc-400 mb-1">
            {etapa + 1} de {perguntas.length}
          </p>
          <CardTitle className="text-lg">{perguntaAtual.pergunta}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {perguntaAtual.opcoes.map((opcao) => (
            <Button
              key={opcao}
              variant="outline"
              className="w-full justify-start"
              disabled={salvando}
              onClick={() => responder(opcao)}
            >
              {opcao}
            </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}