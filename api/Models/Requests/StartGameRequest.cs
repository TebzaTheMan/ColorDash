using ColorDash.Api.Domain;
using System.ComponentModel.DataAnnotations;

namespace ColorDash.Api.Models.Requests;

public record StartGameRequest(
    [Required]
    GameMode Mode);