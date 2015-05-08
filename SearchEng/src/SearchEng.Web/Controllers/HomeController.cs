using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;


namespace SearchEng.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            //AWEntityTests dbtests = new AWEntityTests();
            //dbtests.ConnectionCheck();
            //dbtests.ProductsExists();
            //dbtests.ProductSubCatExists();
            //dbtests.PersonExits();


            //SearchTests searchtests = new SearchTests();
            //searchtests.SearchExistItemGoodRead();
            //searchtests.SearchExistItemRotten();
            //searchtests.SearchExistItemPerson();
            //searchtests.SearchExistItemProduct();
            //searchtests.SearchNonExistItemGoodRead();
            //searchtests.SearchNonExistItemRotten();
            //searchtests.SearchNonExistItemPerson();
            //searchtests.SearchNonExistItemProduct();
            //searchtests.SearchWhiteSpaceGoodRead();
            //searchtests.SearchWhiteSpaceRotten();
            //searchtests.SearchWhiteSpacePerson();
            //searchtests.SearchWhiteSpaceProduct();

            //SuggestionTest suggests = new SuggestionTest();
            //suggests.SuggestExistItemProduct();

            return View();
        }

        public IActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}