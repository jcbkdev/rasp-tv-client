import { useState } from "react";
import PlayerController from "../../components/playerController/PlayerController";
import VideoPlayer from "../../components/VideoPlayer";

export default function Player() {
    const [url, setUrl] = useState<string>("");

    return (
        <div className="player-container">
            <PlayerController setUrl={setUrl} />
            <VideoPlayer url={url} />
        </div>
    );
}
