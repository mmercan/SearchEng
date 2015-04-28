using System;
using Microsoft.Framework.Logging;

using SearchEng.Extensions.Components.Logger;
namespace SearchEng.Extensions.ExtensionConfig
{
    public class LoggingFactory
    {
        public static ILogger GetLogger()
        {
            var loggerelement = ConfigSettings.Logger;
            if (loggerelement != null && loggerelement!=null)
            {
                var logger = Activator.CreateInstance(Type.GetType(loggerelement.Type)) as ILogger;
                return logger;
               

            }
            return new LocalLogger();
        }
    }
}