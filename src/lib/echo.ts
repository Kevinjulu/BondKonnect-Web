import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { AuthService } from './auth-service'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<'pusher'>
  }
}

if (typeof window !== 'undefined') {
  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        Accept: 'application/json',
      }
    }
  })
}

export default (typeof window !== 'undefined' ? window.Echo : null)
