export const DOSSIER_LIST = [
  {
    id: 16937,
    name: 'LC MT 700',
    status: 2
  },
  {
    id: 16942,
    name: 'Invoice',
    status: 2
  },
  {
    id: 16940,
    name: 'Invoice',
    status: 2
  },
  {
    id: 16943,
    name: 'Invoice',
    status: 2
  },
  {
    id: 16944,
    name: 'Drafts',
    status: 2
  }
]
export const DOSSIER_DOCUMENT = {
  id: 16942,
  name: 'Bảng kê chi phí khám chữa bệnh',
  file: 'https://idp-staging.viettelai.vn/bic-app/api/v1/files?src=2024-10-14/01/11167/18369.pdf',
  status: 2,
  result: {
    bboxes: [
      {
        id: 0,
        bbox: [
          [0.34384934838689846, 0.04693708894002503],
          [0.3983815530772359, 0.04861958605453809],
          [0.3566112749224425, 0.06604625152315528],
          [0.34328968703891116, 0.09436229856582687]
        ],
        page_id: 0,
        value: 'STT'
      },
      {
        id: 1,
        bbox: [
          [0.03657110289194698, 0.3131921855638166],
          [0.1736888635627047, 0.3131020131164324],
          [0.17369581997134279, 0.3248739892517619],
          [0.03657806263219842, 0.3249641806071871]
        ],
        page_id: 0,
        value: '3.'
      },
      {
        id: 2,
        bbox: [
          [0.03658062797446438, 0.3293012314126394],
          [0.314310318726119, 0.33035773710985905],
          [0.3125727624351801, 0.3458483009385649],
          [0.03484306168868552, 0.34479179524134523]
        ],
        page_id: 1,
        value: '3.'
      },
      {
        id: 3,
        bbox: [
          [0.1369534688224959, 0.2214286454400461],
          [0.35966175862274835, 0.2231409198141748],
          [0.35705009360500817, 0.23739293132720532],
          [0.1352155393908638, 0.23629963058225875]
        ],
        page_id: 2,
        value: '3.'
      },
      {
        id: 4,
        bbox: [
          [0.3305489306877081, 0.053327898446215605],
          [0.3414447405725068, 0.05331480558811225],
          [0.34146369398361837, 0.06053959254351161],
          [0.3305678471525991, 0.06055268540161496]
        ],
        page_id: 2,
        value: '3.'
      },
      {
        id: 5,
        bbox: [
          [0.03815813689252695, 0.0430551313851698],
          [0.1909964082542986, 0.04295463042040592],
          [0.1910040842914165, 0.05596575920171159],
          [0.03816582958771152, 0.056066264893485714]
        ],
        page_id: 4,
        value: '3.'
      },
      {
        id: 6,
        bbox: [
          [0.03658062797446438, 0.3293012314126394],
          [0.314310318726119, 0.33035773710985905],
          [0.3125727624351801, 0.3458483009385649],
          [0.03484306168868552, 0.34479179524134523]
        ],
        page_id: 5,
        value: '3.'
      },
      {
        id: 7,
        bbox: [
          [0.36152055898608076, 0.4127305797780166],
          [0.4331361995513783, 0.41268346093992025],
          [0.43314278281932317, 0.42383587729679756],
          [0.36152714225402566, 0.42388295831881195]
        ],
        page_id: 3,
        value: '3.'
      }
    ],
    data: [
      {
        confidence: 0.9980579029340557,
        available: 1,
        name: 'Tổng số ngày điều trị',
        modified: false,
        extractionValue: '7',
        validatedValue: '7',
        type: 'string',
        key: 'total_treatment_date',
        bboxIds: [0, 1]
      },
      {
        confidence: 0.4463261153222621,
        available: 1,
        name: 'Ngày biên lai',
        modified: false,
        extractionValue: '29/04/2023',
        validatedValue: '29/04/2023',
        type: 'string',
        key: 'delivery_date',
        bboxIds: [2]
      },
      {
        confidence: 0.9988141085697879,
        available: 1,
        name: 'Tên cơ sở y tế',
        modified: false,
        extractionValue: 'BỆNH VIỆN TRUNG ƯƠNG QUÂN ĐỘI 108',
        validatedValue: 'BỆNH VIỆN TRUNG ƯƠNG QUÂN ĐỘI 108',
        type: 'string',
        key: 'hltcare_facility_name',
        bboxIds: [3, 4]
      },
      {
        confidence: 0.999638009324887,
        available: 1,
        name: 'Ngày vào viện',
        modified: false,
        extractionValue: '18/04/2023',
        validatedValue: '18/04/2023',
        type: 'string',
        key: 'admiss_date',
        bboxIds: [5]
      },
      {
        confidence: 0.9997198545162959,
        available: 1,
        name: 'Ngày sinh bệnh nhân',
        modified: false,
        extractionValue: '25/04/1959',
        validatedValue: '25/04/1959',
        type: 'string',
        key: 'patient_dob',
        bboxIds: [6]
      },
      {
        confidence: 0.9390990247710367,
        available: 1,
        name: 'Họ tên bệnh nhân',
        modified: false,
        extractionValue: '',
        validatedValue: 'HOÀNG VĂN KHIÊM',
        type: 'string',
        key: 'patient_name',
        bboxIds: [7]
      }
    ]
  },
  dossierFileId: 18368,
  dossierFileName: 'test1_hstn-hscn.pdf'
}
