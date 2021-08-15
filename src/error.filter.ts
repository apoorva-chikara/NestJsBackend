import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus, BadRequestException } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    let response = host.switchToHttp().getResponse();
    let status = (error instanceof HttpException) ? error.message: HttpStatus.INTERNAL_SERVER_ERROR;
    if (status.statusCode === HttpStatus.BAD_REQUEST) {
        return response.status(HttpStatus.BAD_REQUEST).send(status)
    }

    if (status.statusCode === HttpStatus.NOT_FOUND) {
        return response.status(HttpStatus.NOT_FOUND).send(status)
    }
 
    if (status.statusCode === HttpStatus.UNAUTHORIZED) 
        return response.status(status.statusCode).send(status)

        
    if (status.statusCode === HttpStatus.NOT_FOUND) 
        return response.status(status).send(status)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        if (process.env.NODE_ENV === 'production') {
          console.error(error.stack);
          return response.status(status).render('views/500');
        }
        else {
          let message = error.stack;
          return response.status(status).send(message); 
        } 
    }

  }
}