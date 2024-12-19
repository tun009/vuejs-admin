import { RoleEnum } from '@/@types/pages/users'
import { constantRoutes } from '@/router'
import { describe, it, expect } from 'vitest'

describe('constantRoutes', () => {
  it('should have a route for REDIRECT_PAGE', () => {
    const redirectRoute = constantRoutes.find((route) => route.path === '/redirect') // Assuming REDIRECT_PAGE is '/redirect'

    expect(redirectRoute).toBeDefined()
    expect(redirectRoute?.component).toBeDefined()
    expect(redirectRoute?.meta?.hidden).toBe(true)
    expect(redirectRoute?.children).toHaveLength(1)
    expect(redirectRoute?.children?.[0].path).toBe(':path(.*)')
  })

  it('should have a route for 403_PAGE', () => {
    const errorRoute = constantRoutes.find((route) => route.path === '/403') // Assuming _403_PAGE is '/403'

    expect(errorRoute).toBeDefined()
    expect(errorRoute?.component).toBeDefined()
    expect(errorRoute?.meta?.hidden).toBe(true)
  })

  it('should have a route for 404_PAGE', () => {
    const errorRoute = constantRoutes.find((route) => route.path === '/404') // Assuming _404_PAGE is '/404'

    expect(errorRoute).toBeDefined()
    expect(errorRoute?.component).toBeDefined()
    expect(errorRoute?.meta?.hidden).toBe(true)
    expect(errorRoute?.alias).toBe('/:pathMatch(.*)*')
  })

  it('should have a route for LOGIN_PAGE', () => {
    const loginRoute = constantRoutes.find((route) => route.path === '/login') // Assuming LOGIN_PAGE is '/login'

    expect(loginRoute).toBeDefined()
    expect(loginRoute?.component).toBeDefined()
    expect(loginRoute?.meta?.title).toBe('login')
    expect(loginRoute?.meta?.hidden).toBe(true)
  })

  it('should have a route for MAIN_PAGE and its children', () => {
    const mainPageRoute = constantRoutes.find((route) => route.path === '/') // Assuming MAIN_PAGE is '/main'

    expect(mainPageRoute)?.toBeDefined?.()
    expect(mainPageRoute?.redirect).toBe('/dashboard')
    expect(mainPageRoute?.children).toHaveLength(2) // Should contain 'Dashboard' and 'Profile' routes

    // Check the Dashboard route
    const dashboardRoute = mainPageRoute?.children?.find((route) => route.path === '/dashboard')
    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute?.meta?.title).toBe('dashboard')
    expect(dashboardRoute?.meta?.svgIcon).toBe('ic-home')
    expect(dashboardRoute?.meta?.affix).toBe(true)

    // Check the Profile route
    const profileRoute = mainPageRoute?.children?.find((route) => route.path === '/profile')
    expect(profileRoute).toBeDefined()
    expect(profileRoute?.meta?.title).toBe('profile')
    expect(profileRoute?.meta?.hidden).toBe(true)
    expect(profileRoute?.meta?.keepAlive).toBe(true)
  })

  it('should have a route for DOCS_PAGE and its children', () => {
    const docsPageRoute = constantRoutes.find((route) => route.path === '/docs') // Assuming DOCS_PAGE is '/docs'

    expect(docsPageRoute).toBeDefined()
    expect(docsPageRoute?.redirect).toBe('/docs/document')
    expect(docsPageRoute?.meta?.title).toBe('document')
    expect(docsPageRoute?.meta?.svgIcon).toBe('ic-model-group')
    expect(docsPageRoute?.meta?.alwaysShow).toBe(true)

    expect(docsPageRoute?.children).toHaveLength(3) // Should contain Document, Settings, and Document detail routes
  })

  it('should contain a route for USERS_PAGE with appropriate roles', () => {
    const usersRoute = constantRoutes.find((route) => route.path === '/users') // Assuming USERS_PAGE is '/users'

    expect(usersRoute).toBeDefined()
    expect(usersRoute?.meta?.roles).toContain(RoleEnum.ADMIN)
    expect(usersRoute?.meta?.roles).toContain(RoleEnum.CHECKER)
  })

  it('should have a route for EXTRACT_PAGE', () => {
    const extractRoute = constantRoutes.find((route) => route.path === '/extract') // Assuming EXTRACT_PAGE is '/extract'

    expect(extractRoute).toBeDefined()
    expect(extractRoute?.component).toBeDefined()
    expect(extractRoute?.meta?.hidden).toBe(true)
    expect(extractRoute?.meta?.keepAlive).toBe(false)
  })

  it('should have a route for COMPARE_DOCUMENT_DETAIL_PAGE', () => {
    const compareRoute = constantRoutes.find((route) => route.path === '/document-compare/:id') // Assuming COMPARE_DOCUMENT_DETAIL_PAGE is '/compare-document-detail'

    expect(compareRoute).toBeDefined()
    expect(compareRoute?.component).toBeDefined()
    expect(compareRoute?.meta?.hidden).toBe(true)
    expect(compareRoute?.meta?.title).toBe('documentCompare')
  })
})
