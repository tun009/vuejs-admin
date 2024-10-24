export interface FieldChangedModel {
  name: string
  field: string
  rate: number
}
export interface SOLModel {
  id: string
  stt: number
  name: string
  total: number
}
export const fieldChangedListColumnConfigs = [
  {
    field: 'field',
    label: 'Tên trường'
  },
  {
    field: 'rate',
    label: 'Tỉ lệ chỉnh sửa (%)',
    width: 200
  }
]
export const SOLListColumnConfigs = [
  {
    field: 'stt',
    label: '#',
    width: 70
  },
  {
    field: 'id',
    label: 'Mã SOL',
    width: 120
  },
  {
    field: 'name',
    label: 'Tên DVKD'
  },
  {
    field: 'total',
    label: 'Số lượng BCT đăng ký',
    width: 200
  }
]
export const chartOptionsSumary = {
  chart: {
    height: '300px',
    sparkline: {
      enabled: true
    },
    type: 'donut',
    width: '300px'
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.floor(val)}%`,
    style: {
      fontSize: '14px'
    }
  },
  fill: {
    colors: ['#ced4da', '#fab005', '#1971c2', '#0ca678', '#e03131', '#a61e4d']
  },
  labels: ['Đã tải lên', 'Đang xử lý', 'Đã kiểm tra', 'Đã phê duyệt', 'Từ chối', 'Lỗi'],
  legend: {
    formatter: (seriesName: string, opts: any) => {
      return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`
    },
    labels: {
      style: {
        colors: ['#fab005'],
        fontSize: '18px'
      }
    },
    offsetY: 20,
    show: true
  },
  plotOptions: {
    pie: {
      customScale: 0.6,
      donut: {
        background: 'transparent',
        size: '40%'
      }
    }
  }
}
export const optionsFieldChanged = [
  {
    label: 'Tất cả',
    value: '-1'
  },
  {
    label: 'Invoice',
    value: 'buyer_adress'
  },
  {
    label: 'Letter of credit',
    value: 'additional_conditions'
  },
  {
    label: 'Bill of landing',
    value: 'description'
  }
]
