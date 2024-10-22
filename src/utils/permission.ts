import { useUserStoreHook } from '@/store/modules/user'

/** Global permission judgment function, similar to the permission instruction v-permission */
export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error("Need roles! Like checkPermission(['admin','checker'])")
    return false
  }
}
