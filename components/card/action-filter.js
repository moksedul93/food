const CardActionFilter = props => {
    let position = props.position || "left";
    return (
        <div className="card-action-filter">
            <div className={"float-" + position + " mb-4"}>
                {props.children}
            </div>
        </div>
    )
}

export default CardActionFilter