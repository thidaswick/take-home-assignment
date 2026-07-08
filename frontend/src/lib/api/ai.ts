import { api } from "./client";
import type { AiSuggestion } from "./types";

interface ApiAiSuggestion {
  improvedDescription: string;
  suggestedPriority: "low" | "medium" | "high";
  estimatedHours: number;
  subtasks: string[];
  acceptanceCriteria: string[];
  developerNotes: string;
}

function mapAiSuggestion(dto: ApiAiSuggestion): AiSuggestion {
  return {
    improvedDescription: dto.improvedDescription,
    suggestedPriority: dto.suggestedPriority,
    estimatedHours: dto.estimatedHours,
    subtasks: dto.subtasks,
    acceptanceCriteria: dto.acceptanceCriteria,
    developerNotes: dto.developerNotes,
  };
}

export async function generateAiSuggestions(input: {
  title: string;
  description: string;
}): Promise<AiSuggestion> {
  const { data } = await api.post<ApiAiSuggestion>("/ai/suggestions", {
    title: input.title,
    description: input.description,
  });
  return mapAiSuggestion(data);
}
