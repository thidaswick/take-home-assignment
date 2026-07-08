import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ClipboardList, Timer, ListChecks, CheckCircle2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/app/PageTransition";
import { generateAiSuggestions } from "@/lib/api/ai";
import type { AiSuggestion } from "@/lib/api/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/ai-assistant")({ component: AiAssistantPage });

function AiAssistantPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSuggestion | null>(null);

  async function run() {
    if (!title.trim()) { toast.error("Add a title"); return; }
    setLoading(true);
    try { setResult(await generateAiSuggestions({ title, description })); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <div className="flex items-center gap-2">
            <span className="inline-grid h-8 w-8 place-items-center rounded-lg gradient-brand text-white"><Sparkles className="h-4 w-4" /></span>
            <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Turn a rough idea into a structured, shippable task.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="space-y-1.5">
              <Label htmlFor="ai-title">Task title</Label>
              <Input id="ai-title" placeholder="e.g. Improve API rate limiting" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ai-desc">Description</Label>
              <Textarea id="ai-desc" rows={6} placeholder="Add any context you have..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button onClick={run} disabled={loading} className="w-full gradient-brand text-white hover:opacity-95">
              <Sparkles className="mr-1 h-4 w-4" /> {loading ? "Generating..." : "Generate suggestions"}
            </Button>
          </div>

          <div className="min-h-[420px] rounded-2xl border bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-sm">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full place-items-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <p className="text-sm text-muted-foreground">The AI is thinking...</p>
                  </div>
                </motion.div>
              )}
              {!loading && !result && (
                <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center py-20 text-center">
                  <div>
                    <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-6 w-6" /></span>
                    <h3 className="mt-4 font-semibold">Ready when you are</h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">Fill the form on the left and press <em>Generate suggestions</em>.</p>
                  </div>
                </motion.div>
              )}
              {!loading && result && (
                <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-4">
                  <Section icon={ClipboardList} title="Improved description">
                    <p className="whitespace-pre-line text-sm text-muted-foreground">{result.improvedDescription}</p>
                  </Section>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Section icon={Timer} title="Priority & estimate">
                      <div className="flex items-center gap-3">
                        <Badge className="capitalize">{result.suggestedPriority}</Badge>
                        <span className="text-sm">{result.estimatedHours}h estimated</span>
                      </div>
                    </Section>
                    <Section icon={ListChecks} title="Subtasks">
                      <ul className="space-y-1.5 text-sm">
                        {result.subtasks.map((s) => <li key={s} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{s}</li>)}
                      </ul>
                    </Section>
                  </div>
                  <Section icon={CheckCircle2} title="Acceptance criteria">
                    <ul className="space-y-1.5 text-sm">
                      {result.acceptanceCriteria.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{c}</li>)}
                    </ul>
                  </Section>
                  <Section icon={StickyNote} title="Notes">
                    <p className="text-sm text-muted-foreground">{result.developerNotes}</p>
                  </Section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </div>
      {children}
    </div>
  );
}
