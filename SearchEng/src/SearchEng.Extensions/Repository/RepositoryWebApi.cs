//using System;
//using System.Net;
//using System.Web.Http;
//using Microsoft.Data.Entity;
//using Microsoft.AspNet.Mvc;
//using Microsoft.Data.Entity.Update;
//using Microsoft.Framework.Logging;
//using Microsoft.AspNet.Mvc.ModelBinding;
//using System.Collections.Generic;
//using $rootnamespace$.Interfaces;
//using $rootnamespace$.Repository;
//using $rootnamespace$.ExtensionConfig;
//using $rootnamespace$.Configuration;

//namespace SearchEng.Extensions.Repository
//{
//    public interface IValidate<T> where T :class
//    {
//        IValidationResult Validate(T entity, ModelStateDictionary modelState, DbContext dbContext);
//    }

//    public class StardartValidate<T> : IValidate<T> where T : class
//    {
//        public IValidationResult Validate(T entity, ModelStateDictionary modelState, DbContext dbContext)
//        {
//            var val = new GenericValidationResult();
//            val.IsValid = modelState.IsValid;

//            return val;
//           // modelState.Add("bb", new ModelState { Errors = new ModelErrorCollection { } });
//        }
//    }

//    [Route("api/[controller]")]
//    public class RepositoryWebApi<T, TK> : Controller where T : class
//    {

//        protected DbContext Db;
//        protected Repository<T> Repo;

//        protected readonly RepositoryExtensionFactory events;
//        protected readonly ILogger logger;

//        public RepositoryWebApi(DbContext db)
//        {
//            //db.Configuration.LazyLoadingEnabled = false;
//            //db.Configuration.ProxyCreationEnabled = false;
//            Db = db;
//            Repo = new Repository<T>(db);
//            logger = LoggingFactory.GetLogger();
//           // events = RepositoryModuleFactory.GetExtensions();
//        }
//        public RepositoryWebApi(DbContext db, IValidate<T> validate)
//        {
//            Validate = Validate;
//        }

//        public IValidate<T> Validate { get; set; }

//        [HttpGet]
//        public virtual IActionResult Getitems()
//        {
//            var items = Repo.GetAll();
//            var args = RepositoryExtensionFactory.CallActionStarting(items, RepositoryExtensionFactory.ApiActionType.GetAll);
//            if (args.Cancel)
//            {
//                return HttpBadRequest();
//            }
//            return new ObjectResult(items);
//        }

//        [HttpGet("{id:int}", Name = "GetByIdRoute")]
//        public virtual IActionResult Getitem(TK id)
//        {

//            T item = Repo.Find(id);
//            var validationArgs = RepositoryExtensionFactory.CalltoValidate(item, RepositoryExtensionFactory.ApiActionType.Get);
//            if (item == null)
//            {
//                return HttpNotFound();
//            }
//            var args = RepositoryExtensionFactory.CallActionStarting(item, RepositoryExtensionFactory.ApiActionType.Get);
//            if (args.Cancel)
//            {
//                return HttpBadRequest();
//            }
//            return new ObjectResult(item);
//        }

//        [HttpPut]
//        public virtual IActionResult Putitem(T item)
//        {
//            var validationArgs = RepositoryExtensionFactory.CalltoValidate(item, RepositoryExtensionFactory.ApiActionType.Put);
//            if(validationArgs.Result!=null && !validationArgs.Result.IsValid)
//            {
//                var errors = validationArgs.Result.Errors;
//                return HttpBadRequest();
//            }
//            if (validationArgs.Cancel)
//            {
//                return HttpBadRequest();
//            }
//            if (!ModelState.IsValid)
//            {
//                return HttpBadRequest(ModelState);
//            }

//            var args = RepositoryExtensionFactory.CallActionStarting(item, RepositoryExtensionFactory.ApiActionType.Put);
//            if (args.Cancel)
//            {
//                return HttpBadRequest();
//            }

//            Repo.Update(item);
//            try
//            {
//                Repo.SaveChanges();
//            }
//            catch (DbUpdateConcurrencyException ex)
//            {
//                logger.WriteError(ex.Message);
//                return HttpNotFound();
//            }
//            catch (Exception ex)
//            {
//                logger.WriteError(ex.Message);
//                return HttpBadRequest();
//            }
//            return new HttpStatusCodeResult(201);
//        }


//        [HttpPost]
//        public virtual IActionResult Postitem(T item)
//        {
//            var validationArgs = RepositoryExtensionFactory.CalltoValidate(item, RepositoryExtensionFactory.ApiActionType.Post);
//            if (validationArgs.Result != null && !validationArgs.Result.IsValid)
//            {
//                var errors = validationArgs.Result.Errors;
//                return HttpBadRequest();
//            }
//            if (validationArgs.Cancel)
//            {
//                return HttpBadRequest();
//            }
//            var validateres = Validate.Validate(item, ModelState, Db);
//            if (!validateres.IsValid)
//            {
//                return HttpBadRequest(ModelState);
//            }
//            var args = RepositoryExtensionFactory.CallActionStarting(item, RepositoryExtensionFactory.ApiActionType.Post);
//            if (args.Cancel)
//            {
//                return HttpBadRequest();
//            }
//            Repo.Add(item);
//            Repo.SaveChanges();
//            return CreatedAtRoute("DefaultApi", null, item);
//        }

//        [HttpDelete]
//        public virtual IActionResult Deleteitem(TK id)
//        {
//            T item = Repo.Delete(id);
//            if (item == null)
//            {
//                return HttpNotFound();
//            }

//            var args = RepositoryExtensionFactory.CallActionStarting(item, RepositoryExtensionFactory.ApiActionType.Delete);
//            if (args.Cancel)
//            {
//                return HttpBadRequest();
//            }

//            Repo.SaveChanges();
//            return new ObjectResult(item);
//        }

//        protected override void Dispose(bool disposing)
//        {
//            if (disposing)
//            {
//                Repo.Dispose();
//            }
//            base.Dispose(disposing);
//        }
//    }
//}