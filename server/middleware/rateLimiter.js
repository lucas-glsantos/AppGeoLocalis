import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Limite de requisições excedido. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Limite de uploads excedido.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 posts por minutos
  message: { success: false, message: 'Limite de posts excedido. Tente novamente em 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const deleteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 deleções por minuto
  message: { success: false, message: 'Limite de exclusões excedido. Tente novamente.'},
  standardHeaders: true,
  legacyHeaders: false
});