import {
  RoleEnum,
  UserStatusEnum,
  configRoleUserTableData,
  roleSelectOptions,
  roleTypeOptions,
  statusTypeOptions,
  userListColumnConfigs
} from '@/@types/pages/users'
import { describe, it, expect } from 'vitest'

describe('RoleEnum', () => {
  it('should have the correct value for ADMIN', () => {
    expect(RoleEnum.ADMIN).toBe('ADMIN')
  })

  it('should have the correct value for MAKER', () => {
    expect(RoleEnum.MAKER).toBe('MAKER')
  })

  it('should have the correct value for CHECKER', () => {
    expect(RoleEnum.CHECKER).toBe('CHECKER')
  })

  it('should have the correct value for VIEWER', () => {
    expect(RoleEnum.VIEWER).toBe('VIEWER')
  })

  it('should have all the correct role values', () => {
    const allRoles = Object.values(RoleEnum)
    expect(allRoles).toEqual(['ADMIN', 'MAKER', 'CHECKER', 'VIEWER'])
  })
})

describe('UserStatusEnum', () => {
  it('should have the correct value for ACTIVE', () => {
    expect(UserStatusEnum.ACTIVE).toBe('ACTIVE')
  })

  it('should have the correct value for INACTIVE', () => {
    expect(UserStatusEnum.INACTIVE).toBe('INACTIVE')
  })

  it('should have all the correct status values', () => {
    const allStatuses = Object.values(UserStatusEnum)
    expect(allStatuses).toEqual(['ACTIVE', 'INACTIVE'])
  })
})

describe('roleSelectOptions', () => {
  it('should have 4 role options', () => {
    expect(roleSelectOptions).toHaveLength(4)
  })

  it('should have the correct structure and values for each role option', () => {
    const expectedOptions = [
      {
        label: 'Admin',
        value: RoleEnum.ADMIN,
        description: 'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker'
      },
      {
        label: 'Checker',
        value: RoleEnum.CHECKER,
        description: 'Xác nhận và phê duyệt Bộ chứng từ'
      },
      {
        label: 'Maker',
        value: RoleEnum.MAKER,
        description: 'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công'
      },
      {
        label: 'Viewer',
        value: RoleEnum.VIEWER,
        description: 'Chỉ có quyền xem'
      }
    ]

    expect(roleSelectOptions).toEqual(expectedOptions)
  })

  it('should contain the correct labels for each role', () => {
    const labels = roleSelectOptions.map((option) => option.label)
    expect(labels).toEqual(['Admin', 'Checker', 'Maker', 'Viewer'])
  })

  it('should contain the correct values for each role', () => {
    const values = roleSelectOptions.map((option) => option.value)
    expect(values).toEqual([RoleEnum.ADMIN, RoleEnum.CHECKER, RoleEnum.MAKER, RoleEnum.VIEWER])
  })

  it('should contain the correct descriptions for each role', () => {
    const descriptions = roleSelectOptions.map((option) => option.description)
    expect(descriptions).toEqual([
      'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker',
      'Xác nhận và phê duyệt Bộ chứng từ',
      'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công',
      'Chỉ có quyền xem'
    ])
  })
})

describe('userListColumnConfigs', () => {
  it('should have 6 column configurations', () => {
    expect(userListColumnConfigs).toHaveLength(6)
  })

  it('should have the correct structure and values for each column', () => {
    const expectedConfigs = [
      {
        field: 'stt',
        label: 'STT',
        width: 80
      },
      {
        field: 'name',
        label: 'Họ tên'
      },
      {
        field: 'role',
        label: 'Vai trò'
      },
      {
        field: 'branch',
        label: 'SOL'
      },
      {
        field: 'status',
        label: 'Trạng thái'
      },
      {
        field: 'actions',
        label: 'Hành động'
      }
    ]

    expect(userListColumnConfigs).toEqual(expectedConfigs)
  })

  it('should contain the correct labels for each column', () => {
    const labels = userListColumnConfigs.map((config) => config.label)
    expect(labels).toEqual(['STT', 'Họ tên', 'Vai trò', 'SOL', 'Trạng thái', 'Hành động'])
  })

  it('should contain the correct field values for each column', () => {
    const fields = userListColumnConfigs.map((config) => config.field)
    expect(fields).toEqual(['stt', 'name', 'role', 'branch', 'status', 'actions'])
  })

  it('should correctly handle the optional width property for the first column', () => {
    const width = userListColumnConfigs[0].width
    expect(width).toBe(80)
  })
})

describe('roleTypeOptions', () => {
  it('should have 5 role options', () => {
    expect(roleTypeOptions).toHaveLength(5)
  })

  it('should have the correct structure and values for each role option', () => {
    const expectedOptions = [
      {
        label: 'Tất cả',
        value: -1
      },
      {
        label: 'Admin',
        value: RoleEnum.ADMIN
      },
      {
        label: 'Checker',
        value: RoleEnum.CHECKER
      },
      {
        label: 'Maker',
        value: RoleEnum.MAKER
      },
      {
        label: 'Viewer',
        value: RoleEnum.VIEWER
      }
    ]

    expect(roleTypeOptions).toEqual(expectedOptions)
  })

  it('should contain the correct labels for each role', () => {
    const labels = roleTypeOptions.map((option) => option.label)
    expect(labels).toEqual(['Tất cả', 'Admin', 'Checker', 'Maker', 'Viewer'])
  })

  it('should contain the correct values for each role', () => {
    const values = roleTypeOptions.map((option) => option.value)
    expect(values).toEqual([-1, RoleEnum.ADMIN, RoleEnum.CHECKER, RoleEnum.MAKER, RoleEnum.VIEWER])
  })
})

describe('statusTypeOptions', () => {
  it('should have 3 status options', () => {
    expect(statusTypeOptions).toHaveLength(3)
  })

  it('should have the correct structure and values for each status option', () => {
    const expectedOptions = [
      {
        label: 'Tất cả',
        value: -1
      },
      {
        label: 'Active',
        value: UserStatusEnum.ACTIVE
      },
      {
        label: 'Inactive',
        value: UserStatusEnum.INACTIVE
      }
    ]

    expect(statusTypeOptions).toEqual(expectedOptions)
  })

  it('should contain the correct labels for each status', () => {
    const labels = statusTypeOptions.map((option) => option.label)
    expect(labels).toEqual(['Tất cả', 'Active', 'Inactive'])
  })

  it('should contain the correct values for each status', () => {
    const values = statusTypeOptions.map((option) => option.value)
    expect(values).toEqual([-1, UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE])
  })
})

describe('configRoleUserTableData', () => {
  it('should have 42 items in the array', () => {
    expect(configRoleUserTableData).toHaveLength(42)
  })

  it('should have correct structure for each item', () => {
    const item = configRoleUserTableData[0]
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('title')
    expect(typeof item.name).toBe('string')
    expect(typeof item.title).toBe('number')
  })

  it('should have correct titles for the items', () => {
    const titles = configRoleUserTableData.map((item) => item.title)
    const title1Items = titles.filter((title) => title === 1)
    const title2Items = titles.filter((title) => title === 2)

    // Verify that there are 9 items with title = 1, and 33 items with title = 2
    expect(title1Items).toHaveLength(9)
    expect(title2Items).toHaveLength(33)
  })

  it('should contain the expected names for some specific entries', () => {
    const expectedNames = [
      'Tổng quan',
      'Quản lý chứng từ',
      'Xem danh sách các bộ chứng từ',
      'Thêm bộ chứng từ',
      'Cập nhật thông tin bộ chứng từ',
      'Xóa bộ chứng từ'
    ]

    const names = configRoleUserTableData.map((item) => item.name)

    // Check that the expected names are present
    expectedNames.forEach((name) => {
      expect(names).toContain(name)
    })
  })

  it('should ensure all titles correspond to valid values (1 or 2)', () => {
    const invalidTitles = configRoleUserTableData.filter((item) => ![1, 2].includes(item.title))
    expect(invalidTitles).toHaveLength(0) // No invalid titles should exist
  })
})
