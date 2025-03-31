import { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

async function followRedirect(url: string): Promise<string> {
    try {
        // Use fetch to get the URL, allowing automatic redirect following
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow", // This follows redirects automatically
        });

        // Return the final URL after following redirects
        return response.url;
    } catch (error) {
        console.error("Error following redirect:", error);
        throw error; // Propagate error if something goes wrong
    }
}

export default function VideoPlayer(props: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player>(null);

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-matrix");
            videoElement.classList.add("rasptv-player");

            containerRef.current?.appendChild(videoElement);

            const player = (playerRef.current = videojs(
                videoElement,
                {
                    controls: false,
                    autoplay: true,
                },
                () => {
                    videojs.log("player is ready");
                    followRedirect(props.url).then((url) => {
                        player.autoplay(true);
                        player.src(url);
                    });
                }
            ));
        } else {
            const player = playerRef.current;

            followRedirect(props.url).then((url) => {
                player.autoplay(true);
                player.src(url);
            });
        }
    }, [containerRef, props.url]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.ready(() => {
                console.log("ready");
                playerRef.current?.play();
            });
        }
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <div ref={containerRef}></div>
        </div>
    );
}
