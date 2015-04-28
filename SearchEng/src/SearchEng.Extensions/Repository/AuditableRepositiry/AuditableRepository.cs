//using System;
//using System.Collections.Generic;
//using System.Linq;
//using Microsoft.AspNet.Http;
//using Microsoft.Data.Entity;
//using $rootnamespace$.Repository;

//namespace  SearchEng.Extensions.Repository.AuditableRepositiry
//{
//    public class AuditableRepository<T> : Repository<T> where T : class, IAuditable
//    {
//        HttpContext httpContext { get; set; }
//        public AuditableRepository(HttpContext httpContext, DbContext db) :base(db)
//        {
//            this.httpContext = httpContext;
//        }

//        public AuditableRepository(DbContext db) : base(db)
//        {
//           // _httpContext = contextAccessor.Value.HttpContext;
//        }
//        private string GetCurrentUserName()
//        {
//            //   return HttpContext.Current.User.Identity.Name;
//            return httpContext.User.Identity.Name;
//        }



//        public override T Add(T item)
//        {
//            item.CreatedAt = DateTime.Now;
//            item.CreatedBy = GetCurrentUserName();
//            return base.Add(item);
//        }

//        public override void Update(T item)
//        {
//            item.UpdatedAt = DateTime.Now;
//            item.UpdatedBy = GetCurrentUserName();
//            base.Update(item);
//        }

//        public bool UpdateifOwnbyUser(T item)
//        {
//            if (item.CreatedBy !=  GetCurrentUserName())
//            {
//                return false;
//            }
//            item.UpdatedAt = DateTime.Now;
//            item.UpdatedBy = GetCurrentUserName();
//            base.Update(item);
//            return true;
//        }
//        public IQueryable<T> GetAllOwnbyUser()
//        {
//            return base.GetAll().Where(p => p.CreatedBy == GetCurrentUserName());
//        }

//        public  T DeleteifOwnbyUser(object id)
//        {
//            //T item = base.Find(id);
//            //if (item.CreatedBy == GetCurrentUserName())
//            //{
//            //    return base.Delete(id);
//            //}
//            return null;
//        }

//    }
//}