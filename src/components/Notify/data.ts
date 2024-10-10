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
    datetime: 'A year ago',
    description:
      'A free and open source basic solution for middle and backend management systems, based on mainstream technologies such as Vue3, TypeScript, Element Plus, Pinia and Vite',
    title: 'Mr.A is online'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    datetime: 'Two years ago',
    description:
      'A basic solution for middle and backend management systems, based on Vue3, TypeScript, Element Plus and Pinia',
    title: 'Mr.B is online'
  }
]

export const messageData: ListItem[] = [
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    datetime: '1998-06-05',
    description: 'If I never see you again, I wish you good morning, good afternoon and good night',
    title: 'From The Truman Show'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    datetime: '1995-02-04',
    description: 'If I had to add a time limit to this love, I hope it would be ten thousand years',
    title: 'From Westward Journey'
  },
  {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    datetime: '1988-04-16',
    description: 'If you have good intentions, you will definitely meet an angel on the way',
    title: 'From My Neighbor Totoro'
  }
]

export const todoData: ListItem[] = [
  {
    description: 'This guy is lazy and left nothing behind',
    extra: 'Not started',
    status: 'info',
    title: 'Task name'
  },
  {
    description: 'This guy is lazy and left nothing behind',
    extra: 'in progress',
    status: 'primary',
    title: 'Task name'
  },
  {
    description: 'This guy is lazy and left nothing behind',
    extra: 'Timed out',
    status: 'danger',
    title: 'Task name'
  }
]
