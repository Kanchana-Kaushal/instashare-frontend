import axios, { isAxiosError } from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FormValues = {
    email: string;
};

function DisplayQRPage() {
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const url = location.state?.url;

    if (!url) {
        navigate("/home");
    }

    const displayURL = `${import.meta.env.VITE_FRONTEND_URL}/download/${
        url.split("/public/instaShare/")[1]
    }`;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        const toastId = toast.loading("Sending....");

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/files/send-email`,
                {
                    url: displayURL,
                    email: data.email,
                }
            );

            toast.success("Email sent succesfully", { id: toastId });
            setAlertOpen(true);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong", { id: toastId });
        }
    };

    const handleStopSharing = async () => {
        const toastId = toast.loading("Processing...");
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/files/stop-sharing`,
                {
                    url: url,
                }
            );

            toast.success("Success", { id: toastId });
            navigate("/home");
        } catch (err) {
            console.log(err);
            if (isAxiosError(err)) {
                if (err.response?.data.error === "Cannot find the file") {
                    toast.error("File already deleted", { id: toastId });
                    navigate("/home");
                }
            } else {
                toast.error("Something went wrong", { id: toastId });
            }
        }
    };

    return (
        <main className="w-9/10 mx-auto max-w-md">
            <img
                src="/logo.png"
                alt="insta share logo"
                className="w-45 mx-auto my-8"
            />

            <QRCodeCanvas
                value={displayURL}
                size={250}
                className="mx-auto mt-16"
                ref={canvasRef}
                level={"L"}
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 my-8 p-4"
            >
                <div>
                    <div className="bg-custom-accent/20 p-3 relative rounded-full">
                        <input
                            type="text"
                            placeholder="Send link to my email"
                            className="outline-none w-full pr-28 "
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />

                        <button
                            type="submit"
                            className="bg-custom-accent p-3 px-6 font-bold absolute rounded-full top-0 right-0 cursor-pointer"
                        >
                            Send
                        </button>
                    </div>

                    {errors.email && (
                        <p className="text-red-500 text-sm ml-2 my-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className="p-3 font-bold text-red-500 bg-red-500/20 w-full rounded-full cursor-pointer"
                    onClick={handleStopSharing}
                >
                    Stop Sharing
                </button>

                <button
                    type="button"
                    className="p-3 font-bold bg-custom-accent w-full rounded-full cursor-pointer"
                    onClick={() => {
                        navigate("/home");
                    }}
                >
                    Send Another File
                </button>
            </form>

            <AlertDialog open={alertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Notice</AlertDialogTitle>
                        <AlertDialogDescription>
                            We've successfully sent the URL to the email address
                            you entered. If you couldn't find the email in your
                            inbox. Please check in the{" "}
                            <span className="font-bold text-gray-900">
                                spam
                            </span>{" "}
                            folder. Thank You!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => {
                                setAlertOpen(false);
                            }}
                        >
                            Understood
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

export default DisplayQRPage;
