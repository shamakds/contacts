import ReactDOM from "react-dom";
import React from "react";
import App from "./src/app";

function ready() {
    const content = document.getElementById("z-app-container");

    ReactDOM.render(
        <App id="z-app" />,
        content
    );
}

document.addEventListener("DOMContentLoaded", ready);
