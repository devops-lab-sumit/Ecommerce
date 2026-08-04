using Notification.Api.Models;
using Notification.Api.Repositories;

namespace Notification.Api.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        INotificationRepository repository,
        ILogger<NotificationService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<NotificationResponse> SendAsync(NotificationRequest request)
    {
        _logger.LogInformation("Sending email to {Email}", request.Email);

        await Task.Delay(1000);

        var notification = new NotificationMessage
        {
            CustomerName = request.CustomerName,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            SentAt = DateTime.UtcNow
        };

        _repository.Add(notification);

        _logger.LogInformation("Notification sent successfully.");

        return new NotificationResponse
        {
            Success = true,
            Status = "Notification Sent"
        };
    }
}