using System.ComponentModel;

namespace SearchEng.Common.Interfaces
{
    public interface IDirtyCheck : INotifyPropertyChanged
    {
        bool IsDirty { get; set; }

    }
}