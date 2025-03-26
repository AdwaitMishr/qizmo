import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { cache } from "react";
import { headers } from "next/headers";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            isTeacher: {
                type: "boolean",
                required: false,
                defaultValue: false,
                
            }
        }
    }


})
export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});
