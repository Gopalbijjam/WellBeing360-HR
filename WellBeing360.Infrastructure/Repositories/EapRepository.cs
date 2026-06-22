using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class EapRepository : IEapRepository
    {
        private readonly WellBeingContext _context;

        public EapRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EAPService>> GetServicesAsync()
        {
            return await _context.EAPServices.Where(s => s.Status == "Active").ToListAsync();
        }

        public async Task<EAPService?> GetServiceByIdAsync(int id)
        {
            return await _context.EAPServices.FindAsync(id);
        }

        public async Task AddServiceAsync(EAPService service)
        {
            await _context.EAPServices.AddAsync(service);
        }

        public async Task<IEnumerable<EAPSession>> GetSessionsByEmployeeAsync(int employeeId)
        {
            return await _context.EAPSessions.Where(s => s.EmployeeID == employeeId).ToListAsync();
        }

        public async Task<IEnumerable<EAPSession>> GetAllSessionsAsync()
        {
            return await _context.EAPSessions.ToListAsync();
        }

        public async Task AddSessionAsync(EAPSession session)
        {
            await _context.EAPSessions.AddAsync(session);
        }

        public async Task<EAPSession?> GetSessionByIdAsync(int id)
        {
            return await _context.EAPSessions.FindAsync(id);
        }

        public void UpdateSession(EAPSession session)
        {
            _context.EAPSessions.Update(session);
        }
    }
}
