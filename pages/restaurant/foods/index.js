import RestaurantLayout from "../../../components/layouts/restaurant-layout";
import Card from "../../../components/card";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchRestaurantFoods} from "../../../app/slices/foods";
import {Select, Switch, Table} from "antd";
import {updateFoodStatus} from "../../../app/features/foods";
import Swal from "sweetalert2";

const Foods = () => {
    const dispatch = useDispatch()
    const foodCategories = useSelector(state => state.foods.data.food_categories)
    const [foodCategory, setFoodCategory] = useState()
    useEffect(() => {
        dispatch(fetchRestaurantFoods())
    }, [])

    const foods = []
    if(foodCategories) {
        foodCategories.forEach(category => {
            if (!foodCategory || foodCategory === category._id) {
                category.foods.forEach(food => {
                    foods.push({
                        ...food,
                        category_id: category._id,
                        category_name: category.name,
                    })
                })
            }
        })
    }

    const columns = [
        {title: '#', dataIndex: 'key'},
        {title: 'Food Name', dataIndex: 'name'},
        {title: 'Food Price', dataIndex: 'price'},
        {title: 'Category', dataIndex: 'category_name'},
        {
            title: 'Status', render: food => {
                const handleFoodStatus = async () => {
                    let {error, msg} = updateFoodStatus(food.category_id, food._id, !food.active)
                    if(error) {
                        await Swal.fire('Error', msg, 'error')
                    } else {
                        await Swal.fire('Success', 'Updated successfully', 'success')
                        dispatch(fetchRestaurantFoods())
                    }
                }
                return (
                    <Switch checked={food.active} onChange={handleFoodStatus}/>
                )
            }
        },
    ]


    return (
        <RestaurantLayout>
            <Card>
                <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>Foods</h3>
                    <div className="card-header-action" style={{width: '100%'}}>
                        <div className="float-right mt-4 food-filter" style={{width: 200}}>
                            <Select value={foodCategory} className="w-100" onChange={setFoodCategory} allowClear
                                    size="large">
                                {foodCategories && foodCategories.map(category => {
                                    return (
                                        <Select.Option key={category._id}
                                                       value={category._id}>{category.name}</Select.Option>
                                    )
                                })}

                            </Select>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table
                            columns={columns}
                            dataSource={foods.map((food, index) => {
                                return {
                                    key: index + 1,
                                    ...food
                                }

                            })}
                        />
                    </div>
                </div>
            </Card>

        </RestaurantLayout>
    )
}

export default Foods