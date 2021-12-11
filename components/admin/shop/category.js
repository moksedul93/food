import {useMutation} from "urql";
import Swal from "sweetalert2";

const Category = props => {

    const deleteCategoryQuery = `
        mutation ($id: ID!) {
            deleteCategory(_id: $id) {
                msg
                error
            }
        }
    `;

    const [ deleteCategoryResult, deleteCategory ] = useMutation(deleteCategoryQuery);
    const handleDelete = id => {
        const variables = { id: id };
        deleteCategory(variables).then(result => {
            if( result.error ) {
                Swal.fire(
                    "Error",
                    "Request Failed",
                    "error"
                )
            } else if(result.data.deleteCategory.error){
                Swal.fire(
                    "Error",
                    result.data.deleteCategory.msg,
                    "error"
                )
            } else {
                Swal.fire(
                    "Success",
                    "Category Added Successfully",
                    "success"
                )
            }
        });
    };


    return (
        <tr>
            <td>{props.index }</td>
            <td>{props.name}</td>
            <td><a className="text-danger table-action c-pointer" onClick={e => handleDelete(props._id)}><i className="fa fa-trash-alt"></i> </a></td>
        </tr>
    )
}

export default Category