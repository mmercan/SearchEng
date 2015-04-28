using Microsoft.Data.Entity;
using Microsoft.Framework.Logging;

using SearchEng.Search.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SearchEng.Search.RepositoryExtensions
{
    public class EFSearchRepository<T> : ISearchRepository<T> where T : class
    {
        protected DbSet<T> _Dbset { get; set; }
        Func<T, string, bool> _SearchFunction { get; set; }
        Func<T, string> _SuggestionFunction { get; set; }

        public EFSearchRepository(DbContext db, Func<T,string, bool> searchFunction, Func<T,  string> suggestionFunction)
        {
            if (db == null)
            {
                throw new NullReferenceException("DbContext must be implemented");
            }
            if (searchFunction == null)
            {
                throw new NullReferenceException("searchTerm must be implemented");
            }
            if (suggestionFunction == null)
            {
                throw new NullReferenceException("suggestionFunction must be implemented");
            }
            _Dbset = db.Set<T>();
            _SearchFunction = searchFunction;
            _SuggestionFunction = suggestionFunction;
        }

        public virtual IEnumerable<T> Results(string term)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                return _Dbset.Where(p=> _SearchFunction.Invoke(p,term));
                
            }
            else return new List<T>();
        }

        public virtual IEnumerable<string> Suggestions(string term)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                return Results(term).Select(_SuggestionFunction);
            }
            else return new List<string>();
        }

        public virtual Task<IEnumerable<string>> SuggestionsAsync(string term)
        {
            Task<IEnumerable<string>> suggestasync = Task<IEnumerable<string>>.Factory.StartNew(() => { return Suggestions(term); });
            return suggestasync;
        }

        public virtual Task<IEnumerable<T>> ResultsAsync(string term)
        {
            Task<IEnumerable<T>> resultasync = Task<IEnumerable<T>>.Factory.StartNew(() => { return Results(term); });
            return resultasync;
        }
    }
}