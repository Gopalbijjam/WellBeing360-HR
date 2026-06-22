using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IEapRepository
    {
        Task<IEnumerable<EAPService>> GetServicesAsync();
        Task<EAPService?> GetServiceByIdAsync(int id);
        Task AddServiceAsync(EAPService service);

        Task<IEnumerable<EAPSession>> GetSessionsByEmployeeAsync(int employeeId);
        Task<IEnumerable<EAPSession>> GetAllSessionsAsync();
        Task AddSessionAsync(EAPSession session);
        Task<EAPSession?> GetSessionByIdAsync(int id);
        void UpdateSession(EAPSession session);
    }
}
