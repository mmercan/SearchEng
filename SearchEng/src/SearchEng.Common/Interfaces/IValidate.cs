using FluentValidation;
using System;
using System.Collections.Generic;

namespace SearchEng.Common.Interfaces
{
    public interface IValidate
    {
        IValidator GetValidator();
    }


    public interface IValidationError
    {
        string PropertyName { get; set; }
        string ValidationError { get; set; }
    }

    public interface IValidationResult
    {
        IList<IValidationError> Errors { get; set; }
        bool IsValid { get; set; }
    }
}