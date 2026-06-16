import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Wrench, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authApi } from "@/api/auth";
import { cn } from "@/lib/utils";

type TipoUsuario = "cliente" | "oficina";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<TipoUsuario>("cliente");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "", email: "", senha: "",
    cpf: "", telefone: "",
    cnpj: "", endereco: "", horario_funcionamento: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload =
        tipo === "cliente"
          ? { nome: form.nome, email: form.email, senha: form.senha, tipo_usuario: tipo, cpf: form.cpf, telefone: form.telefone }
          : { nome: form.nome, email: form.email, senha: form.senha, tipo_usuario: tipo, cnpj: form.cnpj, endereco: form.endereco, horario_funcionamento: form.horario_funcionamento };

      await authApi.register(payload);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Erro ao criar conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-cyan-600/6 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Link to="/"><Logo size="lg" /></Link>
        </div>

        <Card className="border-slate-800 shadow-2xl shadow-black/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Escolha seu perfil e comece agora</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Tipo selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["cliente", "oficina"] as TipoUsuario[]).map((t) => {
                const Icon = t === "cliente" ? Car : Wrench;
                const active = tipo === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                      active
                        ? "border-blue-500/60 bg-blue-500/10 text-blue-400"
                        : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-semibold capitalize">{t}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome completo</Label>
                  <Input placeholder="João Silva" value={form.nome} onChange={set("nome")} required />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Senha</Label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={form.senha}
                      onChange={set("senha")}
                      required
                      minLength={6}
                      className="pr-11"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {tipo === "cliente" ? (
                  <>
                    <div className="space-y-1.5">
                      <Label>CPF</Label>
                      <Input placeholder="000.000.000-00" value={form.cpf} onChange={set("cpf")} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Telefone <span className="text-slate-500">(opcional)</span></Label>
                      <Input placeholder="(11) 99999-9999" value={form.telefone} onChange={set("telefone")} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <Label>CNPJ</Label>
                      <Input placeholder="00.000.000/0000-00" value={form.cnpj} onChange={set("cnpj")} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Endereço</Label>
                      <Input placeholder="Rua das Oficinas, 100" value={form.endereco} onChange={set("endereco")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Horário de Funcionamento</Label>
                      <Input placeholder="08:00 - 18:00" value={form.horario_funcionamento} onChange={set("horario_funcionamento")} />
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" disabled={loading}>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
