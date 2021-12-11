import { SwalLoading } from "../../../components/common/swal-loading";
import AdminLayout from "../../../components/layouts/admin-layout";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Card from "../../../components/card";
import { Form, Modal, Table } from "antd";
import InputFile from "../../../components/input/input-file";
import PromoInputFile from "../../../components/input/promo_inputfile";
import {uploadImage} from "../../../app/functions";
import { Input } from "semantic-ui-react";
import Swal from "sweetalert2";
import { fetchPromotionalImages } from "../../../app/slices/promotional_images";
import {
  addPromotionalImage,
  deletePromotionalImage
} from "../../../app/features/promotional_images";

const PromotionalImages = () => {
  const [add, setAdd] = useState(false);

  const dispatch = useDispatch();
  const promotionalImages = useSelector((state) => state.promotionalImages);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getPromotionalImages(1, 10);
  }, []);

  const getPromotionalImages = (page, size) => {
    dispatch(fetchPromotionalImages({ page, size })).then(({ payload }) => {
      console.log("dispatch payload", payload.data);
      setPagination({
        current: page,
        pageSize: size,
        total: payload.data?.totalDocs,
      });
    });
  };

  const handleDelete = async (id) => {
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
        let {error, msg} = await deletePromotionalImage(id)
        if (error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', 'Promotional Image Deleted', 'success')
            dispatch(fetchPromotionalImages({}))
        }
    }
}



  const handleTableChange = (pagination) => {
    getPromotionalImages(pagination.current, pagination.pageSize);
  };

  let columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      render: (promotionalImages) => {
        return (
          <a className="text-danger table-action ml-2 c-pointer"
          onClick={e => handleDelete(promotionalImages._id)}>
           <i className="fa fa-trash-alt"/>
       </a>
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
              <h4 className="d-inline">Promotional Image List</h4>
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
                  loading={promotionalImages.loading}
                  dataSource={promotionalImages.data.map(
                    (promotionalImages, index) => {
                      console.log("promotionalImages", promotionalImages);
                      return {
                        key:
                          (pagination.current - 1) * pagination.pageSize +
                          index +
                          1,
                        ...promotionalImages,
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
        getPromotionalImages={getPromotionalImages}
      />
    </AdminLayout>
  );
};

export default PromotionalImages;

const AddForm = ({ visible, setVisible, getPromotionalImages }) => {
  let [form] = Form.useForm();

  const handleAdd = async (promotionalImages) => {
    setVisible(false);
    SwalLoading();
    let promo_img = ''
        if (promotionalImages.promo_img.length > 0) {
            let {originFileObj} = promotionalImages.promo_img[0]
            promo_img = await uploadImage(originFileObj)
        }
        promotionalImages.description = promotionalImages.description || ''
        promotionalImages.promo_img = promo_img
    console.log("add promotionalImages", promotionalImages);
    let { error, msg } = await addPromotionalImage(promotionalImages);
    if (error) {
      await Swal.fire("Error", msg, "error");
    } else {
      await Swal.fire("Success", "promotionalImages added", "success");
      getPromotionalImages(1, 10);
    }
  };

  return (
    <Modal
      title="Add New Promotional Image"
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
        {/* <Form.Item name="_id" style={{ display: "none" }}>
          <Input />
        </Form.Item> */}
        <Form.Item
          label="Title"
          name="title"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher code (Atleast 6 Charecter)",
            }
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          className="form-group"
          rules={[
            {
              required: true,
              min: 6,
              message:
                "Please insert a valid voucher code (Atleast 6 Charecter)",
            }
          ]}
        >
          <Input size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Card header="Image">
             {/* <InputFile form={form} name='promo_img' aspect={1} required/> */}
             <PromoInputFile form={form} name='promo_img' aspect={1} required/>
        </Card>
        {/* <Button variant="primary" type="submit">Add Image</Button> */}
        <button className="btn btn-primary" type="submit">Add Promo Image</button>
      </Form>
    </Modal>
  );
};

