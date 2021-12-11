import InputDefault from "./input-default";
import React, {useState} from "react";
import InputSelect from "./input-select";
import {District, Division, Municipality, Union, Upazila, Village, Ward} from "../urql/locations";
import UrqlProvider from "../urql/urql-provider";

const InputArea = props => {

    const [ division, setDivision ] = useState('');
    const [ district, setDistrict ] = useState('');
    const [ municipals, setMunicipals] = useState('');
    const [ ward, setWard] = useState('');
    const [ upazila, setUpazila] = useState('');
    const [ union, setUnion] = useState('');
    const [ village, setVillage] = useState('');

    const handleDivisionChange = value => {
        setDivision(value);
        setDistrict('');
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            ...props.value,
            division: value
        })
    }
    const handleDistrictChange = value => {
        setDistrict(value);
        setMunicipals('');
        setUpazila('');
        setUnion('');
        setVillage('');
        setWard('');
        props.setValue({
            ...props.value,
            district: value
        })
    }

   const handleUpazilaChange = value => {
       setUpazila(value);
       setUnion('');
       setVillage('');
       setWard('');
       props.setValue({
           ...props.value,
           upazila: value
       })
   }

    const handleUnionChange = value => {
        setUnion(value);
        setVillage('');
        setWard('');
        props.setValue({
            ...props.value,
            union: value
        })
    }


    const handleMunicipalChange = value => {
        setMunicipals(value);
        setWard('');
        props.setValue({
            ...props.value,
            municipal: value
        })
    }

    const handleTypeChange = value => {

    }

    const handleWardChange = value => {
        setWard(value);
        props.setValue({
            ...props.value,
            ward: value
        })
    }

    const handleVillageChange = value => {
        setVillage(value);
        props.setValue({
            ...props.value,
            village: value
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

            { (props.level == 'district' || props.level != 'division') && ( props.level != '' ) && (
                <div className="col-md-4">
                    <UrqlProvider>
                        <District value={district} setValue={handleDistrictChange} divisionId={division}/>
                    </UrqlProvider>
                </div>
            )}


            { props.level != 'district' && props.level != 'division' &&  props.level != ''  && (
                <div className="col-md-4">
                    <InputSelect label="Type" value={props.type} setValue={handleTypeChange} options={typeOptions} disabled={props.typeDisable}/>
                </div>
            )}

            {props.type == 'municipal' && (
                <>
                    {(props.level == 'municipal' || props.level == 'ward') && (
                        <div className="col-md-6">
                            <UrqlProvider>
                                <Municipality value={municipals} setValue={handleMunicipalChange} districtId={district}/>
                            </UrqlProvider>
                        </div>
                    )}

                    {( props.level == 'ward') && (
                        <div className="col-md-6">
                            <UrqlProvider>
                                <Ward value={ward} setValue={handleWardChange} municipalId={municipals}/>
                            </UrqlProvider>
                        </div>
                    )}
                </>
            )}

            {props.type == 'residential' && (
                <>
                    {(props.level == 'upazila' || props.level == 'union' || props.level == 'village' ) && (
                        <div className="col-md-4">
                            <UrqlProvider>
                                <Upazila value={upazila} setValue={handleUpazilaChange} districtId={district}/>
                            </UrqlProvider>
                        </div>
                    )}

                    {( props.level == 'union' || props.level == 'village' ) && (
                        <div className="col-md-4">
                            <UrqlProvider>
                                <Union value={union} setValue={handleUnionChange} upazilaId={upazila}/>
                            </UrqlProvider>
                        </div>
                    )}

                    { props.level == 'village'  && (
                        <div className="col-md-4">
                            <UrqlProvider>
                                <Village value={village} setValue={handleVillageChange} unionId={union}/>
                            </UrqlProvider>
                        </div>
                    )}

                </>

            )}

        </div>
    )
}

export default InputArea
