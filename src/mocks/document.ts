import { CompareHistoryModel } from '@/@types/pages/docs/documents'
import { RoleEnum } from '@/@types/pages/users'

export const compareHistories: CompareHistoryModel[] = [
  {
    date: '01/06/2024',
    timeList: [
      {
        time: '14:20',
        name: 'Dương',
        role: RoleEnum.MAKER,
        actionList: [
          {
            actionName: '1. Kiểm tra tên chứng từ',
            beforeUpdate: {
              contents: [
                'Discrepancy: presented Proforma Invoice instead of Commercial Invoice as LC required ( In case of presented Proforma Invoice)',
                'Discrepancy: presented Provision Invoice instead of Commercial Invoice as LC required ( In case of presented Provision Invoice)'
              ]
            },
            afterUpdate: {
              isComplied: true
            }
          }
        ]
      }
    ]
  },
  {
    date: '30/05/2024',
    timeList: [
      {
        time: '11:15',
        name: 'An',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            isConfirm: true,
            actionName: 'Xác nhận kết quả bộ chứng từ'
          }
        ]
      },
      {
        time: '11:10',
        name: 'Dương',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            actionName: '2.1 Kiểm tra ngày lập hóa đơn',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: [
                'Discrepancy: Invoice: issued after date of presentation',
                'Ref: UCP 600, Art.14i, : A document may be dated prior to the issuance date of the credit, but must not be dated later than its date of presentation'
              ]
            }
          }
        ]
      },
      {
        time: '11:06',
        name: 'An',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            actionName: '5.2 Kiểm tra thông tin mô tả hàng hóa',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: ['Discrepancy: Invoice ...', 'Ref: ...']
            }
          },
          {
            actionName: '7.3 Kiểm tra thông tin về đơn giá hàng hóa',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: ['Discrepancy: Invoice ...', 'Ref: ...']
            }
          }
        ]
      }
    ]
  },
  {
    date: '01/06/2024',
    timeList: [
      {
        time: '14:20',
        name: 'Dương',
        role: RoleEnum.MAKER,
        actionList: [
          {
            actionName: '1. Kiểm tra tên chứng từ',
            beforeUpdate: {
              contents: [
                'Discrepancy: presented Proforma Invoice instead of Commercial Invoice as LC required ( In case of presented Proforma Invoice)',
                'Discrepancy: presented Provision Invoice instead of Commercial Invoice as LC required ( In case of presented Provision Invoice)'
              ]
            },
            afterUpdate: {
              isComplied: true
            }
          }
        ]
      }
    ]
  },
  {
    date: '30/05/2024',
    timeList: [
      {
        time: '11:15',
        name: 'An',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            isConfirm: true,
            actionName: 'Xác nhận kết quả bộ chứng từ'
          }
        ]
      },
      {
        time: '11:10',
        name: 'Dương',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            actionName: '2.1 Kiểm tra ngày lập hóa đơn',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: [
                'Discrepancy: Invoice: issued after date of presentation',
                'Ref: UCP 600, Art.14i, : A document may be dated prior to the issuance date of the credit, but must not be dated later than its date of presentation'
              ]
            }
          }
        ]
      },
      {
        time: '11:06',
        name: 'An',
        role: RoleEnum.CHECKER,
        actionList: [
          {
            actionName: '5.2 Kiểm tra thông tin mô tả hàng hóa',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: ['Discrepancy: Invoice ...', 'Ref: ...']
            }
          },
          {
            actionName: '7.3 Kiểm tra thông tin về đơn giá hàng hóa',
            beforeUpdate: {
              isComplied: true
            },
            afterUpdate: {
              contents: ['Discrepancy: Invoice ...', 'Ref: ...']
            }
          }
        ]
      }
    ]
  }
]
