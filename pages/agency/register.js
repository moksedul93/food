import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchDistricts,
    fetchDivisions,
    fetchMunicipals,
    fetchUnions,
    fetchUpazilas, fetchVillages,
    fetchWards
} from "../../app/slices/locations";
import {uploadImage} from "../../app/functions";
import {addAgency} from "../../app/features/agencies";
import Swal from "sweetalert2";
import {SwalLoading} from "../../components/common/swal-loading";

const Register = () => {
    let dispatch = useDispatch()
    const [form] = Form.useForm()
    const [type, setType] = useState('')

    const handleTypeChange = type => {
        setType(type)
        form.setFieldsValue({
            agency_areas: undefined,
        })
    }

    useEffect(() => {
        dispatch(fetchDivisions({}))
    }, [])

    let locations = useSelector(state => state.locations)
    const handleDivisionSelect = value => {
        form.setFieldsValue({
            district: undefined,
            municipal: undefined,
            upazila: undefined,
            union: undefined,
            agency_areas: undefined
        })
        dispatch({type: 'locations/clearDistricts'})
        dispatch(fetchDistricts({division_id: value}))
    }
    const handleDistrictSelect = value => {
        form.setFieldsValue({
            municipal: undefined,
            agency_areas: undefined,
            upazila: undefined,
            union: undefined,
        })
        dispatch({type: 'locations/clearMunicipals'})
        dispatch({type: 'locations/clearUpazilas'})
        dispatch(fetchMunicipals(({district_id: value})))
        dispatch(fetchUpazilas(({district_id: value})))
    }
    const handleMunicipalSelect = value => {
        form.setFieldsValue({
            agency_areas: undefined
        })
        dispatch({type: 'locations/clearWards'})
        dispatch(fetchWards({municipal_id: value}))
    }
    const handleUpazilaSelect = value => {
        form.setFieldsValue({
            union: undefined,
            agency_areas: undefined
        })
        dispatch({type: 'locations/clearUnions'})
        dispatch(fetchUnions({upazila_id: value}))
    }
    const handleUnionSelect = value => {
        form.setFieldsValue({
            agency_areas: undefined
        })
        dispatch({type: 'locations/clearVillages'})
        dispatch(fetchVillages({union_id: value}))
    }

    const handleRegister = async agency => {
        SwalLoading()
        let img = ''
        if(agency.trade_license_img && agency.trade_license_img.fileList.length > 0) {
            let {originFileObj} = agency.trade_license_img.fileList[0]
            img = await uploadImage(originFileObj)
        }
        agency.trade_license_img = img
        let {error, msg} = await addAgency(agency)
        if(error) {
            await Swal.fire('Error', msg, 'error')
        } else {
            await Swal.fire('Success', msg, 'success')
            form.resetFields()
        }
    }


    return (
        <div className="wrapper bg-image">
            <div className="register-form">
                <div className="text-center mb-5">
                    <h1 className="card-title font-italic">Register as Agency</h1>
                </div>
                <Form layout="vertical" requiredMark={false} form={form} onFinish={handleRegister}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="First Name"
                                name="first_name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your first name'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Last Name"
                                name="last_name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your last name'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Phone Number"
                                name="mobile"
                                className="form-group"
                                rules={
                                    [
                                        {required: true, message: 'Please input your phone number!'},
                                        {pattern: /\d\d\d\d\d\d\d\d\d\d/, message: 'Please input a valid phone number!'}
                                    ]
                                }
                            >
                                <Input addonBefore="+880" maxLength={10} size="large"/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Password"
                                name="password"
                                className="form-group"
                                rules={
                                    [
                                        {required: true, message: 'Please input your password!'},
                                        {min: 8, message: 'Password must have 8 characters!'}
                                    ]
                                }>
                                <Input.Password size="large"/>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        label="Email (Optional)"
                        name="email"
                        initialValue=""
                        className="form-group"
                        rules={[
                            {
                                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                                message: 'Please input a valid Email!'
                            }
                        ]}>
                        <Input size="large"/>
                    </Form.Item>

                    <Form.Item
                        label="NID"
                        name="national_id"
                        className="form-group"
                        rules={
                            [
                                {required: true, message: 'Please input your NID Number!'},
                                {pattern: /^(0|[1-9][0-9]*)$/, message: 'Please input valid NID Number!'}
                            ]
                        }>
                        <Input size="large"/>
                    </Form.Item>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Business Name"
                                name="business_name"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your business name'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Business Location"
                                name="business_location"
                                className="form-group"
                                rules={[
                                    {required: true, message: 'Please provide your business location'}
                                ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        label="Trade Licence (if available)"
                        name="trade_license_no"
                        initialValue=""
                        className="form-group">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item name="trade_license_img">
                        <Upload
                            listType="picture"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined/>}>Upload trade licence image</Button>
                        </Upload>
                    </Form.Item>

                    <div className="row mt-4">
                        <div className="col-md-4">
                            <Form.Item
                                label="Division"
                                name="division"
                                rules={[
                                    {required: true, message: 'Please select division'}
                                ]}
                            >
                                <Select size="large" onSelect={handleDivisionSelect} virtual={false}>
                                    {locations.divisions.map(division => (
                                        <Select.Option key={division.id}
                                                       value={division.id}>{division.bn_name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                label="District"
                                name="district"
                                rules={[
                                    {required: true, message: 'Please select district'}
                                ]}
                            >
                                <Select size="large" onSelect={handleDistrictSelect} virtual={false}>
                                    {locations.districts.map(district => (
                                        <Select.Option key={district.id}
                                                       value={district.id}>{district.bn_name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                label="Type"
                                name="agency_level"
                                rules={[
                                    {required: true, message: 'Please select type'}
                                ]}
                            >
                                <Select size="large" onSelect={handleTypeChange}>
                                    <Select.Option value="municipal">পৌরসভা</Select.Option>
                                    <Select.Option value="residential">উপজেলা</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>


                        {type === 'municipal' && (
                            <>
                                <div className="col-md-6">
                                    <Form.Item
                                        label="Municipal"
                                        name="municipal"
                                        rules={[
                                            {required: true, message: 'Please select municipal'}
                                        ]}
                                    >
                                        <Select size="large" onSelect={handleMunicipalSelect} virtual={false}>
                                            {locations.municipals.map(municipal => (
                                                <Select.Option key={municipal.id}
                                                               value={municipal.id}>{municipal.bn_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-md-6">
                                    <Form.Item
                                        label="Wards"
                                        name="agency_areas"
                                        rules={[
                                            {required: true, message: 'Please select wards'}
                                        ]}
                                    >
                                        <Select size="large" virtual={false} mode="multiple">
                                            {locations.wards.map(ward => (
                                                <Select.Option key={ward.id}
                                                               value={ward.id}>{ward.bn_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </>
                        )}
                        {type === 'residential' && (
                            <>
                                <div className="col-md-4">
                                    <Form.Item
                                        label="Upazila"
                                        name="upazila"
                                        rules={[
                                            {required: true, message: 'Please select upazila'}
                                        ]}
                                    >
                                        <Select size="large" onSelect={handleUpazilaSelect} virtual={false}>
                                            {locations.upazilas.map(upazila => (
                                                <Select.Option key={upazila.id}
                                                               value={upazila.id}>{upazila.bn_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-md-4">
                                    <Form.Item
                                        label="Union"
                                        name="union"
                                        rules={[
                                            {required: true, message: 'Please select union'}
                                        ]}
                                    >
                                        <Select size="large" onSelect={handleUnionSelect} virtual={false}>
                                            {locations.unions.map(union => (
                                                <Select.Option key={union.id}
                                                               value={union.id}>{union.bn_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-md-4">
                                    <Form.Item
                                        label="Village"
                                        name="agency_areas"
                                        rules={[
                                            {required: true, message: 'Please select villages'}
                                        ]}
                                    >
                                        <Select size="large" virtual={false} mode="multiple">
                                            {locations.villages.map(village => (
                                                <Select.Option key={village.id}
                                                               value={village.id}>{village.bn_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </>
                        )}
                    </div>

                    <button className="btn btn-primary btn-submit" type="submit">Register</button>
                </Form>
            </div>
        </div>
    )
}
export default Register