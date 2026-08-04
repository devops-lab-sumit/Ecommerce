using Order.Api.HttpClients;
using Order.Api.Repositories;
using Order.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IOrderRepository, OrderRepository>();

builder.Services.AddSingleton<IOrderService, OrderService>();
builder.Services.AddHttpClient<CustomerApiClient>(client =>
{
    client.BaseAddress =
        new Uri("http://localhost:5001");
});
builder.Services.AddHttpClient<InventoryApiClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5002");
});

builder.Services.AddHttpClient<PaymentApiClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5003");
});

builder.Services.AddHttpClient<NotificationApiClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:5004");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();