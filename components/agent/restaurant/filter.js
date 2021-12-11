import React, {useState} from "react";
import UrqlProvider from "../../urql/urql-provider";
import {District, Division, Municipality, Union, Upazila, Village, Ward} from "../../urql/locations";
import InputSelect from "../../input/input-select";

const RestaurantFilter = props => {

    let level = props.agent.agent_level
    let initialType = '';
    if( level == 'municipal' || level == 'ward' ) {
        initialType = 'municipal'
    }
    if( level == 'upazila' || level == 'union' || level == 'village' ) {
        initialType = 'residential'
    }


    const [ division, setDivision ] = useState(props.agent.division);
    const [ district, setDistrict ] = useState(props.agent.district);
    const [ type, setType ] = useState(initialType);
    const [ municipals, setMunicipals] = useState(props.agent.municipal);
    const [ ward, setWard] = useState(props.agent.ward);
    const [ upazila, setUpazila] = useState(props.agent.upazila);
    const [ union, setUnion] = useState(props.agent.union);
    const [ village, setVillage] = useState(props.agent.village);



    const handleDivisionChange = value => {
        setDivision(value);
        setDistrict('');
        setType('');
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            division: value,
            district: '',
            municipal: '',
            ward: '',
            upazila: '',
            union: '',
            village: ''
        })
    }
    const handleDistrictChange = value => {
        setDistrict(value);
        setType('');
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            division: division,
            district: value,
            municipal: '',
            ward: '',
            upazila: '',
            union: '',
            village: ''
        })
    }

    const handleMunicipalChange = value => {
        setMunicipals(value);
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            division: division,
            district: district,
            municipal: value,
            ward: '',
            upazila: '',
            union: '',
            village: ''
        })
    }


    const handleWardChange = value => {
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard(value);
        props.setValue({
            division: division,
            district: district,
            municipal: municipals,
            ward: value,
            upazila: '',
            union: '',
            village: ''
        })
    }

    const handleUpazilaChange = value => {
        setMunicipals('');
        setUpazila(value);
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            division: division,
            district: district,
            municipal: '',
            ward: '',
            upazila: value,
            union: '',
            village: ''
        })
    }

    const handleUnionChange = value => {
        setMunicipals('');
        setUnion(value);
        setVillage('');
        setWard('');
        props.setValue({
            division: division,
            district: district,
            municipal: '',
            ward: '',
            upazila: upazila,
            union: value,
            village: ''
        })
    }

    const handleVillageChange = value => {
        setMunicipals('');
        setVillage(value);
        setWard('');
        props.setValue({
            division: division,
            district: district,
            municipal: '',
            ward: '',
            upazila: upazila,
            union: union,
            village: value
        })
    }


    const handleTypeChange = value => {
        setType(value);
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            division: division,
            district: district,
            municipal: '',
            ward: '',
            upazila: '',
            union: '',
            village: ''
        })
    }








    let typeOptions = [
        {text: 'উপজেলা', value: 'residential', key: 'residential'},
        {text: 'পৌরসভা', value: 'municipal', key: 'municipal'}
    ]




    return (
        <div className="row">
            {type == '' && (
                <div className="col-md-6"></div>
            )}
            {type == 'municipal' && (
                <div className="col-md-2"></div>
            )}
            <div className="col-md-2">
                <UrqlProvider>
                    <Division value={division} setValue={handleDivisionChange} disabled/>
                </UrqlProvider>
            </div>
            <div className="col-md-2">
                <UrqlProvider>
                    <District value={district} setValue={handleDistrictChange} divisionId={division} disabled={ level == 'district' || level == 'municipal' || level == 'ward' ||   level == 'upazila' ||  level == 'union'  || level == 'village'}/>
                </UrqlProvider>
            </div>
            <div className="col-md-2">
                <InputSelect label="Type" value={type} setValue={handleTypeChange} options={typeOptions} disabled={ level == 'municipal' || level == 'ward' ||   level == 'upazila' ||  level == 'union'  || level == 'village'}/>
            </div>

            {type == 'municipal' && (
                <>
                    <div className="col-md-2">
                        <UrqlProvider>
                            <Municipality value={municipals} setValue={handleMunicipalChange} districtId={district} disabled={ level == 'municipal' || level == 'ward' }/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-2">
                        <UrqlProvider>
                            <Ward value={ward} setValue={handleWardChange} municipalId={municipals} disabled={ level == 'ward' }/>
                        </UrqlProvider>
                    </div>
                </>


            )}

            {type == 'residential' && (
                <>
                    <div className="col-md-2">
                        <UrqlProvider>
                            <Upazila value={upazila} setValue={handleUpazilaChange} districtId={district} disabled={ level == 'upazila' ||  level == 'union'  || level == 'village'}/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-2">
                        <UrqlProvider>
                            <Union value={union} setValue={handleUnionChange} upazilaId={upazila} disabled={ level == 'union'  || level == 'village'}/>
                        </UrqlProvider>
                    </div>
                    <div className="col-md-2">
                        <UrqlProvider>
                            <Village value={village} setValue={handleVillageChange} unionId={union} disabled={ level == 'village' } hasAll/>
                        </UrqlProvider>
                    </div>
                </>

            )}

        </div>
    )
}

export default RestaurantFilter
