using Inventory.Api.Models;

namespace Inventory.Api.Repositories;

public class ProductRepository : IProductRepository
{
    private static readonly List<Product> Products =
    [
        new()
        {
            Id = 1,
            Name = "Laptop",
            Price = 65000,
            Stock = 20
        },
        new()
        {
            Id = 2,
            Name = "Phone",
            Price = 30000,
            Stock = 40
        },
        new()
        {
            Id = 3,
            Name = "Keyboard",
            Price = 1500,
            Stock = 50
        },
        new()
        {
            Id = 4,
            Name = "Mouse",
            Price = 700,
            Stock = 100
        },
        new()
        {
            Id = 5,
            Name = "Monitor",
            Price = 18000,
            Stock = 15
        }
    ];

    public IEnumerable<Product> GetAll()
    {
        return Products;
    }

    public Product? GetById(int id)
    {
        return Products.FirstOrDefault(x => x.Id == id);
    }

    public Product Add(Product product)
    {
        product.Id = Products.Max(x => x.Id) + 1;

        Products.Add(product);

        return product;
    }

    public bool Update(Product product)
    {
        var existing = GetById(product.Id);

        if (existing == null)
            return false;

        existing.Name = product.Name;
        existing.Price = product.Price;
        existing.Stock = product.Stock;

        return true;
    }
    public bool Delete(int id)
{
    var product = Products.FirstOrDefault(x => x.Id == id);

    if (product == null)
        return false;

    Products.Remove(product);

    return true;
}
}