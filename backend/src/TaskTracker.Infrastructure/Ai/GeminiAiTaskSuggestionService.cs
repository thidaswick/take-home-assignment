using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TaskTracker.Application.Ai;
using TaskTracker.Application.Ai.Dtos;
using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Settings;

namespace TaskTracker.Infrastructure.Ai;

/// <summary>
/// Generates task suggestions using the Google Gemini API.
/// </summary>
public class GeminiAiTaskSuggestionService : IAiTaskSuggestionService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly HttpClient _httpClient;
    private readonly GeminiSettings _settings;
    private readonly ILogger<GeminiAiTaskSuggestionService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GeminiAiTaskSuggestionService"/> class.
    /// </summary>
    public GeminiAiTaskSuggestionService(
        HttpClient httpClient,
        IOptions<GeminiSettings> settings,
        ILogger<GeminiAiTaskSuggestionService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<AiSuggestionResponse> GenerateSuggestionsAsync(
        AiSuggestionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new AiServiceException(
                "Gemini API key is not configured. Add Gemini:ApiKey to appsettings.Development.json or dotnet user-secrets.");
        }

        var prompt = BuildPrompt(request.Title.Trim(), request.Description.Trim());
        var modelsToTry = BuildModelCandidates(_settings.Model);
        var payload = BuildRequestBody(prompt);
        string? lastErrorBody = null;
        System.Net.HttpStatusCode lastStatus = 0;

        foreach (var model in modelsToTry)
        {
            using var httpRequest = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent");
            httpRequest.Headers.Add("x-goog-api-key", _settings.ApiKey);
            httpRequest.Content = JsonContent.Create(payload, options: JsonOptions);

            using var response = await _httpClient.SendAsync(httpRequest, cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                return await ParseSuccessResponseAsync(response, cancellationToken);
            }

            lastStatus = response.StatusCode;
            lastErrorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Gemini model {Model} returned {StatusCode}: {Body}", model, response.StatusCode, lastErrorBody);

            if (response.StatusCode is not System.Net.HttpStatusCode.NotFound)
            {
                break;
            }
        }

        _logger.LogError("Gemini API failed with {StatusCode}: {Body}", lastStatus, lastErrorBody);
        throw new AiServiceException(MapGeminiError(lastStatus, lastErrorBody ?? string.Empty));
    }

    private static IReadOnlyList<string> BuildModelCandidates(string? configuredModel)
    {
        var models = new List<string>();
        if (!string.IsNullOrWhiteSpace(configuredModel))
        {
            models.Add(configuredModel.Trim());
        }

        foreach (var fallback in new[] { "gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite" })
        {
            if (!models.Contains(fallback, StringComparer.OrdinalIgnoreCase))
            {
                models.Add(fallback);
            }
        }

        return models;
    }

    private async Task<AiSuggestionResponse> ParseSuccessResponseAsync(
        HttpResponseMessage response,
        CancellationToken cancellationToken)
    {
        var geminiResponse = await response.Content.ReadFromJsonAsync<GeminiGenerateContentResponse>(JsonOptions, cancellationToken)
            ?? throw new AiServiceException("Gemini returned an empty response.");

        var text = geminiResponse.Candidates?
            .SelectMany(candidate => candidate.Content?.Parts ?? [])
            .Select(part => part.Text)
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));

        if (string.IsNullOrWhiteSpace(text))
        {
            throw new AiServiceException("Gemini returned no suggestion content.");
        }

        return MapSuggestion(ParseSuggestionJson(text));
    }

    private static string MapGeminiError(System.Net.HttpStatusCode statusCode, string errorBody)
    {
        if (statusCode == System.Net.HttpStatusCode.TooManyRequests)
        {
            return "Gemini rate limit reached. Wait a minute and try again, or create a new API key at aistudio.google.com/apikey.";
        }

        if (statusCode is System.Net.HttpStatusCode.Unauthorized or System.Net.HttpStatusCode.Forbidden)
        {
            return "Invalid Gemini API key. Copy your key from aistudio.google.com/apikey.";
        }

        if (errorBody.Contains("API_KEY_INVALID", StringComparison.OrdinalIgnoreCase))
        {
            return "Invalid Gemini API key. Copy your key from aistudio.google.com/apikey.";
        }

        if (errorBody.Contains("is not found", StringComparison.OrdinalIgnoreCase) ||
            errorBody.Contains("NOT_FOUND", StringComparison.OrdinalIgnoreCase))
        {
            return "Gemini model is unavailable. Restart the backend after updating to the latest code.";
        }

        if (errorBody.Contains("quota", StringComparison.OrdinalIgnoreCase) ||
            errorBody.Contains("RESOURCE_EXHAUSTED", StringComparison.OrdinalIgnoreCase))
        {
            return "Gemini free quota exceeded. Wait a few minutes and try again.";
        }

        return "Gemini could not generate suggestions. Check your API key at aistudio.google.com/apikey.";
    }

    private static string BuildPrompt(string title, string description)
    {
        var context = string.IsNullOrWhiteSpace(description)
            ? "No additional description was provided."
            : description;

        return
            "You are a helpful task-planning assistant for a productivity app.\n\n" +
            "The user wants help turning a rough task idea into a structured plan. " +
            "Tailor every field to the user's actual topic. Do not assume software development " +
            "unless the task is clearly technical.\n\n" +
            $"Task title: {title}\n" +
            $"Additional context: {context}\n\n" +
            "Return JSON only with this exact shape:\n" +
            "{\n" +
            "  \"improvedDescription\": \"string\",\n" +
            "  \"suggestedPriority\": \"low\" | \"medium\" | \"high\",\n" +
            "  \"estimatedHours\": number,\n" +
            "  \"subtasks\": [\"string\", ...],\n" +
            "  \"acceptanceCriteria\": [\"string\", ...],\n" +
            "  \"developerNotes\": \"string\"\n" +
            "}\n\n" +
            "Rules:\n" +
            "- improvedDescription: 2-4 sentences, practical and specific to the task\n" +
            "- suggestedPriority: choose low, medium, or high based on urgency and impact\n" +
            "- estimatedHours: realistic integer between 1 and 80\n" +
            "- subtasks: 4 to 6 actionable steps\n" +
            "- acceptanceCriteria: 3 to 5 measurable completion checks\n" +
            "- developerNotes: short practical advice; use plain language for non-technical tasks";
    }

    private static object BuildRequestBody(string prompt) => new
    {
        contents = new[]
        {
            new
            {
                role = "user",
                parts = new[] { new { text = prompt } },
            },
        },
        generationConfig = new
        {
            temperature = 0.7,
            responseMimeType = "application/json",
        },
    };

    private static GeminiSuggestionPayload ParseSuggestionJson(string text)
    {
        var json = ExtractJson(text);

        try
        {
            return JsonSerializer.Deserialize<GeminiSuggestionPayload>(json, JsonOptions)
                ?? throw new AiServiceException("Gemini returned invalid suggestion JSON.");
        }
        catch (JsonException)
        {
            throw new AiServiceException("Gemini returned malformed JSON.");
        }
    }

    private static string ExtractJson(string text)
    {
        var trimmed = text.Trim();

        var fenced = Regex.Match(trimmed, """```(?:json)?\s*(.*?)```""", RegexOptions.Singleline | RegexOptions.IgnoreCase);
        if (fenced.Success)
        {
            return fenced.Groups[1].Value.Trim();
        }

        var start = trimmed.IndexOf('{');
        var end = trimmed.LastIndexOf('}');
        if (start >= 0 && end > start)
        {
            return trimmed[start..(end + 1)];
        }

        return trimmed;
    }

    private static AiSuggestionResponse MapSuggestion(GeminiSuggestionPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.ImprovedDescription))
        {
            throw new AiServiceException("Gemini returned an incomplete suggestion.");
        }

        return new AiSuggestionResponse
        {
            ImprovedDescription = payload.ImprovedDescription.Trim(),
            SuggestedPriority = NormalizePriority(payload.SuggestedPriority),
            EstimatedHours = Math.Clamp(payload.EstimatedHours, 1, 80),
            Subtasks = NormalizeList(payload.Subtasks, 4),
            AcceptanceCriteria = NormalizeList(payload.AcceptanceCriteria, 3),
            DeveloperNotes = string.IsNullOrWhiteSpace(payload.DeveloperNotes)
                ? "Review progress after each subtask and adjust the plan if needed."
                : payload.DeveloperNotes.Trim(),
        };
    }

    private static string NormalizePriority(string? priority) =>
        priority?.Trim().ToLowerInvariant() switch
        {
            "low" => "low",
            "high" => "high",
            _ => "medium",
        };

    private static IReadOnlyList<string> NormalizeList(IReadOnlyList<string>? values, int minimumCount)
    {
        var items = values?
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList() ?? [];

        if (items.Count >= minimumCount)
        {
            return items;
        }

        throw new AiServiceException("Gemini returned incomplete subtasks or acceptance criteria.");
    }

    private sealed class GeminiGenerateContentResponse
    {
        public List<GeminiCandidate>? Candidates { get; set; }
    }

    private sealed class GeminiCandidate
    {
        public GeminiContent? Content { get; set; }
    }

    private sealed class GeminiContent
    {
        public List<GeminiPart>? Parts { get; set; }
    }

    private sealed class GeminiPart
    {
        public string? Text { get; set; }
    }

    private sealed class GeminiSuggestionPayload
    {
        public string ImprovedDescription { get; set; } = string.Empty;
        public string? SuggestedPriority { get; set; }
        public int EstimatedHours { get; set; }
        public List<string>? Subtasks { get; set; }
        public List<string>? AcceptanceCriteria { get; set; }
        public string? DeveloperNotes { get; set; }
    }
}
