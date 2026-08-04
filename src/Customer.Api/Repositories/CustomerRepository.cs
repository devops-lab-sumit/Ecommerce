using CustomerModel = Customer.Api.Models.Customer;

namespace Customer.Api.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private static readonly List<CustomerModel> Customers =
    [
        new()
        {
            Id = 1,
            Name = "John",
            Email = "john@test.com"
        },
        new()
        {
            Id = 2,
            Name = "Alice",
            Email = "alice@test.com"
        },
        new()
        {
            Id = 3,
            Name = "David",
            Email = "david@test.com"
        }
    ];

    public IEnumerable<CustomerModel> GetAll()
    {
        return Customers;
    }

    public CustomerModel? Get(int id)
    {
        return Customers.FirstOrDefault(x => x.Id == id);
    }

    public CustomerModel Add(CustomerModel customer)
    {
        customer.Id = Customers.Max(x => x.Id) + 1;

        Customers.Add(customer);

        return customer;
    }

    public bool Delete(int id)
    {
        var customer = Get(id);

        if (customer == null)
            return false;

        Customers.Remove(customer);

        return true;
    }
}