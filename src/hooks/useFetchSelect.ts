import { ref, onMounted } from 'vue'

type OptionValue = string | number

/** Select the required data format */
interface SelectOption {
  value: OptionValue
  label: string
  disabled?: boolean
}

/** Interface response format */
type ApiData = ApiResponseData<SelectOption[]>

/** Input parameter format, temporarily only need to pass api function */
interface FetchSelectProps {
  api: () => Promise<ApiData>
}

export function useFetchSelect(props: FetchSelectProps) {
  const { api } = props

  const loading = ref<boolean>(false)
  const options = ref<SelectOption[]>([])
  const value = ref<OptionValue>('')

  /** Call the interface to obtain data */
  const loadData = () => {
    loading.value = true
    options.value = []
    api()
      .then((res) => {
        options.value = res.data
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    loadData()
  })

  return {
    loading,
    options,
    value
  }
}
