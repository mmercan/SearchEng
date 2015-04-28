using System;
using SearchEng.Search.Repository;
using Microsoft.AspNet.Mvc;
using SearchEng.Extensions.ExtensionConfig;
using System.Linq;

namespace SearchEng.Web.Controllers
{
    public class BookSearchController :Controller
    {
        GoodReadSearchRepository repo;
        public BookSearchController()
        {
            repo = new GoodReadSearchRepository();
        }

        public IActionResult Suggestions(string id)
        {
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.Search);

            var result = repo.Suggestions(id).Distinct().Take(10).ToList();

            var argsfinished = RepositoryExtensionFactory.CallActionFinished(id, RepositoryExtensionFactory.ApiActionType.Search);
            if (argsfinished.Cancel) { return HttpBadRequest(); }

            return new ObjectResult(result);
        }

        public IActionResult Search(string id)
        {
            RepositoryExtensionFactory.CallActionStarting(id, RepositoryExtensionFactory.ApiActionType.Search);

            var result = repo.Results(id);//.ToList();

            var argsfinished = RepositoryExtensionFactory.CallActionFinished(id, RepositoryExtensionFactory.ApiActionType.Search);
            if (argsfinished.Cancel) { return HttpBadRequest(); }

            return new ObjectResult(result);
        }

    }
}