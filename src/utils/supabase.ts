import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_KEY!;

declare global {
    var __supabase: SupabaseClient | undefined;
}

let supabase: SupabaseClient;

if (!globalThis.__supabase) {
    globalThis.__supabase = createClient(url, key);
}

supabase = globalThis.__supabase;

export const uploadMedia = async (file: File) => {
    try {
        if (!file) throw new Error("No file selected");

        const timeStamp = Date.now();
        const newNameRaw = `${timeStamp}_${file.name}`;
        const newName = newNameRaw.replace(/\s+/g, "_");

        const { error: uploadError } = await supabase.storage
            .from("instaShare")
            .upload(newName, file, {
                upsert: false,
                cacheControl: "3600",
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("instaShare")
            .getPublicUrl(newName);

        return data.publicUrl;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};
