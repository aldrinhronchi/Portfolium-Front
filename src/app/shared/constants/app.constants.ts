/**
 * Constantes da aplicação
 */
export class AppConstants {
  
  // Storage Keys
  static readonly STORAGE_KEYS = {
    TOKEN: 'portfolium_token',
    USER: 'portfolium_user',
    THEME: 'portfolium_theme',
    LANGUAGE: 'portfolium_language'
  } as const;

  // API Endpoints - Alinhados com o backend
  static readonly API_ENDPOINTS = {
    USERS: {
      BASE: 'Users',
      AUTHENTICATE: 'authenticate',
      CREATE: 'create',
      UPDATE: 'update',
      DELETE: 'delete',
      GET_BY_ID: 'get-by-id',
      GET_ALL: 'get-all',
      GET_STATS: 'get-stats'
    },
    PROJECTS: {
      BASE: 'Projects',
      CREATE: 'create',
      UPDATE: 'update',
      DELETE: 'delete',
      GET_BY_ID: 'get-by-id',
      GET_ALL: 'get-all',
      GET_FEATURED: 'get-featured',
      GET_BY_CATEGORY: 'get-by-category',
      GET_BY_USER: 'get-by-user',
      GET_CATEGORIES: 'get-categories',
      GET_TECHNOLOGIES: 'get-technologies',
      GET_STATS: 'get-stats',
      TOGGLE_STATUS: 'toggle-status'
    },
    CURRICULUM: {
      BASE: 'Curriculum',
      PERSONAL_INFO: {
        BASE: 'personal-info',
        CREATE: 'create',
        UPDATE: 'update',
        GET: 'get'
      },
      SKILLS: {
        BASE: 'skills',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
      },
      EXPERIENCES: {
        BASE: 'experiences',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
      },
      EDUCATION: {
        BASE: 'education',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
      },
      CERTIFICATIONS: {
        BASE: 'certifications',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
      },
      SERVICES: {
        BASE: 'services',
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
      }
    },
    CONTACT: {
      BASE: 'Contact',
      SEND: 'send',
      GET_INFO: 'info'
    }
  } as const;

  // Configurações de Paginação
  static readonly PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_PAGE: 1,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
  } as const;

  // Configurações de UI
  static readonly UI = {
    DEBOUNCE_TIME: 300,
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300,
    SCROLL_ANIMATION_DURATION: 500
  } as const;

  // Validações
  static readonly VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_SHORT_DESCRIPTION_LENGTH: 150
  } as const;

  // Regex Patterns
  static readonly PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-\(\)]+$/,
    URL: /^https?:\/\/.+/,
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  } as const;

  // Mensagens de Erro
  static readonly ERROR_MESSAGES = {
    REQUIRED: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_URL: 'URL inválida',
    MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
    MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
    WEAK_PASSWORD: 'Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Acesso não autorizado',
    FORBIDDEN: 'Você não tem permissão para esta ação',
    NOT_FOUND: 'Recurso não encontrado',
    SERVER_ERROR: 'Erro interno do servidor'
  } as const;

  // Mensagens de Sucesso
  static readonly SUCCESS_MESSAGES = {
    SAVE_SUCCESS: 'Salvo com sucesso!',
    DELETE_SUCCESS: 'Excluído com sucesso!',
    UPDATE_SUCCESS: 'Atualizado com sucesso!',
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    CONTACT_SENT: 'Mensagem enviada com sucesso!'
  } as const;

  // Configurações de Theme
  static readonly THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  } as const;

  // Idiomas suportados
  static readonly LANGUAGES = {
    PT_BR: 'pt-BR',
    EN_US: 'en-US',
    ES_ES: 'es-ES'
  } as const;

  // Roles de usuário
  static readonly USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator'
  } as const;

  // Status de projeto
  static readonly PROJECT_STATUS = {
    IN_DEVELOPMENT: 'Em Desenvolvimento',
    COMPLETED: 'Concluído',
    PAUSED: 'Pausado',
    ARCHIVED: 'Arquivado',
    PLANNED: 'Planejado'
  } as const;

  // Categorias de projeto
  static readonly PROJECT_CATEGORIES = {
    WEB_APPLICATION: 'Web Application',
    MOBILE_APP: 'Mobile App',
    DESKTOP_APP: 'Desktop App',
    API: 'API',
    LIBRARY: 'Library',
    GAME: 'Game',
    DATA_SCIENCE: 'Data Science',
    MACHINE_LEARNING: 'Machine Learning',
    OTHER: 'Other'
  } as const;

  // Configurações de Cache
  static readonly CACHE = {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
    LONG_TTL: 30 * 60 * 1000,   // 30 minutos
    SHORT_TTL: 1 * 60 * 1000    // 1 minuto
  } as const;

  // Configurações de Arquivo
  static readonly FILE = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } as const;
} 