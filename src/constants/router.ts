export const REDIRECT_PAGE = '/redirect'
export const _403_PAGE = '/403'
export const _404_PAGE = '/404'
export const LOGIN_PAGE = '/login'
export const DASHBOARD_PAGE = '/dashboard'
export const MAIN_PAGE = '/'
export const DOCS_PAGE = '/docs'
export const DOCUMENT_PAGE = '/document'
export const REPORTS_PAGE = '/reports'
export const SETTINGS_PAGE = '/settings'
export const USERS_PAGE = '/users'
export const RULES_PAGE = '/rules'
export const UCP_ISBP_PAGE = '/ucp-isbp'
export const INVALID_CATEGORY_PAGE = '/invalid-category'
export const PROFILE_PAGE = '/profile'
// export const EXTRACT_PAGE = '/extract'
export const EXTRACT_PAGE = (batchId: string | number = ':batchId', dossierDocId: string | number = ':dossierDocId') =>
  `/extract/${batchId}/${dossierDocId}`

export const DOCUMENT_DETAIL_PAGE = (id: string | number = ':id') => `/docs/document/${id}`
export const COMPARE_DOCUMENT_DETAIL_PAGE = (id: string | number = ':id') => `/document-compare/${id}`
