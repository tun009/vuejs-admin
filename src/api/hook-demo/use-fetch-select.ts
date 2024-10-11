/** Analog interface response data */
const SELECT_RESPONSE_DATA = {
  code: 0,
  data: [
    {
      label: 'Apple',
      value: 1
    },
    {
      label: 'Banana',
      value: 2
    },
    {
      disabled: true,
      label: 'Tangerine',
      value: 3
    }
  ],
  message: 'Obtain select data successfully'
}

/** Analog interface */
export function getSelectDataApi() {
  return new Promise<typeof SELECT_RESPONSE_DATA>((resolve, reject) => {
    // Analog interface response time 2s
    setTimeout(() => {
      // Simulation interface call successful
      if (Math.random() < 0.8) {
        resolve(SELECT_RESPONSE_DATA)
      } else {
        // Simulation interface call error
        reject(new Error('An error occurred in the interface'))
      }
    }, 2000)
  })
}
