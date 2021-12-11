import { SwalLoading } from "../../../components/common/swal-loading";
import AdminLayout from "../../../components/layouts/admin-layout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import Card from "../../../components/card";
import { Form, Modal, Table, Switch, InputNumber } from "antd";
import { Input } from "semantic-ui-react";
import Swal from "sweetalert2";
import { fetchVouchers } from "../../../app/slices/voucher";
import { addVoucher, updateVoucher,deleteVoucher } from "../../../app/features/voucher";

const Vouchers = () => {
  let [editForm] = Form.useForm();
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch();
  const vouchers = useSelector((state) => state.vouchers);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getVouchers(1, 10);
  }, []);

  const getVouchers = (page, size) => {
    dispatch(fetchVouchers({ page, size })).then(({ payload }) => {
      //console.log("dispatch payload",payload.data)
      setPagination({
        current: page,
        pageSize: size,
        total: payload.data.totalDocs,
      });
    });
  };

  const handleDelete= async(voucher)=>{
    console.log(voucher._id);
    let { error, msg } = await deleteVoucher(voucher._id);
    // dispatch(deleteVoucher(voucher._id));
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "Voucher Deleted", "success");
      getVouchers(pagination.current, pagination.pageSize);
    }
  };
  

  const handleTableChange = (pagination) => {
    getVouchers(pagination.current, pagination.pageSize);
  };

  let columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Voucher Code", dataIndex: "voucher_code", key: "voucher_code" },
    { title: "Voucher Name", dataIndex: "voucher_name", key: "voucher_name" },
    {
      title: "Discount Amount",
      dataIndex: "discount_amount",
      key: "discount_amount",
    },
    {
      title: "Status",
      dataIndex: "voucher_status",
      render: (voucher_status) => (
        <>
          {voucher_status === false && (
            <div className="badge badge-pill badge-danger mt-3">Inactive</div>
          )}
          {voucher_status === true && (
            <div className="badge badge-pill badge-primary mt-3">Active</div>
          )}
        </>
      ),
    },
    {
      title: "Action",
      render: (voucher) => {
        const handleEdit = (voucher) => {
          setEdit(true);
          editForm.setFieldsValue({
            _id: voucher._id,
            voucher_code: voucher.voucher_code,
            voucher_name: voucher.voucher_name,
            discount_amount: voucher.discount_amount,
            start_date: voucher.start_date,
            end_date: voucher.end_date,
            redeem_limit: voucher.redeem_limit,
            redeem_count: voucher.redeem_count,
            minimum_order: voucher.minimum_order,
            voucher_status: voucher.voucher_status,
          });
        };
        return (
          <>
          <EditOutlined
            onClick={() => handleEdit(voucher)}
            style={{ fontSize: 20, cursor: "pointer" }}
          />
          <DeleteOutlined 
            onClick={() => handleDelete(voucher)}
            style={{ fontSize: 20, cursor: "pointer" }}
          />
          </>
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
              <h4 className="d-inline">Vouchers</h4>
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
                  loading={vouchers.loading}
                  dataSource={vouchers.data.map((voucher, index) => {
                    return {
                      key:
                        (pagination.current - 1) * pagination.pageSize +
                        index +
                        1,
                      ...voucher,
                    };
                  })}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <AddForm visible={add} setVisible={setAdd} getVouchers={getVouchers} />
      <EditForm
        visible={edit}
        setVisible={setEdit}
        form={editForm}
        getVouchers={getVouchers}
        pagination={pagination}
      />
    </AdminLayout>
  );
};

export default Vouchers;

const AddForm = ({ visible, setVisible, getVouchers }) => {
  let [form] = Form.useForm();

  const handleAdd = async (voucher) => {
    setVisible(false);
    SwalLoading();
    console.log("add voucher", voucher);
    let { error, msg } = await addVoucher(voucher);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "New voucher added", "success");
      getVouchers(1, 10);
    }
  };

  return (
    <Modal
      title="Add Voucher"
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
        <Form.Item
          label="Voucher Code"
          name="voucher_code"
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
          label="Voucher Name"
          name="voucher_name"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher name (Atleast 6 Charecter)",
            },
            {
              pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
              message: "Not valid name",
            },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Discount Amount"
          name="discount_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a discount amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="start_date"
          className="form-group"
          rules={[{ required: true, message: "Please insert a start date" }]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="end_date"
          className="form-group"
          rules={[{ required: true, message: "Please insert a end date" }]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Redeem Count"
          name="redeem_count"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a redeem count" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid count" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Redeem Limit"
          name="redeem_limit"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a redeem limit" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid limit" },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Minimum Order"
          name="minimum_order"
          className="form-group"
          rules={[
            { required: true, message: "Please insert minimum_order amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid " },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              name="voucher_status"
              style={{ display: "inline-block" }}
              initialValue={true}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <label
              className="ml-2 font-weight-bold"
              style={{ color: "#34395e", marginTop: 6 }}
            >
              Voucher Status
            </label>
          </div>
        </div>

        <button className="btn btn-primary">Add Voucher</button>
      </Form>
    </Modal>
  );
};

const EditForm = ({ visible, setVisible, form, getVouchers, pagination }) => {
  const handleUpdate = async (voucher) => {
    setVisible(false);
    SwalLoading();

    console.log("editform:", voucher);
    let { error, msg } = await updateVoucher(voucher);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "Voucher updated", "success");
      getVouchers(pagination.current, pagination.pageSize);
    }
  };

  return (
    <Modal
      title="Edit Voucher"
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
          label="Voucher Code"
          name="voucher_code"
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
          label="Voucher Name"
          name="voucher_name"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher name (Atleast 6 Charecter)",
            },
            {
              pattern: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/,
              message: "Not valid name",
            },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Discount Amount"
          name="discount_amount"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a discount amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid amount" },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="start_date"
          className="form-group"
          rules={[{ required: true, message: "Please insert a start date" }]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="end_date"
          className="form-group"
          rules={[{ required: true, message: "Please insert a end date" }]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Redeem Limit"
          name="redeem_limit"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a redeem limit" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid limit" },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Redeem Count"
          name="redeem_count"
          className="form-group"
          rules={[
            { required: true, message: "Please insert a redeem count" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid count" },
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Minimum Order"
          name="minimum_order"
          className="form-group"
          rules={[
            { required: true, message: "Please insert minimum_order amount" },
            { pattern: /^[0-9]+([0-9])*$/, message: "Not valid " },
          ]}
        >
          <InputNumber size="large" style={{ width: "100%" }} />
        </Form.Item>

        <div className="row">
          <div className="col-6">
            <Form.Item
              name="voucher_status"
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
              Voucher Status
            </label>
          </div>
        </div>
        <button className="btn btn-primary">Update Voucher</button>
      </Form>
    </Modal>
  );
};
