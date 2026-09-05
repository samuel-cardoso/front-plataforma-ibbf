import { authService, memberService, familyService, ministryService } from "./services";

/**
 * Fachada única consumida pelos hooks de API. Hooks nunca chamam `services`
 * diretamente — sempre via este objeto, para manter um único ponto de composição.
 */
export const endpoints = {
  login: authService.login,
  register: authService.register,
  logout: authService.logout,
  getSession: authService.getSession,

  listMembers: memberService.list,
  getMember: memberService.get,
  createMember: memberService.create,
  updateMember: memberService.update,
  deleteMember: memberService.remove,

  listFamilies: familyService.list,
  getFamily: familyService.get,
  createFamily: familyService.create,
  updateFamily: familyService.update,
  deleteFamily: familyService.remove,

  listMinistries: ministryService.list,
  getMinistry: ministryService.get,
  createMinistry: ministryService.create,
  updateMinistry: ministryService.update,
  deleteMinistry: ministryService.remove,

  listMinistryParticipations: ministryService.listParticipations,
  addMinistryParticipation: ministryService.addParticipation,
  updateMinistryParticipationRole: ministryService.updateParticipationRole,
  removeMinistryParticipation: ministryService.removeParticipation,
};
