using System;
using SearchEng.Common.Interfaces;

namespace SearchEng.Extensions.Components.Mailler
{
    public class SMTPMailler :IMailler
    {
        public string Server { get; set; }
        public string From { get; set; }
        public bool Send(string subject, string body, string to)
        {
            return true;

            //no soppurt for smtp now it will be direct TCP IP connection
        }
    }
}