using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class WellnessRepository : IWellnessRepository
    {
        private readonly WellBeingContext _context;

        public WellnessRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WellnessProgram>> GetProgramsAsync()
        {
            return await _context.WellnessPrograms.ToListAsync();
        }

        public async Task AddProgramAsync(WellnessProgram program)
        {
            await _context.WellnessPrograms.AddAsync(program);
        }

        public async Task<WellnessProgram?> GetProgramByIdAsync(int id)
        {
            return await _context.WellnessPrograms.FindAsync(id);
        }

        public async Task<IEnumerable<WellnessChallenge>> GetChallengesByProgramAsync(int programId)
        {
            return await _context.WellnessChallenges.Where(c => c.ProgramID == programId).ToListAsync();
        }

        public async Task AddChallengeAsync(WellnessChallenge challenge)
        {
            await _context.WellnessChallenges.AddAsync(challenge);
        }

        public async Task<WellnessChallenge?> GetChallengeByIdAsync(int id)
        {
            return await _context.WellnessChallenges.FindAsync(id);
        }

        public void UpdateChallenge(WellnessChallenge challenge)
        {
            _context.WellnessChallenges.Update(challenge);
        }

        public async Task AddActivityLogAsync(ActivityLog log)
        {
            await _context.ActivityLogs.AddAsync(log);
        }

        public async Task<IEnumerable<ActivityLog>> GetLogsByEmployeeAsync(int employeeId)
        {
            return await _context.ActivityLogs.Where(l => l.EmployeeID == employeeId).ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetAllLogsAsync()
        {
            return await _context.ActivityLogs.ToListAsync();
        }

        public async Task<IEnumerable<WellnessChallenge>> GetAllChallengesAsync()
        {
            return await _context.WellnessChallenges.ToListAsync();
        }
    }
}
