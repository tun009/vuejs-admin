/** Analog interface response data */
const SUCCESS_RESPONSE_DATA = {
  code: 0,
  data: {
    list: [] as number[]
  },
  message: 'Get success'
}

/** Simulation request interface successful */
export function getSuccessApi(list: number[]) {
  return new Promise<typeof SUCCESS_RESPONSE_DATA>((resolve) => {
    setTimeout(() => {
      resolve({ ...SUCCESS_RESPONSE_DATA, data: { list } })
    }, 1000)
  })
}

/** Simulation request interface failed */
export function getErrorApi() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('An error occurred'))
    }, 1000)
  })
}
