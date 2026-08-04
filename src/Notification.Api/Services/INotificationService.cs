using SharedContracts = Shared.Contracts.Notification;

namespace Notification.Api.Services;

public interface INotificationService
{
    Task<SharedContracts.NotificationResponse> SendAsync(SharedContracts.NotificationRequest request);
}