import {useQuery} from "urql";
import Link from "next/link";
import Table from "../../table";
import Card from "../../card";
import {useState} from "react";
import InputSelect from "../../input/input-select";

const Foods = props => {

    const [restaurantID, setRestaurantID] = useState(props.restaurant_id || '');
    const [foodCategory, setFoodCategory] = useState('');

    let restaurantList = props.restaurants.map(restaurant => {
        return {
            text: restaurant.name,
            value: restaurant._id,
            key: restaurant._id
        }
    })

    restaurantList.unshift({
        text: "--All--",
        value: '',
        key: 'all'
    })

    const handleRestaurantID = id => {
        setRestaurantID(id);
        setFoodCategory('');
    }


    const categoryList = () => {
        if(restaurantID == '') {
            return []
        } else {
            for(let i=0; i<props.restaurants.length; i++) {
                if(restaurantID == props.restaurants[i]._id) {
                    return props.restaurants[i].food_categories.map(category => {
                        return {
                            text: category.name,
                            value: category._id,
                            key: category._id
                        }
                    })
                }
            }
        }
    }

    const getCategoryList = e => {
        let categories = categoryList() || [];
        categories.unshift({
            text: "--All--",
            value: '',
            key: 'all'
        })
        return categories;
    }

    let query = `
        query ($id: ID!){
            getAllFoodsByAdmin(owner_id: $id) {
                error
                msg
                data {
                    _id
                    name
                    food_categories{
                        _id
                        name
                        foods{
                            _id
                            name
                            price
                        }   
                    }
                }
            }
        }
    `


    const [res, reExecuteQuery] = useQuery({query, variables: {id: props.id}});

    const refresh = () => {
        reExecuteQuery({ requestPolicy: 'network-only' });
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

    let foods = []





    res.data.getAllFoodsByAdmin.data.forEach(restaurant => {
        if( restaurantID == '' || restaurantID == restaurant._id) {
            restaurant.food_categories.forEach(category => {
                if(foodCategory == '' || foodCategory == category._id) {
                    category.foods.forEach(food => {
                        foods.push({
                            _id: food._id,
                            name: food.name,
                            price: food.price,
                            category_id: category._id,
                            category_name: category.name,
                            restaurant_id: restaurant._id,
                            restaurant_name: restaurant.name,
                        })
                    })
                }
            })
        }

    });

    return (
        <>
            <Card>
                <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>All Foods</h3>
                    <div className="card-header-action" style={{width: '93%'}}>
                        <div className="row float-right mt-4 form food-filter" >
                            <div className="col-sm-6">
                                <InputSelect placeholder="Restaurants" value={restaurantID} setValue={handleRestaurantID} options={restaurantList}/>
                            </div>
                            <div className="col-sm-6">
                                <InputSelect placeholder="Categories" value={foodCategory} setValue={setFoodCategory} options={getCategoryList()}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <Table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Restaurant</th>
                            <th>Category</th>
                        </tr>
                        </thead>
                        <tbody>
                        {foods.map((food, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{food.name}</td>
                                <td>{food.price}</td>
                                <td>
                                    <Link href={"/admin/restaurant?id=" + food.restaurant_id}>
                                        <a className="c-pointer">
                                            {food.restaurant_name}
                                        </a>

                                    </Link>
                                </td>
                                <td>{food.category_name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

            </Card>

        </>
    )
}

export default Foods