export const paths = {
  login: "/entrar",
  register: "/registro",
  home: "/membros",
  terms: "/termos",
  privacy: "/privacidade",
  forgotPassword: "/esqueci-senha",
  resetPassword: "/redefinir-senha",
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
};
