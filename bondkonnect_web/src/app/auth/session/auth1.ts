'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = 'tOKAyUkDXmi98SmGyaxvEP9M5v9jJpBIQic77KyufMw='
const key = new TextEncoder().encode(secretKey);

// type SessionPayload = {
//     userId: string | number;
//     expiresAt: Date;
//     role:number;
//   };


// export async function login(userId :any){
//     await createSession(userId,1);
// }

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1hr')
      .sign(key);
  }

//   export async function decrypt(session: string | undefined = '') {
//     try {
//       const { payload } = await jwtVerify(session, key, {
//         algorithms: ['HS256'],
//       });
//       return payload;
//     } catch (error) {
//       return null;
//     }
//   }

//   export async function createSession(userId: string,role:number) {
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
//     const session = await encrypt({ userId, expiresAt,role });
  
//     cookies().set('session', session, {
//       httpOnly: true,
//       secure: true,
//       expires: expiresAt,
//       sameSite: 'lax',
//       path: '/',
//     });
  
//     redirect('/');
//   }
//   export async function verifySession() {
//     const cookie = cookies().get('session')?.value;
//     const session = await decrypt(cookie);
   
  
//     if (!session?.userId) {
//       redirect('/logout');
//     }
//     console.log(session.userId);
  
//     // return { isAuth: true, userId: Number(session.userId) };
//     return { isAuth: true, userId: Number(session.userId), role: session.role };
//   }
  
//   export async function updateSession() {
//     const session = cookies().get('session')?.value;
//     const payload = await decrypt(session);
  
//     if (!session || !payload) {
//       return null;
//     }
  
//     const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     cookies().set('session', session, {
//       httpOnly: true,
//       secure: true,
//       expires: expires,
//       sameSite: 'lax',
//       path: '/',
//     });
//   }
  
//   export async function deleteSession() {
//     cookies().delete('session');
//     redirect('/login');
//   }

type SessionPayload = {
  userId: string | number;
  expiresAt: string;  // Convert to ISO string format
  role: number|string;
};

export async function createSession(userId: string, ) {
// export async function createSession(userId: string, role: any) {
  const role=2;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const session = await encrypt({ userId, expiresAt, role });

  (await cookies()).set('session', session, {
      httpOnly: true,
      secure: true,
      expires: new Date(expiresAt),
      sameSite: 'lax',
      path: '/',
  });

  redirect('/');
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  try {
      const { payload } = await jwtVerify(session, key, {
          algorithms: ['HS256'],
      });
      return payload as SessionPayload;
  } catch {
      return null;
  }
}

export async function verifySession() {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
      redirect('/logout');
  }

  console.log(session.role);  // Check if role is being logged correctly
  return { isAuth: true, userId: Number(session.userId), role: session.role };
}
