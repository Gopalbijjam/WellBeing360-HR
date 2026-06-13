using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IUserManagementService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<User?> RegisterAsync(RegisterRequest request);
        Task<User?> GetUserByIdAsync(int id);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(int id, User user);
    }
}
