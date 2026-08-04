using Inventory.Api.Repositories;
using Inventory.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// builder.Services.AddOpenApi(); // <-- Native .NET 9 OpenAPI service
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IProductRepository, ProductRepository>();
builder.Services.AddSingleton<IInventoryService, InventoryService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi(); // <-- Native endpoint (serves OpenAPI spec at /openapi/v1.json)
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();