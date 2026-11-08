export const paths = {
  login: "/entrar",
  register: "/registro",
  home: "/membros",
  terms: "/termos",
  privacy: "/privacidade",
  forgotPassword: "/esqueci-senha",
  resetPassword: "/redefinir-senha",
  confirmEmail: "/confirmar-email",
  members: {
    list: "/membros",
    new: "/membros/novo",
    edit: (id: string) => `/membros/${id}/editar`,
  },
  families: {
    list: "/familias",
    new: "/familias/novo",
    edit: (id: string) => `/familias/${id}/editar`,
  },
  ministries: {
    list: "/ministerios",
    new: "/ministerios/novo",
    edit: (id: string) => `/ministerios/${id}/editar`,
    members: (id: string) => `/ministerios/${id}/membros`,
  },
  bible: "/biblia",
  hymns: {
    list: "/hinario",
    detail: (id: number) => `/hinario/${id}`,
  },
  canticles: {
    list: "/canticos",
    detail: (id: number) => `/canticos/${id}`,
  },
  finance: {
    dashboard: "/financeiro",
    transactions: "/financeiro/lancamentos",
    periods: "/financeiro/fechamento",
    settings: "/financeiro/configuracoes",
  },
};
