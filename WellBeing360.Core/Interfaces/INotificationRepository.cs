using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
        Task<Notification?> GetByIdAsync(int id);
        Task AddAsync(Notification notification);
        void Update(Notification notification);
    }
}
