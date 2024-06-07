import { NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CASE_SENSITIVE_ROUTES } from '../utils/constants';

export function CaseSensitiveMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalUrl = req.path;
  const method = req.method.toLowerCase();

  const routeMatch = CASE_SENSITIVE_ROUTES.find(
    (route) => route.method === method && route.path === originalUrl,
  );

  if (!routeMatch) {
    throw new NotFoundException(`Route not found: ${originalUrl}`);
  }

  next();
}
