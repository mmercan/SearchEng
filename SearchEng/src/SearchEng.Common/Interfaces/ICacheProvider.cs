using System;
using System.Collections.Generic;

namespace SearchEng.Common.Interfaces
{
    public interface ICacheProvider
    {
        object Get(string key);
        void Set(string key, object data, int cacheTime);
        bool IsSet(string key);
        void Invalidate(string key);
    }


    public interface ICacheProvider<T> where T : class
    {
        IEnumerable<T> Get(string key);
        void Set(string key, IEnumerable<T> data, int cacheTime);
        bool IsSet(string key);
        void Invalidate(string key);
    }
}