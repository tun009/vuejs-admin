<script lang="ts" setup>
import {
  columnConfigs52,
  columnConfigs6,
  columnConfigs73,
  columnConfigs74,
  columnConfigs76,
  columnConfigs77,
  dataTable52,
  dataTable6,
  dataTable73,
  dataTable74,
  dataTable76,
  dataTable77
} from '@/mocks/document'

const documentCompareResultConfigs = [
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
    label: 'Ngày lập hóa đơn, người lập Invoice',
    childrens: [
      {
        label: 'Người lập hóa đơn',
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
          resonEn: 'Invoice: issued after date of presentation',
          resonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          tooltip: 'Meo meo meo'
        }
      },
      {
        label: 'Người lập Invoice',
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
          resonEn: 'Invoice: issued after date of presentation',
          resonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          tooltip: 'Ref: UCP 600, Art.14i, : A document may'
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
          resonEn: 'Invoice: issued after date of presentation',
          resonVi: 'ngày lập Hóa đơn sau ngày xuất trình',
          tooltip: 'Ref: UCP 600. Art.18a. : A Commercial invoice must be made out in the name of the applicant'
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
            src: 'meo',
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
            columnConfigs: columnConfigs52,
            tableData: dataTable52,
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
            columnConfigs: columnConfigs6,
            tableData: dataTable6,
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
    label: 'Thông tin hàng hóa',
    childrens: [
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
            columnConfigs: columnConfigs73,
            dataTable: dataTable73,
            type: 'table'
          }
        ],
        result: {
          status: 'valid'
        }
      },
      {
        label: 'Thông tin về đơn giá hàng hóa',
        blocks: [
          {
            label: '',
            columnConfigs: columnConfigs74,
            dataTable: dataTable74,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          resonEn: 'Invoice: Unit price differ from LC stated (7,17 instead of 7,7)',
          resonVi: 'Đơn giá trên hóa đơn khác với LC (7,17 thay vì 7,7)',
          tooltip: 'Ref: UCP 600. Art.18a. : A Comme'
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
            columnConfigs: columnConfigs76,
            dataTable: dataTable76,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          resonEn: 'Short shipment - FROZEN BREADED SHRIMP',
          resonVi: 'giao hàng ít hơn - Frozen breaded shrimp',
          tooltip: 'Ref: UCP 600. Art.18a. : A Comme'
        }
      },
      {
        label: 'Thông tin về Tên hàng hóa',
        blocks: [
          {
            label: '[LC] 43P Partial shipments',
            value: 'NOT ALLOWED'
          },
          {
            label: '',
            columnConfigs: columnConfigs77,
            dataTable: dataTable77,
            type: 'table'
          }
        ],
        result: {
          status: 'invalid',
          resonEn: 'Invoice: name of goods differ from LC stated',
          resonVi: 'Meo meo meo',
          tooltip: 'Ref: UCP 600. Art.18a. : A Comme'
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
  }
]
</script>

<template>
  <div class="flex flex-col gap-6 pl-2 mt-3">
    <div v-for="(compareResult, index) in documentCompareResultConfigs" :key="index">
      <span class="c-text-title-primary">{{ index + 1 }}. {{ compareResult?.label }}</span>
      <el-divider />
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex flex-row gap-2 items-center">
          <span class="c-text-des">Kết quả</span>
          <SvgIcon class="w-4 h-4 cursor-pointer" name="edit-pen" />
        </div>
        <div class="flex flex-row">
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Anh</span>
            <span class="c-text-success">Complied</span>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Việt</span>
            <span class="c-text-success">Hợp lệ</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span class="c-text-title-primary">0. Số bản xuất trình</span>
      <el-divider />
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex flex-row gap-2 items-center">
          <span class="c-text-des">Kết quả</span>
          <SvgIcon class="w-4 h-4 cursor-pointer" name="edit-pen" />
        </div>
        <div class="flex flex-row">
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Anh</span>
            <span class="c-text-success">Complied</span>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Việt</span>
            <span class="c-text-success">Hợp lệ</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span class="c-text-title-primary">1. Tên chứng từ</span>
      <el-divider />
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[Invoice] Invoice name</span>
          <p class="text-base text-[#495057]">Commercial Invoice</p>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex flex-row gap-2 items-center">
          <span class="c-text-des">Kết quả</span>
          <SvgIcon class="w-4 h-4 cursor-pointer" name="edit-pen" />
        </div>
        <div class="flex flex-row">
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Anh</span>
            <span class="c-text-success">Complied</span>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Việt</span>
            <span class="c-text-success">Hợp lệ</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span class="c-text-title-primary">2. Ngày lập hóa đơn, người lập Invoice</span>
      <el-divider />
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[LC] 46A.Document required</span>
          <p class="text-base text-[#495057]">SIGN COMMERCIAL INVOICE IN 3 FOLD</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">[Invoice] Invoice name</span>
          <p class="text-base text-[#495057]">Commercial Invoice</p>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex flex-row gap-2 items-center">
          <span class="c-text-des">Kết quả</span>
          <SvgIcon class="w-4 h-4 cursor-pointer" name="edit-pen" />
        </div>
        <div class="flex flex-row">
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Anh</span>
            <span class="c-text-success">Complied</span>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <span class="c-text-des">Việt</span>
            <span class="c-text-success">Hợp lệ</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
