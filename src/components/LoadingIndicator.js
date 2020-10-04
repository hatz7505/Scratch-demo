import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./LoadingIndicator.css";

export default function LoadingIndicator() {
  return (
    <div className="LoadingIndicator">
      <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
    </div>
  );
}
