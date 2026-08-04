namespace Order.Api.HttpClients;

public class PaymentApiClient
{
    private readonly HttpClient _httpClient;

    public PaymentApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
}