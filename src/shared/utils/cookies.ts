type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

/**
 * Set a cookie with the given name and value
 */
export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const cookieOptions = {
    path: '/',
    ...options,
  };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.maxAge) {
    cookieString += `; Max-Age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.expires) {
    cookieString += `; Expires=${cookieOptions.expires.toUTCString()}`;
  }

  if (cookieOptions.path) {
    cookieString += `; Path=${cookieOptions.path}`;
  }

  if (cookieOptions.domain) {
    cookieString += `; Domain=${cookieOptions.domain}`;
  }

  if (cookieOptions.secure) {
    cookieString += '; Secure';
  }

  if (cookieOptions.sameSite) {
    cookieString += `; SameSite=${cookieOptions.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    if (cookie.startsWith(`${encodeURIComponent(name)}=`)) {
      return decodeURIComponent(
        cookie.substring(name.length + 1, cookie.length)
      );
    }
  }
  
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  // To delete a cookie, set its expiration date to a past date
  document.cookie = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
} 