import { BrowserRouter, Routes, Route } from "react-router";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<AllImages />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/images/:imageId" element={<ImageDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;