using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface INotificationManagementService
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
        Task<bool> MarkAsReadAsync(int notificationId);
        Task<Notification> CreateNotificationAsync(int userId, string message, string category);
    }
}
