using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class WellnessManagementService : IWellnessManagementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public WellnessManagementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<WellnessProgram>> GetProgramsAsync()
        {
            return await _unitOfWork.WellnessPrograms.GetAllAsync();
        }

        public async Task<WellnessProgram?> GetProgramByIdAsync(int id)
        {
            return await _unitOfWork.WellnessPrograms.GetByIdAsync(id);
        }

        public async Task<WellnessProgram> CreateProgramAsync(WellnessProgram program)
        {
            await _unitOfWork.WellnessPrograms.AddAsync(program);
            await _unitOfWork.CompleteAsync();
            return program;
        }

        public async Task<IEnumerable<WellnessChallenge>> GetChallengesAsync(int programId)
        {
            return await _unitOfWork.WellnessChallenges.FindAsync(wc => wc.ProgramID == programId);
        }

        public async Task<WellnessChallenge> CreateChallengeAsync(WellnessChallenge challenge)
        {
            await _unitOfWork.WellnessChallenges.AddAsync(challenge);
            await _unitOfWork.CompleteAsync();
            return challenge;
        }

        public async Task<ActivityLog> LogActivityAsync(int employeeId, ActivityLogRequest request)
        {
            var challenge = await _unitOfWork.WellnessChallenges.GetByIdAsync(request.ChallengeID);
            if (challenge == null || challenge.Status != "Active")
            {
                throw new ArgumentException("Challenge not found or not active.");
            }

            // Calculate points: if log matches or exceeds daily target, award points!
            int pointsEarned = 0;
            if (request.ActivityValue >= challenge.DailyTarget)
            {
                pointsEarned = challenge.PointsPerCompletion;
            }

            var log = new ActivityLog
            {
                ChallengeID = request.ChallengeID,
                EmployeeID = employeeId,
                LogDate = request.LogDate,
                ActivityValue = request.ActivityValue,
                PointsEarned = pointsEarned,
                Status = "Verified" // Auto-verified for instant rewards experience
            };

            await _unitOfWork.ActivityLogs.AddAsync(log);

            // Update user points balance
            if (pointsEarned > 0)
            {
                var pointsRecords = await _unitOfWork.RewardPoints.FindAsync(rp => rp.EmployeeID == employeeId);
                var pointsRecord = pointsRecords.FirstOrDefault();

                if (pointsRecord == null)
                {
                    pointsRecord = new RewardPoints
                    {
                        EmployeeID = employeeId,
                        TotalEarned = pointsEarned,
                        TotalRedeemed = 0,
                        Balance = pointsEarned,
                        LastUpdated = DateTime.UtcNow
                    };
                    await _unitOfWork.RewardPoints.AddAsync(pointsRecord);
                }
                else
                {
                    pointsRecord.TotalEarned += pointsEarned;
                    pointsRecord.Balance += pointsEarned;
                    pointsRecord.LastUpdated = DateTime.UtcNow;
                    _unitOfWork.RewardPoints.Update(pointsRecord);
                }

                // Add Notification
                var notification = new Notification
                {
                    UserID = employeeId,
                    Message = $"Congratulations! You earned {pointsEarned} points in '{challenge.ChallengeName}'.",
                    Category = "Wellness",
                    Status = "Unread",
                    CreatedDate = DateTime.UtcNow
                };
                await _unitOfWork.Notifications.AddAsync(notification);
            }

            await _unitOfWork.CompleteAsync();
            return log;
        }

        public async Task<IEnumerable<ActivityLog>> GetEmployeeLogsAsync(int employeeId)
        {
            return await _unitOfWork.ActivityLogs.FindAsync(al => al.EmployeeID == employeeId);
        }

        public async Task<IEnumerable<LeaderboardEntryDTO>> GetLeaderboardAsync(int programId)
        {
            var challenges = await _unitOfWork.WellnessChallenges.FindAsync(wc => wc.ProgramID == programId);
            var challengeIds = challenges.Select(c => c.ChallengeID).ToList();

            var logs = await _unitOfWork.ActivityLogs.GetAllAsync();
            var filteredLogs = logs.Where(l => challengeIds.Contains(l.ChallengeID) && l.Status == "Verified");

            var users = await _unitOfWork.Users.GetAllAsync();
            var userMap = users.ToDictionary(u => u.UserID, u => u);

            var leaderboard = filteredLogs
                .GroupBy(l => l.EmployeeID)
                .Select(g => new LeaderboardEntryDTO
                {
                    EmployeeID = g.Key,
                    EmployeeName = userMap.TryGetValue(g.Key, out var u) ? u.Name : $"Employee {g.Key}",
                    DepartmentID = userMap.TryGetValue(g.Key, out var usr) ? usr.DepartmentID : "Unknown",
                    TotalPoints = g.Sum(l => l.PointsEarned)
                })
                .OrderByDescending(e => e.TotalPoints)
                .ToList();

            // Assign ranks
            for (int i = 0; i < leaderboard.Count; i++)
            {
                leaderboard[i].Rank = i + 1;
            }

            return leaderboard;
        }
    }
}
