using CustomerModel = Customer.Api.Models.Customer;

namespace Customer.Api.Repositories;

public interface ICustomerRepository
{
    IEnumerable<CustomerModel> GetAll();

    CustomerModel? Get(int id);

    CustomerModel Add(CustomerModel customer);

    bool Delete(int id);
}