using System.Net.Http.Json;
using Shared.Contracts.Inventory;

namespace Order.Api.HttpClients;

public class InventoryApiClient
{
    private readonly HttpClient _httpClient;

    public InventoryApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    // public async Task<bool> ReserveStockAsync(int productId, int quantity)
    // {
    //     var response = await _httpClient.PostAsJsonAsync(
    //         "/api/products/reserve",
    //         new ReserveStockRequest
    //         {
    //             ProductId = productId,
    //             Quantity = quantity
    //         });

    //     return response.IsSuccessStatusCode;
    // }

    public async Task<ReserveStockResponse?> ReserveStockAsync(
    int productId,
    int quantity)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/products/reserve",
            new ReserveStockRequest
            {
                ProductId = productId,
                Quantity = quantity
            });

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<ReserveStockResponse>();
    }
}