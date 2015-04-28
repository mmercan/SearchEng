//using System;
//using System.Data.Entity;
//using System.Data.Entity.Infrastructure;
//using System.Net;
//using System.Threading.Tasks;
//using System.Web.Http;
//using Microsoft.Owin.Logging;
//using WebApplication2.Providers.Configuration;

//namespace  SearchEng.Extensions.Repository
//{
//    public class RepositoryWebApiAsync<T, TK> : ApiController where T : class
//    {
//        protected DbContext Db;
//        protected Repository<T> Repo;

//        private readonly RepositoryModuleFactory.ModuleEvents events;
//        private readonly ILogger logger;

//        public RepositoryWebApiAsync(DbContext db)
//        {
//            db.Configuration.LazyLoadingEnabled = false;
//            db.Configuration.ProxyCreationEnabled = false;
//            Db = db;
//            Repo = new Repository<T>(db);
//            logger = LoggingFactory.GetLogger();
//            events = RepositoryModuleFactory.GetModules();
//        }

//        [HttpGet]
//        public virtual IHttpActionResult Getitems()
//        {
//            var items = Repo.GetAll();
//            var args = events.CallEntityProcessed(items, RepositoryModuleFactory.ApiActionType.GetAll);
//            if (args.Cancel)
//            {
//                return BadRequest();
//            }
//            return Ok(items);
//        }




//        [HttpGet]
//        public virtual async Task<IHttpActionResult> Getitem(TK id)
//        {
//            T item = await Repo.FindAsync(id);
//            if (item == null)
//            {
//                return NotFound();
//            }
//            var args = events.CallEntityProcessed(item, RepositoryModuleFactory.ApiActionType.Get);
//            if (args.Cancel)
//            {
//                return BadRequest();
//            }
//            return Ok(item);
//        }

//        [HttpPut]
//        public virtual async Task<IHttpActionResult> Putitem(T item)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            var args = events.CallEntityProcessed(item, RepositoryModuleFactory.ApiActionType.Put);
//            if (args.Cancel)
//            {
//                return BadRequest();
//            }

//            Repo.Update(item);
//            try
//            {
//                await Repo.SaveChangesAsync();
//            }
//            catch (DbUpdateConcurrencyException ex)
//            {
//                logger.WriteError(ex.Message);
//                return NotFound();
//            }
//            catch (Exception ex)
//            {
//                logger.WriteError(ex.Message);
//                return BadRequest();
//            }
//            return StatusCode(HttpStatusCode.NoContent);
//        }


//        [HttpPost]
//        public virtual async Task<IHttpActionResult> Postitem(T item)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }
//            var args = events.CallEntityProcessed(item, RepositoryModuleFactory.ApiActionType.Post);
//            if (args.Cancel)
//            {
//                return BadRequest();
//            }
//            Repo.Add(item);

//            try
//            {
//                await Repo.SaveChangesAsync();
//            }
//            catch (Exception ex)
//            {
//                logger.WriteError(ex.Message);
//                return Conflict();
//            }

//            return CreatedAtRoute("DefaultApi", null, item);
//        }

//        [HttpDelete]
//        public virtual async Task<IHttpActionResult> Deleteitem(TK id)
//        {
//            T item = Repo.Delete(id);
//            if (item == null)
//            {
//                return NotFound();
//            }

//            var args = events.CallEntityProcessed(item, RepositoryModuleFactory.ApiActionType.Delete);
//            if (args.Cancel)
//            {
//                return BadRequest();
//            }

//            await Repo.SaveChangesAsync();
//            return Ok(item);
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