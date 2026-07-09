import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { nomeItem, userId } = await request.json();

    if (!nomeItem || !userId) {
      return NextResponse.json(
        { error: "Faltam dados: nomeItem e userId são obrigatórios." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: perfil, error: erroPerfil } = await supabaseAdmin
      .from("perfil_casa")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (erroPerfil || !perfil) {
      return NextResponse.json(
        { error: "Perfil da casa não encontrado. Complete o onboarding primeiro." },
        { status: 404 }
      );
    }

    const prompt = `
Você é um assistente especializado em estimar quanto tempo itens domésticos duram, com base no perfil da casa.

Perfil da casa:
- Quantas pessoas moram: ${perfil.quantas_pessoas}
- Frequência que cozinha: ${perfil.frequencia_cozinha}
- Rotina na semana: ${perfil.rotina_semana}

Item: "${nomeItem}"

Com base nesse perfil, estime quantos dias esse item costuma durar até precisar ser reposto.
Responda APENAS com um número inteiro representando os dias. Não escreva mais nada, só o número.
`.trim();

    const respostaOpenAI = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!respostaOpenAI.ok) {
      const erroTexto = await respostaOpenAI.text();
      console.error("Erro da OpenAI:", erroTexto);
      return NextResponse.json(
        { error: "Erro ao consultar a IA. Tente novamente." },
        { status: 502 }
      );
    }

    const dadosOpenAI = await respostaOpenAI.json();
    const textoResposta = dadosOpenAI.choices?.[0]?.message?.content?.trim();
    const diasEstimados = parseInt(textoResposta, 10);

    if (isNaN(diasEstimados)) {
      return NextResponse.json(
        { error: "A IA não retornou um número válido." },
        { status: 502 }
      );
    }

    return NextResponse.json({ diasEstimados });
  } catch (erro) {
    console.error("Erro inesperado:", erro);
    return NextResponse.json(
      { error: "Erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
