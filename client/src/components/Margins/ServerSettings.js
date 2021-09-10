import React, { Component } from "react";
import { Label, Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

import { sendServerRequest, isJsonResponseValid } from "../../utils/restfulAPI";

import * as configSchema from "../../../schemas/ConfigResponse";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Paper} from "@material-ui/core";

export default class ServerSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputText: this.props.serverSettings.serverPort,
            validServer: null,
            config: {},
        };

        this.saveInputText = this.state.inputText;
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader toggle={() => this.props.toggleOpen()}>Server Connection</ModalHeader>
                    {this.renderSettings(this.getCurrentServerName())}
                    {this.renderActions()}
                </Modal>
            </div>
        );
    }

    renderSettings(currentServerName) {
        return (
            <>
                <ModalBody>
                    <Row className="m-2">
                        <Col>
                            Name: {currentServerName}
                        </Col>
                    </Row>
                    <Row className="m-2">
                        <Col xs={2}>
                            URL:
                        </Col>
                        <Col xs={10}>
                            {this.renderInputField()}
                        </Col>
                    </Row>
                    <Row className="m-2">
                        {this.renderFilters()}
                    </Row>
                </ModalBody>
            </>
        );
    }

    renderInputField() {
        let valid = this.state.validServer === null ? false : this.state.validServer;
        let notValid = this.state.validServer === null ? false : !this.state.validServer;
        return(
            <Input onChange={(e) => this.updateInput(e.target.value)}
                   value={this.state.inputText}
                   placeholder={this.props.serverPort}
                   valid={valid}
                   invalid={notValid}
            />
        );
    }

    renderActions() {
        return (
            <ModalFooter>
                <Button color="primary" onClick={() => this.resetServerSettingsState()}>Cancel</Button>
                <Button color="primary" onClick={() =>
                {
                    this.props.processServerConfigSuccess(this.state.config, this.state.inputText);
                    this.resetServerSettingsState(this.state.inputText);
                }}
                        disabled={!this.state.validServer}
                >
                    Save
                </Button>
            </ModalFooter>
        );
    }

    renderFilters() {
        return (
            <>
                <Row>
                    <Col>
                        <Label>Supported Type Filters: airport, balloonport, heliport</Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label>Supported Where Filters:</Label>
                    </Col>
                    <Col>
                        <Paper style={{maxHeight: '20vh', overflow: 'auto'}}>
                            <List>
                                {this.renderRows()}
                            </List>
                        </Paper>
                    </Col>
                </Row>
            </>
        );
    }

    renderRows() {
        if (this.props.serverSettings.serverConfig.filters) {
            return this.props.serverSettings.serverConfig.filters.where.map((elem, index) => {
                return (
                    <ListItem key={index}>
                        <ListItemText>{elem}</ListItemText>
                    </ListItem>
                );
            });
        }
    }

    getCurrentServerName() {
        let currentServerName = this.props.serverSettings.serverConfig && this.state.validServer === null ?
            this.props.serverSettings.serverConfig.serverName : "";
        if (this.state.config && Object.keys(this.state.config).length > 0) {
            currentServerName = this.state.config.serverName;
        }
        return currentServerName;
    }

    updateInput(value) {
        this.setState({inputText: value}, () => {
            if (this.shouldAttemptConfigRequest(value)) {
                sendServerRequest({requestType: "config", requestVersion: 1}, value)
                    .then(config => {
                        if (config) { this.processConfigResponse(config.data) }
                        else { this.setState({validServer: true, config: config}); }
                    });
            } else {
                this.setState({validServer: false, config: {}});
            }
        });
    }

    shouldAttemptConfigRequest(resource) {
        const urlRegex = /https?:\/\/.+/;
        return resource.match(urlRegex) !== null && resource.length > 15;
    }

    processConfigResponse(config) {
        if(!isJsonResponseValid(config, configSchema)) {
            this.setState({validServer: false, config: false});
        } else {
            this.setState({validServer: true, config: config});
        }
    }

    resetServerSettingsState(inputText=this.saveInputText) {
        this.props.toggleOpen();
        this.setState({
            inputText: inputText,
            validServer: null,
            config: false
        });
    }
}
