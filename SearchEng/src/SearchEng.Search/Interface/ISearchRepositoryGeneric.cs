using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SearchEng.Search.Interface
{
    public interface ISearchRepository<T> : ISearchRepository where T :class
    {
        IEnumerable<string> Suggestions(string term);
        Task<IEnumerable<string>> SuggestionsAsync(string term);
        Task<IEnumerable<T>> ResultsAsync(string term);
        IEnumerable<T> Results(string term);
     
    }
}