import React, { useEffect, useRef, useState } from "react";
import OwnerLayout from "../../../components/layouts/owner-layout";
import Card from "../../../components/card";
import InputPlacesMap from "../../../components/input/input-places-map";
import Button from "react-bootstrap/Button";
import { Form, Input, Select, Switch, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import InputLocation from "../../../components/input/input-location";
import { uploadImage } from "../../../app/functions";
import { SwalLoading } from "../../../components/common/swal-loading";
import Swal from "sweetalert2";
import InputFile from "../../../components/input/input-file";
import { fetchPlans } from "../../../app/slices/plans";
import { fetchCategories } from "../../../app/slices/categories";
import { addRestaurant } from "../../../app/features/restaurant";

const App = () => {
  let dispatch = useDispatch();

  const [openingTime,setOpeningTime]=useState('');
  const [closingTime,setClosingTime]=useState('');
  console.log("opentime",openingTime)
  console.log("closetime",closingTime)

  useEffect(() => {
    dispatch(fetchPlans({}));
    dispatch(fetchCategories({ page: 0, size: 0 }));
  }, []);
  const [form] = Form.useForm();
  let plans = useSelector((state) => state.plans.data);
  let categories = useSelector((state) => state.categories.data);

  const getCategoryName = (id) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i]._id == id) {
        return categories[i].name;
      }
    }
  };

  const getCategories = (ids) => {
    return ids.map((id) => {
      return {
        _id: id,
        name: getCategoryName(id),
      };
    });
  };

  const handleSubmit = async (restaurant) => {
    SwalLoading();
    let thumb_img = "",
      cover_img = "";
    if (restaurant.thumb_img && restaurant.thumb_img.length > 0) {
      let { originFileObj } = restaurant.thumb_img[0];
      thumb_img = await uploadImage(originFileObj);
    }
    if (restaurant.cover_img && restaurant.cover_img.length > 0) {
      let { originFileObj } = restaurant.cover_img[0];
      cover_img = await uploadImage(originFileObj);
    }
    restaurant.thumb_img = thumb_img;
    restaurant.cover_img = cover_img;
    restaurant.discount_given_by_restaurant =
      +restaurant.discount_given_by_restaurant;
    restaurant.discount_given_by_admin = +restaurant.discount_given_by_admin;
    // restaurant.opening_hour =+restaurant.opening_hour;
    // restaurant.closing_hour = +restaurant.closing_hour;
    restaurant.opening_hour=openingTime;
    restaurant.closing_hour=closingTime; 
    restaurant.description = restaurant.description || "";
    restaurant.tags = restaurant.tags || [];
    restaurant.food_categories = restaurant.food_categories
      ? getCategories(restaurant.food_categories)
      : [];
      console.log("restaurant submit",restaurant)
    let { error, msg } = await addRestaurant(restaurant);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "Restaurant added", "success");
      form.resetFields();
    }
  };

  return (
    <OwnerLayout>
      <div className="section-header">
        <h3>Add a new Restaurant</h3>
      </div>
      <Form
        layout="vertical"
        requiredMark={false}
        form={form}
        initialValues={{ vat: false, rider_cost: false }}
        onFinish={handleSubmit}
      >
        <div className="row">
          <div className="col-md-4">
            <Card header="Restaurant Information">
              <Form.Item
                label="Restaurant Name"
                name="name"
                className="form-group"
                rules={[
                  { required: true, message: "Please insert restaurant name" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Restaurant Type"
                name="restaurant_or_homemade"
                className="form-group"
                rules={[
                  { required: true, message: "Please select restaurant type" },
                ]}
              >
                <Select size="large">
                  <Select.Option value="restaurant">Restaurant</Select.Option>
                  <Select.Option value="homemade">Homemade</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Plan"
                name="plan"
                className="form-group"
                rules={[{ required: true, message: "Please select a plan" }]}
              >
                <Select size="large">
                  {plans.map((plan) => (
                    <Select.Option key={plan._id} value={plan._id}>
                      {plan.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea size="large" rows={3} />
              </Form.Item>

              <Form.Item
                label="Food Categories"
                name="food_categories"
                className="form-group"
                rules={[
                  { required: true, message: "Please select categories" },
                ]}
              >
                <Select size="large" mode="multiple" virtual={false} showSearch>
                  {categories.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Tags" name="tags" className="form-group">
                <Select
                  mode="tags"
                  size="large"
                  tokenSeparators={[","]}
                  dropdownStyle={{ display: "none" }}
                  style={{ width: "100%" }}
                >
                  {" "}
                </Select>
              </Form.Item>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Cover Image</label>
                    <InputFile form={form} name="cover_img" aspect={4 / 1} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Thumb Image</label>
                    <InputFile form={form} name="thumb_img" aspect={4 / 3} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-md-4">
            <Card header="Additional Information">
              <Form.Item
                label="Average Cost for Single Meal"
                name="price_type"
                className="form-group"
                rules={[
                  { required: true, message: "Please select a price type" },
                ]}
              >
                <Select size="large">
                    <Select.Option value="$">$ - Less than 150</Select.Option>
                    <Select.Option value="$$">$$ - Between 150 to 500</Select.Option>
                    <Select.Option value="$$$">$$$ - Greater than 500</Select.Option>
                </Select>
              </Form.Item>

              <InputPlacesMap label="Restaurant Location" form={form} />
            </Card>
            <Card header="Address">
              <InputLocation form={form} />
            </Card>
          </div>
          <div className="col-md-4">
          {/* ------------------------------------------------------------------- */}
          <Card header="Opening and Closing Hour">
              <Form.Item
                label="Opening Hour"
                name="opening_hour"
                className="form-group"
                rules={[
                  {
                    required: true,
                    message: "Please insert Restaurant opening time",
                  }
                ]}
              >
                
                <Input size="large" type="time" value={openingTime} onChange={e=>setOpeningTime(e.target.value)}/>
              </Form.Item>
              <Form.Item
                label="Closing Hour"
                name="closing_hour"
                className="form-group"
                rules={[
                  {
                    required: true,
                    message: "Please insert Restaurant closing time",
                  }
                ]}
              >
                <Input size="large" type="time" value={closingTime} onChange={e=>setClosingTime(e.target.value)}/>
              </Form.Item>
              <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    Opening Day
                  </label>
              <div className="row">
              
                <div className="col-3">
                  <Form.Item
                    name="sat"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    sat
                  </label>
                </div>
                <div className="col-3">
                  <Form.Item
                    name="sun"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    sun
                  </label>
                </div>
                <div className="col-2.5">
                  <Form.Item
                    name="mon"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    mon
                  </label>
                </div>
                <div className="col-3">
                  <Form.Item
                    name="tue"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    tue
                  </label>
                </div>
                <div className="col-4">
                  <Form.Item
                    name="wed"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    wed
                  </label>
                </div>
                <div className="col-4">
                  <Form.Item
                    name="thu"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    thu
                  </label>
                </div>
                <div className="col-4">
                  <Form.Item
                    name="fri"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    fri
                  </label>
                </div>
              </div>
            </Card>
            {/* ----------------------------------------------------- */}
            <Card header="Discount & Cost">
              <Form.Item
                label="Discount given by Restaurant"
                name="discount_given_by_restaurant"
                className="form-group"
                rules={[
                  {
                    required: true,
                    message: "Please insert Restaurant discount amount",
                  },
                  { pattern: /^\d*$/, message: "Please insert valid amount" },
                ]}
              >
                <Input size="large" suffix="%" />
              </Form.Item>
              <Form.Item
                label="Discount given by Admin"
                name="discount_given_by_admin"
                className="form-group"
                rules={[
                  {
                    required: true,
                    message: "Please insert Admin discount amount",
                  },
                  { pattern: /^\d*$/, message: "Please insert valid amount" },
                ]}
              >
                <Input size="large" suffix="%" />
              </Form.Item>
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    name="vat"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    Restaurant VAT
                  </label>
                </div>
                <div className="col-6">
                  <Form.Item
                    name="rider_cost"
                    style={{ display: "inline-block" }}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <label
                    className="ml-2 font-weight-bold"
                    style={{ color: "#34395e", marginTop: 6 }}
                  >
                    Rider Cost
                  </label>
                </div>
              </div>
            </Card>
            <Card header="Login">
              <Form.Item
                label="Username"
                name="user"
                className="form-group"
                rules={[
                  {
                    required: true,
                    message: "Please insert restaurant username",
                  },
                  {
                    min: 3,
                    message: "Username should be at least 3 characters",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
                    message: "Not valid username",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                className="form-group"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 8, message: "Password must have 8 characters!" },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Button type="submit" variant="primary">
                Add Restaurant
              </Button>
            </Card>
          </div>
        </div>
      </Form>
    </OwnerLayout>
  );
};

export default App;
