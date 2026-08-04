namespace Order.Api.HttpClients;

public class NotificationApiClient
{
    private readonly HttpClient _httpClient;

    public NotificationApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
}