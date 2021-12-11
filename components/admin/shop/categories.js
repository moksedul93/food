import {useMutation, useQuery} from "urql";
import Swal from "sweetalert2";
import {UrqlClient} from '../../urql/urql-provider';
import Cookies from 'js-cookie';
import {SwalLoading} from "../../common/swal-loading";

const Categories = props => {
    const deleteCategoryQuery = `
        mutation ($id: ID!) {
            deleteCategory(_id: $id) {
                msg
                error
            }
        }
    `;

    const [res, reExecuteQuery] = useQuery(
        {query: `
                query{
                    getAllCategories{
                        error
                        msg
                        data{
                            _id
                            name
                        }
                    }
                }   
        `,});

    const refresh = () => {
        reExecuteQuery({ requestPolicy: 'cache-and-network' });
    };

    if (res.fetching) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-spinner fa-spin text-primary" style={{fontSize: 70}}></i>
            <p className="text-primary" style={{margin:10}}>Loading...</p>
        </div>
    );
    if (res.error) return (
        <div className="wrapper urql-loading">
            <i className="fas fa-exclamation-triangle text-danger" style={{fontSize: 70}}></i>
            <p className="text-danger" style={{margin:10}}>Error in Loading Data</p>
        </div>
    );



    const handleDelete = id => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                SwalLoading();
                let client = UrqlClient(Cookies.get('fja_token'));
                client.mutation(deleteCategoryQuery , {
                    id: id
                }).toPromise().then(result => {
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
                            "Deleted !",
                            "Category Delete Successfully",
                            "success"
                        );
                        refresh();
                    }
                })
            }
        })

    }

    return (
        <>
            {res.data.getAllCategories.data.map((category, index) => (
                <tr>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td><a className="text-danger table-action c-pointer" onClick={e => handleDelete(category._id)}><i className="fa fa-trash-alt"></i> </a></td>
                </tr>
            ))}
        </>
    )
};

export default Categories


const getCategories = async props => {
    const query = `
        query{
            getAllCategories{
                error
                msg
                data{
                    _id
                    name
                }
            }   
        } 
    `
    const client = UrqlClient();
    let request = client.query(query).toPromise();
    let result = await request
    if(result.error || result.data.getAllCategories.error) {
        return [];
    }
    return result.data.getAllCategories.data

}

export {getCategories}
