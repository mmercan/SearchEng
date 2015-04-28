using System;

namespace SearchEng.Common.Interfaces
{
    public interface IMailler
    {
         string Server { get; set; }
         string From { get; set; }
        bool Send(string subject, string body, string to);
    }
}