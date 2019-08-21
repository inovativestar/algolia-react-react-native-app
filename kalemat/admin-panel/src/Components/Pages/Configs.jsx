import React, { Component, Fragment } from 'react'
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    Checkbox,
    Col
} from "react-bootstrap";
import { toast } from 'react-toastify'

import { base } from '../ReBase'
import { List, DataLoadStat, Search } from '../Partials'
import styled from 'styled-components';

export default class Configs extends Component {
    state = {
        isLoading: false,
        countList: 0,
        showLatest: false,
        stopAdd: false,
        stopEdit: false,
    }

    componentDidMount = () => {

        this.setState({ isLoading: true });

        base.fetch(`config`, {
            context: this,
            then(data) {
                console.log("Configs: ", data)
                this.setState({
                    isLoading: false,
                    ...data
                })
            }
        });

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        let configs = {
            ...this.state
        };
        delete configs.isLoading;

        base.post(`config`, {
            data: configs,
            then(err) {
                if (!err) {
                    toast.success('Configs successfully updated!');
                } else {
                    toast.error(err);
                }
            }
        });
    }

    render = () =>
        <Fragment>

            <DataLoadStat dataLoading={this.state.isLoading} dataLength={5} />

            {this.state.isLoading === false && <form>
                <FormGroup
                    controlId="settingForm"
                >
                    <SettingsLabel>Show total items in trends</SettingsLabel>
                    <SettingsInput
                        id="countList"
                        type="number"
                        value={this.state.countList}
                        placeholder="Enter trends count"
                        onChange={this.handleChange}
                    />

                    <Checkbox 
                        checked={this.state.showLatest}
                        onChange={(e) => {
                            const status = e.nativeEvent.target.checked;
                            this.setState({ showLatest: status})
                        }}
                    >
                        showLatest
                    </Checkbox>

                    <Checkbox 
                        checked={this.state.stopAdd}
                        onChange={(e) => {
                            const status = e.nativeEvent.target.checked;
                            this.setState({ stopAdd: status})
                        }}
                    >
                        stopAdd
                    </Checkbox>

                    <Checkbox 
                        checked={this.state.stopEdit}
                        onChange={(e) => {
                            const status = e.nativeEvent.target.checked;
                            this.setState({ stopEdit: status})
                        }}
                    >
                        stopEdit
                    </Checkbox>


                    <SaveButton onClick={this.handleConfirmationSubmit} type="submit">Save</SaveButton>
                </FormGroup>
            </form>}

        </Fragment>
}


const SaveButton = styled(Button)`
        margin-top: 30px;
        height: 40px;

        border-radius: 4px;
        border: none;

        color: #fff;
        background: #3D5AFE;
        box-shadow: 3px 2px 5px rgba(0,0,0,.3);
        outline: none;
        cursor: pointer;
    `;

const SettingsLabel = styled(ControlLabel)`
        margin-top: 20px;
    `;

const SettingsInput = styled(FormControl)`
        outline: none;
`;
