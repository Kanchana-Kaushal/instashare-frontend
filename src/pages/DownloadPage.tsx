import { useNavigate, useParams } from "react-router";
import {
    Download,
    FileText,
    Image,
    Video,
    Music,
    Archive,
    File,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import axios from "axios";

function DownloadPage() {
    const supabaseTemplate =
        "https://iirjvushthsmvunzcfoh.supabase.co/storage/v1/object/public/instaShare/";

    const { filename } = useParams<{ filename: string }>();
    const supabaseURL = supabaseTemplate + filename;

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
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/files/clearup`,
                {
                    url: supabaseURL,
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <main className="w-9/10 max-w-2xl mx-auto text-center min-h-screen py-8">
            <div className="mb-12">
                <img
                    src="/logo.png"
                    alt="insta share logo"
                    className="w-45 mx-auto cursor-pointer"
                    onClick={() => navigate("/home")}
                />
            </div>

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
                        Your file is ready for download. Click the button below
                        to save it to your device.
                    </p>

                    {/* Download Button */}
                    <a
                        href={supabaseURL}
                        download={filename}
                        onClick={HandleDownload}
                        className="inline-flex items-center gap-3 bg-custom-accent text-white px-8 py-4 rounded-2xl font-bold hover:bg-custom-accent/90 transform  transition-all duration-200 "
                    >
                        <Download className="w-5 h-5" />
                        Download File
                    </a>
                </div>
            </div>

            <div className="absolute bottom-0 w-full left-0  flex items-center justify-center">
                <a
                    href="https://github.com/Kanchana-Kaushal"
                    className="flex items-center gap-2 my-4  font-bold"
                    target="_blank"
                >
                    <FaGithub /> GitHub
                </a>
            </div>
        </main>
    );
}

export default DownloadPage;
