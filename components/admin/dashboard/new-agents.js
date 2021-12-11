import Card from "../../card";
import Link from "next/link";
import React from "react";
import {useSelector} from "react-redux";
import Media from "../../card/media";

const NewAgents = () => {
    let agents = useSelector(state => state.agents)
    return (
        <Card>
            <div className="card-header">
                <h4 className="d-inline">New Agent Request</h4>
                <div className="card-header-action">
                    <Link href="/admin/agent/requests">
                        <a className="btn btn-primary">View All</a>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <ul>
                    {agents.data.slice(0,5).map(agent => (
                        <Link href={"/admin/agent?id=" + agent._id}>
                            <a className="c-pointer">
                                <Media name={agent.first_name + " " + agent.last_name} phone={agent.mobile} createdAt={agent.createdAt}>
                                    {agent.status === 'pending' && (
                                        <div className="badge badge-pill badge-danger mt-3 float-right">Pending</div>
                                    )}
                                </Media>
                            </a>
                        </Link>
                    ))}
                </ul>
            </div>
        </Card>
    )
}

export default NewAgents