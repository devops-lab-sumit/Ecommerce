using System.Net.Http.Json;
using Order.Api.Contracts;

namespace Order.Api.HttpClients;

public class NotificationApiClient
{
    private readonly HttpClient _httpClient;

    public NotificationApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> SendNotificationAsync(
        string customer,
        string email)
    {
        var response =
            await _httpClient.PostAsJsonAsync(
                "/api/notifications",
                new NotificationRequest
                {
                    CustomerName=customer,
                    Email=email,
                    Subject="Order Created",
                    Message="Thank you for shopping."
                });

        return response.IsSuccessStatusCode;
    }
}