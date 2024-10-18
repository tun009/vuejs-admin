import { ColumnConfigModel } from '@/@types/common'
import { DocumentResultDataModel } from '@/@types/pages/docs/documents'

export const columnConfigsIV61 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'LC_Name of good',
    field: 'LCName'
  },
  {
    label: 'Invoice_Name of good',
    field: 'IVName'
  }
]

export const columnConfigsIV62 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Name',
    field: 'name'
  },
  {
    label: 'LC_Quantity',
    field: 'LCQuantity'
  },
  {
    label: 'Invoice_Quantity',
    field: 'IVQuantity',
    html: true
  }
]

export const columnConfigsIV63 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Name',
    field: 'name'
  },
  {
    label: 'LC_Unit price',
    field: 'LCPrice'
  },
  {
    label: 'Invoice_Unit price',
    field: 'IVPrice',
    html: true
  }
]

export const columnConfigsIV66 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Name',
    field: 'name'
  },
  {
    label: 'Invoice',
    field: 'invoice',
    html: true
  },
  {
    label: 'LC',
    field: 'lc'
  }
]

export const columnConfigsIV92 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Name',
    field: 'name'
  },
  {
    label: 'Net weight',
    field: 'weight'
  },
  {
    label: 'Quantity',
    field: 'quantity',
    html: true
  },
  {
    label: 'Unit price',
    field: 'price'
  },
  {
    label: 'Amount',
    field: 'amount',
    html: true
  }
]

export const columnConfigsIV10 = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Field name',
    field: 'fieldName',
    html: true
  },
  {
    label: 'Invoice',
    field: 'invoice'
  },
  {
    label: 'LC',
    field: 'lc'
  },
  {
    label: 'Bill of lading',
    field: 'billOfLanding',
    html: true
  },
  {
    label: 'Draft(s)',
    field: 'draft',
    html: true
  },
  {
    label: 'Giấy XTCT',
    field: 'xtct'
  }
]

export const columnConfigXtct52: ColumnConfigModel[] = [
  {
    label: 'Stt',
    field: 'stt',
    width: 80
  },
  {
    label: 'Tên chứng từ',
    field: 'documentName',
    html: true
  },
  {
    label: 'Phần giao của Khách hàng',
    field: '',
    columns: [
      {
        field: 'customerOriginal',
        label: 'Bản gốc'
      },
      {
        field: 'customerCopy',
        label: 'Bản sao'
      }
    ]
  },
  {
    label: 'Phần giao của Ngân hàng',
    field: '',
    columns: [
      {
        field: 'bankOriginal',
        label: 'Bản gốc'
      },
      {
        field: 'bankCopy',
        label: 'Bản sao'
      }
    ]
  }
]

export const dataTableIV61 = [
  {
    stt: 1,
    LCName: 'FROZEN ESO SURIMI',
    IVName: 'FROZEN ESO SURIMI'
  },
  {
    stt: 2,
    LCName: '-',
    IVName: 'FROZEN BREADED SHRIMP'
  }
]

export const dataTableIV62 = [
  {
    stt: 1,
    name: 'FROZEN ESO SURIMI',
    LCQuantity: '20,000',
    IVQuantity: '20,000'
  },
  {
    stt: 2,
    name: 'FROZEN BREADED SHRIMP',
    LCQuantity: '12,000',
    IVQuantity: '<span class="c-text-compare-error">1,200</span>'
  }
]

export const dataTableIV63 = [
  {
    stt: 1,
    name: 'Total amount (USD)',
    LCPrice: '1.75',
    IVPrice: '1.75'
  },
  {
    stt: 2,
    name: 'FROZEN BREADED SHRIMP',
    LCPrice: '7,7',
    IVPrice: '<span class="c-text-compare-error">7,17</span>'
  }
]

export const dataTableIV66 = [
  {
    stt: 1,
    name: 'Total amount (USD)',
    invoice: '<span class="c-text-compare-error">20,500</span>',
    lc: '20,000'
  },
  {
    stt: 2,
    name: 'Total quantity (MT)',
    invoice: '10,000',
    lc: '10,000'
  }
]

export const dataTableIV92 = [
  {
    stt: 1,
    name: 'FROZEN ESO SURIMI',
    weight: '20,000',
    quantity: '20,000',
    price: '1.75',
    amount: '35,000.00'
  },
  {
    stt: 2,
    name: 'FROZEN BREADED SHRIMP',
    weight: '12,000',
    quantity: '1,200',
    price: '7.7',
    amount: '9,240.00'
  },
  {
    name: 'Tổng cộng',
    weight: '32,000',
    quantity: '<span class="c-text-compare-error">21,200</span>',
    amount: '<span class="c-text-compare-error">44,240.00</span>'
  }
]

export const dataTableIV10 = [
  {
    stt: 1,
    fieldName: 'Invoice no <br /> <span class="c-text-des">Số hóa đơn</span>',
    invoice: 'NT-JG/231010',
    lc: '-',
    billOfLanding: '-',
    draft: 'NT-JG/231010',
    xtct: 'NT-JG/231010'
  },
  {
    stt: 2,
    fieldName: 'Invoice date <br /> <span class="c-text-des">Ngày hóa đơn</span>',
    invoice: '09-10-2023',
    lc: '-',
    billOfLanding: '-',
    draft: '09-10-2023',
    xtct: '09-10-2023'
  },
  {
    stt: 3,
    fieldName: 'Beneficiary name <br /> <span class="c-text-des">Tên người thụ hưởng</span>',
    invoice: 'NGUYEN TIEN SEAFOOD COMPANY LIMITED',
    lc: 'NGUYEN TIEN SEAFOOD COM',
    billOfLanding: 'NGUYEN TIEN SEAFOOD CO',
    draft: 'For NGUYEN TIEN SEAFOO',
    xtct: 'CÔNG TY TNHH THỦ'
  },
  {
    stt: 4,
    fieldName: 'Beneficiary address <br /> <span class="c-text-des">Địa chỉ người thụ hưởng</span>',
    invoice: '1007/34, 30/04 STREET, WARD 11, BARIA-VUNGTA',
    lc: '1007/34, 30/04 STREET, WARD</span>',
    billOfLanding: '<span class="c-text-compare-error">1007/84, 30/04 STREE</span>',
    draft: '-',
    xtct: '-'
  },
  {
    stt: 5,
    fieldName: 'Letter credit number <br /> <span class="c-text-des">Số thư tín dụng</span>',
    invoice: 'M04M12310NU00146',
    lc: 'M04M12310NU00146',
    billOfLanding: '-',
    draft: '<span class="c-text-compare-error">M04M23010NU00146</span>',
    xtct: 'M04M12310NU00146'
  },
  {
    stt: 6,
    fieldName: 'Port of loading <br /> <span class="c-text-des">Cảng giao hàng</span>',
    invoice: 'HOCHIMINH PORT, VIETNAM',
    lc: 'ANY PORT, VIETNAM',
    billOfLanding: 'HOCHIMINH PORT, VIETNA',
    draft: '-',
    xtct: '-'
  }
]

export const dataTableXtct52 = [
  {
    stt: 1,
    documentName: 'Drafts',
    customerOriginal: '2',
    customerCopy: '',
    bankOriginal: '',
    bankCopy: ''
  },
  {
    stt: 2,
    documentName: 'Invoice',
    customerOriginal: '3',
    customerCopy: '',
    bankOriginal: '',
    bankCopy: ''
  },
  {
    stt: 3,
    documentName: 'Bill of lading',
    customerOriginal: '3',
    customerCopy: '3',
    bankOriginal: '',
    bankCopy: ''
  },
  {
    stt: 4,
    documentName: 'Packing list',
    customerOriginal: '3',
    customerCopy: '',
    bankOriginal: '',
    bankCopy: ''
  }
]

export const documentInvoiceCompareResults = [
  {
    label: 'Số bản xuất trình',
    status: 'valid'
  },
  {
    label: 'Tên chứng từ',
    status: 'valid'
  },
  {
    label: 'Ngày lập hóa đơn',
    status: 'invalid'
  },
  {
    label: 'Người lập hóa đơn là bên thụ hưởng',
    status: 'invalid'
  },
  {
    label: 'Hóa đơn phát hành cho Applicant',
    status: 'valid'
  },
  {
    label: 'Chữ ký',
    status: 'valid'
  },
  {
    label: 'Thông tin hàng hóa',
    status: 'invalid'
  },
  {
    label: 'Thông tin yêu cầu từ 46A (LC)',
    status: 'valid'
  },
  {
    label: 'Thông tin yêu cầu từ 47A (LC)',
    status: 'inprogress'
  },
  {
    label: 'Nội dung thể hiện trên Invoice không mẫu thuẫn nhau',
    status: 'invalid'
  },
  {
    label: 'Sự đồng nhất thông tin Invoice với các chứng từ khác (1:1)',
    status: 'invalid'
  }
]

export const documentBolCompareResults = [
  {
    label: 'Tên chứng từ',
    status: 'valid'
  },
  {
    label: 'Số hiệu bản gốc phát hành (check ORIGINAL)',
    status: 'valid'
  },
  {
    label: 'Ngày giao hàng có trễ so với quy định',
    status: 'valid'
  },
  {
    label: 'Sự phù hợp cảng đi, cảng đến so với quy định LC',
    status: 'valid'
  }
]

export const documentDraftCompareResults = [
  {
    label: 'Ngày lập hối phiếu',
    status: 'valid'
  },
  {
    label: 'Hối phiếu được rút và ký bởi người thụ hưởng',
    status: 'valid'
  },
  {
    label: 'Bên trả tiền hối phiếu',
    status: 'valid'
  },
  {
    label: 'Ký hậu của hối phiếu',
    status: 'valid'
  },
  {
    label: 'Kỳ hạn hối phiếu (tenor); hình thức trả ngay/trả chậm với trị giá hối phiếu được LC quy định',
    status: 'valid'
  },
  {
    label: 'Thông tin trị giá (amount), đơn vị tiền tệ dựa trên LC quy định',
    status: 'valid'
  },
  {
    label: 'Sự đồng nhất thông tin giữa Hối phiếu với các chứng từ khác (1:1)',
    status: 'valid'
  },
  {
    label: 'Thông tin yêu cầu từ 47A (LC)',
    status: 'valid'
  }
]

export const documentXtctCompareResults = [
  {
    label: 'Thông tin đơn vị thụ hưởng',
    status: 'valid'
  },
  {
    label: 'Số thư tín dụng, ngày phát hành thư tín dụng',
    status: 'valid'
  },
  {
    label: 'Số hóa đơn, ngày hóa đơn',
    status: 'valid'
  },
  {
    label: 'Thông tin trị giá bộ chứng từ',
    status: 'valid'
  },
  {
    label: 'Danh sách và số lượng chứng từ xuất trình',
    status: 'valid'
  },
  {
    label: 'Ngày xuất trình chứng từ về địa điểm và thời gian hết hiệu lực của LC',
    status: 'valid'
  },
  {
    label: 'Sự đồng nhất thông tin giữa giấy XTCT với các chứng từ khác (1:1)',
    status: 'valid'
  }
]

export const documentCompareResults = [
  documentInvoiceCompareResults,
  documentBolCompareResults,
  documentDraftCompareResults,
  documentXtctCompareResults
]

export interface DocumentCompareResultModel {
  label: string
  childrens: {
    label?: string
    blocks: {
      label?: string
      value?: string
      type?: 'html' | 'img' | 'table' | 'list'
      src?: string
      columnConfigs?: any[]
      dataTable?: any[]
      list?: string[]
    }[]
    result: DocumentResultDataModel
  }[]
}

export const documentDraftCompareResultConfigs: DocumentCompareResultModel[] = [
  {
    label: 'Thông tin đơn vị thụ hưởng',
    childrens: [
      {
        blocks: [
          {
            label: '[Draft] Ngày lập hối phiếu',
            value: '23/01/2024'
          },
          {
            label: '[Giấy XTCT] Ngày xuất trình bộ chứng từ (Upload date)',
            value: '24/01/2024'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Hối phiếu được rút và ký bởi người thụ hưởng',
    childrens: [
      {
        blocks: [
          {
            label: '[Draft] Chữ ký người thụ hưởng',
            type: 'img',
            src: 'https://images.pexels.com/photos/28748483/pexels-photo-28748483/free-photo-of-autumn-leaves-with-book-and-camera-in-hanoi.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
          },
          {
            label: '[Draft] Tên bên thụ hưởng ký hối phiếu',
            value: 'NGOC HONG SEAFOOD CO.,LTD'
          },
          {
            label: '[LC] 59. Beneficiary name',
            value: 'NGOC HONG SEAFOOD CO.,LTD'
          },
          {
            label: '[Draft] Thông tin thay đổi người thụ hưởng (Formerly beneficiary)',
            value: 'Không có'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Bên trả tiền hối phiếu',
    childrens: [
      {
        blocks: [
          {
            label: '[Draft] Amount',
            value:
              'INDUSTRIAL BANK OF KOREA, VIETNAM HANOI BRANCH HANOI KEANGNAM HANOI LANDMARK, UNIT 1209 PHAMHUNG ST TULIEM HANOI VIET NAM'
          },
          {
            label: '[LC] 42D Drawee',
            value:
              'INDUSTRIAL BANK OF KOREA, VIETNAM HANOI BRANCH HANOI KEANGNAM HANOI LANDMARK, UNIT 1209 PHAMHUNG ST TULIEM HANOI VIET NAM'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Ký hậu hối phiếu',
    childrens: [
      {
        blocks: [
          {
            label: '[Draft] Endorsed',
            value: 'LC Xuất mặc định đã ký hậu'
          },
          {
            label: '[LC] 47A Additional condition có thông tin “Endorsed/Must be endorsed”',
            value: 'Không'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Kỳ hạn hối phiếu (tenor); hình thức trả ngay/trả chậm với trị giá hối phiếu được LC quy định',
    childrens: [
      {
        blocks: [
          {
            label: '[Draft] Loại hối phiếu',
            value: 'At sight'
          },
          {
            label: '[LC] 42C Draft',
            value: 'Sight'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Kỳ hạn hối phiếu (tenor); hình thức trả ngay/trả chậm với trị giá hối phiếu được LC quy định',
    childrens: [
      {
        label: 'Kiểm tra trị giá',
        blocks: [
          {
            label: '[Draft] Trị giá hối phiếu',
            value: '86,100 USD'
          },
          {
            label: '[LC] 43P Partial Shipments',
            value: 'NOT ALLOWED'
          },
          {
            label: '[LC] 42C Draft at/47A',
            value: 'SIGHT FOR 100PCT INVOICE VALUE'
          },
          {
            label: '[Invoice] Trị giá hóa đơn',
            value: '86,100 USD'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra đơn vị tiền tệ',
        blocks: [
          {
            label: '[Draft] Currency',
            value: 'USD'
          },
          {
            label: '[LC] 32B DC Amount',
            value: 'USD'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra số tiền bằng chữ và bằng số',
        blocks: [
          {
            label: '[Draft] Trị giá hối phiếu',
            value: '86,100 USD'
          },
          {
            label: '[Draft] Trị giá hối phiếu (bằng chữ)',
            value: 'Eighty six thousand one hundred only'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Sự đồng nhất thông tin Draft với các chứng từ khác (1:1)',
    childrens: [
      {
        blocks: [
          {
            columnConfigs: columnConfigsIV10,
            dataTable: dataTableIV10,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  },
  {
    label: 'Thông tin yêu cầu từ 47A (LC)',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 47A.Additional conditions',
            value:
              'DRAFT DRAWN UNDER THIS CREDIT MUST BE ENDORSED AND CONTAIN THE CLAUSE, DRAWN UNDER INDUSTRIAL BANK OF KOREA, SEOUL, LETTER OF CREDIT NO. M04LB2401NU00064 DATED 2024-01-22'
          },
          {
            label: '[Draft] Ngân hàng trả tiền hối phiếu',
            value: 'INDUSTRIAL BANK OF KOREA, SEOUL'
          },
          {
            label: '[Draft] Số thư tín dụng',
            value: 'M04LB2401NU00064'
          },
          {
            label: '[Draft] Ngày mở thư tín dụng',
            value: '22/01/2024'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  }
]

export const documentXtctCompareResultConfigs: DocumentCompareResultModel[] = [
  {
    label: 'Thông tin đơn vị thụ hưởng',
    childrens: [
      {
        blocks: [
          {
            label: '[Giấy XTCT] Customer name',
            value: 'Công Ty Cổ Phần Xuất Nhập Khẩu Thủy Sản Hợp Tấn'
          },
          {
            label: '[LC] 59. Beneficiary name',
            value: 'HOP TAN SEAFOOD CORP'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Số thư tín dụng, ngày phát hành thư tín dụng',
    childrens: [
      {
        label: 'Số thư tín dụng',
        blocks: [
          {
            label: '[Giấy XTCT] Số thư tín dụng',
            value: 'M10732401NU00192'
          },
          {
            label: '[LC] 20. Doc credit no',
            value: 'M10732401NU00192'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Ngày phát hành thư tín dụng',
        blocks: [
          {
            label: '[Giấy XTCT] Ngày phát hành thư tín dụng',
            value: '10/01/2024'
          },
          {
            label: '[LC] 31 Date of Issue',
            value: '10/01/2024'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Số hóa đơn, ngày hóa đơn',
    childrens: [
      {
        label: 'Số hóa đơn',
        blocks: [
          {
            label: '[Giấy XTCT] Hóa đơn số',
            value: 'HT-BLM 01/24'
          },
          {
            label: '[Invoice] Invoice no',
            value: 'HT-BLM 01/24'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Ngày hóa đơn',
        blocks: [
          {
            label: '[Giấy XTCT] Ngày hóa đơn',
            value: '02/01/2024'
          },
          {
            label: '[Invoice] Invoice date',
            value: '02/01/2024'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Thông tin trị giá bộ chứng từ',
    childrens: [
      {
        blocks: [
          {
            label: '[Giấy XTCT] Trị giá bộ chứng từ',
            value: '73,257.91 USD'
          },
          {
            label: '[Draft] Amount',
            value: '73,257.91 USD'
          },
          {
            label: '[Invoice] Total amount',
            value: '73,257.91 USD'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Danh sách và số lượng xuất trình',
    childrens: [
      {
        label: 'Kiểm tra loại chứng từ xuất trình',
        ////////// đang ở đây
        blocks: [
          {
            label: '[LC] Danh sách chứng từ cần xuất trình (46A+47A)',
            type: 'list',
            list: ['Commercial invoice', 'Ocean bills of lading', 'Packing list']
          },
          {
            label: '[Giấy XTCT] Danh sách chứng từ xuất trình',
            type: 'list',
            list: ['Drafts', 'Invoice', 'Build of landing', 'Packing list']
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra số lượng chứng từ theo loại',
        blocks: [
          {
            label: '[Giấy XTCT] Danh sách chứng từ xuất trình',
            columnConfigs: columnConfigXtct52,
            dataTable: dataTableXtct52,
            type: 'table'
          },
          {
            label: '[LC] 46A Documents Required',
            type: 'list',
            list: [
              'SIGNED COMMERCIAL INVOICE IN 3 FOLD',
              'FULL SET OF CLEAN ON BOARD OCEAN BILLS OF LADING MADE OUT TO THE ORDER OF KOOKMON BANK, MARKED ‘FREIGHT PREPAID’ AND NOTIFY THE APPLICANT',
              'SIGNED PACKING LIST IN 3 FOLD'
            ]
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Ngày xuất trình chứng từ về địa điểm và thời gian hết hiệu lực của LC',
    childrens: [
      {
        label: 'Kiểm tra ngày hết hạn xuất trình',
        blocks: [
          {
            label: '[Giấy XTCT] Ngày xuất trình bộ chứng từ (Upload date)',
            value: '12/01/2024'
          },
          {
            label: '[LC] 31D Date and Place of Expiry (Ngày hết hiệu lực)',
            value: '10/02/2024'
          },
          {
            label: '[LC] 31D Date and Place of Expiry (Địa điểm hết hiệu lực)',
            value: 'AT NEGOTIATING BANK'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra thời gian xuất trình',
        blocks: [
          {
            label: '[Giấy XTCT] Ngày xuất trình bộ chứng từ (Upload date)',
            value: '12/01/2024'
          },
          {
            label: '[LC] 48 Period for Presentation in Days',
            value: "21/DAYS AFTER 'THE DATE OF SHIPMENT'"
          },
          {
            label: '[LC] LC quy định: “Stale documents acceptable”',
            value: 'Không'
          },
          {
            label: '[Bill of lading] Ngày giao hàng (onboard date)',
            value: '04/01/2024'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Sự đồng nhất thông tin Draft với các chứng từ khác (1:1)',
    childrens: [
      {
        blocks: [
          {
            columnConfigs: columnConfigsIV10,
            dataTable: dataTableIV10,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  }
]

export const documentBolCompareResultConfigs: DocumentCompareResultModel[] = [
  {
    label: 'Thông tin đơn vị thụ hưởng',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 46A Document requirement',
            value:
              'FULL SET OF CLEAN ON BOARD OCEAN BILLS OF LADING MADE OUT TO THE ORDER OF INDUSTRIAL BANK OF KOREA MARKED FREIGHT PREPAID AND NOTIFY APPLICANT'
          },
          {
            label: '[B/L] Doc name',
            value: 'NEGOTIABLE FIATA MULTIMODAL TRANSPORT BILL OF LADING'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  },
  {
    label: 'Số hiệu bản gốc phát hành (check ORIGINAL)',
    childrens: [
      {
        blocks: [
          {
            label: '[B/L] Thông tin bản gốc được ghi trên Bill',
            value: 'First Original'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  },
  {
    label: 'Ngày giao hàng có trễ so với quy định',
    childrens: [
      {
        blocks: [
          {
            label: '[B/L] Ngày giao hàng (onboard date)',
            value: '23/01/2024'
          },
          {
            label: '[LC] 44C Latest Date of Shipment',
            value: '14/02/2024'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  },
  {
    label: 'Sự phù hợp cảng đi, cảng đến so với quy định LC',
    childrens: [
      {
        label: 'Kiểm tra cảng giao hàng (Port of loading)',
        blocks: [
          {
            label: '[B/L] Port of loading',
            value: 'CATLAI HOCHIMINH PORT VIETNAM'
          },
          {
            label: '[LC] 44E Port of Loading ',
            value: 'VIETNAM PORT'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra cảng nhận hàng (Port of discharge)',
        blocks: [
          {
            label: '[B/L] Port of discharge',
            value: 'INCHEON PORT,SOUTH KOREA'
          },
          {
            label: '[LC] 44F Port of Discharge',
            value: 'INCHEON PORT, SOUTH KOREA'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  }
]
export const documentInvoiceCompareResultConfigs: DocumentCompareResultModel[] = [
  {
    label: 'Số bản xuất trình',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 46A.Document required',
            value: 'SIGN COMMERCIAL INVOICE IN 3 FOLD'
          },
          {
            label: '[Giấy XTCT] Invoice fold',
            value: 'Original: 3'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Tên chứng từ',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 46A.Document required',
            value: 'SIGN COMMERCIAL INVOICE IN 3 FOLD'
          },
          {
            label: '[Invoice] Invoice name',
            value: 'Commercial Invoice'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Ngày lập hóa đơn',
    childrens: [
      {
        blocks: [
          {
            label: '[Giấy xuất trình chứng từ] Upload date',
            value: '10-09-2024'
          },
          {
            label: '[Invoice] Invoice date',
            value: '11-09-2024'
          },
          {
            label: '[LC] Yêu cầu cụ thể ngày lập hóa đơn',
            value: 'Không'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Invoice: issued after date of presentation',
          reasonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          rule: 'Không có gì đâu mà xem'
        }
      }
    ]
  },
  {
    label: 'Người lập hóa đơn là bên thụ hưởng',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 59. Beneficiary',
            value:
              'Name: NGUYEN TIEN SEAFOOD COMPANY LIMITED <br /> Address: 1007/34, 30/4 STREET, WARD 11, BARIA-VUNGTAU PROVINCE, VIETNAM <br /> Telephone: 0643-512259 <br /> Fax: 0643-515569',
            type: 'html'
          },
          {
            label: '[Invoice] Beneficiary',
            value:
              'Name: NGUYEN TIEN SEAFOOD COMPANY LIMITED <br /> Address: 1007/34, 30/4 STREET, WARD 11, BARIA-VUNGTAU PROVINCE, VIETNAM <br /> Telephone: 0643-512259 <br /> Fax: -',
            type: 'html'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Invoice: issued after date of presentation',
          reasonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          rule: 'Ref: UCP 600, Art.14i, : A document may'
        }
      }
    ]
  },
  {
    label: 'Hóa đơn phát hành cho Applicant',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 50 Applicant',
            value:
              'Name: JISOO GLOCAL CO., LTD <br /> Address: <span class="c-text-compare-error">132-1601, 111, BUNPO-RO, NAM-GU BUAN, REPUBLIC OF KOREA</span> <br /> Telephone: 82-51-261-2612 <br /> Fax: 82-51-261-4415',
            type: 'html'
          },
          {
            label: '[Invoice] Applicant',
            value:
              'Name: JISOO GLOCAL CO., LTD <br /> Address: <span class="c-text-compare-error">132-1601, 111, BUNPO-RO, NAM-GU BUSAN, REPUBLIC OF KOREA</span> <br /> Telephone: 82-51-261-2612 <br /> Fax: 82-51-261-4415',
            type: 'html'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Invoice: issued after date of presentation',
          reasonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          rule: 'Ref: UCP 600. Art.18a. : A Commercial invoice must be made out in the name of the applicant'
        }
      }
    ]
  },
  {
    label: 'Chữ ký',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 46A.Document required',
            value: 'SIGN COMMERCIAL INVOICE IN 3 FOLD'
          },
          {
            label: '[Invoice] Seller sign',
            src: 'https://images.pexels.com/photos/28748483/pexels-photo-28748483/free-photo-of-autumn-leaves-with-book-and-camera-in-hanoi.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            type: 'img'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Thông tin hàng hóa',
    childrens: [
      {
        label: 'Thông tin về Tên hàng hóa, loại hàng hóa',
        blocks: [
          {
            label: '[LC] 43P Partial shipments',
            value: 'NOT ALLOWED'
          },
          {
            label: '',
            columnConfigs: columnConfigsIV61,
            dataTable: dataTableIV61,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Invoice: name of goods differ from LC stated'
        }
      },
      {
        label: 'Thông tin về số lượng hàng hóa',
        blocks: [
          {
            label: '[LC] 43P Partial shipments',
            value: 'NOT ALLOWED'
          },
          {
            label: '[LC] 39A Percent amount tolerance',
            value: '-'
          },
          {
            label: '[LC] LC yêu cầu: “the quantity is not to be exceeded or reduced”',
            value: 'Không'
          },
          {
            label: '[LC] Dạng hàng hóa ',
            value: 'Đơn vị trọng lượng: KG'
          },
          {
            label: '',
            columnConfigs: columnConfigsIV62,
            dataTable: dataTableIV62,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Short shipment - FROZEN BREADED SHRIMP',
          reasonVi: 'giao hàng ít hơn - Frozen breaded shrimp'
        }
      },
      {
        label: 'Thông tin về đơn giá hàng hóa',
        blocks: [
          {
            label: '',
            columnConfigs: columnConfigsIV63,
            dataTable: dataTableIV63,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          reasonEn: 'Invoice: Unit price differ from LC stated (7,17 instead of 7,7)',
          reasonVi: 'Đơn giá trên hóa đơn khác với LC (7,17 thay vì 7,7)'
        }
      },
      {
        label: 'Thông tin về điều kiện thương mại',
        blocks: [
          {
            label: '[LC] Trade terms',
            value: 'CFR BUSAN PORT, SOUTH KOREA'
          },
          {
            label: '[Invoice] Trade terms',
            value: 'CFR BUSAN PORT, SOUTH KOREA'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Đơn vị tiền tệ',
        blocks: [
          {
            label: '[Invoice] Invoice currency',
            value: 'USD'
          },
          {
            label: '[LC] 32B Currency',
            value: 'USD'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Điều kiện discount, deduction',
        blocks: [],
        result: {
          status: 'na'
        }
      },
      {
        label: 'Thông tin về trị giá',
        blocks: [
          {
            label: '[LC] 43P Partial shipments',
            value: 'NOT ALLOWED'
          },
          {
            label: '[LC] 39A Percent amount tolerance',
            value: '-'
          },
          {
            label: '[LC] Dạng hàng hóa ',
            value: 'Đơn vị trọng lượng: KG'
          },
          {
            label: '',
            columnConfigs: columnConfigsIV66,
            dataTable: dataTableIV66,
            type: 'table'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Thông tin yêu cầu từ 46A (LC)',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 46A.Document required',
            value: 'SIGNED COMMERCIAL INVOICE MUST INDICATING CREDIT NO.'
          },
          {
            label: '[Invoice] Letter credit number',
            value: 'M04M12310NU00146'
          }
        ],
        result: {
          status: 'valid'
        }
      }
    ]
  },
  {
    label: 'Thông tin yêu cầu từ 47A (LC)',
    childrens: [
      {
        blocks: [
          {
            label: '[LC] 47A.Additional conditions',
            value: '-'
          },
          {
            label: '[LC] 47A.Additional conditions',
            value: 'All document must be in English'
          }
        ],
        result: {
          status: 'na'
        }
      }
    ]
  },
  {
    label: 'Nội dung thể hiện trên Invoice không mẫu thuẫn nhau',
    childrens: [
      {
        label: 'Kiểm tra thông tin trị giá',
        blocks: [
          {
            label: '[Invoice] Total amount',
            value: '35,000.00'
          },
          {
            label: '[Invoice] Amount in words',
            value: 'US DOLLARS THIRTY FIVE THOUSAND ONLY'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Kiểm tra thông tin Mô tả hàng hóa',
        blocks: [
          {
            label: '[Invoice] Description of goods',
            columnConfigs: columnConfigsIV92,
            dataTable: dataTableIV92,
            type: 'table'
          },
          {
            label: '[Invoice] Total netweight (giá trị trích xuất trong chứng từ)',
            value: '32,000 (KG)'
          },
          {
            label: '[Invoice] Total quantity (giá trị trích xuất trong chứng từ)',
            value: '32,000 (KG)'
          },
          {
            label: '[Invoice] Total amount (giá trị trích xuất trong chứng từ)',
            value: '61,950.00'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  },
  {
    label: 'Sự đồng nhất thông tin Invoice với các chứng từ khác (1:1)',
    childrens: [
      {
        blocks: [
          {
            columnConfigs: columnConfigsIV10,
            dataTable: dataTableIV10,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid'
        }
      }
    ]
  }
]

export const documentCompareResultConfigs = [
  documentInvoiceCompareResultConfigs,
  documentBolCompareResultConfigs,
  documentDraftCompareResultConfigs,
  documentXtctCompareResultConfigs
]
