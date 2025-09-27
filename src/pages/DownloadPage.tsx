import { useNavigate, useParams } from "react-router";
import {
    Download,
    FileText,
    Image,
    Video,
    Music,
    Archive,
    File,
    AlertCircle,
    Clock,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function DownloadPage() {
    const supabaseTemplate =
        "https://iirjvushthsmvunzcfoh.supabase.co/storage/v1/object/public/instaShare/";

    const { filename } = useParams<{ filename: string }>();
    const supabaseURL = supabaseTemplate + filename;

    const [isFileAvailable, setIsFileAvailable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/files/verify-file`,
                    {
                        url: supabaseURL,
                    }
                );

                setIsFileAvailable(true);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        })();
    }, []);

    const navigate = useNavigate();

    if (!filename) {
        navigate("/home");
        return;
    }

    // Get file extension and type
    const getFileExtension = (filename: string) => {
        return filename.split(".").pop()?.toLowerCase() || "";
    };

    const getFileIcon = (extension: string) => {
        const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
        const videoTypes = ["mp4", "avi", "mkv", "mov", "wmv"];
        const audioTypes = ["mp3", "wav", "flac", "aac"];
        const archiveTypes = ["zip", "rar", "7z", "tar", "gz"];
        const documentTypes = ["pdf", "doc", "docx", "txt", "rtf"];

        if (imageTypes.includes(extension)) return Image;
        if (videoTypes.includes(extension)) return Video;
        if (audioTypes.includes(extension)) return Music;
        if (archiveTypes.includes(extension)) return Archive;
        if (documentTypes.includes(extension)) return FileText;
        return File;
    };

    const extension = getFileExtension(filename);
    const FileIcon = getFileIcon(extension);

    const HandleDownload = async () => {
        const toastId = toast.loading("Downloading...");
        try {
            // Fetch the file as a blob
            const response = await fetch(supabaseURL);
            const blob = await response.blob();

            // Create a temporary link and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename; // filename for download
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // cleanup

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/files/clearup`,
                {
                    url: supabaseURL,
                }
            );

            toast.success("Download complete!", { id: toastId });
        } catch (err) {
            console.log(err);
            toast.error("Download failed", { id: toastId });
        }
    };

    return (
        <>
            <main className="w-9/10 max-w-2xl mx-auto text-center min-h-screen py-8">
                <div className="mb-12">
                    <img
                        src="/logo.png"
                        alt="insta share logo"
                        className="w-45 mx-auto cursor-pointer"
                        onClick={() => navigate("/home")}
                    />
                </div>

                {isLoading ? (
                    <>
                        <div className="h-20 border-custom-accent/20 border-6 rounded-full w-20 border-t-custom-accent animate-spin absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                    </>
                ) : isFileAvailable ? (
                    <>
                        {/* Main Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 max-w-md mx-auto">
                            {/* Header Section */}
                            <div className="bg-gradient-to-br from-custom-accent/10 to-custom-accent/20 px-8 py-12">
                                <div className="flex flex-col items-center">
                                    <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
                                        <FileIcon className="w-12 h-12 text-custom-accent" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2 break-all">
                                        {filename.replace(`.${extension}`, "")}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="bg-white/80 px-3 py-1 rounded-full font-medium">
                                            .{extension.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-8">
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Your file is ready for download. Click the
                                    button below to save it to your device.
                                </p>

                                {/* Download Button */}
                                <button
                                    onClick={HandleDownload}
                                    className="inline-flex items-center gap-3 bg-custom-accent text-white px-8 py-4 rounded-2xl font-bold hover:bg-custom-accent/90 transform  transition-all duration-200"
                                >
                                    <Download className="w-5 h-5" />
                                    Download File
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* File Not Found Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 max-w-md mx-auto">
                            {/* Header Section with Error State */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 px-8 py-12">
                                <div className="flex flex-col items-center">
                                    <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
                                        <AlertCircle className="w-12 h-12 text-red-500" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                        File Not Available
                                    </h1>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3 text-left">
                                        <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                File Expired
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                This file may have reached its
                                                expiration date
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-left">
                                        <AlertCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                Removed by Owner
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                The file owner may have deleted
                                                this content
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate("/home")}
                                        className="inline-flex items-center gap-3 bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-700 transform transition-all duration-200"
                                    >
                                        Return Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}

export default DownloadPage;
