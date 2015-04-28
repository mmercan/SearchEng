using System;
using System.Collections;
using System.Collections.Generic;

namespace SearchEng.Search.Interface
{
    public interface ISearchRepositoryCollection
    {
        IEnumerable<ISearchRepository> Repositories { get; set; }


        IEnumerable<string> Suggestions(string term);
        IEnumerable Results(string term);
    }
}