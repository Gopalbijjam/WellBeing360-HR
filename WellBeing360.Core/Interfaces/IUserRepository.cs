using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
