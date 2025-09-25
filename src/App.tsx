import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import MediaUploadPage from "./pages/MediaUpload";
import { Toaster } from "react-hot-toast";
import DisplayQRPage from "./pages/DisplayQR";

function App() {
    return (
        <>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/upload-media" element={<MediaUploadPage />} />
                <Route path="/display-qr" element={<DisplayQRPage />} />
                <Route path="/*" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
