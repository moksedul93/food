import {SwalLoading} from "../../../components/common/swal-loading";
import OwnerLayout from "../../../components/layouts/owner-layout";
import {fetchOwnerRestaurants} from "../../../app/slices/restaurants";
import {deleteFood} from "../../../app/features/foods";
import {fetchFoods} from "../../../app/slices/foods";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import Card from "../../../components/card";
import {Select, Table} from 'antd'
import Swal from "sweetalert2";
import Link from "next/link";


const App = () => {
    const dispatch = useDispatch()
    const [restaurantID, setRestaurantID] = useState();
    const [foodCategory, setFoodCategory] = useState();

    useEffect(() => {
        dispatch(fetchOwnerRestaurants({status: 'approved'}))
        dispatch(fetchFoods({}))
    }, [])
    const restaurants = useSelector(state => state.restaurants)
    const allFoods = useSelector(state => state.foods)
    const [categories, setCategories] = useState([])
    const onRestaurantSelect = value => {
        setRestaurantID(value)
        restaurants.data.map(restaurant => {
            if (restaurant._id === value) {
                setCategories(restaurant.food_categories)
            }
        })
    }
    const onRestaurantClear = () => {
        setRestaurantID(undefined)
        setFoodCategory(undefined)
        setCategories([])
    }


    let foods = []

    allFoods.data.forEach(restaurant => {
        if (!restaurantID || restaurantID == restaurant._id) {
            restaurant.food_categories.forEach(category => {
                if (!foodCategory || foodCategory == category._id) {
                    category.foods.forEach((food, index) => {
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

    const handleDelete = async (id, category_id, restaurant_id) => {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        })
        if (result.isConfirmed) {
            SwalLoading()
            let {error, msg} = await deleteFood(id, category_id, restaurant_id)
            if (error) {
                await Swal.fire('Error', msg, 'error')
            } else {
                await Swal.fire('Success', 'Food Deleted', 'success')
                dispatch(fetchFoods({}))
            }
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Food Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Restaurant Name',
            dataIndex: 'restaurant_name',
            key: 'restaurant_name',
        },
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (food, _) => (
                <>
                    <Link
                        href={"/owner/food/edit?id=" + food._id + "&restaurant_id=" + food.restaurant_id + "&category_id=" + food.category_id}>
                        <a className="text-primary table-action c-pointer"><i className="fa fa-eye"/> </a>
                    </Link>
                    <a className="text-danger table-action ml-2 c-pointer"
                       onClick={e => handleDelete(food._id, food.category_id, food.restaurant_id)}>
                        <i className="fa fa-trash-alt"/>
                    </a>
                </>
            )
        }
    ];


    return (
        <OwnerLayout>
            <Card>
                <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>Foods</h3>
                    <div className="card-header-action" style={{width: '100%'}}>
                        <div className="row float-right mt-4 form food-filter">
                            <div className="col-sm-6">
                                <Select size="large" placeholder="Restaurant" style={{width: '100%'}}
                                        value={restaurantID} onSelect={onRestaurantSelect} onClear={onRestaurantClear}
                                        allowClear>
                                    {restaurants.data.map(restaurant => (
                                        <Select.Option key={restaurant._id}
                                                       value={restaurant._id}>{restaurant.name}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-sm-6">
                                <Select size="large" placeholder="Food Category" style={{width: '100%'}}
                                        value={foodCategory} onSelect={setFoodCategory}
                                        onClear={() => setFoodCategory(undefined)} allowClear>
                                    {categories.map(category => (
                                        <Select.Option key={category._id}
                                                       value={category._id}>{category.name}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <Table
                        dataSource={foods.map((food, index) => {
                            return {
                                key: index + 1,
                                ...food
                            }
                        })}
                        columns={columns}/>
                </div>
            </Card>
        </OwnerLayout>
    )

}

export default App