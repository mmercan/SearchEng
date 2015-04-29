using Newtonsoft.Json;
using SearchEng.Common.GoodRead;
using SearchEng.Search.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using System.Xml.XPath;
using System.Threading.Tasks;

namespace SearchEng.Search.Repository
{


    public class GoodReadSearchRepository : ISearchRepository<Book>
    {

        public IEnumerable<Book> Results(string term)
        {
            //WebClient cl = new WebClient();
            //var xml = cl.DownloadString("https://www.goodreads.com/search.xml?key=yqJLRCs1j7H6T4wcrNrHew&q=" + term);
            //XmlDocument doc = new XmlDocument();
            //doc.LoadXml(xml);
            //var search = doc.SelectSingleNode("descendant::search");
            //string jsonText = JsonConvert.SerializeXmlNode(search);
            //return jsonText;

            List<Book> books = new List<Book>();

            XElement root = XElement.Load("https://www.goodreads.com/search.xml?key=yqJLRCs1j7H6T4wcrNrHew&q=" + term);
            var results = from el in root.Descendants("best_book") select el;

           
            foreach (XElement item in results)
            {
                Book newbook = new Book();
                int id;
                if (Int32.TryParse(item.Element("id").Value, out id))
                {
                    newbook.ID = id;
                }
                newbook.Title = item.Element("title").Value;
                int authorId;
                if (Int32.TryParse(item.Element("author").Element("id").Value, out authorId))
                {
                    newbook.AuthorID = authorId;
                }
                newbook.Author = item.Element("author").Element("name").Value;
                newbook.Image = item.Element("image_url").Value;
                newbook.Thumbnail= item.Element("small_image_url").Value;
                books.Add(newbook);
            }
            return books;
        }

        public Task<IEnumerable<Book>> ResultsAsync(string term)
        {
            Task<IEnumerable<Book>> resultasync = Task<IEnumerable<Book>>.Factory.StartNew(() => { return Results(term); });
            return resultasync;
        }

        public virtual IEnumerable<string> Suggestions(string term)
        {
  
            XElement root = XElement.Load("https://www.goodreads.com/search.xml?key=yqJLRCs1j7H6T4wcrNrHew&q=" + term);
            var suggests = from el in root.Descendants("best_book") select (string)el.Element("title") ;
            return suggests;

        }

        public Task<IEnumerable<string>> SuggestionsAsync(string term)
        {
            Task<IEnumerable<string>> suggestasync = Task<IEnumerable<string>>.Factory.StartNew(() => { return Suggestions(term); });
            return suggestasync;
        }
    }
}