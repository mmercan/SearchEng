using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Xml;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SearchEng.Web.Controllers
{
    public class goodreadsController : Controller
    {
        // GET: goodreads
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public string isbn(string isbn)
        {
            WebClient cl = new WebClient();
            var xml = cl.DownloadString("https://www.goodreads.com/book/show/50?format=xml&key=yqJLRCs1j7H6T4wcrNrHew");
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            var books = doc.SelectSingleNode("descendant::book");
            string jsonText = JsonConvert.SerializeXmlNode(books);
            return jsonText;
        }

        public string Search(string term)
        {
            WebClient cl = new WebClient();
            var xml = cl.DownloadString("https://www.goodreads.com/search.xml?key=yqJLRCs1j7H6T4wcrNrHew&q=" + term);


            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            var search = doc.SelectSingleNode("descendant::search");
            string jsonText = JsonConvert.SerializeXmlNode(search);
            return jsonText;
        }

        public string BookDetail(string id)
        {
            var address = "https://www.goodreads.com/book/show/" + id + "?format=xml&key=yqJLRCs1j7H6T4wcrNrHew";
            WebClient cl = new WebClient();
            var xml = cl.DownloadString(address);

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            var search = doc.SelectSingleNode("descendant::book");
            string jsonText = JsonConvert.SerializeXmlNode(search);
            return jsonText;
        }

        public string Author(string id)
        {
            var address = "https://www.goodreads.com/author/show/" + id + "?format=xml&key=yqJLRCs1j7H6T4wcrNrHew";
            WebClient cl = new WebClient();
            var xml = cl.DownloadString(address);

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            var search = doc.SelectSingleNode("descendant::author");
            string jsonText = JsonConvert.SerializeXmlNode(search);
            return jsonText;
        }
    }

}
