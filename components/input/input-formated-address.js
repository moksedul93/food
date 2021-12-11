import InputDefault from "./input-default";
import React, {useState} from "react";
import InputSelect from "./input-select";
import {District, Division, Municipality, Union, Upazila, Village, Ward} from "../urql/locations";
import UrqlProvider from "../urql/urql-provider";

const InputFullAddress = props => {

    const [ division, setDivision ] = useState('');
    const [ district, setDistrict ] = useState('');
    const [ type, setType ] = useState('');
    const [ municipals, setMunicipals] = useState('');
    const [ ward, setWard] = useState('');
    const [ upazila, setUpazila] = useState('');
    const [ union, setUnion] = useState('');
    const [ village, setVillage] = useState('');

    const handleDivisionChange = value => {
        setDivision(value);
        setDistrict('');
        setType('');
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        clearArea();
    }
    const handleDistrictChange = value => {
        setDistrict(value);
        setType('');
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        clearArea();
    }

    const handleUpazilaChange = value => {
        setUpazila(value);
        setUnion('');
        setVillage('');
        setWard('');
        clearArea();
    }

    const handleUnionChange = value => {
        setUnion(value);
        setVillage('');
        setWard('');
        clearArea();
    }


    const handleMunicipalChange = value => {
        setMunicipals(value);
        setWard('');
        clearArea();
    }

    const handleTypeChange = value => {
        setType(value);
        clearArea();
    }

    const handleWardChange = value => {
        setWard(value);
        props.setType(type)
        props.setValue({
            division: division,
            district: district,
            municipal: municipals,
            ward: value,
        })
    }

    const handleVillageChange = value => {
        setVillage(value);
        props.setType(type)
        props.setValue({
            division: division,
            district: district,
            upazila: upazila,
            union: union,
            village: value
        })
    }

    const clearArea = () => {
        props.setValue({
            division: '',
            district: '',
        })
    }



    let typeOptions = [
        {text: 'উপজেলা', value: 'residential', key: 'residential'},
        {text: 'পৌরসভা', value: 'municipal', key: 'municipal'}
    ]


    return (
        <div className="row">
            <div className="col-md-4">
                <UrqlProvider>
                    <Division value={division} setValue={handleDivisionChange}/>
                </UrqlProvider>
            </div>
            <div className="col-md-4">
                <UrqlProvider>
                    <District value={district} setValue={handleDistrictChange} divisionId={division}/>
                </UrqlProvider>
            </div>
            <div className="col-md-4">
                <InputSelect label="Type" value={type} setValue={handleTypeChange} options={typeOptions}/>
            </div>

            {type == 'municipal' && (
                <>
                    <div className="col-md-6">
                        <UrqlProvider>
                            <Municipality value={municipals} setValue={handleMunicipalChange} districtId={district}/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-6">
                        <UrqlProvider>
                            <Ward value={ward} setValue={handleWardChange} municipalId={municipals}/>
                        </UrqlProvider>
                    </div>
                </>


            )}

            {type == 'residential' && (
                <>
                    <div className="col-md-4">
                        <UrqlProvider>
                            <Upazila value={upazila} setValue={handleUpazilaChange} districtId={district}/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-4">
                        <UrqlProvider>
                            <Union value={union} setValue={handleUnionChange} upazilaId={upazila}/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-4">
                        <UrqlProvider>
                            <Village value={village} setValue={handleVillageChange} unionId={union}/>
                        </UrqlProvider>
                    </div>
                </>

            )}

        </div>
    )
}

export default InputFullAddress
