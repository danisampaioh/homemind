import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🏠</div>
          <CardTitle className="text-2xl">HomeMind</CardTitle>
          <CardDescription>
            O copiloto silencioso da sua casa
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" size="lg">
            Continuar com Google
          </Button>
          <p className="text-center text-xs text-zinc-500">
            Gerencie sua casa sem esforço
          </p>
        </CardContent>
      </Card>
    </main>
  );
}