using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using SearchEng.Extensions.ExtensionConfig;
using SearchEng.Search.Repository;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SearchEng.Web.Controllers
{
    public class ProductSearchController : Controller
    {
        ProductSearchRepository repo;
        public ProductSearchController(DbContext db)
        {
            repo = new ProductSearchRepository(db);
        }
        public IActionResult Suggestions(string id)
        {
            //Cache Extension can be check before Query
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.SearchSuggestions);

            var result = repo.Suggestions(id).Distinct().ToList();

            var args = RepositoryExtensionFactory.CallActionFinished(result, RepositoryExtensionFactory.ApiActionType.SearchSuggestions);
            if (args.Cancel){ return  HttpBadRequest(); }

            return new ObjectResult(result);
        }

        public IActionResult Search(string id)
        {
            //Cache Extension can be check before Query
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.Search);

            var result = repo.Results(id).ToList();

            var argsfinished = RepositoryExtensionFactory.CallActionFinished(id, RepositoryExtensionFactory.ApiActionType.Search);
            if (argsfinished.Cancel){ return HttpBadRequest();}

            return new ObjectResult(result);
        }

        
    }
}
