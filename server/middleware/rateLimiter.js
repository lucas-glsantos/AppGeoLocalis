import rateLimit from 'express-rate-limit';

// 3 Tentativas de login por cliente a cada 1 hora
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 3, // 3 Tentativas permitidas
  message: { success: false, message: 'Muitas tentativas. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 100 Requisições por cliente a cada 15 minutos
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Min
  max: 100, // 100 requisições permitidas
  message: { success: false, message: 'Limite de requisições excedido. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 10 Uploads (imagem), por cliente a cada 1 hora
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 10, // 10 uploads permitidos
  message: { success: false, message: 'Limite de uploads excedido. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 10 Posts por cliente a cada 1 hora
export const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 10, // 10 posts permitidos
  message: { success: false, message: 'Limite de posts excedido. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 10 Ações de favoritar/desfavoritar por cliente a cada 15 minutos
export const favoriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Min
  max: 10, // 10 ações permitidos
  message: { success: false, message: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 5 Exclusões por cliente a cada 1 minuto
export const deleteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Min
  max: 5, // 5 exclusões permitidos
  message: { success: false, message: 'Limite de exclusões excedido. Tente novamente em 1 minuto.'},
  standardHeaders: true,
  legacyHeaders: false
});