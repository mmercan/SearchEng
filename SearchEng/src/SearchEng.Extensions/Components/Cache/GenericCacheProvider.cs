using Microsoft.Framework.Caching.Memory;
using System.Collections.Generic;

namespace SearchEng.Extensions.Components.Cache
{
    public class GenericCacheProvider<T> where T : class
    {

        private MemoryCache cache = new MemoryCache(new MemoryCacheOptions());

        public IEnumerable<T> Get(string key)
        {
            return cache.Get(key) as IEnumerable<T>;
        }

        public void Set(string key, IEnumerable<T> data, int cacheTime)
        {
            cache.Set(key, data);
        }

        public bool IsSet(string key)
        {
            return (cache.Get(key) != null);
        }

        public void Invalidate(string key)
        {
            cache.Remove(key);
        }

    }
}
