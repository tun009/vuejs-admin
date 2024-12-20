import { defaultStatus } from '@/@types/pages/docs/documents'
import { GetDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import { formatDDMMYYYY, formatYYYYMMDD } from '@/constants/date'
import { addOneDayToDate, defaultDateRange, formatDateExactFormat } from '@/utils/date'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultFilter = {
  status: defaultStatus,
  beginDate: formatDateExactFormat(defaultDateRange()?.[0], formatDDMMYYYY, formatYYYYMMDD),
  endDate: addOneDayToDate(formatDateExactFormat(defaultDateRange()?.[1], formatDDMMYYYY, formatYYYYMMDD))
}

export const useDocumentStore = defineStore('document', () => {
  const filter = ref<GetDocumentRequestModel>({ ...defaultFilter } as GetDocumentRequestModel)
  const setFilter = (_filter: GetDocumentRequestModel) => {
    filter.value = _filter
  }
  const resetFilter = () => {
    filter.value = { ...defaultFilter } as GetDocumentRequestModel
  }
  return { filter, setFilter, resetFilter }
})
