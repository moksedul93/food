import { SwalLoading } from "../../../components/common/swal-loading";
import AdminLayout from "../../../components/layouts/admin-layout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import Card from "../../../components/card";
import { Form, Modal, Table, Switch, InputNumber } from "antd";
import { Input } from "semantic-ui-react";
import Swal from "sweetalert2";
import { fetchPriceCriteria } from "../../../app/slices/price_criteria";
import {
  addPriceCriteria,
  updatePriceCriteria,
} from "../../../app/features/price_criteria";

const PriceCriterias = () => {
  let [editForm] = Form.useForm();
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch();
  const priceCriterias = useSelector((state) => state.priceCriteria);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getPriceCriterias(1, 10);
  }, []);

  const getPriceCriterias = (page, size) => {
    dispatch(fetchPriceCriteria({ page, size })).then(({ payload }) => {
      // console.log("dispatch payload", payload.data);
      setPagination({
        current: page,
        pageSize: size,
        total: payload.data.totalDocs,
      });
    });
  };

  const handleTableChange = (pagination) => {
    getPriceCriterias(pagination.current, pagination.pageSize);
  };

  let columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Criteria Name", dataIndex: "name", key: "name" },
    {
      title: "Max Amount",
      dataIndex: "max_amount",
      key: "max_amount",
    },
    {
      title: "Min Amount",
      dataIndex: "min_amount",
      key: "min_amount",
    },
    {
      title: "Increase Percentage",
      dataIndex: "increase_percentage",
      key: "increase_percentage",
    },
    {
      title: "Decrease Percentage",
      dataIndex: "decrease_percentage",
      key: "decrease_percentage",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <>
          {status === false && (
            <div className="badge badge-pill badge-danger mt-3">Inactive</div>
          )}
          {status === true && (
            <div className="badge badge-pill badge-primary mt-3">Active</div>
          )}
        </>
      ),
    },
    {
      title: "Action",
      render: (priceCriteria) => {
        const handleEdit = (priceCriteria) => {
          setEdit(true);
          editForm.setFieldsValue({
            _id: priceCriteria._id,
            name: priceCriteria.name,
            voucher_amount: priceCriteria.voucher_amount,
            max_amount: priceCriteria.max_amount,
            min_amount: priceCriteria.min_amount,
            increase_percentage: priceCriteria.increase_percentage,
            decrease_percentage: priceCriteria.decrease_percentage,
            status: priceCriteria.status,
          });
        };
        return (
          <EditOutlined
            onClick={() => handleEdit(priceCriteria)}
            style={{ fontSize: 20, cursor: "pointer" }}
          />
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="row" id="voucher_body">
        <div className="col-lg-12">
          <Card>
            <div className="card-header">
              <h4 className="d-inline">Price Criterias</h4>
              <div className="card-header-action">
                <button
                  className="btn btn-primary"
                  onClick={() => setAdd(true)}
                >
                  Add New
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  columns={columns}
                  pagination={pagination}
                  onChange={handleTableChange}
                  loading={priceCriterias.loading}
                  dataSource={priceCriterias.data.map(
                    (priceCriteria, index) => {
                      console.log("priceCriteria", priceCriteria);
                      return {
                        key:
                          (pagination.current - 1) * pagination.pageSize +
                          index +
                          1,
                        ...priceCriteria,
                      };
                    }
                  )}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <AddForm
        visible={add}
        setVisible={setAdd}
        getPriceCriterias={getPriceCriterias}
      />
      <EditForm
        visible={edit}
        setVisible={setEdit}
        form={editForm}
        getPriceCriterias={getPriceCriterias}
        pagination={pagination}
      />
    </AdminLayout>
  );
};

export default PriceCriterias;

const AddForm = ({ visible, setVisible, getPriceCriterias }) => {
  let [form] = Form.useForm();

  const handleAdd = async (priceCriteria) => {
    setVisible(false);
    SwalLoading();
    console.log("add priceCriteria", priceCriteria);
    let { error, msg } = await addPriceCriteria(priceCriteria);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "Price Criteria added", "success");
      getPriceCriterias(1, 10);
    }
  };

  return (
    <Modal
      title="Add New Price Criteria"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        requiredMark={false}
        form={form}
        onFinish={handleAdd}
      >
        <Form.Item name="_id" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Criteria Name"
          name="name"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher code (Atleast 6 Charecter)",
            },
            {
              pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
              message: "Not valid code",
            },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Maximum Amount"
          name="max_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a maximum amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Minimum Amount"
          name="min_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Increase Percentage"
          name="increase_percentage"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Decrease Percentage"
          name="decrease_percentage"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              name="status"
              style={{ display: "inline-block" }}
              initialValue={false}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <label
              className="ml-2 font-weight-bold"
              style={{ color: "#34395e", marginTop: 6 }}
            >
              Criteria Status
            </label>
          </div>
        </div>
        <button className="btn btn-primary">Add Criteria</button>
      </Form>
    </Modal>
  );
};

const EditForm = ({
  visible,
  setVisible,
  form,
  getPriceCriterias,
  pagination,
}) => {
  const handleUpdate = async (priceCriteria) => {
    setVisible(false);
    SwalLoading();

    console.log("editform:", priceCriteria);
    let { error, msg } = await updatePriceCriteria(priceCriteria);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "Voucher updated", "success");
      getPriceCriterias(pagination.current, pagination.pageSize);
    }
  };
  return (
    <Modal
      title="Edit Criteria"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        requiredMark={false}
        form={form}
        onFinish={handleUpdate}
      >
        <Form.Item name="_id" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Criteria Name"
          name="name"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher code (Atleast 6 Charecter)",
            },
            {
              pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
              message: "Not valid code",
            },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Maximum Amount"
          name="max_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a maximum amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Minimum Amount"
          name="min_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Increase Percentage"
          name="increase_percentage"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Decrease Percentage"
          name="decrease_percentage"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a minimun amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              name="status"
              style={{ display: "inline-block" }}
              initialValue={false}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <label
              className="ml-2 font-weight-bold"
              style={{ color: "#34395e", marginTop: 6 }}
            >
              Criteria Status
            </label>
          </div>
        </div>

        <button className="btn btn-primary">Update Criteria</button>
      </Form>
    </Modal>
  );
};
