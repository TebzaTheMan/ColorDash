using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColorDash.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "game_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    device_id = table.Column<Guid>(type: "uuid", nullable: false),
                    mode = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    correct_index = table.Column<int>(type: "integer", nullable: false),
                    current_colors = table.Column<string>(type: "jsonb", nullable: false),
                    score_points = table.Column<int>(type: "integer", nullable: false),
                    score_total = table.Column<int>(type: "integer", nullable: false),
                    correct_count = table.Column<int>(type: "integer", nullable: false),
                    tries_left = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ended_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StartIdempotencyKey = table.Column<string>(type: "text", nullable: true),
                    LastGuessIdempotencyKey = table.Column<string>(type: "text", nullable: true),
                    LastGuessResponseJson = table.Column<string>(type: "text", nullable: true),
                    EndResponseJson = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_sessions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "highscores",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    device_id = table.Column<Guid>(type: "uuid", nullable: false),
                    mode = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    points = table.Column<int>(type: "integer", nullable: false),
                    total = table.Column<int>(type: "integer", nullable: false),
                    achieved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    session_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_highscores", x => x.id);
                    table.ForeignKey(
                        name: "FK_highscores_game_sessions_session_id",
                        column: x => x.session_id,
                        principalTable: "game_sessions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_device_id",
                table: "game_sessions",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_device_id_start_key",
                table: "game_sessions",
                columns: new[] { "device_id", "StartIdempotencyKey" });

            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_expires_at",
                table: "game_sessions",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_highscores_device_id_mode",
                table: "highscores",
                columns: new[] { "device_id", "mode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_highscores_session_id",
                table: "highscores",
                column: "session_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "highscores");

            migrationBuilder.DropTable(
                name: "game_sessions");
        }
    }
}
