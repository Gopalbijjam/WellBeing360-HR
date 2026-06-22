using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly WellBeingContext _context;

        public ReportRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task AddReportAsync(BenefitsReport report)
        {
            await _context.BenefitsReports.AddAsync(report);
        }

        public async Task<IEnumerable<BenefitsReport>> GetReportsAsync()
        {
            return await _context.BenefitsReports.ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync()
        {
            return await _context.AuditLogs.ToListAsync();
        }
    }
}
