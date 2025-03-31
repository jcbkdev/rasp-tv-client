import "./style.css";
import { Channel } from "../playerController/PlayerController";

type props = {
    channel: Channel | undefined;
    visible: boolean;
};

export default function ChannelDetails(props: props) {
    return (
        <>
            {props.channel ? (
                <div
                    id="channel-details"
                    className={
                        "" + (props.visible ? "" : "channel-details-hidden")
                    }
                >
                    <div className="channel-info">
                        <div className="channel-logo">
                            <img src={props.channel.channel_logo} alt="" />
                        </div>
                        <div className="channel-desc">
                            <h1 className="channel-name">
                                {props.channel.channel_name}
                            </h1>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
