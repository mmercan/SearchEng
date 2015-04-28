using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using SearchEng.Extensions.ExtensionConfig;
using SearchEng.Search.Repository;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SearchEng.Web.Controllers
{
    public class PeopleSearchController : Controller
    {
        PersonSearchRepository repo;
        public PeopleSearchController(DbContext db)
        {
            repo = new PersonSearchRepository(db);
        }
      
        public IActionResult Suggestions(string id)
        {
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.Search);

            var result = repo.Suggestions(id).Distinct().Take(10).ToList();

            var argsfinished = RepositoryExtensionFactory.CallActionFinished(id, RepositoryExtensionFactory.ApiActionType.Search);
            if (argsfinished.Cancel){return HttpBadRequest();}

            return new ObjectResult(result);
        }

        public IActionResult Search(string id)
        {
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.Search);

            var result = repo.Results(id).ToList();

            var argsfinished = RepositoryExtensionFactory.CallActionFinished(id, RepositoryExtensionFactory.ApiActionType.Search);
            if (argsfinished.Cancel){return HttpBadRequest();}

            return new ObjectResult(result);
        }
    }
}
