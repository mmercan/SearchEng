using System.Linq;
using System.Threading.Tasks;

namespace SearchEng.Common.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<IQueryable<T>> GetAllAsync();

      //  T Find(object id);
      //  Task<T> FindAsync(object id);
        T Add(T item);
        void Update(T item);
        void Delete(T item);
       // T Delete(object id);

        int SaveChanges();
        Task SaveChangesAsync();
        void Dispose();
    }
}