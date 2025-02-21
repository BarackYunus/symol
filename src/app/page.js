"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MainPage = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Make image blink for 3 seconds, then redirect
        const interval = setInterval(() => {
            setVisible((prev) => !prev);
        }, 500); // Blink every 500ms

        setTimeout(() => {
            clearInterval(interval);
            router.push("/login"); // Redirect to login page
        }, 3000); // Stop after 3 seconds

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="main-container">
            <img
                src="/favicon.png"
                alt="Symbol"
                className={`blinking-image ${visible ? "visible" : "hidden"}`}
            />
        </div>
    );
};

export default MainPage;
