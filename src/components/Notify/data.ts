export interface ListItem {
  avatar?: string
  title: string
  datetime?: string
  description?: string
  status?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  extra?: string
}

export const notifyData: ListItem[] = [
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: 'Mr.A is online',
    datetime: 'A year ago',
    description:
      'A free and open source basic solution for middle and backend management systems, based on mainstream technologies such as Vue3, TypeScript, Element Plus, Pinia and Vite'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: 'Mr.B is online',
    datetime: 'Two years ago',
    description:
      'A basic solution for middle and backend management systems, based on Vue3, TypeScript, Element Plus and Pinia'
  }
]

export const messageData: ListItem[] = [
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From The Truman Show',
    description: 'If I never see you again, I wish you good morning, good afternoon and good night',
    datetime: '1998-06-05'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From Westward Journey',
    description: 'If I had to add a time limit to this love, I hope it would be ten thousand years',
    datetime: '1995-02-04'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'From My Neighbor Totoro',
    description: 'If you have good intentions, you will definitely meet an angel on the way',
    datetime: '1988-04-16'
  }
]

export const todoData: ListItem[] = [
  {
    title: 'Task name',
    description: 'This guy is lazy and left nothing behind',
    extra: 'Not started',
    status: 'info'
  },
  {
    title: 'Task name',
    description: 'This guy is lazy and left nothing behind',
    extra: 'in progress',
    status: 'primary'
  },
  {
    title: 'Task name',
    description: 'This guy is lazy and left nothing behind',
    extra: 'Timed out',
    status: 'danger'
  }
]
