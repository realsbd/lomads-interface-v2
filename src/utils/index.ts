export function beautifyHexToken(token: string): string {
    return (token?.slice(0, 6) + "..." + token?.slice(-4))
  }