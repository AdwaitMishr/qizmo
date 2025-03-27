import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://qizmo.vercel.app/"
})


export const { signIn, signOut, useSession } = createAuthClient()