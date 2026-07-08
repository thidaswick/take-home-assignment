import { useRef } from "react";
import { FileImage, FileText, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface TaskAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  kind: "image" | "document";
  previewUrl?: string;
}

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB each

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,application/pdf,.doc,.docx,.txt,.md,.csv";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

export function createAttachment(file: File): TaskAttachment {
  const kind = isImage(file) ? "image" : "document";
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    kind,
    previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined,
  };
}

export function revokeAttachments(attachments: TaskAttachment[]) {
  for (const item of attachments) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  }
}

/** Appends a readable attachment list into the task description text. */
export function withAttachmentNotes(description: string, attachments: TaskAttachment[]): string {
  if (attachments.length === 0) return description;
  const lines = attachments.map(
    (a) => `- ${a.name} (${a.kind}, ${formatBytes(a.size)})`,
  );
  const block = ["", "---", "Attachments:", ...lines].join("\n");
  return `${description.trimEnd()}${block}`;
}

/** Extra context for the AI endpoint when files are attached. */
export function attachmentAiContext(attachments: TaskAttachment[]): string {
  if (attachments.length === 0) return "";
  const names = attachments.map((a) => `${a.name} [${a.kind}]`).join(", ");
  return `\n\nUser attached files for context: ${names}. Consider these attachments when writing the description and subtasks.`;
}

interface FileAttachmentsProps {
  attachments: TaskAttachment[];
  onChange: (next: TaskAttachment[]) => void;
  label?: string;
  hint?: string;
}

export function FileAttachments({
  attachments,
  onChange,
  label = "Attachments",
  hint = "Photos or documents (PNG, JPG, PDF, DOC, TXT) · max 5 files · 5 MB each",
}: FileAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const incoming = Array.from(fileList);
    const next = [...attachments];

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        toast.error(`You can attach up to ${MAX_FILES} files`);
        break;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is larger than 5 MB`);
        continue;
      }
      next.push(createAttachment(file));
    }

    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(id: string) {
    const target = attachments.find((a) => a.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(attachments.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip className="mr-1 h-3.5 w-3.5" />
          Add files
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept={ACCEPT}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>

      {attachments.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {attachments.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border bg-muted/30 p-2.5"
            >
              {item.kind === "image" && item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  {item.kind === "image" ? (
                    <FileImage className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {item.kind} · {formatBytes(item.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeAt(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
