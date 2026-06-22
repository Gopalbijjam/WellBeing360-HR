using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IWellnessRepository
    {
        Task<IEnumerable<WellnessProgram>> GetProgramsAsync();
        Task<WellnessProgram?> GetProgramByIdAsync(int id);
        Task AddProgramAsync(WellnessProgram program);

        Task<IEnumerable<WellnessChallenge>> GetChallengesByProgramAsync(int programId);
        Task AddChallengeAsync(WellnessChallenge challenge);
        Task<WellnessChallenge?> GetChallengeByIdAsync(int id);
        void UpdateChallenge(WellnessChallenge challenge);

        Task AddActivityLogAsync(ActivityLog log);
        Task<IEnumerable<ActivityLog>> GetLogsByEmployeeAsync(int employeeId);
        Task<IEnumerable<ActivityLog>> GetAllLogsAsync();
        Task<IEnumerable<WellnessChallenge>> GetAllChallengesAsync();
    }
}
