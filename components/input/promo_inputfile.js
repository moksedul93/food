import ImgCrop from "antd-img-crop";
import {Upload, Form} from "antd";
import React, {useState} from "react";

const PromoInputFile = props => {
    let max = props.max || 1
    let name = props.name || 'img'
    let listType = props.listType || "picture-card"

    let [refresh, setRefresh] = useState()
    let reload = () => setRefresh(!refresh)

    const fileList = () => {
        let values = props.form.getFieldsValue()
        if(values[name]) {
            return values[name]
        }
        return []
    }

    const onChange =  ({fileList: newFileList}) => {
        let value = {}
        value[name] = newFileList
        props.form.setFieldsValue(value)
        reload()
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = document.createElement("img");
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    return (
        <div className="form-group">
            {props.label && ( <label>{props.label}</label> )}
            <Form.Item name={name} rules={[{required: props.required, message: 'Please upload a image'}]}>  
                    <Upload listType={listType} onPreview={onPreview}
                            fileList={fileList()} onChange={onChange} maxCount={max}>
                        {fileList().length < max && "+ upload"}
                    </Upload>
            </Form.Item>
        </div>
    )
}

export default PromoInputFile