import { authService, memberService, familyService, ministryService, financeService } from "./services";

/**
 * Fachada única consumida pelos hooks de API. Hooks nunca chamam `services`
 * diretamente — sempre via este objeto, para manter um único ponto de composição.
 */
export const endpoints = {
  login: authService.login,
  register: authService.register,
  logout: authService.logout,
  getSession: authService.getSession,
  forgotPassword: authService.forgotPassword,
  resetPassword: authService.resetPassword,
  verifyEmail: authService.verifyEmail,
  resendVerification: authService.resendVerification,

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

  getFinanceMe: financeService.me,
  listFinanceUsers: financeService.listUsers,
  assignFinanceRole: financeService.assignRole,
  revokeFinanceRole: financeService.revokeRole,
  listFunds: financeService.listFunds,
  createFund: financeService.createFund,
  updateFund: financeService.updateFund,
  listFinanceCategories: financeService.listCategories,
  createFinanceCategory: financeService.createCategory,
  updateFinanceCategory: financeService.updateCategory,
  listCashAccounts: financeService.listAccounts,
  createCashAccount: financeService.createAccount,
  updateCashAccount: financeService.updateAccount,
  listFinanceTransactions: financeService.listTransactions,
  createFinanceTransaction: financeService.createTransaction,
  createFinanceTransfer: financeService.createTransfer,
  reverseFinanceTransaction: financeService.reverseTransaction,
  getFinanceSummary: financeService.getSummary,
  listFinancePeriods: financeService.listPeriods,
  closeFinancePeriod: financeService.closePeriod,
  reopenFinancePeriod: financeService.reopenPeriod,
};
