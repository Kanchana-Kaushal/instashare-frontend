import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { uploadMedia } from "@/utils/supabase";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type FormValues = {
    file: File | null;
    ttl: string;
    deleteAfterDownload: boolean;
};

function MediaUploadPage() {
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            file: null,
            ttl: "24h",
            deleteAfterDownload: false,
        },
    });

    const file = watch("file");

    const onSubmit = async (data: FormValues) => {
        const toastId = toast.loading("Uploading...");

        try {
            if (!data.file) {
                toast.error("No file selected", { id: toastId });
                return;
            }

            const url = await uploadMedia(data.file);

            if (!url) {
                toast.error("Upload failed", { id: toastId });
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/files/share`,
                {
                    url,
                    ttl: data.ttl,
                    instantDelete: data.deleteAfterDownload,
                }
            );

            toast.success("Success", { id: toastId });
            navigate("/display-qr", { state: { url: url } });
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong", { id: toastId });
        }
    };

    return (
        <main className="w-9/10 mx-auto text-gray-900 max-w-md">
            <img
                src="/logo.png"
                alt="insta share logo"
                className="w-45 mx-auto my-8 cursor-pointer"
                onClick={() => {
                    navigate("/home");
                }}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex relative text-xl items-center">
                        <IoIosArrowBack
                            className="absolute cursor-pointer hover:-translate-x-1 transition"
                            onClick={() => {
                                navigate("/home");
                            }}
                        />
                        <h1 className="w-full text-center">Upload</h1>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* File upload square */}
                        <Controller
                            name="file"
                            control={control}
                            rules={{ required: "File is required" }}
                            render={({ field }) => (
                                <label
                                    htmlFor="file"
                                    className="cursor-pointer bg-custom-accent/10 border-dashed border-2 border-custom-accent w-full min-h-40 rounded-2xl flex flex-col justify-center items-center mb-2"
                                >
                                    <FaPlus className="text-3xl text-custom-accent my-2" />
                                    <p className="text-sm font-semibold">
                                        Tap to upload a file
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        ZIP, JPG, MP4, GIF etc.
                                    </p>
                                    <input
                                        id="file"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile =
                                                e.target.files?.[0] || null;

                                            if (selectedFile) {
                                                const maxSize =
                                                    25 * 1024 * 1024; // 25MB in bytes
                                                if (
                                                    selectedFile.size > maxSize
                                                ) {
                                                    toast.error(
                                                        "File size must be less than 25MB"
                                                    );
                                                    return;
                                                }
                                            }

                                            field.onChange(selectedFile);
                                        }}
                                    />
                                </label>
                            )}
                        />

                        {errors.file && (
                            <p className="text-sm text-red-500 mb-2">
                                {errors.file.message}
                            </p>
                        )}

                        {file && (
                            <p className="text-sm text-gray-700 mb-2">
                                Selected file: {file.name}
                            </p>
                        )}

                        {/* TTL dropdown */}
                        <Controller
                            name="ttl"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <label
                                        htmlFor="ttl"
                                        className="block font-medium text-gray-700 mb-1 mt-6"
                                    >
                                        Time to live
                                    </label>
                                    <select
                                        id="ttl"
                                        {...field}
                                        className="border border-gray-300 w-full p-2 rounded-lg bg-white"
                                    >
                                        <option value="1h">1 hour</option>
                                        <option value="3h">3 hours</option>
                                        <option value="6h">6 hours</option>
                                        <option value="12h">12 hours</option>
                                        <option value="24h">24 hours</option>
                                        <option value="3d">3 days</option>
                                        <option value="7d">7 days</option>
                                    </select>
                                </>
                            )}
                        />

                        {/* Delete after download */}
                        <div className="flex items-center mt-6 justify-between">
                            <span className="text-gray-700 font-semibold ">
                                Delete after download ?
                            </span>

                            <Controller
                                name="deleteAfterDownload"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-16 w-full bg-custom-accent p-3 rounded-full font-bold hover:bg-custom-accent/80 cursor-pointer"
                        >
                            Share
                        </button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}

export default MediaUploadPage;
