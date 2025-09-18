// src/utils/inactivity.ts
import { Session } from '/@/utils/storage';
import { logout } from '/@/api/login';

export function useInactivityLogout() {
  // 类型定义
  type TimeoutID = ReturnType<typeof setTimeout>
  type EventHandler = () => void
  
  // 30分钟 = 30 * 60 * 1000 毫秒
  const timeoutDuration: number = 30 * 60 * 1000
  let timeoutId: TimeoutID | null = null
  
  // 用户活动检测事件列表
  const events: string[] = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  
  // 重置超时定时器
  const resetTimeout = (): void => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // 设置新的定时器
    timeoutId = setTimeout(async() => {
      // 执行登出操作
      // authStore.logout()
      // router.push('/login')
      await logout();
      Session.clear();
      window.location.reload();
    }, timeoutDuration)
    
    // 每次重置时更新时间戳
    localStorage.setItem('lastActivityTime', Date.now().toString())
  }
  
  // 事件处理函数数组
  const eventHandlers: EventHandler[] = []
  
  // 开始监听用户活动
  const startTracking = (): void => {
    events.forEach(event => {
      const handler: EventHandler = resetTimeout
      window.addEventListener(event, handler)
      eventHandlers.push(handler)
    })
    
    resetTimeout()
  }
  
  // 停止监听
  const stopTracking = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    
    events.forEach((event, index) => {
      const handler = eventHandlers[index]
      if (handler) {
        window.removeEventListener(event, handler)
      }
    })
    
    eventHandlers.length = 0
  }
  
  // 检查上次活动时间
  const checkLastActivity = async() => {
    const lastActivityTime: string | null = localStorage.getItem('lastActivityTime')
    if (lastActivityTime) {
      const currentTime: number = Date.now()
      const elapsedTime: number = currentTime - parseInt(lastActivityTime, 10)
      
      if (elapsedTime > timeoutDuration) {
        // authStore.logout()
        // router.push('/login')
        await logout();
        Session.clear();
        window.location.reload();
      }
    }
  }
  
  // 组件卸载时自动清理
  onUnmounted(() => {
    stopTracking()
  })
  
  return {
    startTracking,
    stopTracking,
    checkLastActivity
  }
}