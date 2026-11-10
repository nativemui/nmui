// Program.cs — FRAGMENT (ASP.NET Core minimal hosting).
// MapFallbackToFile is the framework's built-in SPA rule.
// Register it AFTER your API endpoints — order matters.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// app.MapControllers();  // …your API, first…

app.MapFallbackToFile("index.html");
app.Run();
