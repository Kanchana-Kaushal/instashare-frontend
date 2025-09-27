import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import MediaUploadPage from "./pages/MediaUpload";
import { Toaster } from "react-hot-toast";
import DisplayQRPage from "./pages/DisplayQR";
import DownloadPage from "./pages/DownloadPage";
import { useEffect } from "react";
import axios from "axios";

function App() {
    useEffect(() => {
        const wakeUpBackend = async () => {
            try {
                await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/files/wake-up`
                );
                console.log("Backend wake-up successful");
            } catch (err) {
                console.error("Wake-up failed:", err);
            }
        };

        wakeUpBackend();
    }, []);

    return (
        <>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/upload-media" element={<MediaUploadPage />} />
                <Route path="/display-qr" element={<DisplayQRPage />} />
                <Route path="/download/:filename" element={<DownloadPage />} />
                <Route path="/*" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
