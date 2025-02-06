import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

  const handleZodError = (err: ZodError):TGenericErrorResponse => {
    const errorSource: TErrorSources = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1], //tarking last index
        message: issue.message,
      };
    });
    const statusCode = 400;

    return {
      statusCode,
      message: ' validation error',
      errorSource,
    };
  };


  export default handleZodError;