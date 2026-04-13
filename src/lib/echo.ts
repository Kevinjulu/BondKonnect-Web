import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getBaseUrl } from '@/lib/utils/url-resolver'
import { env } from '@/app/config/env'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<'pusher'>
  }
}

if (typeof window !== 'undefined') {
  const apiRoot = getBaseUrl() || env.NEXT_PUBLIC_API_URL || '';
  const authEndpoint = `${apiRoot.replace(/\/+$/, '')}/broadcasting/auth`;

  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint,
    auth: {
      headers: {
        Accept: 'application/json',
      }
    }
  })
}

export default (typeof window !== 'undefined' ? window.Echo : null)
