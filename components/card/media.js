const Media = props => {
    let time = ''
    if(props.createdAt) {
        let date = new Date(+props.createdAt)
        let now = new Date()
        let seconds = Math.abs(now - date)/1000
        if(seconds >= 86400) {
            let days = Math.floor(seconds/86400)
            time = `${days} ${days > 1 ? 'days': 'day'} ago`
        } else if(seconds >= 3600) {
            let hours = Math.floor(seconds/3600)
            time = `${hours} ${hours > 1 ? 'hours': 'hour'} ago`
        } else if (seconds >= 60) {
            let minutes = Math.floor(seconds/60)
            time = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`
        } else {
            time = `${seconds} seconds ago`
        }
    }

    return (
        <li className="media" style={{padding: "5px 0", marginLeft: -10}} >
                <div className="media-body">
                    {props.children}
                    <h6 className="media-title">{props.name}</h6>
                    <div className="text-small text-muted">{props.phone} <div className="bullet"></div>
                        <span className="text-primary">{time}</span></div>
                </div>
        </li>
    )
}

export default Media