using System.ComponentModel.DataAnnotations;

namespace ColorDash.Api.Models.Requests;

public record GuessRequest([Required] int ColorIndex);