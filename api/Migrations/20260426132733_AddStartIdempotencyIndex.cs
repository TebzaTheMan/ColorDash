using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColorDash.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStartIdempotencyIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_device_id_start_key",
                table: "game_sessions",
                columns: new[] { "device_id", "StartIdempotencyKey" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_game_sessions_device_id_start_key",
                table: "game_sessions");
        }
    }
}
