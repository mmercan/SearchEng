using Microsoft.Data.Entity;
using Microsoft.Data.Entity.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

using SearchEng.Common.Attributes;
using SearchEng.Common.Interfaces;

namespace SearchEng.Extensions.Repository
{
    public class Repository<T> : IDisposable, IRepository<T> where T : class
    {
        private readonly DbContext db;
        private readonly DbSet<T> dbSet;
        public Repository(DbContext db)
        {
            if (db == null)
            {
                throw new ArgumentNullException("db");
            }
            this.db = (DbContext)db;
            //   this.db.Configuration.LazyLoadingEnabled = false;
            //   this.db.Configuration.ProxyCreationEnabled = false;
            dbSet = this.db.Set<T>();
        }
        public virtual IQueryable<T> GetAll()
        {
            return dbSet;
        }
        public virtual Task<IQueryable<T>> GetAllAsync()
        {
            Task<IQueryable<T>> ts = Task<IQueryable<T>>.Factory.StartNew(() => dbSet);
            return ts;
        }

        public virtual Task<T> FindAsync(object id)
        {
            Task<T> findTask = Task<T>.Factory.StartNew(() => Find(id));
            return findTask;
        }

        public virtual T Find(object id)
        {
            return Find(id.ToString()).FirstOrDefault();
        }

        public PropertyInfo findKey()
        {
            PropertyInfo pro = typeof(T).GetProperties().SingleOrDefault(p => p.IsDefined(typeof(KeyAttribute)));
            if (pro == null)
            {
                pro = typeof(T).GetProperties().FirstOrDefault(p => p.Name.EndsWith("ID"));
            }
            return pro;
        }
        public IEnumerable<T> Find(string searchTerm)
        {
            PropertyInfo getter = findKey();
            if (getter == null)
            {
                throw new ArgumentOutOfRangeException("searchField");
            }
            return dbSet.Where(x => getter.GetValue(x, null).ToString() == searchTerm);
        }

        public IEnumerable<T> getPeople(string searchField, string searchTerm)
        {
            PropertyInfo getter = typeof(T).GetProperty(searchField);
            if (getter == null)
            {
                throw new ArgumentOutOfRangeException("searchField");
            }
            return dbSet.Where(x => getter.GetValue(x, null).ToString() == searchTerm);

        }

        public T Find(Expression<Func<T, bool>> predicate)
        {
            return dbSet.SingleOrDefault(predicate);
        }
        void test()
        {
            var pro = findKey();
            ParameterExpression n = Expression.Parameter(pro.PropertyType);


            // BinaryExpression exp = Expression.Equal()
        }




        public virtual T Add(T item)
        {
            EntityEntry dbEntityEntry = db.Entry(item);
            bool isValid = true;//dbEntityEntry.GetValidationResult().IsValid;
            if (isValid)
            {
                // if (dbEntityEntry.State != EntityState.Detached)
                {
                    dbEntityEntry.SetState(EntityState.Added);
                }
                //  else
                {
                    dbSet.Add(item);
                }
                return item;
            }
            throw new Exception("Model is Not Valid");
        }

        public virtual void Update(T item)
        {
            EntityEntry entityEntry = db.Entry(item);
            bool isValid = true;//dbEntityEntry.GetValidationResult().IsValid;
            if (isValid)
            {
                // if (entityEntry.State == EntityState.Detached)
                // {
                dbSet.Attach(item);
                //}
                entityEntry.SetState(EntityState.Modified);
            }
            else
            {
                throw new Exception("Model is Not Valid");
            }
        }

        public virtual void Delete(T item)
        {
            EntityEntry dbEntityEntry = db.Entry(item);
            if (dbEntityEntry.State != EntityState.Deleted)
            {
                dbEntityEntry.SetState(EntityState.Deleted);
            }
            else
            {
                dbSet.Attach(item);
                dbSet.Remove(item);
            }
        }

        public virtual T Delete(object id)
        {
            T item = Find(id);
            if (item != null)
            {
                EntityEntry dbEntityEntry = db.Entry(item);
                if (dbEntityEntry.State != EntityState.Deleted)
                {
                    dbEntityEntry.SetState(EntityState.Deleted);
                }
                else
                {
                    dbSet.Attach(item);
                    dbSet.Remove(item);
                }
            }
            return item;
        }


        public int SaveChanges()
        {
            return db.SaveChanges();
        }

        public Task SaveChangesAsync()
        {
            return db.SaveChangesAsync();
        }

        public void Dispose()
        {
            db.Dispose();
        }
    }
}
