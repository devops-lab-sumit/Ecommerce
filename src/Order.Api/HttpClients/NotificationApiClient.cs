using System.Net.Http.Json;
using Shared.Contracts.Notification;

namespace Order.Api.HttpClients;

public class NotificationApiClient
{
    private readonly HttpClient _httpClient;

    public NotificationApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<NotificationResponse?> SendNotificationAsync(
        string customerName,
        string email)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/notifications",
            new NotificationRequest
            {
                CustomerName = customerName,
                Email = email,
                Subject = "Order Created",
                Message = "Your order has been placed successfully."
            });

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<NotificationResponse>();
    }
}