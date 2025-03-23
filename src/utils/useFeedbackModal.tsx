// useFeedbackModal.tsx
import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export const useFeedbackModal = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");

  const showModal = (msg: string, modalType: "success" | "error") => {
    setMessage(msg);
    setType(modalType);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  // This component can be rendered anywhere in your component tree.
  const ModalComponent = (
    <FeedbackModal visible={visible} message={message} type={type} onClose={hideModal} />
  );

  return { showModal, hideModal, ModalComponent };
};
