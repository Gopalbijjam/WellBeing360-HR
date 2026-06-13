using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IEapManagementService
    {
        Task<IEnumerable<EAPService>> GetServicesAsync();
        Task<EAPService> CreateServiceAsync(EAPService service);
        Task<EAPSession> BookSessionAsync(int employeeId, EAPBookingRequest request);
        Task<IEnumerable<EAPSession>> GetEmployeeSessionsAsync(int employeeId);
        Task<IEnumerable<EAPSession>> GetAllSessionsAsync();
        Task<EAPSession?> UpdateSessionStatusAsync(int sessionId, string status, string counsellorRef);
    }
}
