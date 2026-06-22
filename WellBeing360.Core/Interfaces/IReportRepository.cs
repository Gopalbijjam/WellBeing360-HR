using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IReportRepository
    {
        Task AddReportAsync(BenefitsReport report);
        Task<IEnumerable<BenefitsReport>> GetReportsAsync();
        Task<IEnumerable<AuditLog>> GetAuditLogsAsync();
    }
}
