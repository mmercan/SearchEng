using Microsoft.Framework.Logging;
using System;
using System.Diagnostics;

namespace SearchEng.Extensions.Components.Logger
{
    public class LocalLogger : ILogger
    {
        public IDisposable BeginScope(object state)
        {
            throw new NotImplementedException();
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            throw new NotImplementedException();
        }

        public void Write(LogLevel logLevel, int eventId, object state, Exception exception, Func<object, Exception, string> formatter)
        {
            Trace.TraceError(state.ToString());
        }

        public bool WriteCore(TraceEventType eventType, int eventId, object state, Exception exception, Func<object, Exception, string> formatter)
        {
            if (eventType == TraceEventType.Critical || eventType == TraceEventType.Error ||
                eventType == TraceEventType.Stop || eventType == TraceEventType.Suspend)
            {
                Trace.TraceError(state.ToString());

            }
            return true;

        }
        public void Write(string message)
        {
            Console.WriteLine(message);
        }

        public void Log(LogLevel logLevel, int eventId, object state, Exception exception, Func<object, Exception, string> formatter)
        {
            if (logLevel == LogLevel.Error)
            {

            }
            Trace.TraceError(state.ToString());
        }
    }
}