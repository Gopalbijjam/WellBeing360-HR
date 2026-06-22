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
        private readonly IWellnessRepository _wellnessRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IRecognitionRepository _recognitionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public WellnessManagementService(IWellnessRepository wellnessRepository, INotificationRepository notificationRepository, IRecognitionRepository recognitionRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _wellnessRepository = wellnessRepository;
            _notificationRepository = notificationRepository;
            _recognitionRepository = recognitionRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<WellnessProgram>> GetProgramsAsync()
        {
            return await _wellnessRepository.GetProgramsAsync();
        }

        public async Task<WellnessProgram?> GetProgramByIdAsync(int id)
        {
            return await _wellnessRepository.GetProgramByIdAsync(id);
        }

        public async Task<WellnessProgram> CreateProgramAsync(WellnessProgram program)
        {
            await _wellnessRepository.AddProgramAsync(program);
            await _unitOfWork.CompleteAsync();
            return program;
        }

        public async Task<IEnumerable<WellnessChallenge>> GetChallengesAsync(int programId)
        {
            return await _wellnessRepository.GetChallengesByProgramAsync(programId);
        }

        public async Task<WellnessChallenge> CreateChallengeAsync(WellnessChallenge challenge)
        {
            await _wellnessRepository.AddChallengeAsync(challenge);
            await _unitOfWork.CompleteAsync();
            return challenge;
        }

        public async Task<ActivityLog> LogActivityAsync(int employeeId, ActivityLogRequest request)
        {
            var challenge = await _wellnessRepository.GetChallengeByIdAsync(request.ChallengeID);
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

            await _wellnessRepository.AddActivityLogAsync(log);

            // Update user points balance
            if (pointsEarned > 0)
            {
                var pointsRecords = await _recognitionRepository.GetPointsByEmployeeAsync(employeeId);
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
                    await _recognitionRepository.AddOrUpdatePointsAsync(pointsRecord);
                }
                else
                {
                    pointsRecord.TotalEarned += pointsEarned;
                    pointsRecord.Balance += pointsEarned;
                    pointsRecord.LastUpdated = DateTime.UtcNow;
                    await _recognitionRepository.AddOrUpdatePointsAsync(pointsRecord);
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
                await _notificationRepository.AddAsync(notification);
            }

            await _unitOfWork.CompleteAsync();
            return log;
        }

        public async Task<IEnumerable<ActivityLog>> GetEmployeeLogsAsync(int employeeId)
        {
            return await _wellnessRepository.GetLogsByEmployeeAsync(employeeId);
        }

        public async Task<IEnumerable<CoordinatorActivityLogResponse>> GetCoordinatorActivityLogsAsync()
        {
            var logs = await _wellnessRepository.GetAllLogsAsync();
            var challenges = await _wellnessRepository.GetAllChallengesAsync();
            var users = await _userRepository.GetAllAsync();

            var challengeMap = challenges.ToDictionary(c => c.ChallengeID, c => c);
            var userMap = users.ToDictionary(u => u.UserID, u => u);

            var list = new List<CoordinatorActivityLogResponse>();
            foreach (var l in logs)
            {
                list.Add(new CoordinatorActivityLogResponse
                {
                    LogID = l.LogID,
                    EmployeeID = l.EmployeeID,
                    EmployeeName = userMap.TryGetValue(l.EmployeeID, out var u) ? u.Name : $"Employee {l.EmployeeID}",
                    ChallengeName = challengeMap.TryGetValue(l.ChallengeID, out var c) ? c.ChallengeName : "Unknown Challenge",
                    ActivityType = challengeMap.TryGetValue(l.ChallengeID, out var ch) ? ch.ActivityType : "Unknown",
                    ActivityValue = l.ActivityValue,
                    PointsEarned = l.PointsEarned,
                    LogDate = l.LogDate,
                    Status = l.Status
                });
            }

            return list.OrderByDescending(l => l.LogDate);
        }

        public async Task<IEnumerable<LeaderboardEntryDTO>> GetLeaderboardAsync(int programId)
        {
            var challenges = await _wellnessRepository.GetChallengesByProgramAsync(programId);
            var challengeIds = challenges.Select(c => c.ChallengeID).ToList();

            var logs = await _wellnessRepository.GetAllLogsAsync();
            var filteredLogs = logs.Where(l => challengeIds.Contains(l.ChallengeID) && l.Status == "Verified");

            var users = await _userRepository.GetAllAsync();
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

        public async Task<WellnessChallenge?> UpdateChallengeStatusAsync(int challengeId, string status)
        {
            var challenge = await _wellnessRepository.GetChallengeByIdAsync(challengeId);
            if (challenge == null) return null;

            challenge.Status = status;
            _wellnessRepository.UpdateChallenge(challenge);
            await _unitOfWork.CompleteAsync();
            return challenge;
        }

        public async Task<IEnumerable<WellnessChallenge>> GetAllChallengesAcrossProgramsAsync()
        {
            return await _wellnessRepository.GetAllChallengesAsync();
        }
    }
}
