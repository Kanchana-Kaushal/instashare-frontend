import { FaPlus } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="flex flex-col justify-between  items-center text-gray-900">
            <img
                src="/logo.png"
                alt="insta share logo"
                className="w-45 mx-auto my-8 cursor-pointer"
                onClick={() => {
                    navigate("/home");
                }}
            />

            <div className="mt-16">
                <h1 className="text-3xl font-bold text-gray-700 ">
                    Share Something!
                </h1>

                <div
                    className="mx-auto my-16 w-7/10 bg-custom-accent aspect-square rounded-full relative flex items-center justify-center hover:scale-105 transition cursor-pointer"
                    onClick={() => {
                        navigate("/upload-media");
                    }}
                >
                    <div className="mx-auto -z-10 w-8/10 left-1/2 -translate-x-1/2 bg-custom-accent aspect-square rounded-full top-1/2 -translate-y-1/2 animate-ping absolute [animation-duration:3s]" />
                    <FaPlus className="text-6xl text-gray-800" />
                </div>
            </div>

            <div className="absolute bottom-0">
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

export default Home;
