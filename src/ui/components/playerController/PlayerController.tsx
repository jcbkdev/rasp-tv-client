import "./style.css";
import { useEffect, useState } from "react";
import Channel from "../channel/Channel";
import ChannelDetails from "../channelDetails/ChannelDetails";

export interface Channel {
    channel_id: number;
    channel_name: string;
    channel_url: string;
    channel_logo: string;
    channel_category_id?: number;
}

export default function PlayerController(props: {
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [playingChannel, setPlayingChannel] = useState<Channel | undefined>(
        undefined
    );
    const [channels, setChannels] = useState<Channel[]>([]);
    const [pointer, setPointer] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const [detailsTimeout, setDetailsTimeout] = useState<NodeJS.Timeout>();

    const selectChannel = () => {
        console.log("changing channel to:", channels[pointer]);
        setPlayingChannel(channels[pointer]);
        props.setUrl(channels[pointer].channel_url);
        setDetailsVisible(true);
        if (detailsTimeout) {
            clearTimeout(detailsTimeout);
        }
        const interval = setTimeout(() => setDetailsVisible(false), 5000);
        setDetailsTimeout(interval);
        setVisible(false);
    };

    const highlightChannel = (pointer: number) => {
        const prevChannel = document.querySelector("[data-selected]") as
            | HTMLDivElement
            | undefined;
        console.log(
            "selecting:",
            "channel-" + channels[pointer].channel_id.toString()
        );
        const currentChannel = document.getElementById(
            "channel-" + channels[pointer].channel_id.toString()
        );

        if (prevChannel) {
            console.log("prev channel", prevChannel);
            prevChannel.removeAttribute("data-selected");
        }
        if (currentChannel) {
            currentChannel.setAttribute("data-selected", "");
            currentChannel.scrollIntoView({
                behavior: "smooth",
                inline: "center",
            });
        }
    };

    const nextChannel = () => {
        const nextPointer = Math.min(
            pointer + 1,
            Math.max(channels.length - 1, 0)
        );
        console.log("setting pointer to:", nextPointer);
        console.log("channels.length", channels.length);
        setPointer(nextPointer);
        highlightChannel(nextPointer);
    };

    const prevChannel = () => {
        const nextPointer = Math.max(0, pointer - 1);
        console.log("setting pointer to:", nextPointer);
        console.log("channels.length", channels.length);
        setPointer(nextPointer);
        highlightChannel(nextPointer);
    };

    const loadChannels = async () => {
        console.log("fetching...");
        const response = await fetch("http://localhost:3000/api/channels");
        if (!response.ok) throw new Error("");

        const responseJson = (await response.json()) as Channel[];
        console.log("setting data...", responseJson);
        setChannels(responseJson);
        setPlayingChannel(responseJson[0]);
        props.setUrl(responseJson[0].channel_url);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        console.log(e);
        switch (e.key) {
            case "l":
                if (!visible) break;
                nextChannel();
                break;
            case "h":
                if (!visible) break;
                prevChannel();
                break;
            case "Enter":
                if (!visible) break;
                selectChannel();
                break;
            case "k":
                setVisible(true);
                break;
            case "j":
                setDetailsVisible((v) => !v);
                setVisible(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        loadChannels();
    }, []);

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [channels, pointer, visible]);

    useEffect(() => {
        console.log("currently selected channel:", channels[pointer]);
    }, [channels, pointer]);

    return (
        <div>
            {channels ? (
                <ChannelDetails
                    channel={playingChannel}
                    visible={detailsVisible}
                />
            ) : (
                <></>
            )}
            <div id="channels-list" className={"" + (visible ? "" : "hidden")}>
                {channels.map((channel, index) => (
                    <Channel
                        key={channel.channel_id}
                        id={"channel-" + channel.channel_id.toString()}
                        name={channel.channel_name}
                        selected={index === 0}
                        logo={channel.channel_logo}
                    />
                ))}
            </div>
        </div>
    );
}
