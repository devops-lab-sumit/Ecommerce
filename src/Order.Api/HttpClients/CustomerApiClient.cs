using System.Net.Http.Json;
using Shared.Contracts.Customer;

namespace Order.Api.HttpClients;

public class CustomerApiClient
{
    private readonly HttpClient _httpClient;

    public CustomerApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<CustomerDto?> GetCustomerAsync(int customerId)
    {
        return await _httpClient.GetFromJsonAsync<CustomerDto>(
            $"/api/customers/{customerId}");
    }
}