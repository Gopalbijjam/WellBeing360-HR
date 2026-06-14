using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IWellnessManagementService
    {
        Task<IEnumerable<WellnessProgram>> GetProgramsAsync();
        Task<WellnessProgram?> GetProgramByIdAsync(int id);
        Task<WellnessProgram> CreateProgramAsync(WellnessProgram program);
        Task<IEnumerable<WellnessChallenge>> GetChallengesAsync(int programId);
        Task<WellnessChallenge> CreateChallengeAsync(WellnessChallenge challenge);
        Task<ActivityLog> LogActivityAsync(int employeeId, ActivityLogRequest request);
        Task<IEnumerable<ActivityLog>> GetEmployeeLogsAsync(int employeeId);
        Task<IEnumerable<CoordinatorActivityLogResponse>> GetCoordinatorActivityLogsAsync();
        Task<IEnumerable<LeaderboardEntryDTO>> GetLeaderboardAsync(int programId);
    }
}
