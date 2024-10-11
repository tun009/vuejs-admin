export interface fieldChangedModel {
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
    width: 150
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
  labels: ['Đã tải lên', 'Đang xử lý', 'Đã kiểm tra', 'Đã phê duyệt', 'Từ chối', 'Lỗi'],
  chart: {
    type: 'donut',
    width: '300px',
    height: '300px',
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    pie: {
      customScale: 0.6,
      donut: {
        size: '40%',
        background: 'transparent'
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px'
    },
    formatter: (val: number) => `${Math.floor(val)}%`
  },
  fill: {
    colors: ['#ced4da', '#fab005', '#1971c2', '#0ca678', '#e03131', '#a61e4d']
  },
  legend: {
    show: true,
    offsetY: 20,
    formatter: (seriesName: string, opts: any) => {
      return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`
    },
    labels: {
      style: {
        fontSize: '18px',
        colors: ['#fab005']
      }
    }
  }
}
export const optionsFieldChanged = [
  {
    value: '-1',
    label: 'Tất cả'
  },
  {
    value: 'buyer_adress',
    label: 'Invoice'
  },
  {
    value: 'additional_conditions',
    label: 'Letter of credit'
  },
  {
    value: 'description',
    label: 'Bill of landing'
  }
]
