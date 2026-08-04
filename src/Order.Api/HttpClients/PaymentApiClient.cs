using System.Net.Http.Json;
using Shared.Contracts.Payment;

namespace Order.Api.HttpClients;

public class PaymentApiClient
{
    private readonly HttpClient _httpClient;

    public PaymentApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> ProcessPaymentAsync(int orderId, decimal amount)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/payments",
            new PaymentRequest
            {
                OrderId = orderId,
                Amount = amount
            });

        return response.IsSuccessStatusCode;
    }
}