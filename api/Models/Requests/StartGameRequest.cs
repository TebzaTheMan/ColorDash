using System.ComponentModel.DataAnnotations;

namespace ColorDash.Api.Models.Requests;

public record StartGameRequest(
    [Required]
    [RegularExpression("^(rgb|hsl)$", ErrorMessage = "Mode must be 'rgb' or 'hsl'.")]
    string Mode);