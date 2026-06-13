using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IReportManagementService
    {
        Task<BenefitsReport> GenerateReportAsync(string scope);
        Task<IEnumerable<BenefitsReport>> GetReportsAsync();
        Task<IEnumerable<AuditLog>> GetAuditLogsAsync();
    }
}
