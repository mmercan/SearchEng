using Microsoft.Framework.ConfigurationModel;
using System;
using System.Collections.Specialized;

using SearchEng.Extensions.ExtensionConfig;

namespace SearchEng.Extensions.Interfaces
{
    public interface IExtension
    {
        void Initialize(RepositoryExtensionFactory.ExtensionEvents events, IConfiguration config);
    }
}