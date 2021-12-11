import PlacesAutocomplete from 'react-places-autocomplete'
import Head from "next/head";
import React from "react";

const InputPlaces = props => {
    const handleChange = e => props.setValue(e);
    const handleSelect = e => {
        props.setValue(e);
    }


    return (
        <>
            <Head>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVKjCxMvk5Nymx6VYSlhc4iOasFoTxuCk&libraries=places"/>
            </Head>

            <div className="form-group">
                <label>{props.label}</label>
                <PlacesAutocomplete
                    value={props.value}
                    onChange={handleChange}
                    onSelect={handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <input
                                {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: 'form-control location-search-input',
                                })}
                            />
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </div>

        </>

    )
}

export default InputPlaces