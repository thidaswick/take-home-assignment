namespace TaskTracker.Application.Common.Settings;

/// <summary>
/// Google Gemini API configuration.
/// </summary>
public class GeminiSettings
{
    /// <summary>
    /// Configuration section name.
    /// </summary>
    public const string SectionName = "Gemini";

    /// <summary>
    /// Gets or sets the Gemini API key from Google AI Studio.
    /// </summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the model identifier (e.g. gemini-2.0-flash).
    /// </summary>
    public string Model { get; set; } = "gemini-2.5-flash";
}
