import {Form, Select} from 'antd'
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchDistricts, fetchDivisions,
    fetchMunicipals,
    fetchUnions,
    fetchUpazilas, fetchVillages,
    fetchWards
} from "../../app/slices/locations";

const InputLocation = ({form}) => {
    let dispatch = useDispatch()
    const [type, setType] = useState('')

    useEffect(() => {
        dispatch(fetchDivisions({}))
    }, [])

    let locations = useSelector(state => state.locations)
    const handleDivisionSelect = value => {
        form.setFieldsValue({
            district: undefined,
            municipal: undefined,
            ward: undefined,
            upazila: undefined,
            union: undefined,
            village: undefined
        })
        dispatch({type: 'locations/clearDistricts'})
        dispatch(fetchDistricts({division_id: value}))
    }
    const handleDistrictSelect = value => {
        form.setFieldsValue({
            municipal: undefined,
            ward: undefined,
            upazila: undefined,
            union: undefined,
            village: undefined
        })
        dispatch({type: 'locations/clearMunicipals'})
        dispatch({type: 'locations/clearUpazilas'})
        dispatch(fetchMunicipals(({district_id: value})))
        dispatch(fetchUpazilas(({district_id: value})))
    }
    const handleMunicipalSelect = value => {
        form.setFieldsValue({
            ward: undefined,
        })
        dispatch({type: 'locations/clearWards'})
        dispatch(fetchWards({municipal_id: value}))
    }
    const handleUpazilaSelect = value => {
        form.setFieldsValue({
            union: undefined,
            village: undefined
        })
        dispatch({type: 'locations/clearUnions'})
        dispatch(fetchUnions({upazila_id: value}))
    }
    const handleUnionSelect = value => {
        form.setFieldsValue({
            village: undefined
        })
        dispatch({type: 'locations/clearVillages'})
        dispatch(fetchVillages({union_id: value}))
    }

    return (
        <div className="row">
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
                            <Select.Option key={division.id} value={division.id}>{division.bn_name}</Select.Option>
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
                            <Select.Option key={district.id} value={district.id}>{district.bn_name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="col-md-4">
                <Form.Item
                    label="Type"
                    name="residential_or_municipal"
                    rules={[
                        {required: true, message: 'Please select type'}
                    ]}
                >
                    <Select size="large" onSelect={setType}>
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
                                    <Select.Option key={municipal.id} value={municipal.id}>{municipal.bn_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            label="Wards"
                            name="ward"
                            rules={[
                                {required: true, message: 'Please select ward'}
                            ]}
                        >
                            <Select size="large" virtual={false}>
                                {locations.wards.map(ward => (
                                    <Select.Option key={ward.id} value={ward.id}>{ward.bn_name}</Select.Option>
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
                                    <Select.Option key={upazila.id} value={upazila.id}>{upazila.bn_name}</Select.Option>
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
                                    <Select.Option key={union.id} value={union.id}>{union.bn_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            label="Village"
                            name="village"
                            rules={[
                                {required: true, message: 'Please select village'}
                            ]}
                        >
                            <Select size="large" virtual={false}>
                                {locations.villages.map(village => (
                                    <Select.Option key={village.id} value={village.id}>{village.bn_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </>
            )}
        </div>
    )
}

export default InputLocation