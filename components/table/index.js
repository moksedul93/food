import React from "react";

const Table = props => {
    return (
        <>
            <div className="table-responsive">
                <table className="table">
                    {props.children}
                </table>
            </div>
        </>

    )
}

export default Table