using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UserManagementService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            var users = await _userRepository.FindAsync(u => u.Email.ToLower() == request.Email.ToLower());
            var user = users.FirstOrDefault();

            if (user == null || user.Status != "Active" || user.Password != request.Password)
            {
                return null;
            }

            return new LoginResponse
            {
                Token = string.Empty, // Token will be generated in AuthController (API Layer)
                UserID = user.UserID,
                EmployeeID = user.EmployeeID,
                Name = user.Name,
                Role = user.Role,
                Email = user.Email,
                GradeID = user.GradeID,
                DepartmentID = user.DepartmentID
            };
        }

        public async Task<User?> RegisterAsync(RegisterRequest request)
        {
            var existing = await _userRepository.FindAsync(u => u.Email.ToLower() == request.Email.ToLower());
            if (existing.Any())
            {
                return null;
            }

            var randomSuffix = new System.Random().Next(1000, 9999);
            var employeeId = $"EMP{randomSuffix}";

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                Phone = request.Phone,
                Role = string.IsNullOrWhiteSpace(request.Role) ? "Employee" : request.Role,
                GradeID = string.IsNullOrWhiteSpace(request.GradeID) ? "G1" : request.GradeID,
                DepartmentID = string.IsNullOrWhiteSpace(request.DepartmentID) ? "IT" : request.DepartmentID,
                Status = "Active",
                EmployeeID = employeeId
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.CompleteAsync();
            return user;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _userRepository.AddAsync(user);
            await _unitOfWork.CompleteAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(int id, User user)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null) return null;

            existingUser.Name = user.Name;
            existingUser.Role = user.Role;
            existingUser.Email = user.Email;
            existingUser.Phone = user.Phone;
            existingUser.GradeID = user.GradeID;
            existingUser.DepartmentID = user.DepartmentID;
            existingUser.Status = user.Status;

            _userRepository.Update(existingUser);
            await _unitOfWork.CompleteAsync();
            return existingUser;
        }
    }
}
