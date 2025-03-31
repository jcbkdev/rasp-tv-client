import "./style.css";

type ChannelProps = {
    id: string;
    name: string;
    logo: string;
    selected?: boolean;
};

export default function Channel(props: ChannelProps) {
    return (
        <div
            id={props.id}
            className="channel"
            {...(props.selected ? { "data-selected": "" } : {})}
        >
            <div className="channel-logo">
                <img src={props.logo} alt="" />
            </div>
            <div className="channel-name">{props.name}</div>
        </div>
    );
}
