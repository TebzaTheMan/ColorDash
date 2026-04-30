using ColorDash.Api.Data;
using ColorDash.Api.Data.Repositories;
using ColorDash.Api.Domain.Exceptions;
using ColorDash.Api.Endpoints;
using ColorDash.Api.Models;
using ColorDash.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((doc, ctx, ct) =>
    {
        doc.Info = new()
        {
            Title = "ColorDash API",
            Version = "v1",
            Description = "REST API for the ColorDash color-matching game."
        };
        return Task.CompletedTask;
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));

builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IHighscoreRepository, HighscoreRepository>();
builder.Services.AddScoped<IColorService, ColorService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IHighscoreService, HighscoreService>();
builder.Services.AddValidation();
builder.Services.Configure<GameSettings>(builder.Configuration.GetSection("GameSettings"));

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower));
});

// Add CORS
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowColorDash", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!string.IsNullOrEmpty(db.Database.GetConnectionString()))
        db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowColorDash");

app.UseExceptionHandler(err => err.Run(async ctx =>
{
    var ex = ctx.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;

    var (status, message) = ex switch
    {
        BadHttpRequestException => (StatusCodes.Status400BadRequest, ex.Message),
        SessionNotFoundException => (StatusCodes.Status404NotFound, ex.Message),
        SessionOwnershipException => (StatusCodes.Status403Forbidden, ex.Message),
        SessionNotActiveException or SessionExpiredException => (StatusCodes.Status410Gone, ex.Message),
        _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
    };

    ctx.Response.StatusCode = status;
    await ctx.Response.WriteAsJsonAsync(new { error = message });
}));

app.MapGameEndpoints();
app.MapHighscoreEndpoints();

app.Run();