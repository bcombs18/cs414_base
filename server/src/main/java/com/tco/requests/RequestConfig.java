package com.tco.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.List;

public class RequestConfig extends RequestHeader {

    private String serverName;
    private List<String> supportedRequests;
    private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);

    public RequestConfig() {
        this.requestType = "config";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    @Override
    public void buildResponse() {

        this.serverName = "t06 - Six-T6";
        supportedRequests = new ArrayList();
        supportedRequests.add("config");
        //Add supported requests here
        log.trace("buildResponse -> {}", this);
    }

    public String getServerName() {
        return serverName;
    }

    public List<String> getSupportedRequests() {
        return supportedRequests;
    }
}
