import {useMutation} from "urql";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "semantic-ui-react";
import Swal from "sweetalert2";
import {SwalLoading} from "../../common/swal-loading";
import {Form, Space, Input, Select} from "antd";
import Card from "../../../components/card";
import InputFile from "../../../components/input/input-file";
import {uploadImage} from "../../../app/functions";

const AddCategory = props => {
    let [form] = Form.useForm()
    const addCategoryQuery = `
        mutation ($name: String!){
            addCategory(name: $name){
                error
                msg
            }
        }
    `;

    const [ category, setCategory ] = useState('');
    const [ addCategory ] = useMutation(addCategoryQuery);


    const submit = async data => {
        // SwalLoading();

        let image_url = ''
        if(data.image_url.length > 0) {
            let {originFileObj} = data.image_url[0]
            image_url = await uploadImage(originFileObj)
        }
        data.image_url = image_url
        addCategory(data).then(result => {
            if( result.error ) {
                Swal.fire(
                    "Error",
                    "Request Failed",
                    "error"
                )
            } else if(result.data.addCategory.error){
                Swal.fire(
                    "Error",
                    result.data.addCategory.msg,
                    "error"
                )
            } else {
                setCategory("");
                props.handleClose();
                Swal.fire(
                    "Success",
                    "Category Added Successfully",
                    "success"
                )
            }
        });
    };

    return (
        <>
            <Modal.Body>
            <Form 
                layout="vertical" 
                requiredMark={false} 
                form={form} 
                onFinish={submit}>
                <div className="row">
                    <div className="col-md-12">
                        <Card>
                            <Form.Item
                                    label="Category Name"
                                    name="name"
                                    className="form-group"
                                >
                                    <Input size="large"/>
                            </Form.Item>
                            <InputFile form={form} name='image_url' aspect={1}/>
                            <Button variant="primary" type="submit">Add New</Button>
                        </Card>
                    </div>
                </div>
            </Form>
            </Modal.Body>
        </>
    )

}

export default AddCategory